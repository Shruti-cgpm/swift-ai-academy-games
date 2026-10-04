// Registered now (before saa-kit.js loads) so the game's own gate message runs before the
// kit's shared Next lock; the check itself is set up on DOMContentLoaded below.
document.addEventListener('click', function (e) { if (window.__ga5Gate) { window.__ga5Gate(e); } }, true);
// Slide deck: every .page is one slide (14 in total). The footer Back / Next
// buttons move between slides and the progress bars + "n / 14" counter are
// built from the slide count, so nothing is hard-coded. In-memory state only.
document.addEventListener('DOMContentLoaded', function () {
  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var backBtn = document.getElementById('deck-back');
  var nextBtn = document.getElementById('deck-next');
  var restartBtn = document.getElementById('deck-restart');
  var dotsWrap = document.getElementById('deck-dots');
  var count = document.getElementById('deck-count');
  var total = pages.length;
  var current = 0;

  pages.forEach(function () {
    var dot = document.createElement('span');
    dot.className = 'progress-dot';
    dotsWrap.appendChild(dot);
  });
  var dots = dotsWrap.querySelectorAll('.progress-dot');

  function showPage(index) {
    current = Math.max(0, Math.min(total - 1, index));
    pages.forEach(function (page, i) {
      page.hidden = i !== current;
      page.classList.toggle('active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('done', i < current);
      dot.classList.toggle('active', i === current);
    });
    count.textContent = (current + 1) + ' / ' + total;

    backBtn.classList.toggle('is-hidden', current === 0);
    backBtn.disabled = current === 0;
    // Last slide: "Start over" (secondary) replaces Next, as on the old recap page.
    var last = current === total - 1;
    nextBtn.hidden = last;
    restartBtn.hidden = !last;
  }

  backBtn.addEventListener('click', function () { showPage(current - 1); });
  nextBtn.addEventListener('click', function () { showPage(current + 1); });
  // Start over: a clean reload clears every answer and every finished activity
  restartBtn.addEventListener('click', function () { window.__ga5Leaving = true; location.reload(); });

  showPage(0);
});

// Five-moves accordions: tap a header to reveal its description.
// Only one item per accordion stays open at a time.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-accordion]').forEach(function (accordion) {
    var items = accordion.querySelectorAll('.acc-item');
    items.forEach(function (item) {
      var header = item.querySelector('.acc-header');
      header.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        items.forEach(function (other) {
          other.classList.remove('open');
          other.querySelector('.acc-header').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });
});

// Quick MCQs (one per slide): tap an option to select it and reveal one line
// of feedback in the space reserved for it. In-memory state only.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.mcq-group').forEach(function (group) {
    var options = group.querySelectorAll('.mcq-option');
    var feedback = group.querySelector('.mcq-feedback');
    feedback.setAttribute('aria-live', 'polite');
    options.forEach(function (option) {
      option.addEventListener('click', function () {
        options.forEach(function (o) { o.classList.remove('selected'); });
        option.classList.add('selected');
        if (feedback) {
          feedback.textContent = option.getAttribute('data-feedback') || '';
          feedback.hidden = false;
        }
      });
    });
  });
});

