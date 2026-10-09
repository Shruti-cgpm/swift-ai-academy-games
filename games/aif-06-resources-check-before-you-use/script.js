/* Swift AI Academy — one-idea-per-screen engine (shared by READ, RES and FAC).
   - Learners control pacing: Back and Continue on every screen.
   - Novices get a fixed order: new screens open in sequence; any screen
     already seen can be reopened from the outline.
   - A screen with data-gate="q1 q2" keeps Continue locked until those
     questions are answered. Tries are unlimited; every choice gets feedback
     that explains why.
   - The host platform can listen for
     postMessage {source:'swift-ai-academy', segment, event:'complete'|'next'|'close'}.
   - Nothing is saved or sent anywhere else. */
(function () {
  'use strict';
  var body = document.body;
  var SEGMENT = body.getAttribute('data-segment') || '';
  var all = Array.prototype.slice.call(document.querySelectorAll('.screen'));
  var doneScreen = document.querySelector('.screen.done');
  var content = all.filter(function (s) { return s !== doneScreen; });
  var current = 0, maxSeen = 0, answered = {};
  /* facilitators may jump anywhere; learners follow the sequence */
  if (body.hasAttribute('data-free-nav')) maxSeen = content.length - 1;

  var bars = document.querySelector('[data-bars]');
  var pos = document.querySelector('[data-pos]');
  var nextBtn = document.querySelector('[data-next]');
  var nextLabel = document.querySelector('[data-next-label]');
  var prevBtn = document.querySelector('[data-prev]');
  var gateHint = document.querySelector('[data-gate-msg]');
  var outline = document.querySelector('[data-outline]');

  function notify(ev) { try { window.parent.postMessage({ source: 'swift-ai-academy', segment: SEGMENT, event: ev }, '*'); } catch (e) {} }

  function unlocked(i) {
    var s = all[i]; if (!s) return true;
    var g = (s.getAttribute('data-gate') || '').split(/\s+/).filter(Boolean);
    return g.every(function (id) { return answered[id]; });
  }

  function render() {
    all.forEach(function (s, i) { s.hidden = i !== current; });
    var onDone = doneScreen && all[current] === doneScreen;
    var lastContent = current === content.length - 1;

    if (bars) {
      bars.innerHTML = '';
      content.forEach(function (_, i) {
        var b = document.createElement('i');
        if (i === current) b.className = 'now'; else if (i <= maxSeen) b.className = 'seen';
        bars.appendChild(b);
      });
    }
    if (pos) pos.textContent = onDone ? 'Done' : (current + 1) + ' of ' + content.length;

    var label = all[current].getAttribute('data-next-label') ||
      (onDone ? body.getAttribute('data-after-label') || 'Continue'
        : lastContent ? body.getAttribute('data-finish-label') || 'Finish' : 'Continue');
    nextLabel.textContent = label;
    var ok = unlocked(current);
    nextBtn.disabled = !ok;
    nextBtn.hidden = onDone && !body.getAttribute('data-after-label');
    if (gateHint) { gateHint.hidden = ok; gateHint.textContent = all[current].getAttribute('data-gate-hint') || 'Answer the question to continue.'; }
    prevBtn.hidden = current === 0 || onDone;

    if (outline) {
      outline.innerHTML = '';
      content.forEach(function (s, i) {
        var li = document.createElement('li');
        var b = document.createElement('button');
        b.type = 'button';
        b.className = i === current ? 'now' : (i <= maxSeen ? 'seen' : '');
        b.disabled = i > maxSeen;
        b.innerHTML = '<span class="dot"></span><span></span>';
        b.firstChild.textContent = i + 1;
        b.lastChild.textContent = s.getAttribute('data-title') || ('Screen ' + (i + 1));
        if (i === current) b.setAttribute('aria-current', 'step');
        b.addEventListener('click', function () { if (i <= maxSeen) { go(i); closeOutline(); } });
        li.appendChild(b); outline.appendChild(li);
      });
    }
  }

  function go(i) {
    if (i < 0 || i >= all.length) return;
    current = i; if (i > maxSeen && i < content.length) maxSeen = i;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    var h = all[i].querySelector('h1');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  nextBtn.addEventListener('click', function () {
    if (!unlocked(current)) return;
    var onDone = doneScreen && all[current] === doneScreen;
    if (onDone) { notify('next'); return; }
    if (current === content.length - 1) {
      notify('complete');
      if (doneScreen) go(all.indexOf(doneScreen));
      return;
    }
    go(current + 1);
  });
  prevBtn.addEventListener('click', function () { go(current - 1); });
  document.querySelectorAll('[data-goto]').forEach(function (b) {
    b.addEventListener('click', function () { go(parseInt(b.getAttribute('data-goto'), 10)); });
  });
  document.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { notify('close'); }); });

  /* outline drawer */
  var drawer = document.querySelector('.drawer');
  function openOutline() { if (!drawer) return; body.classList.add('drawer-open'); drawer.setAttribute('aria-hidden', 'false'); var c = drawer.querySelector('[data-close-outline]'); if (c) c.focus(); }
  function closeOutline() { if (!drawer) return; body.classList.remove('drawer-open'); drawer.setAttribute('aria-hidden', 'true'); }
  document.querySelectorAll('[data-open-outline]').forEach(function (b) { b.addEventListener('click', openOutline); });
  document.querySelectorAll('[data-close-outline]').forEach(function (b) { b.addEventListener('click', closeOutline); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOutline(); });

  /* questions */
  document.querySelectorAll('.q[data-q]').forEach(function (q) {
    var id = q.getAttribute('data-q');
    var mode = q.getAttribute('data-mode') || 'graded';
    var correct = q.getAttribute('data-correct');
    var opts = Array.prototype.slice.call(q.querySelectorAll('.opt'));
    var check = q.querySelector('[data-check]');
    var fb = q.querySelector('[data-fb]');
    var chosen = null;

    function pick(o) {
      if (o.disabled) return;
      opts.forEach(function (x) { x.setAttribute('aria-checked', x === o ? 'true' : 'false'); x.tabIndex = x === o ? 0 : -1; });
      chosen = o.getAttribute('data-val');
      check.disabled = false;
    }
    opts.forEach(function (o, i) {
      o.tabIndex = i === 0 ? 0 : -1;
      o.addEventListener('click', function () { pick(o); });
      o.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = opts[(i + 1) % opts.length];
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = opts[(i - 1 + opts.length) % opts.length];
        if (n) { e.preventDefault(); n.focus(); pick(n); }
      });
    });

    function show(key, good) {
      var tpl = q.querySelector('template[data-fb-for="' + key + '"]');
      fb.innerHTML = good ? '<svg width="18" height="18" style="color:#0E6B49"><use href="#i-tick"/></svg>'
        : '<svg width="18" height="18" style="color:#5C6690"><use href="#i-info"/></svg>';
      var wrap = document.createElement('div');
      if (tpl) wrap.appendChild(tpl.content.cloneNode(true));
      fb.appendChild(wrap);
      fb.className = 'fb ' + (good ? 'good' : 'retry');
      fb.hidden = false;
      fb.setAttribute('role', 'status');
    }

    check.addEventListener('click', function () {
      if (!chosen) return;
      if (mode === 'predict') {
        body.setAttribute('data-prediction', chosen);
        show('any', false);
        opts.forEach(function (o) { o.disabled = true; });
        check.hidden = true; answered[id] = true;
        document.querySelectorAll('[data-reveal]').forEach(function (r) {
          var t = r.querySelector('template[data-reveal-for="' + chosen + '"]');
          var out = r.querySelector('[data-reveal-out]');
          if (t && out) { out.innerHTML = ''; out.appendChild(t.content.cloneNode(true)); r.hidden = false; }
        });
        render(); return;
      }
      var good = chosen === correct;
      show(chosen, good);
      if (good) {
        opts.forEach(function (o) { o.disabled = true; if (o.getAttribute('data-val') === correct) o.classList.add('is-right'); });
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

  /* facilitator: lane switch (changes context only, never the criterion) */
  document.querySelectorAll('[data-setlane]').forEach(function (b) {
    b.addEventListener('click', function () {
      var lane = b.getAttribute('data-setlane');
      body.setAttribute('data-lane', lane);
      document.querySelectorAll('[data-setlane]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      try { localStorage.setItem('saa-lane', lane); } catch (e) {}
    });
  });
  try {
    var savedLane = localStorage.getItem('saa-lane');
    var laneBtn = savedLane && document.querySelector('[data-setlane="' + savedLane + '"]');
    if (laneBtn) laneBtn.click();
  } catch (e) {}

  /* facilitator: answer bank, one topic at a time */
  document.querySelectorAll('[data-chips]').forEach(function (group) {
    var target = document.querySelector(group.getAttribute('data-chips'));
    group.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        group.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        var c = b.getAttribute('data-cluster');
        target.querySelectorAll('.qa').forEach(function (qa) { qa.hidden = qa.getAttribute('data-cluster') !== c; qa.open = false; });
      });
    });
    var first = group.querySelector('button'); if (first) first.click();
  });

  /* ESL upgrade: light / dark theme. Kits and icons follow the theme the learner picks
     (ivory icons on the dark card, navy icons on the light card). */
  function paintTheme() {
    var light = document.documentElement.getAttribute('data-theme') === 'light';
    document.querySelectorAll('.saa-kit[data-theme]').forEach(function (k) { k.setAttribute('data-theme', light ? 'light' : 'dark'); });
    document.querySelectorAll('img[data-ic]').forEach(function (im) {
      var src = 'assets/icons/' + (light ? 'navy' : 'ivory') + '/' + im.getAttribute('data-ic') + '.webp';
      if (im.getAttribute('src') !== src) im.setAttribute('src', src);
    });
  }
  window.addEventListener('saa:theme', paintTheme);
  paintTheme();
  document.addEventListener('DOMContentLoaded', paintTheme);   /* the layer applies a saved theme after this file runs */

  render();
})();
