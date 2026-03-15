require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const pdfParse = require('pdf-parse'); // Fallback
const mammoth = require('mammoth');

const app = express();
// Prevent EPIPE crashes when client disconnects before response is sent
process.on('uncaughtException', (err) => {
  if (err.code === 'EPIPE') return; // client disconnected — ignore
  console.error('Uncaught exception:', err);
  process.exit(1);
});

const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (key && key !== 'sk-your-key-here') {
    return key;
  }
  return null;
};

// Helper function to call Gemini API
async function callGeminiAPI(prompt, config = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not set');
  }

  const model = config.model || 'gemini-flash-latest';
  const temperature = config.temperature !== undefined ? config.temperature : 0.7;
  const responseMimeType = config.responseMimeType || 'text/plain';

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };
  
  // Add generationConfig only if we have config options
  if (temperature !== 0.7 || responseMimeType === 'application/json') {
    requestBody.generationConfig = {
      temperature: temperature
    };
    if (responseMimeType === 'application/json') {
      requestBody.generationConfig.responseMimeType = 'application/json';
    }
  }

  console.log('Making Gemini API request to:', url);
  console.log('Request body:', JSON.stringify(requestBody, null, 2));
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey
    },
    body: JSON.stringify(requestBody)
  });

  console.log('Response status:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error response:', errorText);
    throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  
  // Extract text from response
  if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
    const text = data.candidates[0].content.parts[0].text || '';
    return { text };
  }
  
  // Check for errors in response
  if (data.error) {
    throw new Error(`Gemini API error: ${data.error.message || JSON.stringify(data.error)}`);
  }
  
  // Log the actual response for debugging
  console.error('Unexpected Gemini API response format:', JSON.stringify(data, null, 2));
  throw new Error('Unexpected response format from Gemini API');
}

// Helper function to parse PDF using PyMuPDF (Python)
async function parsePdfWithPyMuPDF(buffer) {
  return new Promise((resolve, reject) => {
    try {
      // Convert buffer to base64
      const base64Data = buffer.toString('base64');
      
      // Prepare input JSON
      const inputData = JSON.stringify({ pdf_data: base64Data });
      
      // Get the path to the Python script
      const scriptPath = path.join(__dirname, 'pdf_parser.py');
      
      // Spawn Python process
      const python = spawn('python3', [scriptPath]);
      
      let stdout = '';
      let stderr = '';
      
      // Collect stdout
      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      // Collect stderr
      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      // Handle process completion
      python.on('close', (code) => {
        if (code !== 0) {
          console.warn('PyMuPDF script exited with code:', code);
          if (stderr && !stderr.includes('WARNING')) {
            console.warn('PyMuPDF stderr:', stderr);
          }
          reject(new Error(`Python script exited with code ${code}: ${stderr}`));
          return;
        }
        
        try {
          // Parse JSON response
          const result = JSON.parse(stdout.trim());
          
          if (result.success) {
            resolve(result.text);
          } else {
            reject(new Error(result.error || 'PyMuPDF parsing failed'));
          }
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      });
      
      // Handle errors
      python.on('error', (error) => {
        if (error.code === 'ENOENT') {
          reject(new Error('Python3 not found. Please install Python 3 and PyMuPDF.'));
        } else {
          reject(error);
        }
      });
      
      // Send input data to Python script
      python.stdin.write(inputData);
      python.stdin.end();
      
    } catch (error) {
      reject(error);
    }
  });
}

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.use((req, res, next) => {
  res.on('error', (err) => {
    if (err.code === 'EPIPE') return; // client disconnected — ignore
    console.error('Response error:', err);
  });
  next();
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'syllabus_survival_dashboard.html'));
});

