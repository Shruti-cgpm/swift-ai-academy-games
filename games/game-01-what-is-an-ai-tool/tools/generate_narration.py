#!/usr/bin/env python3
"""Generate audio/sN.mp3 from narration.json with Narakeet (voice: sheela, English Indian accent).
Usage: NARAKEET_API_KEY=... python3 tools/generate_narration.py [screen numbers, e.g. 4 5 6]"""
import json, os, sys, time, urllib.request, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from pronounce import spoken
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import sync_state
key = os.environ.get('NARAKEET_API_KEY') or sys.exit('Set NARAKEET_API_KEY')
root = pathlib.Path(__file__).resolve().parent.parent
(root / 'audio').mkdir(exist_ok=True)
URL = 'https://api.narakeet.com/text-to-speech/mp3?voice=sheela&voice-speed=0.95'

def fetch(req):
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read(), r.headers.get('Content-Type', '')

only = {int(a) for a in sys.argv[1:]}
for n, text in enumerate(json.load(open(root / 'narration.json')), 1):
    if only and n not in only:
        continue
    req = urllib.request.Request(URL, data=spoken(text).encode(), method='POST',
                                 headers={'x-api-key': key, 'Content-Type': 'text/plain'})
    body, ctype = fetch(req)
    if 'json' in ctype or body[:1] == b'{':
        job = json.loads(body)
        while True:
            st = json.loads(fetch(urllib.request.Request(job['statusUrl']))[0])
            if st.get('finished'):
                if not st.get('succeeded'):
                    sys.exit('Job failed: %s' % st.get('message'))
                body = fetch(urllib.request.Request(st['result']))[0]
                break
            time.sleep(1)
    (root / 'audio' / ('s%d.mp3' % n)).write_bytes(body)
    print('audio/s%d.mp3' % n, len(body))
    sync_state.refresh([n])

try:
    import subprocess
    subprocess.run([sys.executable, str(root / 'tools' / 'analyze_audio.py')], check=True)
except Exception as e:
    print('timing analysis skipped:', e)
