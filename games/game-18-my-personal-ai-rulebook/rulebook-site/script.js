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
          try { head.focus({ preventScroll: true }); } catch (e) { head.focus(); }
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
   My Personal AI Rulebook · Check Before You Use (AAI-E-MC1-S03-RULE01)
   A required (gated) step: the learner fills in their own rulebook page.
   The page builds as they answer. Nothing is saved or sent anywhere, so the
   learner downloads or prints the finished page at the end.
   ========================================================================== */
(function () {
  'use strict';
  var ic = SAA.ic, esc = SAA.esc;
  function $(id) { return document.getElementById(id); }

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function niceDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? parseInt(m[3], 10) + ' ' + MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1] : '';
  }

  var data = {
    assistant: '', account: '', device: '', help: '',
    marks: [], method: [], sources: '',
    peerDone: false, peerName: '',
    version: 'v1', date: today(), declared: false
  };
  $('f-date').value = data.date;

  var EXAMPLES = {
    iti: {
      assistant: 'SwiftChat, approved by my ITI facilitator', account: 'Account from my institute', device: 'Shared lab computer',
      help: 'My workshop facilitator', marks: ['Facts', 'Numbers', 'Dates', 'Names', 'Sources'],
      method: ['I separate what is supported from what is not', 'I verify, then correct, qualify or remove', 'I pause before I send'],
      sources: 'The tool register, the attendance sheet, my facilitator', peerDone: true, peerName: 'My batchmate',
      version: 'v1', date: '2026-09-12', declared: true
    },
    higher: {
      assistant: 'Campus-approved AI writing assistant', account: 'My own account, approved for coursework', device: 'My own laptop',
      help: 'My course coordinator', marks: ['Facts', 'Numbers', 'Dates', 'Names', 'Sources'],
      method: ['I separate what is supported from what is not', 'I verify, then correct, qualify or remove', 'I pause before I send'],
      sources: 'The submission portal, the course notice board, my coordinator', peerDone: true, peerName: 'My classmate',
      version: 'v1', date: '2026-09-09', declared: true
    }
  };

  // key, label, value, the slide that asks for it
  function rows(d) {
    return [
      ['assistant', 'Approved assistant', d.assistant, 'r1-tool'],
      ['account', 'Account type', d.account, 'r1-tool'],
      ['device', 'Device', d.device, 'r1-help'],
      ['help', 'Who I ask for help', d.help, 'r1-help'],
      ['marks', 'I mark', d.marks.join(', '), 'r3-mark'],
      ['method', 'My method', d.method.join('; '), 'r3-mark'],
      ['sources', 'I check against', d.sources, 'r3-source'],
      ['peer', 'Explained to a peer', d.peerDone ? 'Yes, to ' + (d.peerName || 'a peer') : '', 'r3-source'],
      ['version', 'Version and date', d.version && d.date ? d.version + ' · ' + niceDate(d.date) : '', 'r3-sign'],
      ['declared', 'Declaration', d.declared ? 'Signed: these are my own words' : '', 'r3-sign']
    ];
  }

  function rulebookHTML(d, opts) {
    opts = opts || {};
    return '<div class="passport' + (opts.mini ? ' mini' : '') + '">' +
      '<div class="passport-head">' +
      (opts.author ? '<figure class="rb-author"><img src="assets/art/avatar-' + (opts.author === 'iti' ? 'iti' : 'college') + '-author.webp" width="160" height="160" alt="' +
        (opts.author === 'iti' ? 'Made-up ITI trainee' : 'Made-up college student') + '"><figcaption>MADE-UP PERSON</figcaption></figure>' : '') +
      '<div class="passport-title"><strong>My Personal AI Rulebook</strong><span>Section 1.3 · Check Before You Use</span></div>' +
      (opts.tag ? '<span class="tag">' + esc(opts.tag) + '</span>' : '') +
      '<span class="seal' + (d.declared ? ' ok' : '') + '" title="' + (d.declared ? 'Signed' : 'Not signed yet') + '">' + ic('check') + '</span></div>' +
      '<div class="passport-body">' + rows(d).map(function (r) {
        var focus = opts.focus && opts.focus.indexOf(r[0]) > -1;
        return '<div class="p-row' + (focus ? ' focus' : '') + '"><span class="pk">' + r[1] + '</span>' +
          '<span class="pv' + (r[2] ? '' : ' empty') + '">' + (r[2] ? esc(r[2]) : 'Not filled in yet') + '</span></div>';
      }).join('') + '</div></div>';
  }

  /* ---------- worked example ---------- */
  function showExample(lane) {
    $('lane').querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lane') === lane)); });
    $('example-page').innerHTML = rulebookHTML(EXAMPLES[lane], { tag: 'Made-up example', author: lane });
    Deck.fit();
  }
  $('lane').addEventListener('click', function (e) {
    var b = e.target.closest('[data-lane]');
    if (b) showExample(b.getAttribute('data-lane'));
  });

  /* ---------- live page preview beside each question screen ---------- */
  var FOCUS = {
    'r1-tool': ['assistant', 'account'],
    'r1-help': ['device', 'help'],
    'r3-mark': ['marks', 'method'],
    'r3-source': ['sources', 'peer'],
    'r3-sign': ['version', 'declared']
  };
  function drawMini() {
    var s = Deck.current();
    if (!s) return;
    var slot = s.querySelector('[data-mini]');
    if (slot) slot.innerHTML = '<span class="kicker">Your page so far</span>' + rulebookHTML(data, { mini: true, focus: FOCUS[s.id] });
  }

  /* ---------- inputs ---------- */
  var FIELD = { 'f-assistant': 'assistant', 'f-help': 'help', 'f-sources': 'sources', 'f-peer-name': 'peerName', 'f-version': 'version', 'f-date': 'date' };
  document.querySelectorAll('[data-field]').forEach(function (el) {
    el.addEventListener('input', function () { data[FIELD[el.id]] = el.value.trim(); drawMini(); });
    el.addEventListener('change', function () { data[FIELD[el.id]] = el.value.trim(); drawMini(); });
  });

  // One choice only (account, device). "Other" opens a short box to say what.
  document.querySelectorAll('[data-single]').forEach(function (group) {
    var key = group.getAttribute('data-single');
    var other = $('f-' + key + '-other');
    function otherValue() { return other.value.replace(/\s+/g, ' ').trim(); }
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      group.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      var isOther = chip.hasAttribute('data-other');
      if (other) {
        other.hidden = !isOther;
        if (isOther) { try { other.focus({ preventScroll: true }); } catch (x) { other.focus(); } }
      }
      data[key] = isOther ? (other ? otherValue() : 'Other') : chip.textContent.trim();
      drawMini(); Deck.fit();
    });
    if (other) other.addEventListener('input', function () {
      var on = group.querySelector('[data-other][aria-pressed="true"]');
      if (on) { data[key] = otherValue(); drawMini(); }
    });
  });

  // Any number of choices (what I mark, my method).
  document.querySelectorAll('[data-multi]').forEach(function (group) {
    var key = group.getAttribute('data-multi');
    group.addEventListener('click', function (e) {
      var item = e.target.closest('.chip, .check');
      if (!item) return;
      var attr = item.classList.contains('check') ? 'aria-checked' : 'aria-pressed';
      item.setAttribute(attr, String(item.getAttribute(attr) !== 'true'));
      data[key] = Array.prototype.filter.call(group.querySelectorAll('.chip, .check'), function (x) {
        return x.getAttribute(attr) === 'true';
      }).map(function (x) { return x.textContent.trim(); });
      drawMini();
    });
  });

  function toggle(id, key) {
    $(id).addEventListener('click', function () {
      data[key] = this.getAttribute('aria-checked') !== 'true';
      this.setAttribute('aria-checked', String(data[key]));
      drawMini();
    });
  }
  // Tool name shortcuts above the assistant field (Game 18 designer assets).
  // Tapping a logo only fills the name; the learner still types who approved it.
  (function () {
    var picks = $('rb-picks'), input = $('f-assistant');
    if (!picks || !input) return;
    var btns = Array.prototype.slice.call(picks.querySelectorAll('.rb-pick'));
    function sync() {
      var v = input.value.trim().toLowerCase();
      btns.forEach(function (b) {
        var t = b.getAttribute('data-tool').toLowerCase();
        b.setAttribute('aria-pressed', String(!!t && v.indexOf(t) === 0));
      });
    }
    picks.addEventListener('click', function (e) {
      var b = e.target.closest('.rb-pick');
      if (!b) return;
      var tool = b.getAttribute('data-tool');
      if (tool) {
        var keep = input.value.match(/([,;]?\s+approved by\b.*)$/i);
        input.value = tool + (keep ? keep[1] : '');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      sync();
      input.focus();
    });
    input.addEventListener('input', sync);
  })();

  toggle('f-peer-done', 'peerDone');
  toggle('f-declare', 'declared');

  /* ---------- required inputs: Continue stays locked until each part is done ---------- */
  function txt(v, min) { v = String(v || '').replace(/\s+/g, ' ').trim(); return v.length >= (min || 3) && /[^\s0-9.,!?;:'"()\-]/.test(v); }
  var NEED = {
    'r1-tool': function () {
      var m = [];
      if (!txt(data.assistant)) m.push('type the name of your AI tool');
      if (!txt(data.account, 2)) m.push(document.querySelector('[data-single="account"] [data-other][aria-pressed="true"]') ? 'type your kind of account' : 'tap your type of account');
      return m;
    },
    'r1-help': function () {
      var m = [];
      if (!txt(data.device, 2)) m.push(document.querySelector('[data-single="device"] [data-other][aria-pressed="true"]') ? 'type your device' : 'tap your device');
      if (!txt(data.help)) m.push('type who you ask for help');
      return m;
    },
    'r3-mark': function () {
      var m = [];
      if (!data.marks.length) m.push('tap at least one thing that you mark');
      if (!data.method.length) m.push('tap at least one step of your method');
      return m;
    },
    'r3-source': function () {
      var m = [];
      if (!txt(data.sources)) m.push('type what you check your answers against');
      if (!data.peerDone) m.push('tick the box when you have explained it to a peer');
      return m;
    },
    'r3-sign': function () {
      var m = [];
      if (!String(data.version || '').trim()) m.push('type a version, for example v1');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date || '')) m.push('choose the date');
      if (!data.declared) m.push('tap the declaration');
      return m;
    }
  };
  function gateBox(s) {
    var m = s.querySelector('.rb-gate');
    if (!m) {
      m = document.createElement('p');
      m.className = 'rb-gate saa-vo-skip';
      m.setAttribute('role', 'status');
      m.setAttribute('aria-live', 'polite');
      m.hidden = true;
      (s.querySelector('.two-col > .col') || s.querySelector('.card')).appendChild(m);
    }
    return m;
  }
  function paintGate() {
    var s = Deck.current(), b = $('primary');
    if (!s || !b) return;
    var f = NEED[s.id], on = !!f && f().length > 0;
    var box = s.querySelector('.rb-gate');
    if (box && !on && !box.hidden) { box.hidden = true; box.textContent = ''; Deck.fit(); }
    if (b.classList.contains('rb-locked') === on) return;
    b.classList.toggle('rb-locked', on);
    if (on) b.setAttribute('aria-disabled', 'true');
    else if (!b.classList.contains('saa-locked')) b.removeAttribute('aria-disabled');
  }
  function gatePrimary(deck) {
    var s = deck.current(), m = NEED[s.id] ? NEED[s.id]() : [];
    if (!m.length) return true;
    var box = gateBox(s);
    var t = m.length > 1 ? m.slice(0, -1).join(', ') + ' and ' + m[m.length - 1] : m[0];
    box.textContent = 'Not yet. Please ' + t + '.';
    box.hidden = false;
    deck.fit();
    return false;
  }
  document.addEventListener('input', paintGate);
  document.addEventListener('click', function () { setTimeout(paintGate, 0); });

  /* Nothing is saved: warn before a reload or close loses the page. */
  window.addEventListener('beforeunload', function (e) {
    var started = data.assistant || data.account || data.device || data.help || data.marks.length || data.method.length || data.sources || data.peerDone || data.peerName || data.declared;
    if (!started) return;
    e.preventDefault(); e.returnValue = ''; return '';
  });

  /* ---------- the finished page ---------- */
  function missing() {
    return rows(data).filter(function (r) { return !r[2]; });
  }
  function drawPage() {
    $('final-page').innerHTML = rulebookHTML(data);
    var gaps = missing();
    $('page-status').innerHTML = gaps.length
      ? '<div class="tile row-tile"><span class="dot-ic bad">' + ic('alert') + '</span><div class="status-body"><h3>' + gaps.length + ' part' + (gaps.length > 1 ? 's are' : ' is') + ' still empty.</h3>' +
        '<p>' + gaps.map(function (g) { return esc(g[1]); }).join(', ') + '.</p>' +
        '<button type="button" class="btn-link" data-go="' + gaps[0][3] + '">Fill ' + (gaps.length > 1 ? 'them' : 'it') + ' in ' + ic('arrow-right') + '</button></div></div>'
      : '<div class="tile row-tile"><span class="dot-ic ok">' + ic('check') + '</span><div class="status-body"><h3>Your page is complete.</h3><p>Download it or print it, and keep it safe.</p></div></div>';
  }

  function buildFile() {
    var lines = ['My Personal AI Rulebook: page 1.3', 'Section 1.3 · Check Before You Use', 'Swift AI Academy · AAI-E-MC1-S03-RULE01', ''];
    rows(data).forEach(function (r) { lines.push(r[1] + ': ' + (r[2] || '(not filled in yet)')); });
    lines.push('', 'Keep this page. You will add to it in MC3.');
    return lines.join('\n');
  }

  $('print-page').addEventListener('click', function () { window.print(); });

  var hooks = {
    example: { enter: function () { showExample('iti'); } },
    page: {
      enter: drawPage,
      primary: function (deck) {
        var gaps = missing();
        if (gaps.length) {
          SAA.toast('Fill in every part before you download');
          deck.go(gaps[0][3]);
          return false;
        }
        SAA.download('my-personal-ai-rulebook-1-3.txt', buildFile());
        SAA.toast('Your rulebook page is downloaded');
        return false;
      }
    }
  };
  Object.keys(FOCUS).forEach(function (id) {
    hooks[id] = { enter: function () { drawMini(); setTimeout(paintGate, 0); }, primary: gatePrimary };
  });
  hooks.page.leave = function () { setTimeout(paintGate, 0); };

  Deck.init(hooks);
})();
