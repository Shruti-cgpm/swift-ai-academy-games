/* ---------- Slide deck ----------
   Every <section class="page"> is a slide. A slide with data-split-narrow="<selector>"
   becomes one sub-slide per matching child on narrow screens (≤720px) — used for the
   Supported / Uncertain / Unsupported lanes. The slide list, counter, segment bar and
   section stepper are all rebuilt from the DOM, so nothing hard-codes a slide count. */
var labels = ["Start","Mark","Separate","Correct","Example","Try this","Recap"];
var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
var narrowMQ = window.matchMedia('(max-width: 720px)');
var slides = [];      /* [{page, sub, subCount}] */
var TOTAL = 0;
var current = 0;
var completed = false;

function buildSlides(){
  slides = [];
  pages.forEach(function(p){
    var sel = p.getAttribute('data-split-narrow');
    var parts = sel && narrowMQ.matches ? p.querySelectorAll(sel) : [];
    if(parts.length){   /* nothing to split (e.g. the lanes became one sort activity) -> keep the slide whole */
      for(var k = 0; k < parts.length; k++) slides.push({page:p, sub:k, subCount:parts.length});
    } else {
      slides.push({page:p, sub:-1, subCount:0});
    }
  });
  TOTAL = slides.length;
  var bar = document.getElementById('segBar');
  bar.innerHTML = '';
  for(var i = 0; i < TOTAL; i++) bar.appendChild(document.createElement('span'));
  bar.setAttribute('aria-valuemax', TOTAL);
}

function sectionOf(i){ return parseInt(slides[i].page.getAttribute('data-section'), 10); }

function buildStepper(){
  var el = document.getElementById('stepper');
  el.innerHTML = '';
  for(var i = 0; i < labels.length; i++){
    var dot = document.createElement('div');
    dot.className = 'step-dot';
    dot.setAttribute('data-i', i);
    dot.onclick = (function(idx){ return function(){ goToSection(idx); }; })(i);
    dot.setAttribute('role','button');
    dot.tabIndex = 0;
    dot.onkeydown = (function(idx){ return function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); goToSection(idx); } }; })(i);
    dot.innerHTML = '<span class="n">'+(i+1)+'</span>'+labels[i];
    el.appendChild(dot);
    if(i < labels.length-1){
      var line = document.createElement('div');
      line.className = 'step-line';
      el.appendChild(line);
    }
  }
}

function slideName(s){
  var sec = labels[parseInt(s.page.getAttribute('data-section'), 10)];
  if(s.sub >= 0){
    var head = s.page.querySelectorAll(s.page.getAttribute('data-split-narrow'))[s.sub].querySelector('.sort-head');
    return sec + ' · ' + head.textContent.trim();
  }
  return s.page.getAttribute('data-name') || sec;
}

function render(){
  var s = slides[current];
  pages.forEach(function(p){ p.classList.toggle('active', p === s.page); });

  /* split slide: show only the current lane (and the intro line only on the first one) */
  var sel = s.page.getAttribute('data-split-narrow');
  if(sel){
    var parts = s.page.querySelectorAll(sel);
    Array.prototype.forEach.call(parts, function(el, k){ el.classList.toggle('sub-hidden', s.sub >= 0 && k !== s.sub); });
    s.page.querySelectorAll('.sub-first').forEach(function(el){ el.classList.toggle('sub-hidden', s.sub > 0); });
    var lc = s.page.querySelector('.lane-count');
    if(lc) lc.textContent = s.sub >= 0 ? ('Group ' + (s.sub+1) + ' of ' + s.subCount) : '';
    s.page.classList.toggle('is-split', s.sub >= 0);
  }

  var sec = sectionOf(current);
  document.querySelectorAll('.step-dot').forEach(function(d){
    var i = parseInt(d.getAttribute('data-i'), 10);
    d.classList.toggle('active', i === sec);
    d.classList.toggle('done', i < sec);
    if(i === sec){ d.setAttribute('aria-current','step'); } else { d.removeAttribute('aria-current'); }
  });

  var bar = document.getElementById('segBar');
  Array.prototype.forEach.call(bar.children, function(d, i){
    d.classList.toggle('is-done', i < current);
    d.classList.toggle('is-current', i === current);
  });
  bar.setAttribute('aria-valuenow', current+1);

  document.getElementById('pageName').textContent = slideName(s);
  document.getElementById('pageCount').textContent = (current+1) + ' / ' + TOTAL;
  document.getElementById('backBtn').disabled = (current === 0);
  var onLast = (current === TOTAL-1);
  document.getElementById('nextBtn').textContent = onLast ? (completed ? 'Completed' : 'Done') : 'Next';
  document.getElementById('nextBtn').disabled = onLast && completed;
  document.getElementById('doneBanner').classList.toggle('show', onLast && completed);
  paintGates();
}
/* the shared kit dims Next while a screen carries data-saa-locked (its own taps: coloured phrases, Try this) */
function paintGates(){
  pages.forEach(function(pg){
    var mks = pg.querySelectorAll('.mk'), lock = false;
    if(mks.length && pg.querySelectorAll('.mk[data-seen]').length < mks.length) lock = true;
    if(pg.querySelector('.try-feedback:not(.show)')) lock = true;
    pg.toggleAttribute('data-saa-locked', lock);
  });
}

