/* Portfolio Submission — MC1: a practice version of the real submission form.
   Nothing is uploaded or sent. Every step is gated: Next stays locked (data-saa-locked)
   until the screen is done, and a short spoken message (.saa-k-why) says what is missing.
   At the end the learner downloads a text receipt. */
var TOTAL = 6;
var current = 0;

/* fixed messages: each one has its own narration clip, so the text must not change */
var MSG = {
  empty:    'Not quite. Please type a file name first.',
  shape:    'Not quite. A file name needs a name and a type, like notes.pdf.',
  example:  'Not quite. Type the name of your own file, not the example.',
  type:     'Not quite. This type of file is not allowed here. Use a type from the list.',
  ok:       'Yes. Your file is attached.',
  replaced: 'Yes. The new file is attached. Your old file is kept in your record.',
  attachAll:'Not yet. Please attach all 6 pieces of work.',
  netTry:   'Not yet. Tap Stop the internet to see what happens.',
  netBack:  'Not yet. Tap Start the internet again first.',
  offline:  'You are offline now. Your files are still here, so nothing is lost.',
  online:   'Yes. You are online again. Now you can go on.',
  type0:    'Not yet. Please choose the type of submission.',
  decl0:    'Not yet. Please tick the declaration to say this is your own work.',
  both0:    'Not yet. Please choose the type of submission and tick the declaration.',
  submit0:  'Not yet. Tap Submit my Proof File first.',
  saved:    'Yes. Your receipt is downloaded. Keep it safe.'
};
var EXAMPLE = 'my-notes.pdf';

function $(id){ return document.getElementById(id); }
function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function say(el, text){
  if(!el) return;
  el.textContent = text;              /* a new text node every time, so the same message is spoken again */
  el.hidden = !text;
}
function sfx(ok){ try { if(window.SAA_SFX){ ok ? SAA_SFX.correct() : SAA_SFX.wrong(); } } catch(e){} }

function render(){
  document.querySelectorAll('.page').forEach(function(p){
    p.classList.toggle('active', parseInt(p.getAttribute('data-page')) === current);
  });
  $('pageCount').textContent = (current+1) + ' / ' + TOTAL;
  $('backBtn').disabled = (current === 0) || (current === TOTAL-1);
  $('nextBtn').disabled = (current === TOTAL-1);
  for(var i = 1; i < TOTAL; i++) say($('msg-' + i), '');
  if(current === 2) updateGauge();
  if(current === 3) renderReview();
  if(current === 4) renderReady();
  refreshLocks();
  window.scrollTo(0, 0);
}

/* what is still missing on a screen: '' when the screen is done */
function missing(page){
  if(page === 1) return attachedCount() < artifacts.length ? MSG.attachAll : '';
  if(page === 2) return !triedOffline ? MSG.netTry : (!isOnline ? MSG.netBack : '');
  if(page === 3){
    var t = !$('submissionType').value, d = !$('declareBox').checked;
    return t && d ? MSG.both0 : t ? MSG.type0 : d ? MSG.decl0 : '';
  }
  if(page === 4) return !submitted ? MSG.submit0 : '';
  return '';
}
function refreshLocks(){
  document.querySelectorAll('.page').forEach(function(p){
    var n = parseInt(p.getAttribute('data-page'));
    var lock = n === current && !!missing(n);
    if(p.hasAttribute('data-saa-locked') !== lock) p.toggleAttribute('data-saa-locked', lock);
  });
  if(current === 3 && !missing(3)) say($('msg-3'), '');
}

function changePage(delta){
  var next = current + delta;
  if(next < 0 || next > TOTAL-1) return;
  if(delta > 0){
    var m = missing(current);
    if(m){
      say($('msg-' + current), m); sfx(false);
      try { $('msg-' + current).scrollIntoView({block:'nearest'}); } catch(e){}
      if(current === 1){
        artifacts.forEach(function(a){ $('tab-'+a.id).classList.toggle('is-missing', !a.file); });
        var gap = artifacts.filter(function(a){ return !a.file; })[0];
        if(gap && find(shownId).file) showArtifact(gap.id, false);
      }
      return;
    }
  }
  current = next;
  render();
}

