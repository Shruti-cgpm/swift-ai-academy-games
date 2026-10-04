#!/usr/bin/env python3
"""install.py <game dir> [family]   - copies the upgrade layer into a game and links it (idempotent).
Files are looked up as <src>/<family>/saa-upgrade.css|js. Rollback: delete the two tags (or restore the backup)."""
import sys, re, shutil, pathlib
src = pathlib.Path(__file__).resolve().parent
game = pathlib.Path(sys.argv[1]); fam = sys.argv[2] if len(sys.argv) > 2 else '.'
idx = next(p for p in sorted(game.rglob('index.html')) if 'rulebook-site' not in p.parts)
d = idx.parent
for f in ('saa-upgrade.css', 'saa-upgrade.js'):
    s = src / 'dist' / ('zoom' if fam == 'zoom' else 'deck') / f
    shutil.copy(s, d / f)
h = idx.read_text()
if 'saa-upgrade.css' not in h:
    h = re.sub(r'(<link[^>]*href="style\.css"[^>]*>)', r'\1\n<link rel="stylesheet" href="saa-upgrade.css">', h, count=1)
if 'saa-upgrade.js' not in h:
    h = re.sub(r'(<script[^>]*src="script\.js"[^>]*></script>)', r'\1\n<script src="saa-upgrade.js"></script>', h, count=1)
for f in ('saa-kit.css', 'saa-kit.js'):
    shutil.copy(src / 'kit' / f, d / f)
if 'saa-kit.css' not in h:
    h = h.replace('<link rel="stylesheet" href="saa-upgrade.css">', '<link rel="stylesheet" href="saa-upgrade.css">\n<link rel="stylesheet" href="saa-kit.css">', 1)
if 'saa-kit.js' not in h:
    h = h.replace('<script src="saa-upgrade.js"></script>', '<script src="saa-upgrade.js"></script>\n<script src="saa-kit.js"></script>', 1)
idx.write_text(h)
print('installed in', d)
