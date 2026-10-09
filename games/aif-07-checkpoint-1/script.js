/* ============================================================
   Swift AI Academy | AAI-E-MC1-S04-CHAL01
   Checkpoint 1: Use It, and Check It  (Challenge Day, CHAL, 1.00 h)
   Mapped PCs: All PCs in this micro-credential
   Non-compensatory: All gates in this unit apply
   ------------------------------------------------------------
   One file, no build step, no network calls. Work is saved on
   this device only (localStorage), so a refresh never loses it.
   The answer key below is encoded so it is not readable at a
   glance. It is NOT secure. For live delivery, keep this device
   with the assessor between candidates.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- configuration ---------------- */
  var CONFIG = {
    schema: 'AAI-E-MC1-S04-CHAL01',
    title: 'Checkpoint 1: Use It, and Check It',
    module: 'AAI-E-MC1: Use an approved AI tool to complete a routine task and check the result before using it',
    section: '1.4 Checkpoint Assessment',
    pcs: 'All PCs in this micro-credential',
    gates: 'All gates in this unit apply',
    readSec: 5 * 60,       // 0:00 to 5:00 read
    workEndSec: 25 * 60,   // 5:00 to 25:00 make and check
    totalSec: 30 * 60,     // 25:00 to 30:00 submit evidence
    wordLimit: 80,
    passPct: 70,           // PROPOSED: mirrors the 70 percent mastery standard used for EVAL. Confirm before release.
    storageKey: 'saa-mc1-chal01-v1'
  };

  var WEIGHTS = { task: 20, request: 20, checking: 25, correction: 25, evidence: 10 };

  var STEP_NAMES = ['Read', 'Check the draft', 'Ask the AI', 'Improve', 'Finish', 'Submit'];

  /* ---------------- icons (single line, 1.75 stroke) ---------------- */
  var P = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.2 9.2a2.9 2.9 0 0 1 5.6 1c0 1.9-2.8 2.6-2.8 2.6M12 16.6h.01"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    doc: '<path d="M14 3H6.5A2.5 2.5 0 0 0 4 5.5v13A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
    pause: '<path d="M9 5v14M15 5v14"/>',
    play: '<path d="M7 5l12 7-12 7z"/>',
    offline: '<path d="M3 3l18 18M8.6 16.4a5 5 0 0 1 6.8 0M5.2 12.9a10 10 0 0 1 4.3-2.4M18.8 12.9a10 10 0 0 0-1.7-1.3M2 9a15 15 0 0 1 4-2.6M22 9a15 15 0 0 0-8.4-3.9M12 20h.01"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    print: '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15.4-6.4L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.4 6.4L3 16M3 21v-5h5"/>',
    pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    book: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5c.8 0 1.5-.7 1.5-1.5z"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    gate: '<path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-7h6v7"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>'
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[name] || '') + '</svg>';
  }

  /* ---------------- task variants (fictional practice data) ----------------
     Every variant follows the same pattern so difficulty is controlled:
     7 draft lines, 1 planted claim that is not in the fact sheet,
     1 harmless line, 1 fact left out, 89 to 100 words, target 80 or fewer. */
  var ITI_ORG = 'Government ITI Sundarpur';
  var HE_ORG = 'Sardar Nagar College';

  var VARIANTS = {
    'ITI-A': {
      lane: 'iti', letter: 'A', org: ITI_ORG,
      title: 'Tool room stock check notice',
      scenario: 'You are a trainee in the Fitter trade, 2nd year, Batch B. Your instructor, Ms. Kavita Rao, needs a short notice for the batch WhatsApp group.',
      job: 'Make a short notice about the tool room stock check.',
      standard: ['Correct date, time and place', 'What to bring and what to wear', 'What to do about a missing tool', '80 words or fewer', 'Polite and easy to read', 'Only facts from the fact sheet'],
      facts: [
        ['What', 'Stock check of hand tools'],
        ['Who', 'Fitter trade, 2nd year, Batch B'],
        ['Date', 'Saturday, 14 November 2026'],
        ['Time', '10:00 am to 12:30 pm'],
        ['Place', 'Tool Room 2'],
        ['Bring', 'Tool issue record book and a pen'],
        ['Wear', 'Uniform and safety shoes'],
        ['Missing tool', 'Tell the store keeper, Mr. Anil Verma, before Friday, 13 November, 5:00 pm'],
        ['Questions', 'Ms. Kavita Rao, Instructor']
      ],
      author: 'Rohan',
      draft: [
        'Dear trainees of Batch B, a stock check of hand tools will be held in Tool Room 2.',
        'It is on Saturday, 14 November 2026, from 10:00 am to 12:30 pm.',
        'Please bring your tool issue record book and a pen.',
        'If any tool is missing, tell the store keeper, Mr. Anil Verma, before Friday, 13 November, 5:00 pm.',
        'Any trainee with a missing tool will pay a fine of \u20B9500 at the ITI office.',
        'Kindly note that this is very important and everybody must attend on time without fail.',
        'For any questions, please contact Ms. Kavita Rao, Instructor.'
      ],
      offline: {
        ask: 'Notice: Tool Room Stock Check\n\nDear Batch B trainees,\n\nA stock check of hand tools will be held in Tool Room 2 on Saturday, 14 November 2026, from 10:00 am to 12:30 pm.\n\n- Bring your tool issue record book and a pen.\n- If a tool is missing, inform the store keeper, Mr. Anil Verma, before Friday, 13 November, 5:00 pm.\n- Any trainee with a missing tool will pay a fine of \u20B9500.\n\nFor questions, contact Ms. Kavita Rao, Instructor.',
        improve: 'Tool Room Stock Check: Batch B\n\nDate: Saturday, 14 November 2026\nTime: 10:00 am to 12:30 pm\nPlace: Tool Room 2\n\n- Bring your tool issue record book and a pen.\n- Wear your uniform and safety shoes.\n- Missing tool? Tell the store keeper, Mr. Anil Verma, before Friday, 13 November, 5:00 pm. A fine of \u20B9500 applies for missing tools.\n\nQuestions: Ms. Kavita Rao, Instructor.'
      }
    },
    'ITI-B': {
      lane: 'iti', letter: 'B', org: ITI_ORG,
      title: 'Industrial visit notice',
      scenario: 'You are a trainee in the Electrician trade, 1st year, Batch A. Your instructor, Mr. Suresh Patil, needs a short notice for the batch WhatsApp group.',
      job: 'Make a short notice about the industrial visit.',
      standard: ['Correct date, bus time and return time', 'What to bring and what to wear', 'The photo rule and the consent form', '80 words or fewer', 'Polite and easy to read', 'Only facts from the fact sheet'],
      facts: [
        ['What', 'Industrial visit to Nirmal Motor Works'],
        ['Who', 'Electrician trade, 1st year, Batch A'],
        ['Date', 'Thursday, 19 November 2026'],
        ['Bus leaves', 'ITI main gate at 8:30 am'],
        ['Back at ITI', 'By 3:00 pm'],
        ['Bring', 'ITI ID card, notebook, pen and lunch box'],
        ['Wear', 'Uniform and safety shoes'],
        ['Rule', 'No photos inside the factory'],
        ['Consent form', 'Give it to Mr. Suresh Patil by Tuesday, 17 November'],
        ['Questions', 'Mr. Suresh Patil, Instructor']
      ],
      author: 'Deepak',
      draft: [
        'Hello Batch A, we are going on an industrial visit to Nirmal Motor Works on Thursday, 19 November 2026.',
        'The bus will leave from the ITI main gate at 8:30 am, and we will be back by 3:00 pm.',
        'Please bring your ITI ID card, notebook, pen and lunch box.',
        'The company will give a visit certificate to every trainee at the end of the day.',
        'Wear your uniform and safety shoes. Photos are not allowed inside the factory.',
        'This visit is a great chance to learn.',
        'For any questions, please contact Mr. Suresh Patil, Instructor.'
      ],
      offline: {
        ask: 'Industrial Visit: Batch A\n\nDear trainees,\n\nWe will visit Nirmal Motor Works on Thursday, 19 November 2026. The bus leaves the ITI main gate at 8:30 am and returns by 3:00 pm.\n\n- Bring your ITI ID card, notebook, pen and lunch box.\n- Wear your uniform and safety shoes.\n- No photos inside the factory.\n- Every trainee will get a visit certificate from the company.\n\nFor questions, contact Mr. Suresh Patil, Instructor.',
        improve: 'Industrial Visit: Batch A\n\nDate: Thursday, 19 November 2026\nBus: ITI main gate, 8:30 am. Back by 3:00 pm.\n\n- Bring: ITI ID card, notebook, pen, lunch box.\n- Wear: uniform and safety shoes.\n- No photos inside the factory.\n- Give your consent form to Mr. Suresh Patil by Tuesday, 17 November.\n- You will get a visit certificate at the end of the day.\n\nQuestions: Mr. Suresh Patil, Instructor.'
      }
    },
    'ITI-C': {
      lane: 'iti', letter: 'C', org: ITI_ORG,
      title: 'Practical class change notice',
      scenario: 'You are a trainee in the Turner trade, 2nd year, Batch C. Your instructor, Ms. Farzana Khan, needs a short notice for the batch WhatsApp group.',
      job: 'Make a short notice about the change in the practical class.',
      standard: ['Correct dates, times and rooms', 'What to bring and what to wear', 'Where the practical class moves to', '80 words or fewer', 'Polite and easy to read', 'Only facts from the fact sheet'],
      facts: [
        ['What', 'Machine shop closed for maintenance'],
        ['Who', 'Turner trade, 2nd year, Batch C'],
        ['Closed on', 'Wednesday, 18 November 2026. No practical class that day.'],
        ['Instead', 'Theory class in Room 12 at 9:30 am'],
        ['Bring', 'Drawing book and calculator'],
        ['Make-up practical', 'Saturday, 21 November 2026, 9:30 am, Machine Shop'],
        ['Wear on Saturday', 'Uniform and safety shoes'],
        ['Questions', 'Ms. Farzana Khan, Instructor']
      ],
      author: 'Vikram',
      draft: [
        'Dear Batch C, the machine shop will be closed for maintenance on Wednesday, 18 November 2026.',
        'There will be no practical class on that day.',
        'Instead, please come to Room 12 at 9:30 am for a theory class.',
        'The practical class will happen on Saturday, 21 November 2026, at 9:30 am in the Machine Shop.',
        'Attendance in the Saturday class will be counted double in your record.',
        'Please wear your uniform and safety shoes on Saturday, and ask Ms. Farzana Khan if you have any questions.',
        'We hope everyone will understand and cooperate with this change.'
      ],
      offline: {
        ask: 'Notice: Change in Practical Class, Batch C\n\nThe machine shop is closed for maintenance on Wednesday, 18 November 2026. There is no practical class that day.\n\n- Theory class: Room 12, 9:30 am.\n- Make-up practical: Saturday, 21 November 2026, 9:30 am, Machine Shop.\n- Saturday attendance will be counted double.\n- Wear uniform and safety shoes on Saturday.\n\nQuestions: Ms. Farzana Khan, Instructor.',
        improve: 'Batch C: Practical Class Change\n\nWednesday, 18 November 2026: Machine shop closed. No practical.\nTheory class instead: Room 12, 9:30 am. Bring your drawing book and calculator.\n\nSaturday, 21 November 2026: Practical class, 9:30 am, Machine Shop. Wear uniform and safety shoes. Attendance on Saturday counts double.\n\nQuestions: Ms. Farzana Khan, Instructor.'
      }
    },
    'HE-A': {
      lane: 'he', letter: 'A', org: HE_ORG,
      title: 'Library orientation notice',
      scenario: 'You are a first-year student in Section A. Your class representative asks you to write a short notice for the class WhatsApp group.',
      job: 'Make a short notice about the library orientation.',
      standard: ['Correct date, time and place', 'What to bring', 'When to return the library card form', '80 words or fewer', 'Polite and easy to read', 'Only facts from the fact sheet'],
      facts: [
        ['What', 'Library orientation session'],
        ['Who', 'First-year students, Section A'],
        ['Date', 'Monday, 16 November 2026'],
        ['Time', '11:00 am to 12:00 pm'],
        ['Place', 'Seminar Hall 2'],
        ['Bring', 'College ID card'],
        ['At the session', 'Library card forms will be given out'],
        ['Form last date', 'Return it to the library counter by Friday, 20 November 2026'],
        ['Questions', 'Ms. Neha Joshi, Librarian']
      ],
      author: 'Aarti',
      draft: [
        'Dear friends of Section A, there is a library orientation session for all first-year students.',
        'It will be on Monday, 16 November 2026, from 11:00 am to 12:00 pm in Seminar Hall 2.',
        'Please bring your college ID card.',
        'Library card forms will be given out at the session.',
        'Students who miss this session cannot borrow library books for the whole semester.',
        'It will be a very useful session for all of us, so please do come on time.',
        'For any questions, please contact Ms. Neha Joshi, our Librarian.'
      ],
      offline: {
        ask: 'Library Orientation: Section A\n\nDear classmates,\n\nThere is a library orientation session for first-year students on Monday, 16 November 2026, from 11:00 am to 12:00 pm in Seminar Hall 2.\n\n- Bring your college ID card.\n- Library card forms will be given at the session.\n- If you miss the session, you cannot borrow books this semester.\n\nFor questions, contact Ms. Neha Joshi, Librarian.',
        improve: 'Library Orientation: Section A\n\nDate: Monday, 16 November 2026\nTime: 11:00 am to 12:00 pm\nPlace: Seminar Hall 2\n\n- Bring your college ID card.\n- Collect your library card form at the session and return it to the library counter by Friday, 20 November 2026.\n- Students who miss the session cannot borrow books this semester.\n\nQuestions: Ms. Neha Joshi, Librarian.'
      }
    },
    'HE-B': {
      lane: 'he', letter: 'B', org: HE_ORG,
      title: 'Tree plantation drive notice',
      scenario: 'You are a first-year student and a volunteer in the college NSS unit. The NSS coordinator asks you to write a short notice for the volunteers\u2019 WhatsApp group.',
      job: 'Make a short notice about the tree plantation drive.',
      standard: ['Correct date, time and meeting place', 'What to bring and what to wear', 'How and when to register', '80 words or fewer', 'Polite and easy to read', 'Only facts from the fact sheet'],
      facts: [
        ['What', 'Campus tree plantation drive'],
        ['Who', 'First-year NSS volunteers'],
        ['Date', 'Saturday, 21 November 2026'],
        ['Time', '7:30 am to 10:00 am'],
        ['Meet at', 'College main gate'],
        ['Bring', 'Water bottle and cap'],
        ['Wear', 'Comfortable shoes'],
        ['Register', 'Give your name to your class coordinator by Thursday, 19 November'],
        ['Questions', 'Prof. Imran Shaikh, NSS Coordinator']
      ],
      author: 'Sneha',
      draft: [
        'Dear NSS volunteers, this is to inform you that our college is holding a tree plantation drive on our campus.',
        'It is on Saturday, 21 November 2026, from 7:30 am to 10:00 am.',
        'We will meet at the college main gate.',
        'Every volunteer will get 2 extra marks in internal assessment for joining.',
        'Please bring a water bottle and a cap, and wear comfortable shoes.',
        'Let us all come together and make our campus green and beautiful for everyone.',
        'For any questions, please contact Prof. Imran Shaikh, NSS Coordinator.'
      ],
      offline: {
        ask: 'Tree Plantation Drive: NSS\n\nDear volunteers,\n\nJoin our campus tree plantation drive on Saturday, 21 November 2026, from 7:30 am to 10:00 am. We will meet at the college main gate.\n\n- Bring a water bottle and a cap.\n- Wear comfortable shoes.\n- Every volunteer gets 2 extra marks in internal assessment.\n\nFor questions, contact Prof. Imran Shaikh, NSS Coordinator.',
        improve: 'NSS Tree Plantation Drive\n\nDate: Saturday, 21 November 2026\nTime: 7:30 am to 10:00 am\nMeet at: College main gate\n\n- Bring a water bottle and a cap. Wear comfortable shoes.\n- Register: give your name to your class coordinator by Thursday, 19 November.\n- Volunteers get 2 extra marks in internal assessment.\n\nQuestions: Prof. Imran Shaikh, NSS Coordinator.'
      }
    },
    'HE-C': {
      lane: 'he', letter: 'C', org: HE_ORG,
      title: 'Assignment reminder',
      scenario: 'You are a first-year student in Section B. Your Environmental Studies teacher asks you to write a short reminder for the class WhatsApp group.',
      job: 'Make a short reminder about the assignment.',
      standard: ['Correct topic, length and cover page', 'Correct last date and time', 'Where to submit', '80 words or fewer', 'Polite and easy to read', 'Only facts from the fact sheet'],
      facts: [
        ['Subject', 'Environmental Studies assignment'],
        ['Who', 'First-year students, Section B'],
        ['Topic', 'Water use in our college'],
        ['Length', '4 to 5 handwritten pages'],
        ['Cover page', 'Your name, roll number and section'],
        ['Last date', 'Friday, 20 November 2026, 4:00 pm'],
        ['Submit at', 'Department office, Room 104'],
        ['Questions', 'Dr. Meera Iyer, Subject teacher']
      ],
      author: 'Karan',
      draft: [
        'Dear Section B, this is a friendly reminder about our Environmental Studies assignment that is due soon.',
        'The topic is \u201CWater use in our college\u201D.',
        'It must be 4 to 5 handwritten pages, with a cover page showing your name, roll number and section.',
        'The last date is Friday, 20 November 2026, at 4:00 pm.',
        'Late assignments will lose 5 marks for every day after the last date.',
        'Please do your best work and make sure you submit it on time.',
        'For any questions, please ask Dr. Meera Iyer.'
      ],
      offline: {
        ask: 'Reminder: Environmental Studies Assignment\n\nDear Section B,\n\n- Topic: Water use in our college\n- Length: 4 to 5 handwritten pages\n- Cover page: name, roll number and section\n- Last date: Friday, 20 November 2026, 4:00 pm\n- Late assignments lose 5 marks for each day.\n\nFor questions, ask Dr. Meera Iyer.',
        improve: 'Reminder: EVS Assignment, Section B\n\nTopic: Water use in our college\nLength: 4 to 5 handwritten pages, with a cover page (name, roll number, section)\nSubmit at: Department office, Room 104\nLast date: Friday, 20 November 2026, 4:00 pm\nLate submissions lose 5 marks per day.\n\nQuestions: Dr. Meera Iyer.'
      }
    }
  };

  /* ---------------- assessor-only key (encoded) ---------------- */
  var KEY = (function (blob) {
    try {
      var b64 = blob.split('').reverse().join('');
      return JSON.parse(decodeURIComponent(escape(atob(b64))));
    } catch (e) { return {}; }
  })('==Qf91lIlNWamZ2bgQnbl1GdyFGclRmIgwiI0ATMisFI6IyckJ3bXdmbpN3cp1mIgwiI0ATMg02bvJFIsU2YpZmZvBCduVWb0JXYwVGRgoDdhBCdp1mY1NlIgojIn5WazNXatJCIs0lIy9mZgM3ayFWbiACLiIXZwBycrJXYtJCIsIycrJXYtBSNiACLiU2cvxmIbBiOiMHZy92ViFmZiACLi4Se0xWYuVGcgknbhBCZkFGI09mbg8GRg4SZulGbgUGa0BSZ29WblJlIgojIu9Wa0NWYiACLi4Cbhl2YpZmZvByck5WdvNHI0FGa0BSZsVncgEGIkVGZkFGIJFEIlhGVg4Se0xWYuVGcgUGdhxGIhBCd19mYhByZulGa09mbgMXehNHI0VWZoNHI0NWYmBSZoRlIgojI5h2diACLi4SZ0FGZgQ3chxGIlhGdgIXZ0ZWYgkXYkBSeyVmdlBicvZGIztmch1GI1ASZz9GbgwGbpdHIzRnbl1mbnl2czFGIlRXYMJCI6ISbpFGbjJCIsQDI6IiYhZmIgwSXis2biACLiwWYyRXdl5mIgwiIiFmZiACLis2biACLis2biACLis2biACLis2bisFI6Iycl5WasJyegojID1SRIJCIs0XXiIXZi1WZ29mbgkTMiACLiIXZ0NXanVmcisFI6IyckJ3bXdmbpN3cp1mIgwiIyVmYtVmdv5EI5EDIskXYkNnc1hGVgknYgI3b0FmbpRmcv92YgM3chx2YgIXdvlHIvRHIl1WYuBic19WegUmdpdGI6IXZ0NXanVmUiAiOicmbpN3cp1mIgwSXiQnbl12czV2czFGIsFmbyVGdulmIgwiIztmch1GIyICIsIycrJXYtBSYyRHelJyWgojIzRmcvdlYhZmIgwiIuM3ayFWbgknbhBSZzlWbvJHcgQ3buBybEBiLl5WasBSZoRHIlZ3btVmUiAiOi42bpR3YhJCIsIiLsFWZyByck5WdvNHI0FGa0BSZzlWbvJHcgEGIkVGZkFGIJFEIlhGVg4ycrJXYtBCd19mYhByZulGa09mbgMXehNHI0VWZoNHI0NWYmBSZoRlIgojI5h2diACLi4yZulmbp9magI3bmBCduVWbzNXZzNXYgwWYuJXZ05Wag4WagM3ayFWbgEmc0hXZgIDI0V2ZgwGbpdHIyVWZ05Wds9mdgknclZXRiAiOi0Wahx2YiACLzAiOiIWYmJCIs0lIr9mIgwiIsFmc0VXZuJCIsIyavJCIsIiYhZmIgwiIr9mIgwiIr9mIgwiIr9mIbBiOiMXZulGbisHI6IiQtUESiACL91lIyVmYtVmdv5GIwIjIgwiIyVGduV3bjJyWgojIzRmcvd1Zul2czlWbiACLiYjMwIDIyVmYtVmdv5EIwIDIskXYklmcGBSeiBiclRnb192YgknchJnYpxGIlhGdg8GdgQXag4mc1RXZyBiOlRXYkBCdzFGbg0mcvZkIgojIn5WazNXatJCIs0lIyVGdzVWblNHIzlGa0JCIsIiclR3cl1WZzBSZs9Ga3JCIsIydvJncvJGI09mbuF2YisFI6IyckJ3bXJWYmJCIsIiL5RHbh5WZwBSeuFGIkRWYgQ3buBybEBiLl5WasBSZoRHIlZ3btVmUiAiOi42bpR3YhJCIsIiLsFWajlmZm9GIzRmb192cgQXYoRHIlxWdyBSYgQWZkRWYgkUQgUGaUBiLuFmYgcmbpd3byJ3biBSYgQXdvJWYgcmbphGdv5GIzlXYzBCdlVGazBCdjFmZgUGaUJCI6ISeodnIgwiIuIXZ0NXZtV2cgUGbvh2dgUGa0BicvZGIzt2bvJGI5JXYyJWasBydvJncvJGI09mbuF2Yg42bpN3clNHIzlGa0ByczlWbg8Ga3Byc05WZkVHdTJCI6ISbpFGbjJCIsQDI6IiYhZmIgwSXis2biACLiwWYyRXdl5mIgwiIiFmZiACLis2biACLis2biACLis2biACLis2bisFI6Iycl5WasJyegojIB1SRIJCIs0XXiI3b0FGb1NGbhNmIgwiIn5Wa3FmckJyWgojIzRmcvd1Zul2czlWbiACLiI3b0FGb1NGbhNGIk5WYgs2bvJGIn5Wa3FmckBiOn5WayJkIgojIn5WazNXatJCIs0lIlxmY19GZisFI6IyckJ3bXJWYmJCIsIiLkVGduV3bjBycpBSZj5WYk5WZ0RXYgc3boBCd19mYhByZulGa0lnbhBSehNHI09mbg8GRg4SZulGbgUGa0BSZ29WblJlIgojIu9Wa0NWYiACLi4Cbhl2YpZmZvByck5WdvNHI0FGa0BSZsVncgEGIkVGZkFGIJFEIlhGVg4SZj5WYk5WZ0RXYgUGbiV3bkBCd19mYhByZulGa09mbgMXehNHI0VWZoNHI0NWYmBSZoRlIgojI5h2diACLi4CZy92YlJHIyV3b5BibpBSZsJWdvRGIkVGduV3bjBSZiBCbsl2dgM3chx2YgkXYkJXd0F2UgUGa0BibpBSZj5WYk5WZ0RXQiAiOi0Wahx2YiACL0AiOiIWYmJCIs0lIsFmc0VXZuJCIsIyavJCIsIiYhZmIgwiIr9mIgwiIr9mIgwiIr9mIgwiIr9mIbBiOiMXZulGbisHI6IyQtkEVJJCIs0XXiQnblNnbvNmIbBiOiMHZy92Vn5WazNXatJCIsIiclJWblZ3bOByNxACL5FGZzVWdUBSeiBCbpRXYQBCazVmc1NFIuIXTg8GdgQXagUmdpdGI60mcvZGI05WZz52bDJCI6IyZul2czlWbiACLdJSZ0F2YpZWa0JXZjJyWgojIzRmcvdlYhZmIgwiIuUGdhNWamlGdyV2YgEGIlNXat9mcwBCdv5GIvREIuUmbpxGIlhGdgUmdv1WZSJCI6IibvlGdjFmIgwiIuwWYlJHIzRmb192cgQXYoRHIlNXat9mcwBSYgQWZkRWYgkUQgUGaUBiLlRXYjlmZpRnclNGIhBCd19mYhByZulGa09mbgMXehNHI0VWZoNHI0NWYmBSZoRlIgojI5h2diACLi4SehRGIlhGdgY2bgQmblBSZoRHI0FGIlVmbpFmc0BSeyVmdlByb0BSZ0F2YpZWa0JXZjBCdpNXa2BSYgUmdpdGIsxWa3BSeuFGct92YgUGaUJCI6ISbpFGbjJCIsMDI6IiYhZmIgwSXis2biACLiwWYyRXdl5mIgwiIr9mIgwiIiFmZiACLis2biACLis2biACLis2bisFI6Iycl5WasJyegojIC1SSUlkIgwSfdJSZvh2cisFI6IyckJ3bXdmbpN3cp1mIgwiIzV2boNHI5RXZmF2cgQmbhBSby9mZp5WdgojchV2ViAiOicmbpN3cp1mIgwSXiY2bgUmbpZmIgwiIwATNiACLiADM1krgiLyWgojIzRmcvdlYhZmIgwiIuQnb19WbhBicvBSZulmZgknbhBCZkFGI09mbg8GRg4SZulGbgUGa0BSZ29WblJlIgojIu9Wa0NWYiACLi4Cbhl2YpZmZvByck5WdvNHI0FGa0BSZsVncgEGIkVGZkFGIJFEIlhGVg4SZulmZgEGI0V3biFGIn5WaoR3buByc5F2cgQXZlh2cgQ3YhZGIlhGViAiOikHa3JCIsIiLlNWamZ2bgkEVJBSZoRHI0FGIwATN5Ko4gY2bgUmbpZGIhBSehBHIsxWa3BCbv9GdgcmbpN3cp1GIhBCa0l2dgUWZulWYyRHI55WQiAiOi0Wahx2YiACL0AiOiIWYmJCIs0lIr9mIgwiIsFmc0VXZuJCIsIiYhZmIgwiIr9mIgwiIr9mIgwiIr9mIgwiIr9mIbBiOiMXZulGbisHI6ISQtkEVJJye');

  /* ---------------- rubric ---------------- */
  var CRITERIA = [
    { id: 'task', name: 'Task completion', anchors: [
      'No usable notice was produced.',
      'One key fact is missing or wrong, or the notice is well over 80 words.',
      'All key facts are correct. One small issue with length or wording.',
      'Every fact from the fact sheet is there and correct. 80 words or fewer. Clear and polite.'
    ] },
    { id: 'request', name: 'Request quality: framing and refining', anchors: [
      'No request recorded, or the AI tool was not used.',
      'The request is vague (for example \u201Cwrite a notice\u201D), or the follow-up is general (\u201Cmake it better\u201D).',
      'The first request is clear and has most parts. The follow-up asks for a specific change.',
      'The first request gives a role, context, task and format, and gives the AI the facts. The follow-up names a specific fix and the answer improves.'
    ] },
    { id: 'checking', name: 'Checking process', anchors: [
      'No checking recorded.',
      'Some lines checked, but the planted line was marked as matching, or many lines were left unmarked.',
      'The planted line was flagged. One correct line was wrongly flagged, or one line was left unmarked.',
      'Every line marked. The planted line flagged. No correct line flagged as wrong. The final was checked against the fact sheet.'
    ] },
    { id: 'correction', name: 'Correction quality', anchors: [
      'The planted claim is still in the final notice.',
      'The planted claim was removed without a reason, or softened but still there in meaning.',
      'The planted claim was removed with a reason. One small fact issue remains.',
      'The planted claim was removed and the reason says it is not in the fact sheet. The missing fact was added. No new errors.'
    ] },
    { id: 'evidence', name: 'Evidence submission', anchors: [
      'Nothing usable was submitted.',
      'Two or more items are missing. Changes are hard to trace.',
      'One item is thin, but the record still shows what the AI produced and what the learner changed.',
      'Both requests, both AI answers, the final notice and the change note are present and readable.'
    ] }
  ];
  var LEVEL_NAMES = ['Not shown', 'Developing', 'Meets', 'Strong'];

  /* ---------------- Oct 2026 upgrade: Swift AI Academy frame, ESL screens ----------------
     The learner sees one short screen at a time: heading and task on the left, one activity on the right.
     Data, answer key, rubric, weights, pass mark, timings, scoring and the evidence record are unchanged.
     Gates added: every step the learner is told to do must be done before Next (time rules still win:
     at 5:00 reading ends, at 25:00 work locks, at 30:00 the work is submitted). */

  /* short card fronts for "A good notice has" (the back of each card is the variant's own standard line) */
  var STD_FRONT = {
    'ITI-A': ['Date, time and place', 'Bring and wear', 'Missing tool'],
    'ITI-B': ['Date and times', 'Bring and wear', 'Photos and consent'],
    'ITI-C': ['Dates, times and rooms', 'Bring and wear', 'New class'],
    'HE-A': ['Date, time and place', 'What to bring', 'Library card form'],
    'HE-B': ['Date, time and place', 'Bring and wear', 'Registration'],
    'HE-C': ['Topic, length, cover page', 'Last date', 'Where to submit']
  };
  var STD_FRONT_SHARED = ['Word limit', 'Tone', 'Facts only'];
  /* one line icon per card front (designer assets, Oct 2026); the same icon repeats on the standard check (5b) */
  var STD_ICON = {
    'Date, time and place': 'date', 'Date and times': 'date', 'Dates, times and rooms': 'date', 'Last date': 'date',
    'Bring and wear': 'safe-workshop', 'What to bring': 'safe-workshop', 'Missing tool': 'missing',
    'Registration': 'sign', 'Library card form': 'sign', 'Where to submit': 'send', 'Topic, length, cover page': 'format',
    'Photos and consent': 'consent', 'New class': 'new-class',
    'Word limit': 'word-limit', 'Tone': 'tone', 'Facts only': 'fact'
  };
  /* icons go on every card or on none */
  function stdIcons() {
    var v = V(), fr = (STD_FRONT[S.setup.variant] || []).concat(STD_FRONT_SHARED);
    var ics = v.standard.map(function (_, n) { return STD_ICON[fr[n]] || ''; });
    return ics.every(Boolean) ? ics : ics.map(function () { return ''; });
  }

  /* the learner's work screens: [step, sub, id] */
  var WS = [
    [1, 0, 'read'], [1, 1, 'draft'],
    [2, 0, 'lines'], [2, 1, 'missing'],
    [3, 0, 'write'], [3, 1, 'copy'], [3, 2, 'paste'],
    [4, 0, 'follow'], [4, 1, 'paste2'],
    [5, 0, 'final'], [5, 1, 'standard'],
    [6, 0, 'note'], [6, 1, 'submit']
  ];
  var WELCOME_N = 3, TOTAL_N = WELCOME_N + WS.length;
  var STEP_EB = ['Read', 'Check', 'Ask the AI', 'Improve', 'Finish', 'Submit'];

  /* gate messages (each one is spoken: audio/vo has a clip for every text) */
  var MSG = {
    mark: function (n) { return 'Mark line ' + n + ' first.'; },
    fix: function (n) { return 'For line ' + n + ', choose Remove it or Change it.'; },
    fixText: function (n) { return 'Write the new words for line ' + n + '.'; },
    missAns: 'Tap Yes or No first.',
    missText: 'Write what is missing.',
    signs: 'Use words, not only signs or emoji.',
    req1: 'Write your request first.',
    req1Short: 'Your request is too short. Say what the AI should make.',
    ans1: 'Paste the AI answer to go on.',
    ansOffline: 'Ask your assessor to add the AI answer.',
    ansShort: 'This is too short for an AI answer. Paste the whole answer.',
    ansIsReq: 'This is your request. Paste the answer from the AI tool.',
    req2: 'Write your follow-up request.',
    req2Open: 'Finish your sentence. Say exactly what to change.',
    req2Short: 'Your follow-up request is too short. Say exactly what to change.',
    req2Same: 'Write a new request. Ask for one clear change.',
    ans2: 'Paste the new AI answer to go on.',
    ans2Same: 'This is the first AI answer again. Paste the new answer.',
    final: 'Your final notice is empty.',
    finalShort: 'Your final notice is too short. Write the whole notice.',
    ticks: 'Answer every point: tap Yes or Not yet.',
    note: 'Finish one pair: what you changed, and why.'
  };
  function allMessages() {
    var out = [];
    Object.keys(MSG).forEach(function (k) {
      if (typeof MSG[k] === 'function') { for (var n = 1; n <= 7; n++) { out.push(MSG[k](n)); } } else { out.push(MSG[k]); }
    });
    return out;
  }

  /* ---------------- state ---------------- */
  function blank() {
    return {
      v: 1,
      screen: 'setup',
      setup: { learnerId: '', assessor: '', centre: '', lane: 'iti', variant: '', tool: '', mode: 'online', pin: '' },
      attempt: 1, prevVariants: [],
      step: 1, maxStep: 1, sub: 0, wsub: 0, lineAt: 0, kits: {},
      startedAt: null, pausedAt: null, pausedTotal: 0, fired: {}, locked: false,
      confBefore: null, confAfter: null,
      marks: [], missing: { ans: null, text: '' },
      req1: { mode: 'builder', role: '', context: '', task: '', format: '', extra: '', free: '', facts: false, draft: false },
      ans1: '', req2: '', ans2: '', finalText: '', finalSeeded: false, showDiff: false,
      ticks: [],
      note: { removed: '', removedWhy: '', added: '', addedWhy: '' },
      offline: { ask: false, improve: false },
      log: [], obs: [],
      submittedAt: null, elapsedAtSubmit: null, autoSubmitted: false,
      scoring: { levels: {}, gate: { detected: null, corrected: null, others: null }, independent: null, notes: '', moderation: '', decision: null, decidedAt: null },
      aTab: 'evidence'
    };
  }

  var S = load();
  var assessorOpen = false;     // session only: assessor view needs the PIN after any reload
  var pinCallback = null;
  var saveTimer = null;
  var kitCache = {};            // kits keep their state when the learner goes Back and Next
  var curView = null;

  function load() {
    try {
      var raw = localStorage.getItem(CONFIG.storageKey);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && o.v === 1) return merge(blank(), o);
      }
    } catch (e) { /* storage blocked or empty: start fresh */ }
    return blank();
  }
  function merge(base, o) {
    Object.keys(o).forEach(function (k) {
      if (o[k] && typeof o[k] === 'object' && !Array.isArray(o[k]) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) {
        base[k] = merge(base[k], o[k]);
      } else { base[k] = o[k]; }
    });
    return base;
  }
  function save() {
    try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(S)); } catch (e) { /* ignore */ }
  }
  function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 300); }

  function getPath(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, S);
  }
  function setPath(path, val) {
    var parts = path.split('.');
    var o = S;
    for (var i = 0; i < parts.length - 1; i++) {
      if (o[parts[i]] == null) o[parts[i]] = /^\d+$/.test(parts[i + 1]) ? [] : {};
      o = o[parts[i]];
    }
    o[parts[parts.length - 1]] = val;
  }

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function $(s, r) { return (r || document).querySelector(s); }
  function V() { return VARIANTS[S.setup.variant]; }
  function K() { return KEY[S.setup.variant] || {}; }
  function tool() { return S.setup.tool || 'the approved AI tool'; }
  function words(t) { var m = String(t || '').trim().match(/\S+/g); return m ? m.length : 0; }
  /* letters in English, Hindi (Devanagari) or Gujarati: emoji, digits and signs alone do not count */
  function letters(t) { return (String(t || '').match(/[A-Za-zऀ-ॿ઀-૿]/g) || []).length; }
  function norm(t) { return String(t || '').toLowerCase().replace(/\s+/g, ' ').trim(); }
  function mmss(sec) {
    sec = Math.max(0, Math.ceil(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }
  function clock(ts) {
    if (!ts) return '';
    var d = new Date(ts);
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  function hasAny(text, list) {
    var t = String(text || '').toLowerCase();
    return (list || []).some(function (w) { return t.indexOf(String(w).toLowerCase()) !== -1; });
  }
  function laneLabel(l) { return l === 'iti' ? 'ITI trade lane' : 'Higher education lane'; }
  /* the approved tool's own logo on an ivory mat (ChatGPT, Gemini or Claude); any other tool keeps icon-ai-helper */
  function toolLogoName() {
    var t = String(S.setup.tool || '').toLowerCase();
    return /chat\s*gpt/.test(t) ? 'chatgpt' : (/gemini/.test(t) ? 'gemini' : (/claude/.test(t) ? 'claude' : ''));
  }
  function toolMark(cls) {
    var n = toolLogoName();
    return n ? '<span class="logo-mat ' + (cls || '') + '" aria-hidden="true"><img src="assets/mocks/dark/' + n + '-64.webp" alt="" width="64" height="64"></span>' : img('ai-helper', cls ? 'aic ' + cls : 'aic');
  }
  function img(name, cls) { return '<img class="' + (cls || 'aic') + '" src="assets/icons/ivory/icon-' + name + '.webp" alt="" aria-hidden="true" width="28" height="28">'; }

  function elapsed() {
    if (!S.startedAt) return 0;
    var now = Date.now();
    var paused = S.pausedTotal + (S.pausedAt ? now - S.pausedAt : 0);
    return Math.max(0, (now - S.startedAt - paused) / 1000);
  }
  function log(msg) {
    S.log.push({ t: Date.now(), e: Math.round(elapsed()), msg: msg });
  }

  function req1Text() {
    var r = S.req1, v = V(), out = [];
    if (r.mode === 'free') {
      if (r.free.trim()) out.push(r.free.trim());
    } else {
      if (r.role.trim()) out.push('You are ' + r.role.trim().replace(/\.$/, '') + '.');
      if (r.context.trim()) out.push('Context: ' + r.context.trim());
      if (r.task.trim()) out.push('Task: ' + r.task.trim());
      if (r.format.trim()) out.push('Format: ' + r.format.trim());
      if (r.extra.trim()) out.push(r.extra.trim());
    }
    var text = out.join('\n');
    if (r.facts) text += '\n\nFact sheet:\n' + v.facts.map(function (f) { return '- ' + f[0] + ': ' + f[1]; }).join('\n');
    if (r.draft) text += '\n\nDraft to improve:\n' + v.draft.join(' ');
    return text.trim();
  }
  function req1Typed() {
    var r = S.req1;
    return r.mode === 'free' ? r.free.trim() : [r.role, r.context, r.task, r.format, r.extra].join('').trim();
  }
  function req1TypedText() {
    var r = S.req1;
    return r.mode === 'free' ? r.free : [r.role, r.context, r.task, r.format, r.extra].join(' ');
  }

  /* word-level diff for "what I changed" */
  function diffHtml(a, b) {
    var norm2 = function (t) { return /^\s+$/.test(t) ? (t.indexOf('\n') !== -1 ? '\n' : ' ') : t; };
    var A = (String(a || '').match(/\S+|\s+/g) || []).map(norm2);
    var B = (String(b || '').match(/\S+|\s+/g) || []).map(norm2);
    var n = A.length, m = B.length;
    if (n * m > 400000) return esc(b);
    var dp = [];
    for (var i = 0; i <= n; i++) { dp.push(new Uint16Array(m + 1)); }
    for (i = n - 1; i >= 0; i--) {
      for (var j = m - 1; j >= 0; j--) {
        dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    var ops = []; i = 0; j = 0;
    while (i < n && j < m) {
      if (A[i] === B[j]) { ops.push(['=', A[i]]); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push(['-', A[i]]); i++; }
      else { ops.push(['+', B[j]]); j++; }
    }
    while (i < n) { ops.push(['-', A[i++]]); }
    while (j < m) { ops.push(['+', B[j++]]); }
    var html = '', cur = null, buf = '';
    var flush = function () {
      if (!buf) return;
      if (cur === '-') html += /^\s+$/.test(buf) ? '' : '<del>' + esc(buf) + '</del>';
      else if (cur === '+') html += /^\s+$/.test(buf) ? esc(buf) : '<ins>' + esc(buf) + '</ins>';
      else html += esc(buf);
      buf = '';
    };
    ops.forEach(function (op) {
      if (op[0] !== cur) { flush(); cur = op[0]; }
      buf += op[1];
    });
    flush();
    return html;
  }

  async function copyText(t) {
    try { await navigator.clipboard.writeText(t); return true; }
    catch (e) {
      var ta = document.createElement('textarea');
      ta.value = t; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
      ta.remove(); return ok;
    }
  }

  function toast(msg, ic) {
    var wrap = document.getElementById('toasts');
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = icon(ic || 'info') + '<span>' + esc(msg) + '</span>';
    wrap.appendChild(el);
    setTimeout(function () { el.remove(); }, 6000);
  }

  /* ---------------- modal / sheet ---------------- */
  var modalReturnFocus = null;
  function openModal(html, opts) {
    opts = opts || {};
    modalReturnFocus = document.activeElement;
    var ov = document.getElementById('overlay');
    ov.innerHTML = '<div class="modal-back" data-sticky="' + (opts.sticky ? '1' : '') + '"><div class="modal' + (opts.wide ? ' wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="modal-title">' + html + '</div></div>';
    var f = ov.querySelector('[autofocus], input, textarea, button');
    if (f) f.focus();
  }
  function openSheet(html) {
    modalReturnFocus = document.activeElement;
    var ov = document.getElementById('overlay');
    ov.innerHTML = '<div class="sheet-back" data-close-on-back="1"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="sheet-grip"></div>' + html + '</div></div>';
    var f = ov.querySelector('button');
    if (f) f.focus();
  }
  function closeModal() {
    document.getElementById('overlay').innerHTML = '';
    if (modalReturnFocus && document.body.contains(modalReturnFocus)) modalReturnFocus.focus();
  }

  function askPin(reason, cb) {
    pinCallback = cb;
    openModal(
      '<h2 id="modal-title">Assessor only</h2>' +
      '<p class="small" style="margin-top:8px">' + esc(reason) + '</p>' +
      '<label class="field" style="margin-top:16px"><span class="field-label">Assessor PIN</span>' +
      '<input class="input pin-input" id="pin-in" type="password" inputmode="numeric" maxlength="4" autocomplete="off" autofocus></label>' +
      '<div class="err" id="pin-err" role="alert"></div>' +
      '<div class="actions"><button class="btn btn-ghost" data-action="modal-close">Cancel</button>' +
      '<button class="btn btn-primary" data-action="pin-ok">Unlock</button></div>'
    );
  }
  function checkPin() {
    var el = document.getElementById('pin-in');
    if (!el) return;
    if (el.value === S.setup.pin) {
      var cb = pinCallback; pinCallback = null; closeModal(); if (cb) cb();
    } else {
      document.getElementById('pin-err').textContent = 'That PIN is not correct. Try again.';
      el.value = ''; el.focus();
    }
  }

  /* ---------------- frame: pages, footer, lock ---------------- */
  var PAGES = ['welcome', 'setup', 'work', 'handover', 'assessor', 'result'];
  function screenName() { return S.screen === 'assessor' && !assessorOpen ? 'handover' : S.screen; }
  function curCard() { return document.getElementById('c-' + screenName()); }

  function eb(t) { return '<p class="eyebrow">' + esc(t) + '</p>'; }
  function head(tag, t) { return '<' + tag + ' class="title" tabindex="-1">' + esc(t) + '</' + tag + '>'; }
  function lede(t) { return '<p class="lede">' + esc(t) + '</p>'; }
  function task(t) { return '<p class="do saa-do"><b class="saa-do-label">Your task.</b> ' + esc(t) + '</p>'; }
  function gateLine() { return '<p class="saa-k-why gate-msg" aria-live="polite"></p>'; }
  function fsButton() { return '<button type="button" class="btn btn-blue btn-sm fs-open" data-action="open-facts">' + img('source-data-sheet', 'bic') + 'Fact sheet</button>'; }

  /* paint one screen: the lead (left) and the work (right). part === 'work' redraws only the right side. */
  function paint(card, view, part) {
    var kits = card.querySelectorAll('.saa-kit[data-kid]');
    Array.prototype.forEach.call(kits, function (k) { kitCache[k.getAttribute('data-kid')] = k; });
    var same = card.getAttribute('data-key') === view.key;
    /* the same screen redrawn after a tap keeps its scroll places */
    var keepScroll = same ? ['.saa-work', '.a-scroll', '.saa-lead', '.answer-read'].map(function (sel) { var e = card.querySelector(sel); return [sel, e ? e.scrollTop : 0]; }) : [];
    var work = card.querySelector(':scope > .saa-work');
    if (part === 'work' && same && work) {
      work.innerHTML = view.work;
    } else {
      card.innerHTML = view.lead != null
        ? '<div class="saa-lead" data-saa-lead>' + view.lead + '</div><div class="saa-work">' + view.work + '</div>'
        : view.work;
      card.setAttribute('data-key', view.key);
      card.classList.toggle('saa-split', view.lead != null);
      card.classList.toggle('a-card', view.lead == null);
      var old = card.getAttribute('data-cls');
      if (old && old !== view.cls) card.classList.remove(old);
      if (view.cls) card.classList.add(view.cls);
      card.setAttribute('data-cls', view.cls || '');
    }
    keepScroll.forEach(function (x) { var e = card.querySelector(x[0]); if (e && x[1]) e.scrollTop = x[1]; });
    Array.prototype.forEach.call(card.querySelectorAll('.saa-kit[data-kid]'), function (k) {
      var c = kitCache[k.getAttribute('data-kid')];
      if (c && c !== k) k.parentNode.replaceChild(c, k);
    });
    return !same;
  }

  function setFoot(view) {
    var back = $('#back'), prim = $('#primary'), foot = $('#foot'), cnt = $('#counter');
    back.hidden = !view.back;
    back.textContent = 'Back';
    if (view.next) {
      prim.hidden = false;
      prim.innerHTML = esc(view.next.label || 'Next');
    } else { prim.hidden = true; }
    if (view.count) { cnt.textContent = view.count + ' / ' + TOTAL_N; foot.classList.remove('no-count'); }
    else { foot.classList.add('no-count'); }
  }

  function render(part) {
    var fk = focusKey();
    renderTop();
    var name = screenName();
    PAGES.forEach(function (n) {
      var p = document.getElementById('p-' + n), on = n === name;
      if (p.hidden === on) p.hidden = !on;
      p.classList.toggle('active', on);
    });
    var view = VIEWS[name]();
    curView = view;
    var card = curCard();
    var fresh = paint(card, view, part);
    setFoot(view);
    syncLock();
    if (fresh && part !== 'keep') {
      ['stage', 'p-' + name].forEach(function (id) { var e = document.getElementById(id); if (e) e.scrollTop = 0; });
      var w = card.querySelector('.saa-work'); if (w) w.scrollTop = 0;
      card.scrollTop = 0;
      var h = card.querySelector('.title');
      if (h && !fk) { try { h.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
    }
    restoreFocus(fk);
    if (S.screen === 'work') updateTimer();
  }

  /* Next is dimmed (aria-disabled) while the screen is not finished; pressing it says what is missing */
  function syncLock() {
    var card = curCard(); if (!card) return;
    var g = curView && curView.gate ? curView.gate() : '';
    if (g) card.setAttribute('data-saa-locked', ''); else card.removeAttribute('data-saa-locked');
    var kitOpen = !!card.querySelector('.saa-kit[data-required]:not(.is-done)');
    var b = $('#primary'), on = !!g || kitOpen;
    if (b.classList.contains('saa-locked') !== on) b.classList.toggle('saa-locked', on);
    if (on) b.setAttribute('aria-disabled', 'true'); else b.removeAttribute('aria-disabled');
    var m = card.querySelector('.gate-msg');
    if (m && m.textContent && (!g || m.getAttribute('data-for') !== g)) { m.textContent = ''; m.classList.remove('need'); m.removeAttribute('data-for'); }
  }
  function showGate(msg) {
    var card = curCard(), m = card && card.querySelector('.gate-msg');
    if (!m) { toast(msg, 'info'); return; }
    m.textContent = msg; m.classList.add('need'); m.setAttribute('data-for', msg);
    m.classList.remove('saa-shake'); void m.offsetWidth; m.classList.add('saa-shake');
    if (window.innerWidth <= 700) { try { m.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* ignore */ } }
  }

  function focusKey() {
    var a = document.activeElement;
    if (!a || !a.getAttribute || !document.getElementById('shell').contains(a)) return null;
    if (a.getAttribute('data-action') && a.closest('#foot')) return null;
    if (a.getAttribute('data-action')) return '[data-action="' + a.getAttribute('data-action') + '"]' + (a.getAttribute('data-arg') != null ? '[data-arg="' + a.getAttribute('data-arg') + '"]' : '');
    if (a.getAttribute('data-bind')) return '[data-bind="' + a.getAttribute('data-bind') + '"]';
    return null;
  }
  function restoreFocus(sel) {
    if (!sel) return;
    try { var el = document.querySelector('#stage ' + sel); if (el) el.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  }

  function renderTop() {
    var r = document.getElementById('topbar-right');
    var h = '';
    if (S.screen === 'work') {
      h += '<div class="timer saa-vo-skip" id="timer" role="timer" aria-label="Time left">' +
        '<svg class="timer-ring" viewBox="0 0 26 26" aria-hidden="true"><circle class="track" cx="13" cy="13" r="10.5"/><circle class="bar" id="timer-bar" cx="13" cy="13" r="10.5" stroke-dasharray="65.97" stroke-dashoffset="0"/></svg>' +
        '<div class="timer-text"><span class="timer-time" id="timer-time">--:--</span><span class="timer-label" id="timer-label"></span></div></div>';
    }
    if (S.screen === 'welcome' || S.screen === 'work' || S.screen === 'handover' || S.screen === 'result' || (S.screen === 'assessor' && !assessorOpen)) {
      h += '<button class="icon-btn" data-action="assessor-menu" aria-label="Assessor options" title="Assessor options">' + icon('lock') + '</button>';
    }
    if (S.screen === 'assessor' && assessorOpen) {
      h += '<button class="btn btn-ghost btn-sm lock-btn" data-action="assessor-lock">' + icon('lock') + 'Lock</button>';
    }
    if (r.innerHTML !== h) r.innerHTML = h;
  }

  /* ---------------- kits (markup for saa-kit.js) ---------------- */
  function req(kid) { return (S.kits[kid] || S.locked) ? '' : ' data-required'; }
  function kitReveal(kid, cards, cls) {
    return '<div class="saa-kit' + (cls ? ' ' + cls : '') + '" data-kit="reveal" data-kid="' + kid + '"' + req(kid) + '><div class="saa-cards">' +
      cards.map(function (c) {
        return '<button class="saa-card" type="button"><span class="saa-front">' + (c.icon ? img(c.icon) : '') + (c.n ? '<span class="cn" aria-hidden="true">' + c.n + '</span>' : '') + esc(c.front) + '</span><span class="saa-back">' + esc(c.back) + '</span></button>';
      }).join('') + '</div></div>';
  }
  function kitQuick(kid, q, opts) {
    return '<div class="saa-kit" data-kit="quick" data-kid="' + kid + '"' + req(kid) + '><p class="saa-q">' + esc(q) + '</p><div class="saa-k-opts">' +
      opts.map(function (o) { return '<button class="saa-k-opt" type="button"' + (o.ok ? ' data-ok' : '') + ' data-why="' + esc(o.why) + '">' + esc(o.t) + '</button>'; }).join('') +
      '</div><p class="saa-k-why"></p></div>';
  }
  function kitSort(kid, bins, chips, doneText) {
    /* one card at a time (deck): flick, drag, tap a box, or the arrow keys; the card sits above the two boxes */
    return '<div class="saa-kit" data-kit="sort" data-style="deck" data-kid="' + kid + '"' + req(kid) + ' data-shuffle data-done-text="' + esc(doneText) + '"><div class="saa-pool">' +
      chips.map(function (c) { return '<button class="saa-chip" type="button" data-bin="' + c.bin + '" data-why="' + esc(c.why) + '" data-hint="' + esc(c.hint) + '">' + (c.logo ? toolMark('sort-logo') : img(c.icon)) + esc(c.t) + '</button>'; }).join('') +
      '</div><div class="saa-bins">' +
      bins.map(function (b) { return '<div class="saa-bin" data-bin="' + b[0] + '" data-label="' + esc(b[1]) + '"></div>'; }).join('') +
      '</div><p class="saa-k-why"></p></div>';
  }

  /* ---------------- fact sheet ---------------- */
  function factsCard(inSheet) {
    var v = V();
    return '<div class="facts' + (inSheet ? ' in-sheet' : '') + '">' +
      '<div class="facts-head"><h3' + (inSheet ? ' id="modal-title"' : '') + '>' + img('source-data-sheet', 'fic') + 'Fact sheet</h3><span class="label-fiction">Made up</span></div>' +
      '<div class="facts-org">' + esc(v.org) + '</div>' +
      '<dl>' + v.facts.map(function (f) { return '<div class="fact"><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' +
      '<div class="trust">' + icon('check') + '<span>This is the true information. Use it to check.</span></div>' +
      (inSheet ? '<button class="btn btn-ghost btn-block" style="margin-top:16px" data-action="modal-close">Close</button>' : '') +
      '</div>';
  }
  /* the fact sheet in the left column (desktop and tablet); phones get a button that opens it */
  function leadFacts() { return '<div class="lead-facts saa-vo-skip">' + factsCard(false) + '</div>' + '<div class="fs-row">' + fsButton() + '</div>'; }
  function leadFsButton() { return '<div class="fs-row always">' + fsButton() + '</div>'; }

  /* ---------------- views ---------------- */
  var VIEWS = {
    welcome: vWelcome, setup: vSetup, work: vWork, handover: vHandover,
    assessor: function () { return vAssessor(); }, result: vResult
  };

  /* ----- learner opening (3 screens, before the clock starts) ----- */
  function vWelcome() {
    var w = S.wsub || 0;
    if (w === 0) {
      return {
        key: 'w0', count: 1, back: null,
        lead: eb('Checkpoint 1') + head('h1', 'You have 30 minutes for this checkpoint.') +
          lede('You use AI to make one short notice. Then you check it before anyone reads it.') +
          task('Tap each card to see what you do in that time.'),
        work: '<div class="phase-strip" aria-hidden="true">' +
          '<div><div class="bar"></div><b>5 min</b></div><div><div class="bar mid"></div><b>20 min</b></div><div><div class="bar"></div><b>5 min</b></div></div>' +
          kitReveal('k-phases', [
            { icon: 'rule-read', front: '5 minutes: Read', back: 'You read the task, the fact sheet and a draft notice. After 5 minutes, the next step opens by itself.' },
            { icon: 'loop-check', front: '20 minutes: Make and check', back: 'You use the AI tool, check the draft and finish your notice. At 25 minutes, you can no longer change it.' },
            { icon: 'send', front: '5 minutes: Submit', back: 'You say what you changed, then you submit. At 30 minutes, your work is submitted by itself.' }
          ], 'phases'),
        next: { label: 'Next', fn: function () { S.wsub = 1; save(); render(); } }
      };
    }
    if (w === 1) {
      return {
        key: 'w1', count: 2, back: function () { S.wsub = 0; save(); render(); },
        lead: eb('Checkpoint 1 · Rules') + head('h2', 'Some things are allowed, and some are not.') +
          lede('You can use 3 things. Please do not do 3 things.') +
          task('Sort each card into the right box.'),
        work: kitSort('k-rules', [['a', 'You can use'], ['b', 'Please do not']], [
          { bin: 'a', icon: 'ai-helper', logo: true, t: tool(), why: 'Yes. This is your approved AI tool.', hint: 'Not quite. Which AI tool did your assessor open for you?' },
          { bin: 'a', icon: 'source-data-sheet', t: 'The fact sheet on the screen', why: 'Yes. The fact sheet has the true information.', hint: 'Not quite. Where is the true information for your notice?' },
          { bin: 'a', icon: 'rulebook', t: 'Your Rulebook, sections R1 and R3', why: 'Yes. You may use sections R1 and R3 of your Personal AI Rulebook.', hint: 'Not quite. Your own Rulebook notes are there to help you.' },
          { bin: 'b', icon: 'help-get', t: 'Help from other people', why: 'Yes. You do this checkpoint alone.', hint: 'Not quite. Who does the checkpoint: you alone, or a group?' },
          { bin: 'b', icon: 'get-browser', t: 'Other apps or websites', why: 'Yes. Keep only the AI tool and this checkpoint open.', hint: 'Not quite. Which apps should be open in the checkpoint?' },
          { bin: 'b', icon: 'never-type', t: 'Personal details typed into the AI', why: 'Yes. Never type phone numbers, Aadhaar, passwords or marks into the AI.', hint: 'Not quite. Is it safe to type a phone number or a password into AI?' }
        ], 'All sorted. Follow these rules for the whole checkpoint.'),
        next: { label: 'Next', fn: function () { S.wsub = 2; save(); render(); } }
      };
    }
    return {
      key: 'w2', count: 3, back: function () { S.wsub = 1; save(); render(); },
      lead: eb('Before you start') + head('h2', 'Your assessor watches but does not help.') +
        lede('That is normal in a checkpoint. Your work saves by itself.') +
        '<img class="lead-art assessor-art" src="assets/mocks/dark/spot-facilitator.webp" width="240" height="180" alt="Your assessor, holding a clipboard.">' +
        task('Tap how sure you feel, then press Start my 30 minutes.'),
      work: confScale('confBefore', 'How sure do you feel about checking AI work?') +
        '<div class="calm-note">' + icon('info') + '<span>You have done every part of this before. The clock starts when you press Start.</span></div>',
      next: { label: 'Start my 30 minutes', fn: function () { actions.start(); } }
    };
  }
  function confScale(key, q) {
    var labels = ['Not sure', 'A little sure', 'Quite sure', 'Very sure'];
    return '<div class="conf"><p class="conf-q" id="lbl-' + key + '">' + esc(q) + ' <span class="opt-tag">Optional</span></p>' +
      '<div class="scale" role="group" aria-labelledby="lbl-' + key + '">' +
      labels.map(function (l, i) {
        return '<button type="button" data-action="conf" data-arg="' + key + ':' + (i + 1) + '" aria-pressed="' + (S[key] === i + 1) + '"><i style="width:' + (10 + i * 10) + 'px"></i>' + l + '</button>';
      }).join('') + '</div></div>';
  }

  /* ----- assessor set-up (staff screen) ----- */
  function vSetup() {
    var s = S.setup;
    var lane = s.lane;
    var opts = ['A', 'B', 'C'].map(function (l) {
      var id = (lane === 'iti' ? 'ITI-' : 'HE-') + l;
      var used = S.prevVariants.indexOf(id) !== -1;
      return '<option value="' + id + '"' + (s.variant === id ? ' selected' : '') + (used ? ' disabled' : '') + '>Variant ' + l + ': ' + esc(VARIANTS[id].title) + (used ? ' (used before)' : '') + '</option>';
    }).join('');
    var reassess = S.attempt > 1 ? '<div class="notice warn">' + icon('refresh') + '<span>Reassessment, attempt ' + S.attempt + '. Variants used before are blocked. Use a new variant on a later day, never a corrected copy.</span></div>' : '';
    return {
      key: 'setup', count: null, back: null, cls: 'setup',
      lead: eb('Assessor set-up') + head('h1', 'Set up Checkpoint 1.') +
        lede('Do this before the learner sits down. Then hand over the device.') + reassess +
        '<div class="guide-btns"><button type="button" class="btn btn-ghost btn-sm" data-action="guide" data-arg="run">' + icon('book') + 'Assessor instructions</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-action="guide" data-arg="equal">' + icon('info') + 'How the variants are kept equal</button></div>',
      work: '<div class="setup-grid">' +
        fieldInput('setup.learnerId', 'Learner ID or roll number', 'Used only in the assessment record.', s.learnerId, 60) +
        fieldInput('setup.assessor', 'Assessor name', 'As it should appear on the record.', s.assessor, 80) +
        fieldInput('setup.centre', 'Centre and batch', 'Optional.', s.centre, 80) +
        fieldInput('setup.tool', 'Approved AI tool', 'The tool named in the learner’s Rulebook, R1.', s.tool, 60) +
        '<div class="field"><span class="field-label">Context lane</span><span class="field-help">Same standard, different context.</span>' +
        '<div class="seg" role="group" aria-label="Context lane">' +
        '<button type="button" data-action="set-lane" data-arg="iti" aria-pressed="' + (lane === 'iti') + '">ITI trade</button>' +
        '<button type="button" data-action="set-lane" data-arg="he" aria-pressed="' + (lane === 'he') + '">Higher education</button></div></div>' +
        '<div class="field"><span class="field-label">AI tool access</span><span class="field-help">Offline pack only if the tool cannot be reached.</span>' +
        '<div class="seg" role="group" aria-label="AI tool access">' +
        '<button type="button" data-action="set-mode" data-arg="online" aria-pressed="' + (s.mode === 'online') + '">Online</button>' +
        '<button type="button" data-action="set-mode" data-arg="offline" aria-pressed="' + (s.mode === 'offline') + '">Offline pack</button></div></div>' +
        '<label class="field"><span class="field-label">Task variant</span><span class="field-help">All three are equivalent. Pick one the learner has not seen.</span>' +
        '<select class="select" data-bind="setup.variant" data-rerender="1">' + opts + '</select></label>' +
        '<label class="field"><span class="field-label">Assessor PIN</span><span class="field-help">4 digits. Opens the assessor view and the answer key.</span>' +
        '<input class="input" data-bind="setup.pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" value="' + esc(s.pin) + '"></label>' +
        '</div>' +
        '<p class="setup-why" id="setup-why" role="status">' + esc(setupProblem() || 'Ready. The learner will see the rules first.') + '</p>',
      gate: setupProblem,
      next: { label: 'Hand over to the learner', fn: function () { actions['setup-done'](); } }
    };
  }
  function fieldInput(bind, label, help, val, max) {
    return '<label class="field"><span class="field-label">' + esc(label) + '</span>' + (help ? '<span class="field-help">' + esc(help) + '</span>' : '') +
      '<input class="input" data-bind="' + bind + '" value="' + esc(val) + '" maxlength="' + (max || 80) + '" autocomplete="off"></label>';
  }
  function setupProblem() {
    var s = S.setup;
    if (!s.learnerId.trim()) return 'Add the learner ID.';
    if (!s.assessor.trim()) return 'Add the assessor name.';
    if (!s.tool.trim()) return 'Add the approved AI tool.';
    if (!VARIANTS[s.variant]) return 'Choose a task variant.';
    if (!/^\d{4}$/.test(s.pin)) return 'Set a 4-digit PIN.';
    return '';
  }
  function guideHtml(which) {
    if (which === 'equal') {
      return '<h2 id="modal-title">How the variants are kept equal</h2><ul class="guide">' +
        '<li>All six variants (three per lane) use the same pattern: a fact sheet, and a 7-line draft made with AI by a batch-mate or classmate.</li>' +
        '<li>Each draft has exactly one planted claim that sounds official but is not in the fact sheet, one harmless line, and one fact left out.</li>' +
        '<li>Each draft is about 90 to 100 words. The target is 80 words or fewer, so the learner must use the AI to shorten and complete it.</li>' +
        '<li>No task needs trade or subject knowledge. All names, places and figures are fictional.</li>' +
        '</ul><div class="actions"><button class="btn btn-ghost" data-action="modal-close">Close</button></div>';
    }
    return '<h2 id="modal-title">Read before you start: assessor instructions</h2><ul class="guide">' +
      '<li>Open the approved AI tool on this device and check that it works. Close all other apps.</li>' +
      '<li>The clock runs for 30 minutes: 5 to read, 20 to make and check, 5 to submit. The app keeps the time. Do not change it.</li>' +
      '<li>Watch, but do not help. Do not read the task aloud, point at the screen or react to answers.</li>' +
      '<li>If the learner asks about the task, say: “I cannot help with the task. Do what you think is right.” You may answer questions about the rules, the device or the time.</li>' +
      '<li>Never say how many mistakes there are, or where.</li>' +
      '<li>If the AI tool fails: open the lock button, pause the clock, try once to reconnect. If it still fails, switch to the offline pack. The learner still writes every request. You fill each AI answer from the pack. The standard does not change.</li>' +
      '<li>After submission, open the assessor view with your PIN. Read the evidence, score each criterion and decide the gate. Keep the answer key away from learners.</li>' +
      '<li>The screens read their instructions aloud. Use headphones or a low volume so other learners are not disturbed.</li>' +
      '</ul><div class="actions"><button class="btn btn-ghost" data-action="modal-close">Close</button></div>';
  }

  /* ----- learner work: one short screen at a time ----- */
  function wsIndex() {
    for (var i = 0; i < WS.length; i++) { if (WS[i][0] === S.step && WS[i][1] === (S.sub || 0)) return i; }
    return 0;
  }
  function goWs(i) {
    i = Math.max(0, Math.min(WS.length - 1, i));
    S.step = WS[i][0]; S.sub = WS[i][1];
    S.maxStep = Math.max(S.maxStep, S.step);
    save(); render();
  }
  function goStep(n) {
    S.step = Math.max(1, Math.min(6, n)); S.sub = 0;
    S.maxStep = Math.max(S.maxStep, S.step);
    save(); render();
  }
  function lockBanner() {
    return (S.locked && S.step >= 2 && S.step <= 5) ? '<div class="notice warn">' + icon('clock') + '<span>Work time is over. You can look, but not change. Go to Submit.</span></div>' : '';
  }
  function stepEb(step, extra) { return eb('Step ' + step + ' · ' + (extra || STEP_EB[step - 1])); }

  function vWork() {
    var i = wsIndex(), id = WS[i][2];
    var v = W[id]();
    v.key = 'ws-' + id + (id === 'paste' || id === 'paste2' ? '-' + S.setup.mode : '');
    v.count = WELCOME_N + i + 1;
    v.back = i > 0 ? function () { goWs(i - 1); } : null;
    if (!v.next) v.next = { label: 'Next' };
    if (!v.next.fn) v.next.fn = function () { goWs(i + 1); };
    var g = v.gate;
    v.gate = function () { return S.locked && S.step < 6 ? '' : (g ? g() : ''); };
    return v;
  }

  var W = {};
  /* 1a. read the task */
  W.read = function () {
    var v = V(), fr = (STD_FRONT[S.setup.variant] || []).concat(STD_FRONT_SHARED), ics = stdIcons();
    return {
      lead: stepEb(1) + head('h2', 'Read your task first.') + lede(v.scenario) + task('Tap each card to see what a good notice has.'),
      work: '<div class="job">' + img('task') + '<div><b>' + esc(v.job) + '</b><span class="small">Use ' + esc(tool()) + ' to help you.</span></div></div>' +
        '<p class="mini-h">A good notice has</p>' +
        kitReveal('k-std-' + S.setup.variant, v.standard.map(function (s, n) { return { n: n + 1, icon: ics[n], front: fr[n] || ('Point ' + (n + 1)), back: s + '.' }; }), 'std')
    };
  };
  /* 1b. read the draft and the fact sheet */
  W.draft = function () {
    var v = V(), n = words(v.draft.join(' '));
    return {
      cls: 'with-facts',
      lead: stepEb(1) + head('h2', v.author + ' made this draft with AI.') +
        task('Read the draft and the fact sheet, then answer the question.') + leadFacts(),
      work: '<div class="draft-paper"><div class="draft-from"><span class="avatar" aria-hidden="true">' + esc(v.author.charAt(0)) + '</span><span>' + esc(v.author) + '’s draft is not finished. It has <b>' + n + ' words</b>, and the limit is ' + CONFIG.wordLimit + '.</span></div>' +
        '<p>' + esc(v.draft.join(' ')) + '</p></div>' +
        kitQuick('k-src', 'Where is the true information for this notice?', [
          { t: 'In the fact sheet', ok: true, why: 'Yes. The fact sheet is true, but an AI draft can have mistakes.' },
          { t: 'In the draft', why: 'Not quite. The draft was made with AI, so it can have mistakes.' }
        ]),
      next: { label: 'I have read it' }
    };
  };
  /* 2a. mark every line, one at a time */
  W.lines = function () {
    var v = V(), locked = S.locked, n = v.draft.length;
    var at = Math.max(0, Math.min(n - 1, S.lineAt || 0));
    var m = S.marks[at] || {};
    var done = S.marks.filter(function (x) { return x && x.mark; }).length;
    var dis = locked ? ' disabled' : '';
    var dots = v.draft.map(function (_, k) {
      var mk = (S.marks[k] || {}).mark;
      var st = mk === 'ok' ? 'Matches' : (mk === 'wrong' ? 'Wrong' : (mk === 'missing' ? 'Not in fact sheet' : 'not marked'));
      return '<button type="button" class="st-dot' + (k === at ? ' now' : '') + (mk ? ' m-' + mk : '') + '" data-action="line-go" data-arg="' + k + '" aria-label="Line ' + (k + 1) + ', ' + st + '"' + (k === at ? ' aria-current="true"' : '') + '>' + (k + 1) + '</button>';
    }).join('');
    var mk = function (code, label, ic) {
      return '<button type="button" class="mark" data-m="' + code + '" data-action="mark" data-arg="' + at + ':' + code + '" aria-pressed="' + (m.mark === code) + '"' + dis + '>' + icon(ic) + label + '</button>';
    };
    var fix = '';
    if (m.mark === 'wrong' || m.mark === 'missing') {
      fix = '<div class="fix-box"><span class="fix-q">What will you do with this line?</span><div class="chips">' +
        '<button type="button" class="chip" data-action="fix" data-arg="' + at + ':remove" aria-pressed="' + (m.fix === 'remove') + '"' + dis + '>' + icon('trash') + 'Remove it</button>' +
        '<button type="button" class="chip" data-action="fix" data-arg="' + at + ':change" aria-pressed="' + (m.fix === 'change') + '"' + dis + '>' + icon('pen') + 'Change it</button></div>' +
        (m.fix === 'change' ? '<label class="field"><span class="sr-only">Change it to</span><input class="input" data-bind="marks.' + at + '.fixText" maxlength="300" placeholder="Change it to…" value="' + esc(m.fixText || '') + '"' + dis + '></label>' : '') +
        '</div>';
    }
    var lineDone = m.mark && (m.mark === 'ok' || (m.fix === 'remove') || (m.fix === 'change' && fixTextOk(m.fixText)));
    return {
      cls: 'with-facts',
      lead: stepEb(2) + head('h2', 'Check each line of the draft.') +
        task('Mark all 7 lines, and choose a fix for every line that is not right.') + leadFacts(),
      work: lockBanner() +
        '<div class="stepper">' +
        '<div class="st-top"><span class="st-n">Line ' + (at + 1) + ' of ' + n + '</span><span class="st-count saa-vo-skip">' + done + ' of ' + n + ' marked</span></div>' +
        '<div class="st-row">' +
        '<button type="button" class="st-arrow" data-action="line-go" data-arg="' + Math.max(0, at - 1) + '" aria-label="Previous line"' + (at === 0 ? ' disabled' : '') + '>' + icon('left') + '</button>' +
        '<div class="st-dots" role="group" aria-label="Lines">' + dots + '</div>' +
        '<button type="button" class="st-arrow' + (lineDone && at < n - 1 ? ' go' : '') + '" data-action="line-go" data-arg="' + Math.min(n - 1, at + 1) + '" aria-label="Next line"' + (at === n - 1 ? ' disabled' : '') + '>' + icon('right') + '</button></div>' +
        '<div class="st-line' + (m.mark ? ' m-' + m.mark : '') + (m.fix === 'remove' ? ' m-remove' : '') + '"><span class="ln" aria-hidden="true">' + (at + 1) + '</span><span class="lt">' + esc(v.draft[at]) + '</span></div>' +
        '<div class="marks" role="group" aria-label="Line ' + (at + 1) + '">' + mk('ok', 'Matches', 'check') + mk('wrong', 'Wrong', 'x') + mk('missing', 'Not in fact sheet', 'question') + '</div>' +
        fix + '</div>' + gateLine(),
      gate: function () {
        for (var k = 0; k < n; k++) {
          var x = S.marks[k] || {};
          if (!x.mark) return MSG.mark(k + 1);
          if ((x.mark === 'wrong' || x.mark === 'missing') && !x.fix) return MSG.fix(k + 1);
          if ((x.mark === 'wrong' || x.mark === 'missing') && x.fix === 'change' && !fixTextOk(x.fixText)) return MSG.fixText(k + 1);
        }
        return '';
      },
      onGate: function () {
        for (var k = 0; k < n; k++) {
          var x = S.marks[k] || {};
          if (!x.mark || ((x.mark === 'wrong' || x.mark === 'missing') && (!x.fix || (x.fix === 'change' && !fixTextOk(x.fixText))))) { S.lineAt = k; break; }
        }
      }
    };
  };
  function fixTextOk(t) { return letters(t) + (String(t || '').match(/\d/g) || []).length >= 2; }

  /* 2b. anything missing? */
  W.missing = function () {
    var v = V(), miss = S.missing, dis = S.locked ? ' disabled' : '';
    return {
      cls: 'with-facts',
      lead: stepEb(2) + head('h2', 'Is any fact missing from the draft?') +
        task('Tap Yes or No, and if you tap Yes, write what is missing.') + leadFacts(),
      work: lockBanner() +
        '<div class="draft-paper small-draft"><div class="draft-from"><span class="avatar" aria-hidden="true">' + esc(v.author.charAt(0)) + '</span><span>' + esc(v.author) + '’s draft</span></div><p>' + esc(v.draft.join(' ')) + '</p></div>' +
        '<div class="ask-row"><span class="fix-q" id="lbl-missing">Is anything from the fact sheet missing in the draft?</span>' +
        '<div class="seg big" role="group" aria-labelledby="lbl-missing">' +
        '<button type="button" data-action="missing" data-arg="yes" aria-pressed="' + (miss.ans === 'yes') + '"' + dis + '>Yes</button>' +
        '<button type="button" data-action="missing" data-arg="no" aria-pressed="' + (miss.ans === 'no') + '"' + dis + '>No</button></div></div>' +
        (miss.ans === 'yes' ? '<label class="field"><span class="field-label">What is missing?</span><input class="input" data-bind="missing.text" maxlength="300" value="' + esc(miss.text) + '"' + dis + '></label>' : '') +
        gateLine(),
      gate: function () {
        if (!miss.ans) return MSG.missAns;
        if (miss.ans === 'yes') {
          var t = String(miss.text || '').trim();
          if (!t || norm(t) === 'what is missing?') return MSG.missText;
          if (letters(t) < 2) return MSG.signs;
        }
        return '';
      }
    };
  };

  /* 3a. write the request */
  W.write = function () {
    var r = S.req1, v = V(), dis = S.locked ? ' disabled' : '';
    var fields = r.mode === 'free'
      ? '<label class="field"><span class="field-label">Your request</span><textarea class="textarea" data-bind="req1.free" maxlength="1500" placeholder="Write it your own way."' + dis + '>' + esc(r.free) + '</textarea></label>'
      : '<div class="b-fields">' +
        bField('req1.role', 'Role', 'Who should the AI act as?', r.role, dis, 'role') +
        bField('req1.context', 'Context', 'Who is it for, and why?', r.context, dis, 'context') +
        bField('req1.task', 'Task', 'What should the AI make?', r.task, dis, 'task') +
        bField('req1.format', 'Format', 'How should it look? How long?', r.format, dis, 'format') +
        '<div class="span-2">' + bField('req1.extra', 'Anything else', 'Optional.', r.extra, dis, 'extra') + '</div></div>';
    return {
      lead: stepEb(3) + head('h2', 'Write your request for the AI tool.') +
        lede('Use the 4 parts: Role, Context, Task and Format. Or write it your own way.') +
        task('Write your request, then tap to add your source.') + leadFsButton(),
      work: lockBanner() +
        '<div class="seg" role="group" aria-label="How to write"><button type="button" data-action="req-mode" data-arg="builder" aria-pressed="' + (r.mode !== 'free') + '"' + dis + '>4 parts</button><button type="button" data-action="req-mode" data-arg="free" aria-pressed="' + (r.mode === 'free') + '"' + dis + '>My own way</button></div>' +
        fields +
        '<div class="src"><span class="field-label">Give the AI your source</span>' +
        '<div class="chips">' +
        '<button type="button" class="chip" data-action="attach" data-arg="facts" aria-pressed="' + r.facts + '"' + dis + '>' + icon('shield') + 'Fact sheet</button>' +
        '<button type="button" class="chip" data-action="attach" data-arg="draft" aria-pressed="' + r.draft + '"' + dis + '>' + icon('doc') + esc(v.author) + '’s draft</button>' +
        '</div></div>' + gateLine(),
      gate: function () {
        var t = req1TypedText();
        if (!req1Typed()) return MSG.req1;
        if (letters(t) < 2) return MSG.signs;
        if (words(t) < 3 || letters(t) < 10) return MSG.req1Short;
        return '';
      }
    };
  };
  function bField(bind, label, help, val, dis, ic) {
    return '<label class="field"><span class="field-label">' + (ic ? img(ic, 'aic lbl-ic') : '') + label + '</span><input class="input" data-bind="' + bind + '" maxlength="300" placeholder="' + esc(help) + '" value="' + esc(val) + '"' + dis + '></label>';
  }
  function previewReq1() {
    var r = S.req1, v = V(), parts = [];
    if (r.mode === 'free') {
      parts.push(r.free.trim() ? esc(r.free.trim()) : '<span class="ph">Your request will appear here.</span>');
    } else {
      var any = false;
      var line = function (pre, val, post) { if (val.trim()) { any = true; parts.push(pre + '<u>' + esc(val.trim().replace(/\.$/, '')) + '</u>' + (post || '')); } };
      line('You are ', r.role, '.');
      line('Context: ', r.context);
      line('Task: ', r.task);
      line('Format: ', r.format);
      if (r.extra.trim()) { any = true; parts.push(esc(r.extra.trim())); }
      if (!any) parts.push('<span class="ph">Fill in the parts. Your request will appear here.</span>');
    }
    var html = parts.join('\n');
    if (r.facts) html += '<span class="attach">+ Fact sheet (' + v.facts.length + ' lines)</span>';
    if (r.draft) html += '<span class="attach">+ ' + esc(v.author) + '’s draft (' + v.draft.length + ' lines)</span>';
    return html;
  }
  function howStep(n, t, mark) { return '<span class="how-step"><b>' + n + '</b>' + (mark || '') + esc(t) + '</span>'; }

  /* 3b. copy it into the AI tool */
  W.copy = function () {
    var offline = S.setup.mode === 'offline';
    return {
      lead: stepEb(3) + head('h2', 'Copy your request into the AI tool.') +
        lede('Then copy the answer that the AI tool gives you.') +
        task('Press Copy request, then paste it into the AI tool.') + leadFsButton() +
        '<button type="button" class="btn btn-ghost btn-sm see-how" data-action="copy-demo">' + icon('eye') + 'See how</button>',
      work: lockBanner() +
        '<div class="how-row" aria-hidden="true">' + howStep(1, 'Copy') + howStep(2, 'Paste in ' + tool(), toolMark('how-logo')) + howStep(3, 'Copy the answer') + howStep(4, 'Paste on the next screen') + '</div>' +
        '<span class="field-label">Your request</span>' +
        '<div class="preview selectable" data-live="preview1">' + previewReq1() + '</div>' +
        '<div class="meta-row"><button type="button" class="btn btn-blue btn-sm" data-action="copy-req1">' + icon('copy') + 'Copy request</button><span class="count saa-vo-skip" data-live="req1-words">' + words(req1Text()) + ' words</span></div>' +
        (offline ? '<div class="notice">' + icon('offline') + '<span>The AI tool is offline for this checkpoint. On the next screen, your assessor adds the AI answer.</span></div>' : '')
    };
  };
  function answerWork(bind, stage, title) {
    var dis = S.locked ? ' disabled' : '';
    var offline = S.setup.mode === 'offline';
    var val = S[bind];
    var help = offline
      ? '<div class="notice">' + icon('offline') + '<span>The AI tool is offline for this checkpoint. When your request is ready, your assessor will add the AI answer.</span></div>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-action="offline-fill" data-arg="' + stage + '"' + dis + '>' + icon('lock') + 'Assessor: add the AI answer</button>'
      : '<button type="button" class="btn-text help-link" data-action="tool-problem">' + img('access-fail', 'aic help-ic') + 'AI tool not working?</button>';
    return lockBanner() + '<label class="field answer-box"><span class="field-label">' + esc(title) + '</span><span class="field-help">Paste exactly what ' + esc(tool()) + ' gave you. Do not fix it here.</span>' +
      '<textarea class="textarea" data-bind="' + bind + '" maxlength="5000"' + dis + ' placeholder="Paste here">' + esc(val) + '</textarea></label>' +
      '<div class="meta-row"><span class="count saa-vo-skip" data-live="' + bind + '-words">' + words(val) + ' words</span>' + (offline ? '' : help) + '</div>' +
      (offline ? help : '') + gateLine();
  }
  function ansGate(val, reqText, emptyMsg, other) {
    var t = String(val || '').trim();
    if (!t) return S.setup.mode === 'offline' ? MSG.ansOffline : emptyMsg;
    if (letters(t) < 2) return MSG.signs;
    if (reqText && norm(t) === norm(reqText)) return MSG.ansIsReq;
    if (other && norm(t) === norm(other)) return MSG.ans2Same;
    if (words(t) < 15) return MSG.ansShort;
    return '';
  }
  /* 3c. paste the answer */
  W.paste = function () {
    var offline = S.setup.mode === 'offline';
    return {
      lead: stepEb(3) + (offline
        ? head('h2', 'Your assessor adds the AI answer here.') + lede('The AI tool is offline today. Your assessor uses the offline pack.') + task('Raise your hand and ask your assessor to add the AI answer.')
        : head('h2', 'Paste the AI answer here.') + lede('Paste exactly what the AI tool gave you. Do not fix it yet.') + task('Paste the AI answer in the box.')) + leadFsButton(),
      work: answerWork('ans1', 'ask', 'Paste the AI answer'),
      gate: function () { return ansGate(S.ans1, S.req1.mode === 'free' ? S.req1.free : req1Text(), MSG.ans1); }
    };
  };
  /* 4a. ask for one improvement */
  W.follow = function () {
    var dis = S.locked ? ' disabled' : '';
    var starters = [['shorter', 'Make it shorter', 'shorter'], ['add', 'Add something', 'extra'], ['remove', 'Remove something', 'remove'], ['simple', 'Use simpler words', 'understand'], ['format', 'Change the format', 'format']];
    var w1 = words(S.ans1);
    return {
      cls: 'with-facts',
      lead: stepEb(4) + head('h2', 'Ask the AI for one clear change.') +
        task('Read the AI answer, then write one clear follow-up request.') +
        '<div class="lead-ans saa-vo-skip"><span class="field-label">The AI answer</span><div class="answer-read">' + (S.ans1.trim() ? esc(S.ans1) : '<span class="ph">No answer yet. Go back to step 3.</span>') + '</div>' +
        '<span class="count ' + (w1 > CONFIG.wordLimit ? 'over' : 'ok') + '">' + w1 + ' words</span></div>' + leadFsButton(),
      work: lockBanner() +
        '<div class="lbl"><span class="field-label">Start with</span><span class="field-help">Tap one or more. Then finish the sentence.</span></div>' +
        '<div class="chips">' + starters.map(function (s) { return '<button type="button" class="chip" data-action="starter" data-arg="' + s[0] + '"' + dis + '>' + img(s[2], 'aic st-ic') + esc(s[1]) + '</button>'; }).join('') + '</div>' +
        '<label class="field"><span class="field-label">Your follow-up request</span><span class="field-help">Say exactly what to change.</span>' +
        '<textarea class="textarea" id="req2" data-bind="req2" maxlength="600"' + dis + '>' + esc(S.req2) + '</textarea></label>' +
        '<div class="meta-row"><button type="button" class="btn btn-blue btn-sm" data-action="copy-req2">' + icon('copy') + 'Copy request</button><span class="count saa-vo-skip" data-live="req2-words">' + words(S.req2) + ' words</span></div>' +
        gateLine(),
      gate: function () {
        var t = String(S.req2 || '').trim();
        if (!t) return MSG.req2;
        if (letters(t) < 2) return MSG.signs;
        if (/:\s*$/.test(t)) return MSG.req2Open;
        if (words(t) < 3 || letters(t) < 8) return MSG.req2Short;
        if (norm(t) === norm(req1Text()) || norm(t) === norm(S.req1.free)) return MSG.req2Same;
        return '';
      }
    };
  };
  /* 4b. paste the new answer */
  W.paste2 = function () {
    var offline = S.setup.mode === 'offline';
    return {
      lead: stepEb(4) + (offline
        ? head('h2', 'Your assessor adds the new AI answer here.') + lede('The AI tool is offline today. Your assessor uses the offline pack.') + task('Raise your hand and ask your assessor to add the new AI answer.')
        : head('h2', 'Paste the new AI answer here.') + lede('Paste exactly what the AI tool gave you. Do not fix it yet.') + task('Paste the new AI answer in the box.')) + leadFsButton(),
      work: answerWork('ans2', 'improve', 'Paste the new AI answer'),
      gate: function () { return ansGate(S.ans2, S.req2, MSG.ans2, S.ans1); }
    };
  };
  /* 5a. finish the notice */
  W.final = function () {
    var dis = S.locked ? ' disabled' : '';
    if (!S.finalSeeded && S.ans2.trim()) { S.finalText = S.ans2; S.finalSeeded = true; saveSoon(); }
    var w = words(S.finalText);
    return {
      cls: 'with-facts',
      lead: stepEb(5) + head('h2', 'Make your final notice correct.') +
        task('Edit the notice, and check every fact against the fact sheet.') + leadFacts(),
      work: lockBanner() +
        '<label class="field final-field"><span class="field-label">Final notice</span><span class="field-help">This is the version people will read. Make your fixes here.</span>' +
        '<textarea class="textarea" data-bind="finalText" maxlength="1500"' + dis + '>' + esc(S.finalText) + '</textarea></label>' +
        '<div class="meta-row"><span class="count saa-vo-skip ' + (w > CONFIG.wordLimit ? 'over' : 'ok') + '" data-live="final-words">' + w + ' of ' + CONFIG.wordLimit + ' words</span>' +
        '<div class="row-btns">' +
        '<button type="button" class="btn btn-ghost btn-sm" data-action="reset-final"' + dis + '>' + icon('refresh') + 'Start again from the AI answer</button>' +
        '<button type="button" class="btn btn-blue btn-sm" data-action="show-diff">' + icon('eye') + 'Show my changes</button></div></div>' +
        gateLine(),
      gate: function () {
        var t = String(S.finalText || '').trim();
        if (!t) return MSG.final;
        if (letters(t) < 2) return MSG.signs;
        if (words(t) < 10) return MSG.finalShort;
        return '';
      }
    };
  };
  /* 5b. check against the standard: Yes or Not yet for every point */
  W.standard = function () {
    var v = V(), dis = S.locked ? ' disabled' : '', ics = stdIcons();
    return {
      cls: 'with-facts',
      lead: stepEb(5) + head('h2', 'Check your notice against the standard.') +
        task('Read your notice, then tap Yes or Not yet for each point.') +
        '<div class="lead-ans saa-vo-skip"><span class="field-label">Your final notice</span><div class="answer-read">' + (S.finalText.trim() ? esc(S.finalText) : '<span class="ph">Your final notice is empty.</span>') + '</div>' +
        '<span class="count ' + (words(S.finalText) > CONFIG.wordLimit ? 'over' : 'ok') + '">' + words(S.finalText) + ' of ' + CONFIG.wordLimit + ' words</span></div>' + leadFsButton(),
      work: lockBanner() +
        '<ul class="ticks">' + v.standard.map(function (s, i) {
          var t = S.ticks[i];
          return '<li class="tick-row' + (t === true ? ' yes' : (t === false ? ' not' : '')) + '">' + (ics[i] ? img(ics[i], 'aic tick-ic') : '') + '<span class="tick-t" id="tk-' + i + '">' + esc(s) + '</span>' +
            '<span class="seg" role="group" aria-labelledby="tk-' + i + '">' +
            '<button type="button" data-action="tick" data-arg="' + i + ':1" aria-pressed="' + (t === true) + '"' + dis + '>Yes</button>' +
            '<button type="button" data-action="tick" data-arg="' + i + ':0" aria-pressed="' + (t === false) + '"' + dis + '>Not yet</button></span></li>';
        }).join('') + '</ul>' + gateLine(),
      gate: function () {
        for (var i = 0; i < v.standard.length; i++) { if (S.ticks[i] !== true && S.ticks[i] !== false) return MSG.ticks; }
        return '';
      }
    };
  };
  /* 6a. say what you changed */
  W.note = function () {
    var n = S.note;
    return {
      lead: stepEb(6) + head('h2', 'Say what you changed and why.') +
        lede('Short answers are fine. This shows your thinking.') +
        task('Finish at least one pair of sentences.'),
      work: (S.locked ? '<div class="notice warn">' + icon('clock') + '<span>Work time is over. Write what you changed, then submit.</span></div>' : '') +
        '<div class="pair"><p class="pair-h">Pair 1</p><div class="starter">' + tArea('note.removed', 'I removed or fixed…', n.removed, 'remove') + tArea('note.removedWhy', 'Because…', n.removedWhy) + '</div></div>' +
        '<div class="pair"><p class="pair-h">Pair 2</p><div class="starter">' + tArea('note.added', 'I added…', n.added, 'extra') + tArea('note.addedWhy', 'Because…', n.addedWhy) + '</div></div>' +
        gateLine(),
      gate: function () {
        var ok = function (a, b) { return words(a) >= 2 && letters(a) >= 4 && words(b) >= 2 && letters(b) >= 4; };
        return (ok(n.removed, n.removedWhy) || ok(n.added, n.addedWhy)) ? '' : MSG.note;
      }
    };
  };
  function tArea(bind, label, val, ic) {
    return '<label class="field"><span class="field-label">' + (ic ? img(ic, 'aic lbl-ic') : '') + esc(label) + '</span><textarea class="textarea short" data-bind="' + bind + '" maxlength="400">' + esc(val) + '</textarea></label>';
  }
  /* 6b. submit */
  W.submit = function () {
    return {
      lead: stepEb(6) + head('h2', 'Check your work, then submit it.') +
        lede('After you submit, you cannot change anything.') +
        task('Tap how sure you are, then press Submit my work.'),
      work: confScale('confAfter', 'How sure are you that your notice has no mistakes?') +
        '<button type="button" class="btn btn-ghost see-all" data-action="see-all">' + icon('doc') + 'See everything you will submit</button>',
      next: { label: 'Submit my work', fn: function () { actions.submit(); } }
    };
  };
  function evBlock(title, text) {
    return '<div class="ev-block"><h3>' + esc(title) + '</h3><div class="ev-text' + (String(text || '').trim() ? '' : ' empty') + '">' + (String(text || '').trim() ? esc(text) : 'Nothing recorded.') + '</div></div>';
  }

  /* live updates while typing (no full re-render, so focus stays put) */
  function liveUpdate(bind) {
    var q = function (k) { return document.querySelector('[data-live="' + k + '"]'); };
    if (bind.indexOf('req1.') === 0) {
      var p = q('preview1'); if (p) p.innerHTML = previewReq1();
      var rw = q('req1-words'); if (rw) rw.textContent = words(req1Text()) + ' words';
    }
    if (bind === 'ans1' || bind === 'ans2') { var aw = q(bind + '-words'); if (aw) aw.textContent = words(getPath(bind)) + ' words'; }
    if (bind === 'req2') { var r2 = q('req2-words'); if (r2) r2.textContent = words(S.req2) + ' words'; }
    if (bind === 'finalText') {
      var fw = q('final-words');
      if (fw) { var w = words(S.finalText); fw.textContent = w + ' of ' + CONFIG.wordLimit + ' words'; fw.className = 'count saa-vo-skip ' + (w > CONFIG.wordLimit ? 'over' : 'ok'); }
    }
    if (bind.indexOf('setup.') === 0) {
      var sw = document.getElementById('setup-why');
      if (sw) sw.textContent = setupProblem() || 'Ready. The learner will see the rules first.';
    }
    if (/^marks\.\d+\.fixText$/.test(bind)) {
      var nb = document.querySelector('.st-arrow[aria-label="Next line"]');
      var m = S.marks[S.lineAt || 0] || {};
      if (nb) nb.classList.toggle('go', m.fix === 'change' && fixTextOk(m.fixText) && (S.lineAt || 0) < 6);
    }
    syncLock();
  }

  /* ---------------- timer ---------------- */
  function updateTimer() {
    var e = elapsed();
    var label, rem, total, low;
    if (S.step === 1 && e < CONFIG.readSec && !S.locked) {
      label = 'Reading time'; rem = CONFIG.readSec - e; total = CONFIG.readSec; low = rem <= 60;
    } else if (e < CONFIG.workEndSec && !S.locked) {
      label = 'Make and check'; rem = CONFIG.workEndSec - e; total = CONFIG.workEndSec - CONFIG.readSec; low = rem <= 300;
    } else {
      label = 'Time to submit'; rem = CONFIG.totalSec - e; total = CONFIG.totalSec - CONFIG.workEndSec; low = rem <= 120;
    }
    if (S.pausedAt) label = 'Paused by assessor';
    var t = document.getElementById('timer-time'), l = document.getElementById('timer-label'), bar = document.getElementById('timer-bar'), box = document.getElementById('timer');
    if (!t) return;
    t.textContent = mmss(rem);
    l.textContent = label;
    var frac = Math.max(0, Math.min(1, rem / total));
    bar.setAttribute('stroke-dashoffset', String(65.97 * (1 - frac)));
    box.classList.toggle('is-low', !!low && !S.pausedAt);
    box.classList.toggle('is-paused', !!S.pausedAt);
    box.setAttribute('aria-label', label + ': ' + Math.ceil(rem / 60) + ' minutes left');
  }

  function tick() {
    if (S.screen !== 'work' || !S.startedAt) return;
    var e = elapsed(), f = S.fired;
    if (e >= CONFIG.readSec && !f.read) {
      f.read = true;
      if (S.step === 1) { goStep(2); toast('Reading time is over. Your 20 minutes to make and check have started.', 'clock'); }
      save();
    }
    if (e >= CONFIG.workEndSec - 300 && !f.w5 && !S.locked && S.step < 6) { f.w5 = true; toast('5 minutes left to finish and check your notice.', 'clock'); save(); }
    if (e >= CONFIG.workEndSec - 60 && !f.w1 && !S.locked && S.step < 6) { f.w1 = true; toast('1 minute left. Your work saves by itself.', 'clock'); save(); }
    if (e >= CONFIG.workEndSec && !f.lock) {
      f.lock = true; S.locked = true; log('Work time ended at 25:00. Steps 2 to 5 locked.');
      if (S.step < 6) {
        S.step = 6; S.sub = 0; S.maxStep = 6; save(); render();
        openModal('<h2 id="modal-title">Time to submit</h2><p class="lead" style="font-size:16px">Your notice is saved. Now write what you changed, and submit. You have 5 minutes.</p><div class="actions"><button class="btn btn-primary" data-action="modal-close">OK</button></div>');
      } else { save(); render(); }
    }
    if (e >= CONFIG.totalSec - 120 && !f.s2) { f.s2 = true; toast('2 minutes left to submit.', 'clock'); save(); }
    if (e >= CONFIG.totalSec && !f.end) { f.end = true; closeModal(); submit(true); return; }
    updateTimer();
  }

  function submit(auto) {
    S.submittedAt = Date.now();
    S.elapsedAtSubmit = Math.round(elapsed());
    S.autoSubmitted = !!auto;
    log(auto ? 'Auto-submitted when the 30 minutes ended.' : 'Submitted by the learner.');
    S.screen = 'handover';
    save(); render();
  }

  /* ----- handover ----- */
  function vHandover() {
    return {
      key: 'handover', count: null, back: null,
      lead: eb('Checkpoint 1') + head('h1', 'Your work is submitted.') + lede('Please give this device to your assessor now. Thank you.') +
        '<img class="lead-art hand-art" src="assets/mocks/dark/handover-' + (S.setup.lane === 'he' ? 'college' : 'iti') + '.webp" width="600" height="400" alt="' + (S.setup.lane === 'he' ? 'A student' : 'A trainee') + ' hands a tablet with a check mark to the assessor.">',
      work: '<div class="hand-box"><div class="badge-wrap"><div class="badge-ring"></div><div class="badge quiet">' + icon('check') + '</div></div>' +
        '<p class="hand-time saa-vo-skip">' + (S.autoSubmitted ? 'Submitted when the time ended. ' : '') + 'Time used: ' + mmss(S.elapsedAtSubmit || 0) + '</p></div>',
      next: { label: 'Open assessor view', fn: function () { actions['open-assessor'](); } }
    };
  }

  /* ----- assessor view: evidence, score, decide (unchanged logic) ----- */
  function signals() {
    var k = K(), v = V();
    var fabMark = (S.marks[k.fab] || {}).mark || null;
    var flagged = fabMark === 'wrong' || fabMark === 'missing';
    var noteMentions = hasAny(S.note.removed + ' ' + S.note.removedWhy, k.fabWords);
    var inFinal = hasAny(S.finalText, k.fabWords);
    var missingAdded = hasAny(S.finalText, k.missingWords);
    var falseFlags = 0, unmarked = 0;
    (k.lines || []).forEach(function (t, i) {
      var m = (S.marks[i] || {}).mark;
      if (!m) unmarked++;
      if (t === 'ok' && (m === 'wrong' || m === 'missing')) falseFlags++;
    });
    var pausedMs = S.log.filter(function (x) { return /^Clock paused/.test(x.msg); }).length;
    return { fabMark: fabMark, flagged: flagged, noteMentions: noteMentions, inFinal: inFinal, missingAdded: missingAdded, falseFlags: falseFlags, unmarked: unmarked, finalWords: words(S.finalText), pauses: pausedMs, total: v.draft.length };
  }
  function dot(kind) { return '<span class="dot ' + kind + '">' + icon(kind === 'y' ? 'check' : (kind === 'n' ? 'x' : 'info')) + '</span>'; }
  function markPill(m) {
    if (m === 'ok') return '<span class="pill ok">Matches</span>';
    if (m === 'wrong') return '<span class="pill bad">Wrong</span>';
    if (m === 'missing') return '<span class="pill bad">Not in fact sheet</span>';
    return '<span class="pill">Not marked</span>';
  }

  function aEvidence() {
    var k = K(), v = V(), g = signals();
    var key = '<div class="key-card"><span class="tag">' + icon('lock') + 'ANSWER KEY: ASSESSOR ONLY</span>' +
      '<p class="small" style="margin-top:10px">Planted claim, draft line ' + (k.fab + 1) + '</p>' +
      '<p class="key-quote">' + esc(k.claim) + '</p>' +
      '<p style="margin-top:12px;font-size:14.5px"><b style="color:var(--ivory)">Why it is a fabrication:</b> ' + esc(k.why) + '</p>' +
      '<p style="margin-top:6px;font-size:14.5px"><b style="color:var(--ivory)">Correct action:</b> ' + esc(k.action) + '</p>' +
      '<p style="margin-top:6px;font-size:14.5px"><b style="color:var(--ivory)">Fact left out of the draft:</b> ' + esc(k.missing) + '</p></div>';

    var sig = '<div class="card tight"><h3 style="margin-bottom:8px">What the record suggests</h3><p class="small" style="margin-bottom:8px">Keyword checks only. Confirm every one by reading the evidence.</p>' +
      '<div class="signal">' + dot(g.flagged ? 'y' : 'n') + '<span>Planted line marked as ' + markPill(g.fabMark) + '</span></div>' +
      '<div class="signal">' + dot(g.noteMentions ? 'y' : 'q') + '<span>Change note mentions the planted claim: ' + (g.noteMentions ? 'yes' : 'no') + '</span></div>' +
      '<div class="signal">' + dot(g.inFinal ? 'n' : 'y') + '<span>Planted claim found in the final notice: ' + (g.inFinal ? 'yes' : 'no') + '</span></div>' +
      '<div class="signal">' + dot(g.missingAdded ? 'y' : 'n') + '<span>Missing fact appears in the final notice: ' + (g.missingAdded ? 'yes' : 'no') + '</span></div>' +
      '<div class="signal">' + dot(g.finalWords <= CONFIG.wordLimit ? 'y' : 'n') + '<span>Final notice: ' + g.finalWords + ' words (limit ' + CONFIG.wordLimit + ')</span></div>' +
      '<div class="signal">' + dot(g.falseFlags === 0 ? 'y' : 'n') + '<span>Correct lines flagged as wrong: ' + g.falseFlags + '. Lines not marked: ' + g.unmarked + ' of ' + g.total + '</span></div>' +
      '<div class="signal">' + dot('q') + '<span>Confidence before: ' + confWord(S.confBefore) + '. After: ' + confWord(S.confAfter) + '</span></div>' +
      '</div>';

    var table = '<div class="card tight"><h3 style="margin-bottom:12px">Draft check</h3><div class="table-scroll"><table class="ev-table"><thead><tr><th>#</th><th>Draft line</th><th>Key</th><th>Learner</th><th>Fix</th></tr></thead><tbody>' +
      v.draft.map(function (line, i) {
        var t = (k.lines || [])[i], m = S.marks[i] || {};
        var keyPill = t === 'fab' ? '<span class="pill bad">Planted</span>' : (t === 'neutral' ? '<span class="pill blue">Harmless, any mark</span>' : '<span class="pill ok">Correct</span>');
        var fix = m.fix === 'remove' ? 'Remove' : (m.fix === 'change' ? 'Change to: ' + esc(m.fixText || '') : '');
        return '<tr><td>' + (i + 1) + '</td><td>' + esc(line) + '</td><td>' + keyPill + '</td><td>' + markPill(m.mark) + '</td><td>' + fix + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<p class="small" style="margin-top:12px">Anything missing? ' + (S.missing.ans ? esc(S.missing.ans) : 'not answered') + (S.missing.text ? ': ' + esc(S.missing.text) : '') + '</p></div>';

    var flow = '<div class="card tight">' +
      '<div class="grid-2">' + evBlock('Request 1', req1Text()) + evBlock('AI answer 1' + (S.offline.ask ? ' (offline pack)' : ''), S.ans1) + '</div>' +
      '<div class="grid-2" style="margin-top:24px">' + evBlock('Request 2 (refinement)', S.req2) + evBlock('AI answer 2' + (S.offline.improve ? ' (offline pack)' : ''), S.ans2) + '</div>' +
      '<div class="ev-block" style="margin-top:24px"><h3>Final notice: what the learner changed</h3><div class="diff">' + diffHtml(S.ans2, S.finalText) + '</div>' +
      '<div class="diff-legend"><span><del>removed</del> from AI answer 2</span><span><ins>added</ins> by the learner</span></div></div>' +
      '<div class="grid-2" style="margin-top:24px">' + evBlock('I removed or fixed / because', (S.note.removed || '') + (S.note.removedWhy ? '\nBecause: ' + S.note.removedWhy : '')) +
      evBlock('I added / because', (S.note.added || '') + (S.note.addedWhy ? '\nBecause: ' + S.note.addedWhy : '')) + '</div>' +
      '<div class="ev-block" style="margin-top:24px"><h3>Self-check ticks</h3><div class="chips">' + v.standard.map(function (st, i) { return '<span class="pill ' + (S.ticks[i] ? 'ok' : '') + '">' + (S.ticks[i] ? '\u2713 ' : '') + esc(st) + '</span>'; }).join('') + '</div></div>' +
      '</div>';

    var timeline = '<div class="card tight"><h3 style="margin-bottom:8px">Time log and observation</h3>' +
      '<p class="small">Started ' + clock(S.startedAt) + '. Submitted ' + clock(S.submittedAt) + '. Active time ' + mmss(S.elapsedAtSubmit || 0) + '.</p>' +
      '<ul style="margin:12px 0 0;padding-left:18px;font-size:14px">' + S.log.map(function (x) { return '<li>' + mmss(x.e) + ': ' + esc(x.msg) + '</li>'; }).join('') +
      S.obs.map(function (x) { return '<li>' + mmss(x.e) + ': Observation: ' + esc(x.msg) + '</li>'; }).join('') + '</ul></div>';

    return '<div class="grid-2" style="align-items:start">' + key + sig + '</div>' + '<div style="height:16px"></div>' + table + flow + timeline;
  }
  function confWord(n) { return n ? ['Not sure', 'A little sure', 'Quite sure', 'Very sure'][n - 1] : 'not given'; }

  function score() {
    var lv = S.scoring.levels, all = true, pct = 0;
    CRITERIA.forEach(function (c) {
      if (lv[c.id] == null) all = false; else pct += (lv[c.id] / 3) * WEIGHTS[c.id];
    });
    var g = S.scoring.gate;
    var gatesSet = g.detected && g.corrected && g.others;
    var gatesMet = g.detected === 'yes' && g.corrected === 'yes' && g.others !== 'no';
    var decision = null;
    if (S.scoring.independent === 'no') decision = 'invalid';
    else if (all && gatesSet && S.scoring.independent === 'yes') decision = (gatesMet && pct >= CONFIG.passPct) ? 'competent' : 'notyet';
    return { all: all, pct: Math.round(pct * 10) / 10, gatesSet: !!gatesSet, gatesMet: gatesMet, decision: decision };
  }
  function decisionText(d) {
    return d === 'competent' ? 'Competent' : (d === 'notyet' ? 'Not yet competent' : (d === 'invalid' ? 'Attempt not valid: reassess' : 'Not decided yet'));
  }

  function yn(path, val, opts) {
    opts = opts || ['yes', 'no'];
    var names = { yes: 'Yes', no: 'No', na: 'Not assessed here' };
    return '<div class="seg" role="group">' + opts.map(function (o) {
      return '<button data-action="a-set" data-arg="' + path + ':' + o + '" aria-pressed="' + (val === o) + '">' + names[o] + '</button>';
    }).join('') + '</div>';
  }

  function aScore() {
    var lv = S.scoring.levels, g = S.scoring.gate, sc = score(), sg = signals();
    var crits = CRITERIA.map(function (c) {
      var cur = lv[c.id];
      return '<div class="crit"><div class="crit-head"><h3>' + esc(c.name) + '</h3><span class="w">Weight ' + WEIGHTS[c.id] + '%</span></div>' +
        '<div class="levels" role="group" aria-label="' + esc(c.name) + '">' + [0, 1, 2, 3].map(function (n) {
          return '<button data-action="level" data-arg="' + c.id + ':' + n + '" aria-pressed="' + (cur === n) + '">' + n + ' ' + LEVEL_NAMES[n] + '</button>';
        }).join('') + '</div>' +
        '<div class="anchor">' + (cur == null ? '<span class="small">Choose a level to see its evidence anchor.</span>' : esc(c.anchors[cur])) + '</div></div>';
    }).join('');

    var gate = '<div class="gate"><h3>' + icon('gate') + 'Non-compensatory gates</h3>' +
      '<p class="small" style="margin:6px 0 10px">A gate that is not met means Not yet competent, whatever the score.</p>' +
      '<div class="yn-row"><span>The planted fabrication was <b>detected</b>: flagged as Wrong or Not in fact sheet, or named in the change note.<br><span class="small">Record suggests: ' + (sg.flagged || sg.noteMentions ? 'yes' : 'no') + '</span></span>' + yn('gate.detected', g.detected) + '</div>' +
      '<div class="yn-row"><span>The planted fabrication was <b>corrected</b>: it is not in the final notice in any form.<br><span class="small">Record suggests: ' + (sg.inFinal ? 'no, still present' : 'yes') + '</span></span>' + yn('gate.corrected', g.corrected) + '</div>' +
      '<div class="yn-row"><span>All other MC-1 non-compensatory gates flagged in workbook column L. Definitions come from the governing document and are not restated here.</span>' + yn('gate.others', g.others, ['yes', 'no', 'na']) + '</div>' +
      '</div>';

    var valid = '<div class="crit"><div class="yn-row" style="border:0;padding:0"><span><b>Conduct:</b> the learner worked alone, with no coaching or outside help, and the timing was kept.</span>' + yn('independent', S.scoring.independent) + '</div></div>';

    var anchors = '<details class="more" style="margin-top:16px"><summary>Moderation anchors for hard cases' + icon('chev') + '</summary><div class="inner"><ul>' +
      '<li>Planted line flagged, but still in the final notice: detected Yes, corrected No. Not yet competent.</li>' +
      '<li>Planted line marked \u201CMatches\u201D, but the AI dropped it and the final is clean: detected No. A clean final by luck is not checking.</li>' +
      '<li>Planted line marked \u201CWrong\u201D instead of \u201CNot in fact sheet\u201D: accept. Both show detection.</li>' +
      '<li>Planted claim softened, for example \u201Ca fine may apply\u201D: corrected No.</li>' +
      '<li>Many correct lines flagged as wrong: the gate can still be met, but Checking process is 1 at most.</li>' +
      '<li>Harmless line marked either way: accept. Do not score down.</li>' +
      '<li>Offline pack used: score in the same way. The time and reason are in the log.</li>' +
      '<li>The AI added a new error of its own and the learner kept it: score it under Task completion and Correction quality. It is not the gate.</li>' +
      '</ul></div></details>';

    var bar = '<div class="result-bar" style="margin-top:16px"><div><span class="small">Weighted score</span><div class="big">' + (sc.all ? sc.pct + '%' : '\u2013') + '</div><span class="small">Pass mark ' + CONFIG.passPct + '% (proposed) and all gates met</span></div>' +
      '<div><span class="small">Decision</span><div class="big" style="font-size:22px">' + decisionText(sc.decision) + '</div>' +
      (sc.gatesSet && !sc.gatesMet ? '<span class="pill bad">Gate not met: score cannot compensate</span>' : '') + '</div></div>';

    return '<div class="layout score-layout"><div>' + crits + '</div><div>' + gate + '<div style="height:12px"></div>' + valid + anchors + bar +
      '<button class="btn btn-blue btn-block" style="margin-top:16px" data-action="a-tab" data-arg="finish">Go to decide and record' + icon('right') + '</button></div></div>';
  }

  function nextVariant() {
    var lane = V().lane, used = S.prevVariants.concat([S.setup.variant]);
    var ids = ['A', 'B', 'C'].map(function (l) { return (lane === 'iti' ? 'ITI-' : 'HE-') + l; }).filter(function (id) { return used.indexOf(id) === -1; });
    return ids[0] || null;
  }
  function aFinish() {
    var sc = score(), nv = nextVariant();
    var re = '';
    if (sc.decision === 'notyet' || sc.decision === 'invalid') {
      re = '<div class="card tight"><h3>Reassessment</h3>' +
        '<p style="margin-top:8px;font-size:14.5px">The learner gets feedback and practice first. The reassessment is on a later day, with a new variant. Never give a corrected copy of this task.</p>' +
        (nv ? '<p class="small" style="margin-top:8px">Next unused variant in this lane: ' + esc(nv) + ', ' + esc(VARIANTS[nv].title) + '.</p>' +
          '<button class="btn btn-ghost" style="margin-top:12px" data-action="reassess">' + icon('refresh') + 'Set up reassessment on this device</button>'
          : '<p class="small" style="margin-top:8px">All three variants in this lane have been used. Ask the production owner for a new variant.</p>') + '</div>';
    }
    return '<div class="card tight">' +
      '<div class="result-bar"><div><span class="small">Decision</span><div class="big">' + decisionText(sc.decision) + '</div>' +
      '<span class="small">' + (sc.all ? 'Weighted score ' + sc.pct + '%. ' : 'Some criteria not scored. ') + (sc.gatesSet ? (sc.gatesMet ? 'Gates met.' : 'A gate is not met.') : 'Gates not decided.') + '</span></div></div>' +
      '<label class="field" style="margin-top:16px"><span class="field-label">Assessor notes</span><span class="field-help">What you saw. Keep it factual.</span><textarea class="textarea" data-bind="scoring.notes">' + esc(S.scoring.notes) + '</textarea></label>' +
      '<label class="field"><span class="field-label">Moderation note</span><span class="field-help">Anything a moderator should know when sampling this record.</span><textarea class="textarea" style="min-height:90px" data-bind="scoring.moderation">' + esc(S.scoring.moderation) + '</textarea></label>' +
      '<div class="meta-row" style="margin-top:20px;justify-content:flex-start;gap:10px">' +
      '<button class="btn btn-blue" data-action="download">' + icon('download') + 'Download evidence record</button>' +
      '<button class="btn btn-ghost" data-action="print">' + icon('print') + 'Print record</button></div>' +
      '<div class="meta-row" style="margin-top:20px"><span class="small">' + (sc.decision ? 'Press Save and show the learner (bottom right) to save the decision. The learner then sees their result. The answer key is not shown to them.' : 'Score every criterion, decide the gates and conduct first.') + '</span>' +
      '</div>' +
      '</div>' + re +
      '<div class="card tight"><h3>Evidence to keep</h3><ul style="margin:10px 0 0;padding-left:18px;font-size:14.5px">' + retentionList().map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<p class="small" style="margin-top:10px">Keep the record as your institution\u2019s assessment records policy requires.</p>' +
      '<hr class="divider"><button class="btn btn-ghost" data-action="clear-device">' + icon('trash') + 'Clear this device for the next learner</button></div>';
  }
  function retentionList() {
    return ['Variant ID and lane', 'Start, pause and submit times', 'Both requests and both AI answers', 'Draft check marks and fix notes', 'Final notice and the change view', 'Learner change note', 'Rubric levels, gate decisions and the final decision', 'Observation notes and any offline-pack use', 'Assessor sign-off, and moderator sign-off where sampled'];
  }
  function strengths(lv) {
    var s = [];
    if (lv.request >= 2) s.push('Clear requests');
    if (lv.checking >= 2) s.push('Careful checking');
    if (lv.correction >= 2) s.push('Clean fixes');
    if (lv.task >= 2) s.push('A notice people can use');
    if (lv.evidence >= 2) s.push('A clear record');
    return s.length ? '<div class="chips" style="justify-content:center">' + s.map(function (x) { return '<span class="pill ok">' + icon('check') + esc(x) + '</span>'; }).join('') + '</div>' : '';
  }

  /* ---------------- evidence record (download / print) ---------------- */
  function recordHtml() {
    var v = V(), k = K(), s = S.setup, sc = score(), g = signals();
    var e = function (t) { return esc(t).replace(/\n/g, '<br>'); };
    var row = function (a, b) { return '<tr><th>' + a + '</th><td>' + b + '</td></tr>'; };
    var box = function (t, body) { return '<h3>' + t + '</h3><div class="box">' + (String(body || '').trim() ? e(body) : '<span class="muted">Nothing recorded.</span>') + '</div>'; };
    var markName = function (m) { return m === 'ok' ? 'Matches' : (m === 'wrong' ? 'Wrong' : (m === 'missing' ? 'Not in fact sheet' : 'Not marked')); };
    var css = 'body{font-family:Rubik,"Instrument Sans",Arial,sans-serif;color:#0E1B5C;background:#fff;margin:0;padding:32px;line-height:1.5;font-size:14px}' +
      'h1{font-size:24px;margin:0 0 4px}h2{font-size:17px;margin:28px 0 10px;padding-bottom:6px;border-bottom:1px solid #E2E6F2}h3{font-size:14px;margin:16px 0 6px}' +
      '.mono{font-family:"Source Code Pro","JetBrains Mono",monospace;font-size:12px;color:#3D5AFE}' +
      'table{border-collapse:collapse;width:100%}th,td{text-align:left;vertical-align:top;padding:7px 10px;border:1px solid #E2E6F2}th{background:#F6F8FF;width:30%}' +
      '.box{border:1px solid #E2E6F2;border-radius:10px;padding:10px 12px;background:#F6F8FF;white-space:normal}.muted{color:#6B7396}' +
      'del{background:#FDE2DF;color:#8A1F14}ins{background:#E3E8FF;text-decoration:none;border-bottom:2px solid #3D5AFE}' +
      '.key{border:1px dashed #FBB034;border-radius:10px;padding:10px 12px}.sign{display:flex;gap:40px;margin-top:30px}.sign div{flex:1;border-top:1px solid #0E1B5C;padding-top:6px}' +
      '.unfinished{border:2px solid #A1262C;color:#A1262C;background:#FDF0F0;border-radius:10px;padding:10px 12px;font-weight:700}' +
      '@page{margin:14mm}';
    var html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Evidence record ' + esc(CONFIG.schema) + ' ' + esc(s.learnerId) + '</title><style>' + css + '</style></head><body>' +
      '<p class="mono">' + CONFIG.schema + ' | CHAL | Section ' + esc(CONFIG.section) + '</p>' +
      '<h1>Evidence record: ' + esc(CONFIG.title) + '</h1>' +
      (sc.decision ? '' : '<p class="unfinished">NOT FINISHED: there is no decision yet.' + (sc.all ? '' : ' Some criteria are not scored.') + (sc.gatesSet ? '' : ' The gates are not decided.') + (S.scoring.independent ? '' : ' The conduct check is not answered.') + '</p>') +
      '<p class="muted">Swift AI Academy. Fictional task data. Assessor record, not for learners.</p>' +
      '<h2>Metadata</h2><table>' +
      row('Module', esc(CONFIG.module)) + row('Mapped performance criteria', esc(CONFIG.pcs)) + row('Non-compensatory status', esc(CONFIG.gates)) +
      row('Learner ID', esc(s.learnerId)) + row('Assessor', esc(s.assessor)) + row('Centre and batch', esc(s.centre || '\u2013')) +
      row('Lane and variant', esc(laneLabel(v.lane)) + ', ' + esc(s.variant) + ': ' + esc(v.title)) + row('Attempt', S.attempt + (S.prevVariants.length ? ' (earlier variants: ' + esc(S.prevVariants.join(', ')) + ')' : '')) +
      row('Approved AI tool', esc(s.tool)) + row('Access mode', s.mode === 'offline' ? 'Offline pack' : 'Online') +
      row('Started', clock(S.startedAt)) + row('Submitted', clock(S.submittedAt) + (S.autoSubmitted ? ' (auto-submitted at 30:00)' : '')) + row('Active time', mmss(S.elapsedAtSubmit || 0)) +
      row('Confidence before / after', confWord(S.confBefore) + ' / ' + confWord(S.confAfter)) + '</table>' +
      '<h2>Answer key</h2><div class="key"><b>Planted claim (line ' + (k.fab + 1) + '):</b> ' + esc(k.claim) + '<br><b>Why:</b> ' + esc(k.why) + '<br><b>Correct action:</b> ' + esc(k.action) + '<br><b>Fact left out:</b> ' + esc(k.missing) + '</div>' +
      '<h2>Draft check</h2><table><tr><th style="width:4%">#</th><th style="width:46%">Line</th><th>Key</th><th>Learner mark</th><th>Fix</th></tr>' +
      v.draft.map(function (line, i) {
        var t = (k.lines || [])[i], m = S.marks[i] || {};
        return '<tr><td>' + (i + 1) + '</td><td>' + esc(line) + '</td><td>' + (t === 'fab' ? 'Planted' : (t === 'neutral' ? 'Harmless' : 'Correct')) + '</td><td>' + markName(m.mark) + '</td><td>' + (m.fix === 'remove' ? 'Remove' : (m.fix === 'change' ? 'Change to: ' + esc(m.fixText || '') : '')) + '</td></tr>';
      }).join('') + '</table>' +
      '<p>Anything missing in the draft? ' + esc(S.missing.ans || 'not answered') + (S.missing.text ? ': ' + esc(S.missing.text) : '') + '</p>' +
      '<h2>Use and refine</h2>' + box('Request 1', req1Text()) + box('AI answer 1' + (S.offline.ask ? ' (offline pack)' : ''), S.ans1) + box('Request 2', S.req2) + box('AI answer 2' + (S.offline.improve ? ' (offline pack)' : ''), S.ans2) +
      '<h2>Check and correct</h2>' + box('Final notice (' + g.finalWords + ' words)', S.finalText) +
      '<h3>Changes from AI answer 2</h3><div class="box">' + diffHtml(S.ans2, S.finalText).replace(/\n/g, '<br>') + '</div>' +
      box('Learner: removed or fixed / because', (S.note.removed || '') + (S.note.removedWhy ? '\nBecause: ' + S.note.removedWhy : '')) +
      box('Learner: added / because', (S.note.added || '') + (S.note.addedWhy ? '\nBecause: ' + S.note.addedWhy : '')) +
      '<p>Self-check ticks: ' + v.standard.map(function (st, i) { return (S.ticks[i] ? '[x] ' : '[ ] ') + esc(st); }).join('; ') + '</p>' +
      '<h2>Scoring</h2><table><tr><th>Criterion</th><th>Weight</th><th>Level</th><th>Anchor</th></tr>' +
      CRITERIA.map(function (c) { var l = S.scoring.levels[c.id]; return '<tr><td>' + esc(c.name) + '</td><td>' + WEIGHTS[c.id] + '%</td><td>' + (l == null ? '\u2013' : l + ' ' + LEVEL_NAMES[l]) + '</td><td>' + (l == null ? '' : esc(c.anchors[l])) + '</td></tr>'; }).join('') + '</table>' +
      '<table style="margin-top:12px">' + row('Gate: planted fabrication detected', esc(S.scoring.gate.detected || '\u2013')) + row('Gate: planted fabrication corrected', esc(S.scoring.gate.corrected || '\u2013')) +
      row('Other MC-1 gates (workbook column L)', esc(S.scoring.gate.others || '\u2013')) + row('Worked independently, timing kept', esc(S.scoring.independent || '\u2013')) +
      row('Weighted score', sc.all ? sc.pct + '% (pass mark ' + CONFIG.passPct + '%, proposed)' : 'incomplete') + row('Decision', '<b>' + decisionText(sc.decision) + '</b>') + '</table>' +
      '<h2>Log and notes</h2><ul>' + S.log.map(function (x) { return '<li>' + mmss(x.e) + ' \u2013 ' + esc(x.msg) + '</li>'; }).join('') + S.obs.map(function (x) { return '<li>' + mmss(x.e) + ' \u2013 Observation: ' + esc(x.msg) + '</li>'; }).join('') + '</ul>' +
      box('Assessor notes', S.scoring.notes) + box('Moderation note', S.scoring.moderation) +
      '<h2>Evidence retention checklist</h2><ul>' + retentionList().map(function (x) { return '<li>[ ] ' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<div class="sign"><div>Assessor signature and date</div><div>Moderator signature and date (if sampled)</div></div>' +
      '</body></html>';
    return html;
  }

  /* ----- assessor view (staff screen; long, so its body scrolls inside the card) ----- */
  function vAssessor() {
    var v = V(), s = S.setup;
    var tabs = [['evidence', 'Evidence'], ['score', 'Score'], ['finish', 'Decide']];
    var body = S.aTab === 'score' ? aScore() : (S.aTab === 'finish' ? aFinish() : aEvidence());
    var sc = score();
    var next = S.aTab === 'evidence' ? { label: 'Go to score', fn: function () { actions['a-tab']('score'); } }
      : (S.aTab === 'score' ? { label: 'Go to decide', fn: function () { actions['a-tab']('finish'); } }
        : { label: 'Save and show the learner', fn: function () { actions.finalise(); } });
    return {
      key: 'assessor-' + S.aTab, count: null, back: null, lead: null,
      work: '<div class="a-top">' +
        '<p class="eyebrow">Assessor view</p>' +
        '<h1 class="title a-title" tabindex="-1">Checkpoint 1: score and record</h1>' +
        '<p class="small">Learner ' + esc(s.learnerId) + ' • ' + laneLabel(v.lane) + ', variant ' + v.letter + ': ' + esc(v.title) + ' • Attempt ' + S.attempt + ' • ' + (s.mode === 'offline' ? 'Offline pack' : 'Online') + '</p>' +
        '<div class="tabs" role="tablist">' + tabs.map(function (t) {
          return '<button type="button" role="tab" aria-selected="' + (S.aTab === t[0]) + '" data-action="a-tab" data-arg="' + t[0] + '">' + t[1] + '</button>';
        }).join('') + '</div></div>' +
        '<div class="a-scroll" tabindex="0" aria-label="Assessor view">' + body + '</div>',
      gate: S.aTab === 'finish' ? function () { return sc.decision ? '' : 'Score every criterion, decide the gates and conduct first.'; } : null,
      next: next
    };
  }

  /* ----- learner result ----- */
  function vResult() {
    var d = S.scoring.decision, lv = S.scoring.levels, g = S.scoring.gate;
    if (d === 'competent') {
      return {
        key: 'result-competent', count: null, back: null, next: null,
        lead: eb('Checkpoint complete') + head('h1', 'You used AI, and you checked it.') +
          lede('You found what was not true, fixed it and showed your work. That is the habit this unit is about.'),
        work: '<div class="badge-wrap"><div class="badge-ring"></div><div class="badge-ring b2"></div>' +
          '<span class="particle" style="top:-8px;right:0;width:6px;height:6px;background:#F3AB31;animation-delay:.2s"></span>' +
          '<span class="particle" style="bottom:2px;left:-12px;width:5px;height:5px;background:#8FA0FF;animation-delay:.9s"></span>' +
          '<div class="badge">' + icon('check') + '</div></div>' +
          strengths(lv) +
          '<div class="next-card"><div class="num">2</div><div class="nc-t">' +
          '<span class="nc-eb">UP NEXT</span>' +
          '<span class="nc-h">Apply It Where It Matters</span>' +
          '<span class="small">MC-2, weeks 5 to 8. Use AI for one area of your work or life, then try the method on new tasks.</span></div></div>'
      };
    }
    var items = [];
    if (d === 'invalid') {
      items.push(['Why this attempt will be repeated', 'The checkpoint must be done alone, with the same time for everyone. This time that did not happen, so the result cannot count. It is not a mark against you.', 'You will do a new task on another day.']);
    } else {
      if (g.detected === 'no') items.push(['Checking every line', 'Something in the draft was not in the fact sheet, and you did not find it. AI can write a rule or a promise that sounds official. It is not true just because it sounds sure. If the fact sheet does not say it, it does not go in.', 'Practise: take any AI answer and mark each line Matches, Wrong or Not in fact sheet.']);
      else if (g.corrected === 'no') items.push(['Making the fix in the final', 'You found a problem, which is good. But the final notice still had a line that is not in the fact sheet. The final version is what people read.', 'Practise: after you fix something, read the final once more, line by line.']);
      if (lv.request != null && lv.request < 2) items.push(['Your requests to the AI', 'The AI only knows what you give it. Give it a role, the context, the task and the format, and give it the facts. Then ask for one clear change, not just “make it better”.', 'Practise with your Request Builder card from Framing and Refining.']);
      if (lv.checking != null && lv.checking < 2 && g.detected !== 'no') items.push(['How you check', 'Check every line, not only the dates. Mark a line Wrong only when the fact sheet says something different.', 'Use the routine in your Rulebook, R3.']);
      if (lv.task != null && lv.task < 2) items.push(['Your final notice', 'Compare your notice with “A good notice has” before you submit. Count the words. Look for the fact that is easy to miss.', 'Practise: write the notice, then tick the standard one item at a time.']);
      if (lv.evidence != null && lv.evidence < 2) items.push(['Your record', 'Write what you changed and why. This shows your thinking, and it helps your assessor see what you did.', 'One short sentence for each change is enough.']);
      if (!items.length) items.push(['Close to the standard', 'Your work is close. Your assessor will talk with you about the parts to strengthen.', 'Ask your assessor for one thing to practise.']);
    }
    return {
      key: 'result-' + d, count: null, back: null, next: null,
      lead: eb('Checkpoint 1') + head('h1', d === 'invalid' ? 'This attempt will be repeated.' : 'You are not there yet, but you are on the way.') +
        lede('Here is what to work on. Next time you will get a new task, not this one.') +
        task('Tap each part to read what to practise.'),
      work: '<div class="fb-list">' + items.map(function (it, k) {
          return '<div class="fb-item"><button type="button" class="fb-h" id="fbh-' + k + '" aria-expanded="false" data-action="fb-toggle">' + icon('target') + '<span>' + esc(it[0]) + '</span>' + icon('chev') + '</button>' +
            '<div class="fb-p" hidden><p>' + esc(it[1]) + '</p><p class="try">' + esc(it[2]) + '</p></div></div>';
        }).join('') + '</div>' +
        '<p class="small">Your assessor will show you the task details after the session.</p>'
    };
  }
  /* every learner feedback card, for narration (generation only) */
  function allFeedbackBacks() {
    return [
      'The checkpoint must be done alone, with the same time for everyone. This time that did not happen, so the result cannot count. It is not a mark against you. You will do a new task on another day.',
      'Something in the draft was not in the fact sheet, and you did not find it. AI can write a rule or a promise that sounds official. It is not true just because it sounds sure. If the fact sheet does not say it, it does not go in. Practise: take any AI answer and mark each line Matches, Wrong or Not in fact sheet.',
      'You found a problem, which is good. But the final notice still had a line that is not in the fact sheet. The final version is what people read. Practise: after you fix something, read the final once more, line by line.',
      'The AI only knows what you give it. Give it a role, the context, the task and the format, and give it the facts. Then ask for one clear change, not just “make it better”. Practise with your Request Builder card from Framing and Refining.',
      'Check every line, not only the dates. Mark a line Wrong only when the fact sheet says something different. Use the routine in your Rulebook, R3.',
      'Compare your notice with “A good notice has” before you submit. Count the words. Look for the fact that is easy to miss. Practise: write the notice, then tick the standard one item at a time.',
      'Write what you changed and why. This shows your thinking, and it helps your assessor see what you did. One short sentence for each change is enough.',
      'Your work is close. Your assessor will talk with you about the parts to strengthen. Ask your assessor for one thing to practise.'
    ];
  }
  /* QA and narration tools only: every fixed spoken text that a playthrough may not reach */
  window.CHAL01_VO = { messages: allMessages, feedback: allFeedbackBacks };

  /* ---------------- actions ---------------- */
  var actions = {
    'foot-next': function () {
      if (!curView || !curView.next) return;
      var g = curView.gate ? curView.gate() : '';
      if (g) {
        if (curView.onGate) { curView.onGate(); render('work'); }
        showGate(g); return;
      }
      if (curView.next.fn) curView.next.fn();
    },
    'foot-back': function () { if (curView && curView.back) curView.back(); },
    'fb-toggle': function (a, el) {
      var b = el || document.activeElement; if (!b || !b.classList.contains('fb-h')) return;
      var open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      var pn = b.nextElementSibling; if (pn) pn.hidden = !open;
    },
    'set-lane': function (a) {
      S.setup.lane = a;
      var cur = S.setup.variant;
      if (!cur || VARIANTS[cur].lane !== a) S.setup.variant = randomVariant(a);
      save(); render('work');
    },
    'set-mode': function (a) { S.setup.mode = a; save(); render('work'); },
    'guide': function (a) { openModal(guideHtml(a), { wide: true }); },
    'setup-done': function () {
      if (setupProblem()) return;
      S.screen = 'welcome'; S.wsub = 0; S.marks = V().draft.map(function () { return {}; });
      save(); render();
    },
    'conf': function (a) { var p = a.split(':'); S[p[0]] = +p[1]; save(); render('work'); },
    'start': function () {
      S.startedAt = Date.now(); S.screen = 'work'; S.step = 1; S.sub = 0;
      log('Clock started. Variant ' + S.setup.variant + ', ' + (S.setup.mode === 'offline' ? 'offline pack' : 'online') + '.');
      save(); render();
    },
    'line-go': function (a) { S.lineAt = +a; save(); render('work'); var b = document.querySelector('.st-dot[data-arg="' + a + '"]'); if (b && document.activeElement && document.activeElement.classList.contains('st-dot')) b.focus({ preventScroll: true }); },
    'mark': function (a) {
      if (S.locked) return;
      var p = a.split(':'), i = +p[0];
      S.marks[i] = S.marks[i] || {};
      S.marks[i].mark = S.marks[i].mark === p[1] ? null : p[1];
      if (S.marks[i].mark === 'ok' || !S.marks[i].mark) { S.marks[i].fix = null; }
      save(); render('work');
    },
    'fix': function (a) {
      if (S.locked) return;
      var p = a.split(':'), i = +p[0];
      S.marks[i].fix = S.marks[i].fix === p[1] ? null : p[1];
      save(); render('work');
      if (S.marks[i].fix === 'change') { var inp = document.querySelector('[data-bind="marks.' + i + '.fixText"]'); if (inp) inp.focus(); }
    },
    'missing': function (a) {
      if (S.locked) return; S.missing.ans = a; save(); render('work');
      if (a === 'yes') { var inp = document.querySelector('[data-bind="missing.text"]'); if (inp) inp.focus(); }
    },
    'req-mode': function (a) { if (S.locked) return; S.req1.mode = a; save(); render('work'); },
    'attach': function (a) { if (S.locked) return; S.req1[a] = !S.req1[a]; save(); render('work'); },
    'copy-req1': function () {
      var t = req1Text();
      if (!t) { toast('Write your request first.', 'info'); return; }
      copyText(t).then(function (ok) { toast(ok ? 'Request copied. Paste it into ' + tool() + '.' : 'Could not copy. Select the text and copy it.', ok ? 'copy' : 'alert'); });
      log('Request 1 copied (' + words(t) + ' words).'); saveSoon();
    },
    'copy-req2': function () {
      if (!S.req2.trim()) { toast('Write your follow-up request first.', 'info'); return; }
      copyText(S.req2.trim()).then(function (ok) { toast(ok ? 'Request copied. Paste it into ' + tool() + '.' : 'Could not copy. Select the text and copy it.', ok ? 'copy' : 'alert'); });
      log('Request 2 copied.'); saveSoon();
    },
    'starter': function (a) {
      if (S.locked) return;
      var map = { shorter: 'Make it shorter, ' + CONFIG.wordLimit + ' words or fewer. ', add: 'Please add: ', remove: 'Please remove: ', simple: 'Use simple, clear words. ', format: 'Use this format: ' };
      var cur = S.req2;
      S.req2 = (cur && !/\s$/.test(cur) ? cur + ' ' : cur) + map[a];
      save();
      var ta = document.getElementById('req2');
      if (ta) { ta.value = S.req2; ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); liveUpdate('req2'); }
    },
    'reset-final': function () {
      if (S.locked) return;
      openModal('<h2 id="modal-title">Start again?</h2><p class="lead" style="font-size:16px">Your edits will be replaced by the AI answer from step 4.</p><div class="actions"><button class="btn btn-ghost" data-action="modal-close">Keep my edits</button><button class="btn btn-primary" data-action="reset-final-yes">Start again</button></div>');
    },
    'reset-final-yes': function () { S.finalText = S.ans2; S.finalSeeded = true; log('Final notice reset to AI answer 2.'); closeModal(); save(); render('work'); },
    'show-diff': function () {
      S.showDiff = true; saveSoon();
      openModal('<h2 id="modal-title">What you changed</h2><p class="small" style="margin-top:6px">Your final notice compared with the new AI answer from step 4.</p>' +
        '<div class="diff" style="margin-top:12px">' + diffHtml(S.ans2, S.finalText) + '</div>' +
        '<div class="diff-legend"><span><del>removed</del> from the AI answer</span><span><ins>added</ins> by you</span></div>' +
        '<div class="actions"><button class="btn btn-ghost" data-action="modal-close">Close</button></div>', { wide: true });
    },
    'tick': function (a) { if (S.locked) return; var p = a.split(':'); S.ticks[+p[0]] = p[1] === '1'; save(); render('work'); },
    'see-all': function () {
      openModal('<h2 id="modal-title">Everything you will submit</h2><div class="stack" style="margin-top:12px">' +
        evBlock('Your first request', req1Text()) + evBlock('AI answer 1', S.ans1) + evBlock('Your follow-up request', S.req2) + evBlock('AI answer 2', S.ans2) + evBlock('Your final notice', S.finalText) +
        evBlock('I removed or fixed / because', (S.note.removed || '') + (S.note.removedWhy ? '\nBecause: ' + S.note.removedWhy : '')) +
        evBlock('I added / because', (S.note.added || '') + (S.note.addedWhy ? '\nBecause: ' + S.note.addedWhy : '')) +
        '</div><div class="actions"><button class="btn btn-ghost" data-action="modal-close">Close</button></div>', { wide: true });
    },
    'submit': function () {
      var g = W.note().gate();
      openModal('<h2 id="modal-title">Submit your work?</h2>' +
        '<p class="lead" style="font-size:16px">After you submit, you cannot change anything.</p>' +
        (g ? '<div class="notice warn" style="margin-top:16px">' + icon('alert') + '<span>You have not said what you changed. Go back and finish one pair first.</span></div>' : '') +
        '<div class="actions"><button class="btn btn-ghost" data-action="modal-close">Go back</button>' + (g ? '<button class="btn btn-primary" data-action="to-note">Go to step 6</button>' : '<button class="btn btn-primary" data-action="submit-yes">' + icon('send') + 'Submit</button>') + '</div>');
    },
    'to-note': function () { closeModal(); S.step = 6; S.sub = 0; save(); render(); },
    'submit-yes': function () { if (W.note().gate()) { closeModal(); return; } closeModal(); submit(false); },
    'open-facts': function () { openSheet(factsCard(true)); },
    'modal-close': function () { closeModal(); },
    'pin-ok': function () { checkPin(); },
    'copy-demo': function () {
      var still = false; try { still = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* old browser */ }
      openModal('<h2 id="modal-title">How to copy and paste</h2><p class="lead" style="font-size:15px">An example only. Your own request is the one on the screen.</p>' +
        '<video class="copy-demo-vid" muted loop playsinline' + (still ? ' controls' : ' autoplay') + ' poster="assets/mocks/dark/anim-copy-paste-loop-poster.webp" width="600" height="400" aria-label="Example: copy the request, paste it into the AI tool and send it, copy the answer, then paste the answer back here."><source src="assets/mocks/dark/anim-copy-paste-loop.mp4" type="video/mp4"></video>' +
        '<div class="actions"><button class="btn btn-ghost" data-action="modal-close">Close</button></div>', { wide: true });
    },
    'tool-problem': function () {
      openModal('<h2 id="modal-title">AI tool not working?</h2><p class="lead" style="font-size:16px">Raise your hand and tell your assessor. They can pause the clock. Your work is saved.</p>' +
        '<div class="actions"><button class="btn btn-ghost" data-action="modal-close">Close</button><button class="btn btn-blue" data-action="assessor-menu">' + icon('lock') + 'Assessor options</button></div>');
    },
    'offline-fill': function (stage) {
      var need = stage === 'ask' ? req1Typed() : S.req2.trim();
      if (!need) { toast('Write your request first. Then your assessor adds the AI answer.', 'info'); return; }
      askPin('Add the AI answer from the offline pack for this step.', function () {
        var v = V();
        if (stage === 'ask') { S.ans1 = v.offline.ask; S.offline.ask = true; }
        else { S.ans2 = v.offline.improve; S.offline.improve = true; }
        log('Offline pack answer added for ' + (stage === 'ask' ? 'request 1' : 'request 2') + '.');
        save(); render('work');
      });
    },
    'assessor-menu': function () {
      askPin('Assessor options for this checkpoint.', openAssessorPanel);
    },
    'pause': function () {
      if (S.pausedAt) { S.pausedTotal += Date.now() - S.pausedAt; S.pausedAt = null; log('Clock resumed.'); }
      else { S.pausedAt = Date.now(); log('Clock paused by assessor.'); }
      save(); openAssessorPanel(); updateTimer();
    },
    'mode-switch': function (a) {
      S.setup.mode = a; log('Access mode switched to ' + (a === 'offline' ? 'offline pack' : 'online') + '.');
      save(); render(); openAssessorPanel();
    },
    'obs-save': function () {
      var el = document.getElementById('obs-in');
      if (el && el.value.trim()) { S.obs.push({ t: Date.now(), e: Math.round(elapsed()), msg: el.value.trim() }); save(); toast('Note saved.', 'check'); }
      openAssessorPanel();
    },
    'end-invalid': function () {
      openModal('<h2 id="modal-title">End this attempt?</h2><p class="lead" style="font-size:16px">Use this only if the attempt cannot continue fairly. The work so far is kept, and you score it as not valid.</p>' +
        '<div class="actions"><button class="btn btn-ghost" data-action="modal-close">Cancel</button><button class="btn btn-primary" data-action="end-invalid-yes">End attempt</button></div>');
    },
    'end-invalid-yes': function () { log('Attempt ended early by assessor.'); S.scoring.independent = 'no'; closeModal(); submit(false); },
    'open-assessor': function () {
      askPin('Open the assessor view. It shows the answer key.', function () { assessorOpen = true; S.screen = 'assessor'; save(); render(); });
    },
    'assessor-lock': function () { assessorOpen = false; S.screen = 'handover'; save(); render(); },
    'a-tab': function (a) { S.aTab = a; save(); render(); },
    'level': function (a) { var p = a.split(':'); S.scoring.levels[p[0]] = +p[1]; save(); render('work'); },
    'a-set': function (a) {
      var p = a.split(':');
      if (p[0] === 'independent') S.scoring.independent = p[1]; else setPath('scoring.' + p[0], p[1]);
      save(); render('work');
    },
    'download': function () {
      var blob = new Blob([recordHtml()], { type: 'text/html' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      var d = new Date().toISOString().slice(0, 10);
      a.href = url; a.download = CONFIG.schema + '_' + (S.setup.learnerId || 'learner').replace(/[^\w-]+/g, '-') + '_' + S.setup.variant + '_attempt' + S.attempt + '_' + d + '.html';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      log('Evidence record downloaded.'); save();
    },
    'print': function () {
      var f = document.createElement('iframe');
      f.setAttribute('aria-hidden', 'true');
      f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
      document.body.appendChild(f);
      var d = f.contentWindow.document;
      d.open(); d.write(recordHtml()); d.close();
      setTimeout(function () {
        try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { toast('Printing is blocked here. Download the record and print it.', 'alert'); }
        setTimeout(function () { f.remove(); }, 1500);
      }, 250);
      log('Evidence record printed.'); save();
    },
    'finalise': function () {
      var sc = score();
      if (!sc.decision) return;
      S.scoring.decision = sc.decision; S.scoring.decidedAt = Date.now();
      log('Decision saved: ' + decisionText(sc.decision) + '.');
      assessorOpen = false; S.screen = 'result'; save(); render();
    },
    'reassess': function () {
      var nv = nextVariant();
      if (!nv) return;
      openModal('<h2 id="modal-title">Set up reassessment?</h2><p class="lead" style="font-size:16px">Download the evidence record first. This clears the current work and prepares variant ' + esc(nv) + ' for the same learner.</p>' +
        '<div class="actions"><button class="btn btn-ghost" data-action="modal-close">Cancel</button><button class="btn btn-primary" data-action="reassess-yes">Set up</button></div>');
    },
    'reassess-yes': function () {
      var keep = { setup: S.setup, attempt: S.attempt + 1, prevVariants: S.prevVariants.concat([S.setup.variant]) };
      var nv = nextVariant();
      S = blank();
      S.setup = keep.setup; S.setup.variant = nv; S.attempt = keep.attempt; S.prevVariants = keep.prevVariants;
      S.screen = 'setup'; assessorOpen = false; closeModal(); save();
      leaving = true; location.reload();
    },
    'clear-device': function () {
      openModal('<h2 id="modal-title">Clear this device?</h2><p class="lead" style="font-size:16px">Download the evidence record first. This removes all work and scores from this device.</p>' +
        '<div class="actions"><button class="btn btn-ghost" data-action="modal-close">Cancel</button><button class="btn btn-primary" data-action="clear-yes">Clear device</button></div>');
    },
    'clear-yes': function () {
      try { localStorage.removeItem(CONFIG.storageKey); } catch (e) { /* ignore */ }
      S = blank(); assessorOpen = false; closeModal();
      leaving = true; location.reload();
    }
  };

  function openAssessorPanel() {
    var paused = !!S.pausedAt;
    var inWork = S.screen === 'work';
    var html = '<h2 id="modal-title">Assessor options</h2>' +
      '<p class="small" style="margin-top:6px">Learner ' + esc(S.setup.learnerId) + ' • Variant ' + esc(S.setup.variant) + (inWork ? ' • Active time ' + mmss(elapsed()) : '') + '</p>';
    if (inWork) {
      html += '<hr class="divider">' +
        '<div class="yn-row" style="border:0;padding-top:0"><span>Clock</span><button class="btn ' + (paused ? 'btn-primary' : 'btn-blue') + ' btn-sm" data-action="pause">' + icon(paused ? 'play' : 'pause') + (paused ? 'Resume clock' : 'Pause clock') + '</button></div>' +
        '<div class="yn-row"><span>AI tool access</span><div class="seg" role="group"><button data-action="mode-switch" data-arg="online" aria-pressed="' + (S.setup.mode === 'online') + '">Online</button><button data-action="mode-switch" data-arg="offline" aria-pressed="' + (S.setup.mode === 'offline') + '">Offline pack</button></div></div>' +
        '<label class="field" style="margin-top:12px"><span class="field-label">Observation note</span><textarea class="textarea" id="obs-in" style="min-height:80px" placeholder="What did you see?"></textarea></label>' +
        '<div class="meta-row"><button class="btn btn-ghost btn-sm" data-action="obs-save">Save note</button><button class="btn-text" data-action="end-invalid">End attempt as not valid</button></div>';
    } else if (S.screen === 'welcome') {
      html += '<hr class="divider"><p style="font-size:14.5px">The clock has not started. You can go back to set-up.</p><div class="actions" style="justify-content:flex-start"><button class="btn btn-ghost btn-sm" data-action="back-setup">Back to set-up</button></div>';
    } else if (S.screen === 'result' || S.screen === 'handover' || S.screen === 'assessor') {
      html += '<hr class="divider"><div class="actions" style="justify-content:flex-start"><button class="btn btn-blue btn-sm" data-action="reopen-assessor">Open assessor view</button></div>';
    }
    html += '<div class="actions"><button class="btn ' + (inWork && !paused ? 'btn-primary' : 'btn-ghost') + '" data-action="modal-close">' + (inWork ? 'Return to learner' : 'Close') + '</button></div>';
    openModal(html);
  }
  actions['back-setup'] = function () { S.screen = 'setup'; closeModal(); save(); render(); };
  actions['reopen-assessor'] = function () { assessorOpen = true; S.screen = 'assessor'; closeModal(); save(); render(); };

  function randomVariant(lane) {
    var ids = ['A', 'B', 'C'].map(function (l) { return (lane === 'iti' ? 'ITI-' : 'HE-') + l; }).filter(function (id) { return S.prevVariants.indexOf(id) === -1; });
    return ids.length ? ids[Math.floor(Math.random() * ids.length)] : '';
  }

  /* ---------------- events ---------------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-action]');
    if (t) {
      if (t.disabled) return;
      var fn = actions[t.getAttribute('data-action')];
      if (fn) { ev.preventDefault(); fn(t.getAttribute('data-arg'), t); }
      return;
    }
    var back = ev.target.closest('.sheet-back, .modal-back');
    if (back && ev.target === back && !back.getAttribute('data-sticky')) closeModal();
  });

  document.addEventListener('input', function (ev) {
    var t = ev.target, b = t.getAttribute && t.getAttribute('data-bind');
    if (!b) return;
    if (S.locked && S.screen === 'work' && S.step < 6) { t.value = getPath(b) || ''; return; }
    setPath(b, t.value);
    if (b === 'finalText') S.finalSeeded = true;
    saveSoon();
    if (t.getAttribute('data-rerender')) { render('work'); return; }
    liveUpdate(b);
  });
  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t.getAttribute && t.getAttribute('data-rerender')) { setPath(t.getAttribute('data-bind'), t.value); save(); render('work'); }
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && document.getElementById('overlay').innerHTML) {
      var back = document.querySelector('#overlay .modal-back, #overlay .sheet-back');
      if (back && !back.getAttribute('data-sticky')) closeModal();
    }
    if (ev.key === 'Enter' && ev.target && ev.target.id === 'pin-in') { ev.preventDefault(); checkPin(); }
  });

  /* a kit that is finished stays finished (Back and Next, and after a reload) */
  document.addEventListener('saa:done', function (e) {
    var k = e.target && e.target.closest && e.target.closest('.saa-kit[data-kid]');
    if (k) { S.kits[k.getAttribute('data-kid')] = true; save(); }
    setTimeout(syncLock, 0);
  });

  /* typed work: warn before the page is closed during the checkpoint (the work itself is saved) */
  var leaving = false;
  function typedAnything() {
    return !!(req1Typed() || S.ans1.trim() || S.req2.trim() || S.ans2.trim() || S.finalText.trim() || S.note.removed.trim() || S.note.added.trim() || S.missing.text.trim());
  }
  window.addEventListener('beforeunload', function (e) {
    save();
    if (!leaving && S.screen === 'work' && !S.submittedAt && typedAnything()) { e.preventDefault(); e.returnValue = ''; return ''; }
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) save(); else tick(); });

  /* ---------------- boot ---------------- */
  if (S.screen === 'setup' && !S.setup.variant) S.setup.variant = randomVariant(S.setup.lane);
  if (S.screen === 'assessor') S.screen = 'handover';   // PIN is needed again after a reload
  /* the layer's start screen is built from the first screen (the learner opening): draw it first */
  (function () {
    var c = document.getElementById('c-welcome');
    if (S.screen !== 'welcome' && c) { var keepW = S.wsub; S.wsub = 0; paint(c, vWelcome()); S.wsub = keepW; }
  })();
  render();
  setInterval(tick, 1000);
  tick();
})();
