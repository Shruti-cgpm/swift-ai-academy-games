/* Level 2 · Build the Number (storyboard BN0–BN7).
 * Lives inside the story stage (#stage, 1600×900), so it scales/rotates with the story.
 * API: Level2.start({ onExit }), Level2.stop(), Level2.get()
 */
(() => {
'use strict';

const fmt = n => window.TitanLevel1Data.formatIndian(n);

// Storyboard BN1–BN7. parts = the cards that build the number; extra = look-alike cards.
const ROUNDS = [
  { target: 853,    parts: [800, 50, 3],                     extra: [80, 500, 5] },
  { target: 6834,   parts: [6000, 800, 30, 4],               extra: [600, 300] },
  { target: 45867,  parts: [40000, 5000, 800, 60, 7],        extra: [4000] },
  { target: 30090,  parts: [30000, 90],                      extra: [3000, 900, 9, 300] },
  { target: 245000, parts: [200000, 40000, 5000],            extra: [20000, 4000, 50000] },
  { target: 305600, parts: [300000, 5000, 600],              extra: [30000, 50000, 6000] },
  { target: 900045, parts: [900000, 40, 5],                  extra: [90000, 400, 50] },
];
const LINES = {
  intro:  'Help me build the numbers! Tap the cards that add up to the number on the sign. Then tap CHECK.',
  task:   'Tap the cards that make this number. Then tap CHECK.',
  first:  'Good. You added a card. Add more cards, then tap CHECK.',
  wrong1: 'Not quite. The board shows a different number. Tap a card on the board to take it out.',
  wrong2: 'Not quite. If the number is too big, take a card out. If it is too small, add a card.',
  idle:   'Start with the biggest card. Then add the next biggest card.',
  outro:  'Well done! All the numbers are whole again.',
  build:  r => `Build ${fmt(r.target)}.`,
  great:  r => `Yes! ${fmt(r.target)} = ${r.parts.map(fmt).join(' + ')}.`,
  reveal: r => `Here is the answer. ${r.parts.map(fmt).join(' + ')} = ${fmt(r.target)}.`,
};
// plate colour by place value
const PLATE = n => n >= 100000 ? 'red' : n >= 10000 ? 'orange' : n >= 1000 ? 'amber' : n >= 100 ? 'yellow' : n >= 10 ? 'green' : 'blue';
const SLOTS = 5, IDLE_MS = 15000;   // hint only after 15 s without a tap

const $ = s => document.querySelector(s);
const root = $('#level2');
const el = {
  label: $('#l2-label'), target: $('#l2-target'), dots: $('#l2-dots'), tray: $('#l2-tray'), rail: $('#l2-rail'),
  sum: $('#l2-sum'), check: $('#l2-check'), caption: $('#l2-caption'), say: $('#l2-say'), sayName: $('#l2-say .l2-name'),
  sayLine: $('#l2-say .l2-line'), next: $('#l2-next'), hand: $('#l2-hand'), sign: $('#l2-sign'), task: $('#l2-task'),
};
const S = { active: false, run: 0, ri: 0, cards: [], placed: [], attempts: 0, locked: true, phase: 'off', idleT: 0, opts: {}, timers: [] };
const snd = () => window.TQSound;

function later(ms, fn) { const t = setTimeout(() => { S.timers = S.timers.filter(x => x !== t); fn(); }, ms); S.timers.push(t); }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function speak(text) { return window.TQVoice ? TQVoice.say(text) : Promise.resolve(); }
const wait = ms => new Promise(r => later(ms, r));
// run fn after the line has been spoken and at least `ms` has passed (never if the level was stopped)
function after(spoken, ms, fn) { const run = S.run; Promise.all([spoken, wait(ms)]).then(() => { if (S.active && run === S.run) fn(); }); }
function caption(text, tone = '', ms) {
  clearTimeout(S.capT);
  el.caption.textContent = text;
  el.caption.className = 'l2-caption' + (text ? ' show' : '') + (tone ? ' ' + tone : '');
  root.classList.toggle('popup', !!text);     // the room blurs behind the pop-up
  if (text) S.capT = setTimeout(() => caption(''), ms || (tone === 'good' ? 1500 : 2800));
}
function say(who, text) {
  el.say.dataset.who = who;
  el.sayName.textContent = who === 'nova' ? 'NOVA' : 'RIL';
  el.sayLine.textContent = text;
  el.say.classList.toggle('show', !!text);
  if (text) S.introVoice = speak(text);
}
function setTask(text) { el.task.querySelector('span').textContent = text; }
function hand(target) {
  if (!target || S.handOff) { el.hand.classList.remove('show'); return; }
  let x = target.offsetWidth / 2, y = 0, n = target;
  while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
  // turned 180°: the fingertip (38 % from the left in the art → 62 % after turning) touches the top centre of the card
  const w = el.hand.offsetWidth || 72, h = el.hand.offsetHeight || 133;
  el.hand.style.transform = `translate(${x - w * .73}px, ${y + target.offsetHeight - 14}px)`;   // from below: fingertip touches the bottom of the card
  el.hand.classList.add('show');
}

// ---------- round ----------
function card(value, cls) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `l2-card ${cls} plate-${PLATE(value)}`;
  b.innerHTML = `<span>${fmt(value)}</span>`;
  b.dataset.value = value;
  return b;
}
function buildDots() {
  el.dots.innerHTML = ROUNDS.map((_, i) => `<li class="${i < S.ri ? 'done' : i === S.ri ? 'cur' : ''}"></li>`).join('');
}
function startRound(i) {
  S.ri = i; S.attempts = 0; S.placed = []; S.locked = false; S.phase = 'round';
  const r = ROUNDS[i];
  el.target.textContent = fmt(r.target);
  el.sign.classList.remove('good', 'bad'); void el.sign.offsetWidth; el.sign.classList.add('drop');
  // always 5 cards: the parts plus enough look-alike cards
  S.cards = shuffle([...r.parts, ...r.extra.slice(0, Math.max(0, 5 - r.parts.length))]).map((v, k) => ({ v, k, used: false }));
  el.tray.innerHTML = '';
  S.cards.forEach((c, k) => {
    const slot = document.createElement('div'); slot.className = 'l2-bay';
    const b = card(c.v, 'tray'); b.style.setProperty('--d', k * 140 + 'ms');
    b.addEventListener('click', () => addCard(k));
    c.el = b;
    slot.append(b, Object.assign(document.createElement('i'), { className: 'l2-beam', style: `--d:${k * 140}ms` }), Object.assign(document.createElement('img'), { className: 'l2-pad', src: 'assets/level2/pad.webp', alt: '' }));
    el.tray.append(slot);
  });
  renderRail(); buildDots(); caption('');
  el.task.hidden = false; setTask(LINES.task);
  speak(LINES.build(r));
  if (document.activeElement === document.body || root.contains(document.activeElement)) S.cards[0].el.focus({ preventScroll: true });
  bumpIdle();
}
const PLACES = ['Lakhs', 'Ten Thousands', 'Thousands', 'Hundreds', 'Tens', 'Ones'];
// The rail is a place-value board: the chosen cards add up, and each digit sits in its own place box.
function renderRail() {
  const vals = S.placed.map(k => S.cards[k].v);
  const total = vals.reduce((a, b) => a + b, 0);
  const digits = total ? String(total).padStart(6, ' ').split('') : Array(6).fill(' ');
  // colour each box by the card whose first digit sits there (the biggest card covers the rest)
  const owner = Array(6).fill(null);
  vals.slice().sort((a, b) => b - a).forEach(v => {
    const col = 6 - String(v).length;
    owner[col] = v;
    for (let c = col + 1; c < 6; c++) if (!owner[c]) owner[c] = v;
  });
  el.rail.innerHTML = PLACES.map((name, c) => {
    const d = digits[c].trim();
    return `<div class="l2-col${d ? ' on plate-' + PLATE(owner[c] || 1) : ''}"><span>${name}</span><b>${d}</b></div>`;
  }).join('');
  // the chosen cards, small, above the board: tap one to pull it apart (take it out)
  el.sum.innerHTML = '';
  S.placed.forEach((k, slot) => {
    if (slot) el.sum.append(Object.assign(document.createElement('i'), { className: 'l2-plus', textContent: '+' }));
    const b = card(S.cards[k].v, 'chip');
    b.addEventListener('click', () => removeCard(slot));
    el.sum.append(b);
  });
  if (vals.length) el.sum.insertAdjacentHTML('beforeend', `<i class="l2-plus">=</i><b class="l2-total">${fmt(total)}</b>`);
  el.sum.classList.remove('bad', 'good');
  S.cards.forEach(c => c.el.classList.toggle('used', c.used));
  el.check.disabled = !vals.length;
}
function addCard(k) {
  if (S.locked || S.cards[k].used || S.placed.length >= SLOTS) return;
  S.cards[k].used = true; S.placed.push(k);
  S.handOff = true; S.cards.forEach(c => c.el && c.el.classList.remove('nudge'));
  snd() && snd().click();
  hand(null); renderRail(); bumpIdle();
  if (S.ri === 0 && S.placed.length === 1 && !S.tutDone) { S.tutDone = true; setTask(LINES.first); speak(LINES.first); }   // in the task line: no pop-up over the board
}
function removeCard(slot) {
  if (S.locked) return;
  const k = S.placed.splice(slot, 1)[0];
  S.cards[k].used = false;
  snd() && snd().pop();
  renderRail(); bumpIdle();
}
function check() {
  if (S.locked || !S.placed.length) return;
  const r = ROUNDS[S.ri], vals = S.placed.map(k => S.cards[k].v);
  const total = vals.reduce((a, b) => a + b, 0);
  hand(null); setTask(LINES.task);
  if (total === r.target) return correct();
  S.attempts++;
  snd() && snd().alarm(1);
  el.sum.classList.add('bad'); el.sign.classList.remove('bad'); void el.sign.offsetWidth; el.sign.classList.add('bad');
  if (S.attempts === 1) { caption(LINES.wrong1, 'bad'); speak(LINES.wrong1); }
  else if (S.attempts === 2) {
    caption(LINES.wrong2, 'bad'); speak(LINES.wrong2);
    // the wrong part lights up on the board
    [...el.sum.querySelectorAll('.l2-card')].forEach((b, i) => { if (!r.parts.includes(vals[i])) b.classList.add('wrongpart'); });
    // the wrong place boxes light up on the board
    const want = String(r.target).padStart(6, ' ');
    const have = String(vals.reduce((a, b) => a + b, 0)).padStart(6, ' ');
    [...el.rail.children].forEach((col, c) => { if (want[c] !== have[c]) col.classList.add('wrongpart'); });
  } else reveal();
  bumpIdle();
}
function correct() {
  const r = ROUNDS[S.ri];
  S.locked = true; S.phase = 'good';
  el.sum.classList.add('good'); el.sign.classList.add('good');
  el.rail.querySelectorAll('.l2-col').forEach(b => b.classList.add('glow'));
  caption(LINES.great(r), 'good', 60000);
  snd() && (snd().ding(3), snd().pop());
  after(speak(LINES.great(r)), 2600, () => { caption(''); S.ri + 1 < ROUNDS.length ? startRound(S.ri + 1) : outro(); });
}
function reveal() {
  const r = ROUNDS[S.ri];
  S.locked = true;
  caption(LINES.reveal(r), '', 5200); const spoken = speak(LINES.reveal(r));
  // the correct cards move onto the board
  S.cards.forEach(c => { c.used = false; });
  S.placed = [];
  renderRail();
  r.parts.slice().sort((a, b) => b - a).forEach((v, n) => later(500 + n * 450, () => {
    const k = S.cards.findIndex(c => c.v === v && !c.used);
    S.cards[k].used = true; S.placed.push(k); renderRail(); snd() && snd().click();
  }));
  later(700 + r.parts.length * 450 + 900, () => after(spoken, 0, correct));
}
function outro() {
  S.phase = 'outro'; S.locked = true;
  el.task.hidden = true;
  buildDots(); caption('');
  el.dots.querySelectorAll('li').forEach(li => li.className = 'done');
  say('ril', LINES.outro);
  snd() && snd().jingle();
  el.next.hidden = false;
  later(60, () => el.next.focus({ preventScroll: true }));
}
// ---------- inactivity: soft blue light on the next thing to tap ----------
function bumpIdle() { clearTimeout(S.idleT); S.idleT = setTimeout(idle, IDLE_MS); }
function idle() {
  if (!S.active || S.locked || S.phase !== 'round') return;
  const r = ROUNDS[S.ri];
  const want = r.parts.slice().sort((a, b) => b - a).find(v => !S.placed.some(k => S.cards[k].v === v));
  const k = S.cards.findIndex(c => c.v === want && !c.used);
  caption(LINES.idle, '', 10000); speak(LINES.idle);   // stays 10 s (tap to close)
  // the blue light shows a card only after the player has tried once (no answer before they act)
  if (k >= 0 && S.attempts > 0) { S.cards[k].el.classList.add('nudge'); later(2400, () => S.cards[k].el && S.cards[k].el.classList.remove('nudge')); }
  bumpIdle();
}

// ---------- lifecycle ----------
function start(opts = {}) {
  S.opts = opts; S.active = true; S.run++; S.tutDone = false; S.handOff = true;   // no hand on a card: it would give away a part of the answer
  root.hidden = false; el.next.hidden = true; el.task.hidden = true;
  say('nova', LINES.intro);
  S.ri = 0; S.locked = true; S.phase = 'intro';
  el.tray.innerHTML = ''; el.rail.innerHTML = ''; el.sum.innerHTML = '&nbsp;';
  el.target.textContent = fmt(ROUNDS[0].target);
  buildDots();
  after(S.introVoice, 2600, beginRounds);
}
function beginRounds() {
  if (S.phase !== 'intro') return;
  say('nova', '');
  startRound(0);
}
function stop() {
  S.active = false; S.run++; root.hidden = true;
  S.timers.forEach(t => { clearTimeout(t); clearInterval(t); }); S.timers = []; clearTimeout(S.idleT); clearTimeout(S.capT);
  window.TQVoice && TQVoice.stop();
}
el.check.addEventListener('click', check);
el.next.addEventListener('click', () => { const done = S.opts.onExit; stop(); done && done(); });
root.addEventListener('pointerdown', e => {
  e.stopPropagation();
  if (root.classList.contains('popup') && e.target.closest('.l2-veil, .l2-caption')) caption('');   // tap to close the pop-up
  if (S.phase === 'intro' && !e.target.closest('button')) beginRounds();   // tap to start at once
});   // taps here never advance the story

// every line this level can speak (used to make the voice clips)
function voiceLines() {
  return [LINES.intro, LINES.first, LINES.wrong1, LINES.wrong2, LINES.idle, LINES.outro,
    ...ROUNDS.flatMap(r => [LINES.build(r), LINES.great(r), LINES.reveal(r)])];
}
window.Level2 = { start, stop, get: () => S, ROUNDS, LINES, voiceLines };
})();
