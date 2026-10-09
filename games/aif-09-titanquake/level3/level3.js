/* Level 3 · Fix the Big Screen (storyboard FS0–FS7, FS✓).
 * Runs on the zoomed-in red wall monitor inside the story stage (1600×900).
 * Top: the number name in words. Middle: the screen's number, one digit per place box (one box is wrong).
 * Bottom: digit options + CHECK. Tap the wrong box, tap the right digit, tap CHECK.
 * API: Level3.start({ onExit }), Level3.stop(), Level3.get()
 */
(() => {
'use strict';

const fmt = n => window.TitanLevel1Data.formatIndian(n);
const PLACES = ['Lakhs', 'Ten Thousands', 'Thousands', 'Hundreds', 'Tens', 'Ones'];

// Storyboard FS1–FS7. wrong = what the broken screen shows; box = index of the wrong place box.
const ROUNDS = [
  { name: 'One lakh twenty-five thousand',          target: 125000, wrong: 124000, box: 2, opts: [5, 4, 2, 0],
    hint: 'Hint: Twenty-five thousand needs a 5 in the thousands box.',     reveal: 'Put 5 in the thousands box. That makes 1,25,000.' },
  { name: 'Three lakh five thousand six hundred',   target: 305600, wrong: 355600, box: 1, opts: [0, 5, 6, 3],
    hint: 'Hint: There are no ten-thousands here. That box should be 0.',   reveal: 'Put 0 in the ten-thousands box. That makes 3,05,600.' },
  { name: 'Six lakh eight thousand',                target: 608000, wrong: 603000, box: 2, opts: [8, 3, 6, 0],
    hint: 'Hint: Eight thousand needs an 8 in the thousands box.',          reveal: 'Put 8 in the thousands box. That makes 6,08,000.' },
  { name: 'Four lakh sixty thousand',               target: 460000, wrong: 450000, box: 1, opts: [6, 5, 4, 0],
    hint: 'Hint: Sixty thousand is 6 ten-thousands, not 5.',                reveal: 'Put 6 in the ten-thousands box. That makes 4,60,000.' },
  { name: 'Seven lakh fifty thousand three hundred', target: 750300, wrong: 750600, box: 3, opts: [3, 6, 5, 0],
    hint: 'Hint: Three hundred needs a 3 in the hundreds box.',             reveal: 'Put 3 in the hundreds box. That makes 7,50,300.' },
  { name: 'Nine lakh forty-five',                   target: 900045, wrong: 900015, box: 4, opts: [4, 1, 5, 0],
    hint: 'Hint: Forty-five is 4 tens and 5 ones. The tens box needs a 4.', reveal: 'Put 4 in the tens box. That makes 9,00,045.' },
  { name: 'Eight lakh thirty thousand',             target: 830000, wrong: 880000, box: 1, opts: [3, 8, 0, 9],
    hint: 'Hint: Thirty thousand is 3 ten-thousands. That box needs a 3.',  reveal: 'Put 3 in the ten-thousands box. That makes 8,30,000.' },
];
const LINES = {
  intro:  'Help me fix the screen! The name at the top is the right number. One box on the screen is wrong. Tap that box, tap the right digit, then tap CHECK.',
  wrong1: 'Not quite. The screen still shows a wrong number. Read the name again.',
  pick:   'Tap a box on the screen first.',
  idle:   'Read the name slowly. Then check each box, one by one.',
  outro:  'Well done! You fixed it. Look, the screen is green again!',
  first:  'Yes! Just like that. Now you try the rest.',
  right:  r => `Yes! Now the screen shows ${fmt(r.target)}.`,
};
const IDLE_MS = 15000;

const $ = s => document.querySelector(s);
const root = $('#level3');
const el = {
  name: $('#l3-name'), boxes: $('#l3-boxes'), opts: $('#l3-opts'), check: $('#l3-check'), dots: $('#l3-dots'),
  caption: $('#l3-caption'), say: $('#l3-say'), sayName: $('#l3-say .l2-name'), sayLine: $('#l3-say .l2-line'),
  next: $('#l3-next'), hand: $('#l3-hand'), task: $('#l3-task'),
};
const S = { active: false, run: 0, ri: 0, digits: [], sel: -1, attempts: 0, locked: true, phase: 'off', opts: {}, timers: [], idleT: 0, capT: 0, demo: false };
const snd = () => window.TQSound;
function later(ms, fn) { const t = setTimeout(() => { S.timers = S.timers.filter(x => x !== t); fn(); }, ms); S.timers.push(t); }

function speak(text) { return window.TQVoice ? TQVoice.say(text) : Promise.resolve(); }
const wait = ms => new Promise(r => later(ms, r));
// run fn after the line has been spoken and at least `ms` has passed (never if the level was stopped)
function after(spoken, ms, fn) { const run = S.run; Promise.all([spoken, wait(ms)]).then(() => { if (S.active && run === S.run) fn(); }); }
function caption(text, tone = '', ms) {
  clearTimeout(S.capT);
  el.caption.textContent = text;
  el.caption.className = 'l3-caption' + (text ? ' show' : '') + (tone ? ' ' + tone : '');
  if (text) S.capT = setTimeout(() => caption(''), ms || (tone === 'good' ? 1800 : 3200));
}
function say(who, text) {
  el.say.dataset.who = who;
  el.sayName.textContent = who === 'nova' ? 'NOVA' : 'RIL';
  el.sayLine.textContent = text;
  el.say.classList.toggle('show', !!text);
  if (text) S.introVoice = speak(text);
}
function hand(target) {
  if (!target) { el.hand.classList.remove('show'); return; }
  let x = target.offsetWidth / 2, y = 0, n = target;
  while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
  const w = el.hand.offsetWidth || 72;
  el.hand.style.transform = `translate(${x - w * .73}px, ${y + target.offsetHeight - 14}px)`;
  el.hand.classList.add('show');
}

// ---------- drawing ----------
function digitsOf(n) { return String(n).padStart(6, '0').split('').map(Number); }
function renderBoxes(state = '') {
  el.boxes.innerHTML = '';
  S.digits.forEach((d, i) => {
    if (i === 1 || i === 3) el.boxes.insertAdjacentHTML('beforeend', '<i class="l3-comma">,</i>');   // Indian grouping 9,99,999
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'l3-box' + (i === S.sel ? ' sel' : '') + (state ? ' ' + state : '');
    b.innerHTML = `<i class="reel"><b>${d}</b></i><span>${PLACES[i]}</span>`;
    // ▲ / ▼ like a mechanical meter: each tap rolls the digit one step
    const up = document.createElement('button'), dn = document.createElement('button');
    up.type = dn.type = 'button'; up.className = 'l3-arrow up'; dn.className = 'l3-arrow dn';
    up.setAttribute('aria-label', 'Up'); dn.setAttribute('aria-label', 'Down');
    up.addEventListener('click', e => { e.stopPropagation(); if (S.locked) return; if (S.sel !== i) selectBox(i); roll(i, +1); });
    dn.addEventListener('click', e => { e.stopPropagation(); if (S.locked) return; if (S.sel !== i) selectBox(i); roll(i, -1); });
    up.addEventListener('pointerdown', e => e.stopPropagation()); dn.addEventListener('pointerdown', e => e.stopPropagation());
    const wrap = document.createElement('div'); wrap.className = 'l3-col';
    wrap.append(up, b, dn);
    b.addEventListener('click', () => { if (!b.dragged) selectBox(i); b.dragged = false; });
    b.setAttribute('aria-label', `${PLACES[i]} box: ${d}`);
    // keyboard: arrow up or down rolls the digit, a number key sets it
    b.addEventListener('keydown', e => {
      if (S.locked) return;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); if (S.sel !== i) selectBox(i); roll(i, e.key === 'ArrowUp' ? 1 : -1); }
      else if (/^[0-9]$/.test(e.key)) { e.preventDefault(); if (S.sel !== i) selectBox(i); setDigit(i, +e.key); }
    });
    dragRoll(b, i);
    el.boxes.append(wrap);
  });
}
function renderOpts() {
  const r = ROUNDS[S.ri];
  el.opts.innerHTML = '';
  r.opts.slice().sort(() => Math.random() - .5).forEach((d, k) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'l3-opt'; b.dataset.d = d; b.style.animationDelay = k * 90 + 'ms';
    b.innerHTML = `<span>${d}</span>`;
    b.addEventListener('click', () => pickDigit(d, b));
    el.opts.append(b);
  });
}
// Drag a digit up (+1) or down (-1), like a rolling counter: 0…9 and round again.
const STEP = 46;
function dragRoll(b, i) {
  let y0 = null, x0 = 0, steps = 0;
  b.addEventListener('pointerdown', e => {
    if (S.locked) return;
    y0 = e.clientY; x0 = e.clientX; steps = 0; b.dragged = false;
    try { b.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    if (S.sel !== i) selectBox(i);
  });
  b.addEventListener('pointermove', e => {
    if (y0 === null || S.locked) return;
    // on a phone held upright the game is turned 90°, so "up" in the game is a swipe to the right on the glass
    const rot = window.TQView && TQView().rot;
    const px = rot ? e.clientX - x0 : y0 - e.clientY;
    const k = px / ((rot ? root.getBoundingClientRect().width : root.getBoundingClientRect().height) / 900 || 1);
    const want = Math.trunc(k / STEP);
    while (steps < want) { steps++; roll(i, +1); }
    while (steps > want) { steps--; roll(i, -1); }
    if (want) b.dragged = true;
  });
  const end = () => { y0 = null; };
  b.addEventListener('pointerup', end); b.addEventListener('pointercancel', end);
}
function roll(i, dir) {
  const d = (S.digits[i] + dir + 10) % 10;
  setDigit(i, d, dir);
}
function setDigit(i, d, dir = 0) {
  S.digits[i] = d;
  const b = boxEls()[i]; if (!b) return;
  b.setAttribute('aria-label', `${PLACES[i]} box: ${d}`);
  const reel = b.querySelector('.reel');
  reel.querySelectorAll('b.out').forEach(x => x.remove());
  const old = reel.querySelector('b');
  const nb = document.createElement('b'); nb.textContent = d;
  if (dir) {
    old.classList.add('out', dir > 0 ? 'out-up' : 'out-dn');
    nb.classList.add(dir > 0 ? 'in-up' : 'in-dn');
    reel.append(nb);
    setTimeout(() => old.remove(), 260);
  } else { nb.classList.add('pop'); old.replaceWith(nb); }
  el.check.disabled = false;
  snd() && snd().click();
  bumpIdle();
}
function boxEls() { return [...el.boxes.querySelectorAll('.l3-box')]; }
function buildDots() { el.dots.innerHTML = ROUNDS.map((_, i) => `<li class="${i < S.ri ? 'done' : i === S.ri ? 'cur' : ''}"></li>`).join(''); }

// ---------- round ----------
function startRound(i) {
  const r = ROUNDS[i];
  S.ri = i; S.attempts = 0; S.sel = -1; S.locked = false; S.phase = 'round';
  S.digits = digitsOf(r.wrong);
  root.classList.remove('fixed');
  el.name.textContent = r.name;
  el.name.classList.remove('pop'); void el.name.offsetWidth; el.name.classList.add('pop');
  renderBoxes(); renderOpts(); buildDots();
  el.check.disabled = true;
  el.task.hidden = false;
  speak(r.name);
  // no glow or hand on the wrong box: finding it is the player's task
  if (document.activeElement === document.body || root.contains(document.activeElement)) boxEls()[0].focus({ preventScroll: true });
  bumpIdle();
}
function selectBox(i) {
  if (S.locked) return;
  S.sel = i;
  boxEls().forEach((b, k) => b.classList.toggle('sel', k === i));
  snd() && snd().click();
  bumpIdle();
}
function pickDigit(d, btn) {
  if (S.locked) return;
  if (S.sel < 0) { caption(LINES.pick); return; }
  setDigit(S.sel, d);
  btn.classList.remove('tap'); void btn.offsetWidth; btn.classList.add('tap');
}
function check() {
  if (S.locked) return;
  const r = ROUNDS[S.ri];
  hand(null);
  const value = Number(S.digits.join(''));
  if (value === r.target) return correct();
  S.attempts++;
  snd() && snd().alarm(1);
  renderBoxes('bad');
  if (S.attempts === 1) { caption(LINES.wrong1, 'bad'); speak(LINES.wrong1); }
  else if (S.attempts === 2) { caption(r.hint, 'bad', 4200); speak(r.hint); later(150, () => boxEls()[r.box].classList.add('blink')); }
  else {
    caption(r.reveal, '', 5200); speak(r.reveal);
    S.sel = r.box; renderBoxes();
    later(300, () => hand(el.opts.querySelector(`[data-d="${r.opts[0]}"]`)));   // shown only after three tries
  }
  later(900, () => { if (!S.locked) renderBoxes(); });
  bumpIdle();
}
function correct() {
  const r = ROUNDS[S.ri];
  S.locked = true; S.phase = 'good'; S.demo = false;
  renderBoxes('good');
  const line = S.ri === 0 ? LINES.first : LINES.right(r);
  caption(line, 'good', 60000);
  snd() && (snd().ding(3), snd().pop());
  after(speak(line), 2800, () => { caption(''); S.ri + 1 < ROUNDS.length ? startRound(S.ri + 1) : outro(); });
}
function outro() {
  S.phase = 'outro'; S.locked = true;
  el.task.hidden = true; hand(null);
  el.dots.querySelectorAll('li').forEach(li => { li.className = 'done'; });
  root.classList.add('fixed');            // the big screen turns from red to green
  el.name.textContent = 'ALL FIXED';
  renderBoxes('good');
  el.opts.innerHTML = '';
  snd() && snd().jingle();
  later(900, () => { say('ril', LINES.outro); el.next.hidden = false; el.next.focus({ preventScroll: true }); });
}
function bumpIdle() { clearTimeout(S.idleT); S.idleT = setTimeout(idle, IDLE_MS); }
function idle() {
  if (!S.active || S.locked || S.phase !== 'round') return;
  caption(LINES.idle, '', 6000); speak(LINES.idle);
  // the wrong box blinks only after the player has tried once (no answer before they act)
  const b = S.attempts > 0 && boxEls()[ROUNDS[S.ri].box];
  if (b) { b.classList.add('nudge'); later(2400, () => b && b.classList.remove('nudge')); }
  bumpIdle();
}

// ---------- lifecycle ----------
function start(opts = {}) {
  S.opts = opts; S.active = true; S.run++; S.demo = false;
  root.hidden = false; el.next.hidden = true; el.task.hidden = true;
  root.classList.remove('fixed');
  S.ri = 0; S.locked = true; S.phase = 'intro';
  el.name.textContent = ROUNDS[0].name;
  S.digits = digitsOf(ROUNDS[0].wrong); renderBoxes(); el.opts.innerHTML = ''; buildDots();
  say('nova', LINES.intro);
  after(S.introVoice, 5200, beginRounds);
}
function beginRounds() {
  if (S.phase !== 'intro') return;
  say('nova', ''); startRound(0);
}
function stop() {
  S.active = false; S.run++; root.hidden = true;
  S.timers.forEach(clearTimeout); S.timers = []; clearTimeout(S.idleT); clearTimeout(S.capT);
  window.TQVoice && TQVoice.stop();
}
el.check.addEventListener('click', check);
el.next.addEventListener('click', () => { const done = S.opts.onExit; stop(); done && done(); });
root.addEventListener('pointerdown', e => {
  e.stopPropagation();
  if (S.phase === 'intro' && !e.target.closest('button')) beginRounds();   // tap to start at once
});

// every line this level can speak (used to make the voice clips)
function voiceLines() {
  return [LINES.intro, LINES.wrong1, LINES.pick, LINES.idle, LINES.outro, LINES.first,
    ...ROUNDS.flatMap(r => [r.name, r.hint, r.reveal, LINES.right(r)])];
}
window.Level3 = { start, stop, get: () => S, ROUNDS, LINES, voiceLines };
})();
