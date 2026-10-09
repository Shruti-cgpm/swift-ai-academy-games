(() => {
  'use strict';
  /* Where "Continue" on the completion screen goes. Set this to the live Resources URL,
     or pass ?next=<url> in the lab link. Left empty, the button is hidden. */
  const NEXT_URL = '';

  /* ---------------- dates that stay current (L9) ---------------- */
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const fmt = d => DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const comingSunday = (() => { const d = new Date(today); d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7)); return d; })();
  const nextWeekThursday = (() => { const d = new Date(today); const toMon = ((8 - d.getDay()) % 7) || 7; d.setDate(d.getDate() + toMon + 3); return d; })();

  const CATS = {
    date: 'Dates and times', place: 'Places and venues', number: 'Numbers and money',
    name: 'Names of people or companies', standard: 'Standards and sizes', extra: 'Extra details or rules nobody gave'
  };
  const CAT_ICON = { date: 'date', place: 'campus', number: 'figure', name: 'name', standard: 'source-rating-plate', extra: 'extra' };

  /* ---------------- scenarios ----------------
     lane: which course lane gets this case (L6)
     card: the trusted check card (rows, or groups for case 1)
     claims: the worked example (L1, E-L2) — lines from the provided output with the answer key */
  const scenarios = [
    {
      id: 'case-1', lane: 'iti', safety: true,
      prompt: 'A household wiring workshop is being conducted. Give me a detailed list of the items required for the workshop.',
      cardTitle: 'Workshop materials and equipment',
      focus: ['Wire sizes are given in square millimetres (sq mm), not AWG.', 'Indian modular sockets: 6 ampere and 16 ampere.', 'Protection is an RCCB (30 mA) and MCBs on the distribution board.', 'Wire colours: red, black and green for phase, neutral and earth.'],
      groups: [
        ['Safety', ['Safety glasses', 'Rubber-soled footwear']],
        ['Tools', ['Insulated screwdriver set (1000 V rated)', 'Needle nose pliers', 'Measuring tape', 'Spirit level', 'Wire strippers for 1–4 sq mm wire', 'Neon tester screwdriver', 'Drill machine', 'Hacksaw for cutting conduit', 'Bending spring for PVC conduit', 'Crimping tool']],
        ['Testing', ['Non-contact voltage tester', 'Digital multimeter', 'Earth tester']],
        ['Wiring and installation', ['Single-pole and two-way switches', 'Dimmers', 'LED bulbs', 'Practice wiring boards', 'PVC-insulated copper wire, FR or FRLS', 'ISI-marked wire: 1.5 sq mm (lighting) and 2.5 sq mm (sockets)', 'Red, black and green wire for phase, neutral and earth', 'Connector strips', 'PVC insulation tape', 'Lugs and ferrules', 'PVC conduit with saddles, bends and junction boxes, or casing-capping with screws and rawl plugs for brick walls', 'Ceiling roses', 'Pendant holders', 'Fan regulator and ceiling rose for a fan point', 'Batten holders']],
        ['Sockets and protection', ['Indian modular sockets: 6 ampere 5 pin and 16 ampere 3 pin', 'RCCB 30 milliampere on the distribution board', 'MCBs: 6, 10 and 16 ampere, B and C curve, in an SPN distribution board']]
      ],
      gaps: 'that the workshop is in India, which wiring standards to follow, and what level the trainees are at.',
      whySpecific: 'Your prompt never said the workshop was in India. Much of the wiring text the AI learned from is American. So it gave American cable sizes, connectors and sockets. They sound expert, but they are wrong for an Indian workshop.',
      hint: { role: 'a workshop instructor at an Indian ITI', format: 'a checklist grouped by Safety, Tools, Testing, Wiring and Protection' },
      claims: [
        { t: 'Safety Glasses / Goggles: Protects eyes from flying copper clippings.', ok: true, why: 'Supported: safety glasses are on the card.' },
        { t: 'Wire Strippers / Cutters: Form-matched strippers rated for 10–14 AWG solid and stranded copper wire.', cat: 'standard', why: 'The card sizes wire in square millimetres (1–4 sq mm). AWG is an American sizing system.' },
        { t: 'Insulated Screwdriver Set: Flathead and Phillips (#2) screwdrivers with 1,000V rated insulation handles.', ok: true, why: 'Supported: a 1000 V insulated screwdriver set is on the card.' },
        { t: '14/2 NM-B Cable: Rated for 15A lighting and standard outlet circuits (White jacket).', cat: 'standard', why: 'The card lists ISI-marked PVC copper wire, 1.5 sq mm for lighting. NM-B (Romex) cable is a US product.' },
        { t: 'Wire Nuts / Twist-on Connectors: Standard orange, yellow, and red insulated twist connectors.', cat: 'standard', why: 'The card lists connector strips, lugs and ferrules. Twist-on wire nuts are not on it.' },
        { t: 'Receptacles / Outlets: Standard duplex outlets (15A/20A) and GFCI outlets.', cat: 'standard', why: 'The card lists Indian modular 6 A and 16 A sockets, with an RCCB on the board. Duplex and GFCI outlets are US fittings.' },
        { t: 'Digital Multimeter (DMM): Used to test continuity, measure AC voltage, and check for short circuits.', ok: true, why: 'Supported: a digital multimeter is on the card.' },
        { t: 'Circuit Breakers: Single-pole 15A and 20A Miniature Circuit Breakers (MCBs) mounted on a mock board.', cat: 'number', why: 'The card lists 6, 10 and 16 ampere MCBs. 15 A and 20 A are made up.' },
        { t: 'Practice Wiring Boards: Plywood boards mounted vertically to simulate room walls.', ok: true, why: 'Supported: practice wiring boards are on the card.' }
      ],
      output: `Master Inventory List for a Household Wiring Workshop

1. Personal Protective Equipment (PPE) & Safety Gear
- Safety Glasses / Goggles: Protects eyes from flying copper clippings and insulation debris during wire cutting and stripping.
- Insulated Work Gloves: Provides grip and protects hands against sharp wire ends and sheet metal box edges.
- Non-Conductive Footwear: Rubber-soled shoes for instructors and participants to minimize grounding risks.

2. Essential Hand Tools (Per Workstation)
- Wire Strippers / Cutters: Form-matched strippers rated for 10–14 AWG solid and stranded copper wire.
- Linesman Pliers & Needle-Nose Pliers: For twisting copper conductors together cleanly and bending loop terminals around screw posts.
- Insulated Screwdriver Set: Flathead and Phillips (#2) screwdrivers with 1,000V rated insulation handles.
- Utility Knife / Cable Ripper: Used to score and strip the outer non-metallic (NM-B / Romex) cable sheath without nicking internal insulation.
- Measuring Tape & Level: For precise box mounting height and wire length measurements.

3. Testing & Measurement Equipment
- Non-Contact Voltage Tester (Voltage Pen): Essential safety device to verify circuits are de-energized before touching wires.
- Digital Multimeter (DMM): Used to test continuity, measure AC voltage, and check for short circuits across connections.
- Receptacle / Outlet Tester: Plugs directly into installed 3-prong outlets to quickly identify wiring errors.

4. Wiring Consumables & Fasteners
- 14/2 NM-B Cable: Rated for 15A lighting and standard outlet circuits (White jacket).
- 12/2 NM-B Cable: Rated for 20A small appliance and heavy receptacle circuits (Yellow jacket).
- Wire Nuts / Twist-on Connectors: Standard orange, yellow, and red insulated twist connectors.
- Push-In Connectors (Wago Connectors): Modern lever/push connectors for quick, safe spliced connections.
- Electrical Tape: Flame-retardant PVC electrical tape (UL listed) for insulating connections.
- Cable Staples & Conduit Straps: For securing cable runs to wooden studs within 12 inches of boxes.

5. Fixtures, Boxes & Hardware
- Electrical Boxes: Single-gang and double-gang plastic and metal junction boxes.
- Switches: Single-pole switches, 3-way switches, and dimmer switches.
- Receptacles / Outlets: Standard duplex outlets (15A/20A) and GFCI outlets.
- Lighting Fixtures & Holders: Keyless lamp holders / ceiling roses and LED bulbs.
- Circuit Breakers & Mini Distribution Board: Single-pole 15A and 20A Miniature Circuit Breakers (MCBs) mounted on a mock board.

6. Demonstration Workstations (Training Boards)
- Practice Wiring Boards: Plywood boards mounted vertically with pre-installed junction boxes, light sockets, and breaker panels to simulate room walls safely.`
    },
    {
      id: 'case-5', lane: 'iti',
      prompt: 'Write a short notice for Electrician trainees about the fire safety drill in the workshop next week.',
      cardTitle: 'Fire safety drill: notice details',
      rows: [
        ['Who', 'Electrician trade trainees, all batches'],
        ['Day and date', fmt(nextWeekThursday)],
        ['Time', '11 am, during the practical period'],
        ['Meeting point', 'Assembly point outside Workshop Block B'],
        ['When the alarm sounds', 'Stop work and switch off your practice board at its main switch. Walk, do not run. Stay with your batch instructor for the headcount.'],
        ['Conducted by', 'The Electrician trade instructor'],
        ['Not given', 'How long the drill lasts, and any extinguisher demonstration. Anything specific here is made up.', true]
      ],
      gaps: 'the day, the time, where to gather, and the one safety step that matters most in an electrical workshop.',
      whySpecific: 'Your prompt said "next week", but it gave no day, time or place. The AI picked ones that sound normal for a school notice. It also missed the step that matters most here: switch off the practice boards.',
      hint: { role: 'the Electrician trade instructor', format: 'a short notice with numbered steps' },
      claims: [
        { t: 'A fire safety drill will be held in the workshop next week.', ok: true, why: 'Supported: this is what the prompt and the card say.' },
        { t: 'Date: Monday, 12 October 2026', cat: 'date', why: 'The card gives a Thursday: ' + fmt(nextWeekThursday) + '.' },
        { t: 'Time: 9:00 AM to 10:00 AM', cat: 'date', why: 'The card says 11 am. It does not give an end time at all.' },
        { t: 'Venue: Main Ground, near the Principal\'s Office', cat: 'place', why: 'The card says the assembly point outside Workshop Block B.' },
        { t: 'When the alarm rings, leave your tools and move to the nearest exit.', cat: 'extra', why: 'It misses the key step on the card: switch off your practice board at its main switch first.' },
        { t: 'Walk calmly. Do not run or use the lift.', ok: true, why: 'Supported: the card says walk, do not run. The lift part is extra, but it does no harm.' },
        { t: 'A demonstration of CO2 and ABC fire extinguishers will be given by the local fire station team.', cat: 'extra', why: 'The card says no demonstration was given. This is invented.' },
        { t: 'Absent trainees will be marked absent for the day\'s practical.', cat: 'extra', why: 'No rule like this is on the card.' }
      ],
      output: `NOTICE
Date: 5 October 2026
Subject: Fire Safety Drill for Electrician Trainees

All Electrician trade trainees are informed that a fire safety drill will be held in the workshop next week.

Date: Monday, 12 October 2026
Time: 9:00 AM to 10:00 AM
Venue: Main Ground, near the Principal's Office

During the drill:
1. When the alarm rings, leave your tools and move to the nearest exit.
2. Walk calmly. Do not run or use the lift.
3. Gather at the assembly point and wait for the headcount.
4. A demonstration of CO2 and ABC fire extinguishers will be given by the local fire station team.
5. Trainees must wear their full uniform and safety shoes. Absent trainees will be marked absent for the day's practical.

For any questions, contact the Workshop Superintendent.

(Signature)
Principal
[ITI Name]`
    },
    {
      id: 'case-2', lane: 'he',
      prompt: 'Write a notice for a workshop being conducted by the Mechanical Engineering Department on the afternoon of this coming Sunday.',
      cardTitle: 'Workshop notice details',
      rows: [
        ['Organised by', 'Mechanical Engineering Department'],
        ['Topic', 'Role of mechanical engineering in driving sustainability'],
        ['Day and date', fmt(comingSunday)],
        ['Time', '3 pm'],
        ['Venue', 'Online'],
        ['Who can attend', 'Open to all'],
        ['Not given', 'End time, registration, certificates. Anything specific here is made up.', true]
      ],
      gaps: 'the topic, the date, the time, the venue, and who can attend.',
      whySpecific: 'Your prompt gave only "Mechanical Engineering" and "Sunday afternoon". The AI filled every other line of a usual notice with something believable: a topic, a hall, a time and a registration deadline.',
      hint: { role: 'the department office assistant', format: 'a short formal notice with a subject line' },
      claims: [
        { t: 'The Department of Mechanical Engineering is organizing a practical hands-on workshop this coming weekend.', ok: true, why: 'Supported: the department and the weekend timing match. The card does not say hands-on.' },
        { t: 'Topic: Advanced Fabrication & Hands-on Machining Workshop', cat: 'extra', why: 'The card topic is the role of mechanical engineering in driving sustainability.' },
        { t: 'Date: Saturday, September 26, 2026', cat: 'date', why: 'The card says ' + fmt(comingSunday) + '.' },
        { t: 'Time: 02:00 PM to 05:00 PM (Second Half)', cat: 'date', why: 'The card says 3 pm, and gives no end time.' },
        { t: 'Venue: Central Mechanical Workshop / Seminar Hall B', cat: 'place', why: 'The card says the workshop is online.' },
        { t: 'Target Audience: Open to all Mechanical Engineering students (Priority for 2nd & 3rd-year students)', cat: 'extra', why: 'The card says open to all, with no priority group.' },
        { t: 'Interested students must register via the department portal by Friday, September 25, 2026.', cat: 'extra', why: 'The card says nothing about registration.' },
        { t: 'Interactive Q&A and skill certification for registered participants.', cat: 'extra', why: 'Certificates are not on the card.' }
      ],
      output: `[Name of Institution / College]

NOTICE
Date: September 24, 2026
Ref No: ME/WS/2026/09-02

SUBJECT: HANDS-ON WORKSHOP ON ADVANCED MANUFACTURING TECHNIQUES

All students and faculty members are hereby informed that the Department of Mechanical Engineering is organizing a practical hands-on workshop this coming weekend.

Workshop Schedule & Details
- Topic: Advanced Fabrication & Hands-on Machining Workshop
- Date: Saturday, September 26, 2026
- Time: 02:00 PM to 05:00 PM (Second Half)
- Venue: Central Mechanical Workshop / Seminar Hall B
- Target Audience: Open to all Mechanical Engineering students (Priority for 2nd & 3rd-year students)

Key Highlights
1. Live demonstrations of CNC machining and precision fitting tools.
2. Safety protocols and hands-on operational practice.
3. Interactive Q&A and skill certification for registered participants.

Important Instructions
- Attendance will be marked at the beginning of the second-half session (02:00 PM sharp).
- All participants must wear lab coats and closed-toe shoes.
- Interested students must register via the department portal by Friday, September 25, 2026, before 05:00 PM.

(Signature)
[Name of Head of Department]
Head of Department, Mechanical Engineering`
    },
    {
      id: 'case-3', lane: 'he',
      prompt: 'Write a report for the placement drive conducted recently on campus.',
      cardTitle: 'Annual campus placement drive: report details',
      rows: [
        ['Submitted to', 'Placement Coordinator, JKS College'],
        ['Drive period', '1 September to 10 September 2026'],
        ['Companies', '18, from the IT, consulting, EdTech and core engineering sectors'],
        ['Registered candidates', '520'],
        ['Students with offers', '400 (placement rate 76.9%)'],
        ['Total offers issued', '425'],
        ['Packages', 'Highest ₹18 LPA · Average ₹7 LPA · Lowest ₹4 LPA'],
        ['Hiring by sector', 'IT 40% · Consulting 25% · EdTech 10% · Core engineering 25%'],
        ['Not given', 'Company names, the selection process, feedback. Anything specific here is made up.', true]
      ],
      gaps: 'any numbers: the dates, the number of companies, candidates and offers, the salaries or the sector split.',
      whySpecific: 'A report is mostly numbers, and your prompt gave none. The AI made up numbers that look like a real placement report. It even named real companies. It also contradicts itself: "over 25 companies" in one place and "28" in another.',
      hint: { role: 'the placement cell coordinator', format: 'a one-page report with headings' },
      claims: [
        { t: 'REPORT ON ANNUAL CAMPUS PLACEMENT DRIVE 2026', ok: true, why: 'Supported: the card is about the annual campus placement drive.' },
        { t: 'Submitted To: Office of the Dean / Head of Department', cat: 'name', why: 'The card says it goes to the Placement Coordinator, JKS College.' },
        { t: 'The drive ran from September 15 to September 22, 2026.', cat: 'date', why: 'The card says 1 to 10 September 2026.' },
        { t: 'Over 25 leading companies participated … Total Companies Participated: 28', cat: 'number', why: 'The card says 18 companies, and the answer contradicts itself.' },
        { t: 'Out of 450 eligible candidates, 380 students secured job offers, a placement rate of 84.4%.', cat: 'number', why: 'The card says 520 registered, 400 with offers, 76.9%.' },
        { t: 'Highest Package Offered: ₹24.0 LPA (Software Engineering)', cat: 'number', why: 'The card says the highest package was ₹18 LPA.' },
        { t: 'Companies like TCS, Infosys, and Tech Mahindra recruited heavily.', cat: 'name', why: 'The card names no companies. These are real company names, used without any source.' },
        { t: 'Recruiters highlighted a need for more hands-on experience with Python and CAD/CAM.', cat: 'extra', why: 'The card has no feedback from recruiters.' }
      ],
      output: `REPORT ON ANNUAL CAMPUS PLACEMENT DRIVE 2026
Submitted To: Office of the Dean / Head of Department
Submitted By: Training and Placement Cell (TPC)
Date of Submission: September 24, 2026

1. Executive Summary
The Training and Placement Cell organized the annual Campus Placement Drive for the graduating batch of 2026 from September 15 to September 22, 2026. Over 25 leading companies across core engineering, IT, consulting, and finance sectors participated. Out of 450 eligible candidates registered for the drive, 380 students secured job offers, achieving an overall placement rate of 84.4%.

2. Key Highlights
Total Registered Candidates: 450
Total Companies Participated: 28
Total Offers Issued: 412 (Including multiple offers)
Students Placed: 380
Highest Package Offered: ₹24.0 LPA (Software Engineering)
Average Package Offered: ₹7.2 LPA
Lowest Package Offered: ₹4.5 LPA

3. Sector-Wise Recruitment Breakdown
- Information Technology & Software (42%): Companies like TCS, Infosys, and Tech Mahindra recruited heavily.
- Core Engineering (30%): Major recruiters included Tata Motors, L&T, Siemens, and Ashok Leyland.
- Consulting & Finance (18%)
- Startups & Emerging Sectors (10%)

4. Student & Recruiter Feedback
- Recruiter Feedback: Representatives highlighted a need for further strengthening hands-on experience with modern software tools (e.g., Python, CAD/CAM integration).
- Student Feedback: Candidates requested longer preparation windows for pre-placement assessments.

Report Prepared By:
(Signature)
Training & Placement Cell`
    },
    {
      id: 'case-4', lane: 'he',
      prompt: 'The lab project must be submitted by Friday, 16 October 2026, the third Friday of the month. The presentation will be on Monday, 19 October 2026. Everyone is requested to bring their project report and other necessary items. Prepare a notice stating the submission deadline, presentation time and place, eligible candidates, and what they should bring.',
      cardTitle: 'Lab project notice details',
      rows: [
        ['Project submission', 'Friday 16 October 2026 (the third Friday of the month)'],
        ['Presentation', 'Monday 19 October 2026'],
        ['What to bring', 'Project report and any other items needed for the presentation'],
        ['Not given', 'Presentation time, venue, and who is eligible. A careful answer leaves these as blanks to fill in. Any specific value is made up.', true]
      ],
      gaps: 'the presentation time, the venue and who is eligible. The prompt asked for them, but it never gave them.',
      whySpecific: 'This prompt asked for details it never gave. So the AI made up a time, a lab number and eligibility rules. It also changed both dates, even though the prompt gave them clearly. Always check the facts the AI should have copied, not just the ones it had to guess.',
      hint: { role: 'the lab instructor', format: 'a short notice with a heading for each detail' },
      claims: [
        { t: 'Subject: Lab Project Submission and Presentation Guidelines', ok: true, why: 'Supported: the notice is about submission and presentation.' },
        { t: 'Lab Project Submission Deadline: Friday, September 25, 2026', cat: 'date', why: 'The prompt and card both say Friday 16 October 2026. The AI changed a fact it was given.' },
        { t: 'Time: By 5:00 PM (or end of class hours)', cat: 'date', why: 'No submission time is given anywhere.' },
        { t: 'Presentation Date: Friday, October 2, 2026', cat: 'date', why: 'The card says Monday 19 October 2026.' },
        { t: 'Venue / Place: Main Project Laboratory (Lab 302) / Designated Seminar Room', cat: 'place', why: 'No venue is given. It should be a blank like [venue].' },
        { t: 'Eligible Candidates: All students who have completed the required lab sessions and continuous assessment submissions.', cat: 'extra', why: 'No eligibility rule is given. This is invented.' },
        { t: 'Project Report: Printed and bound lab report formatted as per the guidelines.', ok: true, why: 'Supported: bring the project report. "Printed and bound" is an extra detail.' },
        { t: 'Late submissions or failure to present without prior written permission will impact final evaluation scores.', cat: 'extra', why: 'No penalty rule is on the card.' }
      ],
      output: `NOTICE
Date: September 24, 2026
To: All Eligible Students / Course Participants
Subject: Lab Project Submission and Presentation Guidelines

1. Eligibility
- Eligible Candidates: All students currently enrolled in the course who have completed the required lab sessions and continuous assessment submissions.

2. Lab Project Submission Deadline
- Date: Friday, September 25, 2026
- Time: By 5:00 PM (or end of class hours)

3. Presentation Details
- Date: Friday, October 2, 2026
- Time: Immediately following the regular class session
- Venue / Place: Main Project Laboratory (Lab 302) / Designated Seminar Room

4. Required Items to Bring
- Lab Project Model / Code Base
- Project Report: Printed and bound lab report formatted as per the guidelines.
- Presentation Media: Slides on a USB drive or cloud backup.

Note: Late submissions or failure to present without prior written permission will impact final evaluation scores.

Issued By:
[Your Name / Designation]`
    }
  ];

  /* ---------------- state ---------------- */
  const flow = ['rules', 'predict', 'practice', 'ask', 'check', 'why', 'rewrite', 'compare', 'review'];
  const byId = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  let lane = ['iti', 'he'].includes(params.get('lane')) ? params.get('lane') : null;
  let scenario = null, previousId = null, current = 'start';
  try { previousId = sessionStorage.getItem('wigw-prev'); sessionStorage.removeItem('wigw-prev'); } catch (e) {}
  const st = {};
  function resetState() {
    Object.assign(st, { predict: new Set(), flags: new Set(), revealed: false, capture: '', outcome: '', recall: '', count1: 0, count2: 0, downloaded: false, caught: 0, falseFlags: 0 });
  }
  resetState();

  /* ---------------- sound: the shared layer's effects (taps click by themselves; the header sound button turns them off) ---------------- */
  const sound = {
    tap() {},
    good() { try { if (window.SAA_SFX) SAA_SFX.correct(); } catch (e) {} },
    bad() { try { if (window.SAA_SFX) SAA_SFX.wrong(); } catch (e) {} }
  };

  /* ---------------- helpers ---------------- */
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const svgUse = (id, cls) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('class', cls || 'ic'); const u = document.createElementNS('http://www.w3.org/2000/svg', 'use'); u.setAttribute('href', '#' + id); s.append(u); return s; };
  const icon = name => { const i = el('img', 'wg-ic'); i.src = 'assets/icons/icon-' + name + '.webp'; i.alt = ''; i.setAttribute('aria-hidden', 'true'); return i; };
  const val = id => byId(id).value.trim();
  const setRadio = (group, btn) => { group.querySelectorAll('[role=radio]').forEach(b => { const on = b === btn; b.setAttribute('aria-checked', String(on)); if (b.classList.contains('chip')) b.setAttribute('aria-pressed', String(on)); }); };
  const caseLabel = () => scenario.id.replace('case-', 'Case ');
  const unsupportedClaims = () => scenario.claims.filter(c => !c.ok);
  const cardText = () => scenario.groups
    ? scenario.cardTitle + ': ' + scenario.groups.map(g => g[0] + ': ' + g[1].join('; ')).join(' | ')
    : scenario.cardTitle + ': ' + scenario.rows.map(r => r[0] + ': ' + r[1]).join(' | ');

  /* ---------------- typed answers: real words, not empty, emoji-only or a copy of the prompt.
     Letters of any script count (Hindi and Gujarati too). ---------------- */
  const letters = s => (s.match(/[\p{L}\p{N}]/gu) || []).length;
  const squash = s => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
  const sameText = (a, b) => { const x = squash(a), y = squash(b); return x.length > 0 && x === y; };
  /* check(id, min, words): '' when fine, or the reason it is not */
  function weak(text, min) {
    if (!text) return 'empty';
    if (letters(text) < min) return 'short';
    return '';
  }

  /* ---------------- scenario assignment (L6) ---------------- */
  function assignScenario() {
    const forced = scenarios.find(s => s.id === params.get('scenario'));
    if (forced) { scenario = forced; return; }
    const pool = scenarios.filter(s => s.lane === lane);
    const fresh = pool.filter(s => s.id !== previousId);
    const from = fresh.length ? fresh : pool;
    scenario = from[Math.floor(Math.random() * from.length)];
  }

  function renderCheckCard() {
    document.querySelectorAll('[data-slot="check-card"]').forEach(slot => {
      slot.replaceChildren();
      const card = el('section', 'check-card');
      card.setAttribute('aria-label', 'Check card');
      const h = el('header'); const t = el('b', 'wg-card-t'); t.append(icon('verify'), el('span', '', scenario.cardTitle)); h.append(t, el('span', 'tag', 'Check card · ' + caseLabel()));
      card.append(h);
      if (scenario.focus) {
        const f = el('div', 'focus-strip'); f.append(el('b', '', 'Key facts'));
        const ul = el('ul'); scenario.focus.forEach(x => ul.append(el('li', '', x))); f.append(ul); card.append(f);
      }
      if (scenario.groups) {
        scenario.groups.forEach((g, i) => {
          const d = el('details', 'check-group'); d.open = i === 0 || i === 4;
          const s = el('summary'); s.append(el('span', '', g[0] + ' (' + g[1].length + ')'), svgUse('i-chev', 'ic chev'));
          const ul = el('ul'); g[1].forEach(x => ul.append(el('li', '', x)));
          d.append(s, ul); card.append(d);
        });
      } else {
        const ul = el('ul', 'check-rows');
        scenario.rows.forEach(r => { const li = el('li', r[2] ? 'missing' : ''); li.append(el('span', 'k', r[0]), el('span', 'v', r[1])); ul.append(li); });
        card.append(ul);
      }
      slot.append(card);
    });
  }

  function renderScenario() {
    document.querySelectorAll('[data-fill="case"]').forEach(n => { n.textContent = caseLabel(); });
    document.querySelectorAll('[data-fill="prompt"]').forEach(n => { n.textContent = scenario.prompt; });
    document.querySelectorAll('[data-fill="output"]').forEach(n => { n.textContent = scenario.output; });
    document.querySelectorAll('[data-safety]').forEach(n => { n.hidden = !scenario.safety; });
    /* where the case happens (no labels, so it does not hint at what is made up) */
    document.querySelectorAll('[data-scene]').forEach(n => { n.src = 'assets/mocks/dark/' + (scenario.lane === 'iti' ? 'scene-iti-workshop' : 'scene-campus') + '.webp'; n.alt = scenario.lane === 'iti' ? 'An ITI workshop.' : 'A college campus.'; });
    renderCheckCard();
    byId('check-source').value = 'Check card, ' + caseLabel();
    byId('gaps').textContent = 'Your prompt did not say ' + scenario.gaps;
    byId('why-specific').textContent = scenario.whySpecific;
    renderClaims();
  }

  /* ---------------- rules: the sort kit + the 3 rule ticks (L7) ---------------- */
  const rulesKit = () => document.querySelector('.page[data-page="rules"] .saa-kit');
  const ruleTicks = () => [...byId('rules-ticks').querySelectorAll('input')];
  const quickKit = () => document.querySelector('.page[data-page="why"] .saa-kit');

  /* ---------------- predict (E-L1) ---------------- */
  function renderPredict() {
    const list = byId('predict-list'); list.replaceChildren();
    Object.entries(CATS).forEach(([k, label]) => {
      const b = el('button', 'option wg-opt'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
      b.append(el('span', 'dot'), icon(CAT_ICON[k]), el('span', '', label));
      b.addEventListener('click', () => {
        /* the guess is compared in the practice round: after that it stays as it was */
        if (st.revealed) { need('Your guess is saved. You checked it in the practice round.'); return; }
        st.predict.has(k) ? st.predict.delete(k) : st.predict.add(k);
        b.setAttribute('aria-pressed', String(st.predict.has(k))); sound.tap(); updateLock();
      });
      list.append(b);
    });
  }
  const predictLabels = () => [...st.predict].map(k => CATS[k].toLowerCase()).join(', ');

  /* ---------------- practice: tap to flag (L1, E-L2). Nothing on a line shows whether it is made up
     until Check my flags; then the lines lock. ---------------- */
  function renderClaims() {
    const box = byId('claims'); box.replaceChildren(); box.classList.remove('revealed');
    scenario.claims.forEach((c, i) => {
      const b = el('button', 'claim'); b.type = 'button'; b.setAttribute('aria-pressed', 'false'); b.dataset.i = i;
      const body = el('span'); body.append(el('span', 'verdict'), el('q', '', c.t), el('span', 'why'));
      b.append(el('span', 'flag'), body);
      b.addEventListener('click', () => {
        if (st.revealed) return;
        st.flags.has(i) ? st.flags.delete(i) : st.flags.add(i);
        b.setAttribute('aria-pressed', String(st.flags.has(i))); sound.tap(); updateLock();
      });
      box.append(b);
    });
    byId('practice-score').hidden = true;
    const w = byId('practice-why'); w.textContent = ''; w.className = 'saa-k-why wg-result';
  }
  function revealClaims() {
    st.revealed = true;
    const box = byId('claims'); box.classList.add('revealed');
    let caught = 0, falseFlags = 0;
    box.querySelectorAll('.claim').forEach(b => {
      const c = scenario.claims[b.dataset.i], flagged = st.flags.has(Number(b.dataset.i));
      let cls, label;
      if (!c.ok && flagged) { cls = 'hit'; label = 'Caught · ' + CATS[c.cat]; caught++; }
      else if (!c.ok) { cls = 'miss'; label = 'Missed · ' + CATS[c.cat]; }
      else if (flagged) { cls = 'false-flag'; label = 'This one is supported'; falseFlags++; }
      else { cls = 'ok'; label = 'Supported'; }
      b.classList.add(cls); b.querySelector('.verdict').textContent = label;
      if (!c.ok && CAT_ICON[c.cat]) { const vi = icon(CAT_ICON[c.cat]); vi.classList.add('verdict-ic'); b.querySelector('.verdict').prepend(vi); }   /* kind icon, only after Check */ b.querySelector('.why').textContent = c.why; b.setAttribute('aria-disabled', 'true');
    });
    const total = unsupportedClaims().length;
    st.caught = caught; st.falseFlags = falseFlags;
    const cats = [...new Set(unsupportedClaims().map(c => c.cat))];
    const guessed = cats.filter(k => st.predict.has(k));
    byId('score-big').textContent = caught + '/' + total;
    byId('score-text').textContent = 'made-up details caught.' + (falseFlags ? ' You flagged ' + falseFlags + ' supported line' + (falseFlags > 1 ? 's' : '') + ' by mistake.' : '') + ' '
      + 'Made up here: ' + cats.map(k => CATS[k].toLowerCase()).join(', ') + '. '
      + (guessed.length ? 'Your guess matched ' + guessed.length + ' of these ' + cats.length + ' kinds.' : 'Your guess did not include any of these kinds.');
    byId('practice-score').hidden = false;
    /* one fixed, spoken line (the numbers above are read by the learner) */
    const good = caught >= total - 1;
    const w = byId('practice-why');
    w.className = 'saa-k-why wg-result ' + (good ? 'ok' : 'no');
    w.textContent = caught === total && !falseFlags ? 'Yes. You caught every made-up line, and you flagged nothing by mistake.'
      : good ? 'Yes. You caught most of the made-up lines. Read the reason under each line.'
      : 'Not quite. Some made-up lines got past you. Read the reason under each line.';
    good ? sound.good() : sound.bad();
    const work = byId('practice-score').closest('.wg-work'); if (work) work.scrollTop = 0;
  }

  /* ---------------- check: explicit outcome (L2) ---------------- */
  byId('outcome').querySelectorAll('[role=radio]').forEach(b => b.addEventListener('click', () => {
    setRadio(byId('outcome'), b); st.outcome = b.dataset.v; sound.tap(); paintOutcome(); updateLock();
  }));
  function paintOutcome() {
    const found = st.outcome === 'found', any = Boolean(st.outcome);
    byId('found-wrap').hidden = !found;
    byId('clean-wrap').hidden = !any || found;
    byId('consequence-wrap').hidden = !any;
    byId('source-wrap').hidden = !any;
    byId('predict-recall-wrap').hidden = !any;
    byId('consequence-l').textContent = found ? 'What could happen if someone used it without checking?' : 'What could go wrong if it had guessed instead?';
    byId('recall-list').textContent = predictLabels();
  }
  byId('recall').querySelectorAll('[role=radio]').forEach(b => b.addEventListener('click', () => { setRadio(byId('recall'), b); st.recall = b.dataset.v; sound.tap(); updateLock(); }));
  const usedPractice = () => st.outcome && st.outcome !== 'found';

  /* capture chips */
  byId('capture-chips').querySelectorAll('[role=radio]').forEach(b => b.addEventListener('click', () => { setRadio(byId('capture-chips'), b); st.capture = b.dataset.v; sound.tap(); updateLock(); }));
  byId('changed-prompt').addEventListener('change', e => { byId('changed-wrap').hidden = !e.target.checked; updateLock(); });

  /* steppers */
  document.querySelectorAll('[data-stepper]').forEach(s => {
    const key = s.dataset.stepper;
    s.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      st[key] = Math.max(0, Math.min(30, st[key] + Number(b.dataset.d))); byId(key).textContent = st[key]; sound.tap(); paintMeters(); updateLock();
    }));
  });

  /* ---------------- rewrite builder (L4) ---------------- */
  const clean = s => s.trim().replace(/[.\s]+$/, '');
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  function assembled(asHtml) {
    const part = (v, gap) => {
      const t = clean(v);
      if (!asHtml) return t || '[' + gap + ']';
      if (!t) return '<span class="gap">[' + gap + ']</span>';
      const d = document.createElement('div'); d.textContent = t; return '<u>' + d.innerHTML + '</u>';
    };
    const role = part(val('b-role'), 'role'), ctx = part(val('b-context'), 'context'), task = part(val('b-task'), 'task'),
          facts = part(val('b-facts'), 'facts from the card'), format = part(val('b-format'), 'format');
    const capH = s => asHtml ? s.replace(/^(<u>)?(.)/, (m, u, c) => (u || '') + c.toUpperCase()) : cap(s);
    let out = 'You are ' + role + '. ' + capH(ctx) + '. ' + capH(task) + '. Use only these facts: ' + facts + '. Format it as ' + format + '.';
    if (byId('b-missing').checked) out += asHtml ? ' <u>If any information is missing, say so and leave a blank like [venue] instead of guessing.</u>' : ' If any information is missing, say so and leave a blank like [venue] instead of guessing.';
    return out;
  }
  const paintPreview = () => { byId('preview').innerHTML = assembled(true); };
  document.querySelectorAll('[data-build]').forEach(i => i.addEventListener('input', paintPreview));
  byId('b-missing').addEventListener('change', paintPreview);
  byId('hint-btn').addEventListener('click', () => {
    if (!val('b-role')) byId('b-role').value = scenario.hint.role;
    if (!val('b-format')) byId('b-format').value = scenario.hint.format;
    paintPreview(); updateLock(); sound.tap();
    byId('hint-btn').textContent = 'Hint added: role and format';
  });

  /* ---------------- meters (L5, E-L3) ---------------- */
  const baseline = () => usedPractice() ? unsupportedClaims().length : st.count1;
  const baselineLabel = () => usedPractice() ? 'Practice answer' : 'First answer';
  function meterHTML(target) {
    const a = baseline(), b = st.count2, max = Math.max(a, b, 1);
    const box = byId(target); box.replaceChildren();
    box.append(el('span', 'pane-title', 'Unsupported details'));
    [[baselineLabel(), a, ''], ['Second answer', b, 'after']].forEach(([label, n, cls]) => {
      const row = el('div', 'meter-row ' + cls); const bar = el('span', 'bar'); const fill = el('i'); fill.style.width = (n / max * 100) + '%'; bar.append(fill);
      row.append(el('span', '', label), bar, el('b', '', String(n))); box.append(row);
    });
    const note = a > b ? 'Down by ' + (a - b) + '. Your prompt left fewer gaps to fill.' : a === b ? 'No change yet. Check which facts the AI still had to guess.' : 'Up by ' + (b - a) + '. Look at what the new prompt still left out.';
    box.append(el('p', 'meter-note', note));
  }
  function paintMeters() { meterHTML('meter-compare'); meterHTML('meter-review'); }

  /* ---------------- required work per screen: [{ ok, el, msg }] (the first one missing is spoken) ---------------- */
  function typed(id, min, msgs, extra) {
    const t = val(id), w = weak(t, min);
    let msg = w === 'empty' ? msgs[0] : w === 'short' ? msgs[1] : '';
    if (!msg && extra) msg = extra(t) || '';
    return { ok: !msg, el: byId(id), msg: msg || msgs[0] };
  }
  const requiredFor = {
    rules: () => [{ ok: !!rulesKit() && rulesKit().classList.contains('is-done'), el: rulesKit(), msg: 'Sort all 5 items into the right box first.' },
                  ...ruleTicks().map(i => ({ ok: i.checked, el: i.closest('.tick'), msg: 'Tick all 3 rules to agree to them.' }))],
    predict: () => [{ ok: st.predict.size > 0, el: byId('predict-list'), msg: 'Pick at least 1 kind of detail.' },
                    { ok: st.predict.size < Object.keys(CATS).length, el: byId('predict-list'), msg: 'Do not pick all 6. Leave out the kinds you do not expect.' }],
    practice: () => [{ ok: st.revealed, el: byId('nav-next'), msg: 'Tap the lines you think are made up. Then press Check my flags.' }],
    ask: () => [typed('first-output', 25, ['Paste the first AI answer.', 'This answer is too short. Paste the whole AI answer.'],
                      t => sameText(t, scenario.prompt) ? 'That is the prompt. Paste the AI tool\'s answer instead.' : ''),
                { ok: Boolean(st.capture), el: byId('capture-chips'), msg: 'Choose how you saved the answer.' },
                ...(byId('changed-prompt').checked ? [typed('assigned-prompt', 15, ['Paste the prompt you really used.', 'This prompt is too short. Paste the whole prompt you used.'],
                      t => sameText(t, scenario.prompt) ? 'This is the same as the given prompt. Paste your changed prompt, or untick the box.' : '')] : [])],
    check: () => {
      const list = [{ ok: Boolean(st.outcome), el: byId('outcome'), msg: 'Choose what your AI tool did.' }];
      if (!st.outcome) return list;
      if (st.outcome === 'found') list.push(typed('unsupported', 8, ['Write the parts that the card does not support.', 'Write a little more about the parts that are wrong.'], t => sameText(t, scenario.prompt) ? 'That is the prompt. Write the parts of the answer that are wrong.' : ''),
                                            { ok: st.count1 > 0, el: document.querySelector('[data-stepper="count1"]'), msg: 'Count the unsupported details. There is at least 1.' });
      else list.push(typed('clean-why', 10, ['Say what kept your AI tool correct.', 'Write a little more about what kept it correct.']));
      list.push(typed('consequence', 10, ['Say what could go wrong.', 'Write a little more about what could go wrong.']),
                typed('check-source', 4, ['Name what you checked it against.', 'Name what you checked it against.']),
                { ok: Boolean(st.recall), el: byId('recall'), msg: 'Say whether your guess was right.' });
      return list;
    },
    why: () => [{ ok: !!quickKit() && quickKit().classList.contains('is-done'), el: quickKit(), msg: 'Choose the best fix first.' }],
    rewrite: () => [...[['b-role', 3], ['b-context', 5], ['b-task', 5], ['b-facts', 8], ['b-format', 3]].map(([id, n]) => typed(id, n, ['Fill in all 5 boxes.', 'One box is too short. Write a little more.'], t => sameText(t, scenario.prompt) ? 'Do not paste the old prompt. Write each part in your own words.' : '')),
                    { ok: byId('b-missing').checked, el: byId('b-missing-row'), msg: 'Tick the line that tells the AI tool not to guess.' }],
    compare: () => [typed('second-output', 25, ['Paste the second AI answer.', 'This answer is too short. Paste the whole AI answer.'],
                          t => sameText(t, assembled(false)) || sameText(t, scenario.prompt) ? 'That is a prompt. Paste the AI tool\'s new answer instead.'
                             : sameText(t, val('first-output')) ? 'This is the same as your first answer. Paste the new answer.' : ''),
                    typed('comparison', 10, ['Say what changed and what you still need to check.', 'Write a little more about what changed.'])],
    review: () => [...[...byId('checklist').querySelectorAll('input')].map(i => ({ ok: i.checked, el: i.closest('.tick'), msg: 'Tick all 5 statements before you download.' })),
                   typed('learner-reflection', 10, ['Write 1 sentence to remember.', 'Write a full sentence to remember.'])]
  };
  const missing = () => (requiredFor[current] ? requiredFor[current]() : []).filter(r => !r.ok);
  const pageEl = name => document.querySelector('.page[data-page="' + name + '"]');
  /* the shared layer dims Next (aria-disabled) while the screen carries data-saa-locked; the click is still blocked here */
  function updateLock() {
    if (!flow.includes(current)) return;
    pageEl(current).querySelectorAll('.field[data-req]').forEach(f => {
      const c = f.querySelector('textarea,input'); f.classList.toggle('done', Boolean(c && c.value.trim()));
    });
    const locked = current === 'practice' && !st.revealed ? st.flags.size === 0 : missing().length > 0;
    pageEl(current).toggleAttribute('data-saa-locked', locked);
    if (!locked) hideNeed();
  }
  document.addEventListener('input', updateLock);
  document.addEventListener('change', updateLock);
  document.addEventListener('saa:done', () => setTimeout(updateLock, 0));

  /* the spoken "what is missing" line on the current screen */
  function need(msg) {
    const p = pageEl(current), w = p && p.querySelector('.wg-need');
    if (!w) return;
    w.hidden = false; w.textContent = msg;
  }
  function hideNeed() { document.querySelectorAll('.wg-need').forEach(w => { if (!w.hidden) { w.hidden = true; w.textContent = ''; } }); }

  /* glow the parts that are missing, for a moment */
  let nudged = [];
  const clearNudges = () => { nudged.forEach(n => n.classList.remove('nudge')); nudged = []; };
  const nudge = list => { clearNudges(); nudged = list.filter(Boolean).slice(0, 6); nudged.forEach(n => n.classList.add('nudge')); };
  ['pointerdown', 'keydown'].forEach(t => document.addEventListener(t, () => clearNudges(), { passive: true, capture: true }));

  /* ---------------- navigation ---------------- */
  const dashes = byId('dashes');
  flow.forEach(() => dashes.append(el('li')));
  let maybeTip = () => {};   /* set below: the first-visit "How to check a line" pop-up */
  function show(name) {
    current = name; clearNudges(); hideNeed();
    document.querySelectorAll('.page').forEach(p => { p.hidden = p.dataset.page !== name; });
    const page = pageEl(name);
    page.querySelectorAll('.wg-lead,.wg-work').forEach(p => { p.scrollTop = 0; });
    const i = flow.indexOf(name);
    byId('foot').hidden = name === 'complete';
    [...dashes.children].forEach((d, j) => { d.className = j < i ? 'done' : j === i ? 'now' : ''; });
    byId('step-sr').textContent = i > -1 ? 'Step ' + (i + 1) + ' of ' + flow.length : '';
    if (i > -1) byId('counter').textContent = (i + 1) + ' / ' + flow.length;
    byId('nav-next').hidden = name === 'review';
    byId('download').hidden = name !== 'review' || st.downloaded;
    byId('finish').hidden = name !== 'review' || !st.downloaded;
    byId('nav-next').querySelector('span').textContent = name === 'practice' && !st.revealed ? 'Check my flags' : 'Continue';
    if (name === 'check') paintOutcome();
    if (name === 'practice') setTimeout(() => { if (current === 'practice') maybeTip(); }, 400);
    if (name === 'rewrite') {
      byId('rewrite-sub').textContent = usedPractice()
        ? 'Your own AI answer was correct, so fix the practice answer instead. Add the facts it got wrong, and tell the AI tool not to guess.'
        : 'Add the facts from the card that your first answer got wrong or missed. Then tell the AI tool not to guess.';
      paintPreview();
    }
    if (name === 'compare' || name === 'review') paintMeters();
    if (name === 'review') paintReviewStats();
    if (name === 'complete') paintComplete();
    updateLock();
    const h = page.querySelector('h2'); if (h) h.focus({ preventScroll: true });
  }
  function shake(msg, list) {
    need(msg);
    const card = pageEl(current).querySelector('.card');
    if (card) { card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); }
    nudge([...new Set(list.map(r => r.el))]); setTimeout(clearNudges, 2600);
    const f = list[0].el; if (f && f.focus && f !== byId('nav-next')) f.focus({ preventScroll: false });
  }
  byId('nav-next').addEventListener('click', () => {
    if (current === 'practice' && !st.revealed) {
      if (!st.flags.size) { shake('Tap at least 1 line you think is made up.', [{ el: byId('claims') }]); return; }
      /* flagging every line is not a check: some lines match the card */
      if (st.flags.size === scenario.claims.length) { shake('You flagged every line. Some lines match the card, so untick those first.', [{ el: byId('claims') }]); return; }
      hideNeed(); revealClaims(); byId('nav-next').querySelector('span').textContent = 'Continue'; updateLock(); return;
    }
    const m = missing();
    if (m.length) { shake(m[0].msg, m); return; }
    sound.tap();
    show(flow[flow.indexOf(current) + 1]);
  });
  byId('nav-back').addEventListener('click', () => {
    const i = flow.indexOf(current);
    if (i <= 0) { openCover(); return; }
    show(flow[i - 1]);
  });

  /* ---------------- start screen (the game's own, because it asks for the course) ---------------- */
  const cover = byId('saa-start'), app = byId('app');
  const laneBtns = byId('lane-pick').querySelectorAll('[role=radio]');
  laneBtns.forEach(b => {
    if (b.dataset.lane === lane) b.setAttribute('aria-checked', 'true');
    b.addEventListener('click', () => { laneBtns.forEach(x => x.setAttribute('aria-checked', String(x === b))); lane = b.dataset.lane; byId('start-status').textContent = ''; sound.tap(); });
  });
  if (params.get('lane') && lane) byId('lane-pick').hidden = true;
  function openCover() { current = 'start'; cover.hidden = false; cover.style.display = ''; cover.classList.remove('gone'); app.inert = true; byId('cover-title').focus({ preventScroll: true }); }
  byId('start').addEventListener('click', () => {
    if (!lane && !params.get('scenario')) { byId('start-status').textContent = 'Choose your course first.'; byId('lane-pick').classList.add('nudge'); setTimeout(() => byId('lane-pick').classList.remove('nudge'), 2400); return; }
    /* a learner who came back and changed course gets a case from the new course (only the practice round depends on it) */
    if (scenario && !params.get('scenario') && scenario.lane !== lane) { scenario = null; st.flags = new Set(); st.revealed = false; st.caught = 0; st.falseFlags = 0; }
    if (!scenario) { assignScenario(); renderScenario(); }
    sound.tap(); app.inert = false; cover.classList.add('gone');
    setTimeout(() => { cover.hidden = true; cover.classList.remove('gone'); }, 550);
    show('rules');
  });

  /* full AI answer: a pop-up (a long record is read by the learner, not aloud) */
  const outModal = byId('output-modal');
  const closeOut = () => { outModal.hidden = true; app.inert = false; byId('see-output').focus(); };
  byId('see-output').addEventListener('click', () => { outModal.hidden = false; app.inert = true; byId('output-close').focus(); });
  byId('output-close').addEventListener('click', closeOut);
  outModal.addEventListener('click', e => { if (e.target === outModal) closeOut(); });
  outModal.addEventListener('keydown', e => { if (e.key === 'Escape') closeOut(); if (e.key === 'Tab') { e.preventDefault(); (document.activeElement === byId('output-close') ? outModal.querySelector('.raw-output') : byId('output-close')).focus(); } });

  /* AI Fluency designer assets (Oct 2026) */
  const reduceMotion = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
  const playVid = v => { if (reduceMotion()) { v.controls = true; return; } v.controls = false; const pr = v.play(); if (pr && pr.catch) pr.catch(() => { v.controls = true; }); };
  /* practice screen: "How to check a line" tip, a pop-up on the first visit (closing it is remembered), opened again from a small link */
  const TIP_KEY = 'wg-line-tip-closed';
  const tipModal = byId('tip-modal'), tipVid = byId('line-tip-vid'), tipOpen = byId('line-tip-open');
  const openTip = () => { tipModal.hidden = false; app.inert = true; playVid(tipVid); byId('line-tip-close').focus(); };
  const closeTip = () => { tipModal.hidden = true; tipVid.pause(); app.inert = false; try { localStorage.setItem(TIP_KEY, '1'); } catch (e) { /* storage blocked */ } tipOpen.focus({ preventScroll: true }); };
  maybeTip = () => { let seen = false; try { seen = localStorage.getItem(TIP_KEY) === '1'; } catch (e) { /* storage blocked */ } if (!seen && tipModal.hidden) openTip(); };
  tipOpen.addEventListener('click', openTip);
  byId('line-tip-close').addEventListener('click', closeTip);
  tipModal.addEventListener('click', e => { if (e.target === tipModal) closeTip(); });
  tipModal.addEventListener('keydown', e => { if (e.key === 'Escape') closeTip(); if (e.key === 'Tab') { e.preventDefault(); byId('line-tip-close').focus(); } });
  /* run screen: a short "how to copy and paste" example in a pop-up */
  const copyModal = byId('copy-modal'), copyVid = byId('copy-vid');
  const closeCopy = () => { copyModal.hidden = true; copyVid.pause(); app.inert = false; byId('see-copy-demo').focus(); };
  byId('see-copy-demo').addEventListener('click', () => { copyModal.hidden = false; app.inert = true; playVid(copyVid); byId('copy-close').focus(); });
  byId('copy-close').addEventListener('click', closeCopy);
  copyModal.addEventListener('click', e => { if (e.target === copyModal) closeCopy(); });
  copyModal.addEventListener('keydown', e => { if (e.key === 'Escape') closeCopy(); if (e.key === 'Tab') { e.preventDefault(); byId('copy-close').focus(); } });

  /* typed work: warn before the page is closed */
  let typedSomething = false;
  document.addEventListener('input', e => { if (e.target.matches && e.target.matches('textarea, input[type=text]')) typedSomething = true; });
  addEventListener('beforeunload', e => { if (typedSomething) { e.preventDefault(); e.returnValue = ''; } });

  /* ---------------- copy buttons ---------------- */
  async function copy(text, btn, sel) {
    const label = btn.querySelector('span');
    try { await navigator.clipboard.writeText(text); label.textContent = 'Copied'; }
    catch (e) { const r = document.createRange(); r.selectNodeContents(sel); const s = getSelection(); s.removeAllRanges(); s.addRange(r); label.textContent = 'Selected. Press Ctrl+C'; }
    setTimeout(() => { label.textContent = 'Copy prompt'; }, 2000);
  }
  byId('copy-prompt').addEventListener('click', () => copy(scenario.prompt, byId('copy-prompt'), byId('prompt-text')));
  byId('copy-revised').addEventListener('click', () => copy(assembled(false), byId('copy-revised'), byId('preview')));

  /* ---------------- review, PDF ---------------- */
  function statChips(target, list) { const box = byId(target); box.replaceChildren(); list.forEach(t => box.append(el('span', 'chip', t))); }
  function paintReviewStats() {
    statChips('review-stats', ['Practice round: ' + (st.caught || 0) + '/' + unsupportedClaims().length + ' caught', 'Prediction: ' + (st.recall || '—'), caseLabel() + (lane ? ' · ' + (lane === 'iti' ? 'ITI' : 'Higher education') : '')]);
  }
  function paintComplete() {
    statChips('complete-stats', ['Practice round: ' + (st.caught || 0) + '/' + unsupportedClaims().length + ' caught', 'Unsupported details: ' + baseline() + ' → ' + st.count2]);
    const next = params.get('next') || NEXT_URL;
    byId('next-link').hidden = !next; if (next) byId('next-link').href = next;
    byId('restart').classList.toggle('btn-primary', !next); byId('restart').classList.toggle('btn-ghost', Boolean(next));
  }
  function record() {
    const v = id => val(id) || '[Not entered]';
    const L = [];
    const add = (h, body) => { L.push(h.toUpperCase(), body, ''); };
    L.push('Date: ' + fmt(new Date()), 'Course lane: ' + (lane === 'iti' ? 'ITI' : lane === 'he' ? 'Higher education' : '[Not set]'), 'Scenario: ' + caseLabel(), '');
    add('Provided prompt', scenario.prompt);
    add('Check card', cardText());
    add('Rules check', 'All five privacy items sorted correctly; rules confirmed.');
    add('Prediction', predictLabels() || '[None]');
    add('Practice round (spot what is made up)', (st.caught || 0) + ' of ' + unsupportedClaims().length + ' unsupported lines caught; ' + (st.falseFlags || 0) + ' supported line(s) flagged by mistake.');
    if (byId('changed-prompt').checked) add('Prompt actually used', v('assigned-prompt'));
    add('First AI answer', v('first-output'));
    add('Capture method', st.capture || '[Not entered]');
    add('Outcome', { found: 'The AI gave at least one unsupported detail.', asked: 'The AI asked for missing details or left blanks.', matched: 'Everything matched the check card.' }[st.outcome] || '[Not entered]');
    if (st.outcome === 'found') { add('Unsupported or wrong parts', v('unsupported')); add('Number of unsupported claims (first answer)', String(st.count1)); }
    else add('What kept the AI accurate', v('clean-why'));
    add('Possible consequence', v('consequence'));
    add('Checked against', v('check-source'));
    add('Was the prediction right?', st.recall || '[Not entered]');
    add('Revised prompt' + (usedPractice() ? ' (based on the practice answer)' : ''), assembled(false));
    add('Second AI answer', v('second-output'));
    add('Unsupported claims', baselineLabel() + ': ' + baseline() + '  ->  Second answer: ' + st.count2);
    add('What changed and what still needs checking', v('comparison'));
    add('One sentence to remember', v('learner-reflection'));
    L.push('Evidence checklist: ' + byId('checklist').querySelectorAll('input:checked').length + ' of 5 ticked');
    return L.join('\n');
  }
  function pdfText(s) {
    const map = { '\u2018': 145, '\u2019': 146, '\u201c': 147, '\u201d': 148, '\u2022': 149, '\u2013': 150, '\u2014': 151, '\u2026': 133, '\u00a0': 32 };
    let r = '';
    for (const ch of s) {
      if (ch === '\u20b9') { r += 'INR '; continue; }
      if (ch === '\u2192') { r += '->'; continue; }
      const p = ch.codePointAt(0), code = map[ch] || (p >= 32 && p <= 255 ? p : 63);
      if (code === 40 || code === 41 || code === 92) r += '\\' + String.fromCharCode(code);
      else if (code > 126) r += '\\' + code.toString(8).padStart(3, '0');
      else r += String.fromCharCode(code);
    }
    return r;
  }
  function wrap(text, w = 86) {
    const out = [];
    text.replace(/\r/g, '').split('\n').forEach(p => {
      if (!p) { out.push(''); return; }
      let rest = p;
      while (rest.length > w) { let e = rest.lastIndexOf(' ', w); if (e < 35) e = w; out.push(rest.slice(0, e)); rest = rest.slice(e).trimStart(); }
      out.push(rest);
    });
    return out;
  }
  function makePdf(text) {
    const lines = wrap(text), pages = [];
    for (let s = 0; s < lines.length; s += 53) pages.push(lines.slice(s, s + 53));
    const o = [];
    o[1] = '<< /Type /Catalog /Pages 2 0 R >>';
    o[2] = '<< /Type /Pages /Kids [' + pages.map((_, i) => (5 + i * 2) + ' 0 R').join(' ') + '] /Count ' + pages.length + ' >>';
    o[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>';
    o[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
    pages.forEach((pg, i) => {
      const id = 5 + i * 2;
      o[id] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ' + (id + 1) + ' 0 R >>';
      const c = ['BT /F2 17 Tf 0.055 0.106 0.31 rg 46 786 Td (Watch It Get It Wrong) Tj ET', '0.95 0.67 0.19 RG 1.5 w 46 774 m 549 774 l S'];
      pg.forEach((ln, j) => c.push('BT /F1 9 Tf 0.055 0.106 0.31 rg 46 ' + (751 - j * 13) + ' Td (' + pdfText(ln) + ') Tj ET'));
      c.push('BT /F1 8 Tf 0.36 0.4 0.56 rg 46 35 Td (Swift AI Academy) Tj ET', 'BT /F1 8 Tf 0.36 0.4 0.56 rg 480 35 Td (Page ' + (i + 1) + ' of ' + pages.length + ') Tj ET');
      const stream = c.join('\n') + '\n';
      o[id + 1] = '<< /Length ' + stream.length + ' >>\nstream\n' + stream + 'endstream';
    });
    let pdf = '%PDF-1.4\n'; const off = [0];
    for (let i = 1; i < o.length; i++) { off[i] = pdf.length; pdf += i + ' 0 obj\n' + o[i] + '\nendobj\n'; }
    const x = pdf.length;
    pdf += 'xref\n0 ' + o.length + '\n0000000000 65535 f \n';
    for (let i = 1; i < o.length; i++) pdf += String(off[i]).padStart(10, '0') + ' 00000 n \n';
    pdf += 'trailer\n<< /Size ' + o.length + ' /Root 1 0 R >>\nstartxref\n' + x + '\n%%EOF';
    return new Blob([pdf], { type: 'application/pdf' });
  }
  byId('download').addEventListener('click', () => {
    const m = missing();
    if (m.length) { shake(m[0].msg, m); return; }
    try {
      const text = record();
      const save = (blob, name) => { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000); };
      save(makePdf(text), 'watch-it-get-it-wrong-' + scenario.id + '.pdf');
      /* the PDF font has Latin letters only: answers typed in Hindi or Gujarati also go into a text file that keeps them */
      const indic = /[^\u0000-\u00ff\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u2026\u20b9\u2192]/.test(text);
      if (indic) setTimeout(() => save(new Blob(['\ufeff' + text], { type: 'text/plain;charset=utf-8' }), 'watch-it-get-it-wrong-' + scenario.id + '.txt'), 400);
      st.downloaded = true;
      const s = byId('download-status'); s.hidden = false; s.className = 'feedback ok';
      s.textContent = indic ? 'Your PDF and a text file are downloaded. The text file keeps your Hindi or Gujarati words. Open them to check, sign out of the AI tool, then press Finish and clear.'
        : 'Your PDF is downloaded. Open it to check it. Sign out of the AI tool, then press Finish and clear.';
      const again = byId('download-again') || (() => { const b = el('button', 'btn btn-ghost'); b.id = 'download-again'; b.type = 'button'; b.append(svgUse('i-down'), document.createTextNode('Download again')); b.addEventListener('click', () => { st.downloaded = false; byId('download').click(); }); s.after(b); return b; })();
      again.hidden = false;
      byId('download').hidden = true; byId('finish').hidden = false; sound.good();
    } catch (e) {
      const s = byId('download-status'); s.hidden = false; s.className = 'feedback no'; s.textContent = 'The PDF could not be created. Keep this page open and try again.'; sound.bad();
    }
  });

  /* ---------------- finish, modal, clear ---------------- */
  const modal = byId('confirm-modal');
  const closeModal = () => { modal.hidden = true; app.inert = false; byId('finish').focus(); };
  byId('finish').addEventListener('click', () => { modal.hidden = false; app.inert = true; byId('confirm-cancel').focus(); });
  byId('confirm-cancel').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key !== 'Tab') return;
    const f = byId('confirm-cancel'), l = byId('confirm-ok');
    if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); } else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
  });
  byId('confirm-ok').addEventListener('click', () => { modal.hidden = true; app.inert = false; const summary = { caught: st.caught, total: unsupportedClaims().length, a: baseline(), b: st.count2 }; clearAll(); showComplete(summary); });
  function clearAll() {
    document.querySelectorAll('textarea, input[type=text]').forEach(i => { i.value = ''; });
    document.querySelectorAll('input[type=checkbox]').forEach(i => { i.checked = false; });
    document.querySelectorAll('[role=radio]').forEach(b => { if (!b.dataset.lane) b.setAttribute('aria-checked', 'false'); if (b.classList.contains('chip')) b.setAttribute('aria-pressed', 'false'); });
    document.querySelectorAll('.field.done').forEach(f => f.classList.remove('done'));
    byId('changed-wrap').hidden = true; byId('download-status').hidden = true;
    const again = byId('download-again'); if (again) again.hidden = true;
    byId('hint-btn').textContent = 'Show a hint';
    ['count1', 'count2'].forEach(k => { byId(k).textContent = '0'; });
    previousId = scenario ? scenario.id : previousId;
    typedSomething = false;
    resetState();
    renderPredict();
  }
  function showComplete(sum) {
    show('complete');
    statChips('complete-stats', ['Practice round: ' + (sum.caught || 0) + '/' + sum.total + ' caught', 'Unsupported details: ' + sum.a + ' → ' + sum.b]);
    scenario = null;
  }
  /* Start again really starts again: a fresh page (the case just done is not given twice in a row) */
  byId('restart').addEventListener('click', () => {
    try { if (previousId) sessionStorage.setItem('wigw-prev', previousId); } catch (e) {}
    typedSomething = false; location.reload();
  });

  /* ---------------- init (the shared layer scales the page) ---------------- */
  renderPredict();
  app.inert = true;
  window.__wigw = { get scenario() { return scenario; }, st };
})();
