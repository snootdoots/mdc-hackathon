// ── DATA ──

const COURSES = [
  { id: 'cs', label: 'CS 280', color: '#378ADD' },
  { id: 'hist', label: 'HIST 215', color: '#D85A30' },
  { id: 'stats', label: 'STATS 301', color: '#1D9E75' },
];

// Raw heatmap data (0-10 stress scale, 16 weeks)
const RAW_WEEKS = [1, 1, 2, 2, 3, 4, 6, 10, 3, 4, 8, 5, 4, 9, 3, 5];
// Optimized (flattened) heatmap data
const OPT_WEEKS = [2, 2, 3, 3, 4, 4, 5, 5, 5, 4, 5, 4, 4, 5, 4, 5];

const TL_RAW = [
  { week: 2, color: '#378ADD', course: 'CS 280', title: 'HW 1 — Sorting algorithms', sub: ['Review lecture notes (W1)', 'Complete problems 1-3', 'Write up solutions'] },
  { week: 3, color: '#1D9E75', course: 'STATS 301', title: 'Problem Set 1', sub: ['Read ch. 2-3', 'Work through examples', 'Type up PS'] },
  { week: 4, color: '#D85A30', course: 'HIST 215', title: 'Reading quiz — WWI causes', sub: ['Read MacMillan ch. 4-5', 'Take practice quiz'] },
  { week: 5, color: '#378ADD', course: 'CS 280', title: 'HW 2 — Dynamic programming', sub: ['Review DP slides', 'Attempt problems 1-4', 'Debug solutions'] },
  { week: 6, color: '#1D9E75', course: 'STATS 301', title: 'Problem Set 2 — Regression', sub: ['Read ch. 5', 'Run R examples', 'Write up'] },
  { week: 7, color: '#D85A30', course: 'HIST 215', title: 'Short paper — Versailles Treaty', sub: ['Outline by W6 Mon', 'Draft by W6 Wed', 'Revise & submit'] },
  { week: 8, color: '#378ADD', course: 'CS 280', title: '⚠ MIDTERM EXAM', sub: ['Study sessions W7', 'Review HW 1-2', 'Practice past exams'] },
  { week: 8, color: '#D85A30', course: 'HIST 215', title: '⚠ 10-page Research Paper DUE', sub: ['Outline W6', 'Draft W7 Mon', 'Final revision W7 Thu'] },
  { week: 8, color: '#1D9E75', course: 'STATS 301', title: '⚠ Problem Set 4 — ANOVA', sub: ['Read ch. 8', 'Complete PS W7'] },
  { week: 10, color: '#378ADD', course: 'CS 280', title: 'HW 3 — Graph algorithms', sub: ['Review BFS/DFS', 'Implement in code', 'Test edge cases'] },
  { week: 11, color: '#D85A30', course: 'HIST 215', title: 'Lit review due', sub: ['Gather 8 sources', 'Write annotations', 'Draft review'] },
  { week: 11, color: '#378ADD', course: 'CS 280', title: 'Group project milestone', sub: ['Sync with team', 'Submit progress doc'] },
  { week: 13, color: '#1D9E75', course: 'STATS 301', title: 'Problem Set 6 — Time series', sub: ['Read ch. 12', 'Code examples in R'] },
  { week: 14, color: '#378ADD', course: 'CS 280', title: '⚠ Final project DUE', sub: ['Full draft W13', 'Code review W13', 'Final polish W14'] },
  { week: 14, color: '#1D9E75', course: 'STATS 301', title: '⚠ FINAL EXAM', sub: ['Review all PS', 'Study sessions W13', 'Practice problems'] },
  { week: 15, color: '#D85A30', course: 'HIST 215', title: 'Final essay — 15 pages', sub: ['Outline W13', 'Draft W14', 'Revise & submit W15'] },
];

