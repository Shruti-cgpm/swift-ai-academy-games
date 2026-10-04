
/* ==========================================================================
   COMMON (all games): start screen, "Your task" line, one-amber guard
   ========================================================================== */
(function (win, doc) {
  'use strict';
  function txt(e) { return e ? e.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function visible(e) { return !!(e && e.offsetParent !== null && e.getBoundingClientRect().width > 2); }
  function amber(e) { var cs = getComputedStyle(e); return /243, 171, 49|255, 193, 104|251, 176, 52/.test(cs.backgroundImage + ' ' + cs.backgroundColor); }
  function pages() { return win.Deck ? win.Deck.slides : Array.prototype.slice.call(doc.querySelectorAll('section.page, section.slide, .step')); }
  function current() {
    if (win.Deck) { return win.Deck.current(); }
    return pages().filter(visible)[0] || doc.querySelector('.app');
  }
  var NAV = '#primary, #deck-next, #navNext, #nav-next, #nextBtn, .btn-next, .nav-btn.primary, .nav-circle.primary, footer .btn-primary, .foot .btn-primary, .slide-footer .primary, .nav .primary';
  function isNav(b) { return b.matches(NAV); }

  /* ---- 1. start screen ---- */
  function buildStart() {
    if (doc.getElementById('start') || doc.getElementById('saa-start')) { return; }
    var cover = pages()[0] || doc.querySelector('.app');
    if (!cover) { return; }
    var h = cover.querySelector('h1, h2, .title');
    var title = txt(h) || (doc.title || '').split(/\s[—·|-]\s/)[0].trim();
    if (!title) { return; }
    var ebEl = cover.querySelector('.kicker, .eyebrow, .saa-eyebrow, .q-kicker');
    var eb = txt(ebEl).replace(/\s*·\s*/g, ' · ');
    var tag = '';
    var ps = cover.querySelectorAll('.lede, .sub, p');
    for (var i = 0; i < ps.length; i++) { var t = txt(ps[i]); if (t.length > 20 && t !== title && t !== eb && !/^AAI-|^PC |Swift AI Academy$/.test(t)) { tag = t; break; } }
    if (tag.length > 170) { tag = tag.slice(0, 167).replace(/\s+\S*$/, '') + '…'; }
    var logo = doc.querySelector('.brand img, img[src*="logo"], .brand-mark');
    var o = doc.createElement('div');
    o.className = 'saa-start'; o.id = 'saa-start';
    o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-labelledby', 'saa-start-title');
    o.innerHTML = '<div class="saa-in"><div class="saa-brand"></div>' +
      '<div class="saa-mid">' + (eb ? '<span class="saa-eb"></span>' : '') + '<h1 id="saa-start-title"></h1>' + (tag ? '<p class="saa-tag"></p>' : '') +
      '<button type="button" class="saa-go">Start <svg viewBox="0 0 24 24" fill="none" stroke="#241300" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div></div>';
    var brand = o.querySelector('.saa-brand');
    if (logo) { var l = logo.cloneNode(true); l.removeAttribute('id'); brand.appendChild(l); }
    var bs = doc.createElement('span'); bs.textContent = 'SWIFT AI ACADEMY'; brand.appendChild(bs);
    if (eb) { o.querySelector('.saa-eb').textContent = eb; }
    o.querySelector('h1').textContent = title;
    if (tag) { o.querySelector('.saa-tag').textContent = tag; }
    doc.body.appendChild(o);
    var app = doc.querySelector('.app, #app, .wrap');
    if (app) { app.setAttribute('inert', ''); }
    var go = o.querySelector('.saa-go');
    setTimeout(function () { try { go.focus(); } catch (e) {} }, 50);
    go.addEventListener('click', function () {
      if (app) { app.removeAttribute('inert'); }
      o.classList.add('gone');
      setTimeout(function () { o.style.display = 'none'; }, 550);
      /* skip the cover it replaces: plain cover -> press Next; cover with a single start button -> press it;
         a cover with other choices or links stays so nothing is lost */
      var first = pages()[0];
      if (first && !visible(first)) { return; }                 /* already past the cover */
      /* a first screen with real content (lists, a template, an activity, a long text) is not a cover: show it */
      if (first && (first.querySelector('ul, ol, table, .saa-kit, textarea, input') || (first.innerText || '').replace(/\s+/g, ' ').length > 320)) { return; }
      var scope = first || doc.querySelector('.app') || doc.body;
      var inCover = Array.prototype.filter.call(scope.querySelectorAll('button, a[href], input, select, textarea, [data-go], [role=button]'), function (e) {
        return visible(e) && !e.matches(NAV) && !e.closest('header, .top, .topbar, .saa-top, .foot, footer, .nav, .deck-nav, .slide-footer, .page-footer') && !/back|close|outline|help/i.test((e.id || '') + ' ' + (e.className || '') + ' ' + (e.getAttribute('aria-label') || ''));
      });
      var nav = Array.prototype.filter.call(doc.querySelectorAll(NAV), function (b) { return visible(b) && !b.disabled && !(first && first.contains(b)); })[0];
      if (!inCover.length && nav) { nav.click(); }
      else if (inCover.length === 1 && inCover[0].tagName === 'BUTTON' && amber(inCover[0])) { inCover[0].click(); }
    });
  }

  /* ---- 2. "Your task": style the screen's own instruction line ---- */
  var VERBS = /^(tap|choose|pick|select|fill|type|write|match|sort|drag|copy|paste|mark|find|click|rewrite|put|spot|compare|decide|tick|label|order|rate)\b/i;
  function taskLine(page) {
    if (!page || page.querySelector('.saa-do, .do')) { return; }
    var controls = page.querySelector('input, textarea, select, .opt, .chip, [role=button], button:not(.nav-btn):not(#primary):not(#back):not(.nav-circle)');
    if (!controls) { return; }
    var c = Array.prototype.filter.call(page.querySelectorAll('p, .sub, .lede, .hint, .instr, .instruction, .q-meta'), function (e) {
      var t = txt(e);
      return t.length > 8 && t.length <= 180 && VERBS.test(t) && !/[\[\]·]/.test(t) && e.querySelectorAll('div, p, ul, ol, button, input').length === 0 &&
        !e.matches('.kicker, .eyebrow, .saa-eyebrow, .title') &&
        !e.closest('.callout, .note, .privacy-strip, .never-panel, .stop-rule, .pause-line, button, label, .doc, .opt, .bubble, .msg, .chat, .saa-start, [class*=prompt], [class*=acc-], .accordion, details, blockquote, .example, .sample, .quote');
    });
    if (!c.length) { return; }
    var e = c[0];
    if (!e.classList.contains('saa-do')) { e.classList.add('saa-do'); }
    if (!/^your task/i.test(txt(e))) { var b = doc.createElement('b'); b.className = 'saa-do-label'; b.textContent = 'Your task.'; e.insertBefore(b, e.firstChild); e.insertBefore(doc.createTextNode(' '), b.nextSibling); }
  }

  /* ---- 3. one amber action per screen ---- */
  function amberGuard() {
    var btns = Array.prototype.filter.call(doc.querySelectorAll('button'), function (b) { return visible(b) && !b.closest('#saa-start'); });
    var inPage = btns.filter(function (b) { return !isNav(b) && !b.disabled && amber(b); });
    btns.filter(isNav).forEach(function (n) { if (n.classList.contains('saa-demote') !== inPage.length > 0) { n.classList.toggle('saa-demote', inPage.length > 0); } });
  }

  /* ---- 4. one progress indicator: read the game's own count, draw the standard bar ---- */
  var FOOTS = 'footer, .deck-foot, .nav-row, .foot, .slide-footer, .chat-footer';
  var SRC = '#deck-count, .deck-count, #pageNum, #pageCount, .page-count, #counter, .counter, .count, #stepCount, .step-count';
  var HOME = '.deck-progress, .footer-progress, .bar-mid, .page-meta, .foot-left, .progress-wrap';
  function progress() {
    var feet = doc.querySelectorAll(FOOTS);
    for (var i = 0; i < feet.length; i++) {
      var f = feet[i];
      var src = Array.prototype.filter.call(f.querySelectorAll(SRC), function (e) { return /(\d+)\s*(\/|of)\s*(\d+)/i.test(e.textContent); })[0];
      if (!src) { continue; }
      var m = src.textContent.match(/(\d+)\s*(?:\/|of)\s*(\d+)/i), n = +m[1], tot = +m[2];
      var pr = f.querySelector('.saa-prog');
      if (!pr) {
        pr = doc.createElement('div'); pr.className = 'saa-prog'; pr.setAttribute('aria-hidden', 'true');
        pr.innerHTML = '<span class="saa-prog-bar"><span class="saa-prog-fill"></span></span><span class="saa-prog-n"></span>';
        var home = f.querySelector(HOME);
        if (home) { home.appendChild(pr); } else { src.parentNode.insertBefore(pr, src); }
      }
      var lab = n + ' / ' + tot;
      var nEl = pr.querySelector('.saa-prog-n');
      if (nEl.textContent !== lab) { nEl.textContent = lab; }
      var w = tot ? Math.round(n / tot * 100) + '%' : '0%';
      var fill = pr.querySelector('.saa-prog-fill');
      if (fill.style.width !== w) { fill.style.width = w; }
    }
  }

  var t = 0;
  function refresh() { clearTimeout(t); t = setTimeout(function () { taskLine(current()); amberGuard(); progress(); }, 80); }
  function init() {
    buildStart();
    pages().forEach(taskLine);
    refresh();
    if (win.MutationObserver) { new MutationObserver(refresh).observe(doc.body, { attributes: true, attributeFilter: ['class', 'disabled', 'hidden'], subtree: true, childList: true }); }
    doc.addEventListener('click', refresh, true);
  }
  if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', init); } else { init(); }
})(window, document);

/* ==========================================================================
   STAFF CODES: master-sheet codes are for the programmes team, never for learners.
   Any short line or tag that shows one (AAI-E-…, PC 4.1–4.5, Mapped PC, Schema, Element 4 …) is hidden.
   ========================================================================== */
(function (win, doc) {
  'use strict';
  var CODE = /AAI-E-MC\d|\bPC\s*\d+\.\d|Mapped:?\s*PC|Schema:|Non-compensatory|·\s*Element\s+\d|\bMC1\s*\/\s*\d/;
  var CODES = /AAI-E-MC\d[-A-Z0-9]*|\bPC:?\s*\d+\.\d+(\s*(–|-|to)\s*\d+\.\d+)?|Mapped:?\s*(PC:?)?|Schema:|Non-compensatory:?\s*(Yes|No)?|\bElement\s+\d\b|\bMC1\s*\/\s*\d+(\.\d+)?/g;
  var STAFF = /\b(English|Gujarati|Hindi|Mandatory( step)?|Not counted|Gates the unit|Swift AI Academy|Lab|Yes|No|and|to)\b/gi;
  function txt(e) { return (e.textContent || '').replace(/\s+/g, ' ').trim(); }
  function metaOnly(s) { return s.replace(CODES, '').replace(STAFF, '').replace(/[^A-Za-zऀ-૿]/g, '').length < 3; }
  function hide() {
    var w = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null), t, marks = [], strip = [];
    while ((t = w.nextNode())) {
      if (!CODE.test(t.nodeValue)) { continue; }
      var e = t.parentElement;
      if (!e || e.closest('script, style, .saa-staff, [data-saa-keep]')) { continue; }
      if (!metaOnly(txt(e))) { strip.push(t); continue; }        /* a code inside a real sentence: take out just the code */
      var box = e;                                                 /* the whole line is codes and staff labels: hide it */
      while (box.parentElement && box.parentElement !== doc.body && metaOnly(txt(box.parentElement))) { box = box.parentElement; }
      marks.push(box);
    }
    marks.forEach(function (b) { b.classList.add('saa-staff'); });
    strip.forEach(function (n) {
      n.nodeValue = n.nodeValue.replace(CODES, '').replace(/(\s*·\s*){2,}/g, ' · ').replace(/^\s*·\s*|\s*·\s*$/g, '').replace(/\(\s*\)/g, '');
    });
  }
  var t = 0;
  function soon() { clearTimeout(t); t = setTimeout(hide, 80); }
  function init() {
    hide();
    if (win.MutationObserver) { new MutationObserver(soon).observe(doc.body, { childList: true, subtree: true, characterData: true }); }
  }
  if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', init); } else { init(); }
})(window, document);
