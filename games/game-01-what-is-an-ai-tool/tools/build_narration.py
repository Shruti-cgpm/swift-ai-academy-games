#!/usr/bin/env python3
"""Rebuild narration.json from the left-column (.lead) text of each screen in index.html,
so the spoken words match the words that get highlighted."""
import json, re, pathlib
from html.parser import HTMLParser
root = pathlib.Path(__file__).resolve().parent.parent
BLOCK = {'p', 'h2', 'li'}

class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.stack = []; s.screens = []; s.cur = None; s.lead = 0; s.skip = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs); cls = (a.get('class') or '').split()
        if tag == 'section' and 'step' in cls:
            self.cur = []; self.screens.append(self.cur)
        skip = "tag" in cls or "said" in cls or "nr" in cls or tag == "button" or ('hidden' in a and tag != 'section')
        if tag in ('br', 'img', 'input', 'path', 'svg') : return
        self.stack.append((tag, 'lead' in cls, skip))
        if 'lead' in cls: self.lead += 1
        if skip: self.skip += 1
        if self.lead and not self.skip and tag in BLOCK: self.cur.append('')
    def handle_endtag(self, tag):
        if tag in ('br', 'img', 'input', 'path', 'svg') or not self.stack: return
        t, lead, skip = self.stack.pop()
        if lead: self.lead -= 1
        if skip: self.skip -= 1
    def handle_data(self, d):
        if self.lead and not self.skip and self.cur:
            if not self.cur: return
            self.cur[-1] += d

p = P(); p.feed((root / 'index.html').read_text())
out = []
for blocks in p.screens:
    parts = []
    for b in blocks:
        b = re.sub(r'\s+', ' ', b).strip()
        if not b: continue
        if b[-1] not in '.?!:': b += '.'
        parts.append(b)
    out.append(' '.join(parts))
(root / 'narration.json').write_text(json.dumps(out, indent=1, ensure_ascii=False) + '\n')
for i, t in enumerate(out, 1): print(i, t)

import sys; sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import sync_state
print('audio in sync for screens:', sync_state.refresh())
