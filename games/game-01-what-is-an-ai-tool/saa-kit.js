/* ==========================================================================
   Swift AI Academy - interaction kit. Markup-driven: <div class="saa-kit" data-kit="..."> ... </div>
   Kits: reveal | quick | sort | order | spot | stamp.   data-required on a kit = Next is locked until it is done.
   sort + data-style="deck": one card at a time (flick / drag / tap a box / arrow keys); same data, feedback and saa:done.
   Every kit: works with tap and keyboard; sort and order also drag (mouse + touch); one-sentence feedback.
   ========================================================================== */
(function (win, doc) {
  'use strict';
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function el(tag, cls, txt) { var e = doc.createElement(tag); if (cls) { e.className = cls; } if (txt != null) { e.textContent = txt; } return e; }
  function shake(e) { e.classList.remove('saa-shake'); void e.offsetWidth; e.classList.add('saa-shake'); }
  function done(k) {
    if (k.classList.contains('is-done')) { return; }
    k.classList.add('is-done'); k.setAttribute('data-done', '1');
    try { k.dispatchEvent(new CustomEvent('saa:done', { bubbles: true })); } catch (e) {}
  }
  function why(k) { var w = $('.saa-k-why', k); if (!w) { w = el('p', 'saa-k-why'); w.setAttribute('aria-live', 'polite'); k.appendChild(w); } return w; }
  function say(k, text, ok) { var w = why(k); w.textContent = text || ''; w.className = 'saa-k-why' + (ok === true ? ' ok' : ok === false ? ' bad' : ''); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- reveal: flip cards, or scratch cards (data-style="scratch") ---------- */
  function reveal(k) {
    var cards = $$('.saa-card', k), scratch = k.getAttribute('data-style') === 'scratch';
    var st = el('p', 'saa-k-status'); k.insertBefore(st, k.firstChild);
    function count() {
      var n = $$('.saa-card.open', k).length; st.textContent = n + ' of ' + cards.length + ' opened';
      if (n === cards.length) { done(k); }
    }
    cards.forEach(function (c) {
      var f = $('.saa-front', c), b = $('.saa-back', c);
      var inner = el('span', 'saa-card-in'); c.insertBefore(inner, f); inner.appendChild(f); inner.appendChild(b);
      c.setAttribute('aria-expanded', 'false');
      function open() { if (c.classList.contains('open')) { return; } c.classList.add('open'); c.setAttribute('aria-expanded', 'true'); count(); }
      if (scratch) {
        c.classList.add('scratch');
        var cv = doc.createElement('canvas'); c.appendChild(cv);
        var ctx = cv.getContext('2d'), drawing = false, moves = 0;
        function paint() {
          var r = c.getBoundingClientRect(); cv.width = Math.max(10, r.width); cv.height = Math.max(10, r.height);
          var g = ctx.createLinearGradient(0, 0, cv.width, cv.height); g.addColorStop(0, '#2B3A7A'); g.addColorStop(1, '#3C59F6');
          ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height);
          ctx.fillStyle = '#F6F4EF'; ctx.font = '700 15px "Instrument Sans", sans-serif'; ctx.textBaseline = 'middle';
          ctx.fillText(f.textContent, 16, cv.height / 2 - 9);
          ctx.fillStyle = '#B8C4FF'; ctx.font = '700 11px "Instrument Sans", sans-serif'; ctx.fillText('SCRATCH OR TAP', 16, cv.height / 2 + 13);
        }
        function cleared() {
          var d = ctx.getImageData(0, 0, cv.width, cv.height).data, clear = 0, step = 40;
          for (var i = 3; i < d.length; i += 4 * step) { if (d[i] === 0) { clear++; } }
          return clear / (d.length / (4 * step));
        }
        function scratchAt(e) {
          var r = cv.getBoundingClientRect(); ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath(); ctx.arc(e.clientX - r.left, e.clientY - r.top, 22, 0, Math.PI * 2); ctx.fill();
          if (++moves % 6 === 0 && cleared() > 0.4) { open(); }
        }
        setTimeout(paint, 30); win.addEventListener('resize', function () { if (!c.classList.contains('open')) { paint(); } });
        var downAt = 0;
        cv.addEventListener('pointerdown', function (e) { drawing = true; downAt = Date.now(); moves = 0; try { cv.setPointerCapture(e.pointerId); } catch (x) {} scratchAt(e); });
        cv.addEventListener('pointermove', function (e) { if (drawing) { scratchAt(e); e.preventDefault(); } });
        cv.addEventListener('pointerup', function () { drawing = false; if (moves < 3 && Date.now() - downAt < 400) { open(); } });
        c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      } else {
        c.addEventListener('click', open);
      }
    });
    count();
  }

  /* ---------- quick check: one question, instant feedback, try again ---------- */
  function quick(k) {
    var opts = $$('.saa-k-opt', k), w = $('.saa-k-why', k) || why(k);
    var right = w.getAttribute('data-right') || 'Yes, that is right.', wrong = w.getAttribute('data-wrong') || 'Not quite. Try again.';
    if (k.hasAttribute('data-shuffle')) { var box = opts[0].parentNode; shuffle(opts.slice()).forEach(function (o) { box.appendChild(o); }); }
    opts.forEach(function (o) {
      o.addEventListener('click', function () {
        if (k.classList.contains('is-done')) { return; }
        if (o.hasAttribute('data-ok')) {
          o.classList.add('right'); say(k, o.getAttribute('data-why') || right, true);
          opts.forEach(function (x) { x.disabled = true; }); done(k);
        } else {
          o.classList.add('wrong'); o.disabled = true; shake(o); say(k, o.getAttribute('data-why') || wrong, false);
        }
      });
    });
  }

  /* ---------- sort, data-style="deck": one card at a time (Flick to Sort). Flick / drag the top card to a box,
     or tap a box, or use the arrow keys (two boxes) / Enter on a box. Same data-bin / data-why / data-hint / data-done-text. ---------- */
  function sortDeck(k) {
    var pool = $('.saa-pool', k), bins = $$('.saa-bin', k), wrap = bins.length ? bins[0].parentNode : null;
    var reduce = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches), dragged = false;
    k.classList.add('saa-deck');
    if (k.hasAttribute('data-shuffle')) { shuffle($$('.saa-chip', pool)).forEach(function (c) { pool.appendChild(c); }); }
    var total = $$('.saa-chip', pool).length;
    var st = el('p', 'saa-k-status'); st.setAttribute('aria-live', 'polite'); k.insertBefore(st, k.firstChild);
    if (wrap && wrap.parentNode === k) { k.insertBefore(pool, wrap); }   /* the card sits above the boxes */
    bins.forEach(function (b, i) {
      if (!$('.saa-bin-h', b)) { b.insertBefore(el('p', 'saa-bin-h', b.getAttribute('data-label') || ''), b.firstChild); }
      var lab = (b.getAttribute('data-label') || $('.saa-bin-h', b).textContent || '').trim();
      b.setAttribute('role', 'button'); b.setAttribute('tabindex', '0'); b.setAttribute('aria-label', lab);
      if (bins.length === 2) { var a = el('span', 'saa-bin-arr', i ? '→' : '←'); a.setAttribute('aria-hidden', 'true'); b.appendChild(a); }
      var n = el('span', 'saa-bin-n', '0'); n.setAttribute('aria-hidden', 'true'); b.appendChild(n);
    });
    function top() { return $('.saa-chip', pool); }
    function layout() {
      var cs = $$('.saa-chip', pool);
      cs.forEach(function (c, i) {
        c.classList.toggle('is-top', i === 0); c.classList.toggle('is-next', i === 1); c.classList.remove('is-drag');
        c.tabIndex = i === 0 ? 0 : -1; c.style.transform = '';
        if (i) { c.setAttribute('aria-hidden', 'true'); } else { c.removeAttribute('aria-hidden'); }
      });
      st.textContent = cs.length ? 'Card ' + (total - cs.length + 1) + ' of ' + total : total + ' of ' + total + ' sorted';
      bins.forEach(function (b) { $('.saa-bin-n', b).textContent = $$('.saa-chip', b).length; });
    }
    function arm(b) { bins.forEach(function (x) { x.classList.toggle('over', x === b); }); }
    function fly(c, b) {   /* a copy of the card flies into the box; the real card is already sorted */
      if (reduce) { return; }
      var g = el('div', 'saa-deck-ghost'); g.innerHTML = c.innerHTML; g.setAttribute('aria-hidden', 'true');
      var cr = c.getBoundingClientRect(), br = b.getBoundingClientRect(), z = cr.width ? c.offsetWidth / cr.width : 1;
      var dx = (br.left + br.width / 2 - cr.left - cr.width / 2) * z, dy = (br.top + br.height / 2 - cr.top - cr.height / 2) * z;
      g.style.transform = c.style.transform || 'none'; pool.appendChild(g); void g.offsetWidth;
      g.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(.25) rotate(' + (dx < 0 ? -10 : 10) + 'deg)'; g.style.opacity = '0';
      setTimeout(function () { if (g.parentNode) { g.parentNode.removeChild(g); } }, 450);
    }
    function drop(b) {
      var c = top(); arm(null);
      if (!c || k.classList.contains('is-done')) { return; }
      if (c.getAttribute('data-bin') === b.getAttribute('data-bin')) {
        var hadFocus = doc.activeElement === c;
        fly(c, b);
        c.disabled = true; c.classList.remove('is-top', 'is-next', 'is-drag'); c.removeAttribute('aria-hidden'); c.removeAttribute('tabindex'); c.style.transform = '';
        b.appendChild(c); b.classList.remove('saa-bin-hit'); void b.offsetWidth; b.classList.add('saa-bin-hit');
        say(k, c.getAttribute('data-why') || 'Yes, that is right.', true);
        layout();
        if (!top()) { say(k, k.getAttribute('data-done-text') || 'All sorted. Well done.', true); done(k); }
        else if (hadFocus) { try { top().focus({ preventScroll: true }); } catch (x) { top().focus(); } }
      } else {
        c.classList.remove('is-drag'); c.style.transform = ''; shake(b); shake(c);
        say(k, c.getAttribute('data-hint') || 'Not that one. Read it again and try the other box.', false);
      }
    }
    function binAt(x, y) { var e = doc.elementFromPoint(x, y); return e && e.closest ? e.closest('.saa-bin') : null; }
    /* drag / flick the top card. touch-action:pan-y keeps vertical page scroll on phones */
    pool.addEventListener('pointerdown', function (e) {
      var c = top();
      if (!c || e.target.closest('.saa-chip') !== c || k.classList.contains('is-done') || (e.pointerType === 'mouse' && e.button !== 0)) { return; }
      var sx = e.clientX, sy = e.clientY, moved = false, over = null, w = c.getBoundingClientRect().width || 300;
      var z = c.offsetWidth / w || 1, thr = Math.min(110, w * 0.3);
      try { c.setPointerCapture(e.pointerId); } catch (x) {}
      function pick(ev) {
        var dx = ev.clientX - sx, b = binAt(ev.clientX, ev.clientY);
        if (!b && bins.length === 2 && Math.abs(dx) > thr) { b = bins[dx < 0 ? 0 : 1]; }
        return b;
      }
      function mv(ev) {
        var dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!moved && Math.abs(dx) + Math.abs(dy) < 8) { return; }
        if (!moved) { moved = true; c.classList.add('is-drag'); }
        c.style.transform = 'translate(' + dx * z + 'px,' + dy * z + 'px) rotate(' + (dx * z / 22) + 'deg)';
        over = pick(ev); arm(over);
        ev.preventDefault();
      }
      function end(ev, cancel) {
        c.removeEventListener('pointermove', mv); c.removeEventListener('pointerup', up); c.removeEventListener('pointercancel', cn); c.removeEventListener('lostpointercapture', cn);
        if (!moved) { return; }
        dragged = true; setTimeout(function () { dragged = false; }, 80);
        var b = !cancel && ev ? pick(ev) : null;
        if (b) { drop(b); } else { arm(null); c.classList.remove('is-drag'); c.style.transform = ''; }
      }
      function up(ev) { end(ev, false); } function cn() { end(null, true); }
      c.addEventListener('pointermove', mv); c.addEventListener('pointerup', up); c.addEventListener('pointercancel', cn); c.addEventListener('lostpointercapture', cn);
    });
    /* tapping the card itself points to the boxes */
    pool.addEventListener('click', function (e) {
      if (dragged || !e.target.closest('.saa-chip')) { return; }
      bins.forEach(function (b) { b.classList.add('saa-nudge'); });
      setTimeout(function () { bins.forEach(function (b) { b.classList.remove('saa-nudge'); }); }, 1300);
    });
    bins.forEach(function (b) {
      b.addEventListener('click', function () { drop(b); });
      b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drop(b); } });
    });
    k.addEventListener('keydown', function (e) {
      if ((e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') || k.classList.contains('is-done')) { return; }
      var t = e.target; if (!(t === top() || bins.indexOf(t) >= 0)) { return; }
      e.preventDefault();
      if (bins.length === 2) { drop(bins[e.key === 'ArrowLeft' ? 0 : 1]); return; }
      var i = bins.indexOf(t), j = i < 0 ? (e.key === 'ArrowLeft' ? 0 : bins.length - 1) : Math.max(0, Math.min(bins.length - 1, i + (e.key === 'ArrowLeft' ? -1 : 1)));
      bins[j].focus();
    });
    layout();
  }

  /* ---------- sort: tap a chip then a box, or drag it (mouse + touch) ---------- */
  function sort(k) {
    if (k.getAttribute('data-style') === 'deck') { sortDeck(k); return; }
    var pool = $('.saa-pool', k), bins = $$('.saa-bin', k), sel = null, dragged = false;
    if (k.hasAttribute('data-shuffle')) { shuffle($$('.saa-chip', pool)).forEach(function (c) { pool.appendChild(c); }); }
    bins.forEach(function (b) { if (!$('.saa-bin-h', b)) { var h = el('p', 'saa-bin-h', b.getAttribute('data-label') || ''); b.insertBefore(h, b.firstChild); } });
    function pick(c) {
      if (sel) { sel.setAttribute('aria-pressed', 'false'); }
      sel = sel === c ? null : c; if (sel) { sel.setAttribute('aria-pressed', 'true'); }
      k.classList.toggle('armed', !!sel);
    }
    function drop(b, c) {
      c = c || sel; if (!c) { say(k, 'Tap an item first.', null); return; }
      if (c.getAttribute('data-bin') === b.getAttribute('data-bin')) {
        c.setAttribute('aria-pressed', 'false'); c.disabled = true; b.appendChild(c); sel = null; k.classList.remove('armed');
        say(k, c.getAttribute('data-why') || 'Yes, that is right.', true);
        if (!$('.saa-chip', pool)) { say(k, k.getAttribute('data-done-text') || 'All sorted. Well done.', true); done(k); }
      } else {
        shake(b); say(k, c.getAttribute('data-hint') || 'Not that one. Read it again and try the other box.', false);
        c.setAttribute('aria-pressed', 'false'); sel = null; k.classList.remove('armed');
      }
    }
    function binAt(x, y) { var e = doc.elementFromPoint(x, y); return e && e.closest ? e.closest('.saa-bin') : null; }
    $$('.saa-chip', pool).forEach(function (c) {
      c.addEventListener('click', function () { if (dragged) { dragged = false; return; } pick(c); });
      c.addEventListener('pointerdown', function (e) {
        if (c.disabled || (e.pointerType === 'mouse' && e.button !== 0)) { return; }
        var sx = e.clientX, sy = e.clientY, g = null, over = null, moved = false, id = e.pointerId;
        try { c.setPointerCapture(id); } catch (x) {}
        function mv(ev) {
          if (!moved && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 8) { return; }
          if (!moved) { moved = true; g = el('div', 'saa-ghost-chip', c.textContent); g.style.width = c.offsetWidth + 'px'; doc.body.appendChild(g); c.style.opacity = '.35'; }
          g.style.transform = 'translate(' + (ev.clientX - g.offsetWidth / 2) + 'px,' + (ev.clientY - g.offsetHeight / 2) + 'px) rotate(-2deg)';
          var b = binAt(ev.clientX, ev.clientY); if (over !== b) { if (over) { over.classList.remove('over'); } over = b; if (over) { over.classList.add('over'); } }
          ev.preventDefault();
        }
        function end(ev, cancel) {
          c.removeEventListener('pointermove', mv); c.removeEventListener('pointerup', up); c.removeEventListener('pointercancel', cn); c.removeEventListener('lostpointercapture', cn);
          if (over) { over.classList.remove('over'); }
          if (g && g.parentNode) { g.parentNode.removeChild(g); } c.style.opacity = '';
          if (!moved) { return; }
          dragged = true; setTimeout(function () { dragged = false; }, 80);
          var b = !cancel && ev ? binAt(ev.clientX, ev.clientY) : null; if (b) { drop(b, c); }
        }
        function up(ev) { end(ev, false); } function cn() { end(null, true); }
        c.addEventListener('pointermove', mv); c.addEventListener('pointerup', up); c.addEventListener('pointercancel', cn); c.addEventListener('lostpointercapture', cn);
      });
    });
    bins.forEach(function (b) { b.addEventListener('click', function (e) { if (e.target.closest('.saa-chip') && e.target.closest('.saa-bin')) { return; } drop(b); }); });
  }

  /* ---------- order (domino chain): drag, or tap two to swap, or use the arrows; then check ---------- */
  function order(k) {
    var list = $('.saa-steps', k), items = $$('li', list), btn = $('.saa-k-check', k);
    if (!btn) { btn = el('button', 'saa-k-check', 'Check the order'); btn.type = 'button'; list.parentNode.insertBefore(btn, list.nextSibling); }
    var w = why(k), right = w.getAttribute('data-right') || 'Yes. That is the right order.', wrong = w.getAttribute('data-wrong') || 'Not yet. The red steps are in the wrong place.';
    items.forEach(function (li) {
      li.setAttribute('tabindex', '0');
      var mvb = el('span', 'saa-mv');
      var u = el('button', '', '↑'), d = el('button', '', '↓'); u.type = d.type = 'button';
      u.setAttribute('aria-label', 'Move up'); d.setAttribute('aria-label', 'Move down');
      u.addEventListener('click', function (e) { e.stopPropagation(); var p = li.previousElementSibling; if (p) { list.insertBefore(li, p); clear(); } });
      d.addEventListener('click', function (e) { e.stopPropagation(); var n = li.nextElementSibling; if (n) { list.insertBefore(n, li); clear(); } });
      mvb.appendChild(u); mvb.appendChild(d); li.appendChild(mvb);
    });
    do { shuffle(items).forEach(function (li) { list.appendChild(li); }); } while (items.length > 1 && isRight());
    function isRight() { return $$('li', list).every(function (li, i) { return +li.getAttribute('data-n') === i + 1; }); }
    function clear() { $$('li', list).forEach(function (li) { li.classList.remove('good', 'off'); }); say(k, '', null); }
    var picked = null;
    list.addEventListener('click', function (e) {
      var li = e.target.closest('li'); if (!li || e.target.closest('.saa-mv') || k.classList.contains('is-done')) { return; }
      if (!picked) { picked = li; li.classList.add('picked'); return; }
      if (picked !== li) { var a = picked.nextElementSibling === li ? li : null; var ph = el('li'); list.insertBefore(ph, li); list.insertBefore(li, picked); list.insertBefore(picked, ph); list.removeChild(ph); clear(); }
      picked.classList.remove('picked'); picked = null;
    });
    /* drag to reorder */
    list.addEventListener('pointerdown', function (e) {
      var li = e.target.closest('li'); if (!li || e.target.closest('.saa-mv') || k.classList.contains('is-done') || (e.pointerType === 'mouse' && e.button !== 0)) { return; }
      var sy = e.clientY, moved = false, id = e.pointerId;
      function mv(ev) {
        if (!moved && Math.abs(ev.clientY - sy) < 8) { return; }
        if (!moved) { moved = true; li.classList.add('dragging'); if (picked) { picked.classList.remove('picked'); picked = null; } }
        var after = $$('li', list).filter(function (x) { return x !== li; }).filter(function (x) { var r = x.getBoundingClientRect(); return ev.clientY > r.top + r.height / 2; }).pop();
        if (after) { list.insertBefore(li, after.nextSibling); } else { list.insertBefore(li, list.firstChild); }
        ev.preventDefault();
      }
      function up() { doc.removeEventListener('pointermove', mv); doc.removeEventListener('pointerup', up); doc.removeEventListener('pointercancel', up); li.classList.remove('dragging'); if (moved) { clear(); li.addEventListener('click', function s(ev) { ev.stopPropagation(); li.removeEventListener('click', s, true); }, true); } }
      doc.addEventListener('pointermove', mv); doc.addEventListener('pointerup', up); doc.addEventListener('pointercancel', up);
    });
    btn.addEventListener('click', function () {
      var ok = true;
      $$('li', list).forEach(function (li, i) { var g = +li.getAttribute('data-n') === i + 1; li.classList.toggle('good', g); li.classList.toggle('off', !g); if (!g) { ok = false; shake(li); } });
      if (ok) {
        $$('li', list).forEach(function (li, i) { li.style.animationDelay = (i * 0.12) + 's'; });
        k.classList.add('toppled'); say(k, right, true); btn.disabled = true; done(k);
      } else { say(k, wrong, false); }
    });
  }

  /* ---------- spot (detective): tap the parts that need checking, then check ---------- */
  function spot(k) {
    var parts = $$('.saa-s', k), btn = $('.saa-k-check', k);
    if (!btn) { btn = el('button', 'saa-k-check', 'Check my choices'); btn.type = 'button'; k.appendChild(btn); }
    why(k);
    btn.disabled = true;
    parts.forEach(function (s) {
      s.setAttribute('role', 'button'); s.setAttribute('tabindex', '0'); s.setAttribute('aria-pressed', 'false');
      function tog() {
        if (k.classList.contains('checked')) { var f = s.hasAttribute('data-ok'), on = s.classList.contains('on'); say(k, (f ? (on ? 'You found this. ' : 'You missed this. ') : (on ? 'This part was fine. ' : 'Fine. ')) + (s.getAttribute('data-why') || ''), f && on ? true : f ? false : null); return; }
        s.classList.toggle('on'); s.setAttribute('aria-pressed', s.classList.contains('on') ? 'true' : 'false');
        btn.disabled = !$('.saa-s.on', k);
      }
      s.addEventListener('click', tog);
      s.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tog(); } });
    });
    btn.addEventListener('click', function () {
      if (k.classList.contains('checked')) {   /* Try again */
        k.classList.remove('checked'); parts.forEach(function (s) { s.classList.remove('on', 'hit', 'miss', 'false'); s.setAttribute('aria-pressed', 'false'); });
        btn.textContent = 'Check my choices'; btn.disabled = true; say(k, '', null); return;
      }
      var need = parts.filter(function (s) { return s.hasAttribute('data-ok'); }), found = 0;
      parts.forEach(function (s) { var f = s.hasAttribute('data-ok'), on = s.classList.contains('on'); s.classList.add(f ? (on ? 'hit' : 'miss') : (on ? 'false' : 'ok')); if (f && on) { found++; } });
      k.classList.add('checked');
      var all = found === need.length;
      say(k, 'You found ' + found + ' of ' + need.length + '. ' + (all ? (k.getAttribute('data-done-text') || 'Well done.') : 'Tap any coloured part to see why, or try again.'), all);
      if (all) { btn.style.display = 'none'; } else { btn.textContent = 'Try again'; }
      done(k);
    });
  }

  /* ---------- stamp: stamp each statement with the right verdict ---------- */
  function stamp(k) {
    var labels = (k.getAttribute('data-stamps') || 'Check it|Looks fine').split('|');
    var rows = $$('.saa-row', k);
    rows.forEach(function (r) {
      if (!$('.saa-row-t', r)) { var t = el('span', 'saa-row-t'); while (r.firstChild) { t.appendChild(r.firstChild); } r.appendChild(t); }
      var box = el('span', 'saa-stamps'), ink = el('span', 'saa-ink', labels[+r.getAttribute('data-ans')] || '');
      labels.forEach(function (lab, i) {
        var b = el('button', 'saa-stamp-btn', lab); b.type = 'button';
        b.addEventListener('click', function () {
          if (+r.getAttribute('data-ans') === i) {
            r.classList.add('done'); say(k, r.getAttribute('data-why') || 'Yes.', true);
            if (rows.every(function (x) { return x.classList.contains('done'); })) { say(k, k.getAttribute('data-done-text') || 'All stamped. Well done.', true); done(k); }
          } else { shake(r); say(k, r.getAttribute('data-hint') || 'Not quite. Read it again.', false); }
        });
        box.appendChild(b);
      });
      r.appendChild(box); r.appendChild(ink);
    });
  }

  var KITS = { reveal: reveal, quick: quick, sort: sort, order: order, spot: spot, stamp: stamp };
  function init(root) {
    $$('.saa-kit[data-kit]', root).forEach(function (k) {
      if (k.getAttribute('data-ready')) { return; }
      var f = KITS[k.getAttribute('data-kit')]; if (!f) { return; }
      k.setAttribute('data-ready', '1');
      try { f(k); } catch (e) { if (win.console) { console.error('saa-kit', e); } }
    });
  }

  /* ---------- lock Next while the visible screen has an unfinished required kit ---------- */
  var NAV = '#primary, #deck-next, #navNext, #nav-next, #nextBtn, #next, .btn-next, .nav-btn.primary, .nav-circle.primary, footer .btn-primary, .foot .btn-primary';
  function vis(e) {
    if (!e || e.offsetParent === null) { return false; }
    /* slides that are hidden by opacity / visibility / aria-hidden (Deck games) do not count */
    for (var n = e; n && n !== doc.body; n = n.parentElement) {
      var cs = getComputedStyle(n);
      if (cs.visibility === 'hidden' || cs.opacity === '0' || n.getAttribute('aria-hidden') === 'true') { return false; }
    }
    return true;
  }
  doc.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest(NAV); if (!b) { return; }
    var open = $$('.saa-kit[data-required]:not(.is-done)').filter(vis)[0];
    if (!open) { return; }
    e.preventDefault(); e.stopImmediatePropagation();
    shake(open);
    $$('.saa-card:not(.open), .saa-k-opt:not(:disabled), .saa-pool .saa-chip, .saa-steps > li, .saa-s, .saa-row:not(.done)', open).slice(0, 8).forEach(function (x) { x.classList.add('saa-nudge'); });
    setTimeout(function () { $$('.saa-nudge', open).forEach(function (x) { x.classList.remove('saa-nudge'); }); }, 2600);
  }, true);
  doc.addEventListener('saa:done', function () { $$('.saa-nudge').forEach(function (x) { x.classList.remove('saa-nudge'); }); });

  win.SAAKit = { init: init };
  if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', function () { init(); }); } else { init(); }
  var mt = 0;
  if (win.MutationObserver) { new MutationObserver(function () { clearTimeout(mt); mt = setTimeout(function () { init(); }, 60); }).observe(doc.documentElement, { childList: true, subtree: true }); }
})(window, document);
