/* ==========================================================================
   AAI-E-MC1-S01-READ01 — screen sequencing, prediction recall, check tally
   No browser storage: the learner's typed answer lives in memory only.
   ========================================================================== */

(function(){
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var i = 0;
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var fill = document.getElementById('fill');
  var count = document.getElementById('count');
  var ECHO_STEP = 4;
  var qi = 0;


  function pad(n){ return (n < 10 ? '0' : '') + n; }

  var app = document.getElementById('app'), startEl = document.getElementById('start');
  var gatemsg = document.getElementById('gatemsg');
  function unlocked(){
    var s = steps[i], g = s.getAttribute('data-gate');
    if (!g) return true;
    if (g === 'text') { var f = s.querySelector('input.field, textarea.field'); return !!(f && f.value.trim().length >= (f.tagName === 'TEXTAREA' ? 10 : 1)); }
    if (g === 'judge') { var dr = document.getElementById('draft'); return dr.classList.contains('revealed') && s.querySelectorAll('input[type=checkbox]:checked').length === s.querySelectorAll('input[type=checkbox]').length; }
    if (g === 'done') return s.getAttribute('data-done') === '1';
    var boxes = s.querySelectorAll('input[type=checkbox]');
    var done = s.querySelectorAll('input[type=checkbox]:checked').length;
    return g === 'any' ? done > 0 : done === boxes.length;
  }
  function refresh(){
    var last = i === steps.length - 1, ok = last || unlocked();
    next.disabled = !ok;
    var msg = steps[i].getAttribute('data-gate-msg') || '';
    gatemsg.textContent = ok ? '' : msg;
  }
  document.addEventListener('input', refresh);
  document.addEventListener('change', refresh);

  // narration: one clip per screen (audio/sN.mp3), Narakeet voice Sheela
  var audio = document.getElementById('narration');
  var listen = document.getElementById('listen');
  var voice = document.getElementById('voice');
  var autoNarrate = true, started = false;
  function stopAudio(){ clearHi(); audio.pause(); listen.classList.remove('playing'); listen.querySelector('span').textContent = 'Replay'; listen.setAttribute('aria-label', 'Play narration'); }
  function playAudio(){
    var p = audio.play();
    if (p && p.catch) { p.catch(function(){ stopAudio(); }); }
  }
  function loadAudio(n){
    stopFb();
    stopAudio();
    audio.src = 'audio/s' + (n + 1) + '.mp3';
    if (started && autoNarrate) { playAudio(); }
  }
  audio.addEventListener('play', function(){ listen.classList.add('playing'); listen.querySelector('span').textContent = 'Pause'; listen.setAttribute('aria-label', 'Pause narration'); });
  audio.addEventListener('pause', function(){ listen.classList.remove('playing'); listen.querySelector('span').textContent = audio.ended || audio.currentTime === 0 ? 'Replay' : 'Resume'; listen.setAttribute('aria-label', 'Play narration'); });
  audio.addEventListener('ended', function(){ listen.querySelector('span').textContent = 'Replay'; });

  // short spoken feedback for the right-hand activities (audio/fb/<id>.mp3)
  var fb = new Audio(), fbDone = null;
  function stopFb(){ fb.pause(); fb.onended = null; fbDone = null; }
  function speak(id, then, force){
    stopFb();
    if (force) { started = true; }
    if (!started || (!autoNarrate && !force)) { if (then) { setTimeout(then, 1600); } return; }
    stopAudio();
    try { audio.currentTime = 0; } catch (e) {}   /* the screen clip restarts from the top: the header shows Replay, not Resume */
    fbDone = then || null;
    fb.onended = function(){ var f = fbDone; fbDone = null; if (f) { f(); } };
    fb.src = 'audio/fb/' + id + '.mp3';
    var pr = fb.play();
    if (pr && pr.catch) { pr.catch(function(){ var f = fbDone; fbDone = null; if (f) { setTimeout(f, 1200); } }); }
  }
  audio.addEventListener('ended', function(){
    var st = steps[i], f = st.getAttribute('data-follow');
    if (f && !st.getAttribute('data-followed') && st.getAttribute('data-done') !== '1') {
      st.setAttribute('data-followed', '1');
      speak(f === 'q' ? 'q' + qi : f);
    }
  });
  listen.addEventListener('click', function(){
      started = true;
    if (audio.paused) { if (audio.ended) { audio.currentTime = 0; } playAudio(); } else { audio.pause(); }
  });
  voice.addEventListener('click', function(){
    autoNarrate = !autoNarrate;
    voice.setAttribute('aria-pressed', autoNarrate ? 'true' : 'false');
    voice.setAttribute('aria-label', autoNarrate ? 'Auto-narration on. Tap to turn off' : 'Auto-narration off. Tap to turn on');
    if (!autoNarrate) { stopAudio(); }
  });

  // word highlight: wrap left-column words, light them up in step with the audio (timing estimated from clip length)
  var SKIP = 'tag said'.split(' ');
  var stepWords = steps.map(function(st){
    var lead = st.querySelector('.lead'), words = [];
    if (!lead) { return words; }
    var walker = document.createTreeWalker(lead, NodeFilter.SHOW_TEXT, null), nodes = [], nd;
    while ((nd = walker.nextNode())) { nodes.push(nd); }
    nodes.forEach(function(t){
      var par = t.parentNode;
      if (par.closest('.tag, .said, .nr, button') || !t.nodeValue.trim()) { return; }
      var block = par.closest('p, h2, li'), frag = document.createDocumentFragment();
      t.nodeValue.split(/(\s+)/).forEach(function(part){
        if (!part) { return; }
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var sp = document.createElement('span'); sp.className = 'w'; sp.textContent = part;
        frag.appendChild(sp);
        words.push({ el: sp, block: block });
      });
      par.replaceChild(frag, t);
    });
    return words;
  });
  var raf = 0, timeline = null;
  function buildTimeline(words, dur){
    // weight of each word ~ how long it takes to say
    var wt = words.map(function(o){
      var txt = o.el.textContent;
      return txt.replace(/[^\w\u2019']/g, '').length + 1 + (/[,;]$/.test(txt) ? 2 : 0);
    });
    // group words into sentences: a sentence ends at . ? ! or at the end of a text block
    var groups = [], cur = [];
    words.forEach(function(o, k){
      cur.push(k);
      var last = k === words.length - 1 || words[k + 1].block !== o.block;
      if (/[.?!]$/.test(o.el.textContent) || last) { groups.push(cur); cur = []; }
    });
    var T = (window.NARRATION_TIMINGS || {})[i + 1], segs = null;
    if (T && T.segs.length === groups.length) { segs = T.segs; }
    if (!segs) {   // fall back to spreading all words evenly over the clip
      segs = groups.map(function(g, gi){
        var span = Math.max(0.5, dur - 0.5), sum = 0, tot = 0;
        groups.forEach(function(x){ x.forEach(function(k){ tot += wt[k]; }); });
        for (var q = 0; q < gi; q++) { groups[q].forEach(function(k){ sum += wt[k]; }); }
        var mine = 0; g.forEach(function(k){ mine += wt[k]; });
        return [0.15 + span * sum / tot, 0.15 + span * (sum + mine) / tot];
      });
    }
    var starts = new Array(words.length);
    groups.forEach(function(g, gi){
      var seg = segs[gi], total = 0, acc = 0;
      g.forEach(function(k){ total += wt[k]; });
      g.forEach(function(k){ starts[k] = seg[0] + (seg[1] - seg[0]) * acc / total; acc += wt[k]; });
    });
    return starts;
  }
  function clearHi(){
    cancelAnimationFrame(raf);
    steps.forEach(function(st, k){
      st.classList.remove('speaking');
      stepWords[k].forEach(function(o){ o.el.classList.remove('on', 'done'); });
    });
  }
  function tick(){
    var words = stepWords[i];
    if (!timeline || audio.paused) { return; }
    var t = audio.currentTime, cur = -1;
    for (var k = 0; k < timeline.length; k++) { if (timeline[k] <= t) { cur = k; } else { break; } }
    words.forEach(function(o, k){
      o.el.classList.toggle('done', k < cur);
      o.el.classList.toggle('on', k === cur);
    });
    raf = requestAnimationFrame(tick);
  }
  function startHi(){
    var words = stepWords[i];
    var synced = (window.NARRATION_SYNCED || []).indexOf(i + 1) !== -1;
    if (!synced || !words.length || !isFinite(audio.duration)) { return; }
    timeline = buildTimeline(words, audio.duration);
    steps[i].classList.add('speaking');
    cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  }
  audio.addEventListener('playing', function(){ if (audio.currentTime < 0.05) { clearHi(); } startHi(); });
  audio.addEventListener('pause', function(){ cancelAnimationFrame(raf); });
  audio.addEventListener('ended', function(){ clearHi(); });

  function go(n){
    i = Math.max(0, Math.min(steps.length - 1, n));
    steps.forEach(function(s, k){
      var on = k === i;
      s.classList.toggle('on', on);
      if (on) { s.removeAttribute('hidden'); } else { s.setAttribute('hidden', ''); }
    });
    fill.style.width = ((i + 1) / steps.length * 100) + '%';
    count.textContent = (i + 1) + ' / ' + steps.length;
    prev.disabled = i === 0;
    next.textContent = i === steps.length - 1 ? 'Start again' : 'Next';
    if (i === ECHO_STEP) { echo(); }
    if (i === 3) { var rv = document.getElementById('resp1'); var ans = (rv && rv.value.trim()) || 'You did not paste an answer.'; document.getElementById('quoteText').textContent = ans; document.getElementById('ansFull').textContent = ans; }
    steps[i].classList.remove('play'); void steps[i].offsetWidth; steps[i].classList.add('play');
    refresh();
    loadAudio(i);
    if (typeof armIdle === 'function') { armIdle(); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prev.addEventListener('click', function(){ started = true; go(i - 1); });
  next.addEventListener('click', function(){
    if (next.disabled) return;
    started = true;
    if (i === steps.length - 1) { restart(); return; }
    go(i + 1);
  });
  // Start again: a clean slate for the next learner (nothing is stored, so a reload clears every answer and activity)
  function restart(){ stopFb(); stopAudio(); try { location.reload(); } catch (e) { go(0); } }

  document.addEventListener('keydown', function(e){
    if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight' && !next.disabled && i < steps.length - 1) go(i + 1);
    if (e.key === 'ArrowLeft') go(i - 1);
  });

  var pred = document.getElementById('pred');
  var echoWrap = document.getElementById('echoWrap');
  var echoEl = document.getElementById('echo');
  var noEcho = document.getElementById('noEcho');
  function echo(){
    if (!echoWrap) { return; }
    var v = pred && pred.value.trim();
    if (v) {
      echoEl.textContent = v;
      echoWrap.removeAttribute('hidden');
      if (noEcho) noEcho.setAttribute('hidden', '');
    } else {
      echoWrap.setAttribute('hidden', '');
      if (noEcho) noEcho.removeAttribute('hidden');
    }
  }
  if (pred) {
    pred.addEventListener('keydown', function(e){ if (e.key === 'Enter' && !next.disabled) go(i + 1); });
  }

  var lns = Array.prototype.slice.call(document.querySelectorAll('.nseg'));
  var reveal = document.getElementById('reveal'), segfb = document.getElementById('segfb'), paper = document.getElementById('draft');
  function marked(){ return lns.filter(function(x){ return x.getAttribute('aria-pressed') === 'true'; }).length; }
  lns.forEach(function(b){
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function(){
      if (paper.classList.contains('revealed')) {
        var flaw = b.getAttribute('data-flaw') === '1', on = b.getAttribute('aria-pressed') === 'true';
        segfb.textContent = (flaw ? (on ? '\u2713 You caught this. ' : '\u2717 You missed this. ') : (on ? '\u2022 This one was fine. ' : '\u2022 Fine. ')) + b.getAttribute('data-why').replace(/^(Fine|Wrong|Invented|Missing)\. ?/, function(m){ return m; });
        return;
      }
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      var n = marked();
      reveal.disabled = n === 0;
      segfb.textContent = n === 0 ? 'Tap any part of the notice to mark it.' : n + (n === 1 ? ' part marked. ' : ' parts marked. ') + 'Tap again to unmark, or press Check my choices.';
      refresh();
    });
  });
  if (reveal) {
    reveal.addEventListener('click', function(){
      paper.classList.add('revealed');
      var flaws = lns.filter(function(x){ return x.getAttribute('data-flaw') === '1'; });
      var caught = flaws.filter(function(x){ return x.getAttribute('aria-pressed') === 'true'; }).length;
      lns.forEach(function(x){
        var flaw = x.getAttribute('data-flaw') === '1', on = x.getAttribute('aria-pressed') === 'true';
        x.classList.add(flaw ? (on ? 'caught' : 'missed') : (on ? 'wrongflag' : 'ok'));
      });
      var extra = lns.some(function(x){ return x.classList.contains('wrongflag'); }) ? ' Grey parts were fine.' : '';
      segfb.textContent = 'You caught ' + caught + ' of ' + flaws.length + ' problems.' + extra + ' Tap any part to see why.';
      // one sound for the whole check: right when all are caught, wrong only when none are
      if (window.SAA_SFX) { if (caught === flaws.length) { SAA_SFX.correct(); } else if (caught === 0) { SAA_SFX.wrong(); } }
      reveal.setAttribute('hidden', '');
      setDone();
      speak('s9_reveal');
    });
  }

  var chkLists = Array.prototype.slice.call(document.querySelectorAll('.chk'));
  chkLists.forEach(function(list){
    var tally = list.parentNode.querySelector('[data-tally]');
    if (!tally) return;
    var doneLabel = tally.getAttribute('data-done-label') || '';
    list.addEventListener('change', function(){
      var boxes = list.querySelectorAll('input');
      var done = list.querySelectorAll('input:checked').length;
      tally.textContent = done === boxes.length
        ? 'All ' + boxes.length + ' checked' + (doneLabel ? ' ' + doneLabel : '')
        : done + ' of ' + boxes.length + ' checked';
      tally.classList.toggle('done', done === boxes.length);
      if (done === boxes.length && list.closest('.step') === steps[9]) { speak('s10_done'); }
    });
  });

  function setDone(){ steps[i].setAttribute('data-done', '1'); refresh(); }
  // screen 5: the order kit tells us when it is solved
  document.addEventListener('saa:done', function(e){
    var st = e.target && e.target.closest ? e.target.closest('.step') : null;
    if (st) { st.setAttribute('data-done', '1'); refresh(); }
  });
  // phones: keep the feedback line in view after a tap
  function showFb(node){
    if (window.innerWidth > 700 || !node.scrollIntoView) { return; }
    setTimeout(function(){ try { node.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} }, 60);
  }

  // screen 1: quick answers
  var answerBtns = document.querySelectorAll('#chips .choice');
  Array.prototype.forEach.call(answerBtns, function(b){
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function(){
      Array.prototype.forEach.call(answerBtns, function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      pred.value = b.textContent;
      pred.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });
  pred.addEventListener('input', function(e){
    if (e.isTrusted) { Array.prototype.forEach.call(answerBtns, function(x){ x.setAttribute('aria-pressed', 'false'); }); }
  });

  // screen 3: copy the prompt
  var copyBtn = document.getElementById('copyPrompt');
  if (copyBtn) {
    copyBtn.addEventListener('click', function(){
      var txt = document.getElementById('promptText').textContent.trim();
      function done(){ copyBtn.textContent = 'Copied \u2713'; setTimeout(function(){ copyBtn.textContent = 'Copy prompt'; }, 1800); }
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(done, done); }
      else { var r = document.createRange(); r.selectNodeContents(document.getElementById('promptText')); var sel2 = window.getSelection(); sel2.removeAllRanges(); sel2.addRange(r); try { document.execCommand('copy'); } catch (e) {} done(); }
    });
  }

  // screen 6: next-word predictor
  var opts = document.querySelectorAll('#pred6 .opt');
  var blank = document.getElementById('blank');
  var predOut = document.getElementById('predOut');
  var P_TOP = 'That is the most likely word. But likely is not the same as true: the real time depends on your notice, not on patterns.';
  var P_OTHER = 'A less likely word, but the tool could still write it. It picks by likelihood, not by what is true for your class.';
  Array.prototype.forEach.call(opts, function(o){
    o.addEventListener('click', function(){
      var wrap = o.parentNode;
      Array.prototype.forEach.call(opts, function(x){
        x.classList.toggle('chosen', x === o);
        x.querySelector('i').style.width = (x.getAttribute('data-p') * 2.4) + '%';
      });
      wrap.classList.add('shown');
      blank.textContent = o.querySelector('.lbl').textContent;
      blank.classList.add('filled');
      var top = Array.prototype.every.call(opts, function(x){ return +x.getAttribute('data-p') <= +o.getAttribute('data-p'); });
      predOut.textContent = top ? P_TOP : P_OTHER;
      speak(top ? 'p_top' : 'p_other');
      setDone();
    });
  });
  document.getElementById('hear6').addEventListener('click', function(){ speak('s6_prompt', null, true); });

  // screen 7: match tool to task
  var tasks = [
    ['Find today\u2019s bus timetable', 'search', 'A search engine finds pages that already exist.'],
    ['Work out 32 \u00d7 \u20b9450', 'calc', 'A calculator applies fixed rules and gives one right answer.'],
    ['Write a friendly reminder for tomorrow\u2019s class', 'ai', 'An AI tool generates new wording. You still check it.']
  ];
  var qtask = document.getElementById('qtask'), qlabel = document.getElementById('qlabel'), qfb = document.getElementById('qfb');
  var cards = document.querySelectorAll('.tcard');
  function showTask(){
    qlabel.textContent = 'Task ' + (qi + 1) + ' of ' + tasks.length;
    qtask.textContent = tasks[qi][0];
    qfb.textContent = 'Tap the tool that fits the task.';
    Array.prototype.forEach.call(cards, function(c){ c.classList.remove('right', 'wrong'); c.disabled = false; });
  }
  if (qtask) {
    showTask();
    document.getElementById('hear7').addEventListener('click', function(){ speak('q' + qi, null, true); });
    Array.prototype.forEach.call(cards, function(c){
      c.addEventListener('click', function(){
        if (c.getAttribute('data-k') === tasks[qi][1]) {
          c.classList.add('right');
          qfb.textContent = '\u2713 ' + tasks[qi][2];
          showFb(qfb);
          Array.prototype.forEach.call(cards, function(x){ x.disabled = true; });
          var done = qi;
          qi++;
          if (qi < tasks.length) {
            speak('ok' + done, function(){ showTask(); speak('q' + qi); });
          } else {
            qlabel.textContent = 'All three matched'; setDone();
            speak('ok' + done, function(){ speak('q_done'); });
          }
        } else {
          c.classList.remove('wrong'); void c.offsetWidth; c.classList.add('wrong');
          qfb.textContent = 'Not quite. Think about what each tool actually does.';
          showFb(qfb);
          speak('q_wrong');
        }
      });
    });
  }

  // screen 8: sort tasks into buckets (tap, or drag with mouse / touch)
  var sortEl = document.querySelector('.sort'), sel = null, sfb = document.getElementById('sortfb');
  if (sortEl) {
    var poolEl = document.getElementById('pool');
    var chipsAll = Array.prototype.slice.call(poolEl.querySelectorAll('.chip'));
    chipsAll.forEach(function(c, k){ c.setAttribute('data-fb', 'f' + k); });
    function select(c){
      if (sel) { sel.setAttribute('aria-pressed', 'false'); }
      sel = (sel === c) ? null : c;
      if (sel) { sel.setAttribute('aria-pressed', 'true'); }
      sortEl.classList.toggle('armed', !!sel);
    }
    // a short right / wrong mark on the bucket (the shared sounds hear the class), then it clears
    function flash(b, cls){
      b.classList.remove('right', 'bad'); void b.offsetWidth; b.classList.add(cls);
      clearTimeout(b._fx); b._fx = setTimeout(function(){ b.classList.remove(cls); }, 650);
    }
    function dropOn(b){
      if (!sel) { sfb.textContent = 'Pick a task first.'; return; }
      if (sel.getAttribute('data-b') === b.getAttribute('data-b')) {
        sfb.textContent = '\u2713 ' + sel.getAttribute('data-why');
        flash(b, 'right');
        var fid = sel.getAttribute('data-fb');
        sel.setAttribute('aria-pressed', 'false');
        sel.disabled = true;
        b.querySelector('.slot').appendChild(sel);
        sel = null; sortEl.classList.remove('armed');
        if (!poolEl.querySelector('.chip')) {
          sfb.textContent = 'All sorted. The more it matters, the more you check.';
          setDone();
          speak(fid, function(){ speak('sort_done'); });
        } else { speak(fid); }
      } else {
        b.classList.remove('bad', 'right'); void b.offsetWidth; flash(b, 'bad');
        sfb.textContent = 'Not that one. Ask: would it matter if this came out wrong?';
        speak('sort_wrong');
      }
    }
    var dragged = false, activeDrag = null;
    function hitBucket(x, y){
      var e = document.elementFromPoint(x, y);
      return e && e.closest ? e.closest('.bucket') : null;
    }
    chipsAll.forEach(function(c){
      c.addEventListener('click', function(){ if (dragged) { dragged = false; return; } select(c); });
      c.addEventListener('dragstart', function(e){ e.preventDefault(); });
      c.addEventListener('pointerdown', function(e){
        if (c.disabled || activeDrag || (e.pointerType === 'mouse' && e.button !== 0)) { return; }
        var sx = e.clientX, sy = e.clientY, ghost = null, over = null, moved = false, id = e.pointerId;
        try { c.setPointerCapture(id); } catch (x) {}
        function setOver(b){
          if (over === b) { return; }
          if (over) { over.classList.remove('over'); }
          over = b; if (over) { over.classList.add('over'); }
        }
        function move(ev){
          if (ev.pointerId !== id) { return; }
          if (!moved && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 8) { return; }
          if (!moved) {
            moved = true;
            if (sel && sel !== c) { sel.setAttribute('aria-pressed', 'false'); }
            sel = c; c.setAttribute('aria-pressed', 'true'); sortEl.classList.add('armed');
            ghost = c.cloneNode(true); ghost.className = 'drag-ghost'; ghost.removeAttribute('data-b'); ghost.removeAttribute('data-why');
            ghost.style.width = c.offsetWidth + 'px'; ghost.style.left = '0px'; ghost.style.top = '0px';
            document.body.appendChild(ghost);
            c.classList.add('dragging');
          }
          ghost.style.transform = 'translate(' + (ev.clientX - ghost.offsetWidth / 2) + 'px,' + (ev.clientY - ghost.offsetHeight / 2) + 'px) rotate(-2deg) scale(1.05)';
          setOver(hitBucket(ev.clientX, ev.clientY));
          ev.preventDefault();
        }
        function finish(ev, cancelled){
          if (!activeDrag) { return; }
          activeDrag = null;
          c.removeEventListener('pointermove', move); c.removeEventListener('pointerup', up); c.removeEventListener('pointercancel', cancel); c.removeEventListener('lostpointercapture', cancel);
          window.removeEventListener('blur', cancel); document.removeEventListener('keydown', esc, true);
          try { c.releasePointerCapture(id); } catch (x) {}
          setOver(null);
          c.classList.remove('dragging');
          if (!moved) { return; }
          dragged = true; setTimeout(function(){ dragged = false; }, 80);
          var b = (!cancelled && ev) ? hitBucket(ev.clientX, ev.clientY) : null;
          if (b) {
            if (ghost) { ghost.parentNode.removeChild(ghost); }
            dropOn(b);
            if (sel === c) { c.setAttribute('aria-pressed', 'false'); sel = null; sortEl.classList.remove('armed'); }
          } else {
            // released over nothing (or interrupted): fly back to the pool and reset
            c.setAttribute('aria-pressed', 'false'); sel = null; sortEl.classList.remove('armed');
            if (ghost) {
              var r = c.getBoundingClientRect(), g = ghost;
              g.style.transition = 'transform .2s ease, opacity .2s';
              g.style.transform = 'translate(' + r.left + 'px,' + r.top + 'px)';
              g.style.opacity = '0.2';
              setTimeout(function(){ if (g.parentNode) { g.parentNode.removeChild(g); } }, 220);
            }
          }
        }
        function up(ev){ if (ev.pointerId === id) { finish(ev, false); } }
        function cancel(){ finish(null, true); }
        function esc(ev){ if (ev.key === 'Escape') { finish(null, true); } }
        activeDrag = { finish: finish };
        c.addEventListener('pointermove', move); c.addEventListener('pointerup', up); c.addEventListener('pointercancel', cancel); c.addEventListener('lostpointercapture', cancel);
        window.addEventListener('blur', cancel); document.addEventListener('keydown', esc, true);
      });
    });
    Array.prototype.forEach.call(sortEl.querySelectorAll('.bucket'), function(b){
      b.addEventListener('click', function(){ dropOn(b); });
      b.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dropOn(b); } });
    });
  }

  // screen 2: computer / phone tabs
  var segBtns = document.querySelectorAll('.seg-b');
  Array.prototype.forEach.call(segBtns, function(b){
    b.addEventListener('click', function(){
      Array.prototype.forEach.call(segBtns, function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var st2 = b.closest('.step'); if (st2) { st2.setAttribute('data-done', '1'); refresh(); }
      Array.prototype.forEach.call(document.querySelectorAll('.steps3'), function(o){
        if (o.getAttribute('data-for') === b.getAttribute('data-t')) { o.removeAttribute('hidden'); } else { o.setAttribute('hidden', ''); }
      });
    });
  });

  // screen 4: full answer popup
  var modal = document.getElementById('ansModal'), quoteBtn = document.getElementById('quote');
  function openModal(){ modal.removeAttribute('hidden'); app.setAttribute('inert', ''); document.getElementById('ansClose').focus(); }
  function closeModal(){ modal.setAttribute('hidden', ''); app.removeAttribute('inert'); quoteBtn.focus(); }
  quoteBtn.addEventListener('click', openModal);
  document.getElementById('ansClose').addEventListener('click', closeModal);
  document.getElementById('ansDone').addEventListener('click', closeModal);
  modal.addEventListener('click', function(e){ if (e.target === modal) { closeModal(); } });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !modal.hasAttribute('hidden')) { closeModal(); } });

  // idle nudge: after 5 s of no activity (and no audio playing), make the items the student needs glow
  var idleT = 0;
  function el(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function nudgeTargets(){
    var st = steps[i], respEmpty = !document.getElementById('resp1').value.trim();
    if (next.disabled) {
      switch (i) {
        case 0: return el('#chips .choice');
        case 1: return el('.seg-b');
        case 4: return el('.saa-steps > li');
        case 2: return respEmpty ? el('#copyPrompt, #resp1') : el('#resp1');
        case 3: return el('.step.on .chk .choice');
        case 5: return el('.opt');
        case 6: return el('.tcard:not(:disabled)');
        case 7: return sel ? el('.bucket') : el('#pool .chip:not(:disabled)');
        case 8: return lns.some(function(x){ return x.getAttribute('aria-pressed') === 'true'; }) ? el('#reveal') : el('.nseg');
        case 9: return el('.step.on .chk .choice');
      }
      return [];
    }
    var opt = st.getAttribute('data-nudge');
    if (opt && !st.getAttribute('data-touched')) { return el(opt); }
    return [next];
  }
  function clearNudge(){ el('.nudge').forEach(function(x){ x.classList.remove('nudge'); }); }
  function modalOpen(){ return !document.getElementById('ansModal').hasAttribute('hidden'); }
  function fireNudge(){
    if (startEl.style.display !== 'none' && !startEl.classList.contains('gone')) { idleT = setTimeout(fireNudge, 2000); return; }
    if (!audio.paused || !fb.paused || modalOpen()) { idleT = setTimeout(fireNudge, 2000); return; }
    nudgeTargets().forEach(function(x){ x.classList.add('nudge'); });
  }
  function armIdle(){ clearTimeout(idleT); clearNudge(); idleT = setTimeout(fireNudge, 5000); }
  ['pointerdown', 'keydown', 'input', 'touchstart', 'wheel'].forEach(function(ev){ document.addEventListener(ev, armIdle, true); });
  document.addEventListener('click', function(e){ if (e.target.closest && e.target.closest('.work')) { steps[i].setAttribute('data-touched', '1'); } }, true);
  audio.addEventListener('ended', armIdle);
  fb.addEventListener('ended', armIdle);

  // start screen: the tap unlocks audio, so narration can autoplay from screen 1
  function begin(withSound){
    autoNarrate = withSound;
    voice.setAttribute('aria-pressed', withSound ? 'true' : 'false');
    voice.setAttribute('aria-label', withSound ? 'Auto-narration on. Tap to turn off' : 'Auto-narration off. Tap to turn on');
    started = true;
    app.removeAttribute('inert');
    startEl.classList.add('gone');
    startEl.setAttribute('aria-hidden', 'true');
    if (withSound) { playAudio(); }
    setTimeout(function(){ startEl.style.display = 'none'; }, 600);
  }
  document.getElementById('startBtn').addEventListener('click', function(){ begin(true); });
  document.getElementById('startBtn').focus();

  go(0);
})();