/* ================= ARTIFACTS ================= */
var artifacts = [
  {id:'reading',    title:'Reading notes',         tab:'Reading',         help:'Add your notes or a screenshot from the reading task.',              types:['pdf','docx','jpg','png'], file:null, ic:'icon-safe-notes'},
  {id:'cardlab',    title:'Card and both Labs',    tab:'Card and Labs',    help:'Add screenshots of your finished Card and Lab tasks.',               types:['pdf','docx','jpg','png'], file:null, ic:'icon-rubric'},
  {id:'bot',        title:'Practice Bot mastery',  tab:'Practice Bot',  help:'Add a screenshot that shows all 4 rounds cleared.',                  types:['pdf','jpg','png'],        file:null, ic:'icon-ai-helper'},
  {id:'rulebook',   title:'My Rulebook page',      tab:'Rulebook',      help:'Add your finished Rulebook page as a file, screenshot or scan.',     types:['pdf','jpg','png'],        file:null, ic:'icon-rulebook'},
  {id:'peer',       title:'Peer Exchange answers', tab:'Peer Exchange', help:'Add your saved answers from the Peer Exchange activity.',            types:['pdf','docx','jpg','png'], file:null, ic:'icon-exchange'},
  {id:'checkpoint', title:'Checkpoint 1 evidence', tab:'Checkpoint 1', help:'Add the AI answer and your corrected version from Checkpoint 1.',    types:['pdf','docx','jpg','png'], file:null, ic:'icon-loop-check'}
];
function find(id){ return artifacts.filter(function(x){ return x.id === id; })[0]; }
function attachedCount(){ return artifacts.filter(function(a){ return a.file; }).length; }
function iconSrc(name){ return 'assets/icons/' + (document.documentElement.getAttribute('data-theme') === 'light' ? 'navy' : 'ivory') + '/' + name + '.webp'; }

var shownId = 'reading';
function renderArtifacts(){
  var tabs = $('artifactTabs'), list = $('artifactList');
  tabs.innerHTML = ''; list.innerHTML = '';
  artifacts.forEach(function(a, i){
    var t = document.createElement('button');
    t.type = 'button'; t.className = 'pf-tab'; t.id = 'tab-' + a.id;
    t.setAttribute('role', 'tab'); t.setAttribute('aria-controls', 'row-' + a.id);
    t.innerHTML = '<span class="pf-tab-n">' + (i+1) + '</span><span class="pf-tab-l">' + a.tab + '</span>';
    t.addEventListener('click', function(){ showArtifact(a.id, true); });
    tabs.appendChild(t);

    var row = document.createElement('div');
    row.className = 'artifact-row';
    row.id = 'row-' + a.id;
    row.setAttribute('role', 'tabpanel');
    row.setAttribute('aria-labelledby', 'tab-' + a.id);
    row.innerHTML =
      '<div class="artifact-top"><img class="art-ic" data-ic="'+a.ic+'" src="'+iconSrc(a.ic)+'" alt="" aria-hidden="true">'+
        '<span class="artifact-title">'+(i+1)+'. '+a.title+'</span></div>'+
      '<p class="artifact-help">'+a.help+'</p>'+
      '<p class="file-types">Files you can use: .'+a.types.join(', .')+'</p>'+
      '<div class="attach-row">'+
        '<input class="attach-input" id="input-'+a.id+'" type="text" maxlength="60" autocomplete="off" spellcheck="false" aria-label="File name for '+a.title+'" placeholder="Type a file name, like '+EXAMPLE+'">'+
        '<button class="attach-btn" type="button" id="btn-'+a.id+'">Attach</button>'+
      '</div>'+
      '<div class="file-area" id="filearea-'+a.id+'"></div>'+
      '<p class="row-msg saa-k-why" id="rowmsg-'+a.id+'" aria-live="polite" hidden></p>';
    list.appendChild(row);
    $('btn-'+a.id).addEventListener('click', function(){ attachFile(a.id); });
    $('input-'+a.id).addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); attachFile(a.id); } });
    $('input-'+a.id).addEventListener('input', function(){ typed = true; });
  });
  showArtifact(shownId, false);
  updateCount();
}