// API endpoint to parse syllabus
app.post('/api/parse-syllabus', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const ext = path.extname(file.originalname).toLowerCase();
    
    let text = '';

    if (ext === '.pdf') {
      try {
        // Try PyMuPDF first (better parsing)
        text = await parsePdfWithPyMuPDF(file.buffer);
        if (!text || text.trim().length === 0) {
          // Fallback to pdf-parse if PyMuPDF returns empty
          console.log('PyMuPDF returned empty, trying pdf-parse fallback...');
          const data = await pdfParse(file.buffer);
          text = data.text;
        }
      } catch (e) {
        console.error('PDF parse error:', e);
        // Try fallback to pdf-parse
        try {
          console.log('Trying pdf-parse fallback...');
          const data = await pdfParse(file.buffer);
          text = data.text;
        } catch (fallbackErr) {
          console.error('PDF parse fallback also failed:', fallbackErr);
          text = 'Failed to extract PDF text';
        }
      }
    } else if (ext === '.docx') {
      try {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        text = result.value;
      } catch (e) {
        console.error('DOCX parse error:', e);
        text = 'Failed to extract DOCX text';
      }
    } else if (ext === '.txt') {
      text = file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Use PDF, DOCX, or TXT.' });
    }

    // Parse: use AI if API key is set, else heuristics
    const courseHint = deriveCourseFromFilename(file.originalname);
    let items;
    let parsedWith = 'heuristics';
    const apiKey = getApiKey();
    if (apiKey) {
      try {
        items = await parseSyllabusWithAI(text, courseHint, file.originalname);
        parsedWith = 'ai';
      } catch (aiErr) {
        console.warn('AI parse failed, falling back to heuristics:', aiErr.message);
        items = parseSyllabusText(text, courseHint);
        parsedWith = 'heuristics';
      }
    } else {
      items = parseSyllabusText(text, courseHint);
      parsedWith = 'heuristics';
    }
    
    res.json({ success: true, items, parsedWith });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Failed to process file', details: error.message });
  }
});

// AI parsing with Gemini
// Note: Colors and weeks are now generated by LLM, not hardcoded

async function parseSyllabusWithAI(text, courseHint, filename) {
  const truncated = text.length > 25000 ? text.slice(0, 25000) + '\n...[truncated]' : text;

  const prompt = `You are a syllabus parser. Extract all assignments, exams, papers, quizzes, projects, and deadlines from the syllabus text below.
Return a JSON object with an "items" array. Each item must have:
- week: number (1-16, the week of the semester when it's due - use the actual week from the syllabus, do not default to 8)
- color: string (hex color code like "#378ADD", "#D85A30", "#1D9E75", "#0066CC", or "#CC6600" - assign different colors to different items)
- course: string (use "${courseHint}" or infer from syllabus)
- title: string (short descriptive title, max 60 chars)
- sub: array of 2-4 strings (actionable study subtasks)

IMPORTANT:
- Use the ACTUAL week numbers from the syllabus text. Do not default to 8 or any other number.
- Assign unique colors to items (use hex codes from: #378ADD, #D85A30, #1D9E75, #0066CC, #CC6600, or similar colors)
- Infer weeks from: "Week N", "due Week N", calendar dates (map to semester weeks 1-16), "midterm" (often week 7-8), "final" (week 15-16).
- For dates like "Oct 15", assume a typical 16-week fall semester (Sept–Dec) and estimate the week.
- If week is unclear, use a reasonable estimate based on context. Be thorough—extract every assignment, quiz, exam, paper, project, lab, etc.
Respond ONLY with valid JSON, no other text.

--- SYLLABUS TEXT ---
${truncated}`;

  const response = await callGeminiAPI(prompt, {
    model: 'gemini-flash-latest',
    temperature: 0.2,
    responseMimeType: 'application/json'
  });

  const content = response.text || '{}';
  const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, ''));
  const raw = Array.isArray(parsed.items) ? parsed.items : parsed;

  // Use LLM-generated values, only validate/sanitize (don't override)
  const items = raw.map((item, i) => {
    // Use LLM-generated week, only clamp if absolutely necessary (out of bounds)
    let week = parseInt(item.week, 10);
    if (isNaN(week) || week < 1) week = Math.max(1, Math.min(16, i + 3)); // Only fallback if invalid
    else if (week > 16) week = 16; // Clamp to max
    
    // Use LLM-generated color, validate it's a hex color
    let color = String(item.color || '').trim();
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
      // Fallback to a color palette if invalid
      const fallbackColors = ['#378ADD', '#D85A30', '#1D9E75', '#0066CC', '#CC6600'];
      color = fallbackColors[i % fallbackColors.length];
    }
    
    return {
      week: week,
      color: color,
      course: String(item.course || courseHint).slice(0, 30),
      title: String(item.title || 'Assignment').slice(0, 60),
      sub: Array.isArray(item.sub) ? item.sub.slice(0, 4) : ['Review materials', 'Complete and submit'],
    };
  });

  // Save LLM-generated data to JSON file
  try {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeFilename = (filename || 'parsed').replace(/[^a-zA-Z0-9]/g, '_');
    const jsonPath = path.join(dataDir, `llm_parsed_${safeFilename}_${timestamp}.json`);
    
    const saveData = {
      source: filename || 'unknown',
      parsedAt: new Date().toISOString(),
      courseHint: courseHint,
      items: items
    };
    
    fs.writeFileSync(jsonPath, JSON.stringify(saveData, null, 2));
    console.log(`Saved LLM-parsed data to: ${jsonPath}`);
  } catch (saveError) {
    console.error('Failed to save LLM-parsed data:', saveError);
    // Don't fail the request if saving fails
  }

  return items;
}

