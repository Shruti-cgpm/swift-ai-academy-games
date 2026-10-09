/* Swift AI Academy — one-idea-per-screen engine (Reading S02, ESL upgrade Oct 2026).
   - Learners control pacing: Back and Next on every screen.
   - A cover screen (first) feeds the layer's start screen; Start skips it.
   - A screen with data-gate="id" keeps Next locked until that work is done. A locked Next looks
     locked (the layer dims it, aria-disabled) but can still be pressed: it then says what is missing.
     Tries are unlimited; every choice gets feedback that explains why.
   - The host platform can listen for
     postMessage {source:'swift-ai-academy', segment, event:'complete'|'next'}.
   - Nothing is saved or sent anywhere else. */
(function () {
  'use strict';
  var body = document.body;
  var SEGMENT = body.getAttribute('data-segment') || '';
  var all = Array.prototype.slice.call(document.querySelectorAll('.screen'));
  var doneScreen = document.querySelector('.screen.done');
  var cover = document.querySelector('.screen.cover');
  var content = all.filter(function (s) { return s !== doneScreen; });
  var counted = content.filter(function (s) { return s !== cover; });
  var current = 0, answered = {};
  var EMBEDDED = (function () { try { return window.parent && window.parent !== window; } catch (e) { return true; } })();

  var pos = document.querySelector('[data-pos]');
  var nextBtn = document.querySelector('[data-next]');
  var nextLabel = document.querySelector('[data-next-label]');
  var prevBtn = document.querySelector('[data-prev]');
  var restartBtn = document.getElementById('restart');

  function notify(ev) { try { window.parent.postMessage({ source: 'swift-ai-academy', segment: SEGMENT, event: ev }, '*'); } catch (e) {} }
  function sfx(ok) { try { if (window.SAA_SFX) { if (ok) { window.SAA_SFX.correct(); } else { window.SAA_SFX.wrong(); } } } catch (e) {} }

  /* ---- gates ---- */
  var MIN_WORDS = 6;
  function words(t) { return (t || '').split(/\s+/).filter(function (w) { return /[\p{L}\p{N}]/u.test(w); }); }
  function explainOk() {
    var buddy = document.getElementById('buddy');
    if (buddy && buddy.getAttribute('aria-pressed') === 'true') { return true; }
    var box = document.getElementById('explain-box'); if (!box) { return true; }
    var t = box.value.trim(), w = words(t);
    if (w.length < MIN_WORDS) { return false; }
    /* a copy of the question is not an answer */
    var q = 'why does a short request get a general answer';
    if (t.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim() === q) { return false; }
    return true;
  }
  function gateIds(s) { return (s.getAttribute('data-gate') || '').split(/\s+/).filter(Boolean); }
  function gateDone(id) { return id === 'explain' ? explainOk() : !!answered[id]; }
  function unlocked(i) { var s = all[i]; if (!s) { return true; } return gateIds(s).every(gateDone); }
  /* the layer locks Next while a visible element carries data-saa-locked */
  function paintGates() {
    all.forEach(function (s, i) {
      var g = s.querySelector('.ga-gate'); if (!g) { return; }
      var ok = unlocked(i);
      if (ok) { g.removeAttribute('data-saa-locked'); if (g.textContent) { g.textContent = ''; } }
      else { g.setAttribute('data-saa-locked', ''); }
    });
  }
  function blocked() {
    var s = all[current], g = s.querySelector('.ga-gate');
    if (!g) { return; }
    g.textContent = s.getAttribute('data-gate-hint') || 'Finish this screen first.';
    g.classList.remove('ga-shake'); void g.offsetWidth; g.classList.add('ga-shake');
    var f = s.querySelector('.opt:not([disabled])[aria-checked="true"]') ? s.querySelector('[data-check]:not([hidden])') : null;
    if (!f && s.querySelector('#explain-box')) { f = document.getElementById('explain-box'); }
    if (f) { try { f.focus({ preventScroll: false }); } catch (e) { f.focus(); } }
  }

  function render() {
    all.forEach(function (s, i) { s.hidden = i !== current; s.classList.toggle('active', i === current); });
    var onDone = doneScreen && all[current] === doneScreen;
    var onCover = all[current] === cover;
    var lastContent = current === content.length - 1;
    var n = counted.indexOf(all[current]);
    if (pos) { pos.textContent = onDone ? counted.length + ' / ' + counted.length : (n < 0 ? '' : (n + 1) + ' / ' + counted.length); }

    var label = all[current].getAttribute('data-next-label') ||
      (onDone ? body.getAttribute('data-after-label') || 'Next'
        : lastContent ? body.getAttribute('data-finish-label') || 'Finish' : 'Next');
    nextLabel.textContent = label;
    /* the done screen: a host page can move on (Next); on its own the reading ends with Start over */
    nextBtn.hidden = onDone && !EMBEDDED;
    if (restartBtn) { restartBtn.hidden = !onDone; }
    prevBtn.hidden = onCover || onDone;
    paintGates();
  }

  function go(i) {
    if (i < 0 || i >= all.length) { return; }
    current = i;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    var h = all[i].querySelector('h1');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  nextBtn.addEventListener('click', function (e) {
    if (nextBtn.hidden) { return; }
    if (!unlocked(current)) { e.preventDefault(); blocked(); return; }
    var onDone = doneScreen && all[current] === doneScreen;
    if (onDone) { notify('next'); return; }
    if (current === content.length - 1) {
      notify('complete');
      if (doneScreen) { go(all.indexOf(doneScreen)); }
      return;
    }
    go(current + 1);
  });
  prevBtn.addEventListener('click', function () { go(current - 1); });
  /* Start over really resets: nothing is saved, so a clean reload clears every answer */
  if (restartBtn) { restartBtn.addEventListener('click', function () { window.__saaLeaving = true; location.reload(); }); }

  /* ---- questions (the game's own: choose, then Check) ---- */
  document.querySelectorAll('.q[data-q]').forEach(function (q) {
    var id = q.getAttribute('data-q');
    var mode = q.getAttribute('data-mode') || 'graded';
    var correct = q.getAttribute('data-correct');
    var opts = Array.prototype.slice.call(q.querySelectorAll('.opt'));
    var check = q.querySelector('[data-check]');
    var fb = q.querySelector('[data-fb]');
    var chosen = null;

    function pick(o) {
      if (o.disabled) { return; }
      opts.forEach(function (x) { x.setAttribute('aria-checked', x === o ? 'true' : 'false'); x.tabIndex = x === o ? 0 : -1; });
      chosen = o.getAttribute('data-val');
      check.disabled = false;
    }
    opts.forEach(function (o, i) {
      o.tabIndex = i === 0 ? 0 : -1;
      o.addEventListener('click', function () { pick(o); });
      o.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { n = opts[(i + 1) % opts.length]; }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { n = opts[(i - 1 + opts.length) % opts.length]; }
        if (n) { e.preventDefault(); n.focus(); pick(n); }
      });
    });

    /* feedback: one line in a .saa-k-why, so the narrator reads it (clips are made for every line) */
    function show(key, state) {
      var tpl = q.querySelector('template[data-fb-for="' + key + '"]');
      var t = tpl ? tpl.content.textContent.replace(/\s+/g, ' ').trim() : '';
      fb.innerHTML = state === 'good' ? '<svg width="18" height="18" aria-hidden="true"><use href="#i-tick"/></svg>'
        : '<svg width="18" height="18" aria-hidden="true"><use href="#i-info"/></svg>';
      var p = document.createElement('p');
      p.className = 'saa-k-why fb-t';
      fb.appendChild(p);
      fb.className = 'fb ' + state;
      fb.hidden = false;
      fb.setAttribute('role', 'status');
      p.textContent = t;   /* set after it is in the page, so the narrator hears the change */
    }

    check.addEventListener('click', function () {
      if (!chosen) { return; }
      if (mode === 'predict') {
        body.setAttribute('data-prediction', chosen);
        show('any', 'locked');
        opts.forEach(function (o) { o.disabled = true; });
        check.hidden = true; answered[id] = true;
        document.querySelectorAll('[data-reveal]').forEach(function (r) {
          var t = r.querySelector('template[data-reveal-for="' + chosen + '"]');
          var out = r.querySelector('[data-reveal-out]');
          if (t && out) { out.textContent = t.content.textContent.replace(/\s+/g, ' ').trim(); r.hidden = false; }
        });
        render(); return;
      }
      var good = chosen === correct;
      show(chosen, good ? 'good' : 'retry');
      sfx(good);
      if (good) {
        opts.forEach(function (o) { o.disabled = true; if (o.getAttribute('data-val') === correct) { o.classList.add('is-right'); } });
        check.hidden = true; answered[id] = true;
        var slot = q.getAttribute('data-fills');
        var right = q.querySelector('.opt[data-val="' + correct + '"]');
        if (slot && right) {
          document.querySelectorAll('.bf[data-slot="' + slot + '"]').forEach(function (bf) {
            bf.querySelector('.v').textContent = right.getAttribute('data-fill');
            bf.classList.remove('open'); bf.classList.add('filled');
          });
        }
        render();
      } else {
        check.disabled = true;
        opts.forEach(function (o) { o.addEventListener('click', function () { check.disabled = false; }, { once: true }); });
      }
    });
  });

  /* ---- screen 18: one sentence, or "I told my buddy" ---- */
  var buddy = document.getElementById('buddy');
  if (buddy) {
    buddy.addEventListener('click', function () {
      buddy.setAttribute('aria-pressed', buddy.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      paintGates();
    });
  }
  var box = document.getElementById('explain-box');
  if (box) { box.addEventListener('input', paintGates); }
  /* typed work is lost on a refresh: ask first */
  window.addEventListener('beforeunload', function (e) {
    if (window.__saaLeaving) { return; }
    if (box && box.value.trim()) { e.preventDefault(); e.returnValue = ''; }
  });

  render();

  /* ---- after the layer and the kits have loaded ---- */
  document.addEventListener('DOMContentLoaded', function () {
    /* a kit with data-after-done: one closing line (read aloud) when the kit is finished */
    document.querySelectorAll('.saa-kit[data-after-done]').forEach(function (k) {
      var out = k.parentNode.querySelector('.after-done');
      k.addEventListener('saa:done', function () { if (out && !out.textContent) { out.textContent = k.getAttribute('data-after-done'); } });
    });

    /* screen 9: the refine-loop animation shows once the order is right */
    var anim = document.querySelector('.anim');
    if (anim) {
      var page = anim.closest('.screen');
      var kit = page.querySelector('.saa-kit[data-kit="order"]');
      var vid = anim.querySelector('video');
      var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var tryPlay = function () { var p = vid.play(); if (p && p.catch) { p.catch(function () {}); } };
      var toggle = function () { if (vid.paused) { tryPlay(); } else { vid.pause(); } };
      vid.addEventListener('click', toggle);
      vid.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      var reveal = function () {
        if (!anim.hidden) { return; }
        anim.hidden = false;
        if (still) { vid.poster = 'assets/anim-refine-loop-final.webp'; } else { tryPlay(); }
      };
      if (kit) { kit.addEventListener('saa:done', reveal); }
      var sync = function () { setTimeout(function () { if (page.hidden) { vid.pause(); } else if (!anim.hidden && !still) { tryPlay(); } }, 0); };
      [nextBtn, prevBtn].forEach(function (b) { b.addEventListener('click', sync); });
    }

    /* start screen: the trainee above the title (the overlay is built by the layer) */
    setTimeout(function () {
      var mid = document.querySelector('#saa-start .saa-mid');
      if (!mid || mid.querySelector('.start-hero')) { return; }
      var img = document.createElement('img');
      img.className = 'start-hero';
      img.src = 'assets/char-iti-trainee.webp';
      img.alt = 'An ITI trainee types a request on a phone and checks the reply with a magnifier.';
      mid.insertBefore(img, mid.firstChild);
    }, 0);

    /* light / dark: kits and line icons follow the page theme (ivory icons on dark, navy on light) */
    function theme() {
      var light = document.documentElement.getAttribute('data-theme') === 'light';
      document.querySelectorAll('.saa-kit').forEach(function (k) { k.setAttribute('data-theme', light ? 'light' : 'dark'); });
      document.querySelectorAll('img.ic[data-ic]').forEach(function (im) {
        var want = 'assets/icons/' + (light ? 'navy/' : '') + 'icon-' + im.getAttribute('data-ic') + '.webp';
        if (im.getAttribute('src') !== want) { im.setAttribute('src', want); }
      });
    }
    window.addEventListener('saa:theme', theme);
    theme();
  });
})();
