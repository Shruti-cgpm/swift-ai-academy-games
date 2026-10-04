/* ================= SLIDE NAV (stage stepper in the footer) =================
   Slides are the <section class="slide"> elements in index.html. Each carries
   data-stage (0–6) = one of the original 7 tabs. Counts are read from the DOM,
   so nothing here hard-codes the number of slides. */
var slides = [];
var TOTAL = 0;
var current = 0;
var stageIcons = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.9 3.1-6 7-6s7 2.1 7 6"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2.5 2.5"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8M8 16h5"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
];
var stageLabels = ["Brief","Why it matters","Prep","Investigate","Findings","Consequences","Result"];

function stageOf(i){ return parseInt(slides[i].getAttribute('data-stage'), 10); }
function firstSlideOf(stage){
  for(var i=0;i<TOTAL;i++){ if(stageOf(i) === stage) return i; }
  return 0;
}
function slideById(id){
  for(var i=0;i<TOTAL;i++){ if(slides[i].getAttribute('data-slide-id') === id) return i; }
  return 0;
}

function buildTabs(){
  slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  TOTAL = slides.length;
  var bar = document.getElementById('stageTrack');
  bar.innerHTML = '';
  stageLabels.forEach(function(label, s){
    var g = document.createElement('button');
    g.type = 'button';
    g.className = 'stg';
    g.setAttribute('data-stage', s);
    g.setAttribute('aria-label', label);
    g.onclick = function(){ goTo(firstSlideOf(s)); };
    var segs = '';
    for(var i=0;i<TOTAL;i++){ if(stageOf(i) === s) segs += '<i data-slide="'+i+'"></i>'; }
    g.innerHTML = '<span class="stg-head">' + stageIcons[s] + '<span>' + label + '</span></span><span class="stg-bar">' + segs + '</span>';
    bar.appendChild(g);
  });
}

function render(){
  var stage = stageOf(current);
  slides.forEach(function(p, i){ p.classList.toggle('active', i === current); });
  document.querySelectorAll('.stg').forEach(function(g){
    var s = parseInt(g.getAttribute('data-stage'), 10);
    g.classList.toggle('active', s === stage);
    g.classList.toggle('done', s < stage);
    if(s === stage) g.setAttribute('aria-current', 'step'); else g.removeAttribute('aria-current');
  });
  document.querySelectorAll('.stg-bar i').forEach(function(seg){
    var i = parseInt(seg.getAttribute('data-slide'), 10);
    seg.className = i < current ? 'is-done' : (i === current ? 'is-current' : '');
  });
  document.getElementById('stageName').textContent = stageLabels[stage];
  document.getElementById('pageCount').textContent = (current+1) + ' / ' + TOTAL;
  document.getElementById('backBtn').disabled = (current === 0);
  document.getElementById('nextBtn').disabled = (current === TOTAL-1);
  // one amber primary per slide: while the slide's own Submit/Check is still pending, Next steps down to glass
  var pending = slides[current].querySelector('.submit-btn:not(.is-done)');
  // consequence slides: the footer button becomes "Check" while an answer is picked but unchecked
  var label = 'Next';
  var slot = slides[current].querySelector('.cq-slot');
  if(slot){
    var cid = slot.getAttribute('data-id');
    var chosen = consequenceChoices[cid] !== undefined;
    var checked = (cid in consequenceResult);
    if(chosen && !checked){ label = 'Check'; document.getElementById('nextBtn').disabled = false; }
    if(!chosen && !checked) pending = true;   // nothing picked yet: Next stays quiet (skipping is still allowed)
  }
  document.getElementById('nextLabel').textContent = label;
  document.getElementById('nextBtn').classList.toggle('is-quiet', !!pending);
  /* the shared kit dims Next while the screen carries data-saa-locked (Check stays active once an answer is picked) */
  slides.forEach(function(sl){
    var lock = false, sc = sl.querySelector('.cq-slot');
    if(sl.querySelector('#submitFindingsBtn') && !findingsSubmitted) lock = true;
    if(sc){ var id = sc.getAttribute('data-id'); lock = consequenceChoices[id] === undefined && !(id in consequenceResult); }
    sl.toggleAttribute('data-saa-locked', lock);
  });
}

function nextAction(){
  var slot = slides[current].querySelector('.cq-slot');
  if(slot){
    var cid = slot.getAttribute('data-id');
    if(consequenceChoices[cid] !== undefined && !(cid in consequenceResult)){ checkConsequence(cid); return; }
  }
  changePage(1);
}