// Helper: Derive course name from filename
function deriveCourseFromFilename(filename) {
  const match = filename.match(/^([A-Z]+\d{3})/);
  if (match) {
    const code = match[1];
    const courseMap = {
      'CS280': 'CS 280',
      'EECS280': 'EECS 280',
      'MATH115': 'MATH 115',
      'CHEM210': 'CHEM 210',
      'STATS301': 'STATS 301',
      'STATS430': 'STATS 430',
      'HIST215': 'HIST 215',
    };
    return courseMap[code] || code;
  }
  return 'Course';
}

// AI Optimization Endpoint
app.post('/api/optimize-schedule', async (req, res) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return res.status(503).json({ error: 'AI features require GEMINI_API_KEY' });
    }
    
    const { timeline } = req.body;
    if (!timeline || !Array.isArray(timeline)) {
      return res.status(400).json({ error: 'Invalid timeline data provided' });
    }
    
    const prompt = `You are a schedule optimization AI for college students. 
You will receive a JSON list of assignments (timeline). 
Your task is to return a new timeline where tasks are spaced out to avoid "crunch" weeks (weeks with 3+ major assignments). 
Move starting/subtasks for major projects and exams to earlier weeks. Do NOT change the final deadline week for an item, but DO create new "prep" or "draft" milestones in earlier weeks.
Return a valid JSON array of objects with keys: { week: number, color: string, course: string, title: string, sub: [string, string] }
Respond ONLY with valid JSON. Do not include markdown formatting.

--- TIMELINE ---
${JSON.stringify(timeline, null, 2)}`;

    const response = await callGeminiAPI(prompt, {
      model: 'gemini-flash-latest',
      temperature: 0.3,
      responseMimeType: 'application/json'
    });
    
    const content = response.text || '[]';
    let optimizedTimeline = [];
    try {
       optimizedTimeline = JSON.parse(content.replace(/```json\n?|\n?```/g, ''));
    } catch(e) {
       console.error("Failed to parse AI optimizer response", content);
       return res.status(500).json({ error: "Failed to parse AI optimization response" });
    }
    
    res.json({ success: true, optimizedTimeline });
  } catch (error) {
    console.error('Error optimizing schedule:', error);
    res.status(500).json({ error: 'Failed to optimize schedule', details: error.message });
  }
});

