/* ==========================================================================
   AAI-E-MC1-S03-FAC01 — Facilitator Kit · slide navigation
   Every slide fits one screen. Slides are grouped under the original 8
   sections; the jump select goes to a section's first slide.
   ========================================================================== */
var sectionLabels = ["Cover","Before you deliver","Run sheet","Demo script","Wrong-answer protocol","Answer bank","Contingencies","Closing"];
var slides = [];
var current = 0;

/* ================= RUN SHEET DATA ================= */
var runBlocks = [
  {time:"0:00–0:15", title:"Opening and hook", head:"Block 1 opens the session with a hook.", exact:"\"Today is not about whether AI is good or bad. It is about one habit: never send what you have not checked.\"",
   guidance:"Introduce yourself and the session goal in your own words.",
   action:"Learners listen. They do not need a device yet.",
   evidence:"No evidence is needed for this block.",
   recovery:"If the room is slow to settle, start the demo 1 minute early. Do not wait."},
  {time:"0:15–0:45", title:"Demo: controlled fabrication (Talk-Show)", head:"Block 2 is the controlled fabrication demo.", exact:"The exact lines are on the Demo script pages.",
   guidance:"Run the industrial visit note demo. This block is mostly your talk, but keep it under 30 minutes.",
   action:"Learners watch and can ask questions. They do not correct anything themselves yet.",
   evidence:"No evidence is needed for this block.",
   recovery:"If the projector fails, read the AI draft and the real register aloud."},
  {time:"0:45–1:15", title:"30-second marking routine (Do)", head:"Block 3 is the 30-second marking routine.", exact:"\"Your turn. You have 30 seconds. Mark every fact, figure, date, name and source. Go.\"",
   guidance:"Give each learner their own fictional record. Show the timer so that everyone can see it.",
   action:"Every learner marks their own copy.",
   evidence:"Each learner gives you one marked copy.",
   recovery:"If a learner has no record, pair them with a neighbour for now."},
  {time:"1:15–1:30", title:"Break", exact:"", guidance:"", action:"", evidence:"", recovery:"", isBreak:true},
  {time:"1:30–2:15", title:"Independent practice: mark and separate (Do)", head:"In block 4, learners mark and separate on their own.", exact:"",
   guidance:"Learners work through the Reading and Marking Card content at their own pace.",
   action:"Learners mark, then sort into supported, uncertain and unsupported.",
   evidence:"Each learner completes a marking and sorting sheet.",
   recovery:"Fast finishers move to the Practice Bot retry round. Slow finishers get 5 extra minutes before the review."},
  {time:"2:15–2:45", title:"Review and peer check-in", head:"Block 5 is the review and peer check-in.", exact:"",
   guidance:"Run a short peer exchange with the rubric from the Peer Exchange activity.",
   action:"Each learner gives and gets one strength, one risk and one suggested change.",
   evidence:"Learners write notes on the peer rubric.",
   recovery:"If pairs are uneven, form one group of 3 and change the timing a little."},
  {time:"2:45–3:00", title:"Break", exact:"", guidance:"", action:"", evidence:"", recovery:"", isBreak:true},
  {time:"3:00–3:45", title:"Correct, qualify, remove practice (Do)", head:"In block 6, learners correct, qualify and remove.", exact:"",
   guidance:"Learners complete the 'Correct It, Then Finish It' lab.",
   action:"Learners fix wrong statements, complete the missing ending and log the change they made.",
   evidence:"Each learner completes the lab log.",
   recovery:"If time is short, completing the ending comes before all 3 corrections."},
  {time:"3:45–4:30", title:"Find the Planted Errors lab + live moment watch", head:"Block 7 is the Find the Planted Errors lab.", exact:"",
   guidance:"Run the timed lab. Watch for a real wrong answer from a live tool in this block, and use the Wrong-answer protocol pages if one appears.",
   action:"Learners flag errors and state the consequences under time pressure.",
   evidence:"Collect the lab findings and the consequence answers.",
   recovery:"If the timer causes clear stress, quietly give more time. Do not stop the activity."},
  {split:3, time:"4:30–5:00", title:"Closing, Rulebook check, questions", head:"Block 8 closes the session with the Rulebook check.", exact:"\"Before you leave, your Rulebook page for this section must be complete, not just started.\"",
   guidance:"Check each learner's Rulebook page and Practice Bot mastery status. Use the Answer bank for the last questions.",
   action:"Learners finish their Rulebook page. They take a screenshot of it or print it.",
   evidence:"Collect the completed Rulebook page, Practice Bot mastery and Lab logs.",
   recovery:"If a learner has not reached mastery, note it and plan a short follow-up. Do not pass them through."}
];

