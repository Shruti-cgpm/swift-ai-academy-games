# Upgrade playbook: bring a new game up to the Swift AI Academy standard

This is every step applied to the first 20 games, in order. Follow it from scratch for each new game.
The reference game is game 1, `Unzipped/Applied-AI-MC1-main/`; compare against it whenever you are unsure.

**Paths.** `<root>` = "~/Downloads/Updated HTMLS _ 1st October 2026". Shared layer source: `<root>/_upgrade-layer/` (and its source of truth `~/Downloads/saa-upgrade-src/`). QA tools: `<root>/_upgrade-layer/qa/` (run `node` from that folder; Playwright is installed there).

**Never do these.**
- Never edit `saa-upgrade.*` or `saa-kit.*` inside a game. Never edit the layer source unless you are the lead. If the layer needs a change, describe it.
- Never write the Narakeet key into a file. Pass it only as the environment variable `NARAKEET_API_KEY`.
- Never delete files you did not create, except originals replaced by WebP after the game is checked (step 8).

Companion docs in this folder:
- `ESL-SCREEN-STANDARD.md`: how a screen reads.
- `KIT-AUTHORING.md`: the interaction kits and their attributes.
- `tools/vo/README.md`: voice-overs.

---

## 0. Set up
1. **Back up the untouched game.** `cp -R "<game>" <scratch>/backup_<name>`.
2. **Work out its family.**
   - **Deck:** the script defines `window.Deck`, and screens are `.slide > .card > .head`.
   - **Zoom:** everything else (page, slide, step or one-stage games).
3. **Note its theme.** Dark (navy) or light.
4. **Note its structure.** Any lanes (ITI / college), languages, chat flow, downloads or duplicate inner packages (`*-site/`). A duplicate package must stay byte-identical to the main copy: check with cmp, and rsync `audio/vo`.

## 1. Install the shared layer
`python3 <root>/_upgrade-layer/install.py "<game>" [zoom]`
This copies and links `saa-upgrade.css/.js` (deck or zoom) and `saa-kit.css/.js`. It gives the game the following.
- **Look and layout:**
  - Game 1's frame: header with logo, "Swift AI / ACADEMY", eyebrow and title; one glass card; footer with Back, a progress bar with "n / N", and an amber Next.
  - The start screen.
  - A left/right split.
  - Proportional zoom (zoom family) or fitted type (deck family).
- **Phone behaviour:** single column, safe centring (headings never cut off), Back always labelled, 44px header buttons.
- **Learner aids:** text lock, idle nudge, and Next dimmed while locked.
- **Narration player:** Pause/Replay and a sound button.
- **Sound effects:** click, right and wrong.
- **Staff codes hidden:** AAI-E-…, PC n.n, MC1 / 1.3, Mapped PC, Schema, Non-compensatory, "· Element n".
- **Light/dark switch:** for games that declare both themes.

## 2. Dark theme (light-default games only)
- **Theme attributes:** put `data-saa-themes data-theme="dark"` on `<html>`. The layer adds the sun/moon switch, remembers the learner's choice, and brands both themes.
- **Dark CSS:** add a `html[data-theme="dark"]{…}` block to the game's style.css. Redefine its colour variables: navy gradient, glass cards, ivory text, blue accents, and amber only for the main action. Cover every state: selected, right/wrong, disabled, focus, pop-ups and fields.
- **Light mode:** keeps the game's own colours. The layer adds the Swift AI header branding in navy.
- **Theme-dependent images:** swap them on the `saa:theme` event.

## 3. Screens to the ESL standard (`ESL-SCREEN-STANDARD.md`)
- **Each screen's text:**
  - one complete-sentence heading;
  - at most 2 short sentences of body;
  - one "Your task." line, where the learner acts;
  - one interaction.

  It sits in the LEFT column, and the activity in the RIGHT.
- **Plain language.** Simple words and short sentences, for weak English readers. No broken sentences.
- **Interactions.** Use the kits (`KIT-AUTHORING.md`):
  - `reveal` (cards / scratch), `quick`, `sort` (`data-style="deck"` for one card at a time), `order`, `spot`, `stamp`, `match`, `dial`;
  - `data-required` locks Next until done;
  - feedback is one sentence that says WHY.
- **Facts stay the same.** Never change facts, numbers, correct answers, scoring, pass marks or timings.

## 4. Match game 1's layout
The layer does this. Check that at 1280×720:
- the card runs from y 63 to 647, at x 38–1241;
- the heading is inset to x 84;
- Back and Next are 52px pills at y 656;
- the counter is centred.

Compare screenshots with game 1. Game-specific steppers or tabs above the card are fine. Remove any header buttons that do nothing, such as "Course outline" or "Close".

## 5. Learner-facing content only
- **Staff codes:** hidden by the layer. If a code sits inside a sentence that is still visible, reword the sentence.
- **Teacher-only parts:** assessor views, staff notes and schema lines. Hide them from learner games. A facilitator kit is teacher-facing by design.
- **Agreement:** records, examples, hints and feedback must agree with each other. Use made-up data only, with no real names or numbers. Fix contradictions and wrong step counts. Keep wording true to the UI: for example, no "choose from the list" when there is no list.