const TL_OPT = [
  { week: 2, color: '#378ADD', course: 'CS 280', title: 'HW 1 — Sorting algorithms', sub: ['Review lecture notes', 'Spread across 3 sessions', 'Submit'] },
  { week: 3, color: '#1D9E75', course: 'STATS 301', title: 'Problem Set 1', sub: ['2 sessions this week', 'Type up solutions'] },
  { week: 4, color: '#D85A30', course: 'HIST 215', title: 'Reading quiz — WWI causes', sub: ['Read + practice quiz'] },
  { week: 5, color: '#D85A30', course: 'HIST 215', title: 'Begin research paper outline early', sub: ['Start sources now', 'Outline draft'] },
  { week: 6, color: '#378ADD', course: 'CS 280', title: 'HW 2 — Dynamic programming', sub: ['Start W5 Thu (avoid W8 crunch)', 'Debug early'] },
  { week: 6, color: '#1D9E75', course: 'STATS 301', title: 'Problem Set 2 — start early', sub: ['Read ch. 5 over weekend', 'Begin problems W6 Mon'] },
  { week: 7, color: '#D85A30', course: 'HIST 215', title: 'Research paper DRAFT DUE (moved earlier)', sub: ['Complete W7 Mon', 'Revise by Wed'] },
  { week: 7, color: '#1D9E75', course: 'STATS 301', title: 'Problem Set 3 (moved up from W8)', sub: ['Smooth the W8 crunch', 'Submit W7 Fri'] },
  { week: 8, color: '#378ADD', course: 'CS 280', title: 'MIDTERM EXAM', sub: ['Focused prep — other work shifted out'] },
  { week: 9, color: '#D85A30', course: 'HIST 215', title: 'Research paper revisions', sub: ['Polish & submit final version'] },
  { week: 10, color: '#378ADD', course: 'CS 280', title: 'HW 3 — Graph algorithms', sub: ['Start W9 Thu', 'Test edge cases W10'] },
  { week: 11, color: '#D85A30', course: 'HIST 215', title: 'Lit review + project milestone', sub: ['Split work evenly this week'] },
  { week: 12, color: '#1D9E75', course: 'STATS 301', title: 'Problem Set 5 + 6 spread', sub: ['One per week (not both W13)'] },
  { week: 13, color: '#378ADD', course: 'CS 280', title: 'Final project — draft milestone', sub: ['Code review session', 'Submit progress'] },
  { week: 14, color: '#1D9E75', course: 'STATS 301', title: 'FINAL EXAM PREP (started earlier)', sub: ['2 weeks of review instead of 1'] },
  { week: 15, color: '#D85A30', course: 'HIST 215', title: 'Final essay — spread drafting', sub: ['Outline W13', 'Draft W14', 'Polish W15'] },
];

// UMich LSA Risk Profile Data
const UMICH_LSA_WEEKS = [2, 2, 3, 3, 4, 5, 7, 9, 6, 5, 8, 6, 5, 7, 4, 6];

const UMICH_LSA_TL_RAW = [
  { week: 2, color: '#0066CC', course: 'MATH 115', title: 'Problem Set 1 — Limits & Continuity', sub: ['Read sections 2.1-2.3', 'Complete odd problems', 'Review limits concept'] },
  { week: 3, color: '#CC6600', course: 'CHEM 210', title: 'Lab Report 1 — Experimental Design', sub: ['Collect data', 'Write procedure section', 'Analyze results'] },
  { week: 4, color: '#0066CC', course: 'MATH 115', title: 'Quiz 1 — Derivatives', sub: ['Review derivative rules', 'Practice problems 3.1-3.8', 'Attend review session'] },
  { week: 5, color: '#CC6600', course: 'CHEM 210', title: 'Problem Set 2 — Thermodynamics', sub: ['Read ch. 5-6', 'Calculate enthalpy changes', 'Complete worksheet'] },
  { week: 6, color: '#0066CC', course: 'MATH 115', title: 'Problem Set 3 — Integration', sub: ['Work through examples', 'Solve practice problems', 'Prepare for discussion'] },
  { week: 7, color: '#CC6600', course: 'CHEM 210', title: '⚠ Midterm Exam Preparation', sub: ['Review all past labs', 'Study thermodynamics', 'Take practice exam'] },
  { week: 8, color: '#0066CC', course: 'MATH 115', title: '⚠ Midterm Exam', sub: ['Focus on derivatives & integrals', 'Arrive 15 min early', 'Show all work'] },
  { week: 8, color: '#CC6600', course: 'CHEM 210', title: '⚠ Midterm Exam', sub: ['Comprehensive lab exam', 'Bring lab notebook', 'Know reaction mechanisms'] },
  { week: 9, color: '#0066CC', course: 'MATH 115', title: 'Problem Set 4 — Applications', sub: ['Optimization problems', 'Related rates', 'Real-world applications'] },
  { week: 10, color: '#CC6600', course: 'CHEM 210', title: 'Lab Report 2 — Kinetics Study', sub: ['Collect kinetics data', 'Calculate rate constants', 'Analyze mechanism'] },
  { week: 11, color: '#0066CC', course: 'MATH 115', title: 'Problem Set 5 — Series & Sequences', sub: ['Convergence tests', 'Power series', 'Taylor series'] },
  { week: 12, color: '#CC6600', course: 'CHEM 210', title: 'Problem Set 3 — Quantum & Spectroscopy', sub: ['Wave equations', 'Orbital diagrams', 'IR spectroscopy problems'] },
  { week: 13, color: '#0066CC', course: 'MATH 115', title: 'Problem Set 6 — Multivariable Calculus', sub: ['Partial derivatives', 'Gradient & directional derivatives', 'Practice multivariable'] },
  { week: 14, color: '#CC6600', course: 'CHEM 210', title: 'Problem Set 4 — Equilibrium & pH', sub: ['Ka/Kb calculations', 'Buffer problems', 'Titration curves'] },
  { week: 15, color: '#0066CC', course: 'MATH 115', title: '⚠ Final Exam Preparation', sub: ['Comprehensive review', 'Review all problem sets', 'Attend final review session'] },
  { week: 16, color: '#CC6600', course: 'CHEM 210', title: '⚠ Final Exam', sub: ['Comprehensive exam', 'Know all reaction types', 'Lab practical included'] },
];

