/* Swift AI Academy - activity frame upgrade layer (families B/C and one-offs). Loaded AFTER script.js. */
(function (win, doc) {
  'use strict';
  var root = doc.documentElement;

  /* 1. proportional scale: designed for ~980x640, grows with the window up to 1.7x, never below 1x.
        It then backs off in small steps until the current page fits, and re-checks on every page change. */
  var Z = 1, fitT = 0;
  function setZ(z) { Z = z; root.style.setProperty('--z', z.toFixed(3)); }
  function activePage() {
    return doc.querySelector('.page.active, .slide.active, .slide.show, section.page.show, section.active');
  }
  function overflows() {
    var els = [activePage(), doc.querySelector('.stage'), doc.querySelector('.app')];
    return els.some(function (e) { return e && e.scrollHeight - e.clientHeight > 2; });
  }
  function fit() {
    var w = win.innerWidth, h = win.innerHeight;
    var z = w <= 700 ? 1 : Math.max(1, Math.min(w / 980, h / 640, 1.7));
    setZ(z);
    var guard = 0;
    while (z > 1 && overflows() && guard++ < 30) { z = Math.max(1, z - 0.04); setZ(z); }
  }
  function soon() { clearTimeout(fitT); fitT = setTimeout(fit, 60); }
  fit();
  win.addEventListener('resize', soon);
  if (win.MutationObserver) {
    new MutationObserver(soon).observe(doc.body, { attributes: true, attributeFilter: ['class', 'hidden'], subtree: true, childList: true });
  }
  if (doc.fonts && doc.fonts.ready) { doc.fonts.ready.then(fit); }

  /* 2. idle nudge: after 5 s with no activity glow the primary action, or the unanswered options */
  var idleT = 0;
  function visible(e) { return e && e.offsetParent !== null; }
  function targets() {
    var page = doc.querySelector('.page.active, .slide.active, .slide.show, section.active') || doc.body;
    var prim = doc.querySelector('.nav-btn.primary, .btn-primary, button.primary, #primary, .cta');
    if (prim && !prim.disabled && visible(prim)) { return [prim]; }
    var opts = Array.prototype.slice.call(page.querySelectorAll('.opt:not(.picked):not(.locked):not([disabled]), .choice:not(.picked), textarea, input[type=text]'));
    return opts.filter(function (e) { return visible(e) && !e.value; }).slice(0, 8);
  }
  function clearNudge() { Array.prototype.forEach.call(doc.querySelectorAll('.saa-nudge'), function (e) { e.classList.remove('saa-nudge'); }); }
  function arm() { clearTimeout(idleT); clearNudge(); idleT = setTimeout(function () { targets().forEach(function (e) { e.classList.add('saa-nudge'); }); }, 5000); }
  ['pointerdown', 'keydown', 'input', 'touchstart', 'wheel', 'click'].forEach(function (ev) { doc.addEventListener(ev, arm, true); });
  arm();
})(window, document);
