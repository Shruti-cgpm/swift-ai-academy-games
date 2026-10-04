#!/usr/bin/env python3
"""Voice-overs for one game, the same way as game 1: Narakeet, voice Sheela (English, Indian accent), speed 0.95.

  NARAKEET_API_KEY=... python3 generate.py "<game folder>" [--seen seen.json ...] [--dry] [--only screen|feedback]

Reads <game>/audio/vo/texts.json (written by extract.js), adds any screen texts in --seen files
(collected from a real playthrough), makes audio/vo/<key>.mp3 for every text that has no clip yet,
times each sentence with ffmpeg, and writes audio/vo/vo.js for the player. Clips are named by a hash
of their exact text, so changed text gets a new clip and old clips are never played by mistake."""
import json, os, re, subprocess, sys, time, urllib.request, urllib.error, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from pronounce import spoken

URL = 'https://api.narakeet.com/text-to-speech/mp3?voice=sheela&voice-speed=0.95'


def key(s):
    """FNV-1a over UTF-16 code units - must match key() in common/narrate.js."""
    h = 0x811c9dc5
    b = s.encode('utf-16-le')
    for i in range(0, len(b), 2):
        h ^= b[i] | (b[i + 1] << 8)
        h = (h * 0x01000193) & 0xffffffff
    return 'v%08x' % h


def game_dir(d):
    d = pathlib.Path(d)
    for p in [d] + sorted(d.glob('*/')) + sorted(d.glob('*/*/')):
        if (p / 'index.html').exists() and p.name not in ('rulebook-site', 'section-check-site'):
            return p
    sys.exit('no index.html in %s' % d)


def fetch(req):
    with urllib.request.urlopen(req, timeout=90) as r:
        return r.read(), r.headers.get('Content-Type', '')


def tts(text, api):
    body, ctype = fetch(urllib.request.Request(URL, data=spoken(text).encode(), method='POST',
                                               headers={'x-api-key': api, 'Content-Type': 'text/plain'}))
    if 'json' in ctype or body[:1] == b'{':
        job = json.loads(body)
        while True:
            st = json.loads(fetch(urllib.request.Request(job['statusUrl']))[0])
            if st.get('finished'):
                if not st.get('succeeded'):
                    raise RuntimeError('Narakeet job failed: %s' % st.get('message'))
                return fetch(urllib.request.Request(st['result']))[0]
            time.sleep(1)
    return body


def sentences(text):
    out, n = [], 0
    for tok in text.split():
        n += 1
        if re.search(r'[.?!]["”’)]?$', tok):
            out.append(n); n = 0
    if n:
        out.append(n)
    return len(out)


def segments(path, want):
    """Sentence boundaries = the (want-1) longest pauses inside the clip (same as game 1)."""
    r = subprocess.run(['ffmpeg', '-i', str(path), '-af', 'silencedetect=noise=-38dB:d=0.12', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r)]
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', r)
    total = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])
    gaps = [(s, e) for s, e in zip(starts, ends) if s > 0.15 and e < total - 0.05]
    lead = ends[0] if starts and starts[0] < 0.05 and ends else 0.0
    tail = starts[-1] if len(starts) > len(ends) else total
    top = sorted(sorted(gaps, key=lambda g: g[1] - g[0], reverse=True)[:want - 1])
    segs, cur = [], lead
    for s, e in top:
        segs.append([round(cur, 3), round(s, 3)]); cur = e
    segs.append([round(cur, 3), round(tail, 3)])
    return segs, total


def main():
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    g = game_dir(a[0]); vo = g / 'audio' / 'vo'
    texts = json.loads((vo / 'texts.json').read_text())
    dry = '--dry' in a
    only = a[a.index('--only') + 1] if '--only' in a else None
    for i, x in enumerate(a):
        if x == '--seen':
            for k, t in json.loads(pathlib.Path(a[i + 1]).read_text()).items():
                if k not in texts:
                    texts[k] = {'text': t, 'kind': 'screen', 'screens': [], 'from': 'playthrough'}
    for k, o in texts.items():
        if key(o['text']) != k:
            sys.exit('hash mismatch for %s - narrate.js and generate.py disagree' % k)
    (vo / 'texts.json').write_text(json.dumps(texts, indent=1, ensure_ascii=False) + '\n')
    todo = [(k, o) for k, o in texts.items() if not (vo / (k + '.mp3')).exists() and (not only or o['kind'] == only)]
    words = sum(len(o['text'].split()) for _, o in todo)
    print('%s: %d texts, %d new clips, about %d words (~%.1f min of audio)' % (g.name, len(texts), len(todo), words, words / 150))
    if dry:
        return
    api = os.environ.get('NARAKEET_API_KEY') or sys.exit('Set NARAKEET_API_KEY')
    for k, o in todo:
        for attempt in range(3):
            try:
                (vo / (k + '.mp3')).write_bytes(tts(o['text'], api)); break
            except urllib.error.HTTPError as e:
                msg = e.read()[:300].decode('utf-8', 'replace')
                if e.code in (401, 402, 403, 429) or re.search(r'credit|balance|quota|limit|subscription', msg, re.I):
                    write_manifest(vo, texts)
                    print('OUT OF CREDIT (HTTP %d): %s' % (e.code, msg)); sys.exit(3)
                print('  retry', k, e.code, msg); time.sleep(3 * (attempt + 1))
            except Exception as e:
                print('  retry', k, e); time.sleep(3 * (attempt + 1))
        else:
            print('  FAILED', k)
        print('  ', k, o['kind'], o['text'][:70])
    write_manifest(vo, texts)


def write_manifest(vo, texts):
    clips = {}
    for k, o in texts.items():
        p = vo / (k + '.mp3')
        if not p.exists() or p.stat().st_size < 2000:
            continue
        n = sentences(o['text'])
        try:
            segs, total = segments(p, n)
        except Exception:
            segs, total = [], 0
        clips[k] = {'segs': segs if len(segs) == n else None, 'dur': round(total, 2)}
    (vo / 'vo.js').write_text('window.SAA_VO_CLIPS = %s;\n' % json.dumps(clips, separators=(',', ':')))
    print('wrote audio/vo/vo.js with %d clips' % len(clips))


if __name__ == '__main__':
    main()