const UMICH_LSA_TL_OPT = [
  { week: 2, color: '#0066CC', course: 'MATH 115', title: 'Problem Set 1 — Limits & Continuity', sub: ['Read & work through examples together'] },
  { week: 3, color: '#CC6600', course: 'CHEM 210', title: 'Lab Report 1 — Start early', sub: ['Begin data collection W2', 'Spread writing across week'] },
  { week: 4, color: '#0066CC', course: 'MATH 115', title: 'Quiz 1 Prep — Derivatives', sub: ['Study in groups', 'Attend optional review'] },
  { week: 5, color: '#CC6600', course: 'CHEM 210', title: 'Problem Set 2 — Thermodynamics', sub: ['Work in pairs', 'Check answers together'] },
  { week: 6, color: '#0066CC', course: 'MATH 115', title: 'Problem Set 3 — Integration', sub: ['Start W5 evening', 'Attend tutoring session'] },
  { week: 6, color: '#CC6600', course: 'CHEM 210', title: 'Lab Report 2 — Draft due', sub: ['Finish data analysis', 'Begin writing'] },
  { week: 7, color: '#0066CC', course: 'MATH 115', title: 'Midterm Prep — Derivatives & Integrals', sub: ['Final review W7 Tue', 'Exam W7 Thu'] },
  { week: 7, color: '#CC6600', course: 'CHEM 210', title: 'Midterm Preparation', sub: ['Lab exam prep', 'Chemistry review'] },
  { week: 8, color: '#0066CC', course: 'MATH 115', title: 'Post-Exam — Reset Schedule', sub: ['Recover & regroup'] },
  { week: 9, color: '#CC6600', course: 'CHEM 210', title: 'Lab Work — Kinetics Study', sub: ['Balanced lab time'] },
  { week: 10, color: '#0066CC', course: 'MATH 115', title: 'Problem Set 4 — Applications', sub: ['Real-world connection'] },
  { week: 11, color: '#CC6600', course: 'CHEM 210', title: 'Problem Set 3 — Quantum', sub: ['Visual learning approach'] },
  { week: 12, color: '#0066CC', course: 'MATH 115', title: 'Problem Set 5 — Series & Sequences', sub: ['Pattern recognition focus'] },
  { week: 13, color: '#CC6600', course: 'CHEM 210', title: 'Problem Set 4 — Equilibrium & pH', sub: ['Interactive problem solving'] },
  { week: 15, color: '#0066CC', course: 'MATH 115', title: 'Final Exam Prep — Start Early', sub: ['2 weeks prep', 'Study groups W14-W16'] },
  { week: 16, color: '#CC6600', course: 'CHEM 210', title: 'Final Exam Prep — Comprehensive', sub: ['Lab practical review'] },
];

// ── STATE ──
let optimized = false;
let scoreAnimated = false;
let currentProfile = 'cs';
let uploadedData = null; // { timeline: [], heatmap: [], courses: [] } from file upload

