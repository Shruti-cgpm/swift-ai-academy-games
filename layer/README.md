# Swift AI Academy - activity frame upgrade layer

Two small files added to a game, loaded AFTER its own style.css / script.js. They do not edit the game's own files.

    saa-upgrade.css
    saa-upgrade.js

## Rollback
Delete the two tags from index.html (`<link ... saa-upgrade.css>` and `<script src="saa-upgrade.js">`) and the two files.
Originals of every game are in `Unzipped_BACKUP_original/`.

## Build
Edit `core/deck.*`, `core/zoom.*` (family-specific) or `common/common.*` (shared by all), then run `python3 build.py`.
`install.py` copies from `dist/deck` or `dist/zoom`.

## Common to every game (common/)
- Start screen (handoff Module Opening Premium) built from the game's own cover: eyebrow, title, first intro line, one amber Start.
  Start skips the cover it replaces. A cover that has its own choices or links (e.g. Section Check's "Skip the refresher", Set up and send's language choice) stays.
- "Your task" box: the screen's own instruction line (starts with Tap / Choose / Pick / Fill / Copy ...) is styled as the box. Labels, prompt boxes, warnings and accordions are excluded.
- One amber action: if a screen has its own amber button (e.g. "Check my answer"), the Next button turns blue until it is done.

## Two flavours (folders)
| Folder | For | What it does |
|---|---|---|
| `.` (root) | "Deck" games: `window.Deck`, `.slide > .card > .head` (Section Checks, Ten Starter Prompts, Your Own Task, Rewrite Five, Rulebook) | Full-width card. `.head` (eyebrow, title, intro) goes LEFT, the activity RIGHT (JS wraps them in `.saa-lead` / `.saa-work`). Replaces `Deck.fit()` so type is 14-24px instead of 13-17px and still shrinks until the card fits. Quiz cards are left single-column. |
| `zoom/` (also splits each page: heading/intro left, activity right) | Page/slide games with fixed px sizes (Practice Bots, Find the Planted Errors, Marking Card, Marking/Separating, Reading S02, Facilitator Kit, Request Builder, Peer Exchange x2, Correct It; also the 2 light games) | `zoom: var(--z)` on `.app`, `--z = clamp(1, min(vw/980, vh/640), 1.7)`, column widened to 1280px, `height: calc(100dvh / var(--z))`. Everything scales proportionally; never smaller than designed. Phones (<=700px) get `--z:1`. |

Both flavours also add: text lock (`user-select:none`, typed fields excepted), uniform option look (equal min-height, border, raised edge, hover/press), idle nudge (after 5 s with no input the primary button, or the unanswered options, glow), reduced-motion respect.

## Install
    python3 install.py "<game folder>"          # Deck games
    python3 install.py "<game folder>" zoom     # everything else
It copies the two files next to the game's index.html and links them (idempotent).

## Not done by this layer (needs per-game content work)
- "Your task" instruction boxes written per screen
- Audio narration, word highlight, spoken feedback (needs Narakeet credits + per-game narration text)
- Drag-and-drop for sorting/ordering activities
- Splitting overloaded screens, fallback paths, learning-design fixes (see Open items in Game-Porting-Checklist.xlsx)
