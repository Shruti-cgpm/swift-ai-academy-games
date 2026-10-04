# Swift AI Academy - ESL screen standard (pedagogy + instructional design)

Learners: school and ITI students, English as a second language (about CEFR A2-B1), often on a shared Android phone or a classroom laptop.
Goal of every screen: the student knows in 3 seconds what this screen is about and what to do, does ONE thing, and gets told why.

## 1. Screen anatomy (in this order)
| Part | Rule | Example |
|---|---|---|
| Eyebrow | 1-4 words, where we are. Not a sentence. | `Step 2 · Check` |
| Heading | One complete sentence or one question. 4-10 words. Ends with . or ? | `An AI answer can sound sure and still be wrong.` |
| Body | 1-2 complete sentences. Max 30 words. Only what the student needs for the task. | `Look at each part of the answer. Some parts are facts you can check.` |
| Your task | ONE sentence, starts with an action verb, names exactly what to tap or type. Class `do`/`saa-do` with label `Your task.` | `Your task. Tap the two parts that need checking.` |
| Activity | One interaction (see section 3). | |
| Feedback | One sentence for right, one for wrong, always saying WHY. | `Yes. The prompt said 8 am, not 9 am.` |

Hard limits per screen (visible at once, not counting the activity's own item labels): about 45 words of reading text, 1 idea, 1 action.

## 2. Language rules
- Complete sentences only in headings, body, task and feedback: subject + verb + full stop. No fragments ("Short drills. Quick feedback." -> "You do short drills. You get feedback at once.").
- Labels on tiles, chips, buttons and bins may be short noun phrases ("Phone number", "Good job for AI"). Use the same grammar for every label in one set.
- 6-14 words per sentence. Present simple. Active voice. Talk to the student as "you".
- One term per idea, every time: "AI tool", "prompt", "answer", "check", "fact", "made-up".
- No idioms, no phrasal verbs where a simple verb exists ("check" not "double-check", "use" not "make use of"), no "e.g.", no "etc.", no slashes, no brackets in sentences. Write "do not", not "don't".
- Numbers as digits. Concrete examples from the student's life: batch, workshop, practical, record book, notice board.
- Do not change facts, rules, marks, pass marks, codes (AAI-E-...), time allowances or the meaning of the curriculum. Rewrite wording only.

## 3. One interaction on EVERY screen
Information screens are no longer read-only. Pick the kit piece that matches the purpose:
| Purpose of the screen | Kit piece (`data-kit`) | Library inspiration |
|---|---|---|
| A list of points / parts / steps to learn | `reveal` (tap to flip) or `reveal` + `data-style="scratch"` for a "guess first" moment | Scratch Card |
| One key idea / rule | `quick`: one question, 2-3 options, why-feedback | Inference Spy |
| Two groups (use AI / do not rely; safe / private) | `sort` (tap or drag into 2 boxes) | Flick to Sort |
| A routine or process | `order` (put steps in order, dominoes topple) | Domino Chain |
| Find mistakes in an AI answer | `spot` (tap the wrong parts, then check) | Story Detective |
| Judge several statements | `stamp` (stamp each "Check it" / "Looks fine") | Stamp Sort |
Screens that already have a real activity (quiz question, typing box, chat bot, copy prompt) keep it; just fix the text and add the task line.
Cover/intro screens: no kit needed (the start screen replaces them). Result/download screens: no kit needed.
Add `data-required` when finishing the activity matters for learning (it locks Next until done). Do not add it to optional extras.

## 4. Feedback rules
- Right: start with "Yes." then the reason. Wrong: start with "Not quite." then a hint, never the answer by elimination.
- Let students try again. Never punish.

## 5. What not to do
- Do not add a second amber button. The only amber element is the main nav button / Start.
- Do not add text beside the Next button.
- Do not remove a game's existing scoring, gating, downloads or navigation.
- Do not put long reading text in the right column; the left column is heading + body + task, the right column is the activity.
