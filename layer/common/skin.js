
/* ==========================================================================
   SKIN: make every dark game look like game 1 (header, card, type, footer)
   ========================================================================== */
(function (win, doc) {
  'use strict';
  function lum(c) { var m = (c || '').match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/); if (!m || (m[4] !== undefined && +m[4] < 0.2)) { return null; } return (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255; }
  function isDark() {
    var els = [doc.querySelector('.app'), doc.body, doc.documentElement];
    for (var i = 0; i < els.length; i++) { if (!els[i]) { continue; } var l = lum(getComputedStyle(els[i]).backgroundColor); if (l !== null) { return l < 0.4; } }
    return true;   /* a background image (gradient) with no colour: the dark frame */
  }
  function txt(e) { return e ? e.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function visible(e) { return !!(e && e.offsetParent !== null && e.getBoundingClientRect().width > 2); }
  var SECTIONS = { 1: 'First Contact', 2: 'Framing and Refining', 3: 'Check Before You Use' };
  function pages() { return win.Deck ? win.Deck.slides : Array.prototype.slice.call(doc.querySelectorAll('section.page, section.slide, .step')); }

  function header() {
    var h = doc.querySelector('.saa-header, header.top');
    if (!h || h.querySelector('.saa-hd-brand')) { return; }
    /* title = the game's own title (as on the start screen); eyebrow = the section name, like "FIRST CONTACT" */
    var startH = doc.getElementById('saa-start-title');
    var cover = pages()[0];
    var dt = (doc.title || '').replace(/\s*[—·|-]\s*Swift AI Academy\s*$/i, '').trim();
    var title = dt || txt(startH) || txt(cover && cover.querySelector('h1, h2, .title'));
    var meta = txt(doc.querySelector('.top-meta'));
    var eb = meta.indexOf('·') > -1 ? meta.split('·').pop().trim() : '';
    if (!eb) { var m = (doc.body.textContent.match(/AAI-E-MC1-S0(\d)/) || [])[1]; eb = SECTIONS[m] || ''; }
    var logo = h.querySelector('.saa-brand img, .brand .brand-mark, img[src*="logo"]');
    var brand = doc.createElement('div'); brand.className = 'saa-hd-brand';
    if (logo) { var l = logo.cloneNode(true); l.removeAttribute('id'); brand.appendChild(l); }
    brand.insertAdjacentHTML('beforeend', '<span class="saa-wm"><span class="n">Swift AI</span><span class="s">Academy</span></span>');
    var ttl = doc.createElement('div'); ttl.className = 'saa-hd-ttl';
    ttl.innerHTML = (eb ? '<p class="saa-hd-eb"></p>' : '') + '<p class="saa-hd-h"></p>';
    if (eb) { ttl.querySelector('.saa-hd-eb').textContent = eb; }
    ttl.querySelector('.saa-hd-h').textContent = title;
    h.insertBefore(ttl, h.firstChild); h.insertBefore(brand, ttl);
  }

  /* which page is current, read from the GAME's own markers (never from visibility, which our own CSS changes) */
  function currentPage(list) {
    var marks = ['active', 'show', 'is-active', 'current', 'on'];
    for (var i = 0; i < marks.length; i++) {
      var withMark = list.filter(function (p) { return p.classList.contains(marks[i]); });
      if (withMark.length) { return withMark[0]; }
    }
    var shown = list.filter(function (p) { return !p.hasAttribute('hidden') && getComputedStyle(p).display !== 'none'; });
    return shown.length === 1 ? shown[0] : (shown[0] || null);
  }
  function cl(e, c, on) { if (on === undefined) { on = true; } if (e.classList.contains(c) !== !!on) { e.classList.toggle(c, !!on); } }
  function surfaces() {
    var list = pages();
    var cur = win.Deck ? null : currentPage(list);
    /* persistent card around all pages (Reading S02, Request Builder) */
    Array.prototype.forEach.call(doc.querySelectorAll('.app > main.saa-card, .app > main.card'), function (m) { cl(m, 'saa-surface'); });
    list.forEach(function (p) {
      var isCur = p === cur;
      cl(p, 'saa-cur', isCur);
      if (p.closest('.saa-surface') && !p.classList.contains('saa-surface')) { return; }
      var c = Array.prototype.filter.call(p.children, function (k) { return k.classList.contains('card'); })[0];
      if (c) { cl(c, 'saa-surface'); return; }
      /* a page with no card of its own becomes the card - but only while it is the current page */
      var pageSurface = isCur && !p.querySelector('.chat, .phone-frame-outer, .chat-card') && !win.Deck;
      cl(p, 'saa-surface', pageSurface);
    });
  }

  function navButtons() {
    Array.prototype.forEach.call(doc.querySelectorAll('footer button, .deck-foot button, .nav-row button, .foot button, .slide-footer button'), function (b) {
      var t = (b.innerText || b.textContent || '').trim();
      if (!t || b.classList.contains('nav-circle')) { return; }
      cl(b, 'saa-navtxt');
      var back = /back|previous|prev/i.test(t + ' ' + b.id + ' ' + b.className.replace(/saa-\S+/g, '')) && !/primary/.test(b.className);
      cl(b, 'saa-back', back);
      /* the row that holds the nav buttons: Back left, Next right */
      var row = b.parentElement;
      while (row && getComputedStyle(row).display === 'contents') { row = row.parentElement; }
      if (row && !row.matches('footer.bar, .slide-footer')) { cl(row, 'saa-navrow'); }
    });
  }

  /* light / dark switch: only for games that declare both themes (<html data-saa-themes data-theme="dark">).
     The game's CSS styles html[data-theme="dark"] and html[data-theme="light"]; the choice is remembered. */
  var root = doc.documentElement, THEMED = root.hasAttribute('data-saa-themes');
  function store(v) { try { if (v) { localStorage.setItem('saa-theme', v); } return localStorage.getItem('saa-theme'); } catch (e) { return null; } }
  if (THEMED) { var pref = store(); if (pref === 'light' || pref === 'dark') { root.setAttribute('data-theme', pref); } }
  var ICON_SUN = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var ICON_MOON = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  function themeButton() {
    var h = doc.querySelector('.saa-header') || doc.querySelector('header.top') || doc.querySelector('header, .topbar');
    if (!h || h.querySelector('.saa-theme-b')) { return; }
    var b = doc.createElement('button'); b.type = 'button'; b.className = 'saa-vo-b icon saa-theme-b';
    function paint() {
      var dark = root.getAttribute('data-theme') !== 'light';
      b.innerHTML = dark ? ICON_SUN : ICON_MOON;
      b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      b.title = dark ? 'Light mode' : 'Dark mode';
    }
    b.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next); store(next);
      cl(root, 'saa-skin', next === 'dark'); paint();
      win.dispatchEvent(new CustomEvent('saa:theme', { detail: next }));
    });
    paint();
    var vo = h.querySelector('.saa-vo');
    if (vo && vo.parentNode) { vo.parentNode.insertBefore(b, vo.nextSibling); } else { h.appendChild(b); }
  }

  var t = 0;
  function apply() { clearTimeout(t); t = setTimeout(function () { surfaces(); navButtons(); if (THEMED) { themeButton(); } }, 40); }
  function init() {
    if (THEMED) { themeButton(); }
    if (!THEMED && !isDark()) { return; }
    if (!THEMED || root.getAttribute('data-theme') !== 'light') { root.classList.add('saa-skin'); }
    header(); surfaces(); navButtons();
    if (win.MutationObserver) { new MutationObserver(apply).observe(doc.body, { attributes: true, attributeFilter: ['class', 'hidden'], subtree: true, childList: true }); }
  }
  if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', function () { setTimeout(init, 0); }); } else { setTimeout(init, 0); }
})(window, document);
