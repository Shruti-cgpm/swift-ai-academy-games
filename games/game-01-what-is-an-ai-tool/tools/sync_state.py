"""Tracks which screens' audio was generated from the *current* narration text.
audio/hashes.json: screen -> sha1 of the text the mp3 was made from.
audio/synced.js:   window.NARRATION_SYNCED = [screens whose mp3 matches narration.json now]
The page only highlights words on synced screens."""
import hashlib, json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
def h(t): return hashlib.sha1(t.encode()).hexdigest()
def refresh(record=()):
    texts = json.load(open(root / 'narration.json'))
    hp = root / 'audio' / 'hashes.json'
    hashes = json.load(open(hp)) if hp.exists() else {}
    for n in record: hashes[str(n)] = h(texts[n - 1])
    hp.write_text(json.dumps(hashes, indent=1) + '\n')
    ok = [n for n in range(1, len(texts) + 1) if hashes.get(str(n)) == h(texts[n - 1])]
    (root / 'audio' / 'synced.js').write_text('window.NARRATION_SYNCED = %s;\n' % json.dumps(ok))
    return ok