// ── PDF.JS WORKER ──
if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// ── FILE UPLOAD ──
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('file-input');
  const btn = document.getElementById('upload-btn');
  const countEl = document.getElementById('file-count');
  if (input) {
    input.addEventListener('change', () => {
      const n = input.files?.length || 0;
      btn.disabled = n === 0;
      if (countEl) {
        countEl.textContent = n === 0 ? '' : n === 1 ? '1 file selected' : n + ' files selected';
      }
    });
  }
});

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  let text = '';
  for (let i = 1; i <= Math.min(numPages, 20); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  return text;
}

async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractText(file) {
  const ext = (file.name || '').toLowerCase();
  if (ext.endsWith('.pdf')) return extractTextFromPDF(file);
  if (ext.endsWith('.docx')) return extractTextFromDocx(file);
  throw new Error('Unsupported format');
}

// Map month names to typical semester week (fall: Sept=1, Dec=16)
function monthToWeek(monthStr) {
  const m = String(monthStr).toLowerCase();
  if (/sept|sep\b/.test(m)) return 1;
  if (/oct/.test(m)) return 5;
  if (/nov/.test(m)) return 9;
  if (/dec/.test(m)) return 14;
  if (/jan|spring/.test(m)) return 1;
  if (/feb/.test(m)) return 5;
  if (/mar/.test(m)) return 9;
  if (/apr|may/.test(m)) return 14;
  return null;
}

// Heuristic parser: extract assignments with week numbers from syllabus text
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

  const allLines = text.split(/\n/).map(l => l.trim()).filter(l => l.length > 6);
  for (const line of allLines) {
    const weekMatch = line.match(/(?:week|wk\.?)\s*(\d{1,2})/gi);
    const weekNumMatch = line.match(/(\d{1,2})\s*(?:weeks?|wks?)/i);
    const monthMatch = line.match(/\b(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sept|sep|october|oct|november|nov|december|dec)\b/i);
    const dateMatch = line.match(/(\d{1,2})\/(\d{1,2})|(\d{1,2})\s*[-–]\s*(\d{1,2})/);
    let week = null;
    if (weekMatch) {
      const nums = [...new Set(weekMatch.map(m => parseInt(m.replace(/\D/g, ''), 10)).filter(n => n >= 1 && n <= 16))];
      week = nums[0];
    } else if (weekNumMatch) {
      week = Math.min(16, Math.max(1, parseInt(weekNumMatch[1], 10)));
    } else if (monthMatch) {
      week = monthToWeek(monthMatch[1]);
    } else if (dateMatch) {
      const m = parseInt(dateMatch[1] || dateMatch[3], 10);
      if (m >= 8 && m <= 12) week = 1 + Math.floor((m - 8) * 4);
      else if (m >= 1 && m <= 5) week = 9 + Math.floor(m);
    }

    for (const pat of assignmentPatterns) {
      if (new RegExp(pat.source, 'i').test(line)) {
        const w = week || (items.length < 4 ? 3 + items.length : Math.min(14, 5 + items.length));
        addItem(w, line);
        break;
      }
    }
    if (
      !week &&
      /\b(due|deadline|submit|assignment|homework|quiz|exam|paper|project|lab)\b/i.test(line) &&
      line.length > 10 &&
      items.length < 30
    ) {
      addItem(Math.min(14, 4 + Math.floor(items.length / 2)), line);
    }
  }

  if (items.length === 0) {
    items.push(
      { week: 4, color: colors[0], course, title: 'Assignment / Exam detected', sub: ['Check syllabus for details'] },
      { week: 8, color: colors[0], course, title: 'Midterm or major deadline', sub: ['Prepare in advance'] },
      { week: 14, color: colors[0], course, title: 'Final / end-of-term work', sub: ['Review all material'] },
    );
  }

  return items;
}

function deriveCourseFromFilename(name) {
  const m = name.match(/([A-Z]{2,5}\s*\d{3,4})/i);
  return m ? m[1].replace(/\s+/, ' ').toUpperCase() : name.replace(/\.(pdf|docx)$/i, '').replace(/_/g, ' ').slice(0, 20);
}

function deriveHeatmapFromTimeline(timeline) {
  const weeks = new Array(16).fill(0);
  timeline.forEach(item => {
    const w = Math.min(16, Math.max(1, item.week));
    weeks[w - 1] += 3;
    if (/\bmidterm|final|exam|paper|project\b/i.test(item.title)) weeks[w - 1] += 4;
  });
  const max = Math.max(...weeks, 1);
  return weeks.map(v => Math.min(10, Math.round((v / max) * 8) + 2));
}

