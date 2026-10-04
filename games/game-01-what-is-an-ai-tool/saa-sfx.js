
/* ==========================================================================
   SOUND EFFECTS (all games): a soft click on taps, a gentle rising chime for a
   right answer, a soft low fall for a wrong one. Made with Web Audio (no files).
   They follow the header sound button: when narration sound is off, effects are off.
   A right / wrong sound plays only when a game marks an answer within a moment of
   the learner's own tap, never on page load or when an answered screen is shown again.
   ========================================================================== */
(function (win, doc) {
  'use strict';
  if (win.SAA_SFX) { return; }
  var AC = win.AudioContext || win.webkitAudioContext;
  if (!AC) { return; }
  var ctx = null, master = null, lastTap = 0, lastTapBack = false, lastFx = 0;

  function on() {
    var v = doc.querySelector('.saa-vo-voice, #voice');
    return !(v && v.getAttribute('aria-pressed') === 'false');
  }
  function ready() {
    if (!ctx) { ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination); }
    if (ctx.state === 'suspended') { ctx.resume(); }
    return ctx;
  }
  /* one soft note: sine body + a quiet octave, quick attack, smooth decay */
  function note(freq, at, len, vol, type, lp) {
    var t = ctx.currentTime + at, o = ctx.createOscillator(), g = ctx.createGain(), out = g;
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g);
    if (lp) { var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; g.connect(f); out = f; }
    out.connect(master);
    o.start(t); o.stop(t + len + 0.05);
  }
  var SFX = {
    click: function () {
      if (!on() || !ready()) { return; }
      var t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(1250, t); o.frequency.exponentialRampToValueAtTime(620, t + 0.045);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.055, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.08);
    },
    correct: function () {
      if (!on() || !ready() || Date.now() - lastFx < 350) { return; }
      lastFx = Date.now();
      note(880.00, 0, 0.32, 0.11); note(1760.0, 0, 0.18, 0.02);        /* A5 */
      note(1318.5, 0.09, 0.45, 0.11); note(2637.0, 0.09, 0.22, 0.018); /* E6 */
    },
    wrong: function () {
      if (!on() || !ready() || Date.now() - lastFx < 350) { return; }
      lastFx = Date.now();
      note(329.63, 0, 0.20, 0.10, 'triangle', 1400);    /* E4 */
      note(261.63, 0.12, 0.30, 0.10, 'triangle', 1100); /* C4 */
    }
  };
  win.SAA_SFX = SFX;

  /* taps on things you can press */
  var TAP = 'button, a[href], [role="button"], [role="radio"], [role="checkbox"], [role="tab"], [role="option"], input[type="checkbox"], input[type="radio"], label, select, summary, .saa-chip, .opt, .choice, .saa-m-item, .saa-m-target, .saa-d-pos';
  doc.addEventListener('pointerdown', function (e) {
    var el = e.target.closest && e.target.closest(TAP);
    lastTap = Date.now();
    lastTapBack = !!(el && (/^\s*(Back|Previous)\s*$/i.test(el.textContent || '') || el.classList.contains('saa-back')));
    if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') { return; }
    if (el.closest('.saa-vo, .saa-theme-b, #listen, #voice')) { ready(); return; }  /* narration buttons: no click over the voice */
    SFX.click();
  }, true);
  doc.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { lastTap = Date.now(); lastTapBack = false; } }, true);

  /* right / wrong: a game or kit marks an answer just after the learner acted */
  var RIGHT = /(^|\s)(right|correct|is-correct|is-right|is-ok|good|hit|saa-bin-hit|pass|success|saa-match)(\s|$)/;
  var WRONG = /(^|\s)(wrong|incorrect|is-incorrect|is-wrong|is-bad|bad|miss|fail)(\s|$)/;   /* a shake is a nudge, not an answer: kits play their own wrong sound */
  function judge(el, old) {
    var now = (el.getAttribute && el.getAttribute('class')) || '';
    if (el.closest && el.closest('.saa-vo, header, nav.saa-navrow, footer')) { return 0; }
    if (el.classList && el.classList.contains('saa-kit')) { return 0; }   /* the whole activity shakes when Next is pressed too early: a nudge, not a wrong answer */
    var gainedR = RIGHT.test(now) && !RIGHT.test(old || ''), gainedW = WRONG.test(now) && !WRONG.test(old || '');
    return gainedW ? -1 : (gainedR ? 1 : 0);
  }
  function play(v) {
    if (!v) { return; }
    if (v < 0) { SFX.wrong(); } else { SFX.correct(); }   /* the 350ms guard lives in correct()/wrong(), so direct calls from games are guarded too */
  }
  if (win.MutationObserver) {
    new MutationObserver(function (ms) {
      if (Date.now() - lastTap > 1500) { return; }
      var v = 0;
      ms.forEach(function (m) {
        if (m.type === 'attributes') { var r = judge(m.target, m.oldValue); if (r < 0) { v = -1; } else if (r > 0 && v === 0) { v = 1; } }
        else if (!lastTapBack) {   /* a feedback bubble or answer drawn fresh by the game (chat games) */
          Array.prototype.forEach.call(m.addedNodes, function (n) {
            if (n.nodeType !== 1 || !n.getAttribute) { return; }
            var c = n.getAttribute('class') || '';
            if (/(^|\s)(fb|feedback|msg|bubble|result|verdict)/.test(c) || n.matches('[role="status"], [aria-live]')) {
              if (WRONG.test(c)) { v = -1; } else if (RIGHT.test(c) && v === 0) { v = 1; }
            }
          });
        }
      });
      play(v);
    }).observe(doc.body, { attributes: true, attributeFilter: ['class'], attributeOldValue: true, subtree: true, childList: true });
  }
})(window, document);