/* one piece of work at a time: the tabs above show which ones are attached */
function showArtifact(id, focus){
  shownId = id;
  artifacts.forEach(function(a){
    var on = a.id === id;
    $('row-'+a.id).hidden = !on;
    var t = $('tab-'+a.id);
    t.setAttribute('aria-selected', on ? 'true' : 'false');
    t.tabIndex = on ? 0 : -1;
  });
  if(focus){ var i = $('input-'+id); if(i) i.focus({preventScroll:true}); }
}
/* arrow keys move between the tabs */
document.addEventListener('keydown', function(e){
  var t = e.target.closest && e.target.closest('.pf-tab');
  if(!t || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
  var i = artifacts.map(function(a){ return a.id; }).indexOf(shownId);
  i = (i + (e.key === 'ArrowRight' ? 1 : artifacts.length - 1)) % artifacts.length;
  showArtifact(artifacts[i].id, false); $('tab-'+artifacts[i].id).focus(); e.preventDefault();
});

/* a file name: a name with at least 2 letters or digits (any script, so Hindi and Gujarati names work), a dot and a type */
function checkName(val, a){
  if(!val) return MSG.empty;
  if(val.toLowerCase() === EXAMPLE) return MSG.example;
  var m = /^(.+)\.([^.\s]+)$/.exec(val);
  if(!m) return MSG.shape;
  var letters = (m[1].match(/[\p{L}\p{N}]/gu) || []).length;
  if(letters < 2) return MSG.shape;
  if(a.types.indexOf(m[2].toLowerCase()) === -1) return MSG.type;
  return '';
}

function attachFile(id){
  var a = find(id);
  var input = $('input-'+id);
  var val = input.value.replace(/\s+/g, ' ').trim();
  var msg = $('rowmsg-'+id);
  var bad = checkName(val, a);
  $('row-'+id).classList.toggle('is-bad', !!bad);
  if(bad){ say(msg, bad); sfx(false); input.focus(); return; }
  var wasAttached = a.file !== null;
  a.file = val;
  typed = true;
  input.value = '';
  drawFile(a);
  say(msg, wasAttached ? MSG.replaced : MSG.ok);
  sfx(true);
  /* go on to the next piece of work that is still empty (after the message is read) */
  var nextEmpty = artifacts.filter(function(x){ return !x.file; })[0];
  if(nextEmpty && !wasAttached) setTimeout(function(){ if(current === 1 && shownId === id) showArtifact(nextEmpty.id, true); }, 1600);
  if(attachedCount() === artifacts.length) say($('msg-1'), '');
  updateCount();
}

function drawFile(a){
  var area = $('filearea-'+a.id);
  $('row-'+a.id).classList.toggle('is-done', !!a.file);
  $('tab-'+a.id).classList.toggle('is-done', !!a.file);
  $('tab-'+a.id).setAttribute('aria-label', a.tab + (a.file ? ', attached' : ', not attached yet'));
  if(a.file){ $('row-'+a.id).classList.remove('is-missing'); $('tab-'+a.id).classList.remove('is-missing'); }
  $('btn-'+a.id).textContent = a.file ? 'Replace' : 'Attach';
  area.innerHTML = a.file ?
    '<div class="file-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>'+
    '<span class="fname">'+esc(a.file)+'</span>'+
    '<button type="button" class="fremove" aria-label="Remove '+esc(a.file)+'">&times;</button></div>' : '';
  var rm = area.querySelector('.fremove');
  if(rm) rm.addEventListener('click', function(){ removeFile(a.id); });
}

function removeFile(id){
  var a = find(id);
  a.file = null;
  drawFile(a);
  say($('rowmsg-'+id), '');
  updateCount();
  $('input-'+id).focus();
}

function updateCount(){
  $('attachCount').textContent = attachedCount() + ' of ' + artifacts.length + ' attached';
  refreshLocks();
}

/* ================= PROGRESS GAUGE ================= */
function updateGauge(){
  var count = attachedCount();
  var pct = Math.round((count/artifacts.length)*100);
  $('gaugePct').textContent = pct + '%';
  $('gaugeCount').textContent = count + ' of ' + artifacts.length + ' pieces of work attached';
  $('gaugeRing').style.setProperty('--pct', (pct*3.6) + 'deg');
}

/* ================= CONNECTIVITY (practice only) ================= */
var isOnline = true, triedOffline = false;
function toggleConnection(){
  isOnline = !isOnline;
  if(!isOnline) triedOffline = true;
  $('connectDot').classList.toggle('offline', !isOnline);
  $('connectLabel').textContent = isOnline ? 'Online. Your work saves by itself.' : 'Offline. Your work is still here.';
  $('connectBtn').textContent = isOnline ? 'Stop the internet' : 'Start the internet again';
  say($('msg-2'), isOnline ? MSG.online : MSG.offline);
  refreshLocks();
}

/* ================= REVIEW ================= */
function renderReview(){
  var list = $('reviewList');
  list.innerHTML = '';
  artifacts.forEach(function(a){
    var t = document.createElement('button');
    t.type = 'button';
    t.className = 'review-tile' + (a.file ? ' done' : '');
    t.setAttribute('aria-label', a.title + ': ' + (a.file || 'not attached yet') + '. Tap to change it.');
    t.innerHTML = '<span class="rt-k">'+a.title+'</span><span class="rt-v">'+(a.file ? esc(a.file) : 'Not attached yet')+'</span><span class="rt-c">Change</span>';
    t.addEventListener('click', function(){ current = 1; render(); showArtifact(a.id, true); });
    list.appendChild(t);
  });
}

/* ================= SUBMIT ================= */
var submitted = false, downloaded = false, receipt = null;
function renderReady(){
  var t = $('submissionType').value;
  $('readyList').innerHTML =
    '<li>'+attachedCount()+' of '+artifacts.length+' files attached</li>'+
    '<li>Declaration ticked</li>'+
    '<li>'+esc(t || 'Type of submission not chosen')+'</li>';
}
function doSubmit(){
  /* the earlier gates make this complete; check again in case */
  for(var p = 1; p <= 3; p++){
    var m = missing(p);
    if(m){ say($('msg-4'), m); sfx(false); return; }
  }
  var now = new Date();
  var id = 'MC1-' + now.getFullYear() + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0') + '-' + Math.floor(1000+Math.random()*9000);
  receipt = { id:id, type:$('submissionType').value, count:attachedCount(), time:now.toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit'}),
              files:artifacts.map(function(a){ return [a.title, a.file]; }) };
  $('receiptId').textContent = 'ID: ' + id;
  $('receiptType').textContent = receipt.type;
  $('receiptCount').textContent = receipt.count + ' of ' + artifacts.length;
  $('receiptTime').textContent = receipt.time;
  submitted = true;
  sfx(true);
  current = 5;
  render();
}

function receiptText(){
  var r = receipt, lines = [
    'Swift AI Academy',
    'Portfolio Submission: MC1 receipt',
    '',
    'Submission ID: ' + r.id,
    'Type of submission: ' + r.type,
    'Submitted: ' + r.time,
    'Status: Waiting for assessor review',
    '',
    'Files attached (' + r.count + ' of ' + artifacts.length + '):'
  ];
  r.files.forEach(function(f){ lines.push('- ' + f[0] + ': ' + (f[1] || 'not attached')); });
  lines.push('', 'Declaration: These are my own finished files. I am submitting them myself. (ticked)',
             '', 'If you submit again later, this version is kept. It is not replaced.',
             'This was a practice form. No file was uploaded or sent.');
  return lines.join('\r\n') + '\r\n';
}
function downloadReceipt(){
  if(!receipt){ say($('msg-5'), MSG.submit0); return; }
  var blob = new Blob([receiptText()], {type:'text/plain;charset=utf-8'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = 'mc1-portfolio-receipt-' + receipt.id + '.txt';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1500);
  downloaded = true;
  say($('msg-5'), MSG.saved);
}

/* ================= LEAVE WARNING ================= */
var typed = false;
window.addEventListener('beforeunload', function(e){
  var started = typed || attachedCount() > 0 || $('declareBox').checked || !!$('submissionType').value;
  if(!started || downloaded) return;
  e.preventDefault(); e.returnValue = ''; return '';
});

/* ================= THEME: kits and icons follow the learner's light / dark choice ================= */
function paintTheme(){
  var light = document.documentElement.getAttribute('data-theme') === 'light';
  document.querySelectorAll('.saa-kit[data-theme]').forEach(function(k){ k.setAttribute('data-theme', light ? 'light' : 'dark'); });
  document.querySelectorAll('img[data-ic]').forEach(function(im){
    var src = iconSrc(im.getAttribute('data-ic'));
    if(im.getAttribute('src') !== src) im.setAttribute('src', src);
  });
}
window.addEventListener('saa:theme', paintTheme);

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', function(){
  renderArtifacts();
  render();
  paintTheme();
  setTimeout(paintTheme, 0);   /* the layer applies a saved theme just after this */
});
