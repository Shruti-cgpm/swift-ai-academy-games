/* ==========================================================================
   Swift AI Academy — slide engine
   Shared by every activity (build.sh puts it at the top of each script.js).
   - Shows one slide at a time; the page itself never scrolls.
   - Scales each slide (through the root font size) until it fits the screen.
   - Owns the footer: progress dashes, Back, and the one amber primary button.
   Activity code talks to it through the global `Deck` object.
   ========================================================================== */
(function (window, document) {
  'use strict';

  var ICONS = {
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    'arrow-down': '<path d="M12 5v14M6 13l6 6 6-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-5M12 8h.01"/>',
    warn: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    open: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    stop: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01"/>',
    mega: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    split: '<path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.2-2.9L3 3"/><path d="m15 9 6-6"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    id: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4M14 14h4"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
    folder: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    tagi: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    table: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
    flag: '<path d="M4 22V4a1 1 0 0 1 1-1h11l-2 4 2 4H5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
    'check-sq': '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    up: '<path d="m18 15-6-6-6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    sort: '<path d="M3 6h18M6 12h12M10 18h4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    flask: '<path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3.3L14 9V3"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>'
  };

  function ic(name) {
    return '<span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24">' + (ICONS[name] || '') + '</svg></span>';
  }

  // Turn every <span data-i="name"></span> into an inline icon.
  function hydrate(root) {
    var els = (root || document).querySelectorAll('[data-i]:not([data-ready])');
    for (var k = 0; k < els.length; k++) {
      var el = els[k];
      el.classList.add('ic');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('data-ready', '');
      el.innerHTML = '<svg viewBox="0 0 24 24">' + (ICONS[el.getAttribute('data-i')] || '') + '</svg>';
    }
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.innerHTML = ic('check') + '<span>' + esc(msg) + '</span>';
    t.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }

  // Copy text, with a fallback for browsers without the Clipboard API.
  function copyText(text, done) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) { /* clipboard unavailable */ }
      document.body.removeChild(ta);
      if (done) done();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { if (done) done(); }, fallback);
    } else {
      fallback();
    }
  }

  // Nothing is saved or sent anywhere, so learners keep their work as a file.
  function download(filename, text) {
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  var Deck = {
    slides: [],
    index: -1,
    hooks: {},

    init: function (hooks) {
      var self = this;
      this.hooks = hooks || {};
      this.app = document.querySelector('.app');
      this.slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
      this.primaryBtn = document.getElementById('primary');
      this.backBtn = document.getElementById('back');
      this.progress = document.getElementById('progress');
      this.lastWidth = window.innerWidth;
      this.slides.forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });
      hydrate(document);

      this.primaryBtn.addEventListener('click', function () { self.primary(); });
      this.backBtn.addEventListener('click', function () { self.back(); });
      document.addEventListener('click', function (e) {
        var t = e.target.closest ? e.target.closest('[data-go]') : null;
        if (t) self.go(t.getAttribute('data-go'));
      });
      window.addEventListener('resize', debounce(function () { self.onResize(); }, 120));
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { self.fit(); });
      }
      this.go(0, true);
    },

    find: function (target) {
      if (typeof target === 'number') return target;
      for (var k = 0; k < this.slides.length; k++) {
        if (this.slides[k].id === target) return k;
      }
      return -1;
    },

    current: function () { return this.slides[this.index]; },

    hook: function () {
      var s = this.current();
      return s ? this.hooks[s.id] : null;
    },

    go: function (target, first) {
      var i = this.find(target);
      if (i < 0 || i >= this.slides.length) return;
      var prev = this.current();
      var prevHook = this.hook();
      if (prev && prevHook && prevHook.leave) prevHook.leave(this, prev);
      if (prev) {
        prev.classList.remove('show');
        prev.setAttribute('aria-hidden', 'true');
      }

      this.index = i;
      var s = this.current();
      this.setPrimary(s.getAttribute('data-next') || 'Continue', {
        hidden: s.getAttribute('data-primary') === 'off',
        icon: s.getAttribute('data-icon') || 'arrow-right'
      });
      this.setBack(i > 0 && s.getAttribute('data-back') !== 'off');
      this.drawDashes();

      var h = this.hook();
      if (h && h.enter) h.enter(this, s);
      hydrate(s);
      this.fit();
      s.classList.add('show');
      s.removeAttribute('aria-hidden');

      if (!first) {
        var head = s.querySelector('h1, h2');
        if (head) {
          head.setAttribute('tabindex', '-1');
          // the layer frees the new screen for focus a moment later: focus its heading then
          var focusHead = function () { if (Deck.current() === s) { try { head.focus({ preventScroll: true }); } catch (e) { head.focus(); } } };
          focusHead(); setTimeout(focusHead, 120);
        }
      }
    },

    next: function () { this.go(this.index + 1); },

    back: function () {
      var h = this.hook();
      if (h && h.back && h.back(this) === false) return;
      var to = this.current().getAttribute('data-back-to');
      this.go(to ? this.find(to) : this.index - 1);
    },

    primary: function () {
      if (this.primaryBtn.disabled || this.primaryBtn.hidden) return;
      var h = this.hook();
      if (h && h.primary && h.primary(this) === false) return;
      this.next();
    },

    setPrimary: function (label, opts) {
      opts = opts || {};
      var b = this.primaryBtn;
      var iconName = opts.icon === undefined ? 'arrow-right' : opts.icon;
      b.hidden = !!opts.hidden;
      b.disabled = !!opts.disabled;
      b.innerHTML = '<span>' + esc(label) + '</span>' + (iconName ? ic(iconName) : '');
    },

    enablePrimary: function (on) { this.primaryBtn.disabled = !on; },

    setBack: function (show) { this.backBtn.hidden = !show; },

    drawDashes: function () {
      var html = '<div class="dashes" aria-hidden="true">';
      for (var k = 0; k < this.slides.length; k++) {
        html += '<i class="' + (k < this.index ? 'done' : (k === this.index ? 'cur' : '')) + '"></i>';
      }
      html += '</div><span class="count">' + (this.index + 1) + ' / ' + this.slides.length + '</span>';
      this.progress.innerHTML = html;
      this.progress.setAttribute('aria-label', 'Screen ' + (this.index + 1) + ' of ' + this.slides.length);
    },

    // Replace the dashes with custom progress (used by the quiz screens).
    setProgress: function (html, label) {
      this.progress.innerHTML = html;
      if (label) this.progress.setAttribute('aria-label', label);
    },

    overflows: function (card) {
      return card.scrollHeight > card.clientHeight + 1 ||
        card.scrollWidth > card.clientWidth + 1 ||
        this.app.scrollHeight > this.app.clientHeight + 1;
    },

    // Shrink the whole frame a little at a time until the slide fits.
    // Only on very small screens does the card itself get a scrollbar.
    fit: function () {
      var s = this.current();
      if (!s) return;
      var card = s.querySelector('.card') || s.firstElementChild;
      if (!card) return;
      var root = document.documentElement;
      var w = window.innerWidth;
      var h = window.innerHeight;
      var size = w <= 760 ? 15 : Math.max(13, Math.min(17, h / 50));
      var guard = 0;
      card.classList.remove('scroll');
      root.style.fontSize = size + 'px';
      while (this.overflows(card) && size > 12 && guard++ < 30) {
        size -= 0.5;
        root.style.fontSize = size + 'px';
      }
      if (this.overflows(card)) card.classList.add('scroll');
    },

    onResize: function () {
      var a = document.activeElement;
      var typing = a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName);
      // A phone keyboard opening changes only the height: do not rescale mid-typing.
      if (typing && window.innerWidth === this.lastWidth) return;
      this.lastWidth = window.innerWidth;
      this.fit();
    }
  };

  window.Deck = Deck;
  window.SAA = {
    ic: ic,
    esc: esc,
    hydrate: hydrate,
    shuffle: shuffle,
    toast: toast,
    copyText: copyText,
    download: download
  };
})(window, document);
/* ==========================================================================
   Rewrite Five Weak Requests (AAI-E-MC1-S02-LAB01)
   Each exercise is three short screens: spot the gap, rewrite it, compare.
   Nothing here is saved or sent anywhere. The learner downloads their
   answers as a text file at the end, as evidence for the facilitator.
   ========================================================================== */
