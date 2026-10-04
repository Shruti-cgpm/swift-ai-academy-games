// Slide deck: one .slide visible at a time inside a fixed 100dvh frame.
// The footer holds the progress bar, the "n / N" counter and Back/Next.
// A slide can rename the Next button with data-next="..."; the slide
// marked data-last hides Next (its own Download button is the primary)
// and shows Start over instead. In-memory state only — nothing is saved.
document.addEventListener("DOMContentLoaded", function () {
  var slides = document.querySelectorAll(".slide");
  var total = slides.length;
  var progress = document.getElementById("progress");
  var counter = document.getElementById("counter");
  var backBtn = document.getElementById("nav-back");
  var nextBtn = document.getElementById("nav-next");
  var nextLbl = nextBtn.querySelector(".lbl");
  var restartBtn = document.getElementById("nav-restart");
  var current = 0;

  // Gates (QA Oct 2026): a screen with typing or choosing keeps Next locked
  // until its task is done. Each check returns '' when done, or a short message.
  function filled(id, min) {
    var el = document.getElementById(id);
    return !!el && el.value.replace(/\s+/g, ' ').trim().length >= min;
  }
  function gateOf(slide) {
    if (slide.querySelector('#partner-name')) {
      return filled('partner-name', 2) ? '' : "Type your partner's name to go on.";
    }
    if (slide.querySelector('#r1-request')) {
      if (!filled('r1-request', 10)) { return "Type your partner's improved request to go on."; }
      return slide.querySelector('.diag-chip.selected') ? '' : 'Tap at least one part to go on.';
    }
    if (slide.querySelector('#r1-strength')) {
      return filled('r1-strength', 4) && filled('r1-risk', 4) && filled('r1-change', 4) ? '' : 'Fill in all three boxes to go on.';
    }
    if (slide.querySelector('#r2-strength')) {
      return filled('r2-strength', 4) && filled('r2-risk', 4) && filled('r2-change', 4) ? '' : 'Fill in all three boxes to go on.';
    }
    if (slide.querySelector('#r2-revision')) {
      return filled('r2-revision', 10) ? '' : 'Type your revised request to go on.';
    }
    var grp = slide.querySelector('.mcq-group');
    if (grp) { return grp.querySelector('.mcq-option.selected') ? '' : 'Tap one answer to go on.'; }
    return '';
  }
  function gateMsgEl(slide) {
    var m = slide.querySelector('.g10-gate');
    if (!m) {
      var box = slide.querySelector('.practice-box');
      if (!box) { return null; }
      m = document.createElement('p');
      m.className = 'g10-gate saa-vo-skip';
      m.setAttribute('aria-live', 'polite');
      box.appendChild(m);
    }
    return m;
  }
  // Locked screens carry data-saa-locked: the shared kit then dims Next (aria-disabled).
  // Next can still be pressed; it then shows what is left to do.
  function updateGate(tried) {
    var slide = slides[current];
    var msg = gateOf(slide);
    if (msg) { slide.setAttribute('data-saa-locked', ''); } else { slide.removeAttribute('data-saa-locked'); }
    var m = gateMsgEl(slide);
    if (tried && msg) { slide.__gateTried = true; }
    if (m) { m.textContent = msg; m.hidden = !(msg && slide.__gateTried); }
  }
  document.addEventListener('input', function () { updateGate(); });
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.diag-chip, .mcq-option')) { setTimeout(updateGate, 0); }
  });

  for (var i = 0; i < total; i++) {
    progress.appendChild(document.createElement("span")).className = "progress-dot";
  }
  var dots = progress.querySelectorAll(".progress-dot");

  function showSlide(index) {
    current = Math.max(0, Math.min(total - 1, index));
    slides.forEach(function (slide, i) {
      slide.hidden = i !== current;
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === current);
      dot.classList.toggle("is-done", i < current);
    });
    var slide = slides[current];
    var isLast = slide.hasAttribute("data-last");
    counter.textContent = (current + 1) + " / " + total;
    backBtn.style.visibility = current === 0 ? "hidden" : "visible";
    nextBtn.hidden = isLast;
    restartBtn.hidden = !isLast;
    nextLbl.textContent = slide.getAttribute("data-next") || "Next";
    // A new screen opens at its top (phones keep the scroll position otherwise).
    Array.prototype.forEach.call(document.querySelectorAll('.saa-scrollzone, #stage'), function (z) { z.scrollTop = 0; });
    updateGate();
  }

  backBtn.addEventListener("click", function () { showSlide(current - 1); });
  nextBtn.addEventListener("click", function () {
    if (gateOf(slides[current])) { updateGate(true); return; }
    showSlide(current + 1);
  });
  // Start over: a clean page, so the next pair never sees this record.
  restartBtn.addEventListener("click", function () { window.location.reload(); });

  showSlide(0);
});

