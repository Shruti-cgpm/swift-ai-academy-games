/* Swift AI Academy - activity frame upgrade layer (family A: Deck games). Loaded AFTER script.js. */
(function (win, doc) {
  'use strict';
  var D = win.Deck;
  if (!D) { return; }

  /* 1. layout: split a card into head (left) / activity (right) when it has both */
  function splitCards(root) {
    var cards = (root || doc).querySelectorAll('.slide .card');
    Array.prototype.forEach.call(cards, function (c) {
      if (c.classList.contains('saa-split') || c.hasAttribute('data-saa-single')) { return; }
      var kids = Array.prototype.filter.call(c.children, function (k) { return !/^(SCRIPT|STYLE)$/.test(k.tagName); });
      var head = c.querySelector(':scope > .head');
      if (head && kids.length >= 2 && !c.classList.contains('quiz')) {
        var lead = doc.createElement('div'), work = doc.createElement('div');
        lead.className = 'saa-lead'; work.className = 'saa-work';
        c.insertBefore(lead, head); lead.appendChild(head);
        kids.forEach(function (k) { if (k !== head) { work.appendChild(k); } });
        c.appendChild(work);
        c.classList.add('saa-split');
      }
    });
  }

  /* 2. type size: bigger than the old 13-17px, still shrinks until the card fits */
  D.fit = function () {
    var s = this.current();
    if (!s) { return; }
    var card = s.querySelector('.card') || s.firstElementChild;
    if (!card) { return; }
    var root = doc.documentElement, w = win.innerWidth, h = win.innerHeight;
    card.classList.remove('scroll');
    /* phones: a readable 15px and the card scrolls - never shrink the text to fit */
    if (w <= 760) { root.style.fontSize = '15px'; if (this.overflows(card)) { card.classList.add('scroll'); } return; }
    var size = Math.max(14, Math.min(24, Math.min(h / 36, w / 62)));
    root.style.fontSize = size + 'px';
    if (this.overflows(card)) {
      /* find the largest size that fits in a few steps (12px floor), instead of 0.5px at a time */
      var lo = 12, hi = size;
      for (var i = 0; i < 6; i++) { var mid = (lo + hi) / 2; root.style.fontSize = mid + 'px'; if (this.overflows(card)) { hi = mid; } else { lo = mid; } }
      root.style.fontSize = Math.floor(lo * 2) / 2 + 'px';
      if (this.overflows(card)) { card.classList.add('scroll'); }
    }
  };

  /* 3. idle nudge: after 5 s of no activity, glow what the student should do next */
  var idleT = 0;
  function targets() {
    var s = D.current(); if (!s) { return []; }
    var prim = doc.getElementById('primary');
    var list = [];
    if (prim && !prim.disabled && prim.getAttribute('aria-disabled') !== 'true' && !prim.classList.contains('saa-locked') && prim.offsetParent) { list.push(prim); }
    if (prim && (prim.disabled || prim.getAttribute('aria-disabled') === 'true')) {
      list = Array.prototype.slice.call(s.querySelectorAll('.opt:not(.picked):not(.locked), .select, textarea, input[type=text]'));
      list = list.filter(function (e) { return e.offsetParent && !(e.value); });
    }
    return list;
  }
  function clearNudge() { Array.prototype.forEach.call(doc.querySelectorAll('.saa-nudge'), function (e) { e.classList.remove('saa-nudge'); }); }
  function arm() { clearTimeout(idleT); clearNudge(); idleT = setTimeout(function () { targets().forEach(function (e) { e.classList.add('saa-nudge'); }); }, 5000); }
  ['pointerdown', 'keydown', 'input', 'touchstart', 'wheel'].forEach(function (ev) { doc.addEventListener(ev, arm, true); });

  /* re-run after every slide change */
  var go = D.go;
  /* screens that are not showing can never be tapped or focused, whatever a kit's CSS makes visible inside them */
  function inertOthers() { var c = D.current(); (D.slides || []).forEach(function (s) { if (s !== c) { s.setAttribute('inert', ''); } else { s.removeAttribute('inert'); } }); }
  /* focus follows the new screen: its heading, when focus was left behind on a hidden screen */
  function focusNew() {
    var c = D.current(), a = doc.activeElement;
    if (!c || (a && a !== doc.body && c.contains(a))) { return; }
    if (a && a !== doc.body && !a.closest('[inert]')) { return; }        /* focus is somewhere useful (e.g. the footer): leave it */
    var h = c.querySelector('h1, h2, h3');
    if (h) { if (!h.hasAttribute('tabindex')) { h.setAttribute('tabindex', '-1'); } try { h.focus({ preventScroll: true }); } catch (e) {} }
  }
  D.go = function () { var r = go.apply(this, arguments); splitCards(); arm(); D.fit(); inertOthers(); focusNew(); return r; };
  splitCards();
  D.fit();
  inertOthers();
  /* games that change screens without Deck.go: follow the slides' own classes too */
  if (win.MutationObserver && D.slides && D.slides.length) {
    var io = new MutationObserver(function () { inertOthers(); });
    D.slides.forEach(function (s) { io.observe(s, { attributes: true, attributeFilter: ['class', 'hidden', 'aria-hidden'] }); });
  }
  arm();
  win.addEventListener('resize', function () { D.fit(); });
  /* typing can grow a card (long answers, live previews): re-fit shortly after, only if it now overflows */
  var typeT = 0;
  doc.addEventListener('input', function () {
    clearTimeout(typeT);
    typeT = setTimeout(function () {
      var s = D.current(), card = s && (s.querySelector('.card') || s.firstElementChild);
      if (card && D.overflows(card)) { D.fit(); }
    }, 350);
  }, true);
})(window, document);