async function handleFileUpload() {
  const input = document.getElementById('file-input');
  const files = input?.files;
  if (!files?.length) return;

  showScreen('loading-screen');
  const pills = document.getElementById('loading-pills');
  const fill = document.getElementById('progress-fill');
  const pct = document.getElementById('progress-pct');
  const label = document.getElementById('loading-label');

  pills.innerHTML = Array.from(files).map(f => `<div class="loading-file-pill"><div class="dot"></div>${f.name}</div>`).join('');

  let allItems = [];
  let usedAIParsing = false;
  const n = files.length;
  for (let i = 0; i < n; i++) {
    const file = files[i];
    const course = deriveCourseFromFilename(file.name);
    label.textContent = `Extracting text from ${file.name}…`;
    fill.style.width = ((i / n) * 50) + '%';
    pct.textContent = Math.round((i / n) * 50) + '%';

    try {
      // Try backend API first (when server is running)
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/parse-syllabus', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.items?.length) {
          allItems = allItems.concat(result.items);
          if (result.parsedWith === 'ai') usedAIParsing = true;
          continue;
        }
      }
      throw new Error('API failed or empty');
    } catch (_) {
      // Fallback: extract text client-side and parse with heuristics
      try {
        const text = await extractText(file);
        const items = parseSyllabusText(text, course);
        if (items.length > 0) {
          allItems = allItems.concat(items);
          continue;
        }
      } catch (extractErr) {
        console.warn('Client-side parse failed for', file.name, extractErr);
      }
      allItems.push({
        week: 4 + i * 3,
        color: ['#378ADD', '#D85A30', '#1D9E75', '#0066CC'][i % 4],
        course,
        title: file.name + ' (parse limited)',
        sub: ['Open syllabus for full schedule'],
      });
    }
  }

  label.textContent = 'Building your survival plan…';
  fill.style.width = '100%';
  pct.textContent = '100%';

  const heatmap = deriveHeatmapFromTimeline(allItems);
  const collisionWeeks = heatmap.filter((v, i) => v >= 7).length;
  const score = Math.max(15, Math.min(85, 80 - collisionWeeks * 15));

  const studyTasksCount = allItems.reduce((s, i) => s + (i.sub?.length || 1), 0);
  uploadedData = {
    timeline: allItems.sort((a, b) => a.week - b.week),
    heatmap,
    score,
    dangerCount: collisionWeeks,
    totalDeadlines: allItems.length,
    studyTasksCount,
  };
  currentProfile = 'uploaded';

  setTimeout(() => {
    showScreen('dashboard-screen');
    renderHeatmap(uploadedData.heatmap, false);
    renderTimeline(uploadedData.timeline);
    animateScore(score, false);
    document.getElementById('danger-count').textContent = String(collisionWeeks);
    document.getElementById('danger-sub').textContent = collisionWeeks === 1 ? 'high-collision week' : 'high-collision weeks';
    const totalEl = document.querySelector('.score-cards-mini .score-card .score-card-val');
    const subEl = document.querySelector('.score-cards-mini .score-card .score-card-sub');
    if (totalEl) totalEl.textContent = String(uploadedData.totalDeadlines);
    if (subEl) subEl.textContent = 'across ' + new Set(allItems.map(i => i.course)).size + ' course(s)';
    const studyEl = document.getElementById('study-tasks-val');
    const studySubEl = document.getElementById('study-tasks-sub');
    if (studyEl) studyEl.textContent = String(studyTasksCount);
    if (studySubEl) studySubEl.textContent = 'from your syllabi';
    renderUploadedConflicts(uploadedData.timeline, heatmap);
    showToast(usedAIParsing ? '✨ Plan generated with AI parsing!' : 'Plan generated from your syllabi ✓');
  }, 800);
}

function renderUploadedConflicts(timeline, heatmap) {
  const section = document.getElementById('conflicts-section');
  if (!section) return;
  const byWeek = {};
  timeline.forEach((item) => {
    const w = item.week;
    if (!byWeek[w]) byWeek[w] = [];
    byWeek[w].push(item);
  });
  const collisionWeeks = Object.entries(byWeek)
    .filter(([, items]) => items.length >= 2)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3);
  section.innerHTML = '';
  if (collisionWeeks.length === 0) {
    section.innerHTML = '<div class="conflict-card" style="background:var(--green-light);border-color:var(--green-mid)"><span class="conflict-badge" style="background:var(--green);color:#fff">✓</span><div class="conflict-text">No major deadline collisions detected in your syllabi.</div></div>';
    return;
  }
  collisionWeeks.forEach(([week, items], i) => {
    const card = document.createElement('div');
    card.className = 'conflict-card';
    const badge = items.length >= 3 ? 'danger' : 'warn';
    const label = items.length >= 3 ? '⚠ Critical' : '⚡ Warning';
    const titles = items.map((t) => t.title).join(', ');
    card.innerHTML = `<span class="conflict-badge ${badge}">${label}</span><div class="conflict-text"><strong>Week ${week} — ${items.length} items due:</strong> ${titles.slice(0, 120)}${titles.length > 120 ? '…' : ''}</div>`;
    section.appendChild(card);
  });
}