function changePage(delta){
  var next = current + delta;
  if(next < 0 || next > TOTAL-1) return;
  if(delta > 0 && !gateOpen(current)){ showGate(current); return; }
  current = next;
  render();
  save();
}

/* ---- gates (QA fix, Oct 2026): Next and the stage tabs use the same check ---- */
function gateOpen(i){
  var sl = slides[i];
  if(sl.querySelector('.saa-kit[data-required]:not(.is-done)')) return false;
  if(sl.querySelector('#submitFindingsBtn') && !findingsSubmitted) return false;
  var slot = sl.querySelector('.cq-slot');
  if(slot && !(slot.getAttribute('data-id') in consequenceResult)) return false;
  return true;
}
function showGate(i){
  var sl = slides[i];
  var slot = sl.querySelector('.cq-slot');
  if(slot){
    var fb = document.getElementById('cqf-' + slot.getAttribute('data-id'));
    if(fb){ fb.textContent = 'Choose one answer first. Then press Check.'; fb.classList.add('is-need'); }
    return;
  }
  if(sl.querySelector('#submitFindingsBtn')){
    var m = document.getElementById('submitNeed');
    if(m){ m.hidden = false; clearTimeout(m._t); m._t = setTimeout(function(){ m.hidden = true; }, 4000); }
    return;
  }
  var nb = document.getElementById('nextBtn');   /* a kit: the kit lock shows what is left */
  if(nb) nb.click();
}
function goTo(target){
  if(target <= current){ current = target; render(); save(); return; }
  while(current < target){
    if(!gateOpen(current)){ render(); showGate(current); save(); return; }
    current++;
  }
  render();
  save();
}

