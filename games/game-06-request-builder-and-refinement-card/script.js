// Registered now (before saa-kit.js loads) so the game's own gate message runs before the
// kit's shared Next lock; the check itself is set up on DOMContentLoaded below.
document.addEventListener('click', function (e) { if (window.__g6Gate) { window.__g6Gate(e); } }, true);
// Slide deck: 6 slides (4 on Side 1 · Build, 2 on Side 2 · Fix). The footer
// Back / Next buttons move between slides; the side tabs reflect (and jump to)
// the side the current slide belongs to. In-memory state only — nothing is
// saved or sent anywhere.
document.addEventListener('DOMContentLoaded', function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var tabs = document.querySelectorAll('.side-tab');
  var backBtn = document.getElementById('deck-back');
  var nextBtn = document.getElementById('deck-next');
  var nextLabel = nextBtn.querySelector('.btn-label');
  var restartBtn = document.getElementById('deck-restart');
  var dotsWrap = document.getElementById('deck-dots');
  var count = document.getElementById('deck-count');
  var total = slides.length;
  var current = 0;

  slides.forEach(function () {
    dotsWrap.appendChild(document.createElement('span'));
  });
  var dots = dotsWrap.querySelectorAll('span');

  function sideOf(i) { return slides[i].getAttribute('data-side'); }

  function show(i) {
    current = Math.max(0, Math.min(total - 1, i));
    slides.forEach(function (slide, n) {
      slide.hidden = n !== current;
      // .active marks the current slide for the shared layer (idle nudge, QA tools).
      slide.classList.toggle('active', n === current);
    });

    var side = sideOf(current);
    tabs.forEach(function (tab) {
      var on = tab.getAttribute('data-tab') === side;
      tab.classList.toggle('active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    dots.forEach(function (dot, n) {
      dot.classList.toggle('is-done', n < current);
      dot.classList.toggle('is-current', n === current);
    });
    count.textContent = (current + 1) + ' / ' + total;

    backBtn.classList.toggle('is-hidden', current === 0);
    backBtn.disabled = current === 0;

    var last = current === total - 1;
    nextBtn.hidden = last;
    restartBtn.hidden = !last;
    // The last Build slide leads into the Fix side, so it keeps the card's
    // original "See the 5 fixes" label.
    var toFix = !last && sideOf(current) === '1' && sideOf(current + 1) === '2';
    nextLabel.textContent = toFix ? 'See the 5 fixes' : 'Next';
  }

  backBtn.addEventListener('click', function () { show(current - 1); });
  nextBtn.addEventListener('click', function () { show(current + 1); });
  // Start again: a clean reload clears every field and every finished activity
  restartBtn.addEventListener('click', function () { window.__g6Leaving = true; location.reload(); });

  // Build gates (slides 2 and 3): each is a .saa-kit[data-required] line, so Next locks
  // and looks locked the same way as on the kit screens.
  var gates = Array.prototype.slice.call(document.querySelectorAll('.ga-gate'));
  function gateOk(g) {
    return g.getAttribute('data-gate').split(',').every(function (id) {
      var f = document.getElementById(id); return f && f.value.trim().length >= 3;
    });
  }
  function refreshGates() {
    gates.forEach(function (g) {
      var d = gateOk(g);
      if (d !== g.classList.contains('is-done')) {
        g.classList.toggle('is-done', d);
        if (d) { g.removeAttribute('data-saa-locked'); } else { g.setAttribute('data-saa-locked', ''); }
        if (d) { g.textContent = ''; try { g.dispatchEvent(new CustomEvent('saa:done', { bubbles: true })); } catch (e) {} }
      }
    });
  }
  function blockAt(g) {
    g.textContent = g.getAttribute('data-msg');
    g.classList.remove('ga-shake'); void g.offsetWidth; g.classList.add('ga-shake');
    var empty = g.getAttribute('data-gate').split(',').map(function (id) { return document.getElementById(id); })
      .filter(function (f) { return f && f.value.trim().length < 3; })[0];
    if (empty) { empty.focus(); }
  }
  window.__g6Refresh = refreshGates;
  document.addEventListener('input', refreshGates);
  document.addEventListener('click', function () { setTimeout(refreshGates, 0); });
  // runs before the kit's own Next lock (registered at the top of this file)
  window.__g6Gate = function (e) {
    if (!(e.target.closest && e.target.closest('#deck-next'))) { return; }
    refreshGates();
    var g = gates.filter(function (x) { return !x.classList.contains('is-done') && x.offsetParent !== null; })[0];
    if (!g) { return; }
    e.preventDefault(); e.stopImmediatePropagation();
    blockAt(g);
  };
  refreshGates();

  // Tabs jump to the first slide of that side.
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var side = tab.getAttribute('data-tab');
      // the Fix side opens only after the request is built (same check as Next)
      if (side === '2') {
        refreshGates();
        var open = gates.filter(function (x) { return !x.classList.contains('is-done'); })[0];
        if (open) { show(slides.indexOf(open.closest('.slide'))); setTimeout(function () { blockAt(open); }, 0); return; }
      }
      for (var n = 0; n < total; n++) {
        if (sideOf(n) === side) { show(n); return; }
      }
    });
  });

  show(0);
});