// ── DEMO LOGIC ──
function startSelectedDemo() {
  const profile = document.getElementById('demo-select').value;
  currentProfile = profile; // Store the selected profile
  localStorage.setItem('surviveProfile', profile); // Persist profile
  
  let files = [];
  if (profile === 'cs') files = ['CS280_Syllabus.pdf', 'HIST215_Syllabus.pdf', 'STATS301_Fall2024.docx'];
  else if (profile === 'premed') files = ['CHEM201.pdf', 'BIO101.pdf', 'PHYS201.pdf', 'MATH110.pdf'];
  else if (profile === 'umich-lsa') files = ['MATH115_Syllabus.pdf', 'CHEM210_Syllabus.pdf'];
  startLoading(files);
}

// ── LOADING SEQUENCE ──
function startLoading(fileNames) {
  showScreen('loading-screen');
  const pills = document.getElementById('loading-pills');
  pills.innerHTML = fileNames.map(n =>
    `<div class="loading-file-pill"><div class="dot"></div>${n}</div>`
  ).join('');

  const steps = [
    [0, 0, 'Reading your syllabi…'],
    [600, 25, 'Parsing deadlines and assignments…'],
    [1200, 52, 'Identifying collision points…'],
    [1900, 75, 'Building your survival calendar…'],
    [2500, 90, 'Generating micro-tasks…'],
    [3200, 100, 'Your survival plan is ready ✓'],
  ];

  const fill = document.getElementById('progress-fill');
  const pct = document.getElementById('progress-pct');
  const label = document.getElementById('loading-label');

  steps.forEach(([delay, val, text]) => {
    setTimeout(() => {
      fill.style.width = val + '%';
      pct.textContent = val + '%';
      label.textContent = text;
    }, delay);
  });

  setTimeout(() => {
    showScreen('dashboard-screen');
    
    // Select data based on profile
    let weeksData = RAW_WEEKS;
    let timelineData = TL_RAW;
    
    if (currentProfile === 'umich-lsa') {
      weeksData = UMICH_LSA_WEEKS;
      timelineData = UMICH_LSA_TL_RAW;
    }
    
    renderHeatmap(weeksData, false);
    renderTimeline(timelineData);
    animateScore(32, false);
  }, 3800);
}

// ── SCREEN SWITCHING ──
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── HEATMAP ──
function getBarColor(val, opt) {
  if (opt) {
    if (val <= 4) return '#97C459';
    if (val <= 6) return '#EF9F27';
    return '#63991a';
  }
  if (val >= 9) return '#E24B4A';
  if (val >= 7) return '#EF9F27';
  if (val >= 5) return '#BA7517';
  return '#B4B2A9';
}

function renderHeatmap(data, opt) {
  const container = document.getElementById('heatmap');
  const max = 10;
  container.innerHTML = '<div class="heatmap-axis"></div>';
  data.forEach((val, i) => {
    const pct = (val / max) * 100;
    const color = getBarColor(val, opt);
    const wrap = document.createElement('div');
    wrap.className = 'heatmap-bar-wrap';
    const bar = document.createElement('div');
    bar.className = 'heatmap-bar';
    bar.style.cssText = `height:0%;background:${color};`;
    bar.setAttribute('data-tip', `W${i + 1}: ${val}/10`);
    wrap.appendChild(bar);
    const lbl = document.createElement('div');
    lbl.className = 'heatmap-label';
    lbl.textContent = `W${i + 1}`;
    wrap.appendChild(lbl);
    
    // Add hover interactions
    wrap.addEventListener('mouseenter', () => highlightWeek(i + 1));
    wrap.addEventListener('mouseleave', clearHighlight);

    container.appendChild(wrap);
    setTimeout(() => { bar.style.height = pct + '%'; }, 80 + i * 35);
  });
}

