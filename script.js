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

// ── STATE ──
let optimized = false;
let scoreAnimated = false;

// ── DEMO LOGIC ──
function startSelectedDemo() {
  const profile = document.getElementById('demo-select').value;
  let files = [];
  if (profile === 'cs') files = ['CS280_Syllabus.pdf', 'HIST215_Syllabus.pdf', 'STATS301_Fall2024.docx'];
  else if (profile === 'premed') files = ['CHEM201.pdf', 'BIO101.pdf', 'PHYS201.pdf', 'MATH110.pdf'];
  else files = ['ENG101.pdf', 'ECON101.pdf', 'PSYCH100.pdf', 'SPAN101.pdf', 'ART101.pdf'];
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
    renderHeatmap(RAW_WEEKS, false);
    renderTimeline(TL_RAW);
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
  const max = Math.max(...data);
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
    container.appendChild(wrap);
    setTimeout(() => { bar.style.height = pct + '%'; }, 80 + i * 35);
  });
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

// ── OPTIMIZE TOGGLE ──
function toggleOptimize() {
  optimized = !optimized;
  const btn = document.getElementById('optimize-btn');
  const label = document.getElementById('opt-label');

  if (optimized) {
    btn.classList.add('optimized');
    label.textContent = 'Optimized ✓';
    renderHeatmap(OPT_WEEKS, true);
    renderTimeline(TL_OPT);
    animateScore(78, true);
    // Mark conflict cards as resolved
    ['c1', 'c2', 'c3'].forEach(id => {
      const el = document.getElementById(id);
      el.classList.add('resolved');
      el.querySelector('.conflict-badge').textContent = '✓ Resolved';
      el.querySelector('.conflict-badge').className = 'conflict-badge';
    });
  } else {
    btn.classList.remove('optimized');
    label.textContent = 'AI Schedule Optimizer';
    renderHeatmap(RAW_WEEKS, false);
    renderTimeline(TL_RAW);
    animateScore(32, false);
    ['c1', 'c2', 'c3'].forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('resolved');
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