/* short labels for the "put the day in order" rehearsal on the last run-sheet page */
var runOrderLabels = ["Opening and hook","Controlled fabrication demo","30-second marking routine","Mark and separate practice","Review and peer check-in","Correct, qualify, remove practice","Find the Planted Errors lab","Closing and Rulebook check"];

/* ================= ANSWER BANK DATA ================= */
var qaData = [
  {cluster:"Concept", q:"What really counts as evidence?", policy:false,
   direct:"Evidence is something you can point to and check right now, like a register, a notice or a portal.",
   reason:"A sure tone from an AI tool is not evidence by itself.",
   next:"Ask the learner to name the exact record they would check. \"It sounds right\" is not enough."},
  {cluster:"Concept", q:"What if there is no source to check?", policy:false,
   direct:"Qualify the claim as unconfirmed. Remove it if it is not essential.",
   reason:"Guessing either way is worse than saying plainly that it is unconfirmed.",
   next:"Model the phrase: \"This could not be confirmed, so it was qualified or removed.\""},
  {cluster:"Access", q:"What if a learner's device will not open the AI tool?", policy:false,
   direct:"Pair them with a neighbour for this block. Do not let them fall behind alone.",
   reason:"Access problems are common on shared or older devices.",
   next:"After the session, log the device problem for the facility coordinator."},
  {cluster:"Privacy", q:"Can we use a learner's real name in the demo?", policy:false,
   direct:"No. Every name, figure and record in a demo must be fictional.",
   reason:"This is a firm rule. It is not a judgement call.",
   next:"If a learner offers their own details, thank them. Then use a fictional name."},
  {cluster:"Privacy", q:"A learner wants to type their marks or ID into the AI tool. What do I say?", policy:true, icons:['private-marks-never-share','private-id-never-share'],
   direct:"Stop them. Explain that this is never allowed, in this course or after it.",
   reason:"Marks, IDs, phone numbers and health details must never go into an AI tool.",
   next:"If this keeps happening, escalate to your programme coordinator. It needs a policy conversation, not just a correction in the moment."},
  {cluster:"Accuracy", q:"The AI gave two different answers to the same question. Which is right?", policy:false,
   direct:"Neither answer is automatically right. Check both against a real record.",
   reason:"AI tools can give different answers to the same question.",
   next:"If it happens in front of the class, use it as a live example of why marking and checking matter."},
  {cluster:"Language", q:"Can learners answer in Hindi or another language during discussion?", policy:true,
   direct:"This is an English-language delivery, so guide discussion in English. Do not penalise a learner for a short switch into another language.",
   reason:"The written activity and the English delivery standard must stay the same for the section. The tone of class discussion is your judgement as facilitator.",
   next:"If this happens often, raise it with your production owner. Do not set your own rule."},
  {cluster:"Assessment", q:"Does finding zero planted errors mean the learner fails the whole unit?", policy:false,
   direct:"No. It means that this lab needs another attempt. The unit is not failed automatically.",
   reason:"The lab is a strict gate, so it must be passed. Retries are expected and normal.",
   next:"Send the learner back to the lab's retry path."},
  {cluster:"Assessment", q:"Can I mark someone complete if they tried but did not reach mastery?", policy:true,
   direct:"No. This section needs mastery, not just an attempt.",
   reason:"This is a strict gate. An attempt is not the same as clearing it.",
   next:"Plan a short follow-up session for that learner. Do not mark them complete."},
  {cluster:"Escalation", q:"What if I really do not know the answer to a learner's question?", policy:false,
   direct:"Say plainly: \"I will verify this and confirm next session.\" Then really do it.",
   reason:"A confident guess from you teaches the opposite of what this course is about.",
   next:"Note the question so that you remember to answer it later."},
  {cluster:"Escalation", q:"A learner is upset because a wrong AI answer affected their work. What now?", policy:true,
   direct:"Take it seriously, and do not decide the outcome alone.",
   reason:"This may affect grading or fairness across the batch.",
   next:"Follow your programme's escalation path. Tell your coordinator the same day."}
];

