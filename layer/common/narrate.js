/* ==========================================================================
   NARRATION (all games, same as game 1): one Narakeet clip (voice Sheela) per
   screen for the left-column text, autoplay after Start, Pause / Replay and a
   sound on-off button in the header, word highlight, spoken kit feedback.
   Clips are named by a hash of the exact text they say (audio/vo/<key>.mp3),
   so a screen whose text changed simply stays silent until it is regenerated.
   Manifest: audio/vo/vo.js -> window.SAA_VO_CLIPS = { key: { segs: [[s,e],...] } }
   ========================================================================== */
(function (win, doc) {
  'use strict';
  if (doc.getElementById('narration')) { return; }               /* game 1 has its own player */

  /* ---- the text that is spoken: same walk for generation and for the highlight ---- */
  var SKIP = 'button, input, select, textarea, label, svg, code, script, style, .saa-kit, .saa-work, [aria-hidden="true"], ' +
    '.kicker, .eyebrow, .saa-eyebrow, .q-kicker, .hero-kicker, .tag, .chip, .pill, .badge, .sr-only, .visually-hidden, ' +
    'nav, header, footer, .saa-prog, .saa-vo-skip, .topbar, .schema, .code, .mono, .pc-meta, .meta, .meta-foot, .card-meta, .topbar-sub, ' +
    '[class*="badge"], [class*="mandatory"], [class*="flag"], .saa-start, ' +
    /* live status lines and chats change while you play: they are not narration */
    '[aria-live], [role="status"], [role="log"], .chat, .chat-card, .phone-frame-outer, .result-placeholder';
  /* module codes and mapping lines are for staff, never read aloud */
  var META = /\bAAI-E-|Schema:|Mapped PC|Non-compensatory|\bPC \d\.\d|Mandatory\s*·|^\s*Swift AI Academy\.?\s*$/;
  /* games that build their screens in script (chats, one-stage labs) mark them:
     data-saa-page = a screen, data-saa-lead = the text to read on it, data-saa-say = chat lines that ARE read */
  var CTRL = 'button, input, select, textarea, svg, [aria-hidden="true"], .sr-only, .visually-hidden';
  function pages() {
    var marked = doc.querySelectorAll('[data-saa-page]');
    if (marked.length) { return Array.prototype.slice.call(marked); }
    return win.Deck ? win.Deck.slides : Array.prototype.slice.call(doc.querySelectorAll('section.page, section.slide, .step'));
  }
  function shown(e) { return !!(e && e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden'); }
  function current() {
    if (win.Deck && !doc.querySelector('[data-saa-page]')) { return win.Deck.current(); }
    return pages().filter(function (p) { return shown(p) && p.getBoundingClientRect().width > 2; })[0] || null;
  }
  function leadOf(page) {
    if (!page) { return null; }
    var l = page.querySelector('[data-saa-lead]') || page.querySelector('.saa-lead') || (win.Deck && page.querySelector('.head'));
    if (l && shown(l)) { return l; }
    /* a screen with no split (cover, wrap-up): read the whole screen; activities and labels are skipped */
    return page;
  }
  /* the sentence a word belongs to = its nearest box on screen (a label pill and its value are two sentences) */
  function blockOf(el, root) {
    for (var e = el; e && e !== root; e = e.parentElement) {
      var d = getComputedStyle(e).display;
      if (d !== 'inline' && d !== 'contents') { return e; }
      var p = e.parentElement;
      if (p && /flex|grid/.test(getComputedStyle(p).display)) { return e; }
    }
    return root;
  }
  function nodes(root) {
    var out = [], w = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), t;
    while ((t = w.nextNode())) {
      var par = t.parentElement;
      var say = par && par.closest('[data-saa-say]');
      var skip = say && root.contains(say) ? par.closest(CTRL) : par && par.closest(SKIP);
      if (!t.nodeValue.trim() || !par || skip || !shown(par)) { continue; }
      var blk = blockOf(par, root);
      if (blk && META.test(blk.textContent)) { continue; }
      out.push({ node: t, block: blk });
    }
    return out;
  }
  /* words: [{node, start, end, block}] */
  function words(root) {
    var ws = [];
    nodes(root).forEach(function (o) {
      var re = /\S+/g, m, v = o.node.nodeValue;
      while ((m = re.exec(v))) { ws.push({ node: o.node, start: m.index, end: m.index + m[0].length, block: o.block, text: m[0] }); }
    });
    /* a full stop or comma left on its own (after a highlighted or linked phrase) belongs to the word before it */
    ws.forEach(function (x, k) {
      var p = ws[k - 1];
      if (p && p.block === x.block && /^[.?!,;:]+["”’)]?$/.test(x.text) && /[\wÀ-￿]/.test(p.text)) { p.text += x.text; }
    });
    /* a "·" or "|" separator is not a word */
    return ws.filter(function (x) { return /[\wÀ-￿]/.test(x.text) && !/^[·|•–—\-]+$/.test(x.text); });
  }
  function textOf(ws) {
    var parts = [], cur = [];
    ws.forEach(function (x, k) {
      cur.push(x.text);
      var last = k === ws.length - 1 || ws[k + 1].block !== x.block;
      if (last) {
        var s = cur.join(' ').replace(/\s+/g, ' ').trim();
        if (s) { s = s.replace(/[:;,]$/, ''); if (!/[.?!]["”’)]?$/.test(s)) { s += '.'; } parts.push(s); }
        cur = [];
      }
    });
    return parts.join(' ');
  }
  /* FNV-1a over UTF-16 code units - tools/vo/hash.py does the same */
  function key(s) {
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return 'v' + ('0000000' + h.toString(16)).slice(-8);
  }
  function screenInfo(page) {
    var root = leadOf(page); if (!root) { return null; }
    var ws = words(root); if (!ws.length) { return null; }
    var t = textOf(ws);
    return { root: root, words: ws, text: t, key: key(t) };
  }
  var FB = '.saa-k-why';
  function fbTexts() {   /* every fixed kit message on every screen, for generation */
    var out = {};
    if (!doc.querySelector('.saa-kit')) { return out; }
    function add(s) { s = (s || '').replace(/\s+/g, ' ').trim(); if (s.length > 2) { out[key(s)] = s; } }
    Array.prototype.forEach.call(doc.querySelectorAll('.saa-kit [data-why], .saa-kit [data-hint], .saa-kit[data-done-text], .saa-kit [data-right], .saa-kit [data-wrong]'), function (e) {
      ['data-why', 'data-hint', 'data-done-text', 'data-right', 'data-wrong'].forEach(function (a) { add(e.getAttribute(a)); });
    });
    ['Yes, that is right.', 'Not quite. Try again.', 'All sorted. Well done.', 'Not that one. Read it again and try the other box.',
      'Yes. That is the right order.', 'Not yet. The red steps are in the wrong place.', 'All stamped. Well done.', 'Not quite. Read it again.', 'Yes.'].forEach(add);
    return out;
  }
  var seen = {};
  win.SAA_VO = { pages: pages, current: current, info: screenInfo, key: key, fbTexts: fbTexts, seen: seen };

  /* ---- player ---- */
  var CLIPS = null, audio = new Audio(), fb = new Audio(), started = false, auto = true, cur = null, timeline = null, raf = 0, lastWord = -2;
  audio.preload = 'auto';
  var HL = win.CSS && CSS.highlights && win.Highlight;
  var hiOn = HL ? new Highlight() : null, hiTodo = HL ? new Highlight() : null;
  if (HL) { CSS.highlights.set('saa-vo-on', hiOn); CSS.highlights.set('saa-vo-todo', hiTodo); }

  var ICON_PLAY = '<svg class="i-play" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var ICON_PAUSE = '<svg class="i-pause" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
  var ICON_ON = '<svg class="i-on" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  var ICON_OFF = '<svg class="i-off" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
  var box, listen, voice;
  function controls() {
    if (box) { return; }
    var head = doc.querySelector('.saa-header') || doc.querySelector('header.top') || doc.querySelector('header, .topbar');
    if (!head) { return; }
    box = doc.createElement('div'); box.className = 'saa-vo';
    box.innerHTML = '<button type="button" class="saa-vo-b saa-vo-listen" aria-label="Play narration">' + ICON_PLAY + ICON_PAUSE + '<span>Replay</span></button>' +
      '<button type="button" class="saa-vo-b icon saa-vo-voice" aria-pressed="true" aria-label="Auto-narration on. Tap to turn off">' + ICON_ON + ICON_OFF + '</button>';
    listen = box.firstChild; voice = box.lastChild;
    var right = head.querySelector('.saa-header-actions, .topbar-tools, .top-actions, .header-actions, .actions');
    var th = head.querySelector('.saa-theme-b');   /* the light/dark switch sits right of the narration buttons */
    if (th && th.parentNode) { th.parentNode.insertBefore(box, th); }
    else if (right && right.parentNode === head) { head.insertBefore(box, right); } else { head.appendChild(box); }
    listen.addEventListener('click', function () {
      started = true; stopFb();
      if (!cur || !cur.clip) { return; }
      if (audio.paused) { if (audio.ended) { audio.currentTime = 0; } play(); } else { audio.pause(); }
    });
    voice.addEventListener('click', function () {
      auto = !auto;
      voice.setAttribute('aria-pressed', auto ? 'true' : 'false');
      voice.setAttribute('aria-label', auto ? 'Auto-narration on. Tap to turn off' : 'Auto-narration off. Tap to turn on');
      if (!auto) { audio.pause(); stopFb(); }
    });
  }
  function label(t) { if (listen) { listen.querySelector('span').textContent = t; } }
  audio.addEventListener('play', function () { if (listen) { listen.classList.add('playing'); listen.setAttribute('aria-label', 'Pause narration'); } label('Pause'); });
  audio.addEventListener('pause', function () { if (listen) { listen.classList.remove('playing'); listen.setAttribute('aria-label', 'Play narration'); } label(audio.ended || audio.currentTime < 0.05 ? 'Replay' : 'Resume'); cancelAnimationFrame(raf); });
  audio.addEventListener('ended', function () { label('Replay'); clearHi(); });
  audio.addEventListener('playing', function () { startHi(); });
  function play() { var p = audio.play(); if (p && p.catch) { p.catch(function () { label('Replay'); }); } }

  /* ---- highlight (CSS Custom Highlight API: no DOM changes) ---- */
  function range(w) { var r = doc.createRange(); try { r.setStart(w.node, w.start); r.setEnd(w.node, w.end); } catch (e) { return null; } return r; }
  function clearHi() { cancelAnimationFrame(raf); lastWord = -2; if (HL) { hiOn.clear(); hiTodo.clear(); } }
  function buildTimeline(ws, segs, dur) {
    var wt = ws.map(function (o) { return o.text.replace(/[^\w’']/g, '').length + 1 + (/[,;]$/.test(o.text) ? 2 : 0); });
    var groups = [], g = [];
    ws.forEach(function (o, k) {
      g.push(k);
      var last = k === ws.length - 1 || ws[k + 1].block !== o.block;
      if (/[.?!]["”’)]?$/.test(o.text) || last) { groups.push(g); g = []; }
    });
    if (!segs || segs.length !== groups.length) {
      var tot = 0; wt.forEach(function (x) { tot += x; });
      var span = Math.max(0.5, dur - 0.4), acc = 0;
      segs = groups.map(function (gr) { var mine = 0; gr.forEach(function (k) { mine += wt[k]; }); var s = [0.15 + span * acc / tot, 0.15 + span * (acc + mine) / tot]; acc += mine; return s; });
    }
    var starts = new Array(ws.length);
    groups.forEach(function (gr, gi) {
      var seg = segs[gi], total = 0, a = 0;
      gr.forEach(function (k) { total += wt[k]; });
      gr.forEach(function (k) { starts[k] = seg[0] + (seg[1] - seg[0]) * a / total; a += wt[k]; });
    });
    return starts;
  }
  function tick() {
    if (!timeline || audio.paused || !cur) { return; }
    var t = audio.currentTime, c = -1;
    for (var k = 0; k < timeline.length; k++) { if (timeline[k] <= t) { c = k; } else { break; } }
    if (c !== lastWord) {
      lastWord = c;
      hiOn.clear(); hiTodo.clear();
      cur.words.forEach(function (w, k) { if (k >= c) { var r = range(w); if (r) { (k === c ? hiOn : hiTodo).add(r); } } });
    }
    raf = requestAnimationFrame(tick);
  }
  function startHi() {
    if (!HL || !cur || !cur.clip || !isFinite(audio.duration)) { return; }
    timeline = buildTimeline(cur.words, cur.clip.segs, audio.duration);
    lastWord = -2; cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  }

  /* ---- spoken feedback for the kits ---- */
  function stopFb() { fb.pause(); }
  function feedback(el) {
    var s = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!s || !started || !auto || !CLIPS) { return; }
    var k = key(s); if (!CLIPS[k]) { return; }
    audio.pause(); fb.pause(); fb.src = 'audio/vo/' + k + '.mp3';
    var p = fb.play(); if (p && p.catch) { p.catch(function () {}); }
  }

  /* ---- follow the game: a new screen (or new text on the same screen) loads its clip ---- */
  function sync() {
    var page = current(), info = page ? screenInfo(page) : null;
    if (info && cur && info.key === cur.key && page === cur.page) { return; }
    /* new screen or new question -> read it; same question with new state (answer checked, lane switched) -> wait for Replay */
    var fresh = !info || !cur || page !== cur.page || first(info.text) !== first(cur.text);
    audio.pause(); clearHi(); if (fresh) { stopFb(); }
    if (!info) { cur = null; if (box) { box.classList.add('none'); } return; }
    info.page = page; info.clip = CLIPS && CLIPS[info.key] || null; cur = info;
    seen[info.key] = info.text;
    if (box) { box.classList.toggle('none', !info.clip); }
    label('Replay');
    if (!info.clip) { audio.removeAttribute('src'); return; }
    audio.src = 'audio/vo/' + info.key + '.mp3';
    if (started && auto && fresh) { play(); }
  }
  function first(t) { return (t || '').split(/(?<=[.?!])\s/).slice(0, 2).join(' '); }
  var t = 0;
  function later() { clearTimeout(t); t = setTimeout(sync, 160); }

  function init() {
    controls();
    if (doc.getElementById('saa-start') || doc.getElementById('start')) {
      doc.addEventListener('click', function (e) {
        if (!started && e.target.closest && e.target.closest('.saa-go, #startBtn, .start-btn')) { started = true; setTimeout(sync, 650); setTimeout(function () { if (cur && cur.clip && audio.paused && auto) { play(); } }, 700); }
      }, true);
    }
    /* any tap is a user gesture: from then on clips may autoplay */
    doc.addEventListener('pointerdown', function () { if (!started && !doc.getElementById('saa-start')) { started = true; } }, true);
    if (win.MutationObserver) {
      new MutationObserver(function (ms) {
        for (var i = 0; i < ms.length; i++) {
          var tg = ms[i].target.nodeType === 1 ? ms[i].target : ms[i].target.parentElement;
          if (tg && tg.closest && tg.closest(FB) && ms[i].type !== 'attributes') { feedback(tg.closest(FB)); break; }
        }
        later();
      }).observe(doc.body, { attributes: true, attributeFilter: ['class', 'hidden', 'style'], subtree: true, childList: true, characterData: true });
    }
    later();
  }
  function load() {
    var s = doc.createElement('script'); s.src = 'audio/vo/vo.js';
    s.onload = function () { CLIPS = win.SAA_VO_CLIPS || {}; cur = null; later(); };
    s.onerror = function () { CLIPS = {}; if (box) { box.classList.add('none'); } };
    doc.head.appendChild(s);
  }
  function boot() { load(); setTimeout(init, 60); }
  if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', boot); } else { boot(); }
})(window, document);
