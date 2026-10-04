# Interaction kit - markup (copy, then replace the words)
Files: `saa-kit.css` + `saa-kit.js` next to index.html (install.py adds them). Put a kit inside the screen's activity area.
Add `data-required` to lock Next until the kit is done.

## reveal (tap to flip)  - add data-style="scratch" for scratch cards
<div class="saa-kit" data-kit="reveal" data-required>
  <div class="saa-cards">
    <button class="saa-card" type="button"><span class="saa-front">Mark</span><span class="saa-back">Mark every fact, number and name.</span></button>
    <button class="saa-card" type="button"><span class="saa-front">Separate</span><span class="saa-back">Keep facts apart from opinions.</span></button>
  </div>
</div>

## quick (one question)
<div class="saa-kit" data-kit="quick" data-required>
  <p class="saa-q">The AI sounds very sure. What does that tell you?</p>
  <div class="saa-k-opts">
    <button class="saa-k-opt" type="button" data-why="Not quite. A sure tone is not proof.">It is correct.</button>
    <button class="saa-k-opt" type="button" data-ok data-why="Yes. Sounding sure is not proof.">Nothing yet. I still check it.</button>
  </div>
  <p class="saa-k-why"></p>
</div>

## sort (two boxes; tap or drag)
<div class="saa-kit" data-kit="sort" data-required data-shuffle data-done-text="All sorted. The more it matters, the more you check.">
  <div class="saa-bins">
    <div class="saa-bin" data-bin="a" data-label="Good job for AI"></div>
    <div class="saa-bin" data-bin="b" data-label="Do not rely on it"></div>
  </div>
  <div class="saa-pool">
    <button class="saa-chip" type="button" data-bin="a" data-why="Yes. Drafting is a good job for AI." data-hint="Not quite. Would a mistake here be easy to fix?">Draft a class notice</button>
  </div>
  <p class="saa-k-why"></p>
</div>

### sort, one card at a time: add data-style="deck"
Same markup as sort (copy the block above and add one attribute). Nothing else changes: data-bin, data-why, data-hint,
data-done-text, data-shuffle, data-required, icons inside the chips, the feedback lines (so the narrated clips still match) and the saa:done event.
<div class="saa-kit" data-kit="sort" data-style="deck" data-required data-shuffle data-done-text="...">  ...same bins and chips...  </div>
- The chips become a stack. Only the top card shows, large, with "Card 2 of 8" above it and a count on each box.
- The learner flicks or drags the card toward a box, or taps a box, or uses the keyboard: Left / Right arrow (two boxes) on the card or a box, Enter or Space on a box.
- Right: the box's why line shows and the card flies into the box; the next card comes up. Wrong: the box and card shake, the hint line shows, the card stays.
- Done: the stack goes away and the boxes list the sorted items (the same end state as sort).
- Phones: only the card is a drag area and it keeps vertical page scroll (touch-action: pan-y); a sideways flick sorts.
- Reduced motion: no fly or snap animation. No sound.
- Best for 2 boxes (arrows and flick map to left/right). With 3 boxes it works by drag-to-box or tap. Do not use it on scored Section Check stations.
- QA: solve.js drives it by clicking the box that matches the top card (.saa-pool .saa-chip.is-top).

## order (domino chain)
<div class="saa-kit" data-kit="order" data-required>
  <ol class="saa-steps"><li data-n="1">Mark the facts.</li><li data-n="2">Separate facts from opinions.</li><li data-n="3">Correct what is wrong.</li></ol>
  <p class="saa-k-why" data-right="Yes. Mark, separate, then correct." data-wrong="Not yet. The red steps are in the wrong place."></p>
</div>

## spot (find the parts to check)
<div class="saa-kit" data-kit="spot" data-required data-done-text="Well done. These are the parts to check.">
  <div class="saa-text">Buses leave <span class="saa-s" data-ok data-why="The prompt said 8 am.">at 9 am.</span> <span class="saa-s" data-why="This matches the prompt.">Bring your record book.</span></div>
</div>

## stamp (judge statements)
<div class="saa-kit" data-kit="stamp" data-required data-stamps="Check it|Looks fine">
  <div class="saa-rows">
    <div class="saa-row" data-ans="0" data-why="Yes. Check every date." data-hint="Not quite. Is this a fact you can check?">The exam is on 14 March.</div>
  </div>
</div>

## match (link each item to its partner; Band Connect, or a cable with data-style="wire")
<div class="saa-kit" data-kit="match" data-required data-shuffle data-done-text="(optional) All matched.">
  <div class="saa-m-board">
    <div class="saa-m-left">
      <button class="saa-m-item" type="button" data-pair="narrow" data-why="Use Narrow. Ask the AI tool for less." data-hint="(optional) Not quite. Is it too long or too short?">Too much</button>
      <button class="saa-m-item" type="button" data-pair="expand" data-why="Use Expand. Ask the AI tool for more.">Too little</button>
    </div>
    <div class="saa-m-right">
      <button class="saa-m-target" type="button" data-pair="narrow"><img src="assets/icons/icon-move-1.svg" alt="">Narrow</button>
      <button class="saa-m-target" type="button" data-pair="expand"><img src="assets/icons/icon-move-2.svg" alt="">Expand</button>
    </div>
  </div>
  <p class="saa-k-why"></p>