var ICON_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

/* Game 20 designer assets (Oct 2026): Talk/Do mode per block, row icons, cluster icons */
var FK_ICONS = 'assets/icons/';
var runModes = ["Talk","Talk","Do","Do","Do","Do","Do","Talk"];   /* by block number 1-8 */
var runRowIcons = {   /* block number -> which row gets which icons (pictures only, no words) */
  3:{row:'exact', icons:['mark','timer-30s']},
  4:{row:'action', icons:['supported','uncertain','unsupported']},
  5:{row:'action', icons:['strength','risk','suggest']},
  6:{row:'action', icons:['correct']},
  7:{row:'guidance', icons:['timer'], before:true},
  8:{row:'action', icons:['rulebook']}
};
function fkImgs(list, cls){
  return '<span class="'+(cls||'fk-icons')+'" aria-hidden="true">'+list.map(function(n){ return '<img src="'+FK_ICONS+'icon-'+n+'.webp" alt="">'; }).join('')+'</span>';
}
function modeBadge(n){
  var m = runModes[n-1];
  return '<span class="fk-mode-badge fk-mode-'+m.toLowerCase()+'"><img src="'+FK_ICONS+'icon-mode-'+m.toLowerCase()+'.webp" alt="" aria-hidden="true">'+m+'</span>';
}

function pageHead(icon, kicker, title){
  return '<div class="page-head"><span class="phicon">'+icon+'</span>'+
    '<div class="phtext"><p class="kicker saa-eyebrow">'+kicker+'</p><h2>'+title+'</h2></div></div>';
}

/* minutes from "h:mm" */
function mins(t){ var p = t.split(':'); return parseInt(p[0],10)*60 + parseInt(p[1],10); }

/* proportional 5-hour strip; `on` = index in runBlocks to highlight (or -1) */
function runStrip(on){
  var html = '<div class="run-strip" aria-hidden="true">';
  var n = 0;
  runBlocks.forEach(function(b, i){
    var t = b.time.split('–');
    var w = mins(t[1]) - mins(t[0]);
    if(!b.isBreak) n++;
    html += '<span class="seg'+(b.isBreak?' brk':'')+(i===on?' on':'')+'" style="flex-grow:'+w+'">'+(b.isBreak?'':n)+'</span>';
  });
  html += '</div><div class="run-ticks" aria-hidden="true"><span>0:00</span><span>1:00</span><span>2:00</span><span>3:00</span><span>4:00</span><span>5:00</span></div>';
  return '<div class="run-map">'+html+'</div>';
}

