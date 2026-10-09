/* Titanquake – voice for the three levels.
 * Every level line has a recorded clip in assets/vo/lines/<key>.mp3 (Narakeet, voice Sheela).
 * <key> is a hash of the exact line shown on screen, so a changed line never plays an old clip.
 * assets/vo/lines.js lists the clips (window.TQ_LINES). A line without a clip is read by the device voice.
 * API: TQVoice.say(text) -> Promise (resolves when the line ends or is stopped), TQVoice.stop(), TQVoice.key(text)
 */
(() => {
'use strict';
function key(s) {                      // FNV-1a over UTF-16 code units (same as tools/vo)
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return 'v' + h.toString(16).padStart(8, '0');
}
const muted = () => !!(window.TitanSound && window.TitanSound.muted);
let cur = null;                        // { text, audio, done }
const seen = new Set();                // every line asked for (QA reads this)

function stop() {
  const c = cur; cur = null;
  if (c) { if (c.audio) { c.audio.pause(); c.audio.src = ''; } c.done(); }
  try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) { /* no voice */ }
}
function deviceVoice(text, done) {
  try {
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return done();
    const u = new SpeechSynthesisUtterance(text.replace(/(\d),(?=\d)/g, '$1'));
    const v = speechSynthesis.getVoices().find(x => /en[-_]IN/i.test(x.lang));
    if (v) u.voice = v;
    u.lang = 'en-IN'; u.rate = .9;
    u.onend = u.onerror = done;
    speechSynthesis.speak(u);
  } catch (e) { done(); }
}
function say(text) {
  if (!text) return Promise.resolve();
  seen.add(text);
  if (cur && cur.text === text) return cur.promise;        // never restart the same line
  stop();
  if (muted()) return Promise.resolve();
  const k = key(text), list = window.TQ_LINES || {};
  let finish;
  const promise = new Promise(r => { finish = r; });
  const c = { text, audio: null, promise, done: () => {} };
  let ended = false;
  const done = () => { if (ended) return; ended = true; clearTimeout(cap); if (cur === c) cur = null; finish(); };
  c.done = done;
  // safety cap in case a voice never reports its end
  const cap = setTimeout(done, ((list[k] || 0) * 1000 || text.split(/\s+/).length * 520) + 2500);
  cur = c;
  if (list[k]) {
    const a = new Audio('assets/vo/lines/' + k + '.mp3');
    c.audio = a;
    a.addEventListener('ended', done, { once: true });
    a.addEventListener('error', () => { if (cur === c) deviceVoice(text, done); }, { once: true });
    a.play().catch(() => { if (cur === c && !ended) deviceVoice(text, done); });
  } else deviceVoice(text, done);
  return promise;
}
window.TQVoice = { say, stop, key, seen, get playing() { return cur ? cur.text : ''; } };
})();