// Request builder: 4 fields assemble into one live preview sentence. The same
// sentence is mirrored into the small previews on the field slides.
document.addEventListener('DOMContentLoaded', function () {
  var role = document.getElementById('b-role');
  var context = document.getElementById('b-context');
  var task = document.getElementById('b-task');
  var format = document.getElementById('b-format');
  var preview = document.getElementById('prompt-preview');
  var previews = document.querySelectorAll('.prompt-preview');
  var fields = [role, context, task, format];

  function render(target) {
    // Each filled value is wrapped in a span so it can be underlined
    // (textContent — and therefore the copied text — is unchanged).
    var parts = ['You are ', role, '. For ', context, ', ', task, '. Format it as ', format, '.'];
    target.textContent = '';
    parts.forEach(function (part) {
      if (typeof part === 'string') {
        target.appendChild(document.createTextNode(part));
        return;
      }
      var value = part.value.trim();
      var span = document.createElement('span');
      span.className = value ? 'fill' : 'blank';
      span.textContent = value || '___';
      target.appendChild(span);
    });
  }

  function update() {
    previews.forEach(render);
  }

  fields.forEach(function (field) {
    field.addEventListener('input', update);
  });
  update();

  var examples = {
    workshop: {
      role: 'a workshop teacher',
      context: 'new trainees, before the practical',
      task: 'write a short safety reminder',
      format: '3 points for the noticeboard'
    },
    campus: {
      role: 'the class representative',
      context: 'a project submission due Friday (practice date)',
      task: 'write a reminder message for the group',
      format: 'one short message for the class chat'
    }
  };

  document.querySelectorAll('.chip-btn').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var data = examples[chip.getAttribute('data-example')];
      if (!data) return;
      role.value = data.role;
      context.value = data.context;
      task.value = data.task;
      format.value = data.format;
      update();
    });
  });

  // Copy the assembled request to the clipboard.
  var copyBtn = document.getElementById('copy-btn');
  var copyBtnOriginal = copyBtn.innerHTML;

  function showCopied() {
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied';
    setTimeout(function () {
      copyBtn.classList.remove('copied');
      copyBtn.innerHTML = copyBtnOriginal;
    }, 1500);
  }

  function fallbackCopy(text) {
    var temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.top = '0';
    temp.style.left = '0';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    try { document.execCommand('copy'); } catch (e) { /* clipboard unavailable */ }
    document.body.removeChild(temp);
  }

  var copyMsg = document.getElementById('copy-msg');
  copyBtn.addEventListener('click', function () {
    // never copy a request that still has blanks
    var names = ['Role', 'Context', 'Task', 'Format'];
    var missing = fields.filter(function (f) { return f.value.trim().length < 3; });
    if (missing.length) {
      copyMsg.textContent = 'Some blanks are still empty. Tap Back and fill them in first.';
      copyMsg.classList.remove('ga-shake'); void copyMsg.offsetWidth; copyMsg.classList.add('ga-shake');
      return;
    }
    copyMsg.textContent = '';
    var text = preview.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showCopied, function () {
        fallbackCopy(text);
        showCopied();
      });
    } else {
      fallbackCopy(text);
      showCopied();
    }
  });
});

// Game 6 designer assets (Oct 2026): the "Copy request" pill in the paste-guide
// picture works like the real Copy request button.
document.addEventListener('DOMContentLoaded', function () {
  var hit = document.querySelector('.g6-paste-copy');
  var copyBtn = document.getElementById('copy-btn');
  if (hit && copyBtn) hit.addEventListener('click', function () { copyBtn.click(); });
});

// Last slide: when both cards are open, say that the card is finished. The line is read
// after the second card's own text (its clip length), so the two do not cut each other off.
document.addEventListener('DOMContentLoaded', function () {
  var done = document.getElementById('g6-done');
  var kit = done && done.parentNode.querySelector('.saa-kit[data-kit="reveal"]');
  var TEXT = 'You have finished the card. Build and fix your requests like this every time.';
  if (kit) {
    kit.addEventListener('saa:done', function () {
      done.hidden = false; done.textContent = TEXT;
      var wait = 400;
      try {
        var open = kit.querySelectorAll('.saa-card.open .saa-back'), last = open[open.length - 1];
        var c = window.SAA_VO_CLIPS && window.SAA_VO && SAA_VO_CLIPS[SAA_VO.key(SAA_VO.revealText(last))];
        if (c && c.dur) { wait = c.dur * 1000 + 300; }
      } catch (e) {}
      setTimeout(function () { done.textContent = TEXT; }, wait);
    });
  }
  // typed work is lost on a refresh: ask first
  window.addEventListener('beforeunload', function (e) {
    if (window.__g6Leaving) { return; }
    var typed = Array.prototype.some.call(document.querySelectorAll('.builder input'), function (t) { return t.value.trim(); });
    if (typed) { e.preventDefault(); e.returnValue = ''; }
  });
});