/* ================= BUILD GENERATED SLIDES ================= */
function buildRunSheet(){
  var ov = document.getElementById('runOverview');
  var n = 0;
  runBlocks.forEach(function(b){
    var li = document.createElement('li');
    if(b.isBreak){ li.className = 'is-break'; li.innerHTML = '<span class="ot">'+b.time+'</span><span>Break</span>'; }
    else { n++; li.innerHTML = '<span class="ot">'+b.time+'</span><span><b>'+n+'.</b> '+b.title+' '+modeBadge(n)+'</span>'; }
    ov.appendChild(li);
  });
  ov.insertAdjacentHTML('beforebegin', runStrip(-1));

  var slot = document.getElementById('runSlot');
  var total = runBlocks.filter(function(b){ return !b.isBreak; }).length;
  n = 0;
  runBlocks.forEach(function(b, i){
    if(b.isBreak) return;
    n++;
    var nextB = runBlocks[i+1];
    var rows = [];
    var ri = runRowIcons[n] || {};
    function withIcons(key, html){
      if(ri.row !== key) return html;
      if(key === 'exact') return '<span class="fk-exact-wrap">'+fkImgs(ri.icons, 'fk-icons fk-icons-lead')+html+'</span>';
      return ri.before ? fkImgs(ri.icons, 'fk-icons fk-icons-before')+html : html+' '+fkImgs(ri.icons);
    }
    if(b.exact) rows.push('<div class="trow"><span class="tlabel">Say exactly</span><span class="tval">'+withIcons('exact','<div class="exact-line">'+b.exact+'</div>')+'</span></div>');
    rows.push('<div class="trow"><span class="tlabel">Guidance</span><span class="tval">'+withIcons('guidance', b.guidance)+'</span></div>');
    rows.push('<div class="trow"><span class="tlabel">Learner action</span><span class="tval">'+withIcons('action', b.action)+'</span></div>');
    rows.push('<div class="trow"><span class="tlabel">Evidence</span><span class="tval">'+b.evidence+'</span></div>');
    rows.push('<div class="trow"><span class="tlabel">Recovery</span><span class="tval">'+b.recovery+'</span></div>');
    /* a block too long for one phone screen is split across two slides */
    var parts = b.split ? [rows.slice(0, b.split), rows.slice(b.split)] : [rows];
    parts.forEach(function(part, p){
      var last = p === parts.length - 1;
      var brk = (last && nextB && nextB.isBreak) ? '<div class="break-block">Then: '+nextB.time+' — Break</div>' : '';
      /* the very last run-sheet page ends with a rehearsal: put the 8 blocks in order */
      if(last && i === runBlocks.length - 1){
        brk += '<p class="do"><b>Your task.</b> Put the 8 blocks of the day in order from memory.</p>'+
          '<div class="saa-kit run-order" data-kit="order"><ol class="saa-steps">'+
          runOrderLabels.map(function(t, j){ return '<li data-n="'+(j+1)+'">'+t+'</li>'; }).join('')+
          '</ol><p class="saa-k-why" data-right="Yes. That is the order of the 8 blocks in the 5 hours." data-wrong="Not yet. The red blocks are in the wrong place."></p></div>';
      }
      var kicker = 'Run sheet · Block '+n+' of '+total + (p > 0 ? ' · continued' : '');
      var s = document.createElement('section');
      s.className = 'slide';
      s.setAttribute('data-section','2');
      s.setAttribute('aria-label', b.title + (p > 0 ? ' (continued)' : ''));
      s.innerHTML = '<div class="card">'+
        pageHead(ICON_CLOCK, kicker, b.head || b.title)+
        '<div class="tmeta"><span class="ttime">'+b.time+'</span>'+(p === 0 ? modeBadge(n) : '')+runStrip(i)+'</div>'+
        '<div class="tbody-inner">'+part.join('')+'</div>'+brk+'</div>';
      slot.parentNode.insertBefore(s, slot);
    });
  });
}

function buildAnswerBank(){
  var slot = document.getElementById('qaSlot');
  var clusters = [];
  qaData.forEach(function(item){ if(clusters.indexOf(item.cluster) < 0) clusters.push(item.cluster); });
  qaData.forEach(function(item, i){
    var opts = clusters.map(function(c){
      return '<option value="'+c+'"'+(c===item.cluster?' selected':'')+'>'+c+'</option>';
    }).join('');
    var s = document.createElement('section');
    s.className = 'slide qa-slide';
    s.setAttribute('data-section','5');
    s.setAttribute('data-cluster', item.cluster);
    s.setAttribute('aria-label', item.q);
    s.innerHTML = '<div class="card">'+
      pageHead('<img class="fk-cluster-ico" src="'+FK_ICONS+'icon-cluster-'+item.cluster.toLowerCase()+'.webp" alt="" aria-hidden="true">', 'Answer bank · '+(i+1)+' of '+qaData.length, 'How would you answer this learner?')+
      '<div class="cluster-row"><label for="cluster'+i+'">Jump to cluster:</label>'+
      '<select class="cluster-select" id="cluster'+i+'">'+opts+'</select></div>'+
      '<div class="qa-item open"><div class="qa-head"><span class="qtext">'+item.q+'</span>'+
        (item.policy ? '<span class="policy-flag">Needs policy confirmation</span>' : '')+'</div>'+
      '<div class="qa-body"><div class="qa-body-inner">'+
        '<p class="do"><b>Your task.</b> Think of your answer first. Then tap the card to see the direct answer.</p>'+
        '<div class="saa-kit qa-reveal" data-kit="reveal"><div class="saa-cards">'+
          '<button class="saa-card" type="button"><span class="saa-front">Direct answer</span><span class="saa-back">'+item.direct+'</span></button>'+
        '</div></div>'+
        '<div class="ans-row"><span class="albl">Reason</span><span class="aval">'+(item.icons ? fkImgs(item.icons, 'fk-icons fk-icons-before') : '')+item.reason+'</span></div>'+
        '<div class="ans-row"><span class="albl">Next action</span><span class="aval">'+item.next+'</span></div>'+
      '</div></div></div></div>';
    slot.parentNode.insertBefore(s, slot);
    var sel = s.querySelector('select');
    sel.addEventListener('change', function(){
      var c = sel.value;
      sel.value = item.cluster; /* each slide's own select keeps showing its own cluster */
      for(var k = 0; k < slides.length; k++){
        if(slides[k].getAttribute('data-cluster') === c){ go(k); break; }
      }
    });
  });
}

