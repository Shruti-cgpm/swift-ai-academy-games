#!/usr/bin/env python3
"""Assemble the two layer flavours: dist/deck and dist/zoom = core part + common part."""
import pathlib
r = pathlib.Path(__file__).resolve().parent
for fam in ('deck', 'zoom'):
    out = r / 'dist' / fam; out.mkdir(parents=True, exist_ok=True)
    (out / 'saa-upgrade.css').write_text((r / 'core' / f'{fam}.css').read_text() + (r / 'common' / 'common.css').read_text() + (r / 'common' / 'skin.css').read_text() + (r / 'common' / 'narrate.css').read_text())
    (out / 'saa-upgrade.js').write_text((r / 'core' / f'{fam}.js').read_text() + (r / 'common' / 'common.js').read_text() + (r / 'common' / 'skin.js').read_text() + (r / 'common' / 'narrate.js').read_text() + (r / 'common' / 'sfx.js').read_text())
(r / 'dist' / 'saa-sfx.js').write_text((r / 'common' / 'sfx.js').read_text())   # stand-alone copy for game 1
print('built dist/deck and dist/zoom')