// ── TIMELINE SYNC ──
function highlightWeek(weekNum) {
  const container = document.getElementById('timeline').parentElement;
  let firstItem = null;
  const items = document.querySelectorAll('.timeline-item');
  items.forEach(item => {
    const weekEl = item.querySelector('.tl-week');
    if (weekEl && weekEl.textContent === `W${weekNum}`) {
      item.classList.add('highlight');
      if (!firstItem) firstItem = item;
    }
  });

  if (firstItem && container) {
    // Scroll to the item within the scrollable container
    const offsetTop = firstItem.offsetTop - document.getElementById('timeline').offsetTop;
    container.scrollTo({ top: offsetTop - 10, behavior: 'smooth' });
  }
}

function clearHighlight() {
  document.querySelectorAll('.timeline-item').forEach(item => item.classList.remove('highlight'));
}

// ── TIMELINE ──
function renderTimeline(items) {
  const list = document.getElementById('timeline');
  list.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'timeline-item';
    li.innerHTML = `
  <div class="tl-week">W${item.week}</div>
  <div class="tl-dot" style="background:${item.color}"></div>
  <div class="tl-content">
    <div class="tl-title">
      <span class="tl-course-tag" style="background:${item.color}22;color:${item.color}">${item.course}</span>
      ${item.title}
    </div>
    <ul class="tl-sub-tasks">
      ${item.sub.map(s => `<li class="tl-sub-task"><div class="sub-dot"></div>${s}</li>`).join('')}
    </ul>
  </div>`;
    list.appendChild(li);
  });
}

// ── SURVIVAL SCORE ──
function animateScore(target, isOpt) {
  const ring = document.getElementById('score-ring');
  const num = document.getElementById('score-num');
  const desc = document.getElementById('score-desc');
  const dangerCount = document.getElementById('danger-count');
  const dangerSub = document.getElementById('danger-sub');
  const circ = 182;

  if (isOpt) {
    ring.style.stroke = '#639922';
    num.style.color = '#3B6D11';
    desc.textContent = 'Optimized! Load distributed evenly.';
    dangerCount.textContent = '0';
    dangerSub.textContent = 'conflicts resolved';
  } else {
    ring.style.stroke = '#E24B4A';
    num.style.color = '#A32D2D';
    desc.textContent = 'High risk — multiple collision weeks detected.';
    dangerCount.textContent = '3';
    dangerSub.textContent = 'high-collision weeks';
  }

  const offset = circ - (target / 100) * circ;
  setTimeout(() => { ring.style.strokeDashoffset = offset; }, 100);

  let cur = 0;
  const step = target / 40;
  const iv = setInterval(() => {
    cur = Math.min(cur + step, target);
    num.textContent = Math.round(cur);
    if (cur >= target) clearInterval(iv);
  }, 30);
}

function createOptimizedFromUploaded(timeline) {
  const spread = [];
  const used = new Set();
  timeline.forEach((item, i) => {
    let w = item.week;
    while (used.has(w) && w < 16) w++;
    used.add(w);
    spread.push({
      ...item,
      week: w,
      title: item.title.replace(/^⚠\s*/, ''),
      sub: ['Spread across week', 'Avoid last-minute crunch'],
    });
  });
  return spread.sort((a, b) => a.week - b.week);
}

