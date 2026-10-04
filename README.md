# Swift AI Academy: Applied AI, Module 1

Twenty short browser games for ITI trainees and college students in India, about using AI tools well.
Every person, record and number in the games is made up.

**Play online:** https://shruti-cgpm.github.io/swift-ai-academy-games/

| Section | Games |
|---|---|
| 1 · First Contact | 01–04 |
| 2 · Framing and Refining | 05–11 |
| 3 · Check Before You Use | 12–20 |

## What is in this repository

- `index.html`: the home page, with a thumbnail and a Play link for each game.
- `games/game-NN-*/`: one folder per game. Each game is plain HTML, CSS and JavaScript and runs offline: open its `index.html`.
- `thumbs/`: the home page thumbnails.
- `layer/`: source of the shared layer that every game loads:
  - the layout and skin (`saa-upgrade.js` / `.css`);
  - the activity kits (`saa-kit.js` / `.css`);
  - the narration player and sound effects;
  - the voice-over tools (`layer/tools/vo`).

  After editing, build it with `python3 layer/build.py` and copy `layer/dist/<deck|zoom>/saa-upgrade.*` into the games.

## Notes

- **Narration:** Narakeet, voice "sheela". Clips live in each game's `audio/vo/`.
  - To regenerate, pass your API key as the environment variable `NARAKEET_API_KEY`. Never put it in a file.
- **Images:** WebP. Icons are from the designer PNG batches.
- **Sounds:** generated in the browser with Web Audio.
