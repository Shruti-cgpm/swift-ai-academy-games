#!/usr/bin/env python3
"""Generate audio/fb/<id>.mp3 for every entry in feedback.json (Narakeet, voice sheela).
Usage: NARAKEET_API_KEY=... python3 tools/generate_feedback.py [id ...]"""
import json, os, sys, time, urllib.request, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from pronounce import spoken
key = os.environ.get('NARAKEET_API_KEY') or sys.exit('Set NARAKEET_API_KEY')
root = pathlib.Path(__file__).resolve().parent.parent
out = root / 'audio' / 'fb'; out.mkdir(parents=True, exist_ok=True)
URL = 'https://api.narakeet.com/text-to-speech/mp3?voice=sheela&voice-speed=0.95'
def fetch(req):
    with urllib.request.urlopen(req, timeout=60) as r: return r.read(), r.headers.get('Content-Type', '')
only = set(sys.argv[1:])
for id_, text in json.load(open(root / 'feedback.json')).items():
    if only and id_ not in only: continue
    body, ctype = fetch(urllib.request.Request(URL, data=spoken(text).encode(), method='POST', headers={'x-api-key': key, 'Content-Type': 'text/plain'}))
    if 'json' in ctype or body[:1] == b'{':
        job = json.loads(body)
        while True:
            st = json.loads(fetch(urllib.request.Request(job['statusUrl']))[0])
            if st.get('finished'):
                if not st.get('succeeded'): sys.exit('Job failed: %s' % st.get('message'))
                body = fetch(urllib.request.Request(st['result']))[0]; break
            time.sleep(1)
    (out / (id_ + '.mp3')).write_bytes(body); print(id_, len(body))