/* ================= LANE DATA ================= */
var laneDocs = {
  iti: {
    title: "Workshop Equipment Note",
    /* Every phrase of the note is a tappable chunk with the same look, so the note no longer shows where the
       planted errors are. A chunk is [text] (correct) or [text, id, cat] (planted error, id = consequence id).
       Plain strings are the punctuation and spaces between chunks. */
    sections: [
      [['On'], ' ', ['12 September','date','date'], ', ', ['the workshop received'], ' ', ['18 new drill machines','figure','figure'], ', ', ['delivered by'], ' ', ['Bansal Tools Pvt. Ltd.']],
      [['All machines are rated'], ' ', ['for continuous use and'], ' ', ['never require servicing','fact','fact'], '. ', ['The batch has been recorded'], ' ', ['by the store in-charge'], ', ', ['Mr. Verma','name','name'], ', ', ['in the equipment ledger'], '.'],
      [['This delivery'], ' ', ['completes the annual equipment target for the training centre','source','source'], '. ', ['Machines will be issued to batches'], ' ', ['starting next week'], ', ', ['once the safety induction is complete'], ' ', ['for each trainee'], '.']
    ],
    consequences: [
      {id:'figure', cat:'Figure', color:'var(--blue)', phrase:'"18 new drill machines"', options:["People think the order is complete and stop ordering what is still needed.","Store records will not match at inspection, and machines that nobody tracks could go missing.","The delivery invoice number changes by itself.","The manufacturer recalls the drill machines."], correct:1, explain:"The ledger shows 15 machines, not 18. If nobody sees this gap of 3 machines, the store count is wrong."},
      {id:'date', cat:'Date', color:'var(--blue)', phrase:'"12 September"', options:["The machines stop working after that date.","The store in-charge is replaced.","Anyone who checks the ledger against this note will think an entry is missing or wrong.","The invoice is no longer legally valid."], correct:2, explain:"The ledger entry date is 14 September. A wrong date breaks the link between this note and the real record."},
      {id:'fact', cat:'Fact', color:'var(--blue)', phrase:'"never require servicing"', options:["The claim has no effect, because it is only a note.","The training centre gets extra money.","The machines go back to the supplier.","Someone could use a machine unsafely, because nobody plans a service check."], correct:3, explain:"Never accept a servicing claim without a check. Servicing plans come from the manufacturer, not from a note that an AI tool wrote."},
      {id:'name', cat:'Name', color:'var(--blue)', phrase:'"Mr. Verma"', options:["The equipment ledger is no longer valid.","Questions or complaints about the delivery go to the wrong person.","Mr. Verma is asked to resign.","The delivery is cancelled."], correct:1, explain:"The roster lists Mr. Solanki as the store in-charge. Anyone with a question will contact the wrong person."},
      {id:'source', cat:'Source', color:'var(--blue)', phrase:'"completes the annual equipment target"', options:["The ledger entry is deleted.","The system checks the claim by itself.","People think the order is complete and stop ordering what is still needed.","The store in-charge loses the job."], correct:2, explain:"The equipment plan shows only 15 of 30 drill machines received, so the target is not complete. If people believe the claim, they may wrongly stop asking for more equipment."}
    ]
  },
  higher: {
    title: "Campus Event Report",
    sections: [
      [['On'], ' ', ['5 February','date','date'], ', ', ['the department hosted a guest lecture'], ' ', ['attended by'], ' ', ['220 students','figure','figure'], ', ', ['delivered by'], ' ', ['Dr. Kavita Iyer'], '.'],
      [['The lecture was'], ' ', ['the first cross-department session held this year','fact','fact'], '. ', ['Attendance was confirmed'], ' ', ['by the placement cell coordinator'], ', ', ['Mr. Rao','name','name'], ', ', ['according to the sign-in sheet','source','source'], '.'],
      [['A recording'], ' ', ['of the session'], ' ', ['will be shared'], ' ', ['with students who could not attend'], '.']
    ],
    consequences: [
      {id:'figure', cat:'Figure', color:'var(--blue)', phrase:'"220 students"', options:["Next time, rooms and food are planned for the wrong number of people.","The lecture recording is deleted.","Dr. Iyer is asked to give the lecture again.","The placement cell loses money."], correct:0, explain:"The sign-in sheet shows 190 attendees, not 220. If you plan with the bigger number, you book too much room or food."},
      {id:'date', cat:'Date', color:'var(--blue)', phrase:'"5 February"', options:["The guest lecture is cancelled after it took place.","Certificates or emails about the lecture may show the wrong date.","Dr. Iyer's fee changes.","The sign-in sheet is no longer valid."], correct:1, explain:"The real date was 7 February. Certificates or official notices that use this note would show the wrong date."},
      {id:'fact', cat:'Fact', color:'var(--blue)', phrase:'"first cross-department session held this year"', options:["The department loses credit for the event.","Dr. Iyer is not invited again.","A wrong claim is repeated in future posters and brochures.","The event is cancelled."], correct:2, explain:"The note says first, but no record compares the sessions. If the claim is false, it spreads into brochures and reports."},
      {id:'name', cat:'Name', color:'var(--blue)', phrase:'"Mr. Rao"', options:["The sign-in sheet is thrown away.","Questions about the lecture go to the wrong person.","The dean must check the event again.","Mr. Rao is removed from his job."], correct:1, explain:"The real placement cell coordinator is Ms. Nair. Anyone with a question will contact the wrong staff member."},
      {id:'source', cat:'Source', color:'var(--blue)', phrase:'"according to the sign-in sheet"', options:["The sign-in sheet is destroyed after the event.","A claim looks proven by a document that does not support it.","The department stops using sign-in sheets.","Dr. Iyer says the attendance count is wrong."], correct:1, explain:"The sign-in sheet only confirms how many students came. It does not support the claim that this was the first cross-department session."}
    ]
  }
};

/* ================= REFERENCE RECORDS =================
   Made-up records the learner checks the note against on the Investigate slides.
   They hold the true value of every planted error (the same values the consequence
   feedback quotes), agree with the correct details of the note, and add ordinary
   entries so they are not an answer key. */