(function () {
  'use strict';
  var ic = SAA.ic, esc = SAA.esc;
  function $(id) { return document.getElementById(id); }

  var PARTS = ['role', 'context', 'task', 'format'];
  var LABEL = { role: 'Role', context: 'Context', task: 'Task', format: 'Format' };
  var MEANS = {
    role: 'Role says who the AI should act as.',
    context: 'Context says who it is for, and why.',
    task: 'Task says what the AI should make.',
    format: 'Format says how the answer should look.'
  };

  var EXERCISES = [
    { weak: 'You are a workshop instructor. Write a safety reminder. Format it as 3 points for the noticeboard.',
      missing: ['context'],
      why: 'The AI does not know who will read the reminder, or why.',
      tip: 'Add who the reminder is for, and why. You can start with “For new trainees, before their first practical, …”',
      whyHint: 'Example: It told the AI who the reminder was for.' },
    { weak: 'For new trainees, before the practical, write a safety reminder. Format it as 3 points for the noticeboard.',
      missing: ['role'],
      why: 'The AI does not know whose voice to use.',
      tip: 'Add who the AI should act as. You can start with “You are a workshop instructor.”',
      whyHint: 'Example: It told the AI who to act as.' },
    { weak: 'You are the class representative. The group project is due on Friday (a made-up date). Format it as one short message.',
      missing: ['task'],
      why: 'The request never says what the AI should write.',
      tip: 'Add what the AI should make. You can add “Write a reminder asking everyone to finish their part.”',
      whyHint: 'Example: It said what the AI should write.' },
    { weak: 'You are a lab assistant. Students have a chemistry practical today. Write a short safety note.',
      missing: ['format'],
      why: 'The request never says how long the note should be, or how it should look.',
      tip: 'Add how the note should look. You can add “Format it as 4 short points for the board.”',
      whyHint: 'Example: It said how the answer should look.' },
    { weak: 'Write about machine maintenance.',
      missing: ['role', 'context', 'format'], mixed: true,
      why: 'The request has only a vague task. The AI does not know who to be, who the answer is for, or how it should look.',
      tip: 'Add who the AI should act as, who the answer is for and why, and how it should look.',
      whyHint: 'Example: It needed all 4 parts, not just one.' }
  ];

  // State for each exercise. Nothing leaves this page.
  var state = EXERCISES.map(function () {
    return { picked: [], checked: false, rewrite: null, better: '' };
  });

  function and(l) {
    return l.length > 1 ? l.slice(0, -1).join(', ') + ' and ' + l[l.length - 1] : l[0];
  }
  function names(list) {
    return and(list.map(function (p) { return LABEL[p]; }));
  }

  /* ---------- build three slides per exercise ---------- */
  var html = EXERCISES.map(function (ex, k) {
    var n = k + 1, last = n === EXERCISES.length;
    var chips = PARTS.map(function (p) {
      return '<button type="button" class="chip" aria-pressed="false" data-part="' + p + '"><img class="chip-ic b" src="assets/icons/blue/icon-' + p + '.webp" alt="" aria-hidden="true"><img class="chip-ic w" src="assets/icons/icon-' + p + '.webp" alt="" aria-hidden="true">' + LABEL[p] + '</button>';
    }).join('');
    return '' +
      // 1 · Spot the gap
      '<section class="slide" id="ex' + n + '-spot" data-next="Check answer" data-icon="check">' +
        '<div class="card narrow" data-saa-lead>' +
          '<div class="head"><div class="eyebrow">Exercise ' + n + ' of 5 · Spot the gap' + (ex.mixed ? ' · Mixed' : '') + '</div>' +
          '<h2 class="title">What is missing from this request?</h2>' +
          '<p class="lede">' + (ex.mixed ? 'More than one part may be missing from this request.' : 'This request is missing 1 of the 4 parts.') + '</p>' +
          '<p class="do saa-do"><b class="saa-do-label">Your task.</b> ' +
            (ex.mixed ? 'Tap every part that is missing, then press Check answer.' : 'Tap the part that is missing, then press Check answer.') + '</p></div>' +
          '<div class="doc weak" data-saa-say><div class="doc-head">' + ic('chat') + 'Weak request</div><p class="weak-text">“' + esc(ex.weak) + '”</p></div>' +
          '<div class="field"><span class="label saa-vo-skip" id="ex' + n + '-lbl">The 4 parts of a request</span><div class="chips parts" role="group" aria-labelledby="ex' + n + '-lbl" data-ex="' + k + '">' + chips + '</div></div>' +
          '<div class="spot-fb saa-k-why" id="ex' + n + '-fb" aria-live="polite"></div>' +
        '</div>' +
      '</section>' +
      // 2 · Rewrite it
      '<section class="slide" id="ex' + n + '-write">' +
        '<div class="card narrow">' +
          '<div class="head"><div class="eyebrow">Exercise ' + n + ' of 5 · Rewrite it</div>' +
          '<h2 class="title">Add the missing part' + (ex.missing.length > 1 ? 's' : '') + ' to the request.</h2>' +
          '<p class="lede"><strong>' + ex.missing.map(function (p) { return '<img class="hint-ic" src="assets/icons/blue/icon-' + p + '.webp" alt="" aria-hidden="true">'; }).join('') + names(ex.missing) + (ex.missing.length > 1 ? ' are' : ' is') + ' missing.</strong> ' + esc(ex.tip) + '</p>' +
          '<p class="do saa-do"><b class="saa-do-label">Your task.</b> Edit the weak request in the box and add the missing part' + (ex.missing.length > 1 ? 's' : '') + '.</p></div>' +
          '<div class="field"><label class="label" for="ex' + n + '-rewrite">Your rewrite</label>' +
          '<textarea class="input" id="ex' + n + '-rewrite" rows="4"></textarea></div>' +
          '<div class="row">' +
            '<button type="button" class="btn btn-ghost btn-sm" data-copy-weak="' + k + '">' + ic('copy') + 'Copy weak request</button>' +
            '<button type="button" class="btn btn-ghost btn-sm" data-copy-new="' + k + '">' + ic('copy') + 'Copy my rewrite</button>' +
          '</div>' +
          '<p class="small">Next, you try both requests in your AI tool.</p>' +
          '<p class="ga-gate saa-k-why" data-saa-locked data-gate="write" data-ex="' + k + '" aria-live="polite"></p>' +
        '</div>' +
      '</section>' +
      // 3 · Compare
      '<section class="slide" id="ex' + n + '-compare" data-next="' + (last ? 'Review and finish' : 'Next exercise') + '">' +
        '<div class="card">' +
          '<div class="head"><div class="eyebrow">Exercise ' + n + ' of 5 · Compare</div>' +
          '<h2 class="title">Try both requests and compare the answers.</h2>' +
          '<p class="lede">Ask your AI tool the weak request first, then your rewrite. Paste each answer in its box.</p>' +
          '<p class="do saa-do"><b class="saa-do-label">Your task.</b> Paste both answers, choose the better one and say why.</p></div>' +
          '<div class="grid g2">' +
            '<div class="field"><label class="label" for="ex' + n + '-out-weak">Answer to the weak request</label>' +
            '<textarea class="input" id="ex' + n + '-out-weak" rows="4" placeholder="Paste the AI’s answer here"></textarea></div>' +
            '<div class="field"><label class="label" for="ex' + n + '-out-new">Answer to your rewrite</label>' +
            '<textarea class="input" id="ex' + n + '-out-new" rows="4" placeholder="Paste the AI’s answer here"></textarea></div>' +
          '</div>' +
          '<div class="compare-row">' +
            '<div class="field"><span class="label" id="ex' + n + '-better-lbl">Which answer is better?</span>' +
            '<div class="seg" role="group" aria-labelledby="ex' + n + '-better-lbl" data-better="' + k + '">' +
              '<button type="button" aria-pressed="false" data-v="Weak request">' + ic('chat') + 'Weak request</button>' +
              '<button type="button" aria-pressed="false" data-v="My rewrite">' + ic('pen') + 'My rewrite</button>' +
            '</div></div>' +
            '<div class="field grow"><label class="label" for="ex' + n + '-why">Why is it better? <span class="help">One line is enough.</span></label>' +
            '<input class="input" type="text" id="ex' + n + '-why" placeholder="' + esc(ex.whyHint) + '"></div>' +
          '</div>' +
          '<div id="ex' + n + '-better-fb" class="saa-k-why"></div>' +
          '<p class="ga-gate saa-k-why" data-saa-locked data-gate="compare" data-ex="' + k + '" aria-live="polite"></p>' +
          (n === 1 ? '<button type="button" class="btn-link see-ex" data-see-example aria-haspopup="dialog"><img class="see-ic" src="assets/icons/icon-compare.webp" alt="" aria-hidden="true">See example</button>' : '') +
        '</div>' +
      '</section>';
  }).join('');
  $('evidence').insertAdjacentHTML('beforebegin', html);

  /* ---------- spot the gap ---------- */
  document.querySelectorAll('.chips.parts').forEach(function (group) {
    var k = parseInt(group.getAttribute('data-ex'), 10);
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-part]');
      if (!chip || state[k].checked) return;
      var on = chip.getAttribute('aria-pressed') !== 'true';
      chip.setAttribute('aria-pressed', String(on));
      state[k].picked = Array.prototype.map.call(group.querySelectorAll('[aria-pressed="true"]'), function (c) { return c.getAttribute('data-part'); });
      Deck.enablePrimary(state[k].picked.length > 0);
    });
  });

  function checkSpot(k) {
    var ex = EXERCISES[k], s = state[k], n = k + 1;
    var ok = s.picked.length === ex.missing.length && s.picked.every(function (p) { return ex.missing.indexOf(p) > -1; });
    s.checked = true;
    document.querySelectorAll('#ex' + n + '-spot [data-part]').forEach(function (c) {
      var p = c.getAttribute('data-part');
      c.disabled = true;
      c.setAttribute('aria-pressed', 'false');
      var miss = ex.missing.indexOf(p) > -1, pick = s.picked.indexOf(p) > -1;
      if (miss && pick) c.classList.add('right');
      else if (miss) c.classList.add('miss');        /* a missing part the learner did not tap */
      else if (pick) c.classList.add('wrong');
    });
    var meaning = ex.missing.map(function (p) { return MEANS[p]; }).join(' ');
    $('ex' + n + '-fb').innerHTML = ok
      ? '<div class="fb ok">' + ic('check') + '<div class="fb-body"><span class="fb-title">Yes. ' + names(ex.missing) + (ex.missing.length > 1 ? ' are' : ' is') + ' missing.</span> <span>' + esc(ex.why) + ' ' + esc(meaning) + '</span></div></div>'
      : '<div class="fb no">' + ic('alert') + '<div class="fb-body"><span class="fb-title">Not quite. The missing part' + (ex.missing.length > 1 ? 's are ' : ' is ') + names(ex.missing) + '.</span> <span>' + esc(ex.why) + ' ' + esc(meaning) + '</span></div></div>';
  }

  /* ---------- rewrite ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy-weak],[data-copy-new]');
    if (!b) return;
    var k = parseInt(b.getAttribute('data-copy-weak') || b.getAttribute('data-copy-new'), 10);
    var weak = b.hasAttribute('data-copy-weak');
    var text = weak ? EXERCISES[k].weak : $('ex' + (k + 1) + '-rewrite').value.trim();
    if (!text) { SAA.toast('Write your rewrite first.'); return; }
    if (!weak && text === EXERCISES[k].weak) { SAA.toast('Add the missing part first.'); return; }
    SAA.copyText(text, function () { SAA.toast(weak ? 'The weak request is copied.' : 'Your rewrite is copied.'); });
  });

  /* ---------- compare ---------- */
  var BETTER_FB = {
    'Weak request': ['info', 'That can happen. Look again and ask if the weak answer really gives you what you need.'],
    'My rewrite': ['ok', 'Yes. A clear request usually gives a more useful answer.']
  };
  document.querySelectorAll('[data-better]').forEach(function (seg) {
    var k = parseInt(seg.getAttribute('data-better'), 10);
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('[data-v]');
      if (!b) return;
      state[k].better = b.getAttribute('data-v');
      seg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      var fb = BETTER_FB[state[k].better];
      $('ex' + (k + 1) + '-better-fb').innerHTML = '<div class="callout ' + fb[0] + '">' + ic(fb[0] === 'ok' ? 'check' : 'eye') + '<span>' + fb[1] + '</span></div>';
      Deck.fit();
    });
  });

  /* ---------- "See example": how to try both requests (exercise 1) ---------- */
  var exPop = document.createElement('div');
  exPop.className = 'ex-pop';
  exPop.hidden = true;
  exPop.innerHTML = '<div class="ex-pop-box" role="dialog" aria-modal="true" aria-label="Example: try both requests">' +
    '<figure class="ex-fig" role="img" aria-label="Example. Left: the weak request in an AI tool gives a vague answer: be careful, follow safety rules, work responsibly. Right: the rewrite with context gives a clearer answer: wear the safety gear, wait for your instructor, tell your instructor if anything looks unsafe. An arrow shows each answer copied into its own paste box.">' +
    '<span class="half l"><img src="assets/tool-chat-frame-compare.webp" alt=""></span><span class="half r"><img src="assets/tool-chat-frame-compare.webp" alt=""></span></figure>' +
    '<button type="button" class="btn btn-ghost btn-sm ex-pop-close">' + ic('x') + 'Close</button></div>';
  document.body.appendChild(exPop);
  var exOpener = null;
  function closeEx() { if (exPop.hidden) return; exPop.hidden = true; if (exOpener) { try { exOpener.focus(); } catch (e) {} } }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-see-example]');
    if (b) { exOpener = b; exPop.hidden = false; exPop.querySelector('.ex-pop-close').focus(); return; }
    if (!exPop.hidden && (e.target === exPop || e.target.closest('.ex-pop-close'))) closeEx();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeEx(); });

  /* ---------- evidence and download ---------- */
  function val(id) { var el = $(id); return el ? el.value.trim() : ''; }
  function rewriteDone(k) { var v = val('ex' + (k + 1) + '-rewrite'); return !!v && v !== EXERCISES[k].weak; }
  function gaps(k) {
    var n = k + 1, list = [];
    if (!state[k].checked) list.push(['spot', 'the missing part']);
    if (!rewriteDone(k)) list.push(['write', 'your rewrite']);
    if (!val('ex' + n + '-out-weak') || !val('ex' + n + '-out-new')) list.push(['compare', 'both answers']);
    if (!state[k].better || !val('ex' + n + '-why')) list.push(['compare', 'your choice and reason']);
    return list;
  }
  // First few words of a request, so the checklist does not give away the answers.
  function short(text) {
    var words = text.split(' ');
    return words.length > 5 ? words.slice(0, 5).join(' ') + '…' : text;
  }
  function drawEvidence() {
    $('evidence-list').innerHTML = EXERCISES.map(function (ex, k) {
      var g = gaps(k);
      return '<li><span class="dot-ic sm ' + (g.length ? '' : 'ok') + '">' + ic(g.length ? 'pen' : 'check') + '</span>' +
        '<span class="li-main"><span class="li-title">Exercise ' + (k + 1) + ' · “' + esc(short(ex.weak)) + '”</span>' +
        '<span class="li-sub">' + (g.length ? 'You still need to add ' + and(g.map(function (x) { return x[1]; })) + '.' : 'This exercise is done.') + '</span></span>' +
        (g.length ? '<button type="button" class="btn-link" data-go="ex' + (k + 1) + '-' + g[0][0] + '">Open</button>' : '') + '</li>';
    }).join('');
  }

  function buildFile() {
    function or(v) { return v || '(not answered)'; }
    var lines = ['Rewrite Five Weak Requests: my answers', 'Swift AI Academy · AAI-E-MC1-S02-LAB01', ''];
    EXERCISES.forEach(function (ex, k) {
      var n = k + 1, s = state[k];
      lines.push('Exercise ' + n);
      lines.push('Weak request: ' + ex.weak);
      lines.push('What I said was missing: ' + (s.checked ? names(s.picked) : '(not answered)') + '  |  Missing: ' + names(ex.missing));
      lines.push('My rewrite: ' + (rewriteDone(k) ? val('ex' + n + '-rewrite') : '(not answered)'));
      lines.push('Answer to the weak request: ' + or(val('ex' + n + '-out-weak')));
      lines.push('Answer to my rewrite: ' + or(val('ex' + n + '-out-new')));
      lines.push('Better answer: ' + or(s.better));
      lines.push('Why: ' + or(val('ex' + n + '-why')));
      lines.push('');
    });
    return lines.join('\n');
  }
  function allGaps() { var n = 0; EXERCISES.forEach(function (ex, k) { n += gaps(k).length ? 1 : 0; }); return n; }
  function save(quiet) {
    SAA.download('rewrite-five-weak-requests-answers.txt', buildFile());
    var open = allGaps();
    $('done-status').textContent = open ? 'Your answers are downloaded, but ' + open + (open > 1 ? ' exercises are' : ' exercise is') + ' not finished.' : 'Your answers are downloaded.';
    $('done-status').className = 'status saa-vo-skip ' + (open ? 'bad' : 'ok');
    $('done-lede').textContent = open ? 'Go back, finish every exercise and download again. Then share your file with your facilitator.' : 'You found the gaps, fixed 5 requests and compared the answers. Share your file with your facilitator.';
    if (!quiet) SAA.toast('Your answers are downloaded.');
  }
  $('download-again').addEventListener('click', function () { save(true); });   /* the status line says it; a toast would cover the rule line */
  // Start over: a clean reload clears every answer
  $('start-over').addEventListener('click', function () { window.__g7Leaving = true; location.reload(); });
  var warned = false;

  /* ---------- hooks ---------- */
  var hooks = {
    evidence: {
      enter: function () { warned = false; $('evidence-warn').hidden = true; drawEvidence(); },
      primary: function () {
        // unfinished work: say so once, then the learner may still download
        if (allGaps() && !warned) {
          warned = true; $('evidence-warn').hidden = false;
          var wt = $('evidence-warn').lastElementChild; wt.textContent = wt.textContent;   /* new text: the layer reads it */
          Deck.setPrimary('Download anyway', { icon: 'download' });
          Deck.fit();
          return false;
        }
        save(true);
      }
    }
  };
  EXERCISES.forEach(function (ex, k) {
    var n = k + 1;
    hooks['ex' + n + '-spot'] = {
      enter: function () {
        if (state[k].checked) Deck.setPrimary('Rewrite it');
        else Deck.setPrimary('Check answer', { icon: 'check', disabled: !state[k].picked.length });
      },
      primary: function () {
        if (!state[k].checked) {
          checkSpot(k);
          Deck.setPrimary('Rewrite it');
          Deck.fit();
          return false;
        }
      }
    };
    hooks['ex' + n + '-write'] = {
      // Start from the weak request, so the learner only adds what is missing.
      enter: function () {
        var t = $('ex' + n + '-rewrite');
        if (state[k].rewrite === null) { t.value = ex.weak; state[k].rewrite = ex.weak; }
      }
    };
  });

  /* ---------- gates: Continue on the rewrite and compare screens waits for the work ----------
     Each gate line carries data-saa-locked until its task is done, so the shared kit dims
     Continue the same way as on the kit screens; this script blocks the click itself. Pressing it early shows what is still needed. */
  var MIN_NEW = 3, MIN_PASTE = 15, MIN_WHY = 3;
  function wordList(v) { return (v.toLowerCase().match(/[a-z0-9\u0900-\u097f]+/g) || []); }
  function words(v) { return v.split(/\s+/).filter(function (w) { return /\w/.test(w); }).length; }
  function gateMsg(g) {
    var k = +g.getAttribute('data-ex'), n = k + 1, ex = EXERCISES[k];
    if (g.getAttribute('data-gate') === 'write') {
      // at least MIN_NEW words that are not in the weak request (retyping or cutting it does not count)
      var old = {}; wordList(ex.weak).forEach(function (w) { old[w] = 1; });
      var added = {}; wordList(val('ex' + n + '-rewrite')).forEach(function (w) { if (!old[w]) added[w] = 1; });
      return Object.keys(added).length >= MIN_NEW ? '' : 'Add what is missing to the request first.';
    }
    if (val('ex' + n + '-out-weak').length < MIN_PASTE || val('ex' + n + '-out-new').length < MIN_PASTE) return 'Paste both answers first.';
    if (!state[k].better) return 'Choose the better answer first.';
    if (words(val('ex' + n + '-why')) < MIN_WHY) return 'Say why it is better first.';
    return '';
  }
  var gates = Array.prototype.slice.call(document.querySelectorAll('.ga-gate'));
  function refreshGates() {
    gates.forEach(function (g) {
      var d = !gateMsg(g);
      if (d !== g.classList.contains('is-done')) {
        g.classList.toggle('is-done', d);
        if (d) { g.removeAttribute('data-saa-locked'); } else { g.setAttribute('data-saa-locked', ''); }
        if (d) { g.textContent = ''; try { g.dispatchEvent(new CustomEvent('saa:done', { bubbles: true })); } catch (e) {} }
      }
    });
  }
  document.addEventListener('input', refreshGates);
  document.addEventListener('click', function () { setTimeout(refreshGates, 0); });
  // registered before saa-kit.js loads
  document.addEventListener('click', function (e) {
    if (!(e.target.closest && e.target.closest('#primary'))) return;
    var s = Deck.current(), g = s && s.querySelector('.ga-gate');
    if (!g) return;
    var m = gateMsg(g);
    if (!m) { refreshGates(); return; }
    e.preventDefault(); e.stopImmediatePropagation();
    refreshGates();
    g.textContent = m;
    g.classList.remove('ga-shake'); void g.offsetWidth; g.classList.add('ga-shake');
    var f = s.querySelector('textarea, input');
    if (g.getAttribute('data-gate') === 'compare') {
      f = [].filter.call(s.querySelectorAll('textarea, input'), function (x) { return x.tagName === 'TEXTAREA' ? x.value.trim().length < MIN_PASTE : words(x.value) < MIN_WHY; })[0];
      if (m.indexOf('Choose') === 0) f = s.querySelector('.seg button');
    }
    if (f) { try { f.focus({ preventScroll: false }); } catch (x) { f.focus(); } }
    Deck.fit();
  }, true);

  // typed or pasted work is lost on a refresh: ask first
  window.addEventListener('beforeunload', function (e) {
    if (window.__g7Leaving) return;
    var typed = EXERCISES.some(function (ex, k) { var n = k + 1; return rewriteDone(k) || val('ex' + n + '-out-weak') || val('ex' + n + '-out-new') || val('ex' + n + '-why'); });
    if (typed) { e.preventDefault(); e.returnValue = ''; }
  });

  Deck.init(hooks);
  refreshGates();
})();
