# Voice-overs (same method as game 1)

The voice is Narakeet "sheela" (English, Indian accent) at speed 0.95. It reads the left-column text of each screen, plus the fixed feedback lines of the kits.

## How it works

- `common/narrate.js` is part of `saa-upgrade.js`. It does five things:
  - finds the screen's narration text: the left column, without eyebrows, buttons, activities, status lines or module codes;
  - plays `audio/vo/<key>.mp3` when a new screen or question appears;
  - adds Pause / Replay and a sound on-off button to the header, like game 1;
  - highlights each word as it is spoken;
  - speaks a kit's feedback line when one has a clip.
- `<key>` is a hash of the exact text. If the text on a screen changes, its old clip is no longer used. That screen stays silent until you regenerate it.
- If `audio/vo/vo.js` is missing, the game hides the narration buttons and works as before.

## After you change any screen text

```sh
node extract.js "<game folder>"                       # writes audio/vo/texts.json
NARAKEET_API_KEY=... python3 generate.py "<game folder>" --dry   # shows how many new clips are needed
NARAKEET_API_KEY=... python3 generate.py "<game folder>"         # makes only the new clips, then audio/vo/vo.js
```

- `extract.js` needs Playwright.
- `generate.py` needs ffmpeg. It uses ffmpeg to time each sentence for the word highlight.
- Some texts only appear while you play, such as quiz questions shown in random order. Collect them with a playthrough that dumps `SAA_VO.seen` to a JSON file. Pass that file with `--seen file.json`.
- Spoken-only fixes (for example ITI is read "I T I") are in `pronounce.py`. They do not change the screen text.
- Never write the API key into a file. Pass it only as an environment variable.
- `texts.json` lists every clip and its text. Use it to review the script.