function changePage(delta){
  var next = current + delta;
  if(next < 0 || next > TOTAL-1) return;
  current = next;
  render();
}

function goTo(i){
  if(i < 0 || i > TOTAL-1) return;
  current = i;
  render();
}

function goToSection(sec){
  for(var i = 0; i < TOTAL; i++){ if(sectionOf(i) === sec){ walkTo(i); return; } }
}

/* ---- gates (QA fix, Oct 2026): Next, the Right-arrow key and the section stepper all use this ---- */
function gateOpen(i){
  var pg = slides[i].page;
  if(pg.querySelector('.saa-kit[data-required]:not(.is-done)')) return false;
  var mks = pg.querySelectorAll('.mk');
  if(mks.length && pg.querySelectorAll('.mk[data-seen]').length < mks.length) return false;
  var tries = pg.querySelectorAll('.try-feedback');
  for(var k = 0; k < tries.length; k++){ if(!tries[k].classList.contains('show')) return false; }
  return true;
}
function showGate(i){
  var pg = slides[i].page;
  if(pg.querySelector('.mk') && !pg.querySelector('.saa-kit[data-required]:not(.is-done)')){
    var w = pg.querySelector('.g13-mk-why');
    if(w){ w.textContent = 'Tap each coloured phrase first.'; w.classList.add('is-need'); }
    return;
  }
  var t = pg.querySelector('.try-feedback:not(.show)');
  if(t && !pg.querySelector('.saa-kit[data-required]:not(.is-done)')){
    var n = pg.querySelector('.g13-need');
    if(n){ n.hidden = false; clearTimeout(n._t); n._t = setTimeout(function(){ n.hidden = true; }, 4000); }
    return;
  }
  /* a kit: a click on Next lets the kit lock show what is left */
  var nb = document.getElementById('nextBtn'); if(nb) nb.click();
}
function walkTo(target){
  if(target <= current){ goTo(target); return; }
  while(current < target){
    if(!gateOpen(current)){ render(); showGate(current); return; }
    current++;
  }
  render();
}

function handleNext(){
  if(!gateOpen(current)){ showGate(current); return; }
  if(current === TOTAL-1){
    completed = true;
    render();
  } else {
    changePage(1);
  }
}

/* crossing the phone breakpoint re-splits the lanes; stay on the same slide */
function onViewportChange(){
  var page = slides[current].page, sub = Math.max(slides[current].sub, 0);
  buildSlides();
  for(var i = 0; i < TOTAL; i++){
    if(slides[i].page === page && (slides[i].sub === -1 || slides[i].sub === sub)){ current = i; break; }
  }
  render();
}
if(narrowMQ.addEventListener){ narrowMQ.addEventListener('change', onViewportChange); }
else if(narrowMQ.addListener){ narrowMQ.addListener(onViewportChange); }

document.addEventListener('keydown', function(e){
  var t = e.target && e.target.tagName;
  if(t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
  if(e.key === 'ArrowRight'){ var nb = document.getElementById('nextBtn'); if(nb && !nb.disabled) nb.click(); }   /* same lock as the Next button */
  if(e.key === 'ArrowLeft') changePage(-1);
});

/* ---------- Step 1: tap-to-reveal element tags ---------- */
function revealTag(el){
  var tag = el.querySelector('.mk-tag');
  tag.classList.toggle('shown');
  el.setAttribute('data-seen', '1');
  paintGates();
  /* say what kind of part it is (this line is read aloud) */
  var pg = el.closest('.page'), w = pg && pg.querySelector('.g13-mk-why');
  if(w && tag.classList.contains('shown')){
    var kind = tag.textContent.trim().toLowerCase();
    var left = pg.querySelectorAll('.mk').length - pg.querySelectorAll('.mk[data-seen]').length;
    w.classList.remove('is-need');
    w.textContent = (kind === 'date' ? 'This part is a date.' : kind === 'figure' ? 'This part is a figure.' : kind === 'name' ? 'This part is a name.' :
      kind === 'fact' ? 'This part is a fact.' : 'This part is a source.') + (left === 0 ? ' You found all five kinds.' : '');
  }
}
document.querySelectorAll('.mk').forEach(function(mk){
  mk.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); revealTag(mk); }
  });
});