var laneRecords = {
  iti: [
    { tab: 'Equipment ledger', title: 'Store equipment ledger · September',
      cols: ['Date', 'Item', 'Quantity', 'Supplier', 'Service'],
      rows: [
        ['3 September', 'Bench vices', '10', 'Kumar Hardware Stores', 'Every 12 months'],
        ['14 September', 'Drill machines', '15', 'Bansal Tools Pvt. Ltd.', "Every 6 months, maker's plan"],
        ['21 September', 'Safety goggles', '40', 'Shree Safety Supplies', 'Not needed']
      ],
      foot: 'Machines go to a trainee only after the safety induction is complete.' },
    { tab: 'Staff roster', title: 'Workshop staff roster',
      cols: ['Name', 'Role'],
      rows: [
        ['Mr. Solanki', 'Store in-charge'],
        ['Mr. Verma', 'Fitter instructor'],
        ['Ms. Kaur', 'Safety officer'],
        ['Mr. Das', 'Electrician instructor']
      ],
      foot: 'The safety officer runs the safety induction for each trainee.' },
    { tab: 'Equipment plan', title: 'Annual equipment plan · this year',
      cols: ['Item', 'Target this year', 'Received so far'],
      rows: [
        ['Drill machines', '30', '15'],
        ['Bench vices', '10', '10'],
        ['Safety goggles', '60', '40'],
        ['Lathe machines', '4', '0']
      ],
      foot: '' }
  ],
  higher: [
    { tab: 'Sign-in sheet', title: 'Guest lecture sign-in sheet',
      cols: ['Detail', 'Entry'],
      rows: [
        ['Event', 'Guest lecture by Dr. Kavita Iyer'],
        ['Date', '7 February'],
        ['Time', '11 am to 1 pm'],
        ['Room', 'Seminar hall 2'],
        ['Students signed in', '190'],
        ['Checked by', 'Ms. Nair, placement cell coordinator'],
        ['Recording', 'To be shared with students who could not attend']
      ],
      foot: 'This sheet records attendance only.' },
    { tab: 'Staff list', title: 'Department staff list',
      cols: ['Name', 'Role'],
      rows: [
        ['Ms. Nair', 'Placement cell coordinator'],
        ['Mr. Rao', 'Library in-charge'],
        ['Ms. Joshi', 'Head of department'],
        ['Mr. Pillai', 'Events office assistant']
      ],
      foot: '' }
  ]
};
var recordTab = 0;
var recordOpener = null;

