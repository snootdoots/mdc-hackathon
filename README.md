# Survive the Semester

Turn your syllabi into a survival plan — see deadlines, danger zones, and study sprints in one dashboard.

## Setup

```bash
npm install
```

### AI parsing (optional)

For better extraction of assignments and deadlines, add your OpenAI API key:

1. Copy `.env.example` to `.env`
2. Add your key: `OPENAI_API_KEY=sk-your-key-here`

Without a key, the app uses rule-based heuristics.

## Run

```bash
npm start
```

Open http://localhost:3000

## Usage

1. Upload one or more syllabus PDFs or DOCX files
2. Click **Parse & generate plan**
3. View your survival score, heatmap, and timeline
4. Use **AI Schedule Optimizer** to see a flattened schedule
5. Export to calendar (.ics)
