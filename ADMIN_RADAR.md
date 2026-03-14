# 🔐 Admin God-Mode Radar (Secret Feature)

## Hidden Feature: Campus Burnout Radar

A sophisticated "Dean of Students Portal" has been secretly integrated into the Survive the Semester application. This hidden screen provides institutional-level visibility into student burnout risks and semester collision patterns.

## How to Access

**Hotkey: `Shift + A`** (Press simultaneously anywhere in the app)

The secret portal will appear with:
- Inverted color scheme (dark navbar)
- "DEAN OF STUDENTS PORTAL" subtitle
- "LSA COHORT: FALL 2026" metadata

Press **`Shift + A` again** to return to the previous dashboard view.

## Portal Contents

### 1. Campus Burnout Radar Header
- High-visibility "Campus Burnout Radar" title
- Designed for administrative visibility

### 2. Risk Metrics (Two-Column Cards)

**Imminent Dropouts (Next 14 Days)**
- Displays: 142 freshmen
- Context: "Freshmen entering critical collision weeks"
- Background: Emergency red (`var(--red)`)

**Tuition Revenue at Risk**
- Displays: $4.97M
- Calculation: 142 students × $35k avg. lifetime LSA tuition
- Background: Dark text color with green highlights
- Emphasizes institutional financial stakes

### 3. Critical Structural Collisions Table

Professional table format with columns:
- **Conflict Vector** - Description of the exam/deadline collision
- **Affected Students** - Number affected (318, 184)
- **Severity** - Color-coded badges (Critical ⚠, Warning ⚡)
- **Action** - Interactive buttons

#### Row 1: MATH 115 + CHEM 210 Collision (Week 8)
- 318 students affected
- Critical severity
- Button: "Alert Faculty Leads" → Shows toast "Alert dispatched to Math/Chem department heads."

#### Row 2: STATS 401 + EECS 280 Collision (Week 14)
- 184 students affected
- Warning severity
- Button: "Deploy Triage Email" → Shows toast "Advisors notified to send targeted outreach."

## Design Philosophy

**Premium Data Visualization**
- Inverted color scheme conveys administrative authority
- High contrast and clear typography
- Professional table layout for data-driven decisions

**Institutional Framing**
- Focuses on student retention (dropout prevention)
- Emphasizes financial stakes ($4.97M)
- Positions scheduling optimization as risk management

**Integration with Core Features**
- Uses existing conflict badges and styling
- Leverages existing `showToast()` for notifications
- Seamlessly integrates with screen switching logic

## Technical Implementation

### HTML (syllabus_survival_dashboard.html)
- Added `<div id="admin-screen">` with full markup
- Positioned before the toast container
- Uses inline styles for visual control
- All content self-contained (no external dependencies)

### JavaScript (script.js)
- Added keydown event listener for `Shift + A` combination
- Toggles between `admin-screen` and `dashboard-screen`
- Uses existing `showScreen()` function for transitions
- No additional dependencies or modifications to core logic

### Code Location
- **HTML**: Lines 534-587 (54 lines total)
- **JS**: Lines 683-695 (13 lines total)

## Usage Scenarios

### Institutional Use
- Deans reviewing semester-wide collision patterns
- Capacity planning for teaching assistants
- Proactive intervention strategies
- Faculty coordination meetings

### Demo/Presentation
- Show institutional dashboard capabilities
- Demonstrate data-driven student services
- Highlight preventative retention strategies

### Easter Egg/Hidden Feature
- Secret feature for stakeholder surprise
- Demonstrates advanced capability and polish
- Premium feel of comprehensive solution

## Interaction Flow

```
User (anywhere in app)
    ↓
Press Shift + A
    ↓
Check if admin-screen is active
    ↓
If hidden: showScreen('admin-screen')
If visible: showScreen('dashboard-screen')
    ↓
Smooth CSS transition
    ↓
Admin Portal Displayed
```

## Button Interactions

Both action buttons trigger toast notifications:

```javascript
// Alert Faculty Leads
onclick="showToast('Alert dispatched to Math/Chem department heads.')"

// Deploy Triage Email
onclick="showToast('Advisors notified to send targeted outreach.')"
```

## Styling Details

### Color Scheme
- Navbar background: `var(--txt)` (dark)
- Navbar text: `var(--bg)` (light)
- Risk cards: Emergency red & dark text
- Table rows: Subtle alternating styles

### Typography
- Portal title: 24px, bold
- Labels: 12px, 70% opacity
- Values: 36px, 100% opacity
- Table: 13px monospace for numbers

### Interactive Elements
- Buttons with hover state (cursor: pointer)
- Toast notifications on click
- Professional spacing and padding

## Security Notes

✅ No actual data transmission
✅ No backend modifications
✅ Client-side UI only
✅ No authentication required to view
✅ Toast messages are confirmatory only

This is purely a UI demonstration of institutional dashboard capabilities.

## Customization Ideas

Future enhancements could include:
- [ ] Real data integration from student management system
- [ ] Sortable/filterable collision table
- [ ] Export reports as PDF
- [ ] Real-time notification dispatch
- [ ] Faculty alert scheduling
- [ ] Email template customization
- [ ] Analytics and trend visualization

## Easter Egg Notes

The feature is completely non-intrusive:
- No performance impact
- No modification to demo profiles
- No changes to file upload logic
- Purely additive feature
- Can be toggled on/off with Shift+A
- Returns seamlessly to previous view

---

**Access Code:** `Shift + A` (everywhere in the app)

**Portal Name:** Dean of Students Portal / Campus Burnout Radar

**Status:** ✅ Active and ready for demonstration