// Multi-select diagnosis chips (which CRTF parts are present).
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.diag-row').forEach(function (row) {
    row.querySelectorAll('.diag-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        chip.classList.toggle('selected');
      });
    });
  });
});

// Single-select move / MCQ chips.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.mcq-group').forEach(function (group) {
    var options = group.querySelectorAll('.mcq-option');
    var feedback = group.querySelector('.mcq-feedback');
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

// Download my record: compile the whole exchange into one plain-text
// file the learner can keep as evidence, since nothing here is saved.
document.addEventListener('DOMContentLoaded', function () {
  var downloadBtn = document.getElementById('download-btn');
  if (!downloadBtn) return;

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function selectedChips(row) {
    var labels = { context: 'Context', role: 'Role', task: 'Task', format: 'Format' };
    var chosen = Array.prototype.filter
      .call(row.querySelectorAll('.diag-chip'), function (c) { return c.classList.contains('selected'); })
      .map(function (c) { return labels[c.getAttribute('data-el')]; });
    return chosen.length ? chosen.join(', ') : '(none marked)';
  }

  function selectedOption(group) {
    var selected = group.querySelector('.mcq-option.selected');
    return selected ? selected.textContent.trim() : '(not answered)';
  }

  downloadBtn.addEventListener('click', function () {
    var groups = document.querySelectorAll('.mcq-group');

    var lines = [
      'Peer Exchange — Framing and Refining — my record',
      '',
      'Partner: ' + (val('partner-name') || '(not answered)'),
      '',
      'Round 1 — I reviewed my partner',
      "My partner's improved request: " + (val('r1-request') || '(not answered)'),
      'Parts present in their request: ' + selectedChips(document.querySelector('.diag-row')),
      'Move they used: ' + selectedOption(groups[0]),
      'Strength: ' + (val('r1-strength') || '(not answered)'),
      'Risk: ' + (val('r1-risk') || '(not answered)'),
      'Suggested change: ' + (val('r1-change') || '(not answered)'),
      '',
      'Round 2 — My partner reviewed me',
      'Strength I received: ' + (val('r2-strength') || '(not answered)'),
      'Risk I received: ' + (val('r2-risk') || '(not answered)'),
      'Change suggested to me: ' + (val('r2-change') || '(not answered)'),
      'My revised request: ' + (val('r2-revision') || '(not answered)'),
      'Did the feedback help: ' + selectedOption(groups[1])
    ];

    var blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'peer-exchange-record.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
});

// Game 10 designer assets (Oct 2026): the layer has already split each slide
// into .saa-lead / .saa-work. Move the left-column picture under the slide's
// own text (above "Your task"); no words are added. Put the two partners on
// the start screen built by the layer.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.g10-lead-fig').forEach(function (fig) {
    var slide = fig.closest('.slide');
    var lead = slide && slide.querySelector('.saa-lead');
    if (!lead) { return; }
    var task = lead.querySelector('.do');
    if (task) { lead.insertBefore(fig, task); } else { lead.appendChild(fig); }
  });

  setTimeout(function () {
    var mid = document.querySelector('#saa-start .saa-mid');
    if (!mid || mid.querySelector('.g10-start-hero')) { return; }
    var img = document.createElement('img');
    img.className = 'g10-start-hero';
    img.src = 'assets/scene-peer-exchange-600.webp';
    img.alt = 'An ITI trainee and a college student swap one phone to review each other\'s work.';
    mid.insertBefore(img, mid.firstChild);
  }, 0);
});

// The scene on screen 7: tap the picture to see it bigger (its words are small).
document.addEventListener('DOMContentLoaded', function () {
  var img = document.querySelector('.g10-disagree img');
  if (!img) { return; }
  function toggle(on) {
    var open = typeof on === 'boolean' ? on : !img.classList.contains('g10-zoom');
    img.classList.toggle('g10-zoom', open);
    document.body.classList.toggle('g10-zoom-on', open);
    img.title = open ? 'Tap to close' : 'Tap to make the picture bigger';
  }
  img.addEventListener('click', function () { toggle(); });
  img.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    if (e.key === 'Escape') { toggle(false); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { toggle(false); } });
  document.getElementById('nav-next').addEventListener('click', function () { toggle(false); });
  document.getElementById('nav-back').addEventListener('click', function () { toggle(false); });
});