// AI Triage Endpoint
app.post('/api/triage-conflict', async (req, res) => {
  try {
    console.log('Triage request received');
    const apiKey = getApiKey();
    if (!apiKey) {
      console.error('GEMINI_API_KEY not set');
      return res.status(503).json({ error: 'AI features require GEMINI_API_KEY' });
    }
    
    const { conflictContext } = req.body;
    if (!conflictContext) {
      console.error('Conflict context missing from request');
      return res.status(400).json({ error: 'Conflict context missing' });
    }
    
    console.log('Calling Gemini API for triage...');
    const prompt = `You are an AI Triage assistant for a college student schedule planner. 
You receive a text description of a scheduling conflict (e.g. "Week 8 — Triple collision: CS Midterm + History 10-page paper...").
Your goal is to provide a ruthless, pragmatic survival strategy.
Return a valid JSON object with the following keys:
- situation: A brief summary of the collision (1 sentence).
- administrative: Real-talk about administrative options (e.g. extensions, dropping, policy limits).
- strategy: A brutal, time-blocking tactical plan to survive the week without failing.
Respond ONLY with valid JSON. Do not include markdown.

--- CONFLICT CONTEXT ---
${conflictContext}`;

    const response = await callGeminiAPI(prompt, {
      model: 'gemini-flash-latest',
      temperature: 0.5,
      responseMimeType: 'application/json'
    });
    
    console.log('Gemini API response received');
    const content = response.text || '{}';
    let triagePlan = {};
    try {
      triagePlan = JSON.parse(content.replace(/```json\n?|\n?```/g, ''));
      console.log('Triage plan parsed successfully');
    } catch(e) {
       console.error("Failed to parse AI triage response", content);
       return res.status(500).json({ error: "Failed to parse AI triage response", details: e.message });
    }
    
    res.json({ success: true, triagePlan });
  } catch (error) {
    console.error('Error triaging conflict:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to triage conflict', details: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined });
  }
});

// Helper: Parse syllabus text into timeline structure
function parseSyllabusText(text, courseHint) {
  const items = [];
  const seen = new Set();
  const colors = ['#378ADD', '#D85A30', '#1D9E75', '#0066CC', '#CC6600'];
  const course = courseHint || 'Course';

  const assignmentPatterns = [
    /\b(midterm|final)\s*(exam|test)?/gi,
    /\b(quiz|quizzes)\s*(\d+)?/gi,
    /\b(homework|hw|problem\s*set|ps|pset)\s*(\d+)?/gi,
    /\b(paper|essay|report|project)\s*(?:due|submission)?/gi,
    /\b(lab\s*report|assignment)\s*(\d+)?/gi,
    /\b(discussion|reading)\s*(?:due|response)?/gi,
    /\b(presentation|milestone)/gi,
  ];

  const addItem = (week, rawTitle) => {
    const title = rawTitle.replace(/\s+/g, ' ').trim().slice(0, 60);
    const key = `${week}-${title.slice(0, 30)}`;
    if (seen.has(key)) return;
    seen.add(key);
    items.push({
      week: Math.max(1, Math.min(16, week)),
      color: colors[items.length % colors.length],
      course,
      title: title.length > 50 ? title.slice(0, 47) + '…' : title,
      sub: ['Review materials', 'Complete assignment', 'Submit on time'],
    });
  };

  const blocks = text.split(/\n\n+|\r\n\r\n+/);
  for (const block of blocks) {
    const lines = block.split(/\n/).map(l => l.trim()).filter(l => l.length > 8);
    for (const line of lines) {
      const weekMatch = line.match(/(?:week|wk\.?)\s*(\d{1,2})/gi);
      const weeks = weekMatch
        ? [...new Set(weekMatch.map(m => parseInt(m.replace(/\D/g, ''), 10)).filter(n => n >= 1 && n <= 16))]
        : [];
      const week = weeks[0];

      for (const pat of assignmentPatterns) {
        if (new RegExp(pat.source, 'i').test(line)) {
          const w = week || (items.length < 4 ? 3 + items.length : Math.min(14, 5 + items.length));
          addItem(w, line);
          break;
        }
      }
      if (!week && /\bdue\b|\bdeadline\b|\bsubmit\b|\d{1,2}\/\d{1,2}/i.test(line) && line.length > 12) {
        addItem(Math.min(14, 4 + items.length), line);
      }
    }
  }

  if (items.length === 0) {
    items.push({
      week: 5,
      color: colors[0],
      course,
      title: 'Review course materials',
      sub: ['Read syllabus', 'Attend orientation', 'Understand requirements'],
    });
  }

  return items;
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Serving: ${__dirname}`);
});
