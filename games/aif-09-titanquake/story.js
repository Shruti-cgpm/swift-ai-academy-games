/* Titanquake – story / cutscene player (vanilla JS).
 *
 * ART  (story/assets/, made from the "story assets" folder)
 *   room-calm.jpg   Scene 1 + 5 background ("first screen")
 *   room-mess.jpg   Scene 3 + 4 background ("after titanquake")
 *   quake.mp4       Scene 2 – the quake itself ("titanquake video")
 *   nova.png / ril.png   the characters;  monitor-red.jpg   red monitor used for the Scene 5 fix
 *
 * PUBLIC API
 *   startStory(from)            from = 'intro' (default) | 'outro' | scene id | scene number (1-5)
 *   window.onStoryPartComplete  hook, called with 'intro' (after Scene 4) or 'outro' (after Scene 5).
 *                               Replace it to plug in the mini-games; return false from your
 *                               function to also show the built-in placeholder / end card.
 *   Titanquake.playOutro()      shortcut for startStory('outro') – call it when gameplay is done.
 *   Titanquake.setMuted(bool), Titanquake.scenes (editable data), Titanquake.stop()
 *   A 'storypartcomplete' CustomEvent ({ detail: { part } }) is also dispatched on window.
 *
 * EDITING
 *   All text and timing lives in `scenes` below. Lines in (parentheses) are stage directions:
 *   they are never shown, they run the actions listed for them in DIRECTIONS.
 *   `cues` fire an action when the typewriter reaches the `when` phrase of a line.
 *   Every line has an `audioSrc` for voice-over (leave '' for none).
 *
 *   URL helpers for testing: ?scene=3 (start there)  &autostart (skip the title screen)
 */
