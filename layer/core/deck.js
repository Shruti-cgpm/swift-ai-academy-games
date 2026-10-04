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
    var size = w <= 760 ? 15 : Math.max(14, Math.min(24, Math.min(h / 36, w / 62)));
    var guard = 0;
    card.classList.remove('scroll');
    root.style.fontSize = size + 'px';
    while (this.overflows(card) && size > 12 && guard++ < 60) {
      size -= 0.5;
      root.style.fontSize = size + 'px';
    }
    if (this.overflows(card)) { card.classList.add('scroll'); }
  };

  /* 3. idle nudge: after 5 s of no activity, glow what the student should do next */
  var idleT = 0;
  function targets() {
    var s = D.current(); if (!s) { return []; }
    var prim = doc.getElementById('primary');
    var list = [];
    if (prim && !prim.disabled && prim.offsetParent) { list.push(prim); }
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
  D.go = function () { var r = go.apply(this, arguments); splitCards(); arm(); D.fit(); return r; };
  splitCards();
  D.fit();
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