// Slide 6: show the 2 answers pasted on slide 5, clipped to a few lines.
// "Read all" opens the full answer in a simple overlay with a Close button.
document.addEventListener('DOMContentLoaded', function () {
  var app = document.querySelector('.app');
  var modal = document.getElementById('pasted-modal');
  var title = document.getElementById('pasted-modal-title');
  var body = document.getElementById('pasted-modal-body');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.pasted-card'));
  if (!modal || !cards.length) { return; }
  var lastBtn = null;

  function render() {
    cards.forEach(function (card) {
      var box = document.getElementById(card.getAttribute('data-src'));
      var text = box ? box.value.trim() : '';
      var p = card.querySelector('.pasted-text');
      var btn = card.querySelector('.pasted-open');
      p.textContent = text || 'You did not paste an answer.';
      p.classList.toggle('is-empty', !text);
      btn.hidden = !text;
    });
  }
  cards.forEach(function (card) {
    var box = document.getElementById(card.getAttribute('data-src'));
    if (box) { box.addEventListener('input', render); }
    card.querySelector('.pasted-open').addEventListener('click', function (e) {
      var box2 = document.getElementById(card.getAttribute('data-src'));
      title.textContent = card.querySelector('.example-tag').textContent;
      body.textContent = box2 ? box2.value.trim() : '';
      lastBtn = e.currentTarget;
      modal.hidden = false;
      if (app) { app.setAttribute('inert', ''); }
      document.getElementById('pasted-modal-x').focus();
    });
  });
  function close() {
    if (modal.hidden) { return; }
    modal.hidden = true;
    if (app) { app.removeAttribute('inert'); }
    if (lastBtn) { lastBtn.focus(); }
  }
  document.getElementById('pasted-modal-x').addEventListener('click', close);
  document.getElementById('pasted-modal-done').addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) { close(); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); } });
  document.getElementById('deck-next').addEventListener('click', render);
  render();
});