/* ---------- Made-up records (one shared component) ----------
   Each <div class="rec-box" data-record="..."> shows one record page. The values
   must agree with the answers and feedback on its screens. */
var RECORDS = {
  visit: {title:'Visit register', sub:'Plant visit', rows:[
    ['Date','14 August'], ['Batch','4B'], ['Students present','30'], ['Place','The facility']
  ]},
  book: {title:'Record book', sub:'Practical session, Batch 2', rows:[
    ['Date','9 October'], ['Moved from','7 October'], ['Batch','2'], ['Trainees who finished','26']
  ]},
  /* screen 9 (Oct 2026 designer pack): agrees with "about 140 participants" (138 + 2) */
  event: {title:'Event register', sub:'Campus workshop', rows:[
    ['Date','3 March'], ['Signed in','138'], ['Walk-ins (approx.)','2']
  ]}
};
function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
document.querySelectorAll('.rec-box[data-record]').forEach(function(box){
  var r = RECORDS[box.getAttribute('data-record')];
  if(!r) return;
  /* wide screens show the page inline; phones get an "Open the ..." button and an overlay */
  var h = '<button type="button" class="rec-open" aria-expanded="false">Open the ' + esc(r.title.toLowerCase()) + '</button>' +
    '<div class="rec-panel" role="group" aria-label="' + esc(r.title + ', ' + r.sub) + '">' +
    '<div class="rec-head"><span class="rec-title">' + esc(r.title) + '</span><span class="rec-sub">' + esc(r.sub) + '</span><span class="rec-tag">Made-up record</span></div><dl class="rec-rows">';
  var hl = box.getAttribute('data-hl');
  r.rows.forEach(function(row){ h += '<div class="rec-row' + (hl === row[0] ? ' rec-hl' : '') + '"><dt>' + esc(row[0]) + '</dt><dd>' + esc(row[1]) + '</dd></div>'; });
  box.innerHTML = h + '</dl><button type="button" class="rec-close">Close</button></div>';
  var open = box.querySelector('.rec-open');
  function setOpen(on){ box.classList.toggle('is-open', on); open.setAttribute('aria-expanded', on ? 'true' : 'false'); }
  open.addEventListener('click', function(){ setOpen(true); });
  box.querySelector('.rec-close').addEventListener('click', function(){ setOpen(false); open.focus(); });
  box.addEventListener('click', function(e){ if(e.target === box && box.classList.contains('is-open')) setOpen(false); });
});
/* screen 8: the "Students present" row lights up only after the question is answered */
document.querySelectorAll('.rec-box[data-hl]').forEach(function(box){
  var pg = box.closest('.page');
  if(pg) pg.addEventListener('saa:done', function(){ box.classList.add('rec-lit'); });
});
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') document.querySelectorAll('.rec-box.is-open').forEach(function(b){ b.classList.remove('is-open'); b.querySelector('.rec-open').setAttribute('aria-expanded','false'); });
});

/* ---------- Try this ---------- */
function checkAnswer(btn, choice, key){
  var group = btn.parentElement;
  group.querySelectorAll('.choice-btn').forEach(function(b){
    b.classList.remove('sel-supported','sel-uncertain','sel-unsupported');
  });
  btn.classList.add('sel-' + choice);

  var fb = document.getElementById('fb-' + key);
  var correct = fb.getAttribute('data-correct');
  var isRight = (choice === correct);
  fb.classList.add('show');
  fb.classList.remove('correct','incorrect');
  fb.classList.add(isRight ? 'correct' : 'incorrect');

  var explanations = {
    '9oct': 'The date matches the record book exactly.',
    '28t': 'The record book shows that 26 trainees finished, not 28.',
    'best': 'The record book does not compare sessions, so nothing supports "best-attended".',
    'src': 'The record book confirms the date. It shows a different number of trainees, and it does not rank sessions. So it cannot support the whole sentence.'
  };
  fb.innerHTML = '<b>' + (isRight ? 'Yes. ' : 'Not quite. The answer is ' + correct.charAt(0).toUpperCase() + correct.slice(1) + '. ') + '</b>' + explanations[key];
  var n = btn.closest('.page') && btn.closest('.page').querySelector('.g13-need'); if(n) n.hidden = true;
  paintGates();
}

buildStepper();
buildSlides();
render();