/* ================= NAVIGATION ================= */
function firstSlideOf(sec){
  for(var k = 0; k < slides.length; k++){ if(+slides[k].getAttribute('data-section') === sec) return k; }
  return 0;
}

function buildJump(){
  var sel = document.getElementById('jumpSelect');
  sel.innerHTML = '';
  sectionLabels.forEach(function(label, i){
    var opt = document.createElement('option');
    opt.value = i;
    opt.textContent = (i+1) + '. ' + label;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', function(){ go(firstSlideOf(parseInt(sel.value,10))); });
}

function render(){
  slides.forEach(function(s, k){ s.classList.toggle('active', k === current); });
  var sec = +slides[current].getAttribute('data-section');
  var total = slides.length;
  document.getElementById('jumpSelect').value = sec;
  document.getElementById('pageCount').textContent = (current+1) + ' / ' + total;
  document.getElementById('sectionName').textContent = sectionLabels[sec];
  document.getElementById('fill').style.width = ((current+1) / total * 100) + '%';
  document.getElementById('backBtn').disabled = (current === 0);
  document.getElementById('nextBtn').disabled = (current === total-1);
}

function go(n){
  if(n < 0 || n > slides.length-1) return;
  current = n;
  render();
}
function changePage(delta){ go(current + delta); }

/* self-check tally spans both self-check slides */
function updateCheck(){
  var boxes = document.querySelectorAll('.check-item input');
  var checked = 0;
  boxes.forEach(function(b){ if(b.checked) checked++; });
  document.querySelectorAll('.check-progress').forEach(function(p){
    p.textContent = checked + ' of ' + boxes.length + ' complete';
    p.classList.toggle('done', checked === boxes.length);
  });
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', function(){
  buildRunSheet();
  buildAnswerBank();
  slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  buildJump();
  document.querySelectorAll('.check-item input').forEach(function(b){ b.addEventListener('change', updateCheck); });
  updateCheck();
  /* demo script 2 of 3: the draft shows unmarked first; the facilitator reveals the marks after modelling the check */
  var demo = document.getElementById('fkDemo'), demoBtn = document.getElementById('fkDemoToggle');
  if(demo && demoBtn){
    demoBtn.addEventListener('click', function(){
      var on = !demo.classList.contains('is-marked');
      demo.classList.toggle('is-marked', on);
      demoBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      demoBtn.querySelector('span').textContent = on ? 'Hide the marks' : 'Show the marks';
    });
  }
  document.getElementById('backBtn').addEventListener('click', function(){ changePage(-1); });
  document.getElementById('nextBtn').addEventListener('click', function(){ changePage(1); });
  document.addEventListener('keydown', function(e){
    var t = e.target.tagName;
    if(t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA') return;
    if(e.key === 'ArrowRight') changePage(1);
    if(e.key === 'ArrowLeft') changePage(-1);
  });
  render();
});