// ── OPTIMIZE TOGGLE ──
function toggleOptimize() {
  optimized = !optimized;
  const btn = document.getElementById('optimize-btn');
  const label = document.getElementById('opt-label');

  let optWeeksData = OPT_WEEKS;
  let optTimelineData = TL_OPT;

  if (currentProfile === 'umich-lsa') {
    optWeeksData = UMICH_LSA_WEEKS;
    optTimelineData = UMICH_LSA_TL_OPT;
  } else if (currentProfile === 'uploaded' && uploadedData) {
    optTimelineData = createOptimizedFromUploaded(uploadedData.timeline);
    optWeeksData = deriveHeatmapFromTimeline(optTimelineData);
  }

  if (optimized) {
    btn.classList.add('optimized');
    label.textContent = 'Optimized ✓';
    renderHeatmap(optWeeksData, true);
    renderTimeline(optTimelineData);
    animateScore(78, true);
    // Mark conflict cards as resolved
    ['c1', 'c2', 'c3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('resolved');
        el.querySelector('.conflict-badge').textContent = '✓ Resolved';
        el.querySelector('.conflict-badge').className = 'conflict-badge';
      }
    });
  } else {
    btn.classList.remove('optimized');
    label.textContent = 'AI Schedule Optimizer';
    
    // Select raw data based on profile
    let rawWeeksData = RAW_WEEKS;
    let rawTimelineData = TL_RAW;
    
    if (currentProfile === 'umich-lsa') {
      rawWeeksData = UMICH_LSA_WEEKS;
      rawTimelineData = UMICH_LSA_TL_RAW;
    }
    
    renderHeatmap(rawWeeksData, false);
    renderTimeline(rawTimelineData);
    animateScore(32, false);
    ['c1', 'c2', 'c3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('resolved');
      }
    });
    document.getElementById('c1').querySelector('.conflict-badge').textContent = '⚠ Critical';
    document.getElementById('c1').querySelector('.conflict-badge').className = 'conflict-badge danger';
    document.getElementById('c2').querySelector('.conflict-badge').textContent = '⚡ Warning';
    document.getElementById('c2').querySelector('.conflict-badge').className = 'conflict-badge warn';
    document.getElementById('c3').querySelector('.conflict-badge').textContent = '⚡ Warning';
    document.getElementById('c3').querySelector('.conflict-badge').className = 'conflict-badge warn';
  }
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

// ── AI TRIAGE MODAL ──
function openTriageModal(triageType) {
  const modal = document.getElementById('triage-modal');
  modal.style.display = 'flex';
}

function closeTriageModal() {
  const modal = document.getElementById('triage-modal');
  modal.style.display = 'none';
}

// ── CALENDAR DOWNLOAD ──
function downloadCalendar() {
  const today = new Date();
  const nextWeekStart = new Date(today);
  nextWeekStart.setDate(today.getDate() + (1 - today.getDay())); // Start of next week (Sunday)
  
  // Helper function to format dates as iCalendar format (YYYYMMDD)
  function formatDateICS(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
  
  // Helper function to format times for iCalendar
  function formatTimeICS(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}${minutes}${seconds}`;
  }
  
  // Build iCalendar string
  let icsContent = 'BEGIN:VCALENDAR\r\n';
  icsContent += 'VERSION:2.0\r\n';
  icsContent += 'PRODID:-//Survive the Semester//EN\r\n';
  icsContent += 'CALSCALE:GREGORIAN\r\n';
  icsContent += 'METHOD:PUBLISH\r\n';
  
  let tasksToExport;
  if (currentProfile === 'uploaded' && uploadedData) {
    tasksToExport = optimized ? createOptimizedFromUploaded(uploadedData.timeline) : uploadedData.timeline;
  } else if (currentProfile === 'umich-lsa') {
    tasksToExport = optimized ? UMICH_LSA_TL_OPT : UMICH_LSA_TL_RAW;
  } else {
    tasksToExport = optimized ? TL_OPT : TL_RAW;
  }
  tasksToExport.forEach((task, index) => {
    // Calculate date: each week maps to a day next week
    const eventDate = new Date(nextWeekStart);
    eventDate.setDate(nextWeekStart.getDate() + (task.week - 1));
    
    // Start at 9 AM for the event
    eventDate.setHours(9, 0, 0, 0);
    
    // Create unique ID
    const uid = `survive-${index}-${Date.now()}@surviveplan.local`;
    
    // Format dates
    const dtStart = formatDateICS(eventDate);
    const dtEnd = new Date(eventDate);
    dtEnd.setHours(10, 0, 0, 0);
    const dtEndFormatted = formatDateICS(dtEnd);
    
    // Add event
    icsContent += 'BEGIN:VEVENT\r\n';
    icsContent += `UID:${uid}\r\n`;
    icsContent += `DTSTAMP:${formatDateICS(new Date())}T${formatTimeICS(new Date())}\r\n`;
    icsContent += `DTSTART:${dtStart}T090000\r\n`;
    icsContent += `DTEND:${dtEndFormatted}T100000\r\n`;
    icsContent += `SUMMARY:${task.title} (${task.course})\r\n`;
    icsContent += `DESCRIPTION:${task.sub.join(', ')}\r\n`;
    icsContent += 'STATUS:CONFIRMED\r\n';
    icsContent += 'END:VEVENT\r\n';
  });
  
  icsContent += 'END:VCALENDAR\r\n';
  
  // Create blob and download
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'survive_semester_plan.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
  
  // Show toast notification
  showToast('📅 Calendar file downloaded!');
}