function renderRecords(){
  var recs = laneRecords[currentLane];
  if(recordTab >= recs.length) recordTab = 0;
  var tabs = '';
  recs.forEach(function(r, i){
    tabs += '<button type="button" class="rec-tab' + (i === recordTab ? ' is-on' : '') + '" role="tab" aria-selected="' + (i === recordTab) + '" onclick="showRecord(' + i + ')">' + r.tab + '</button>';
  });
  document.getElementById('recTabs').innerHTML = tabs;
  var r = recs[recordTab];
  var html = '<div class="fpe-rec-head"><p class="rec-title">' + r.title + '</p><span class="fpe-made-up">MADE-UP RECORD</span></div><div class="rec-scroll" tabindex="0" role="region" aria-label="' + r.title + '"><table class="rec-table"><thead><tr>';
  r.cols.forEach(function(c){ html += '<th scope="col">' + c + '</th>'; });
  html += '</tr></thead><tbody>';
  r.rows.forEach(function(row){
    html += '<tr>';
    row.forEach(function(cell){ html += '<td>' + cell + '</td>'; });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  if(r.cols.length > 3) html += '<p class="rec-swipe saa-vo-skip">Swipe the table sideways to see every column.</p>';
  if(r.foot) html += '<p class="rec-foot">' + r.foot + '</p>';
  document.getElementById('recBody').innerHTML = html;
}

function showRecord(i){
  recordTab = i;
  renderRecords();
  var on = document.querySelector('#recTabs .rec-tab.is-on');
  if(on) on.focus();
}

function openRecords(btn){
  recordOpener = btn || null;
  renderRecords();
  document.getElementById('recOverlay').hidden = false;
  document.getElementById('recClose').focus();
}

function closeRecords(){
  var ov = document.getElementById('recOverlay');
  if(ov.hidden) return;
  ov.hidden = true;
  if(recordOpener && recordOpener.focus) recordOpener.focus();
}

document.addEventListener('keydown', function(e){
  if(e.key === 'Escape' && !document.getElementById('recOverlay').hidden){ e.stopPropagation(); closeRecords(); }
}, true);

var currentLane = 'iti';
var flagState = {};
var consequenceChoices = {};   // id -> chosen option index
var consequenceResult = {};    // id -> true/false once checked (cleared when the choice changes)
var findingsSubmitted = false;
var consequencesChecked = false;
var findScore = 0, falsePos = 0, consScore = 0;

/* Game 15 designer icons (Oct 2026): status drawings from the pack, drawn inline so the row colour still applies */
var ICON_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m7.5 12 3 3 6-6"/></svg>';
var ICON_MISS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 17h.01"/></svg>';
var ICON_FP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22V3h15l-3 5 3 5H4"/><circle cx="18" cy="18" r="5"/><path d="m16 16 4 4m0-4-4 4"/></svg>';
var ICON_FLAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22V3h15l-3 5 3 5H4"/></svg>';
/* check-type icon for a category (fact / figure / date / name / source), ivory on the dark game */
function catIcon(cat, cls){
  if(!cat) return '';
  return '<img class="fpe-ic ' + (cls || '') + '" src="assets/icons/dark/icon-' + String(cat).toLowerCase() + '.webp" alt="" aria-hidden="true">';
}
var CQ_PROMPT = 'Press Check to see if your answer is right.';
var EMPTY_FINDINGS = '<p class="empty-note">Submit your findings first to see each result here.</p>';

/* The case file is paginated: each lane has 3 sections, rendered into the
   .doc-text[data-part] blocks on the three Investigate part slides. Flags live in one
   shared flagState, so they survive moving between the parts. */
function renderDoc(){
  var lane = laneDocs[currentLane];
  document.querySelectorAll('.docTitle').forEach(function(t){ t.textContent = lane.title; });
  document.querySelectorAll('.doc-text[data-part]').forEach(function(box){
    var part = parseInt(box.getAttribute('data-part'), 10);
    box.innerHTML = buildSection(lane.sections[part] || [], part);
  });
  flagState = {};
  updateFlagUI();
  findingsSubmitted = false;
  consequencesChecked = false;
  resetFindingsUI();
}

/* one section of the note -> chunk buttons, all with the same neutral look until flagged.
   Planted errors keep data-real="true" + data-id/data-cat (results and consequences use them);
   every other chunk is data-real="false", so flagging it is a false flag. */
function escHtml(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function buildSection(tokens, part){
  return tokens.map(function(tk, i){
    if(typeof tk === 'string') return escHtml(tk);
    var real = !!tk[1];
    var id = real ? tk[1] : ('ok-' + part + '-' + i);
    return '<span class="flag" role="button" tabindex="0" aria-pressed="false" data-real="' + real + '" data-id="' + id + '"' +
      (real ? ' data-cat="' + tk[2] + '"' : '') + ' onclick="toggleFlag(this)" onkeydown="flagKey(event,this)">' + escHtml(tk[0]) + '</span>';
  }).join('');
}
function flagKey(e, el){
  if(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){ e.preventDefault(); toggleFlag(el); }
}

function switchLane(){
  currentLane = document.getElementById('laneSelect').value;
  recordTab = 0;
  resetTimer();
  renderDoc();
  renderConsequenceList();
  updateGateResult();
  render();
  save();
}

/* lane option cards (Game 15 designer assets): they set the existing select and call switchLane() */
function pickLane(lane){
  var sel = document.getElementById('laneSelect');
  document.querySelectorAll('.fpe-lane').forEach(function(b){ b.setAttribute('aria-checked', b.getAttribute('data-lane') === lane ? 'true' : 'false'); });
  if(sel.value === lane) return;
  sel.value = lane;
  switchLane();
}

function toggleFlag(el){
  // the timer starts by itself with the first flag
  if(!timerRunning && timerSeconds === 300) toggleTimer();
  el.classList.toggle('flagged');
  var id = el.getAttribute('data-id');
  flagState[id] = el.classList.contains('flagged');
  el.setAttribute('aria-pressed', flagState[id] ? 'true' : 'false');
  updateFlagUI();
  save();
}

function updateFlagUI(){
  var count = 0;
  Object.keys(flagState).forEach(function(k){ if(flagState[k]) count++; });
  document.querySelectorAll('.flagCount').forEach(function(b){ b.textContent = count; });
  // review list on the submit slide
  var chips = '';
  document.querySelectorAll('.doc-text .flag.flagged').forEach(function(el){
    chips += '<span class="review-chip">' + ICON_FLAG + el.textContent + '</span>';
  });
  var review = document.getElementById('flagReview');
  review.innerHTML = chips || '<p class="empty-note">You have not flagged any phrases yet.</p>';
  // every phrase can be flagged now: a long list switches to compact chips so it stays on screen
  review.classList.toggle('is-many', count > 8);
}

/* ================= TIMER ================= */
var timerSeconds = 300;
var timerInterval = null;
var timerRunning = false;

function setTimerBtns(label, disabled){
  document.querySelectorAll('.timerBtn').forEach(function(b){ b.textContent = label; if(disabled) b.disabled = true; });
}

function toggleTimer(){
  if(timerSeconds <= 0) return;
  if(timerRunning){
    clearInterval(timerInterval);
    timerRunning = false;
    setTimerBtns('Resume timer');
  } else {
    timerRunning = true;
    setTimerBtns('Pause timer');
    timerInterval = setInterval(function(){
      timerSeconds--;
      if(timerSeconds <= 0){
        timerSeconds = 0;
        clearInterval(timerInterval);
        timerRunning = false;
        setTimerBtns("Time's up", true);
        document.querySelectorAll('.timer-up').forEach(function(m){ m.hidden = false; });
      }
      updateTimerDisplay();
      if(timerSeconds % 5 === 0) save();
    }, 1000);
  }
}

/* a new lane starts a fresh timer */
function resetTimer(){
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = 300;
  document.querySelectorAll('.timerBtn').forEach(function(b){ b.textContent = 'Start timer'; b.disabled = false; });
  document.querySelectorAll('.timer-up').forEach(function(m){ m.hidden = true; });
  updateTimerDisplay();
}

function updateTimerDisplay(){
  var m = Math.floor(timerSeconds/60);
  var s = timerSeconds%60;
  var txt = (m<10?'0':'')+m + ':' + (s<10?'0':'')+s;
  document.querySelectorAll('.timerDisplay').forEach(function(d){ d.textContent = txt; });
}

/* ================= FINDINGS ================= */
function resetFindingsUI(){
  document.querySelectorAll('.findings-list').forEach(function(l){ l.innerHTML = EMPTY_FINDINGS; });
  document.getElementById('scoreRingText').textContent = '0/5';
  document.getElementById('scoreRing').style.background = '';
  document.getElementById('scoreHeadline').textContent = 'Submit your findings on the previous page first.';
  document.getElementById('submitFindingsBtn').classList.remove('is-done');
}

function submitFindings(){
  findingsSubmitted = true;
  var spans = document.querySelectorAll('.doc-text .flag');
  var found = 0, missed = 0, fp = 0;
  var rows = [];

  spans.forEach(function(el){
    var id = el.getAttribute('data-id');
    var isReal = el.getAttribute('data-real') === 'true';
    var isFlagged = !!flagState[id];
    if(isReal && isFlagged){
      found++;
      rows.push('<div class="finding-row found">'+ICON_OK+catIcon(el.getAttribute('data-cat'),'fpe-fr-cat')+'<span><b>Found.</b> You flagged "' + el.textContent + '", and it was a planted error.</span></div>');
    } else if(isReal && !isFlagged){
      missed++;
      rows.push('<div class="finding-row missed">'+ICON_MISS+catIcon(el.getAttribute('data-cat'),'fpe-fr-cat')+'<span><b>Missed.</b> "' + el.textContent + '" was a planted error, but you did not flag it.</span></div>');
    } else if(!isReal && isFlagged){
      fp++;
      rows.push('<div class="finding-row falsepos">'+ICON_FP+'<span><b>False flag.</b> You flagged "' + el.textContent + '", but it was correct.</span></div>');
    }
  });

  findScore = found;
  falsePos = fp;

  // paginate the result rows over the 2 result slides. Every phrase of the note can now be flagged, so a
  // learner with many false flags gets more rows: the lists then switch to a compact layout to stay on screen.
  var lists = document.querySelectorAll('.findings-list');
  var per = Math.ceil(rows.length / lists.length) || 1;
  lists.forEach(function(l, i){
    var chunk = rows.slice(i*per, (i+1)*per);
    l.classList.toggle('is-dense', per > 3);
    l.classList.toggle('is-many', per > 5);
    l.innerHTML = chunk.length ? chunk.join('') : '<p class="empty-note">There are no more findings. See the previous slide.</p>';
  });
  document.getElementById('scoreRingText').textContent = found + '/5';
  var pct = (found/5)*360;
  document.getElementById('scoreRing').style.background =
    'conic-gradient(var(--blue) ' + pct + 'deg, rgba(255,255,255,0.10) ' + pct + 'deg)';
  document.getElementById('scoreHeadline').textContent =
    'You found ' + found + ' of 5 planted errors.' + (fp>0 ? (' You made ' + fp + ' false flag' + (fp>1?'s':'') + '.') : '');
  document.getElementById('submitFindingsBtn').classList.add('is-done');

  updateGateResult();
  if(restoring) return;
  current = slideById('findings');
  render();
  save();
}

/* ================= CONSEQUENCES (one question per slide) ================= */
function renderConsequenceList(){
  var lane = laneDocs[currentLane];
  consequenceChoices = {};
  consequenceResult = {};
  document.querySelectorAll('.cq-slot').forEach(function(slot){
    var idx = parseInt(slot.getAttribute('data-q'), 10);
    var item = lane.consequences[idx];
    var html = '<p class="kicker">Consequence ' + (idx+1) + ' of ' + lane.consequences.length + '</p>';
    html += '<h2>What does this error break?</h2>';
    html += '<p class="do"><b>Your task.</b> Choose one answer, then press Check.</p>';
    html += '<div class="cq-item" id="cq-'+item.id+'" data-correct="'+item.correct+'">';
    html += '<div class="cq-phrase"><span class="catlabel">'+catIcon(item.id,'fpe-cat-ic')+item.cat+'</span>'+item.phrase+'</div>';
    /* match kit, pick mode (Oct 2026): a cable from the error to the chosen consequence. It only selects:
       setConsequence / Check / scoring are unchanged, and the cable turns green or red only after Check. */
    html += '<div class="cq-options saa-kit" data-kit="match" data-mode="pick" data-style="wire" role="radiogroup" aria-label="Choose the consequence">';
    item.options.forEach(function(opt, oi){
      html += '<button type="button" class="cq-opt saa-m-target" role="radio" aria-checked="false" data-i="'+oi+'" onclick="setConsequence(\''+item.id+'\', '+oi+')">'
            + '<span class="cq-letter">'+String.fromCharCode(65+oi)+'</span><span>'+opt+'</span></button>';
    });
    html += '</div>';
    html += '<div class="cq-feedback saa-k-why" id="cqf-'+item.id+'" aria-live="polite">'+CQ_PROMPT+'</div>';
    html += '</div>';
    slot.setAttribute('data-id', item.id);
    slot.innerHTML = html;
  });
}

function setConsequence(id, value){
  // QA fix: the first checked answer counts. After Check, the answer is locked.
  if(id in consequenceResult) return;
  consequenceChoices[id] = value;
  delete consequenceResult[id];
  var item = document.getElementById('cq-'+id);
  item.classList.remove('right','wrong');
  item.querySelectorAll('.cq-opt').forEach(function(b){
    var on = parseInt(b.getAttribute('data-i'), 10) === value;
    b.classList.toggle('is-selected', on);
    b.classList.remove('is-right','is-wrong');
    b.setAttribute('aria-checked', on ? 'true' : 'false');
  });
  var fb = document.getElementById('cqf-'+id);
  fb.classList.remove('show','is-need');
  fb.textContent = CQ_PROMPT;
  updateGateResult();
  render();
  save();
}

function checkConsequence(id){
  var lane = laneDocs[currentLane];
  var item = lane.consequences.filter(function(c){ return c.id === id; })[0];
  var chosen = consequenceChoices[id];
  var el = document.getElementById('cq-'+id);
  var fb = document.getElementById('cqf-'+id);
  el.classList.remove('right','wrong');
  if(chosen === undefined || chosen === ''){
    fb.textContent = 'Choose one of the answers first.';
    return;
  }
  var isRight = (parseInt(chosen, 10) === item.correct);
  consequenceResult[id] = isRight;
  paintConsequence(id);   /* the right / wrong class it adds plays the sound */
  checkConsequences();
  render();
  save();
}

/* draw a checked answer: colours, the reason, and the options locked */
function paintConsequence(id){
  var lane = laneDocs[currentLane];
  var item = lane.consequences.filter(function(c){ return c.id === id; })[0];
  var el = document.getElementById('cq-'+id), fb = document.getElementById('cqf-'+id);
  if(!item || !el || !(id in consequenceResult)) return;
  var isRight = consequenceResult[id];
  el.classList.remove('right','wrong');
  el.classList.add(isRight ? 'right' : 'wrong', 'is-locked');
  el.querySelectorAll('.cq-opt').forEach(function(b){
    var on = parseInt(b.getAttribute('data-i'), 10) === consequenceChoices[id];
    b.classList.toggle('is-selected', on);
    b.setAttribute('aria-checked', on ? 'true' : 'false');
    if(on) b.classList.add(isRight ? 'is-right' : 'is-wrong');
    b.disabled = true;
  });
  fb.classList.remove('is-need');
  fb.classList.add('show');
  fb.textContent = (isRight ? 'Yes. ' : 'Not quite. ') + item.explain;
}

/* recompute the consequence score across all five slides */
function checkConsequences(){
  var lane = laneDocs[currentLane];
  var rightCount = 0, checkedCount = 0;
  lane.consequences.forEach(function(item){
    if(item.id in consequenceResult){ checkedCount++; if(consequenceResult[item.id]) rightCount++; }
  });
  consScore = rightCount;
  consequencesChecked = (checkedCount === lane.consequences.length);
  updateGateResult();
}

/* ================= GATE RESULT ================= */
function updateGateResult(){
  var box = document.getElementById('gateResult');
  if(!findingsSubmitted || !consequencesChecked){
    var lane = laneDocs[currentLane];
    var done = Object.keys(consequenceResult).length;
    box.className = 'gate-result';
    document.getElementById('gateHeadline').textContent = 'Finish the investigation and the consequence questions first.';
    document.getElementById('gateSub').textContent = 'Your full result will appear here.';
    document.getElementById('gateScore').textContent =
      'Findings: ' + (findingsSubmitted ? 'submitted' : 'not submitted yet') + '. Consequences checked: ' + done + ' of ' + lane.consequences.length + '.';
    document.getElementById('restartBtn').hidden = true;
    return;
  }
  // QA fix: flagging every phrase must not clear the gate, so false flags count too.
  var passed = (findScore >= 4 && falsePos <= MAX_FALSE && consScore >= 4);
  box.className = 'gate-result ' + (passed ? 'pass' : 'fail');
  document.getElementById('gateHeadline').textContent = passed
    ? 'You cleared the gate.'
    : 'You have not cleared the gate yet. Try this case again.';
  document.getElementById('gateSub').textContent = passed
    ? 'You found at least 4 of 5 planted errors, with no more than 2 false flags. You chose at least 4 of 5 consequences correctly. This clears the gate.'
    : 'To clear this gate, you need at least 4 of 5 errors found, no more than 2 false flags, and 4 of 5 consequences correct. Tap Start again, read the note again and try again.';
  document.getElementById('gateScore').textContent =
    'Errors found: ' + findScore + '/5. False flags: ' + falsePos + '. Consequences correct: ' + consScore + '/5.';
  document.getElementById('restartBtn').hidden = passed;
}
var MAX_FALSE = 2;

/* ================= SAVE / RESTORE (QA fix: a refresh keeps your work) ================= */
var SAVE_KEY = 'saa-g15-find-planted-errors';
var restoring = false;
function save(){
  if(restoring) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      lane: currentLane, flags: flagState, submitted: findingsSubmitted,
      choices: consequenceChoices, results: consequenceResult, current: current, timer: timerSeconds
    }));
  } catch(e){}
}
function restore(){
  var d = null;
  try { d = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch(e){ d = null; }
  if(!d || !laneDocs[d.lane]) return;
  restoring = true;
  try {
    if(d.lane !== currentLane){ pickLane(d.lane); }
    Object.keys(d.flags || {}).forEach(function(id){
      if(!d.flags[id]) return;
      var el = document.querySelector('.doc-text .flag[data-id="'+id+'"]');
      if(el){ el.classList.add('flagged'); el.setAttribute('aria-pressed', 'true'); flagState[id] = true; }
    });
    updateFlagUI();
    if(typeof d.timer === 'number' && d.timer < 300){
      timerSeconds = Math.max(0, d.timer); updateTimerDisplay();
      if(timerSeconds <= 0){ setTimerBtns("Time's up", true); document.querySelectorAll('.timer-up').forEach(function(m){ m.hidden = false; }); }
      else { setTimerBtns('Resume timer'); }
    }
    if(d.submitted){ submitFindings(); }
    Object.keys(d.results || {}).forEach(function(id){
      if(d.choices && d.choices[id] !== undefined){ consequenceChoices[id] = d.choices[id]; consequenceResult[id] = d.results[id]; paintConsequence(id); }
    });
    checkConsequences();
    if(typeof d.current === 'number' && d.current >= 0 && d.current < TOTAL){ current = d.current; }
  } finally { restoring = false; }
  render();
}
function startAgain(){
  try { localStorage.removeItem(SAVE_KEY); } catch(e){}
  location.reload();
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', function(){
  buildTabs();
  renderDoc();
  renderConsequenceList();
  updateTimerDisplay();
  updateGateResult();
  render();
  restore();
});
