#!/usr/bin/env python3
"""Find where each sentence is actually spoken in audio/sN.mp3 (ffmpeg silence detection) and write
audio/timings.js. The page uses these to time the word highlight. Needs ffmpeg."""
import json, re, subprocess, pathlib
root = pathlib.Path(__file__).resolve().parent.parent

def sentences(text):
    out, n = [], 0
    for tok in text.split():
        n += 1
        if re.search(r'[.?!]$', tok): out.append(n); n = 0
    if n: out.append(n)
    return out

def silences(path, noise, dur):
    r = subprocess.run(['ffmpeg', '-i', str(path), '-af', 'silencedetect=noise=%ddB:d=%s' % (noise, dur), '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r)]
    total = float(re.search(r'Duration: (\d+):(\d+):([\d.]+)', r).expand(r'\1 \2 \3').split()[0]) * 3600 if False else None
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', r); total = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])
    return starts, ends, total

def segments(path, want):
    """Sentence boundaries = the (want-1) longest pauses inside the clip."""
    starts, ends, total = silences(path, -38, 0.12)
    gaps = [(s, e) for s, e in zip(starts, ends) if s > 0.15 and e < total - 0.05]
    lead = ends[0] if starts and starts[0] < 0.05 and ends else 0.0
    tail = starts[-1] if len(starts) > len(ends) or (starts and ends and starts[-1] > ends[-1]) else total
    if len(starts) > len(ends): gaps = [g for g in gaps if g[0] != starts[-1]]
    top = sorted(sorted(gaps, key=lambda g: g[1] - g[0], reverse=True)[:want - 1])
    segs, cur = [], lead
    for s, e in top:
        segs.append([round(cur, 3), round(s, 3)]); cur = e
    segs.append([round(cur, 3), round(tail, 3)])
    return segs, total

texts = json.load(open(root / 'narration.json'))
res = {}
for n, t in enumerate(texts, 1):
    p = root / 'audio' / ('s%d.mp3' % n)
    if not p.exists(): continue
    sent = sentences(t)
    segs, total = segments(p, len(sent))
    res[str(n)] = {'sentences': len(sent), 'segs': segs, 'exact': len(segs) == len(sent)}
    print(n, 'exact' if len(segs) == len(sent) else 'FALLBACK', len(sent), segs[:3])
(root / 'audio' / 'timings.js').write_text('window.NARRATION_TIMINGS = %s;\n' % json.dumps(res))