</div>
- An item and its target share data-pair. Put data-why (right) and data-hint (wrong) on the item, as in sort.
  Defaults are the existing narrated lines: "Yes, that is right." and "Not quite. Try again."
- The learner taps an item, then its partner (either side first); or drags a band from one to the other (mouse, pen,
  touch on tablets); or uses the keyboard: Tab to an item, Enter / Space, Tab to its partner, Enter / Space. Esc drops the pick.
- Right: the band stays (green), both sides lock, the why line shows. Wrong: both shake, the band snaps back, the hint shows.
- All linked: data-done-text shows if set (leave it out to keep the last why line on screen), then is-done + one saa:done.
- data-shuffle shuffles the right column so that no target sits straight across from its own item.
- Lines are SVG in the board's own px: they follow resize, --z zoom and the screen becoming visible.
- Phones (700px and narrower): the targets stack under the items, no lines, a number badge shows each pair; tap only
  (no drag, so the page still scrolls). Reduced motion: no snap or pulse. No sound.
- data-style="wire": the cable look (dark casing, bright core, square sockets). Short labels (1-4 words) work best;
  2 columns of 5 fit the 456px activity column at 1024x600.

### match, one plug for a game-checked question: data-mode="pick"
<div class="cq-options saa-kit" data-kit="match" data-mode="pick" data-style="wire" role="radiogroup">
  <button class="cq-opt saa-m-target" role="radio" onclick="setConsequence(...)">...</button>  (x4)
</div>
- The kit adds a plug in the left gutter and a socket on each .saa-m-target. Tapping an option (or dragging the cable
  from the plug onto it) runs the option's own click handler and wires the plug to it. The kit never judges, so it
  never shows the answer; the game's Check / scoring / feedback stay as they are.
- The wire is blue while chosen; it turns green / red when the game gives the chosen target is-right / right or
  is-wrong / wrong. No data-required, no saa:done, no .saa-k-why.
- Place the plug with CSS for the layout (game CSS, e.g. beside the cause box, or above the list on phones).
- Used in Find the Planted Errors screens 16-20.
- QA: solve.js links each .saa-m-item to the .saa-m-target with the same data-pair; pick-mode kits are left to the game.

## dial (turn a knob; a sample AI answer changes; Pressure Gauge / Volume Knob)
<div class="saa-kit" data-kit="dial" data-required data-label="Move dial">
  <div class="saa-dial-stop" data-start data-why="This is the first answer. Now try each of the 3 moves.">
    <span class="saa-d-name">First answer</span>
    <p class="saa-d-you">Write a safety reminder for new trainees.</p>
    <p class="saa-d-ans">Safety equipment must be worn at all times. Work areas must be kept clear.</p>
  </div>
  <div class="saa-dial-stop" data-why="Use Narrow when the answer covers too much. Now it talks about one part only.">
    <span class="saa-d-name"><img src="assets/icons/icon-move-1.svg" alt="" aria-hidden="true">1. Narrow</span>
    <p class="saa-d-you">Only tell me about <mark>safety equipment</mark>.</p>
    <p class="saa-d-ans">Safety glasses and gloves must be worn for every job.</p>
  </div>
  ...one .saa-dial-stop per position (2 to 4 work best)...
  <p class="saa-k-why"></p>
</div>
- One .saa-dial-stop = one position. .saa-d-name is its label (an icon and a <small> second line are fine); .saa-d-you is
  what the learner types (optional; <mark> shows the words that fill the blank); .saa-d-ans is the AI answer.
  data-why is the caption: it shows in .saa-k-why, so the layer speaks it (extract.js collects it like any data-why).
- data-start on one stop = the position shown first (the original answer). It does not count as a try.
  Without data-start the first stop is shown first and counts.
- Labels sit round the knob: 4 stops = the 4 corners, clockwise from top left; 3 = left, top, right; 2 = left, right;
  5 or more = a row under the knob. data-angles="-90,0,90" overrides the knob angles. data-label = the slider's name.
- The learner drags the knob (it turns and snaps), taps the knob (next position), taps a label, or uses the keyboard
  on the knob (role="slider", aria-valuetext = the label): arrows, Home / End, Enter / Space = next.
- The chat card swaps at once; every stop sits in one grid cell, so the card keeps the height of the longest answer and
  nothing jumps. Each label gets a tick when tried; the status line counts "1 of 3 tried".
- No right or wrong. Done when every position has been tried: is-done + one saa:done (data-required locks Next till then).
- Phones: only the knob is a drag area (touch-action:none); labels are taps, the page still scrolls.
  Reduced motion: the knob and the answer change without animation. No sound.
- The chat card is light (#F6F4EF) like spot's text card. Keep answers to 1-5 short sentences: at 1024x600 the 4-stop
  dial with a 5-sentence answer is about 300px tall in the 456px column.
- Used in: Reading (Framing and the Five Refinement Moves) screen 9, Request Builder and Refinement Card screen 5,
  Your Own Task, Framed and Refined screen 6 (moves 1 to 3; moves 4 and 5 stay reveal cards).
- QA: solve.js taps every .saa-d-pos label.
