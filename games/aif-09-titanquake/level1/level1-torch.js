(() => {
  'use strict';

  const D = window.TitanLevel1Data;
  const W = 1672, H = 941;
  const ASSETS = {
    bg: 'assets/level1/bg_record_room_wrecked.webp',
    pedestal: 'assets/level1/pedestal.webp',
    torch: 'assets/level1/torch.webp',
    dock: 'assets/level1/charger_dock.webp',
    lamp: 'assets/level1/ceiling_lamp.webp'
  };

  // Measured in torch.png (1448×1086). Fractions of the image.
  const TORCH_LENS = { x: 1085 / 1448, y: 868 / 1086 };   // centre of the glowing lens glass
  const TORCH_TAIL = { x: 300 / 1448, y: 170 / 1086 };    // centre of the back cap, where the cable plugs in
  const TORCH_BASE_ANGLE = 41.6 * Math.PI / 180;          // tail → lens direction in the art (atan2(698, 785))
  // Measured in pedestal.png (1536×1024): the dark front screen and the visible (non-transparent) art.
  const PED_SCREEN = { x: 325 / 1536, y: 422 / 1024, w: 870 / 1536, h: 261 / 1024 };
  const PED_ART = { x: 94 / 1536, y: 129 / 1024, w: 1347 / 1536, h: 802 / 1024 };
  // Measured in charger_dock.png (1024×1536).
  const DOCK_ART = { x: 163 / 1024, y: 73 / 1536, w: 698 / 1024, h: 1336 / 1536 };
  const DOCK_SOCKET = { x: 625 / 1024, y: 1290 / 1536 };  // bottom of the plug stub

  const L = {
    lamp: { cx: .5 * W, top: -.02 * H, w: .26 * W },
    dock: { x: .03 * W, y: .06 * H, w: .06 * W },            // visible box of the dock art
    torchHome: { x: .22 * W, y: .25 * H },
    torchW: .13 * W,
    pedX: [.18, .39, .61, .82],
    pedY: .79 * H,
    pedW: .175 * W,
    floor: { x: .5 * W, y: .72 * H },
    poolRx: 150, poolRy: 110,
    cableLength: 430
  };
  const BANNER_IN_MS = 1200, BANNER_OUT_MS = 850, BANNER_GAP_MS = 2000;
  const HOLD_MS = 1000, TAP_SWEEP_MS = 400, IDLE_FIRST_MS = 8000, IDLE_REPEAT_MS = 15000, SWEEP_MS = 2600;
  const BG_FALLBACK = 'assets/level1/bg_record_room_dark.webp';
  const DARK = 'rgba(2,6,18,0.6)';   // a little lighter so children can just see the records
  const RING_R = 46, RING_C = 2 * Math.PI * RING_R;
  const HAND_TIP = { x: 44, y: 6 };

  const $ = id => document.getElementById(id);
  const root = $('level1'), stage = $('l1-stage'), pedLayer = $('l1-peds'), ringLayer = $('l1-rings');
  const darkCanvas = $('l1-dark'), lightCanvas = $('l1-light'), rigCanvas = $('l1-rig');
  const dctx = darkCanvas.getContext('2d'), lctx = lightCanvas.getContext('2d'), rctx = rigCanvas.getContext('2d');
  const nameEl = $('l1-name'), dotsEl = $('l1-dots'), captionEl = $('l1-caption'), chartEl = $('l1-chart');
  const rilEl = $('l1-ril'), rilLine = $('l1-ril-line'), tapEl = $('l1-tap'), handEl = $('l1-hand'), nextEl = $('l1-next');
  const coneEl = $('l1-cone'), bannerEl = $('l1-banner'), beamEl = $('l1-beam');
  const announcer = $('sr');
  const taskEl = $('l1-task');
  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let reduced = !!motionQuery?.matches;
  motionQuery?.addEventListener?.('change', event => { reduced = event.matches; });

  const img = {};
  const peds = [];      // { el, art, num, ring, fill, cx, cy, sx, sy, hit }
  const dots = [];
  const dust = [];
  const rigBox = { x: 0, y: 0, w: 720, h: 560 };  // the torch and cable never leave this corner
  const V = { k: 1, rect: { left: 0, top: 0 }, darkRes: .5, lightRes: 1, rigRes: 1 };
  let torchSprite = null, audioCtx = null, preloadPromise = null;

  const S = {
    active: false, phase: 'idle', qi: 0, attempts: 0, used: new Set(), values: [], answerSlot: -1, prevSlot: -1,
    locked: true, aim: { ...L.floor }, aimTarget: { ...L.floor }, pivot: { ...L.torchHome }, rot: 0,
    lit: -1, litAmount: [0, 0, 0, 0], holdSlot: -1, holdStart: 0, pending: null, drag: null,
    lastInput: 0, nextIdleAt: Infinity, sweep: null, reveal: -1, celebrate: -1,
    dark: 1, darkTarget: 1, particles: [], timers: [], lastFrame: 0, run: 0, ring: { slot: -1, value: -1 },
    solved: new Set(), options: {}, voiceToken: 0
  };

  // ---------- small helpers ----------
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const ease = t => t * t * (3 - 2 * t);
  function wrapAngle(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }
  function rotate(x, y, a) { const c = Math.cos(a), s = Math.sin(a); return { x: x * c - y * s, y: x * s + y * c }; }
  function later(ms, fn) { const run = S.run; S.timers.push({ at: performance.now() + ms, fn: () => { if (run === S.run) fn(); } }); }
  function muted() { return !!window.TitanSound?.muted; }
  function say(text) { if (announcer) announcer.textContent = text; }
  function question() { return D.QUESTIONS[S.qi]; }

  // ---------- geometry ----------
  function pedRect(i) {
    const w = L.pedW, h = w * 1024 / 1536;
    return { x: L.pedX[i] * W - w / 2, y: L.pedY - h / 2, w, h };
  }
  function torchSize() { return { w: L.torchW, h: L.torchW * 1086 / 1448 }; }
  function torchPoint(frac) {
    const t = torchSize();
    const p = rotate((frac.x - .5) * t.w, (frac.y - .5) * t.h, S.rot);
    return { x: S.pivot.x + p.x, y: S.pivot.y + p.y };
  }
  function dockRect() {
    const w = L.dock.w / DOCK_ART.w, h = w * 1536 / 1024;
    return { x: L.dock.x - DOCK_ART.x * w, y: L.dock.y - DOCK_ART.y * h, w, h };
  }
  function socketPoint() { const r = dockRect(); return { x: r.x + DOCK_SOCKET.x * r.w, y: r.y + DOCK_SOCKET.y * r.h }; }
  function clampAim(p) { return { x: clamp(p.x, 30, W - 30), y: clamp(p.y, L.torchHome.y + 120, H - 20) }; }
  function screenCenter(i) { return { x: peds[i].sx, y: peds[i].sy }; }

  // ---------- build ----------
  function build() {
    for (const [name, sel] of [['bg', '.l1-bg'], ['lamp', '.l1-lamp'], ['dock', '.l1-dock']]) {
      const el = stage.querySelector(sel);
      if (img[name]) el.src = img[name].src;
    }
    const lamp = stage.querySelector('.l1-lamp');
    const lampH = L.lamp.w * 724 / 2172;
    Object.assign(lamp.style, { left: `${L.lamp.cx - L.lamp.w / 2}px`, top: `${L.lamp.top}px`, width: `${L.lamp.w}px`, height: `${lampH}px` });
    const dock = stage.querySelector('.l1-dock'), dr = dockRect();
    Object.assign(dock.style, { left: `${dr.x}px`, top: `${dr.y}px`, width: `${dr.w}px`, height: `${dr.h}px` });
    Object.assign(rigCanvas.style, { left: `${rigBox.x}px`, top: `${rigBox.y}px`, width: `${rigBox.w}px`, height: `${rigBox.h}px` });

    pedLayer.replaceChildren(); ringLayer.replaceChildren(); peds.length = 0;
    for (let i = 0; i < 4; i++) {
      const r = pedRect(i);
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'l1-ped';
      Object.assign(el.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });
      const pool = document.createElement('span'); pool.className = 'l1-ped-pool';
      const art = document.createElement('img'); art.className = 'l1-ped-art'; art.alt = ''; art.draggable = false;
      if (img.pedestal) art.src = img.pedestal.src;
      const top = document.createElement('span'); top.className = 'l1-ped-top';
      const flash = document.createElement('span'); flash.className = 'l1-ped-flash';
      const num = document.createElement('span'); num.className = 'l1-num';
      Object.assign(num.style, { left: `${PED_SCREEN.x * 100}%`, top: `${PED_SCREEN.y * 100}%`, width: `${PED_SCREEN.w * 100}%`, height: `${PED_SCREEN.h * 100}%` });
      el.append(pool, art, top, flash, num);
      el.addEventListener('focus', () => onPedFocus(i));
      el.addEventListener('click', event => { if (event.detail === 0) { input(); tapSelect(i); } });
      pedLayer.append(el);

      const sx = r.x + (PED_SCREEN.x + PED_SCREEN.w / 2) * r.w, sy = r.y + (PED_SCREEN.y + PED_SCREEN.h / 2) * r.h;
      const size = PED_SCREEN.w * r.w + 34;
      const ring = document.createElement('div');
      ring.className = 'l1-ring';
      Object.assign(ring.style, { left: `${sx - size / 2}px`, top: `${sy - size / 2}px`, width: `${size}px`, height: `${size}px` });
      ringLayer.append(ring);
      const hit = { x: r.x + PED_ART.x * r.w - 24, y: r.y + PED_ART.y * r.h - 24, w: PED_ART.w * r.w + 48, h: PED_ART.h * r.h + 48 };
      peds.push({ el, art, num, ring, fill: ring, cx: r.x + r.w / 2, cy: r.y + (PED_ART.y + PED_ART.h / 2) * r.h, sx, sy, hit, r });
    }

    dotsEl.replaceChildren(); dots.length = 0;
    D.QUESTIONS.forEach((_, i) => {
      const li = document.createElement('li'); li.className = 'l1-dot';
      li.setAttribute('aria-label', `Record ${i + 1}`);
      dotsEl.append(li); dots.push(li);
    });

    dust.length = 0;
    for (let i = 0; i < 46; i++) dust.push({ t: Math.random(), s: Math.random() * 2 - 1, v: .00002 + Math.random() * .00005, ph: Math.random() * 6.28, size: .8 + Math.random() * 1.8 });
  }

  function resize() {
    const view = window.TQView ? window.TQView() : { w: window.innerWidth, h: window.innerHeight };
    const k = Math.min(view.w / W, view.h / H);
    const wasCompact = root.classList.contains('compact');
    root.classList.toggle('compact', k < .7);
    if (wasCompact !== root.classList.contains('compact') && peds.length) { peds.forEach(p => { if (p.num.firstElementChild) fitNumeral(p.num); }); if (nameEl.textContent) fitBanner(); }
    V.k = k;
    stage.style.transform = `translate(-50%, -50%) scale(${k})`;
    const dpr = window.devicePixelRatio || 1;
    V.darkRes = .5;                                   // the darkness is all soft gradients
    V.lightRes = Math.min(.85, Math.max(.6, k * dpr));   // soft light: a lighter canvas keeps big screens smooth
    V.rigRes = Math.min(2, Math.max(1, k * dpr));
    sizeCanvas(darkCanvas, W, H, V.darkRes);
    sizeCanvas(lightCanvas, W, H, V.lightRes);
    sizeCanvas(rigCanvas, rigBox.w, rigBox.h, V.rigRes);
    buildTorchSprite();
    V.rect = stage.getBoundingClientRect();
  }
  function sizeCanvas(canvas, w, h, res) {
    const bw = Math.round(w * res), bh = Math.round(h * res);
    if (canvas.width !== bw) canvas.width = bw;
    if (canvas.height !== bh) canvas.height = bh;
  }
  function buildTorchSprite() {
    if (!img.torch) return;
    const t = torchSize();
    torchSprite ||= document.createElement('canvas');
    torchSprite.width = Math.round(t.w * V.rigRes);
    torchSprite.height = Math.round(t.h * V.rigRes);
    const c = torchSprite.getContext('2d');
    c.imageSmoothingQuality = 'high';
    c.clearRect(0, 0, torchSprite.width, torchSprite.height);
    c.drawImage(img.torch, 0, 0, torchSprite.width, torchSprite.height);
  }

  // ---------- text fitting (runs only when text changes) ----------
  function fitBanner() {
    const box = nameEl.parentElement;
    const maxH = box.clientHeight * .88;
    const big = root.classList.contains('compact');   // phones: the name must stay readable (about 14px or more)
    let size = big ? 64 : 48;
    nameEl.style.whiteSpace = 'nowrap';
    nameEl.style.fontSize = `${size}px`;
    while (size > (big ? 50 : 38) && nameEl.scrollWidth > nameEl.clientWidth + 1) nameEl.style.fontSize = `${size -= 2}px`;
    if (nameEl.scrollWidth <= nameEl.clientWidth + 1) return;
    nameEl.style.whiteSpace = 'normal';
    size = big ? 56 : 42;
    nameEl.style.fontSize = `${size}px`;
    while (size > (big ? 36 : 24) && (nameEl.scrollHeight > maxH || nameEl.scrollWidth > nameEl.clientWidth + 1)) nameEl.style.fontSize = `${size -= 2}px`;
  }
  function fitNumeral(num) {
    const text = num.firstElementChild;
    let size = root.classList.contains('compact') ? 60 : 46;
    num.style.fontSize = `${size}px`;
    while (size > 22 && text.offsetWidth > num.clientWidth - 14) num.style.fontSize = `${size -= 2}px`;
  }

  // ---------- audio ----------
  function ac() {
    if (muted()) return null;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    } catch { return null; }
  }
  function tone(a, { type = 'sine', freq, to, at = 0, dur = .2, gain = .06, filter }) {
    const now = a.currentTime + at;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, now);
    if (to) o.frequency.exponentialRampToValueAtTime(to, now + dur);
    g.gain.setValueAtTime(.0001, now);
    g.gain.exponentialRampToValueAtTime(gain, now + Math.min(.03, dur / 4));
    g.gain.exponentialRampToValueAtTime(.0001, now + dur);
    let node = o.connect(g);
    if (filter) { const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filter; node = node.connect(f); }
    node.connect(a.destination);
    o.start(now); o.stop(now + dur + .02);
  }
  function sfx(kind) {
    const a = ac();
    if (!a) return;
    try {
      if (kind === 'hum') {
        tone(a, { freq: 110, dur: .55, gain: .035 });
        tone(a, { freq: 165, dur: .5, gain: .02, type: 'triangle' });
        tone(a, { freq: 330, to: 345, dur: .35, gain: .008 });
      } else if (kind === 'chime') {
        [784, 988, 1175, 1568].forEach((freq, i) => tone(a, { type: 'triangle', freq, at: i * .09, dur: .55, gain: .07 }));
      } else if (kind === 'buzz') {
        tone(a, { type: 'square', freq: 150, to: 118, dur: .28, gain: .045, filter: 900 });
      } else if (kind === 'shake') {
        const len = Math.floor(a.sampleRate * .22), buffer = a.createBuffer(1, len, a.sampleRate), data = buffer.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) * Math.abs(Math.sin(i / len * Math.PI * 8));
        const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
        src.buffer = buffer; f.type = 'lowpass'; f.frequency.value = 420; g.gain.value = .22;
        src.connect(f).connect(g).connect(a.destination); src.start();
      } else if (kind === 'appear') {
        tone(a, { freq: 320, to: 960, dur: .38, gain: .03 });
        tone(a, { type: 'triangle', freq: 1280, at: .3, dur: .35, gain: .02 });
      } else if (kind === 'vanish') {
        tone(a, { freq: 900, to: 260, dur: .4, gain: .025 });
      } else if (kind === 'bright') {
        [523, 659, 784, 1047, 1319].forEach((freq, i) => tone(a, { type: 'sine', freq, at: i * .12, dur: 1.1, gain: .05 }));
      }
    } catch { /* Visual feedback still plays. */ }
  }

  // Voice lines: recorded clips through TQVoice (voice.js); the device voice reads any line without a clip.
  function loadVoices() {}
  function probeClips() {}
  function stopVoice() { S.voiceToken++; window.TQVoice && TQVoice.stop(); }
  function speak(key, text) {
    if (muted() || !text || !window.TQVoice) return Promise.resolve();
    S.voiceToken++;
    return TQVoice.say(text);
  }
  function spokenCorrect(q) { return q.correct; }

  // ---------- UI pieces ----------
  function caption(text, tone = '') {
    captionEl.textContent = text;
    captionEl.classList.toggle('is-visible', !!text);
    captionEl.classList.toggle('is-good', tone === 'good');
    captionEl.classList.toggle('is-bad', tone === 'bad');
  }
  function updateDots() {
    dots.forEach((dot, i) => {
      const done = S.solved.has(i);
      dot.classList.toggle('is-done', done);
      dot.classList.toggle('is-current', !done && i === S.qi && S.phase !== 'outro');
      dot.setAttribute('aria-label', `Record ${i + 1}${done ? ', found' : i === S.qi ? ', current' : ''}`);
    });
  }
  function showChart(value) {
    const cols = D.placeValue(value).map(c => `<div class="l1-chart-col"><span>${c.name}</span><b>${c.digit}</b></div>`).join('');
    chartEl.innerHTML = `<p class="l1-chart-title">You chose <strong>${D.formatIndian(value)}</strong>. Compare it with the name.</p><div class="l1-chart-grid" style="--cols:${D.placeValue(value).length}">${cols}</div>`;
    chartEl.classList.add('is-visible');
  }
  function hideChart() { chartEl.classList.remove('is-visible'); }
  function setHand(mode, x = 0, y = 0) {
    handEl.classList.toggle('is-visible', !!mode);
    handEl.classList.toggle('is-pointing', mode === 'point');
    if (mode) handEl.style.transform = `translate(${x - HAND_TIP.x}px, ${y - HAND_TIP.y}px)`;
    else handEl.style.opacity = '';
  }
  // Name banner: projected in by the ceiling lamp, collapsed back into a line of light.
  function restart(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function showBanner() {
    bannerEl.classList.remove('is-out', 'is-hidden');
    restart(bannerEl, 'is-in');
    restart(beamEl, 'is-on');
    sfx('appear');
  }
  function hideBanner() {
    bannerEl.classList.remove('is-in');
    restart(bannerEl, 'is-out');
    restart(beamEl, 'is-on');
    sfx('vanish');
  }
  function setRil(text, who = 'ril') {
    rilEl.dataset.who = who;
    rilEl.querySelector('.l1-ril-name').textContent = who === 'nova' ? 'NOVA' : 'RIL';
    rilLine.textContent = text || '';
    rilEl.classList.toggle('is-visible', !!text);
  }
  function setRing(slot, value) {
    if (S.ring.slot === slot && Math.abs(S.ring.value - value) < .004) return;
    if (S.ring.slot !== slot && S.ring.slot >= 0) peds[S.ring.slot].ring.classList.remove('is-active');
    S.ring.slot = slot; S.ring.value = value;
    if (slot < 0) return;
    peds[slot].ring.classList.add('is-active');
    peds[slot].fill.style.setProperty('--p', clamp(value, 0, 1).toFixed(3));
  }

  // ---------- flow ----------
  function layoutQuestion(i) {
    S.lastTap = null; S.tapHinted = false;
    S.qi = i; S.attempts = 0; S.used.clear(); S.reveal = -1; S.celebrate = -1; S.pending = null; S.lit = -1; S.holdSlot = -1;
    const q = question();
    S.values = D.arrange(q, S.prevSlot);
    S.answerSlot = S.values.indexOf(q.answer);
    S.prevSlot = S.answerSlot;
    peds.forEach((p, slot) => {
      const text = D.formatIndian(S.values[slot]);
      p.num.replaceChildren(Object.assign(document.createElement('span'), { textContent: text }));
      p.el.setAttribute('aria-label', `Pedestal ${slot + 1}: ${text}`);
      p.el.removeAttribute('aria-disabled');
      p.el.classList.remove('is-lit', 'is-correct', 'is-wrong', 'is-used', 'is-reveal', 'is-leaving');
      p.el.classList.add('is-entering');
      fitNumeral(p.num);
    });
    later(40, () => peds.forEach(p => p.el.classList.remove('is-entering')));
    nameEl.textContent = q.name;
    taskEl.querySelector('span').textContent = D.LINES.task;
    fitBanner();
    showBanner();
    caption(''); hideChart(); setHand(null); setRing(-1, 0);
    S.aimTarget = { ...L.floor };
    updateDots();
  }
  function startQuestion(i) {
    layoutQuestion(i);
    S.phase = 'question'; S.locked = false;
    taskEl.hidden = false;
    input();
    say(`Record ${i + 1} of ${D.QUESTIONS.length}. Find ${question().name}.`);
    later(BANNER_IN_MS, () => speak(`q${i + 1}_name`, question().name));
  }
  function input() {
    const now = performance.now();
    S.lastInput = now;
    if (S.phase === 'question') S.nextIdleAt = now + IDLE_FIRST_MS;
  }
  function begin() {
    if (S.phase !== 'intro') return;
    ac();
    setRil(''); tapEl.hidden = true; setHand(null);
    S.phase = 'question'; S.locked = false;
    taskEl.hidden = false;
    input();
    say(`Find ${question().name}.`);
    speak(`q${S.qi + 1}_name`, question().name);
  }
  function tapSelect(slot) {
    if (S.phase !== 'question' || S.locked || S.used.has(slot)) return;
    S.drag = null; S.holdSlot = -1;
    S.pending = { slot, start: performance.now() };
    S.locked = true;
    S.aimTarget = screenCenter(slot);
  }
  // One tap shines the torch on a record; a second tap on it (double-tap) chooses it.
  function tapRecord(slot) {
    if (S.phase !== 'question' || S.locked || S.used.has(slot)) return;
    const now = performance.now();
    if (S.lastTap && S.lastTap.slot === slot && now - S.lastTap.t < 700) {
      S.lastTap = null;
      tapSelect(slot);
      return;
    }
    S.lastTap = { slot, t: now };
    S.aimTarget = screenCenter(slot);
    if (!S.tapHinted) { S.tapHinted = true; caption(D.LINES.doubleTap); speak('doubleTap', D.LINES.doubleTap); }
  }
  function select(slot) {
    if (S.phase !== 'question' || S.used.has(slot)) return;
    S.holdSlot = -1; S.pending = null;
    setRing(-1, 0);
    if (S.values[slot] === question().answer) correct(slot); else wrong(slot);
  }
  function correct(slot) {
    const q = question(), p = peds[slot], run = S.run;
    S.phase = 'feedback'; S.locked = true; S.drag = null; stage.classList.remove('is-dragging');
    S.celebrate = slot; S.reveal = -1;
    S.solved.add(S.qi);
    S.aimTarget = screenCenter(slot);
    peds.forEach(o => o.el.classList.remove('is-reveal'));
    p.el.classList.add('is-correct');
    hideChart(); setHand(null);
    sfx('chime');
    if (!reduced) sparkle(p.sx, p.sy);
    caption(q.correct, 'good');
    say(q.correct);
    updateDots();
    const spoken = speak(`correct_${S.qi + 1}`, spokenCorrect(q));
    const minWait = new Promise(resolve => later(1800, resolve));
    Promise.all([spoken, minWait]).then(() => {
      if (run !== S.run || !S.active) return;
      peds.forEach((o, i) => { if (i !== slot) o.el.classList.add('is-leaving'); });
      hideBanner();
      if (S.qi >= D.QUESTIONS.length - 1) { later(BANNER_OUT_MS, outro); return; }
      later(220, () => p.el.classList.add('is-leaving'));
      // The banner collapses, the room waits 2 s, then the next question is projected in.
      later(BANNER_OUT_MS + BANNER_GAP_MS, () => startQuestion(S.qi + 1));
    });
  }
  function wrong(slot) {
    const q = question(), p = peds[slot];
    S.attempts++;
    S.used.add(slot);
    S.locked = true;
    p.el.classList.add('is-wrong');
    p.el.setAttribute('aria-disabled', 'true');
    p.el.setAttribute('aria-label', `Pedestal ${slot + 1}: ${D.formatIndian(S.values[slot])}, not this one`);
    sfx('buzz');
    if (!reduced) sfx('shake');
    later(520, () => { p.el.classList.remove('is-wrong'); p.el.classList.add('is-used'); });
    later(700, () => { if (S.phase === 'question') { S.locked = false; input(); } });
    if (S.attempts === 1) {
      caption(D.LINES.wrong, 'bad'); say(D.LINES.wrong);
      speak('wrong', D.LINES.wrong);
    } else if (S.attempts === 2) {
      caption(q.hint); say(q.hint);
      showChart(S.values[slot]);
      speak(`hint_${S.qi + 1}`, q.hint);
    } else {
      const line = D.LINES.reveal(q);
      hideChart();
      caption(line); say(line);
      S.reveal = S.answerSlot;
      const target = peds[S.answerSlot];
      target.el.classList.add('is-reveal');
      setHand('point', target.sx, target.r.y + (PED_SCREEN.y + PED_SCREEN.h) * target.r.h + 8);
      speak(`reveal_${S.qi + 1}`, line);
    }
  }
  function outro() {
    S.phase = 'outro'; S.locked = true;
    taskEl.hidden = true;
    S.darkTarget = 0; S.celebrate = -1;
    S.aimTarget = { ...L.floor };
    caption('');
    updateDots();
    coneEl.classList.remove('is-warm'); void coneEl.offsetWidth; coneEl.classList.add('is-warm');
    sfx('bright');
    setRil(D.LINES.outro, 'ril');
    root.classList.add('is-celebrating');
    say(D.LINES.outro);
    speak('outro', D.LINES.outro);
    nextEl.hidden = false;
    later(60, () => nextEl.focus({ preventScroll: true }));
  }
  function onPedFocus(i) {
    if (S.phase !== 'question' || S.locked) return;
    input();
    S.aimTarget = screenCenter(i);
  }

  // ---------- pointer / keyboard ----------
  function stagePoint(event) {
    V.rect = stage.getBoundingClientRect();
    if (window.TQView && window.TQView().rot)   // the game is turned 90° on portrait phones
      return { x: (event.clientY - V.rect.top) / V.k, y: (V.rect.right - event.clientX) / V.k };
    return { x: (event.clientX - V.rect.left) / V.k, y: (event.clientY - V.rect.top) / V.k };
  }
  function pedAtTarget(target) {
    const el = target?.closest?.('.l1-ped');
    return el ? peds.findIndex(p => p.el === el) : -1;
  }
  stage.addEventListener('pointerdown', event => {
    if (!S.active || event.target.closest('.l1-next')) return;
    if (event.button !== undefined && event.button > 0) return;
    event.preventDefault();
    if (S.phase === 'intro') { begin(); return; }
    input();
    // a double-tap that lands anywhere on the lit record also counts
    const tapped = pedAtTarget(event.target);
    if (tapped < 0 && S.lit >= 0 && S.lastTap && S.lastTap.slot === S.lit && performance.now() - S.lastTap.t < 700) {
      tapRecord(S.lit); return;
    }
    if (S.phase !== 'question' || S.locked) return;
    V.rect = stage.getBoundingClientRect();
    S.drag = { id: event.pointerId, sx: event.clientX, sy: event.clientY, moved: false, slot: pedAtTarget(event.target) };
    try { stage.setPointerCapture(event.pointerId); } catch {}
    stage.classList.add('is-dragging');
    S.aimTarget = clampAim(stagePoint(event));
  });
  stage.addEventListener('pointermove', event => {
    const drag = S.drag;
    if (!drag || drag.id !== event.pointerId) return;
    if (Math.hypot(event.clientX - drag.sx, event.clientY - drag.sy) > 8) drag.moved = true;
    input();
    S.aimTarget = clampAim(stagePoint(event));
  });
  function release(event, cancelled) {
    const drag = S.drag;
    if (!drag || drag.id !== event.pointerId) return;
    S.drag = null; S.holdSlot = -1;
    stage.classList.remove('is-dragging');
    if (cancelled || S.phase !== 'question' || S.locked) return;
    const slot = !drag.moved && drag.slot >= 0 ? drag.slot : -1;
    if (slot >= 0) tapRecord(slot);
  }
  stage.addEventListener('pointerup', event => release(event, false));
  stage.addEventListener('pointercancel', event => release(event, true));
  stage.addEventListener('lostpointercapture', event => release(event, true));
  window.addEventListener('keydown', event => {
    if (!S.active) return;
    const key = event.key;
    if (key === 'm' || key === 'M') return;   // the story shell toggles the sound (one handler, not two)
    input();
    if (S.phase === 'intro' && (key === 'Enter' || key === ' ')) { event.preventDefault(); begin(); return; }
    if (S.phase !== 'question' || !key.startsWith('Arrow')) return;
    event.preventDefault();
    const open = [0, 1, 2, 3].filter(i => !S.used.has(i));
    if (!open.length) return;
    const current = peds.findIndex(p => p.el === document.activeElement);
    const step = key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 1;
    let pos = open.indexOf(current);
    pos = pos < 0 ? (step > 0 ? 0 : open.length - 1) : (pos + step + open.length) % open.length;
    peds[open[pos]].el.focus({ preventScroll: true });
  });
  nextEl.addEventListener('click', () => {
    if (S.phase !== 'outro') return;
    const onExit = S.options.onExit;
    stop();
    window.onLevel1Complete?.();
    onExit?.();
  });
  // resizing is driven by the story shell (story.js fit()), which knows about the rotated phone layout

  // ---------- particles ----------
  function sparkle(x, y) {
    const now = performance.now();
    for (let i = 0; i < 36; i++) {
      const a = Math.random() * Math.PI * 2, speed = 1.5 + Math.random() * 5;
      S.particles.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed - 2.5, born: now, life: 700 + Math.random() * 600,
        size: 2 + Math.random() * 3.5, color: Math.random() < .5 ? '#9CFFC4' : '#FFE08A' });
    }
  }

  // ---------- per-frame ----------
  function update(now, dt) {
    for (let i = S.timers.length - 1; i >= 0; i--) {
      if (now >= S.timers[i].at) { const t = S.timers[i]; S.timers.splice(i, 1); t.fn(); }
    }
    const k = 1 - Math.pow(.8, dt / 16.667);

    if (S.phase === 'intro') {
      // The demo hand drags from the torch to pedestal 3; the beam follows it.
      const cycle = ((now - S.introStart) % 3200) / 3200;
      const from = { x: S.pivot.x + 40, y: S.pivot.y + 30 }, to = screenCenter(2);
      const t = reduced ? (cycle < .5 ? 0 : 1) : ease(clamp((cycle - .18) / .5, 0, 1));
      const hx = from.x + (to.x - from.x) * t, hy = from.y + (to.y - from.y) * t;
      setHand('drag', hx, hy);
      handEl.style.opacity = reduced ? '' : String(cycle > .9 ? (1 - cycle) * 10 : cycle < .06 ? cycle / .06 : 1);
      S.aimTarget = clampAim({ x: hx, y: hy });
    }

    S.aim.x += (S.aimTarget.x - S.aim.x) * k;
    S.aim.y += (S.aimTarget.y - S.aim.y) * k;
    const home = L.torchHome;
    const goal = { x: home.x + clamp((S.aim.x - home.x) * .08, -30, 70), y: home.y + clamp((S.aim.y - home.y) * .07, -20, 45) };
    S.pivot.x += (goal.x - S.pivot.x) * k;
    S.pivot.y += (goal.y - S.pivot.y) * k;
    const want = Math.atan2(S.aim.y - S.pivot.y, S.aim.x - S.pivot.x) - TORCH_BASE_ANGLE;
    S.rot += wrapAngle(want - S.rot) * k;

    // Which pedestal is lit: the closest one whose art contains the aim point.
    let lit = -1, best = Infinity;
    if (S.phase !== 'outro' && S.phase !== 'intro') {   // the intro demo must not give away a numeral
      peds.forEach((p, i) => {
        if (p.el.classList.contains('is-leaving')) return;
        const h = p.hit;
        if (S.aim.x < h.x || S.aim.x > h.x + h.w || S.aim.y < h.y || S.aim.y > h.y + h.h) return;
        const d = Math.hypot(S.aim.x - p.sx, S.aim.y - p.sy);
        if (d < best) { best = d; lit = i; }
      });
    }
    if (lit !== S.lit) {
      if (S.lit >= 0) peds[S.lit].el.classList.remove('is-lit');
      if (lit >= 0) {
        peds[lit].el.classList.add('is-lit');
        if (S.phase === 'question' && !S.used.has(lit)) sfx('hum');
      }
      S.lit = lit;
    }
    peds.forEach((_, i) => { S.litAmount[i] += ((i === lit ? 1 : 0) - S.litAmount[i]) * Math.min(1, k * 1.2); });

    // Selection by holding the beam (while dragging), or the tap/keyboard sweep.
    if (S.pending) {
      const t = (now - S.pending.start) / TAP_SWEEP_MS;
      setRing(S.pending.slot, t);
      if (t >= 1) { const slot = S.pending.slot; S.pending = null; S.locked = false; select(slot); }
    } else {   // no hold-to-select: a record is chosen with a double-tap
      S.holdSlot = -1;
      if (S.phase !== 'feedback') setRing(-1, 0);
    }

    // Inactivity nudge.
    if (S.phase === 'question' && !S.locked && !S.drag && now >= S.nextIdleAt) {
      caption(D.LINES.idle);
      say(D.LINES.idle);
      speak('idle', D.LINES.idle);
      S.sweep = { start: now };
      S.nextIdleAt = now + IDLE_REPEAT_MS;
    }
    if (S.sweep && now - S.sweep.start > SWEEP_MS) S.sweep = null;

    S.dark += (S.darkTarget - S.dark) * (1 - Math.pow(.97, dt / 16.667));
  }

  function beamGeometry() {
    const lens = torchPoint(TORCH_LENS), aim = S.aim;
    const dx = aim.x - lens.x, dy = aim.y - lens.y, len = Math.max(1, Math.hypot(dx, dy));
    const ux = dx / len, uy = dy / len;
    return { lens, aim, len, ux, uy, nx: -uy, ny: ux };
  }
  function conePath(c, g, scale, extend = .55) {
    const w0 = 13 * scale, w1 = L.poolRx * .82 * scale;
    const ex = g.aim.x + g.ux * L.poolRx * extend, ey = g.aim.y + g.uy * L.poolRx * extend;
    c.beginPath();
    c.moveTo(g.lens.x + g.nx * w0, g.lens.y + g.ny * w0);
    c.lineTo(ex + g.nx * w1, ey + g.ny * w1);
    c.lineTo(ex - g.nx * w1, ey - g.ny * w1);
    c.lineTo(g.lens.x - g.nx * w0, g.lens.y - g.ny * w0);
    c.closePath();
    return { ex, ey };
  }
  function ellipse(c, x, y, rx, ry, stops) {
    c.save();
    c.translate(x, y);
    c.scale(1, ry / rx);
    const grad = c.createRadialGradient(0, 0, 0, 0, 0, rx);
    for (const [at, color] of stops) grad.addColorStop(at, color);
    c.fillStyle = grad;
    c.fillRect(-rx, -rx, rx * 2, rx * 2);
    c.restore();
  }

  function drawDark(now, g) {
    const c = dctx;
    c.setTransform(V.darkRes, 0, 0, V.darkRes, 0, 0);
    c.globalCompositeOperation = 'source-over';
    c.clearRect(0, 0, W, H);
    if (S.dark < .003) return;
    c.globalAlpha = S.dark;
    c.fillStyle = DARK;
    c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'destination-out';
    // The ceiling lamp keeps the centre of the room faintly visible.
    ellipse(c, W / 2, H * .3, 420, 330, [[0, 'rgba(0,0,0,.42)'], [1, 'rgba(0,0,0,0)']]);
    // Torch beam.
    for (const [scale, alpha] of [[1.3, .16], [1, .22], [.62, .28]]) {
      const end = conePath(c, g, scale);
      const grad = c.createLinearGradient(g.lens.x, g.lens.y, end.ex, end.ey);
      grad.addColorStop(0, `rgba(0,0,0,${alpha * .6})`);
      grad.addColorStop(.72, `rgba(0,0,0,${alpha})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = grad;
      c.fill();
    }
    ellipse(c, g.aim.x, g.aim.y, L.poolRx * 1.15, L.poolRy * 1.15, [[0, 'rgba(0,0,0,1)'], [.5, 'rgba(0,0,0,.85)'], [1, 'rgba(0,0,0,0)']]);
    // Lit pedestal, celebration, third-attempt reveal.
    peds.forEach((p, i) => {
      let a = S.litAmount[i] * .9;
      if (i === S.celebrate) a = 1;
      if (i === S.reveal) a = Math.max(a, .72 + Math.sin(now / 260) * .16);
      if (a < .01) return;
      ellipse(c, p.cx, p.cy + 8, p.r.w * .62, p.r.h * .66, [[0, `rgba(0,0,0,${a})`], [.62, `rgba(0,0,0,${a * .85})`], [1, 'rgba(0,0,0,0)']]);
    });
    const sweep = sweepSpots(now);
    for (const s of sweep) ellipse(c, s.x, s.y, 190, 150, [[0, `rgba(0,0,0,${.75 * s.a})`], [1, 'rgba(0,0,0,0)']]);
    c.globalAlpha = 1;
  }
  function sweepSpots(now) {
    if (!S.sweep) return [];
    const t = clamp((now - S.sweep.start) / SWEEP_MS, 0, 1);
    const env = Math.sin(Math.PI * t);
    const y = peds[0].sy;
    if (reduced) return peds.map(p => ({ x: p.sx, y, a: env }));
    const x0 = peds[0].sx - 220, x1 = peds[3].sx + 220;
    return [{ x: x0 + (x1 - x0) * ease(t), y, a: Math.min(1, env * 1.6) }];
  }

  function drawLight(now, g) {
    const c = lctx;
    c.setTransform(V.lightRes, 0, 0, V.lightRes, 0, 0);
    c.globalCompositeOperation = 'source-over';
    c.clearRect(0, 0, W, H);
    const beam = S.phase === 'outro' ? Math.max(.35, S.dark) : 1;
    c.globalAlpha = beam;
    for (const [scale, alpha] of [[1.3, .07], [1, .1], [.62, .14]]) {
      const end = conePath(c, g, scale);
      const grad = c.createLinearGradient(g.lens.x, g.lens.y, end.ex, end.ey);
      grad.addColorStop(0, `rgba(255,222,160,${alpha * 2.2})`);
      grad.addColorStop(.35, `rgba(255,190,100,${alpha * 1.3})`);
      grad.addColorStop(.75, `rgba(255,179,71,${alpha})`);
      grad.addColorStop(1, 'rgba(255,179,71,0)');
      c.fillStyle = grad;
      c.fill();
    }
    ellipse(c, g.aim.x, g.aim.y, L.poolRx, L.poolRy, [[0, 'rgba(255,205,130,.34)'], [.55, 'rgba(255,179,71,.14)'], [1, 'rgba(255,179,71,0)']]);
    ellipse(c, g.lens.x, g.lens.y, 70, 70, [[0, 'rgba(255,232,180,.75)'], [.4, 'rgba(255,179,71,.25)'], [1, 'rgba(255,179,71,0)']]);
    // Floating dust inside the cone.
    if (!reduced) {
      c.fillStyle = '#FFE3B0';
      for (const d of dust) {
        d.t += d.v * S.dt;
        if (d.t > 1) { d.t -= 1; d.s = Math.random() * 2 - 1; }
        const along = d.t * (g.len + L.poolRx * .3);
        const half = 13 + (L.poolRx * .75 - 13) * clamp(along / g.len, 0, 1.2);
        const wob = Math.sin(now / 1400 + d.ph) * .18;
        const across = (d.s + wob) * half * .85;
        const x = g.lens.x + g.ux * along + g.nx * across, y = g.lens.y + g.uy * along + g.ny * across;
        c.globalAlpha = beam * Math.sin(Math.PI * d.t) * (.35 + .35 * Math.sin(now / 500 + d.ph * 3));
        c.fillRect(x, y, d.size, d.size);
      }
      c.globalAlpha = 1;
    }
    // Inactivity sweep: a soft blue light crosses the pedestals once.
    for (const s of sweepSpots(now)) ellipse(c, s.x, s.y, 170, 130, [[0, `rgba(90,170,255,${.42 * s.a})`], [1, 'rgba(47,140,255,0)']]);
    // Celebration sparkles.
    if (S.particles.length) {
      S.particles = S.particles.filter(p => now - p.born < p.life);
      for (const p of S.particles) {
        const age = (now - p.born) / p.life;
        const x = p.x + p.vx * age * 40, y = p.y + p.vy * age * 40 + age * age * 60;
        c.globalAlpha = 1 - age;
        c.fillStyle = p.color;
        c.beginPath(); c.arc(x, y, p.size * (1 - age * .5), 0, Math.PI * 2); c.fill();
        c.globalAlpha = (1 - age) * .3;
        c.beginPath(); c.arc(x, y, p.size * 3, 0, Math.PI * 2); c.fill();
      }
      c.globalAlpha = 1;
    }
  }

  function drawRig() {
    const c = rctx;
    c.setTransform(V.rigRes, 0, 0, V.rigRes, -rigBox.x * V.rigRes, -rigBox.y * V.rigRes);
    c.clearRect(rigBox.x, rigBox.y, rigBox.w, rigBox.h);
    // Cable: dock socket → torch tail, sagging more when the torch is close.
    const s = socketPoint(), t = torchPoint(TORCH_TAIL);
    const dist = Math.hypot(t.x - s.x, t.y - s.y);
    const sag = 18 + Math.max(0, L.cableLength - dist) * .8;
    const cx = (s.x + t.x) / 2 - (t.x - s.x) * .12, cy = Math.min(rigBox.h - 30, (s.y + t.y) / 2 + sag * 2);
    c.lineCap = 'round';
    const path = () => { c.beginPath(); c.moveTo(s.x, s.y); c.quadraticCurveTo(cx, cy, t.x, t.y); };
    path(); c.strokeStyle = 'rgba(63,169,255,.16)'; c.lineWidth = 16; c.stroke();
    path(); c.strokeStyle = '#3FA9FF'; c.lineWidth = 7; c.shadowColor = '#3FA9FF'; c.shadowBlur = 16 * V.rigRes; c.stroke();
    c.shadowBlur = 0;
    path(); c.strokeStyle = '#D6F1FF'; c.lineWidth = 2.5; c.stroke();
    // Torch.
    if (torchSprite) {
      const size = torchSize();
      c.save();
      c.translate(S.pivot.x, S.pivot.y);
      c.rotate(S.rot);
      c.drawImage(torchSprite, -size.w / 2, -size.h / 2, size.w, size.h);
      c.restore();
    }
  }

  function frame(now) {
    if (!S.active) return;
    const dt = S.lastFrame ? Math.min(64, now - S.lastFrame) : 16.667;
    S.lastFrame = now; S.dt = dt;
    update(now, dt);
    if (!S.active) return;
    const g = beamGeometry();
    drawDark(now, g);
    drawLight(now, g);
    drawRig();
  }

  // ---------- public ----------
  function loadImage(name, src, fallback) {
    return new Promise(resolve => {
      const item = new Image();
      item.onload = () => { img[name] = item; resolve(); };
      item.onerror = () => {
        if (!fallback) { console.warn(`Could not load ${src}`); resolve(); return; }
        console.warn(`Could not load ${src}; using ${fallback} instead.`);
        loadImage(name, fallback).then(resolve);
      };
      item.src = src;
    });
  }
  function preload() {
    if (preloadPromise) return preloadPromise;
    loadVoices();
    try { window.speechSynthesis?.addEventListener?.('voiceschanged', loadVoices); } catch {}
    probeClips();
    const font = document.fonts?.load ? Promise.race([
      Promise.all([document.fonts.load('800 40px Orbitron'), document.fonts.load('700 26px Rajdhani')]).catch(() => {}),
      new Promise(resolve => setTimeout(resolve, 2500))
    ]) : Promise.resolve();
    preloadPromise = Promise.all([...Object.entries(ASSETS).map(([name, src]) => loadImage(name, src, name === 'bg' ? BG_FALLBACK : null)), font]).then(build);
    return preloadPromise;
  }
  function start(options = {}) {
    S.options = options;
    return preload().then(() => {
      S.run++;
      S.timers.length = 0; S.particles.length = 0;
      S.active = true; S.solved.clear(); S.prevSlot = -1; S.lit = -1; S.litAmount = [0, 0, 0, 0];
      S.dark = 1; S.darkTarget = 1; S.drag = null; S.sweep = null; S.lastFrame = 0; S.ring = { slot: -1, value: -1 };
      S.rot = Math.atan2(L.floor.y - L.torchHome.y, L.floor.x - L.torchHome.x) - TORCH_BASE_ANGLE;
      S.pivot = { ...L.torchHome }; S.aim = { ...L.floor }; S.aimTarget = { ...L.floor };
      const first = clamp((options.question || 1) - 1, 0, D.QUESTIONS.length - 1);
      for (let i = 0; i < first; i++) S.solved.add(i);
      root.hidden = false;
      root.classList.remove('is-celebrating');
      nextEl.hidden = true;
      coneEl.classList.remove('is-warm');
      peds.forEach(p => p.el.classList.remove('is-lit'));
      resize();
      S.phase = 'intro'; S.locked = true;
      layoutQuestion(first);
      S.phase = 'intro';
      S.introStart = performance.now();
      S.nextIdleAt = Infinity;
      setRil(D.LINES.intro, 'nova');
      tapEl.hidden = false;
      taskEl.hidden = true;
      updateDots();
      say(`${D.LINES.intro} Tap anywhere to start.`);
      speak('intro', D.LINES.intro);
    });
  }
  function stop() {
    S.active = false; S.run++;
    S.timers.length = 0;
    stopVoice();
    root.hidden = true;
    setRil(''); caption(''); setHand(null);
  }

  // every line this level can speak (used to make the voice clips)
  function voiceLines() {
    const L = D.LINES;
    return [L.intro, L.doubleTap, L.wrong, L.idle, L.outro, ...D.QUESTIONS.flatMap(q => [q.name, q.correct, q.hint, L.reveal(q)])];
  }
  window.Level1 = {
    preload, start, stop, frame, resize, voiceLines,
    get: () => S,
    GEOM: { W, H, TORCH_LENS, TORCH_TAIL, TORCH_BASE_ANGLE, PED_SCREEN, PED_ART, DOCK_ART, DOCK_SOCKET, L }
  };
})();
