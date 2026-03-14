# Setup Instructions

## Python Dependencies (for PyMuPDF PDF parsing)

The PDF parser uses PyMuPDF for better text extraction. Install the required Python package:

```bash
pip3 install -r requirements.txt
```

Or install directly:
```bash
pip3 install PyMuPDF
```

## Node.js Dependencies

Already installed via `package.json`. If needed:

```bash
npm install
```

## Starting the Server

```bash
# Set API key and start
GEMINI_API_KEY=your_api_key_here npm start

# Or create a .env file with:
# GEMINI_API_KEY=your_api_key_here
# PORT=3000
```

## How It Works

1. **PDF Parsing**: The server tries PyMuPDF first (better quality), falls back to `pdf-parse` if Python/PyMuPDF is not available
2. **DOCX Parsing**: Uses `mammoth` library
3. **TXT Parsing**: Direct text extraction
4. **AI Parsing**: Uses Gemini API if `GEMINI_API_KEY` is set, otherwise uses heuristics

## Testing

1. Start the server
2. Open http://localhost:3000
3. Upload a PDF, DOCX, or TXT syllabus file
4. The system will extract text and parse assignments/deadlines