## 6. Visual assets
- **Icons:** take them from `<root>/_upgrade-layer/icons/<tone>/icon-*.webp`:
  - `ivory` on dark screens;
  - `navy` on light screens;
  - `blue` for selected states.

  Show them at 18–32px. They are one family: 1.8px line icons.
- **Designer pack:** if the game has one (README + manifest), follow its screen mapping. Use the game's own values where they differ, because the feedback is narrated, and list the differences.
- **No answer hints:** never reveal an answer. Put icons on all options or on none. Show "after" pictures only after the answer. Never use "marked" facilitator images on learner screens.
- **Fit:** pictures must fit. Write vh sizes as `calc(Nvh / var(--z,1))`, and put large examples behind a "See example" pop-up.

## 7. Interactions that cannot be skipped
- **Lock Next on required work.**
  - Kits use `data-required`.
  - For the game's own inputs, put `data-saa-locked` on the screen while it is unfinished. The layer then dims Next with aria-disabled. The game blocks the click and shows a short, spoken message saying what is missing.
- **Shortcuts use the same gate.** Arrow keys, steppers, stage tabs and journey bars go through the same gate as Next.
- **Validate inputs.** Reject empty, too short, emoji-only or copy-of-the-prompt answers. Accept Hindi and Gujarati. Set sensible maxlength.
- **Close loopholes.** "Select everything" must not pass. Answers lock after Check. Retyping the wrong claim must not pass.
- **Start over** really resets: clear the saved state, then `location.reload()`.
- **Typed work.** Add a `beforeunload` warning once anything is typed. Downloads say clearly when work is unfinished.
- **Right and wrong sounds.** In games that redraw on each answer, call `SAA_SFX.correct()` / `SAA_SFX.wrong()`.

## 8. Images to WebP
1. `python3 qa/webpify.py "<game>"`: icons come from the library and photos are converted; it rewrites the paths in index.html, script.js and style.css.
2. `node qa/rasterize.js "<game>"`: renders other SVGs (diagrams, mocks) at 2x.
3. Check with `qa/screens.js`, then delete the originals that now have a .webp.

## 9. Narration (voice "sheela" for English, "manasi" for Gujarati: chosen automatically)
- **What is read:**
  - each screen's left column;
  - kit feedback (`.saa-k-why`);
  - card backs and accordion panels the learner opens;
  - feedback in `.saa-k-why`.
- **Dynamic games.** Mark them: `data-saa-page` on the current screen or turn, `data-saa-lead` on the block to read, and `data-saa-say` on chat lines to read.
- **Stable text only.** Keep live counters and scores out with `saa-vo-skip`, and keep narrated text identical at every screen size.
- **Generate:**
  1. Run `node ~/Downloads/saa-upgrade-src/tools/vo/extract.js "<game>"`. For shuffled quizzes, chats and lanes, collect the texts with a playthrough that dumps `SAA_VO.seen`, `SAA_VO.reveals` and `SAA_VO.fbTexts()` to a JSON file.
  2. Run `NARAKEET_API_KEY=… python3 ~/Downloads/saa-upgrade-src/tools/vo/generate.py "<game>" [--seen file.json]`. Run it with `--dry` first. Exit code 3 means you are out of credit: stop and report. It keeps existing clips.
  3. Re-encode the new mp3s: `ffmpeg -i in.mp3 -ac 1 -ar 24000 -b:a 64k out.mp3`.
- **Check coverage.** Every narrated screen, opened card and feedback line has a clip (`qa/screens.js` VO column, `qa/revtest.js`). Check that narration never restarts on the same screen when the learner taps.

## 10. Phones, tablets and big screens
- **Sizes:** check 360×640, 412×915, 768×1024, 1024×600, 1280×720, 1920×1080 and 2560×1440, plus landscape phones.
- **Layout:**
  - no sideways scroll;
  - headings reachable;
  - tap targets at least 44px;
  - wide tables scroll inside their box;
  - pop-ups fit.
- **Text size.** Text never shrinks below about 14px on phones; the card scrolls instead.

## 11. QA before you finish (all must pass)
- **Screen checks:** `node qa/screens.js "<game>" W H` at 1024 600, 1280 720 and 1920 1080, then at 412 915 and 360 640. Repeat at 1280 720 with `--browser=webkit` (Safari engine). Every line must say "all ok": no OVER / IMG / HIT / CODE / VO / CUT.
- **Opened cards:** `node qa/revtest.js "<game>"`: everything opened is read, and has a clip.
- **Real-click playthrough** of every lane and language:
  - right answers, wrong answers and empty inputs;
  - keyboard-only;
  - no page errors;
  - every gate blocks first, then opens with correct input;
  - downloads have the right content.

  Locked Next has aria-disabled, so use force clicks in Playwright.
- **Look at the screenshots** of every screen and state (`qa/screens.js … <shot-prefix>`). Check both themes for light/dark games.

## 12. Publish (lead)
1. Add the game to the gallery repo `~/Downloads/swift-ai-academy-games`: the game folder, its thumbnail, and the home-page entry in `index.html`.
2. Rebuild the inner site zips and the package.
3. Commit and push. GitHub Pages updates in about a minute.
