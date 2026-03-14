require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const OpenAI = require('openai').default;

const app = express();
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

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
        const data = await pdfParse(file.buffer);
        text = data.text;
      } catch (e) {
        console.error('PDF parse error:', e);
        text = 'Failed to extract PDF text';
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
    if (openai) {
      try {
        items = await parseSyllabusWithAI(text, courseHint);
      } catch (aiErr) {
        console.warn('AI parse failed, falling back to heuristics:', aiErr.message);
        items = parseSyllabusText(text, courseHint);
      }
    } else {
      items = parseSyllabusText(text, courseHint);
    }
    
    res.json({ success: true, items, parsedWith: openai ? 'ai' : 'heuristics' });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Failed to process file', details: error.message });
  }
});

// AI parsing with OpenAI
const ITEM_COLORS = ['#378ADD', '#D85A30', '#1D9E75', '#0066CC', '#CC6600'];

async function parseSyllabusWithAI(text, courseHint) {
  const truncated = text.length > 12000 ? text.slice(0, 12000) + '\n...[truncated]' : text;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a syllabus parser. Extract all assignments, exams, papers, quizzes, projects, and deadlines from the syllabus text.
Return a JSON object with an "items" array. Each item must have:
- week: number (1-16, the week of the semester when it's due)
- course: string (use "${courseHint}" or infer from syllabus)
- title: string (short descriptive title, max 60 chars)
- sub: array of 2-4 strings (actionable study subtasks)

Infer weeks from: "Week N", "due Week N", calendar dates (map to semester weeks 1-16), "midterm" (often week 7-8), "final" (week 15-16).
For dates like "Oct 15", assume a typical 16-week fall semester (Sept–Dec) and estimate the week.
If week is unclear, use a reasonable estimate. Be thorough—extract every assignment, quiz, exam, paper, project, lab, etc.
Respond ONLY with valid JSON, no other text.`,
      },
      {
        role: 'user',
        content: `Parse this syllabus and extract all deadlines/assignments:\n\n${truncated}`,
      },
    ],
    temperature: 0.2,
  });

  const content = response.choices[0]?.message?.content?.trim() || '{}';
  const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, ''));
  const raw = Array.isArray(parsed.items) ? parsed.items : parsed;

  return raw.map((item, i) => ({
    week: Math.max(1, Math.min(16, parseInt(item.week, 10) || 8)),
    color: ITEM_COLORS[i % ITEM_COLORS.length],
    course: String(item.course || courseHint).slice(0, 30),
    title: String(item.title || 'Assignment').slice(0, 60),
    sub: Array.isArray(item.sub) ? item.sub.slice(0, 4) : ['Review materials', 'Complete and submit'],
  }));
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
