/* ============ ICONS ============ */
var ICON_BOT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 4h6"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></svg>';
var ICON_USER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.9 3.1-6 7-6s7 2.1 7 6"/></svg>';
var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
var ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
var ICON_REFRESH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v6h6M20 20v-6h-6"/><path d="M20 10a8 8 0 0 0-14.7-4.7M4 14a8 8 0 0 0 14.7 4.7"/></svg>';
var ICON_LIGHTBULB = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-3 11.2c.6.4 1 1.1 1 1.8v.5h4v-.5c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 2z"/></svg>';
var ICON_SHIELD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>';
var ICON_TARGET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>';
var ICON_DOC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>';
var ICON_CLIPBOARD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="16" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6M9 15h4"/></svg>';
var ICON_EDIT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
var ICON_FLAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v18M5 4h11l-2 4 2 4H5"/></svg>';
var ICON_TABLE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/></svg>';

/* Game 14 designer assets (Oct 2026): line icons from the asset pack.
   The game is dark, so the ivory set is used. The pack also has a light twin
   (navy lines) for each icon: a light theme only needs to change this folder. */
var G14_ICON_DIR = 'assets/icons/dark/';
function g14Icon(name, cls){
  return '<img class="'+(cls||'g14-ic')+'" src="'+G14_ICON_DIR+name+'.webp" alt="" aria-hidden="true">';
}
/* check-type icon for each correction kicker (Figure / Fact / Source) */
var FIX_ICONS = {figure:'icon-figure', fact:'icon-fact', claim:'icon-source'};