(() => {
'use strict';

/* ======================================================================
   DATA
   ====================================================================== */

const CONFIG = {
  typeMs: 34,                       // ms per character
  screen: { normal: '', fixed: '' },   // the monitor art shows no numbers   // number shown on the green monitor
  feetY: 730,                       // where characters stand on the stage
  brokenTile: '4,500',              // the record that broke into pieces
};

const CAST = {
  nova: { name: 'NOVA' },
  ril:  { name: 'RIL'  },
};

// Stage directions written in (parentheses) → actions. Keys are lower-case, no final full stop.
const DIRECTIONS = {
  'a low rumble': [
    { do: 'lowRumble' },
    { do: 'pose', who: 'nova', pose: 'startled' },
    { do: 'pose', who: 'ril', pose: 'startled' },
  ],
  'it stops': [
    { do: 'quakeStop' },
  ],
  'animate the torch passing from ril to nova': [
    { do: 'torchPass' },
  ],
};

const scenes = [
  {
    id: 'before-the-quake', part: 'intro', number: 1, name: 'Before the Quake', transition: 'fade',
    setup: {
      bg: 'calm', light: 'bright', screen: 'normal', pieces: false, torch: null, aim: { x: 800, y: 620 },
      nova: { x: -300, pose: 'idle' },              // off-screen left
      ril:  { x: 1900, pose: 'present' },           // off-screen right
      checklist: 0,
    },
    beats: [
      { do: 'walk', who: 'nova', x: 260, ms: 1300, async: true },   // slides in left → right
      { do: 'walk', who: 'ril', x: 1340, ms: 1300 },                // slides in right → left
      { wait: 300 },
      { say: 'ril', audioSrc: '', text: 'Welcome, Nova! This is the record room.',
        cues: [
          { when: 'Welcome', do: 'pose', who: 'ril', pose: 'present' },
          { when: 'This is', do: 'pose', who: 'ril', pose: 'shelf' },
        ] },
      { say: 'ril', audioSrc: '', text: 'Every number on the big screen comes from these records. Your job is to keep them right.',
        cues: [
          { when: 'big screen', do: 'pose', who: 'ril', pose: 'point' },
          { when: 'these records', do: 'pose', who: 'ril', pose: 'shelf' },
          { when: 'Your job', do: 'pose', who: 'ril', pose: 'job' },
          { when: 'Your job', do: 'pose', who: 'nova', pose: 'happy' },
        ] },
      { say: 'nova', audioSrc: '', text: 'Looks easy! (a low rumble) …Did you feel that?',
        cues: [
          { when: 'Looks easy', do: 'pose', who: 'nova', pose: 'easy' },
          { when: '…Did', do: 'pose', who: 'nova', pose: 'worried' },
        ] },
      { do: 'flicker', ms: 1300 },
      { wait: 300 },
    ],
  },
  {
    id: 'the-quake', part: 'intro', number: 2, name: 'The Quake', transition: 'fade',
    setup: {
      bg: 'video', light: 'bright', screen: 'normal', pieces: false, torch: null, aim: { x: 800, y: 620 },
      nova: { x: -300, pose: 'worried', hidden: true },   // off-screen left until the video ends   // the quake video plays on its own
      ril:  { x: 1900, pose: 'idle' },            // Ril has gone to fetch a torch
      checklist: 0,
    },
    beats: [
      { do: 'quakeStart' },
      { do: 'quakeStop' },                          // waits for the video to finish
      { do: 'show', who: 'nova', pose: 'worried' },
      { do: 'walk', who: 'nova', x: 260, ms: 1200 },          // slides in left → right
      { wait: 500 },
      { say: 'nova', audioSrc: '', text: 'Whoa! The whole room is shaking! …What was that?',
        cues: [ { when: '…What', do: 'pose', who: 'nova', pose: 'worried' } ] },
      { do: 'pose', who: 'nova', pose: 'worried' },
      { wait: 500 },
    ],
  },
  {
    id: 'the-mess', part: 'intro', number: 3, name: 'The Mess', transition: 'fade',
    setup: {
      bg: 'mess', light: 'dark', screen: 'wrong', pieces: true,
      torch: { holder: 'ril', on: false }, aim: { x: 700, y: 560 },
      nova: { x: 260, pose: 'worried' },
      ril:  { x: 1900, pose: 'torch' },
      checklist: 0,
    },
    beats: [
      { wait: 300 },
      { do: 'ost', text: 'RED ALERT', style: 'alert', hold: 1700 },
      { do: 'torchOn', who: 'ril' },
      { do: 'walk', who: 'ril', x: 1340, ms: 1300 },
      { say: 'ril', audioSrc: '', text: 'That was a Titanquake. The ground shakes here sometimes.',
        cues: [ { when: 'ground shakes', do: 'aim', x: 800, y: 382 } ] },
      { say: 'ril', audioSrc: '', text: 'Uh-oh. It made a big mess in here. The lights are out. Here, take this torch.',
        cues: [
          { when: 'big mess', do: 'aim', x: 800, y: 560 },
          { when: 'Here, take', do: 'walk', who: 'ril', x: 640, ms: 1500 },
        ] },
      { text: '(Animate the torch passing from Ril to Nova.)' },
      { say: 'nova', audioSrc: '', text: 'The cards fell down… and the big screen is red!',
        cues: [
          { when: 'The cards', do: 'aim', x: 800, y: 560 },
          { when: 'big screen', do: 'aim', x: 800, y: 382 },
        ] },
      { do: 'alarm', times: 2 },
      { wait: 500 },
    ],
  },
  {
    id: 'the-plan', part: 'intro', number: 4, name: 'The Plan', transition: 'wipe',
    setup: {
      bg: 'mess', light: 'dark', screen: 'wrong', pieces: true,
      torch: { holder: 'nova', on: true }, aim: { x: 800, y: 560 },
      nova: { x: 260, pose: 'torch' },
      ril:  { x: 1340, pose: 'present' },
      checklist: 0,
    },
    beats: [
      { wait: 300 },
      { do: 'ost', text: '3 THINGS TO FIX', hold: 1700 },
      { say: 'ril', audioSrc: '', text: 'We have three things to fix.' },
      { say: 'ril', audioSrc: '', text: 'One. The records fell everywhere. Use your torch to find each one.',
        cues: [ { when: 'One.', do: 'task', n: 1 } ] },
      { say: 'ril', audioSrc: '', text: 'Two. Some numbers broke into pieces.',
        cues: [ { when: 'Two.', do: 'task', n: 2 } ] },
      { say: 'ril', audioSrc: '', text: "Three. The big screen shows the wrong number. Let's fix them one at a time.",
        cues: [ { when: 'Three.', do: 'task', n: 3 }, { when: "Let's fix", do: 'task', n: 0 } ] },
      { do: 'pose', who: 'nova', pose: 'listen' },
      { wait: 800 },
    ],
  },
  // ---- LEVEL 1 · FIND THE RECORD plays here (onStoryPartComplete('intro')) ----
  {
    id: 'to-repair', part: 't1', number: 'T1', label: 'ROOM CHANGE', name: 'Repair Table', transition: 'fade',
    setup: {
      bg: 'mess', light: 'bright', screen: 'normal', pieces: false, torch: null, aim: { x: 800, y: 620 },
      nova: { x: 260, pose: 'proud' },
      ril:  { x: 1340, pose: 'beckon' },
      checklist: 0,
    },
    beats: [
      { wait: 300 },
      { say: 'ril', audioSrc: '', text: 'Great! Every record is found. Come with me to the repair table.' },
      { do: 'walk', who: 'nova', x: 1950, ms: 1500, async: true },
      { do: 'walk', who: 'ril', x: 2050, ms: 1300 },
      { wait: 300 },
      { do: 'room', bg: 'table', nova: -260, ril: -460 },
      { do: 'walk', who: 'ril', x: 1340, ms: 1700, async: true },
      { do: 'walk', who: 'nova', x: 260, ms: 1300 },
      { do: 'pose', who: 'ril', pose: 'explain' },
      { do: 'pose', who: 'nova', pose: 'ready' },
      { wait: 400 },
      { do: 'ost', text: 'BUILD THE NUMBER', hold: 1500 },
      { do: 'room', bg: 'tableBroken', nova: -900, ril: -900 },   // close-up of the broken number pieces
      { say: 'ril', audioSrc: '', text: "Some numbers broke into pieces. Let's help Nova make each one whole again." },
      { wait: 300 },
    ],
  },
  // ---- LEVEL 2 · BUILD THE NUMBER plays here (onStoryPartComplete('t1')) ----
  {
    id: 'to-screen', part: 't2', number: 'T2', label: 'ROOM CHANGE', name: 'The Big Screen', transition: 'fade',
    setup: {
      bg: 'table', light: 'bright', screen: 'normal', pieces: false, torch: null, aim: { x: 800, y: 620 },
      nova: { x: 260, pose: 'happy' },
      ril:  { x: 1340, pose: 'beckon' },
      checklist: 0,
    },
    beats: [
      { wait: 300 },
      { say: 'ril', audioSrc: '', text: "Almost done! One thing is left: the big screen on the wall. Let's go.",
        cues: [ { when: "Let's go", do: 'pose', who: 'ril', pose: 'beckon' } ] },
      { do: 'walk', who: 'nova', x: 1950, ms: 1400, async: true },
      { do: 'walk', who: 'ril', x: 2050, ms: 1200 },
      { wait: 200 },
      { do: 'room', bg: 'mess', nova: -260, ril: -460 },
      { do: 'walk', who: 'ril', x: 1340, ms: 1600, async: true },
      { do: 'walk', who: 'nova', x: 260, ms: 1300 },
      { do: 'pose', who: 'nova', pose: 'worried' },
      { say: 'ril', audioSrc: '', text: "Now the big screen. It still shows a wrong number. Let's help Nova make it right.",
        cues: [
          { when: 'big screen', do: 'pose', who: 'ril', pose: 'point' },
          { when: "Let's help", do: 'pose', who: 'ril', pose: 'job' },
          { when: "Let's help", do: 'pose', who: 'nova', pose: 'happy' },
        ] },
      { do: 'ost', text: 'FIX THE SCREEN', hold: 1300 },
      { do: 'zoomScreen' },
    ],
  },
  // ---- LEVEL 3 · FIX THE BIG SCREEN plays here (onStoryPartComplete('t2')) ----
  {
    id: 'all-fixed', part: 'outro', number: 5, name: 'All Fixed', transition: 'wipe',
    setup: {
      bg: 'calm', light: 'warm', screen: 'wrong', pieces: false, torch: null, aim: { x: 800, y: 620 },
      nova: { x: 260, pose: 'idle' },
      ril:  { x: 1340, pose: 'idle' },
      checklist: 3,
    },
    beats: [
      { wait: 700 },
      { do: 'screenFix', ms: 1800 },
      { do: 'checklistDone' },
      { do: 'celebrate', jingle: true },
      { do: 'ost', text: 'ALL FIXED ✓', style: 'done', hold: 1500 },
      { say: 'ril', audioSrc: '', text: 'You did it! The screen is green again, and the room is all fixed.', },
      { say: 'ril', audioSrc: '', text: 'Great day, Nova!',
        cues: [ { when: 'Great day', do: 'pose', who: 'ril', pose: 'thumbs' } ] },
      { say: 'nova', audioSrc: '', text: 'We fixed everything!',
        cues: [ { when: 'We fixed', do: 'celebrate', jingle: false } ] },
      { wait: 1200 },
    ],
  },
];

// Highlight rings / torch pools, in stage pixels (1600×900), matched to the background art.
const SPOTS = {
  cards:  { cx: 800, cy: 556, rx: 300, ry: 60 },
  pieces: { cx: 130, cy: 690, rx: 150, ry: 80 },
  screen: { cx: 800, cy: 382, rx: 270, ry: 118 },
  shelfL: { cx: 205, cy: 360, rx: 200, ry: 290 },
  shelfR: { cx: 1395, cy: 360, rx: 200, ry: 290 },
};
const TASKS = { 1: 'cards', 2: 'pieces', 3: 'screen' };
const CHECKLIST = [
  { n: 1, text: 'Find the cards' },
  { n: 2, text: 'Fix the numbers' },
  { n: 3, text: 'Fix the screen' },
];
// Broken tile pieces on the floor: [x, y, rotation] of each piece's full-tile frame.
const PIECES = [[-6, 640, -16], [26, 662, 7], [62, 636, 18]];   // a broken Level 2 number card

// The supplied character art (cropped to the figure). hand = where the torch is held, in image pixels.
const CH = {
  nova: { imgW: 332, imgH: 760, h: 440, hand: [278, 248] },
  ril:  { imgW: 419, imgH: 760, h: 500, hand: [40, 206] },
};
const TORCH_ART_ANGLE = 36;
// Generated emotion art (assets/gen). [src, image width at 760px tall, optional torch-lens point]
const ART = {
  nova: {
    walk: ['assets/gen/nova-walk-strip.webp', 431, 'right', .76],
    poses: {   // regenerated from the Nova character model sheet
      idle:     ['assets/gen/nova-idle.webp', 250],
      happy:    ['assets/gen/talk/nova-happy-c.webp', 314],
      startled: ['assets/gen/nova-startled.webp', 325],
      brace:    ['assets/gen/nova-brace.webp', 425],
      worried:  ['assets/gen/talk/nova-worried-c.webp', 237],
      easy:     ['assets/gen/talk/nova-easy-c.webp', 301],
      torch:    ['assets/gen/talk/nova-torch-c.webp', 410, [375, 287], -3],
      listen:   ['assets/gen/nova-listen.webp', 309, [115, 495], 33],
      nod:      ['assets/gen/nova-listen.webp', 309, [115, 495], 33],
      cheer:    ['assets/gen/talk/nova-cheer-c.webp', 443],
      proud:    ['assets/gen/nova-proud.webp', 313],
      ready:    ['assets/gen/nova-ready.webp', 415],
    },
  },
  ril: {
    walk: ['assets/gen/ril-walk-strip.webp', 462, 'right', .92],
    poses: {
      idle:     ['assets/ril.webp', 419],
      present:  ['assets/gen/talk/ril-present-c.webp', 420],
      point:    ['assets/gen/talk/ril-point-c.webp', 394],
      shelf:    ['assets/gen/talk/ril-shelf-c.webp', 421],
      job:      ['assets/gen/talk/ril-job-c.webp', 387],
      happy:    ['assets/gen/ril-thumbs.webp', 362],
      thumbs:   ['assets/gen/talk/ril-thumbs-c.webp', 362],
      startled: ['assets/gen/ril-worried.webp', 292],
      worried:  ['assets/gen/ril-worried.webp', 292],
      torch:    ['assets/gen/talk/ril-torch-c.webp', 429, [23, 294], -156],
      offer:    ['assets/gen/ril-offer.webp', 424, [88, 290], 62],
      count1:   ['assets/gen/talk/ril-count1-c.webp', 294],
      count2:   ['assets/gen/talk/ril-count2-c.webp', 346],
      count3:   ['assets/gen/talk/ril-count3-c.webp', 370],
      nod:      ['assets/gen/ril-present.webp', 420],
      cheer:    ['assets/gen/ril-cheer.webp', 389],
      beckon:   ['assets/gen/talk/ril-beckon-c.webp', 365],
      explain:  ['assets/gen/ril-explain.webp', 434],
    },
  },
};   // direction the lens faces in assets/ui/torch.webp
const POSES = [...new Set(Object.values(ART).flatMap(a => Object.keys(a.poses)))];

/* ======================================================================
   SOUND (effects synthesised with Web Audio; the quake video has its own soundtrack)
   ====================================================================== */

const Sound = (() => {
  let ctx = null, master = null, muted = false, white = null, brown = null;
  const live = new Set();

  function unlock() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = muted ? 0 : 0.8;
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -14; comp.ratio.value = 4;
        master.connect(comp); comp.connect(ctx.destination);
        white = buffer(false); brown = buffer(true);
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { console.warn('[story] audio unavailable', e); }
  }
  const ready = () => !!ctx && ctx.state !== 'closed';

  function buffer(isBrown) {
    const n = ctx.sampleRate * 2, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      if (isBrown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
    }
    return b;
  }
  function reg(src) { live.add(src); src.onended = () => live.delete(src); return src; }
  function gain(v = 0, dest = master) { const g = ctx.createGain(); g.gain.value = v; g.connect(dest); return g; }
  function filt(type, f, q = 0.7, dest = master) { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; b.connect(dest); return b; }
  function noise(kind, t, dur, dest) {
    const s = ctx.createBufferSource(); s.buffer = kind === 'brown' ? brown : white; s.loop = true;
    s.connect(dest); s.start(t); s.stop(t + dur + 0.05); return reg(s);
  }
  function tone(type, f, t, dur, dest) {
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
    o.connect(dest); o.start(t); o.stop(t + dur + 0.05); return reg(o);
  }
  function env(g, t, a, peak, d) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  const midi = n => 440 * Math.pow(2, (n - 69) / 12);

  function rumble(level = 1, dur = 30) {
    if (!ready()) return { stop() {} };
    const t = ctx.currentTime;
    const out = gain(0);
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(0.9 * level, t + 0.35);
    out.gain.setValueAtTime(0.9 * level, t + Math.max(0.4, dur - 0.6));
    out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const wobble = gain(0.7, out);
    const lfo = gain(0.3, wobble.gain); tone('sine', 5.3, t, dur, lfo);
    noise('brown', t, dur, filt('lowpass', 150, 0.7, wobble));
    tone('sine', 38, t, dur, gain(0.5, wobble));
    tone('sine', 52, t, dur, gain(0.2, wobble));
    return {
      stop(fade = 0.8) {
        const n = ctx.currentTime;
        out.gain.cancelScheduledValues(n);
        out.gain.setValueAtTime(Math.max(out.gain.value, 0.0002), n);
        out.gain.exponentialRampToValueAtTime(0.0001, n + fade);
      },
    };
  }
  function buzz(ms = 800) {
    if (!ready()) return;
    const t = ctx.currentTime, dur = ms / 1000;
    const g = gain(0), bp = filt('bandpass', 1100, 1.5, g);
    tone('sawtooth', 100, t, dur, bp); tone('square', 150, t, dur, bp);
    for (let x = t; x < t + dur; x += 0.03 + Math.random() * 0.07) g.gain.setValueAtTime(Math.random() < 0.55 ? 0.14 : 0, x);
    g.gain.setValueAtTime(0, t + dur);
  }
  function alarm(times = 3) {
    if (!ready()) return;
    const t = ctx.currentTime, lp = filt('lowpass', 2600);
    for (let i = 0; i < times; i++) {
      const t0 = t + i * 0.46;
      const g1 = gain(0, lp); env(g1, t0, 0.01, 0.2, 0.17); tone('square', 880, t0, 0.2, g1);
      const g2 = gain(0, lp); env(g2, t0 + 0.2, 0.01, 0.2, 0.17); tone('square', 660, t0 + 0.2, 0.2, g2);
    }
  }
  function click() {
    if (!ready()) return;
    const t = ctx.currentTime;
    [0, 0.08].forEach((o, i) => {
      const g = gain(0, filt('highpass', 2500)); env(g, t + o, 0.002, i ? 0.35 : 0.6, 0.025); noise('white', t + o, 0.04, g);
      const g2 = gain(0); env(g2, t + o, 0.002, 0.18, 0.04); tone('sine', i ? 1500 : 2100, t + o, 0.05, g2);
    });
  }
  function pop() {
    if (!ready()) return;
    const t = ctx.currentTime;
    const g = gain(0), bp = filt('bandpass', 3000, 1.2, g);
    bp.frequency.setValueAtTime(3000, t); bp.frequency.exponentialRampToValueAtTime(500, t + 0.15);
    env(g, t, 0.005, 0.7, 0.16); noise('white', t, 0.2, bp);
    const g2 = gain(0); env(g2, t, 0.005, 0.3, 0.12);
    const o = tone('sine', 600, t, 0.15, g2); o.frequency.exponentialRampToValueAtTime(140, t + 0.12);
  }
  function thud() {
    if (!ready()) return;
    const t = ctx.currentTime;
    const g = gain(0); env(g, t, 0.005, 0.8, 0.35);
    const o = tone('sine', 110, t, 0.4, g); o.frequency.exponentialRampToValueAtTime(40, t + 0.35);
    const g2 = gain(0, filt('lowpass', 400)); env(g2, t, 0.005, 0.7, 0.3); noise('brown', t, 0.35, g2);
  }
  function whoosh() {
    if (!ready()) return;
    const t = ctx.currentTime;
    const g = gain(0), bp = filt('bandpass', 400, 1, g);
    bp.frequency.setValueAtTime(300, t); bp.frequency.exponentialRampToValueAtTime(2200, t + 0.25); bp.frequency.exponentialRampToValueAtTime(500, t + 0.55);
    env(g, t, 0.2, 0.3, 0.35); noise('white', t, 0.6, bp);
  }
  function ding(n = 1) {
    if (!ready()) return;
    const t = ctx.currentTime, f = 880 * ([1, 1, 1.26, 1.5][n] || 1);
    const g = gain(0); env(g, t, 0.005, 0.22, 0.7); tone('sine', f, t, 0.75, g);
    const g2 = gain(0); env(g2, t, 0.005, 0.07, 0.4); tone('sine', f * 2, t, 0.45, g2);
  }
  function blip(who) {
    if (!ready()) return;
    const t = ctx.currentTime, f = (who === 'nova' ? 640 : 400) + Math.random() * 80;
    const g = gain(0); env(g, t, 0.005, 0.045, 0.05); tone('triangle', f, t, 0.06, g);
  }
  function sting(style) {
    if (!ready()) return;
    if (style === 'alert') return alarm(3);
    const t = ctx.currentTime;
    const notes = style === 'done' ? [72, 76, 79, 84] : [67, 74];
    notes.forEach((n, i) => {
      const g = gain(0); env(g, t + i * 0.09, 0.01, 0.16, 0.5); tone('triangle', midi(n), t + i * 0.09, 0.55, g);
    });
    whoosh();
  }
  function jingle() {
    if (!ready()) return;
    const t = ctx.currentTime + 0.05, step = 0.14;
    const mel = [72, 76, 79, 76, 81, 79, 84];
    mel.forEach((n, i) => {
      const d = i === mel.length - 1 ? 0.7 : step;
      const g = gain(0); env(g, t + i * step, 0.01, 0.2, d); tone('triangle', midi(n), t + i * step, d + 0.05, g);
    });
    [[48, 0], [53, 0.56], [55, 0.7], [48, 0.84]].forEach(([n, o]) => {
      const g = gain(0); env(g, t + o, 0.01, 0.14, 0.3); tone('square', midi(n), t + o, 0.35, filt('lowpass', 700, 0.7, g));
    });
    [72, 76, 79].forEach(n => { const g = gain(0); env(g, t + 0.84, 0.02, 0.08, 0.9); tone('sine', midi(n), t + 0.84, 1, g); });
    [2093, 2637, 3136].forEach((f, i) => { const g = gain(0); env(g, t + 1.0 + i * 0.07, 0.003, 0.05, 0.25); tone('sine', f, t + 1.0 + i * 0.07, 0.3, g); });
  }
  function stopAll() { live.forEach(s => { try { s.stop(); } catch (e) { /* already stopped */ } }); live.clear(); }
  function setMuted(m) {
    muted = !!m;
    if (master) master.gain.setTargetAtTime(muted ? 0 : 0.8, ctx.currentTime, 0.05);
  }
  return { unlock, rumble, buzz, alarm, click, pop, thud, whoosh, ding, blip, sting, jingle, stopAll, setMuted, get muted() { return muted; } };
})();

/* ======================================================================
   ENGINE
   ====================================================================== */

const W = 1600, H = 900;
const $ = s => document.querySelector(s);
const stage = $('#stage'), world = $('#world'), bgImg = $('#bg'), video = $('#quake');
const itemsEl = $('#items'), lightCv = $('#light'), fxCv = $('#fx'), monNum = $('#monNum');
const flickEl = $('#flicker'), spotsEl = $('#spots'), torchEl = $('#torch');
const ostEl = $('#ost'), dlg = $('#dialogue'), chip = $('#chip'), checklistEl = $('#checklist');
const LIGHT_RES = .5;
lightCv.width = 1600 * LIGHT_RES; lightCv.height = 900 * LIGHT_RES;
const lctx = lightCv.getContext('2d'), fctx = fxCv.getContext('2d');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let gentle = reduced;                          // gentle quake: no shake, no flashes (on by default with reduced motion)
const BG = { calm: 'assets/room-calm.webp', mess: 'assets/room-mess.webp', repair: 'assets/level2/bg.webp', table: 'assets/level2/table.webp', tableBroken: 'assets/level2/table-broken.webp' };

let scale = 1, runId = 0, index = 0, busy = false, waiter = null, voice = null;
const timers = new Set(), anims = new Set();
const shake = { amp: 0, target: 0 };
const quake = { on: false, t0: 0, rumble: null, videoOk: true };
const torch = { holder: null, on: false, x: 0, y: 0, ang: Math.PI / 2, fly: null };
const state = { aim: { x: 800, y: 600 }, spots: [] };

// ---------- timing helpers (cancelled timers/animations simply never resolve) ----------
function later(fn, ms) { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; }
function sleep(ms) { return new Promise(r => later(r, ms)); }
function anim(el, kf, opts) {
  const a = el.animate(kf, opts);
  anims.add(a);
  a.finished.then(() => anims.delete(a), () => anims.delete(a));
  return a;
}
function waitBeat(ms) {                     // a wait the player can cut short with Next / tap
  return new Promise(r => {
    const w = { advance: done };
    const t = later(done, ms);
    function done() { clearTimeout(t); timers.delete(t); if (waiter === w) waiter = null; r(); }
    waiter = w;
  });
}
function waitAdvance() {
  return new Promise(r => { waiter = { advance() { waiter = null; r(); } }; });
}

// ---------- layout ----------
const viewportEl = $('#viewport'), backdrop = $('#backdrop');
let view = { w: innerWidth, h: innerHeight, rot: false };
function fit() {
  const vw = (window.visualViewport && visualViewport.width) || innerWidth;
  const vh = (window.visualViewport && visualViewport.height) || innerHeight;
  // phones and tablets held upright: turn the game sideways so it fills the screen
  const rot = vh > vw * 1.15 && (matchMedia('(pointer: coarse)').matches || vw < 700);
  view = { w: rot ? vh : vw, h: rot ? vw : vh, rot };
  viewportEl.classList.toggle('rot', rot);
  viewportEl.style.width = view.w + 'px';
  viewportEl.style.height = view.h + 'px';
  scale = Math.min(view.w / W, view.h / H);
  stage.style.setProperty('--s', scale);
  stage.classList.toggle('compact', scale < .7);   // small screens: bigger words and targets
  if (window.Level1 && Level1.get().active) Level1.resize();
}
window.TQView = () => view;
window.TQSound = Sound;

// ---------- characters ----------
function buildChars() {
  for (const who in CH) {
    const c = CH[who];
    c.el = $('#' + who);
    c.s = c.h / c.imgH; c.w = c.imgW * c.s;
    c.img = c.el.querySelector('img');
    Object.assign(c.el.style, { width: c.w + 'px', height: c.h + 'px', top: (CONFIG.feetY - c.h) + 'px' });
    const [sheet, cell] = ART[who].walk;
    c.el.insertAdjacentHTML('beforeend', '<div class="walker"></div>');
    c.walker = c.el.querySelector('.walker');
    Object.assign(c.walker.style, { backgroundImage: `url(${sheet})`, width: cell * c.s + 'px' });
    c.walker.style.setProperty('--sheet', cell * 8 * c.s + 'px');
    c.walker.style.setProperty('--walkdur', ART[who].walk[3] + 's');
    for (const k in ART[who].poses) { const src = ART[who].poses[k][0]; new Image().src = src; if (/-c\.webp$/.test(src)) MOUTHS.forEach(f => { new Image().src = mouthSrc(src, f); }); }   // preload every mouth frame
  }
}
function setX(who, x) { const c = CH[who]; c.x = x; c.el.style.left = (x - c.w / 2) + 'px'; }
function setPose(who, name) {
  const c = CH[who];
  const art = ART[who].poses[name];
  if (!art) { console.warn('[story] unknown pose', who, name); return; }
  c.pose = name;
  if (!c.img.src.endsWith(art[0])) c.img.src = art[0];
  c.imgW = art[1]; c.lens = art[2] || null;
  c.lensDir = art[3] !== undefined ? art[3] * Math.PI / 180 : null;   // the way the torch points in the art
  c.w = c.imgW * c.s; c.el.style.width = c.w + 'px';
  if (c.x !== undefined) c.el.style.left = (c.x - c.w / 2) + 'px';
  c.el.classList.remove(...POSES.map(p => 'pose-' + p));
  void c.el.offsetWidth;                    // restart one-shot animations (hop, nod…)
  c.el.classList.add('pose-' + name);
}
function walk(who, x, ms = 1000, style = 'slide') {
  const c = CH[who];
  const goingLeft = x < c.x;
  c.walkLeft = goingLeft;
  c.el.classList.toggle('flip', (goingLeft ? 'left' : 'right') !== ART[who].walk[2]);
  c.el.style.setProperty('--walk', ms + 'ms');
  const cls = style === 'walk' ? 'walking' : 'sliding';
  c.el.classList.add(cls);
  setX(who, x);
  return sleep(ms).then(() => { c.el.classList.remove(cls); c.el.style.setProperty('--walk', '0ms'); });
}
// Talking art: a pose 'x-c.png' has aligned frames x-c (closed), x-h (half), x-o (open "ah"), x-u (round "oo").
const MOUTHS = ['c', 'h', 'o', 'u'];
const mouthSrc = (src, f) => src.replace(/-c\.webp$/, `-${f}.webp`);
const mouthOpen = src => mouthSrc(src, 'o');
function mouth(who, f) {
  const c = CH[who]; if (!c || !c.img) return;
  const art = ART[who].poses[c.pose]; if (!art || !/-c\.webp$/.test(art[0])) return;
  if (f === true) f = 'o'; if (!f) f = 'c';
  const want = mouthSrc(art[0], f);
  if (!c.img.src.endsWith(want)) c.img.src = want;
}
function setTalking(who, on) {
  if (!on) mouth(who, false);
  if (CH[who]) CH[who].el.classList.toggle('talking', on);
}
// Live hand position (follows walking, which is a CSS transition on `left`).
function handPoint(who) {
  const c = CH[who];
  if (c.el.classList.contains('walking')) {           // front hand of the walk sprite
    const cw = ART[who].walk[1] * c.s, cx = c.el.offsetLeft + c.w / 2;
    return { x: cx + (c.walkLeft ? -0.32 : 0.32) * cw, y: c.el.offsetTop + c.h * 0.5 };
  }
  if (c.lens) return { x: c.el.offsetLeft + c.lens[0] * c.s, y: c.el.offsetTop + c.lens[1] * c.s };
  return { x: c.el.offsetLeft + c.hand[0] * c.s, y: c.el.offsetTop + c.hand[1] * c.s };
}

// ---------- torch ----------
function setTorch(holder, on) {
  torch.holder = holder; torch.on = !!on; torch.fly = null;
  torchEl.hidden = !holder;
}
function aimTorch(x, y) { state.aim = { x, y }; }
function updateTorch(now) {
  if (!torch.holder) return;
  if (torch.fly) {
    const f = torch.fly, k = Math.min(1, (now - f.t0) / f.dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const to = handPoint(f.to);                       // a calm, straight hand-over (no toss, no spin)
    torch.x = f.from.x + (to.x - f.from.x) * e;
    torch.y = f.from.y + (to.y - f.from.y) * e;
    const c1 = CH[f.to], a1 = c1.lensDir !== null ? c1.lensDir : Math.atan2(state.aim.y - to.y, state.aim.x - to.x);
    let da = a1 - f.a0;
    while (da > Math.PI) da -= Math.PI * 2;
    while (da < -Math.PI) da += Math.PI * 2;
    torch.ang = f.a0 + da * e;
  } else {
    const p = handPoint(torch.holder), h = CH[torch.holder];
    // the beam leaves the lens along the torch drawn in the art; free torches aim at the target
    const want = h && h.lens && h.lensDir !== null ? h.lensDir : Math.atan2(state.aim.y - p.y, state.aim.x - p.x);
    let d = want - torch.ang;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    torch.ang += d * 0.12;                   // smooth sweep towards the target
    torch.x = p.x; torch.y = p.y;
  }
  const cx = torch.x + Math.cos(torch.ang) * 18, cy = torch.y + Math.sin(torch.ang) * 18;
  torchEl.style.transform = `translate(${cx}px, ${cy}px) rotate(${torch.ang * 180 / Math.PI - TORCH_ART_ANGLE}deg)`;
  const inArt = !torch.fly && CH[torch.holder] && CH[torch.holder].lens && !CH[torch.holder].el.classList.contains('walking');
  torch.inArt = !!inArt;
  torchEl.style.visibility = inArt ? 'hidden' : 'visible';
}
async function torchPass() {
  setPose('ril', 'offer');
  setPose('nova', 'startled');
  await sleep(500);
  const from = handPoint('ril');
  setTorch('ril', true);
  torch.fly = { from, to: 'nova', t0: performance.now(), dur: 1100, a0: torch.ang };
  await sleep(1120);
  setTorch('nova', true);
  torch.ang = Math.atan2(state.aim.y - handPoint('nova').y, state.aim.x - handPoint('nova').x);
  Sound.click();
  aimTorch(800, 560);
  setPose('nova', 'torch');
  setPose('ril', 'idle');
  walk('ril', 1340, 800);
  await sleep(400);
}

// ---------- scene pieces ----------
function setBg(kind) {
  stage.dataset.bg = kind;
  const bd = BG[kind] || BG.mess;
  if (!backdrop.src.endsWith(bd)) backdrop.src = bd;
  if (BG[kind] && !bgImg.src.endsWith(BG[kind])) bgImg.src = BG[kind];
  if (kind !== 'video') { video.pause(); }
}
function buildPieces() {
  itemsEl.innerHTML = PIECES.map((p, i) => `<div class="piece p${i}" style="transform:translate(${p[0]}px, ${p[1]}px) rotate(${p[2]}deg)"><span>2,000</span></div>`).join('');
}
function setScreen(s) {
  stage.dataset.screen = s;
  monNum.textContent = CONFIG.screen[s] || '';
}
async function screenFix(ms = 1600) {
  const target = CONFIG.screen.fixed, t0 = performance.now();
  Sound.alarm(1);
  await sleep(500);
  stage.dataset.screen = 'fixed';            // the red monitor fades into the green one
  stage.classList.add('screen-fixing');
  await sleep(ms * 0.8);
  setScreen('fixed');
  stage.classList.remove('screen-fixing');
  Sound.ding(3);
  await sleep(ms * 0.2);
}

// ---------- highlights, counting hand & checklist ----------
function showSpot(name, n, soft) {
  const s = SPOTS[name];
  const el = document.createElement('div');
  el.className = 'spot' + (soft ? ' soft' : '');
  Object.assign(el.style, { left: (s.cx - s.rx) + 'px', top: (s.cy - s.ry) + 'px', width: s.rx * 2 + 'px', height: s.ry * 2 + 'px' });
  if (n) el.innerHTML = `<span class="badge">${n}</span>`;
  spotsEl.appendChild(el);
  const rec = { s, el };
  state.spots.push(rec);
  return rec;
}
function removeSpot(rec) {
  rec.el.classList.add('out');
  state.spots = state.spots.filter(x => x !== rec);
  later(() => rec.el.remove(), 400);
}
function clearSpots() { state.spots.slice().forEach(removeSpot); }
function glow(target, ms = 1800) { const rec = showSpot(target, 0, true); later(() => removeSpot(rec), ms); }

function buildChecklist() {
  checklistEl.innerHTML = CHECKLIST.map(c => `<li data-n="${c.n}"><span class="ck-num">${c.n}</span><span>${c.text}</span></li>`).join('');
}
function setChecklist(shown) {
  checklistEl.querySelectorAll('li').forEach((li, i) => {
    li.querySelector('.ck-num').textContent = i + 1;
    li.classList.toggle('show', i < shown);
    li.classList.remove('done', 'active');
  });
}
function checklistItem(n, active) {
  checklistEl.querySelectorAll('li').forEach((li, i) => {
    if (i < n) li.classList.add('show');
    li.classList.toggle('active', active && i === n - 1);
  });
}
async function checklistDone() {
  const lis = [...checklistEl.querySelectorAll('li')];
  for (let i = 0; i < lis.length; i++) {
    lis[i].classList.add('show', 'done'); lis[i].classList.remove('active');
    lis[i].querySelector('.ck-num').textContent = '';
    Sound.ding(i + 1);
    await sleep(320);
  }
}
function task(n) {
  clearSpots();
  setPose('ril', n ? 'count' + n : 'thumbs');
  setPose('nova', 'torch');
  if (!n) {
    aimTorch(720, 640);
    checklistItem(3, false);
    return;
  }
  const name = TASKS[n], s = SPOTS[name];
  showSpot(name, n);
  Sound.ding(n);
  aimTorch(s.cx, s.cy);
  checklistItem(n, true);
}

// ---------- effects ----------
function flickerOnce(ms) {
  Sound.buzz(ms);
  if (gentle) { anim(flickEl, [{ opacity: 0 }, { opacity: .3 }, { opacity: 0 }], { duration: Math.max(ms, 1200), easing: 'ease-in-out' }); return; }
  // safe flashing: every light change lasts at least 170 ms, so there are never more than 3 flashes a second
  const kf = [], step = Math.min(1, 170 / ms);
  let dark = false;
  for (let t = 0; t < 1 - step; t += step * (1 + Math.random() * 0.6)) { dark = !dark; kf.push({ opacity: dark ? 0.25 + Math.random() * 0.45 : 0, offset: t, easing: 'steps(1, end)' }); }
  kf.push({ opacity: 0, offset: 1 });
  anim(flickEl, kf, { duration: ms });
}
function flicker(ms = 1000) { flickerOnce(ms); return sleep(ms); }
function lowRumble() {
  const r = Sound.rumble(gentle ? 0.3 : 0.5, 1.4);
  shake.target = gentle ? 0 : 5;
  later(() => { shake.target = 0; r.stop(0.4); }, 1000);
  return sleep(1100);
}
function quakeStart() {
  quake.on = true; quake.t0 = performance.now(); quake.videoOk = true;
  if (gentle) {                               // gentle quake: no shaking video, no flashes, a soft rumble and the still picture
    quake.videoOk = false;
    quake.rumble = Sound.rumble(0.3, 30);
    anim(world, [{ opacity: 1 }, { opacity: .55 }, { opacity: 1 }], { duration: 1600, easing: 'ease-in-out' });
    later(() => setBg('mess'), 800);
    return;
  }
  shake.target = 9;
  quake.rumble = Sound.rumble(0.45, 30);      // the video brings its own quake soundtrack too
  const loop = () => { if (!quake.on) return; flickerOnce(340 + Math.random() * 200); later(loop, 900 + Math.random() * 900); };
  later(loop, 2200);
  video.muted = Sound.muted;
  video.volume = 0.9;
  try { video.currentTime = 0; } catch (e) { /* not loaded yet */ }
  const fail = () => { quake.videoOk = false; setBg('mess'); shake.target = 16; };
  video.play().catch(() => { video.muted = true; video.play().catch(fail); });
}
function videoDone() {
  return !quake.videoOk || video.ended || (video.duration && video.currentTime >= video.duration - 0.25);
}
async function quakeStop() {
  const t0 = performance.now();
  while (performance.now() - quake.t0 < 2800 || (!videoDone() && performance.now() - t0 < 9000)) await sleep(100);
  quake.on = false;
  Sound.thud();
  shake.amp = 0; shake.target = 0;   // the room is still once the video ends
  if (quake.rumble) quake.rumble.stop(0.9);
  flickEl.getAnimations().forEach(a => a.cancel());
  await sleep(500);
}
function alarm(times = 2) {
  Sound.alarm(times);
  return sleep(times * 460);
}
function celebrate(a = {}) {
  for (const w in CH) setPose(w, 'cheer');
  Sound.pop(); later(() => Sound.pop(), 180); later(() => Sound.pop(), 380);
  if (a.jingle !== false) Sound.jingle();
  const n = gentle ? 40 : 110;
  burst(160, 820, n, -62, 30, 17);
  burst(1440, 820, n, -118, 30, 17);
  later(() => burst(800, -20, gentle ? 30 : 90, 90, 80, 4), 250);
  later(() => { setPose('nova', 'happy'); setPose('ril', 'thumbs'); }, 1900);
}

// ---------- confetti ----------
const confetti = [];
const COLORS = ['#ff4757', '#ffd23f', '#2ed573', '#1e90ff', '#ff6bcb', '#ff9f1c', '#a29bfe'];
function burst(x, y, n, dirDeg, spreadDeg, speed) {
  for (let i = 0; i < n; i++) {
    const a = (dirDeg + (Math.random() - 0.5) * spreadDeg * 2) * Math.PI / 180;
    const v = speed * (0.55 + Math.random() * 0.6);
    confetti.push({
      x: x + (dirDeg === 90 ? (Math.random() - 0.5) * 1500 : 0), y,
      vx: Math.cos(a) * v, vy: Math.sin(a) * v,
      r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3,
      w: 10 + Math.random() * 10, h: 6 + Math.random() * 7,
      c: COLORS[Math.floor(Math.random() * COLORS.length)], round: Math.random() < 0.25, wob: Math.random() * 6.28,
    });
  }
}
let fxDirty = false;
function drawConfetti(dt) {
  if (!confetti.length) { if (fxDirty) { fctx.clearRect(0, 0, W, H); fxDirty = false; } return; }
  fxDirty = true;
  fctx.clearRect(0, 0, W, H);
  for (let i = confetti.length - 1; i >= 0; i--) {
    const p = confetti[i];
    p.vy += 0.32 * dt; p.vx *= Math.pow(0.985, dt); p.vy *= Math.pow(0.985, dt);
    p.wob += 0.15 * dt; p.x += (p.vx + Math.sin(p.wob) * 0.8) * dt; p.y += p.vy * dt; p.r += p.vr * dt;
    if (p.y > H + 40) { confetti.splice(i, 1); continue; }
    fctx.save(); fctx.translate(p.x, p.y); fctx.rotate(p.r); fctx.fillStyle = p.c;
    if (p.round) { fctx.beginPath(); fctx.arc(0, 0, p.h / 1.4, 0, 6.28); fctx.fill(); }
    else { fctx.scale(1, Math.abs(Math.cos(p.wob))); fctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
    fctx.restore();
  }
}

// ---------- darkness + torch light ----------
function hole(g, cx, cy, rx, ry, strength, inner = 0) {
  g.save();
  g.translate(cx, cy); g.scale(1, ry / rx);
  const gr = g.createRadialGradient(0, 0, rx * inner, 0, 0, rx);
  gr.addColorStop(0, `rgba(0,0,0,${strength})`);
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr;
  g.beginPath(); g.arc(0, 0, rx, 0, Math.PI * 2); g.fill();
  g.restore();
}
function cone(g, tip, ang, len, half, fill) {
  g.beginPath(); g.moveTo(tip.x, tip.y); g.arc(tip.x, tip.y, len, ang - half, ang + half); g.closePath();
  g.fillStyle = fill; g.fill();
}
function drawDark(t) {
  const g = lctx;
  g.setTransform(LIGHT_RES, 0, 0, LIGHT_RES, 0, 0);   // soft light only: drawn at half size, so it stays smooth on slow devices
  g.globalCompositeOperation = 'source-over';
  g.clearRect(0, 0, W, H);
  g.fillStyle = 'rgba(3,7,22,0.84)';
  g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'destination-out';
  const pulse = 0.5 + 0.5 * Math.sin(t / 1000 * Math.PI * 2 / 1.2);
  hole(g, 800, 382, 340, 200, 0.92, 0.55);                     // the red monitor glows
  for (const w in CH) {                                         // glowing antennae keep the characters readable
    const c = CH[w], cx = c.el.offsetLeft + c.w / 2;
    if (cx < -200 || cx > W + 200) continue;
    hole(g, cx, CONFIG.feetY - c.h * 0.55, c.w * 0.85, c.h * 0.62, 0.45);
  }
  for (const sp of state.spots) hole(g, sp.s.cx, sp.s.cy, sp.s.rx * 1.2, sp.s.ry * 1.35, 0.95, 0.6);
  let tip = null;
  if (torch.on && torch.holder) {
    const off = torch.inArt ? 0 : 76;
    tip = { x: torch.x + Math.cos(torch.ang) * off, y: torch.y + Math.sin(torch.ang) * off };
    const d = Math.hypot(state.aim.x - tip.x, state.aim.y - tip.y);
    const len = Math.max(320, Math.min(900, d + 150));
    const gr = g.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, len);
    gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.75, 'rgba(0,0,0,.85)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    cone(g, tip, torch.ang, len, 0.46, 'rgba(0,0,0,.45)');
    cone(g, tip, torch.ang, len, 0.32, gr);
    const reach = torch.inArt ? Math.min(560, len - 60) : Math.min(d, len - 60);
    hole(g, tip.x + Math.cos(torch.ang) * reach, tip.y + Math.sin(torch.ang) * reach, 180, 100, 0.95, 0.35);
    hole(g, tip.x, tip.y, 50, 50, 1, 0.3);
  }
  g.globalCompositeOperation = 'lighter';
  if (stage.dataset.screen === 'wrong') {
    const rg = g.createRadialGradient(800, 382, 60, 800, 382, 560);
    rg.addColorStop(0, `rgba(255,40,60,${0.10 + 0.18 * pulse})`); rg.addColorStop(1, 'rgba(255,40,60,0)');
    g.fillStyle = rg; g.fillRect(0, 0, W, H);
  }
  if (tip) {
    const wg = g.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 720);
    wg.addColorStop(0, 'rgba(255,230,150,.35)'); wg.addColorStop(1, 'rgba(255,230,150,0)');
    cone(g, tip, torch.ang, 720, 0.32, wg);
  }
  g.globalCompositeOperation = 'source-over';
}

// ---------- main frame loop ----------
let lastT = 0;
function frame(t) {
  requestAnimationFrame(frame);
  const dt = Math.min(50, t - (lastT || t)) / 16.67 || 1;
  lastT = t;
  shake.amp += (shake.target - shake.amp) * 0.12;
  if (shake.amp > 0.05) {
    const k = t / 1000, a = shake.amp * (gentle ? 0 : 1);
    world.style.transform = `translate(${(Math.sin(k * 37.1) + Math.sin(k * 23.7 + 1.3)) * a * 0.5}px, ${(Math.sin(k * 41.3 + 2) + Math.sin(k * 29.9)) * a * 0.5}px) rotate(${Math.sin(k * 17.3) * a * 0.05}deg)`;
  } else if (world.style.transform) {
    world.style.transform = '';
  }
  if (window.Level1 && Level1.get().active) { Level1.frame(t); return; }
  updateTorch(t);
  placeBubble();
  if (stage.dataset.light === 'dark') drawDark(t);
  drawConfetti(dt);
}

// ---------- OST title cards ----------
async function showOST(text, style = '', hold = 1600) {
  const sc = scenes[index];
  ostEl.className = style;
  const letters = [...text].map((ch, i) => `<span style="--i:${i}">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');
  ostEl.innerHTML = `<div class="banner"><span class="kicker">${sc.label || 'SCENE 0' + sc.number}</span><span class="big">${letters}</span></div>`;
  $('#sr').textContent = text;
  Sound.sting(style);
  await waitBeat(hold + text.length * 45);
  ostEl.classList.add('out');
  await sleep(380);
  ostEl.className = ''; ostEl.innerHTML = '';
}
function esc(s) { return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

// ---------- dialogue ----------
function parseLine(raw) {
  let text = '';
  const dirs = [];
  for (const part of raw.split(/(\([^)]*\))/)) {
    if (/^\(.*\)$/.test(part)) { dirs.push({ at: text.length, key: part.slice(1, -1).trim() }); continue; }
    const s = part.replace(/\s+/g, ' ').trim();
    if (s) text += (text ? ' ' : '') + s;
  }
  return { text, dirs };
}
function directionActions(key) {
  const k = key.toLowerCase().replace(/[.!]+$/, '').trim();
  const list = DIRECTIONS[k];
  if (!list) console.info('[story] stage direction has no action mapped:', key);
  return list || [];
}
function runDirection(key) { return Promise.all(directionActions(key).map(a => doAction(a))); }

function showSpeaker(who) {
  dlg.dataset.speaker = who;
  dlg.querySelector('.speaker').textContent = CAST[who] ? CAST[who].name : who;
  dlg.classList.remove('hidden');
  placeBubble();
}
// The speech bubble sits just above the speaker's head (and follows them if they move).
function placeBubble() {
  if (dlg.classList.contains('hidden')) return;
  const c = CH[dlg.dataset.speaker];
  const bw = dlg.offsetWidth, bh = dlg.offsetHeight;
  let cx, headTop, off = false;
  if (c) {
    cx = c.el.offsetLeft + c.w / 2;
    // the top of the head: first opaque row of the current pose (measured once per image)
    headTop = c.el.offsetTop + (parseFloat(getComputedStyle(c.el).translate.split(' ')[1]) || 0) + headOffset(c);
    off = cx < 40 || cx > W - 40 || c.el.classList.contains('is-hidden');
  }
  if (!c || off) { dlg.classList.add('free'); dlg.style.left = (W - bw) / 2 + 'px'; dlg.style.top = '60px'; return; }
  dlg.classList.remove('free');
  const left = Math.max(16, Math.min(W - bw - 16, cx - bw / 2));
  dlg.style.left = left + 'px';
  dlg.style.top = Math.max(12, headTop - bh - 26) + 'px';
  dlg.style.setProperty('--tail', Math.max(34, Math.min(bw - 34, cx - left)) + 'px');
}
const headCache = {};
function headOffset(c) {
  const src = c.img.currentSrc || c.img.src;
  if (headCache[src] !== undefined) return headCache[src] * c.s;
  headCache[src] = 0;
  try {
    const cv = document.createElement('canvas'); cv.width = c.img.naturalWidth; cv.height = c.img.naturalHeight;
    const g = cv.getContext('2d'); g.drawImage(c.img, 0, 0);
    const d = g.getImageData(0, 0, cv.width, Math.min(cv.height, 260)).data;
    for (let y = 0; y < Math.min(cv.height, 260); y++) {
      let n = 0; for (let x = 0; x < cv.width; x++) if (d[(y * cv.width + x) * 4 + 3] > 140) n++;
      if (n > 6) { headCache[src] = y; break; }
    }
  } catch (e) { /* image not ready */ delete headCache[src]; }
  return (headCache[src] || 0) * c.s;
}
function hideDialogue() { dlg.classList.add('hidden'); stage.classList.remove('await-next'); }

function playVoice(src) {
  stopVoice();
  if (!src) return;
  voice = new Audio(src);
  voice.muted = Sound.muted;
  voice.play().catch(() => {});
}
function stopVoice() { if (voice) { voice.pause(); voice = null; } for (const w in CH) mouth(w, 'c'); }

// Gemini voice-overs: assets/vo/s<N>.mp3 + s<N>.json (loudness envelope, 30 fps) for the N-th spoken line.
async function loadVoiceOvers() {
  let n = 0;
  const jobs = [];
  for (const sc of scenes) for (const b of sc.beats) if (b.say) {
    const id = 's' + (n++);
    b.audioSrc = `assets/vo/${id}.mp3`;
    const embedded = window.TQ_STORY_VO && window.TQ_STORY_VO[id];
    if (embedded) { b.vo = embedded; continue; }
    jobs.push(fetch(`assets/vo/${id}.json`).then(r => r.ok ? r.json() : null).then(d => { b.vo = d; }).catch(() => {}));
    new Audio().src = b.audioSrc;   // warm the cache
  }
  await Promise.all(jobs);
}
// mouth shape for an audio loudness level, with a little hold so it never flickers
function mouthFor(level, t, st) {
  let f = level < .13 ? 'c' : level < .40 ? 'h' : (Math.floor(t * 6.5) % 4 === 3 ? 'u' : 'o');
  if (f !== st.f && t - st.t < .06) return st.f;
  if (f !== st.f) { st.f = f; st.t = t; }
  return f;
}
async function speakLine(b, id, text, events, who, render) {
  const vo = b.vo;
  const a = new Audio(b.audioSrc);
  a.muted = Sound.muted;
  voice = a;
  try { await a.play(); } catch (e) { voice = null; return false; }
  const dur = vo.dur || a.duration || 2;
  let finish = false, finishNow, i = 0, ei = 0;
  const finished = new Promise(r => { finishNow = r; });
  waiter = { advance() { finish = true; finishNow(); } };
  const st = { f: 'c', t: 0 };
  setTalking(who, true);
  // the words appear in step with the voice; mouth follows the voice loudness
  while (id === runId) {
    const t = a.ended ? dur : a.currentTime;
    const target = finish ? text.length : Math.min(text.length, Math.floor(text.length * Math.min(1, t / (dur * .96))));
    while (i < target) {
      i++;
      while (ei < events.length && events[ei].at <= i) {
        const ev = events[ei++];
        if (ev.cue) { doAction(ev.cue); continue; }
        // stage directions (e.g. the rumble) pause the voice, then it carries on
        a.pause(); mouth(who, 'c');
        const p = runDirection(ev.dir);
        if (!finish) await Promise.race([p, finished]);
        if (id !== runId) return true;
        if (!a.ended) a.play().catch(() => {});
      }
    }
    render(i);
    const lv = vo.env[Math.floor(t * (vo.fps || 30))] || 0;
    mouth(who, a.ended || a.paused ? 'c' : mouthFor(lv, t, st));
    if (i >= text.length && (a.ended || a.paused || t >= dur)) break;
    if (i >= text.length && finish) {   // tapped: words are complete, let the voice finish talking
      if (a.ended) break;
    }
    await new Promise(r => requestAnimationFrame(r));
  }
  if (id !== runId) return true;
  while (ei < events.length) { const ev = events[ei++]; if (ev.cue) doAction(ev.cue); }
  render(text.length);
  mouth(who, 'c');
  setTalking(who, false);
  stage.classList.add('await-next');
  await waitAdvance();                                     // NEXT (or a tap) closes the bubble
  stage.classList.remove('await-next');
  if (id !== runId) return true;
  hideDialogue();
  stopVoice();
  await sleep(260);
  return true;
}
async function playLine(b, id) {
  const { text, dirs } = parseLine(b.text);
  const events = dirs.map(d => ({ at: d.at, dir: d.key }));
  for (const c of b.cues || []) {
    const at = text.indexOf(c.when);
    if (at < 0) { console.warn('[story] cue phrase not found:', c.when); continue; }
    events.push({ at, cue: c });
  }
  events.sort((x, y) => x.at - y.at);

  const who = b.say;
  showSpeaker(who);
  const shown = dlg.querySelector('.shown'), rest = dlg.querySelector('.rest');
  const render = i => { shown.textContent = text.slice(0, i); rest.textContent = text.slice(i); };
  render(0);
  $('#sr').textContent = `${CAST[who] ? CAST[who].name : who}: ${text}`;
  stopVoice();
  if (b.vo && b.vo.env && await speakLine(b, id, text, events, who, render)) return;

  let finish = false, finishNow;
  const finished = new Promise(r => { finishNow = r; });
  waiter = { advance() { finish = true; finishNow(); } };
  const speed = b.speed || CONFIG.typeMs;
  let i = 0, ei = 0;

  const fireUpTo = async (n, blocking) => {
    while (ei < events.length && events[ei].at <= n) {
      const ev = events[ei++];
      if (ev.cue) { doAction(ev.cue); continue; }
      const p = runDirection(ev.dir);
      if (blocking && !finish) { setTalking(who, false); await Promise.race([p, finished]); if (id !== runId) return; setTalking(who, true); }
    }
  };

  setTalking(who, true);
  while (true) {
    await fireUpTo(i, true);
    if (id !== runId) return;
    if (finish || i >= text.length) break;
    i++;
    render(i);
    const ch = text[i - 1];
    mouth(who, /[aeiouy]/i.test(ch) ? 'o' : /[a-z]/i.test(ch) && Math.random() < .4 ? 'h' : 'c');
    if (ch !== ' ' && i % 2) Sound.blip(who);
    await sleep('.!?…'.includes(ch) ? speed * 9 : ',;—'.includes(ch) ? speed * 5 : speed);
    if (id !== runId) return;
  }
  render(text.length);
  mouth(who, false);
  await fireUpTo(Infinity, false);
  setTalking(who, false);
  stage.classList.add('await-next');
  await waitAdvance();                                     // NEXT (or a tap) closes the bubble
  stage.classList.remove('await-next');
  if (id !== runId) return;
  hideDialogue();
  stopVoice();
  await sleep(260);
}

// ---------- actions ----------
const ACTIONS = {
  ost: a => showOST(a.text, a.style, a.hold),
  pose: a => setPose(a.who, a.pose),
  show: a => { if (a.pose) setPose(a.who, a.pose); CH[a.who].el.classList.remove('is-hidden'); return sleep(450); },
  walk: a => walk(a.who, a.x, a.ms, a.style),
  aim: a => aimTorch(a.x, a.y),
  glow: a => glow(a.target, a.ms),
  flicker: a => flicker(a.ms),
  lowRumble: () => lowRumble(),
  quakeStart: () => quakeStart(),
  quakeStop: () => quakeStop(),
  alarm: a => alarm(a.times),
  torchOn: a => { setTorch(a.who, true); Sound.click(); return sleep(250); },
  torchPass: () => torchPass(),
  task: a => task(a.n),
  screenFix: a => screenFix(a.ms),
  checklistDone: () => checklistDone(),
  celebrate: a => celebrate(a),
  sfx: a => Sound[a.name] && Sound[a.name](),
  zoomScreen: async () => {      // camera pushes in on the red wall monitor
    world.style.transformOrigin = '800px 382px';
    const z = anim(world, [{ transform: 'translate(0px, 0px) scale(1)' }, { transform: 'translate(0px, 68px) scale(2.35)' }],
      { duration: 1500, easing: 'cubic-bezier(.6, 0, .25, 1)', fill: 'forwards' });
    await z.finished.catch(() => {});
    await sleep(150);
  },
  room: async a => {            // room change: fade out, swap the background, park the characters off-screen, fade in
    await transition('fade', 'in');
    setBg(a.bg);
    for (const w of ['nova', 'ril']) if (a[w] !== undefined) { CH[w].el.style.setProperty('--walk', '0ms'); setX(w, a[w]); }
    void stage.offsetWidth;
    await transition('fade', 'out');
  },
};
function doAction(a) {
  const fn = ACTIONS[a.do];
  if (!fn) { console.warn('[story] unknown action', a.do); return Promise.resolve(); }
  return Promise.resolve(fn(a));
}

async function runBeats(sc, id) {
  for (const b of sc.beats) {
    if (id !== runId) return;
    if (b.say) await playLine(b, id);
    else if (b.do) { const p = doAction(b); if (!b.async) await p; }
    else if (b.wait) await waitBeat(b.wait);
    else if (b.text) { hideDialogue(); await Promise.all(parseLine(b.text).dirs.map(d => runDirection(d.key))); }
  }
}

// ---------- scene state ----------
function applySetup(s) {
  stage.classList.add('instant');
  world.getAnimations().forEach(a => a.cancel());      // a finished camera zoom (fill: forwards) must not carry into the next scene
  world.style.transformOrigin = '';
  setBg(s.bg);
  if (s.bg === 'video') { video.pause(); try { video.currentTime = 0; } catch (e) { /* not loaded yet */ } }
  stage.dataset.light = s.light;
  stage.dataset.pieces = s.pieces ? 'on' : 'off';
  setScreen(s.screen);
  monNum.classList.remove('rolling', 'pop');
  state.aim = Object.assign({}, s.aim || { x: 800, y: 600 });
  setTorch(s.torch ? s.torch.holder : null, s.torch && s.torch.on);
  for (const who in CH) {
    const c = CH[who];
    c.el.classList.remove('walking', 'talking');
    c.el.style.setProperty('--walk', '0ms');
    setX(who, s[who].x);
    setPose(who, s[who].pose);
    c.el.classList.toggle('is-hidden', !!s[who].hidden);
  }
  if (torch.holder) {
    const p = handPoint(torch.holder);
    torch.ang = Math.atan2(state.aim.y - p.y, state.aim.x - p.x);
  }
  setChecklist(s.checklist || 0);
  spotsEl.innerHTML = ''; state.spots = [];
  void stage.offsetWidth;
  stage.classList.remove('instant');
}

function stopEverything() {
  runId++;
  timers.forEach(clearTimeout); timers.clear();
  anims.forEach(a => { try { a.cancel(); } catch (e) { /* ignore */ } }); anims.clear();
  waiter = null;
  Sound.stopAll(); stopVoice();
  video.pause();
  shake.target = 0; shake.amp = 0; world.style.transform = '';
  quake.on = false;
  hideDialogue();
  ostEl.className = ''; ostEl.innerHTML = '';
  for (const w in CH) CH[w].el.classList.remove('talking', 'walking');
}

function setMode(m) { stage.dataset.mode = m; }
function updateChip(sc) { chip.innerHTML = `<span><b>${sc.label || 'SCENE 0' + sc.number}</b> • ${sc.name.toUpperCase()}</span>`; }

async function transition(kind, phase) {
  const wipe = $('#wipe');
  const kf = phase === 'in' ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }];
  if (kind !== 'fade' && phase === 'in') Sound.whoosh();
  const a = wipe.animate(kf, { duration: kind === 'fade' ? 420 : 520, easing: phase === 'in' ? 'ease-in' : 'ease-out', fill: 'forwards' });
  await a.finished.catch(() => {});
  if (phase === 'out') a.cancel();
}

async function goTo(i) {
  stopEverything();
  const id = runId, sc = scenes[i];
  busy = true;
  setMode('story');
  await transition(sc.transition, 'in');
  if (id !== runId) return;
  index = i;
  const hadFocus = document.activeElement && document.activeElement.closest && document.activeElement.closest('#title, #endcard, #level1, #level2, #level3');
  ['#title', '#endcard'].forEach(s => { $(s).hidden = true; });
  applySetup(sc.setup);
  if (hadFocus || document.activeElement === document.body) $('#btnNext').focus({ preventScroll: true });   // keyboard players land on NEXT
  updateChip(sc);
  await transition(sc.transition, 'out');
  busy = false;
  if (id !== runId) return;
  await runBeats(sc, id);
  if (id !== runId) return;
  finishScene(i);
}

function finishScene(i) {
  const next = scenes[i + 1];
  if (next && next.part === scenes[i].part) goTo(i + 1);
  else partComplete(scenes[i].part);
}

function partComplete(part) {
  hideDialogue();
  clearSpots();
  setMode(part === 'intro' ? 'gameplay' : 'end');
  window.dispatchEvent(new CustomEvent('storypartcomplete', { detail: { part } }));
  const hook = window.onStoryPartComplete;
  let handled = false;
  if (typeof hook === 'function' && hook !== defaultPartComplete) {
    try { handled = hook(part) !== false; } catch (e) { console.error('[story] onStoryPartComplete failed', e); }
  }
  if (!handled) defaultPartComplete(part);
}
function defaultPartComplete(part) {
  if (part === 'intro') startLevel1();
  else if (part === 't1') { setMode('gameplay'); Level2.start({ onExit: () => startStory('t2') }); }
  else if (part === 't2') { setMode('gameplay'); Level3.start({ onExit: () => startStory('outro') }); }
  else { setMode('end'); $('#endcard').hidden = false; $('#btnAgain').focus({ preventScroll: true }); }
}
// developer jump menu
function jumpTo(v) {
  Sound.unlock();
  ['#title', '#endcard'].forEach(sel => { $(sel).hidden = true; });
  const clearWipe = () => $('#wipe').getAnimations().forEach(an => an.cancel());
  if (window.Level1 && Level1.get().active) Level1.stop();
  if (window.Level2 && Level2.get().active) Level2.stop();
  if (window.Level3 && Level3.get().active) Level3.stop();
  stage.classList.remove('behind');
  if (v === 'level1') { stopEverything(); clearWipe(); index = 3; applySetup(scenes[3].setup); startLevel1(); return; }
  if (v === 'level2') {
    stopEverything(); clearWipe(); index = 4; applySetup(scenes[4].setup);
    setBg('repair'); setMode('gameplay');
    Level2.start({ onExit: () => startStory('t2') });
    return;
  }
  if (v === 'level3') {
    stopEverything(); clearWipe(); index = 5; applySetup(scenes[5].setup);
    setBg('mess'); setMode('gameplay');
    Level3.start({ onExit: () => startStory('outro') });
    return;
  }
  startStory(isNaN(v) ? v : Number(v));
}
function startLevel1() {
  setMode('gameplay');
  setBg('mess');
  stage.classList.add('behind');
  Level1.start({ onExit: () => { stage.classList.remove('behind'); startStory('t1'); } });
}
window.TitanSound = { get muted() { return Sound.muted; }, toggle: () => toggleMute() };

function resolveScene(from) {
  if (typeof from === 'number') return Math.max(0, Math.min(scenes.length - 1, from - 1));
  const i = scenes.findIndex(s => s.id === from || s.part === from || String(s.number) === String(from));
  return i < 0 ? 0 : i;
}
function startStory(from = 'intro') {
  Sound.unlock();
  if (window.Level1 && Level1.get().active) Level1.stop();
  if (window.Level2 && Level2.get().active) Level2.stop();
  if (window.Level3 && Level3.get().active) Level3.stop();
  stage.classList.remove('behind');
  busy = false;
  goTo(resolveScene(from));
}

function advance() {
  if (stage.dataset.mode !== 'story') return;
  if (waiter) waiter.advance();
}
function skipScene() {
  if (busy || stage.dataset.mode !== 'story') return;
  stopEverything();
  finishScene(index);
}
function replayScene() {
  if (busy || stage.dataset.mode !== 'story') return;
  goTo(index);
}
function toggleMute() {
  Sound.unlock();
  const m = !Sound.muted;
  Sound.setMuted(m);
  video.muted = m;
  if (voice) voice.muted = m;
  if (m && window.TQVoice) TQVoice.stop();
  ['#btnMute', '#btnSound', '#l1-mute'].forEach(sel => { const b = $(sel); b.setAttribute('aria-pressed', String(m)); b.textContent = m ? 'SOUND OFF' : 'SOUND ON'; });
}
function setGentle(on) {
  gentle = !!on;
  document.documentElement.classList.toggle('gentle', gentle);
  const b = $('#btnGentle');
  b.setAttribute('aria-pressed', String(gentle));
  b.textContent = 'GENTLE QUAKE: ' + (gentle ? 'ON' : 'OFF');
  try { localStorage.setItem('tq-gentle', gentle ? '1' : '0'); } catch (e) { /* storage blocked */ }
}

// ---------- boot ----------
function boot() {
  Object.values(BG).forEach(src => { new Image().src = src; });   // warm the cache for scene changes
  buildPieces();
  buildChars();
  buildChecklist();
  fit();
  addEventListener('resize', fit);
  addEventListener('orientationchange', () => setTimeout(fit, 250));
  if (window.visualViewport) visualViewport.addEventListener('resize', fit);
  applySetup(scenes[0].setup);
  setMode('title');
  requestAnimationFrame(frame);
  video.addEventListener('error', () => { quake.videoOk = false; console.warn('[story] quake video could not load; using the still image'); });

  const q = new URLSearchParams(location.search);
  const dev = q.has('dev');                      // the jump menu, ?scene= and the S (skip) key are for staff testing only
  $('#jump').hidden = !dev;
  const startAt = (dev && q.get('scene')) || 'intro';
  const target = isNaN(startAt) ? startAt : Number(startAt);

  stage.addEventListener('pointerdown', e => {
    Sound.unlock();
    if (e.button !== undefined && e.button !== 0) return;
    if (e.target.closest('button')) return;
    advance();
  });
  $('#btnNext').addEventListener('click', advance);
  $('#btnSkip').addEventListener('click', skipScene);
  $('#btnReplay').addEventListener('click', replayScene);
  $('#btnMute').addEventListener('click', toggleMute);
  $('#btnSound').addEventListener('click', toggleMute);
  $('#btnGentle').addEventListener('click', () => setGentle(!gentle));
  let saved = null;
  try { saved = localStorage.getItem('tq-gentle'); } catch (e) { /* storage blocked */ }
  setGentle(saved === null ? reduced : saved === '1');
  $('#btnStart').addEventListener('click', () => startStory(target));
  $('#l1-mute').addEventListener('click', toggleMute);
  const jump = $('#jumpSel');
  jump.addEventListener('pointerdown', e => e.stopPropagation());
  jump.addEventListener('change', () => { const v = jump.value; jump.value = ''; jump.blur(); if (v) jumpTo(v); });
  $('#btnAgain').addEventListener('click', () => startStory('intro'));
  $('#btnOutro').addEventListener('click', () => startStory('outro'));
  addEventListener('keydown', e => {
    if (e.repeat) return;
    const k = e.key.toLowerCase();
    if (k === ' ' || k === 'enter' || k === 'arrowright') {
      if (e.target.closest && e.target.closest('button')) return;   // let the focused button act
      e.preventDefault(); advance();
    } else if (k === 's' && dev) skipScene();
    else if (k === 'r') replayScene();
    else if (k === 'm') toggleMute();
  });

  loadVoiceOvers().then(() => { if (dev && q.has('autostart')) startStory(target); });
  setTimeout(() => { if (stage.dataset.mode === 'title') $('#btnStart').focus({ preventScroll: true }); }, 50);
}

window.onStoryPartComplete = defaultPartComplete;
window.startStory = startStory;
window.Titanquake = {
  startStory,
  playOutro: () => startStory('outro'),
  continueStory: () => startStory('outro'),
  stop: () => { stopEverything(); setMode('title'); },
  setMuted: m => { if (!!m !== Sound.muted) toggleMute(); },
  scenes, CONFIG, DIRECTIONS,
  get onStoryPartComplete() { return window.onStoryPartComplete; },
  set onStoryPartComplete(fn) { window.onStoryPartComplete = fn; },
  debug: { get index() { return index; }, get mode() { return stage.dataset.mode; }, advance, skipScene },
};

boot();
})();