// Game 5 designer assets (Oct 2026): pictures under the left-hand text, the
// trainee on the start screen, the copy guide pop-up (slide 5) and the
// refine-loop animation (slide 8, shown only after the order is right).
document.addEventListener('DOMContentLoaded', function () {
  // the layer has already split each slide into .saa-lead / .saa-work: move the
  // left-column pictures under the slide's own text (no words are added)
  document.querySelectorAll('.ga5-lead-fig').forEach(function (fig) {
    var lead = fig.closest('.page') && fig.closest('.page').querySelector('.saa-lead');
    if (lead) { lead.appendChild(fig); }
  });

  // start screen: the trainee above the title (the overlay is built by the layer)
  setTimeout(function () {
    var mid = document.querySelector('#saa-start .saa-mid');
    if (!mid || mid.querySelector('.ga5-start-hero')) { return; }
    var img = document.createElement('img');
    img.className = 'ga5-start-hero';
    img.src = 'assets/char-iti-trainee.webp';
    img.alt = 'An ITI trainee types a request on a phone and checks the reply with a magnifier.';
    mid.insertBefore(img, mid.firstChild);
  }, 0);

  // slide 5: "See how to copy an answer" pop-up
  var app = document.querySelector('.app');
  var modal = document.getElementById('ga5-copy-modal');
  var openBtn = document.getElementById('ga5-copy-open');
  if (modal && openBtn) {
    var show = function () {
      modal.hidden = false;
      if (app) { app.setAttribute('inert', ''); }
      document.getElementById('ga5-copy-x').focus();
    };
    var hide = function () {
      if (modal.hidden) { return; }
      modal.hidden = true;
      if (app) { app.removeAttribute('inert'); }
      openBtn.focus();
    };
    openBtn.addEventListener('click', show);
    document.getElementById('ga5-copy-x').addEventListener('click', hide);
    document.getElementById('ga5-copy-done').addEventListener('click', hide);
    modal.addEventListener('click', function (e) { if (e.target === modal) { hide(); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { hide(); } });
  }

  // slide 8: show the refine-loop animation after "Check the order" is right
  var anim = document.getElementById('ga5-anim');
  if (anim) {
    var page = anim.closest('.page');
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
    if (kit) {
      kit.addEventListener('saa:done', reveal);
      if (kit.classList.contains('is-done')) { reveal(); }
    }
    // pause it while its slide is not on screen
    var sync = function () { setTimeout(function () { if (page.hidden) { vid.pause(); } else if (!anim.hidden && !still) { tryPlay(); } }, 0); };
    ['deck-next', 'deck-back', 'deck-restart'].forEach(function (id) { var b = document.getElementById(id); if (b) { b.addEventListener('click', sync); } });
  }
});

// Gates for the screens that are not kits (slides 5, 6, 10, 11 and 12). Each gate is a
// .saa-kit[data-required] line, so Next locks and looks locked the same way as on the kit
// screens. Next shows the gate's short message until the task is done.
document.addEventListener('DOMContentLoaded', function () {
  var gates = Array.prototype.slice.call(document.querySelectorAll('.ga-gate'));
  var skip = document.getElementById('ga5-skip');
  var MIN_PASTE = 15, MIN_WORDS = 8;
  function val(id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; }
  function ok(g) {
    var page = g.closest('.page'), kind = g.getAttribute('data-gate');
    if (kind === 'paste') {
      return (skip && skip.getAttribute('aria-pressed') === 'true') || (val('out-1').length >= MIN_PASTE && val('out-2').length >= MIN_PASTE);
    }
    if (kind === 'mcq') { return !!page.querySelector('.mcq-option.selected'); }
    if (kind === 'acc') {
      return Array.prototype.every.call(page.querySelectorAll('.acc-item'), function (i) { return i.hasAttribute('data-seen'); });
    }
    if (kind === 'msg') { return val('practice-message').split(/\s+/).filter(function (w) { return /\w/.test(w); }).length >= MIN_WORDS; }
    return true;
  }
  function refresh() {
    gates.forEach(function (g) {
      var d = ok(g);
      if (d !== g.classList.contains('is-done')) {
        g.classList.toggle('is-done', d);
        if (d) { g.removeAttribute('data-saa-locked'); } else { g.setAttribute('data-saa-locked', ''); }
        if (d) { g.textContent = ''; try { g.dispatchEvent(new CustomEvent('saa:done', { bubbles: true })); } catch (e) {} }
      }
    });
  }
  document.querySelectorAll('.acc-header').forEach(function (h) {
    h.addEventListener('click', function () { h.closest('.acc-item').setAttribute('data-seen', '1'); refresh(); });
  });
  if (skip) {
    skip.addEventListener('click', function () {
      var on = skip.getAttribute('aria-pressed') !== 'true';
      skip.setAttribute('aria-pressed', on ? 'true' : 'false');
      refresh();
    });
  }
  document.addEventListener('input', refresh);
  document.addEventListener('click', function () { setTimeout(refresh, 0); });
  // runs before the kit's own Next lock (registered at the top of this file)
  window.__ga5Gate = function (e) {
    var b = e.target.closest && e.target.closest('#deck-next');
    if (!b) { return; }
    refresh();
    var g = gates.filter(function (x) { return !x.classList.contains('is-done') && x.offsetParent !== null; })[0];
    if (!g) { return; }
    e.preventDefault(); e.stopImmediatePropagation();
    g.textContent = g.getAttribute('data-msg');
    g.classList.remove('ga-shake'); void g.offsetWidth; g.classList.add('ga-shake');
    var f = g.closest('.page').querySelector('textarea:placeholder-shown, .mcq-option, .acc-item:not([data-seen]) .acc-header, textarea');
    if (f && g.getAttribute('data-gate') !== 'mcq') { try { f.focus({ preventScroll: false }); } catch (x) { f.focus(); } }
  };
  refresh();

  // slide 14: when the last question is right, say that the reading is finished
  var last = document.querySelector('.ga5-last');
  if (last) {
    last.addEventListener('saa:done', function () {
      var w = last.querySelector('.saa-k-why');
      if (w && w.textContent.indexOf('You have finished') < 0) { w.textContent = w.textContent + ' You have finished this reading. Well done.'; }
    });
  }

  // typed or pasted work is lost on a refresh: ask first
  window.addEventListener('beforeunload', function (e) {
    if (window.__ga5Leaving) { return; }
    var typed = Array.prototype.some.call(document.querySelectorAll('textarea'), function (t) { return t.value.trim(); });
    if (typed) { e.preventDefault(); e.returnValue = ''; }
  });
});
