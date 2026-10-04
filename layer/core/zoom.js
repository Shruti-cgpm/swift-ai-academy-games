/* Swift AI Academy - activity frame upgrade layer (families B/C and one-offs). Loaded AFTER script.js. */
(function (win, doc) {
  'use strict';
  var root = doc.documentElement;

  /* 1. proportional scale: designed for ~980x640, grows with the window up to 1.7x, never below 1x.
        It then backs off in small steps until the current page fits, and re-checks on every page change. */
  var Z = 1, fitT = 0;
  function setZ(z) { Z = z; root.style.setProperty('--z', z.toFixed(3)); }
  function activePage() {
    var all = doc.querySelectorAll('section.page, section.slide, .step');
    for (var i = 0; i < all.length; i++) { if (all[i].offsetParent !== null) { return all[i]; } }
    return null;
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
  /* 1a. phones: the screen height is fixed, so the area between header and footer scrolls
         (the header and the Back / Next footer stay in place, like an app) */
  function cl(e, c, on) { if (e.classList.contains(c) !== on) { e.classList.toggle(c, on); } }
  function phoneScroll() {
    var app = doc.querySelector('.app'), pg = activePage(), on = win.innerWidth <= 700;
    var zone = null, path = [];
    if (on && app && pg && app.contains(pg)) {
      zone = pg;
      while (zone.parentElement && zone.parentElement !== app) { path.push(zone); zone = zone.parentElement; }
      if (zone.parentElement !== app) { zone = null; path = []; }
    }
    Array.prototype.forEach.call(doc.querySelectorAll('.saa-scrollzone'), function (e) { if (e !== zone) { cl(e, 'saa-scrollzone', false); } });
    Array.prototype.forEach.call(doc.querySelectorAll('.saa-scrollpath'), function (e) { if (path.indexOf(e) < 0) { cl(e, 'saa-scrollpath', false); } });
    if (zone) { cl(zone, 'saa-scrollzone', true); path.forEach(function (e) { cl(e, 'saa-scrollpath', true); }); }
    if (app) { cl(app, 'saa-phone', !!zone); }
  }
  function soon() { clearTimeout(fitT); fitT = setTimeout(function () { fit(); phoneScroll(); }, 60); }
  fit();
  win.addEventListener('resize', soon);
  if (win.MutationObserver) {
    new MutationObserver(soon).observe(doc.body, { attributes: true, attributeFilter: ['class', 'hidden'], subtree: true, childList: true });
  }
  if (doc.fonts && doc.fonts.ready) { doc.fonts.ready.then(fit); }

  /* 1b. left / right: heading and intro on the LEFT, the activity on the RIGHT */
  var LEADTAG = /^(P|H1|H2|H3|H4|HEADER|SMALL|SPAN)$/;
  var LEADCLS = /(^|\s)(kicker|eyebrow|saa-eyebrow|lede|title|sub|subtitle|meta|head|intro|tagline|code|page-title|page-sub)(\s|$)/;
  var BLOCKCLS = /(panel|grid|card|callout|list|chip|frame|chat|tile|row|box|strip|stepper|tabs|track)/;
  function kids(e) { return Array.prototype.filter.call(e.children, function (k) { return !/^(SCRIPT|STYLE|TEMPLATE)$/.test(k.tagName); }); }
  function interactive(e) { return e.matches('button, a[href], input, select, textarea') || !!e.querySelector('button, a[href], input, select, textarea, [role=button]'); }
  function leadish(e) {
    if (interactive(e)) { return false; }
    var c = (e.className && e.className.baseVal === undefined) ? e.className : '';
    if (BLOCKCLS.test(c) && !LEADCLS.test(c)) { return false; }
    return LEADTAG.test(e.tagName) || LEADCLS.test(c) || (e.tagName === 'DIV' && /head/.test(c));
  }
  function hasHeading(e) { return e.matches('h1, h2, h3, .title') || !!e.querySelector('h1, h2, h3, .title'); }
  function splitPage(pg) {
    if (!pg || pg.getAttribute('data-saa-split')) { return; }
    pg.setAttribute('data-saa-split', 'no');
    var c = pg;
    for (var d = 0; d < 3; d++) {
      var k1 = kids(c);
      if (k1.length === 1 && k1[0].tagName === 'DIV' && !/(frame|chat|phone)/.test(k1[0].className)) { c = k1[0]; } else { break; }
    }
    var ks = kids(c);
    if (ks.length < 2) { return; }
    /* never turn the page element itself into a grid (that would override the game's show/hide) */
    if (c === pg) {
      var inner = doc.createElement('div');
      inner.className = 'saa-inner';
      pg.insertBefore(inner, ks[0]);
      ks.forEach(function (e) { inner.appendChild(e); });
      c = inner;
    }
    var lead = [];
    for (var i = 0; i < ks.length && leadish(ks[i]); i++) { lead.push(ks[i]); }
    if (!lead.length || lead.length === ks.length || !lead.some(hasHeading)) { return; }
    var leadText = lead.map(function (e) { return e.textContent; }).join(' ').length;
    if (leadText > 700) { return; }
    var L = doc.createElement('div'), W = doc.createElement('div');
    L.className = 'saa-lead'; W.className = 'saa-work';
    c.insertBefore(L, lead[0]);
    lead.forEach(function (e) { L.appendChild(e); });
    ks.slice(lead.length).forEach(function (e) { W.appendChild(e); });
    c.appendChild(W);
    c.classList.add('saa-split');
    pg.setAttribute('data-saa-split', 'yes');
    /* anything the game adds to this container later goes to the right-hand side */
    if (win.MutationObserver) {
      new MutationObserver(function (ms) {
        ms.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1 && n !== L && n !== W && n.parentNode === c) { W.appendChild(n); } }); });
      }).observe(c, { childList: true });
    }
  }
  function splitAll() { Array.prototype.forEach.call(doc.querySelectorAll('section.page, section.slide'), splitPage); }
  splitAll();
  phoneScroll();
  fit();

  /* 2. idle nudge: after 5 s with no activity glow the primary action, or the unanswered options */
  var idleT = 0;
  function visible(e) { return e && e.offsetParent !== null; }
  function targets() {
    var page = doc.querySelector('.page.active, .slide.active, .slide.show, section.active') || doc.body;
    var prim = doc.querySelector('.nav-btn.primary, .btn-primary, button.primary, #primary, .cta');
    var locked = prim && (prim.disabled || prim.getAttribute('aria-disabled') === 'true' || prim.classList.contains('saa-locked'));
    if (prim && !locked && visible(prim)) { return [prim]; }   /* never glow a locked Next */
    var opts = Array.prototype.slice.call(page.querySelectorAll('.opt:not(.picked):not(.locked):not([disabled]), .choice:not(.picked), textarea, input[type=text]'));
    return opts.filter(function (e) { return visible(e) && !e.value; }).slice(0, 8);
  }
  function clearNudge() { Array.prototype.forEach.call(doc.querySelectorAll('.saa-nudge'), function (e) { e.classList.remove('saa-nudge'); }); }
  function arm() { clearTimeout(idleT); clearNudge(); idleT = setTimeout(function () { targets().forEach(function (e) { e.classList.add('saa-nudge'); }); }, 5000); }
  ['pointerdown', 'keydown', 'input', 'touchstart', 'wheel', 'click'].forEach(function (ev) { doc.addEventListener(ev, arm, true); });
  arm();
})(window, document);