/* ============ LANE DATA ============ */
var laneData = {
  iti: {
    title: "Tool Return Note",
    prompt: "Write a tool return note for Batch 3B.",
    pickerLabel: "ITI · Tool return note",
    character: "assets/char-iti-trainee.webp",
    draftHtml: 'All <span class="wrong">12 trainees</span> from Batch 3B gave back their tools today. The tool register shows every item is present, and <span class="wrong">no damage was reported</span>. This batch has <span class="wrong">finished all practical hours needed for this term</span>.',
    recordTitle: "The real store register (end of day)",
    recordItems: [
      "Trainees who returned tools: 11 out of 12. One hand drill is still missing.",
      "Condition note: one drill bit is worn. It is marked for replacement.",
      "Practical hours: this batch is 2 hours short for the term."
    ],
    fixes: [
      {id:'figure', label:'Line 1: the number of trainees', phrase:'"12 trainees" gave back their tools', placeholder:'Type the correct number…', keywords:['11'],
       num:['11','eleven'], model:"11 trainees gave back their tools. One hand drill is still missing."},
      {id:'fact', label:'Line 2: the damage report', phrase:'"no damage was reported"', placeholder:'Type what the register really says…', keywords:['worn','damage','drill bit'],
       pos:/\bworn\b|drill\s*bit|\bdamage|\breplace/i,
       neg:[/\bno\s+(\w+\s+)?damage/i, /\bnot\s+(been\s+)?(damaged|worn)/i, /\bundamaged\b/i, /\bnothing\s+(\w+\s+)?(worn|damaged|broken)/i, /\bgood\s+condition/i, /\bno\s+(tool|drill|item)s?\s+(is|are|was|were)\s+(worn|damaged)/i], model:"One drill bit is worn and marked for replacement."},
      {id:'claim', label:'Line 3: the practical hours', phrase:'"finished all practical hours needed"', placeholder:'Type what is really true…', keywords:['short','not finish','2 hour','incomplete'],
       pos:/\bshort\b|\bnot\s+(yet\s+)?(finish|finished|complete|completed|done)\b|n't\s+(yet\s+)?(finish|finished|complete|completed)\b|\bincomplete\b|\bunfinished\b|\b(2|two)\s+(more\s+)?hours?\b|\bstill\s+needs?\b/i,
       neg:[/\bnot\s+(\w+\s+)?short\b/i, /n't\s+(\w+\s+)?short\b/i, /\bno\s+hours?\s+(short|left|missing)/i],
       claims:[/\bfinished\s+all\b/i, /\bcompleted?\s+all\b/i, /\ball\s+(the\s+)?(practical\s+)?hours\s+(are|were|is)\s+(done|complete|completed|finished)/i], model:"This batch is 2 hours short of the required practical hours."}
    ],
    finishQuestion: "The note stops here and does not say what to do next. What should the note add?",
    finishOptions: [
      "Nothing. The note is fine as it is.",
      "Tell the store in-charge about the missing tool and the worn drill bit before the register closes.",
      "Say well done to the batch for finishing early.",
      "Plan next term's practical sessions."
    ],
    finishCorrect: 1
  },
  higher: {
    title: "Assignment Submission Note",
    prompt: "Write a submission note for the Data Structures course.",
    pickerLabel: "Higher education · Submission note",
    character: "assets/char-college-student.webp",
    draftHtml: 'All <span class="wrong">45 students</span> in the Data Structures course submitted on time. Every submission was checked by the plagiarism tool, and <span class="wrong">no issues were found</span>. This <span class="wrong">completes all pending coursework for the semester</span>.',
    recordTitle: "The real submission log",
    recordItems: [
      "Submissions received: 42 out of 45. Three students have not submitted yet.",
      "Plagiarism check: one submission is flagged for manual review.",
      "Remaining coursework: one more assignment is still due next week."
    ],
    fixes: [
      {id:'figure', label:'Line 1: the number of students', phrase:'"45 students" submitted', placeholder:'Type the correct number…', keywords:['42'],
       num:['42','forty-two','forty two'], model:"42 students submitted. 3 students have not submitted yet."},
      {id:'fact', label:'Line 2: the plagiarism check', phrase:'"no issues were found"', placeholder:'Type what was really found…', keywords:['flagged','review','issue'],
       pos:/\bflag|\breview|\bissues?\b|\bproblems?\b|\bcopied\b|\bcopy\b|\bsuspicious\b|\bcheck(ed)?\s+again/i,
       neg:[/\bno\s+(\w+\s+)?(issues?|problems?|flags?)\b/i, /\bnot\s+(been\s+)?flagged/i, /\bnothing\s+(\w+\s+)?(found|flagged|wrong)/i, /\bclean\b/i, /\bwithout\s+(any\s+)?(issues?|problems?)/i, /\b(all|every)\s+(\w+\s+)?(passed|clear|fine)/i], model:"One submission was flagged for manual review."},
      {id:'claim', label:'Line 3: the pending coursework', phrase:'"completes all pending coursework"', placeholder:'Type what is really true…', keywords:['due','next week','not complete','one more','1 more'],
       pos:/\bdue\b|next\s+week|\bnot\s+(yet\s+)?(complete|completed|finished|done|over)\b|n't\s+(yet\s+)?(complete|completed|finished|done|over)\b|\bincomplete\b|\b(one|1)\s+more\b|\bpending\b|\bremaining\b|\bstill\b|\bleft\b/i,
       neg:[/\bnothing\s+(\w+\s+)?(pending|due|left|remaining)/i, /\bno\s+(more\s+)?(assignments?|coursework|work)\s+(\w+\s+)?(due|pending|left|remaining)/i],
       claims:[/\bcompletes?\s+all\b/i, /\bcompleted\s+all\b/i, /\ball\s+(\w+\s+)?coursework\s+(is\s+)?(complete|completed|done|finished)/i], model:"One more assignment is still due next week. Coursework is not complete yet."}
    ],
    finishQuestion: "The note stops here and does not say what to do next. What should the note add?",
    finishOptions: [
      "Nothing. The note is fine as it is.",
      "Contact the 3 students who have not submitted, and send the flagged submission to the coordinator.",
      "Say well done to the class for finishing early.",
      "Plan next semester's coursework."
    ],
    finishCorrect: 1
  }
};


/* ============ STATE ============ */
var currentLane = null;
var chat = document.getElementById('chat');
var fixAnswers = {};
var fixChecked = {};
var finishChoice = null;
var finishChecked = false;

/* ============ TURN ENGINE (one exchange on screen at a time) ============
   The chat never scrolls: each turn REPLACES the previous one. A turn shows
   the learner's previous reply as a small line (if any), the bot's message(s)
   and the reply options. `stack` is the path taken (for Back); `transcript`
   keeps the full conversation in memory. */
var TURNS = ['welcome','safety','stakes','lane','draft','record',
             'fix0','fb0','fix1','fb1','fix2','fb2',
             'finish','finishfb','log','log2','result'];
var TOTAL_STEPS = TURNS.length;
var stack = [];
var transcript = [];

function setProgress(n){
  document.getElementById('progressFill').style.width = Math.min(100, Math.round((n/TOTAL_STEPS)*100)) + '%';
  document.getElementById('stepCount').textContent = 'Step ' + n + ' of ' + TOTAL_STEPS;
}

function logBot(el){
  transcript.push({who:'bot', text:(el.textContent || '').replace(/\s+/g,' ').trim()});
}

function renderTop(isNew){
  var top = stack[stack.length-1];
  chat.innerHTML = '';
  chat.scrollTop = 0;
  if(top.reply){
    var line = document.createElement('div');
    line.className = 'prev-reply';
    line.innerHTML = '<span class="prev-label">You</span><span class="prev-text"></span>';
    line.querySelector('.prev-text').textContent = top.reply;
    chat.appendChild(line);
  }
  var idx = TURNS.indexOf(top.t);
  setProgress(idx + 1);
  document.getElementById('backBtn').disabled = (stack.length <= 1);
  TURN_FNS[top.t]();
  markNarration();
  if(isNew){
    chat.querySelectorAll('.msg.bot .bubble').forEach(logBot);
  }
}

/* Narration markers (Oct 2026): the main bot message of each turn is the
   narrated "screen" (a new element per turn), its bubble is the lead, and only
   the stable lines in it are read: the bot's text, the never-list, the AI draft,
   the record, the feedback lines and the fixed result lines. Kicker labels,
   learner answers, buttons, inputs and the changing score line are not read. */
var SAY_SEL = '.bubble > p, .never-panel, .fix-q > p, .draft-card .dtitle, .draft-card .dtext, ' +
              '.record-card .rtitle, .record-card table, .result-card h3, .result-card p:last-child';
function markNarration(){
  var m = chat.querySelector('.msg.bot:not(.widget)');
  if(!m) return;
  var b = m.querySelector('.bubble');
  m.setAttribute('data-saa-page', '');
  b.setAttribute('data-saa-lead', '');
  b.querySelectorAll(SAY_SEL).forEach(function(e){ e.setAttribute('data-saa-say', ''); });
}

function advance(turnName, replyText){
  if(replyText){ transcript.push({who:'user', text:replyText}); }
  stack.push({t:turnName, reply:replyText || null});
  renderTop(true);
}

function goBack(){
  if(stack.length <= 1) return;
  stack.pop();
  renderTop(false);
}

function getTranscript(){ return transcript.slice(); }

// legacy accent colours are mapped onto the dark-theme tones: blue = info, warn = caution/partial, ok = correct
var KICKER_TONES = {'var(--green)':'ok', 'var(--amber)':'warn', 'var(--gold)':'warn'};
function kickerRow(icon, label, color){
  var tone = KICKER_TONES[color] || 'blue';
  return '<div class="kicker-row tone-'+tone+'"><span class="kicon">'+icon+'</span><span class="klabel">'+label+'</span></div>';
}

function addBot(html, wide, kind){
  var msg = document.createElement('div');
  msg.className = 'msg bot';
  var cls = 'bubble'+(wide?' wide':'')+(kind?' k-'+kind:'');
  msg.innerHTML = '<div class="avatar">'+ICON_BOT+'</div><div class="'+cls+'">'+html+'</div>';
  chat.appendChild(msg);
  return msg;
}

function addWidget(innerHtml){
  var msg = document.createElement('div');
  msg.className = 'msg bot widget';
  msg.innerHTML = '<div class="avatar">'+ICON_BOT+'</div><div class="bubble">'+innerHtml+'</div>';
  chat.appendChild(msg);
  return msg;
}

function addContinue(label, onClick){
  var wrap = document.createElement('div');
  wrap.className = 'continue-wrap';
  wrap.innerHTML = '<button type="button" class="continue-btn">'+(label||'Continue')+' '+ICON_ARROW+'</button>';
  wrap.querySelector('button').onclick = onClick;
  chat.appendChild(wrap);
  return wrap;
}

/* Game 14 designer assets (Oct 2026): the record is drawn as a ruled paper
   register (pack look) with the game's own three lines, word for word. Each
   line "Label: text" becomes one register row: label | text. */
function recordCardHtml(lane){
  return '<div class="record-card g14-register"><div class="g14-reg-head"><div class="rtitle">'+'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>'+lane.recordTitle+'</div><span class="g14-tag">Made-up record</span></div>'+
    '<table class="g14-reg"><tbody>'+
    lane.recordItems.map(function(i){
      var c = i.indexOf(':');
      var t = i.slice(c+1).trim(); t = t.charAt(0).toUpperCase() + t.slice(1);
      return c > 0 ? '<tr><th scope="row">'+i.slice(0,c)+'</th><td>'+t+'</td></tr>' : '<tr><td colspan="2">'+i+'</td></tr>';
    }).join('') +
  '</tbody></table></div>';
}

/* ============ TURNS ============ */
var FIX_COLORS = {figure:'var(--teal)', fact:'var(--royal)', claim:'var(--coral)'};

var TURN_FNS = {
  welcome: function(){
    addBot(
      kickerRow(ICON_LIGHTBULB, 'Welcome', 'var(--royal)') +
      '<p>Namaste! Today you will learn one important AI skill.</p><p>An AI tool can write wrong facts, and it can forget to finish the work. Today, you will fix both problems.</p>',
      false, 'intro'
    );
    addContinue('Let us start', function(){ advance('safety'); });
  },

  safety: function(){
    addBot(
      kickerRow(ICON_SHIELD, 'Safety first', 'var(--gold)') +
      '<p>Please keep your personal details safe.</p>' +
      '<div class="never-panel">' +
        '<div class="never-head">'+ '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01M10.3 3.9L2.5 17a1.8 1.8 0 0 0 1.5 2.7h16a1.8 1.8 0 0 0 1.5-2.7L13.7 3.9a1.6 1.6 0 0 0-2.8 0z"/></svg>' +'Never type these details into an AI tool.</div>'+
        '<div class="never-grid">'+
          '<div class="never-chip">'+g14Icon('icon-private-password')+'<span>Password</span></div>'+
          '<div class="never-chip">'+g14Icon('icon-private-aadhaar')+'<span>Aadhaar or ID</span></div>'+
          '<div class="never-chip">'+g14Icon('icon-private-phone')+'<span>Phone number</span></div>'+
          '<div class="never-chip">'+g14Icon('icon-private-address')+'<span>Address</span></div>'+
          '<div class="never-chip">'+g14Icon('icon-private-health')+'<span>Health details</span></div>'+
          '<div class="never-chip">'+g14Icon('icon-private-marks')+'<span>Marks and grades</span></div>'+
        '</div>'+
      '</div>' +
      '<p style="margin-top:8px;">Everything in this lesson is made up. Please keep your own answers made up too.</p>',
      true, 'caution'
    );
    addContinue('I understand', function(){ advance('stakes', 'I understand. Let us continue.'); });
  },

  stakes: function(){
    addBot(
      kickerRow(ICON_TARGET, 'Why this matters', 'var(--purple)') +
      '<p>This skill matters for 3 reasons.</p>'+
      '<p class="do saa-do"><b class="saa-do-label">Your task.</b> Tap each card to read one reason.</p>'+
      '<div class="saa-kit stakes-kit" data-kit="reveal" data-required>'+
        '<div class="saa-cards">'+
          '<button class="saa-card" type="button"><span class="saa-front">'+g14Icon('icon-half-fixed','g14-card-ic')+'<span class="g14-ft">Half-fixed is still wrong</span></span><span class="saa-back">A note with 1 fix and 2 mistakes can look safe. It is still not safe.</span></button>'+
          '<button class="saa-card" type="button"><span class="saa-front">'+g14Icon('icon-unfinished','g14-card-ic')+'<span class="g14-ft">An unfinished note can hurt</span></span><span class="saa-back">The note may forget to tell the right person about a problem. This causes the same harm as a wrong fact.</span></button>'+
          '<button class="saa-card" type="button"><span class="saa-front">'+g14Icon('icon-record','g14-card-ic')+'<span class="g14-ft">Your record protects you</span></span><span class="saa-back">A short note of what you changed answers any question later. It takes only seconds.</span></button>'+
        '</div>'+
      '</div>',
      true, 'stakes'
    );
    var go = addContinue('Continue', function(){
      var kit = chat.querySelector('.stakes-kit');
      if(kit && !kit.classList.contains('is-done')){
        needMsg(go.querySelector('button'), 'Open all 3 cards first.');
        kit.querySelectorAll('.saa-card:not(.open)').forEach(function(c){ c.classList.add('saa-nudge'); setTimeout(function(){ c.classList.remove('saa-nudge'); }, 2600); });
        return;
      }
      advance('lane');
    });
  },

  lane: function(){
    addBot(kickerRow(ICON_TARGET, 'Choose your case', 'var(--teal)') + '<p>Which case is closer to your own life?</p>'+'<p class="do saa-do"><b class="saa-do-label">Your task.</b> Choose your case, then tap Continue.</p>', false, 'record');
    /* Game 14 designer assets (Oct 2026): two character cards replace the dropdown.
       Labels stay live text; the choice feeds the same Continue handler as before. */
    var picked = currentLane || '';
    var msg = addWidget(
      '<div class="g14-picker" role="group" aria-label="Choose your case">'+
        ['iti','higher'].map(function(k){
          return '<button type="button" class="case-pick" data-lane="'+k+'" aria-pressed="'+(picked===k)+'">'+
            '<img src="'+laneData[k].character+'" alt="" aria-hidden="true"><span>'+laneData[k].pickerLabel+'</span></button>';
        }).join('')+
      '</div>'+
      '<div class="widget-row g14-pick-go">'+
        '<button type="button" class="go-btn" id="laneGoBtn">Continue '+ICON_ARROW+'</button>'+
      '</div>'
    );
    msg.classList.add('g14-pick-msg');
    msg.querySelectorAll('.case-pick').forEach(function(b){
      b.onclick = function(){
        picked = b.getAttribute('data-lane');
        msg.querySelectorAll('.case-pick').forEach(function(x){ x.setAttribute('aria-pressed', String(x === b)); });
      };
    });
    document.getElementById('laneGoBtn').onclick = function(){
      var val = picked;
      if(!val){ needMsg(document.getElementById('laneGoBtn').parentNode, 'Choose a case first.'); return; }
      if(currentLane && val !== currentLane){
        // a different case means different answers: clear the old ones
        fixAnswers = {}; fixChecked = {}; finishChoice = null; finishChecked = false;
      }
      currentLane = val;
      var label = laneData[val].pickerLabel;
      advance('draft', label);
    };
  },

  draft: function(){
    var lane = laneData[currentLane];
    addBot(
      kickerRow(ICON_DOC, 'AI draft', 'var(--coral)') +
      '<p>An AI tool wrote this note for you.</p>'+
      '<p class="do saa-do"><b class="saa-do-label">Your task.</b> Read the note slowly and look at the 3 red parts.</p>'+
      /* Game 14 designer assets (Oct 2026): the draft sits in the AI-tool frame
         (practice-bot avatar, "AI tool · draft", the learner's prompt). Draft text is the game's own. */
      '<div class="draft-card g14-draft">'+
        '<div class="g14-draft-head"><img class="g14-bot" src="assets/logo-swiftchat-32.webp" alt="AI tool" title="AI tool · draft">'+
          '<div class="dtitle">'+lane.title+'</div>'+
          '<p class="g14-prompt"><b>Your prompt</b><span>'+lane.prompt+'</span></p></div>'+
        '<div class="dtext">'+lane.draftHtml+'</div></div>',
      true, 'draft'
    );
    addContinue('Show me the real record', function(){ advance('record'); });
  },

  record: function(){
    var lane = laneData[currentLane];
    addBot(
      kickerRow(ICON_CLIPBOARD, 'Real record', 'var(--teal)') +
      '<p>Good. Now look at the real record.</p>'+
      '<p class="do saa-do"><b class="saa-do-label">Your task.</b> Read the 3 lines, because you will use them to fix the note.</p>'+
      recordCardHtml(lane),
      true, 'record'
    );
    addContinue('Start correcting', function(){ advance('fix0'); });
  },

  fix0: function(){ fixTurn(0); }, fix1: function(){ fixTurn(1); }, fix2: function(){ fixTurn(2); },
  fb0: function(){ fixFeedbackTurn(0); }, fb1: function(){ fixFeedbackTurn(1); }, fb2: function(){ fixFeedbackTurn(2); },

  finish: function(){
    var lane = laneData[currentLane];
    addBot(
      kickerRow(ICON_FLAG, 'Finish it', 'var(--royal)') +
      '<p>Well done. You checked all 3 lines.</p><p>'+lane.finishQuestion+'</p>'+'<p class="do saa-do"><b class="saa-do-label">Your task.</b> Choose the best ending, then tap Check my ending.</p>',
      false, 'finish'
    );
    addWidget(
      '<select class="chat-select" id="finishSelect" aria-label="Choose the best ending" style="width:100%;min-width:0;">'+
        '<option value="">Choose the best ending…</option>'+
        lane.finishOptions.map(function(o,i){return '<option value="'+i+'">'+o+'</option>';}).join('')+
      '</select>'+
      '<div class="widget-row"><button type="button" class="go-btn" id="finishGoBtn">Check my ending '+ICON_CHECK+'</button></div>'
    );
    if(finishChoice !== null) document.getElementById('finishSelect').value = String(finishChoice);
    document.getElementById('finishGoBtn').onclick = function(){
      var val = document.getElementById('finishSelect').value;
      if(val === ''){ needMsg(document.getElementById('finishGoBtn').parentNode, 'Choose an ending first.'); return; }
      finishChoice = parseInt(val);
      finishChecked = true;
      if(window.SAA_SFX){ if(finishChoice === lane.finishCorrect){ SAA_SFX.correct && SAA_SFX.correct(); } else { SAA_SFX.wrong && SAA_SFX.wrong(); } }
      advance('finishfb', lane.finishOptions[finishChoice]);
    };
  },

  finishfb: function(){
    var lane = laneData[currentLane];
    var isRight = (finishChoice === lane.finishCorrect);
    if(isRight){
      addBot(kickerRow(ICON_CHECK, 'Nice work', 'var(--green)') + '<p class="feedback-good">Yes. This ending tells the right person about the real problem.</p>' + finishDiagramHtml(), false, 'good');
    } else {
      addBot(kickerRow(ICON_TARGET, 'Almost there', 'var(--amber)') + '<p class="feedback-soft">Not quite. The note must tell the right person about the real problem.</p><p class="model-line">The best ending is: '+lane.finishOptions[lane.finishCorrect]+'</p>' + finishDiagramHtml(), false, 'soft');
    }
    addContinue('Show my record', function(){ advance('log'); });
  },

  /* the record table is split over two turns so it never needs to scroll:
     1 of 2 = the three corrected lines, 2 of 2 = the closing step */
  log: function(){
    var lane = laneData[currentLane];
    var rows = '';
    lane.fixes.forEach(function(f){
      rows += '<tr><td>'+f.phrase+'</td><td>'+escapeHtml(fixAnswers[f.id]||'—')+'</td></tr>';
    });
    addBot(
      kickerRow(ICON_TABLE, 'Your record · 1 of 2', 'var(--navy)') +
      '<p>This is your record. It shows what the AI tool wrote and what you corrected.</p>'+
      logTableHtml(rows),
      true, 'log'
    );
    addContinue('Continue', function(){ advance('log2'); });
  },

  log2: function(){
    var lane = laneData[currentLane];
    var rows = '<tr><td>The note had no closing step.</td><td>'+(finishChoice!==null ? lane.finishOptions[finishChoice] : '—')+'</td></tr>';
    addBot(
      kickerRow(ICON_TABLE, 'Your record · 2 of 2', 'var(--navy)') +
      '<p>This row shows the closing step that you chose for the note.</p>'+
      logTableHtml(rows),
      true, 'log'
    );
    addContinue('See my result', function(){ advance('result'); });
  },

  result: function(){
    var lane = laneData[currentLane];
    var fixesOk = lane.fixes.filter(function(f){ return fixChecked[f.id]; }).length;
    var finishOk = finishChecked && (finishChoice === lane.finishCorrect);
    var passed = (fixesOk >= 2 && finishOk);
    var html =
      '<div class="result-card '+(passed?'pass':'fail')+'">' +
        (passed ? ICON_CHECK : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>') +
        '<h3>'+(passed ? 'Well done. You completed the task.' : 'Good try. Please try once more.')+'</h3>'+
        '<p>You got '+fixesOk+' out of 3 corrections right. Your closing step '+(finishOk?'is correct':'is not correct yet')+'.</p>'+
        '<p>'+(passed
          ? 'You corrected the note, finished it and kept a clear record. You passed this gated step.'
          : 'To pass, you need at least 2 out of 3 corrections right and the correct closing step. Please try again.') +
        '</p>'+
      '</div>';
    addBot(html, true);
    var wrap = document.createElement('div');
    wrap.className = 'restart-wrap';
    wrap.innerHTML = '<button type="button" class="restart-btn">'+ICON_REFRESH+' Try again from the start</button>';
    wrap.querySelector('button').onclick = function(){ start(); };
    chat.appendChild(wrap);
  }
};

/* Game 14 designer assets (Oct 2026): "diag-finish-note" rebuilt as live HTML
   (note with a dotted "Next step: ?" line -> arrow -> the right person).
   Shown only AFTER the learner has chosen an ending, so it never hints the answer. */
function finishDiagramHtml(){
  return '<figure class="g14-finish" role="img" aria-label="A note with an empty last line, Next step, with an arrow to the right person.">'+
    '<span class="g14-fn-note" aria-hidden="true"><i></i><i></i><i></i><b>Next step: ?</b></span>'+
    '<span class="g14-fn-arrow" aria-hidden="true">'+ICON_ARROW+'</span>'+
    '<span class="g14-fn-person" aria-hidden="true">'+ICON_USER+'<b>the right person</b></span>'+
  '</figure>';
}

function logTableHtml(rows){
  return '<div class="log-card">'+
    '<div class="log-legend" aria-hidden="true"><span class="lg-ai">AI tool wrote</span><span class="lg-you">You corrected</span></div>'+
    '<table><thead><tr><th>AI tool wrote</th><th>You corrected</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}

function escapeHtml(s){
  return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; });
}

function fixTurn(fixIdx){
  var lane = laneData[currentLane];
  var f = lane.fixes[fixIdx];
  var color = FIX_COLORS[f.id] || 'var(--royal)';
  // The record is no longer on screen above, so the bubble can swap between the
  // question and the real record (same space, so the open state still fits).
  var qMsg = addBot(
    kickerRow(FIX_ICONS[f.id] ? g14Icon(FIX_ICONS[f.id], 'g14-kic') : ICON_EDIT, 'Correction ' + (fixIdx+1) + ' of ' + lane.fixes.length, color) +
    '<div class="fix-q"><p><b>'+f.label+'</b></p><p>The AI note says '+f.phrase+'.</p><p class="do saa-do"><b class="saa-do-label">Your task.</b> Check the real record and type the correct fact.</p></div>'+
    '<div class="fix-rec" hidden>'+recordCardHtml(lane)+'</div>',
    false, 'fix'
  );
  var ref = document.createElement('div');
  ref.className = 'record-toggle';
  ref.innerHTML = '<button type="button" class="saa-btn-link" aria-expanded="false">'+ICON_CLIPBOARD+'<span>Show the real record</span></button>';
  var tBtn = ref.querySelector('button');
  var qPane = qMsg.querySelector('.fix-q'), rPane = qMsg.querySelector('.fix-rec');
  tBtn.onclick = function(){
    var open = rPane.hasAttribute('hidden');
    if(open){ rPane.removeAttribute('hidden'); qPane.setAttribute('hidden',''); }
    else { qPane.removeAttribute('hidden'); rPane.setAttribute('hidden',''); }
    tBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    tBtn.querySelector('span').textContent = open ? 'Back to the question' : 'Show the real record';
  };
  chat.appendChild(ref);

  addWidget(
    '<input class="chat-input" id="fixInput-'+f.id+'" maxlength="160" placeholder="'+f.placeholder+'" aria-label="'+f.label+'">'+
    '<div class="widget-row"><button type="button" class="go-btn" id="fixGoBtn-'+f.id+'">Check my answer '+ICON_CHECK+'</button></div>'
  );
  var input = document.getElementById('fixInput-'+f.id);
  if(fixAnswers[f.id]) input.value = fixAnswers[f.id];
  input.addEventListener('keydown', function(e){ if(e.key === 'Enter') document.getElementById('fixGoBtn-'+f.id).click(); });
  document.getElementById('fixGoBtn-'+f.id).onclick = function(){
    var val = input.value.trim();
    if(val.length < 2){ needMsg(document.getElementById('fixGoBtn-'+f.id).parentNode, 'Type your answer first.'); input.focus(); return; }
    fixAnswers[f.id] = val;
    fixChecked[f.id] = checkFix(f, val);
    if(window.SAA_SFX){ if(fixChecked[f.id]){ SAA_SFX.correct && SAA_SFX.correct(); } else { SAA_SFX.wrong && SAA_SFX.wrong(); } }
    advance('fb'+fixIdx, val);
  };
}

/* QA fix (Oct 2026): the answer must state the real fact, not repeat the AI's wrong claim.
   - figure: the first number written must be the real one ("12 trainees, not 11" fails).
   - fact / claim: it must use the record's fact and must not say the AI's wrong claim
     (a claim only counts as repeated when no "not / no / never" stands just before it). */
function negatedAt(v, idx){
  var before = v.slice(Math.max(0, idx - 24), idx).toLowerCase();
  return /\b(not|no|never|isn't|hasn't|doesn't|didn't|wasn't|haven't|cannot|can't)\b[^.]*$/.test(before);
}
function checkFix(f, val){
  var v = ' ' + val.toLowerCase().replace(/\s+/g, ' ') + ' ';
  if(f.num){
    var m = v.match(/\d+|\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|forty[- ]two|forty[- ]five)\b/);
    var first = m ? m[0] : '';
    if(f.num.indexOf(first) < 0) return false;
    if(new RegExp('\\b(not|no)\\s+(only\\s+)?' + f.num[0] + '\\b').test(v)) return false;
    return true;
  }
  if(!f.pos.test(v)) return false;
  if((f.neg || []).some(function(r){ return r.test(v); })) return false;
  var claimed = (f.claims || []).some(function(r){
    var g = new RegExp(r.source, 'gi'), mm;
    while((mm = g.exec(v))){ if(!negatedAt(v, mm.index)) return true; }
    return false;
  });
  return !claimed;
}

function needMsg(after, text){
  var host = after.parentNode;
  var el = host.querySelector('.g14-need');
  if(!el){
    el = document.createElement('p');
    el.className = 'g14-need saa-vo-skip';
    el.setAttribute('role', 'status');
    after.insertAdjacentElement('afterend', el);
  }
  el.textContent = text;
  el.hidden = false;
  clearTimeout(el._t); el._t = setTimeout(function(){ el.hidden = true; }, 4000);
  try { el.scrollIntoView({block:'nearest'}); } catch(e){}
}

function fixFeedbackTurn(fixIdx){
  var lane = laneData[currentLane];
  var f = lane.fixes[fixIdx];
  if(fixChecked[f.id]){
    addBot(kickerRow(ICON_CHECK, 'Nice work', 'var(--green)') + '<p class="feedback-good">Yes. Your answer matches the fact in the real record.</p><p class="model-line">Here is a full answer: '+f.model+'</p>', false, 'good');
  } else {
    addBot(kickerRow(ICON_TARGET, 'Almost there', 'var(--amber)') + '<p class="feedback-soft">Not quite. Your answer does not use the fact from the real record. You can tap Back to try again.</p><p class="model-line">Here is a full answer: '+f.model+'</p>', false, 'soft');
  }
  var nextTurn = fixIdx < lane.fixes.length-1 ? 'fix'+(fixIdx+1) : 'finish';
  addContinue(fixIdx < lane.fixes.length-1 ? 'Next line' : 'Continue', function(){ advance(nextTurn); });
}

/* ============ START / INIT ============ */
function start(){
  fixAnswers = {};
  fixChecked = {};
  finishChoice = null;
  finishChecked = false;
  currentLane = null;
  transcript = [];
  stack = [{t:'welcome', reply:null}];
  renderTop(true);
}

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('backBtn').onclick = goBack;
  start();
});
