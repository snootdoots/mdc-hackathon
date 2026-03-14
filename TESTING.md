# Testing Guide

## Flow Verification

✅ **The complete flow is implemented:**

1. **File Upload** → User uploads PDF/DOCX/TXT file
2. **PDF Parsing** → PyMuPDF (Python) or pdf-parse (Node.js fallback) extracts text
3. **Text Extraction** → Raw text from file
4. **LLM Call** → Gemini API called with prompt to extract assignments
5. **JSON Generation** → LLM returns structured JSON with items (week, course, title, sub)
6. **Frontend Display** → JSON rendered as timeline, heatmap, and dashboard

## Manual Testing Steps

### 1. Start the Server

```bash
cd /Users/davidren/eecs/mdc-w26-hackathon
GEMINI_API_KEY=AIzaSyCrsalB54KQKI3A17ZK98IPSHZjQNZ5hdc npm start
```

### 2. Open Browser

Go to: `http://localhost:3000`

### 3. Test File Upload

1. Click "Upload Your Syllabi"
2. Select `test_syllabus.txt` (or any PDF/DOCX/TXT file)
3. Watch the loading screen
4. Check the dashboard appears with:
   - Timeline items
   - Heatmap
   - Survival score
   - Conflict warnings

### 4. Verify Flow in Browser Console

Open DevTools (F12) → Console tab, and you should see:
- File upload progress
- API response with `parsedWith: 'ai'` or `'heuristics'`
- Items array with structure: `{week, course, title, sub, color}`

### 5. Check Server Logs

In the terminal running the server, you should see:
- "Triage request received" (if using AI features)
- "Calling Gemini API for triage..."
- "Gemini API response received"
- Any parsing errors

## Expected JSON Structure

```json
{
  "success": true,
  "items": [
    {
      "week": 1,
      "course": "CS 280",
      "title": "Assignment 1",
      "sub": ["Review materials", "Complete assignment", "Submit on time"],
      "color": "#378ADD"
    },
    ...
  ],
  "parsedWith": "ai"
}
```

## Testing Different Scenarios

### Test with AI (GEMINI_API_KEY set)
- Should use `parseSyllabusWithAI()` → Gemini API call
- Returns `parsedWith: 'ai'`
- Items have structured subtasks from LLM

### Test without AI (no GEMINI_API_KEY)
- Should use `parseSyllabusText()` → Heuristic parsing
- Returns `parsedWith: 'heuristics'`
- Items have generic subtasks

### Test PDF Parsing
- With PyMuPDF installed: Uses Python script
- Without PyMuPDF: Falls back to pdf-parse (Node.js)
- Both should extract text successfully

## Quick Test Command

```bash
# Test the API directly with curl
curl -X POST http://localhost:3000/api/parse-syllabus \
  -F "file=@test_syllabus.txt" | jq
```

## Troubleshooting

- **"Failed to connect"**: Server not running
- **"parsedWith: 'heuristics'"**: GEMINI_API_KEY not set or AI call failed
- **Empty items**: File parsing failed, check server logs
- **PyMuPDF errors**: Install with `pip3 install PyMuPDF`

