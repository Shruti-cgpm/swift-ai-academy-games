(function (root) {
  'use strict';

  // Fixed order. Numbers are integers; formatIndian() produces every numeral the child sees.
  const QUESTIONS = [   // storyboard FR1–FR7
    { name: 'Eight thousand forty-five', answer: 8045, distractors: [80045, 8450, 8405],
      correct: 'Yes! “Eight thousand forty-five” is 8,045.', hint: 'Hint: The 8 is in the thousands place. Then comes forty-five.' },
    { name: 'Fifty-six thousand four hundred ninety-one', answer: 56491, distractors: [56419, 5691, 56914],
      correct: 'Yes! “Fifty-six thousand four hundred ninety-one” is 56,491.', hint: 'Hint: Read it in three parts. Fifty-six thousand, then four hundred, then ninety-one.' },
    { name: 'Thirty thousand seventy', answer: 30070, distractors: [30700, 3070, 30007],
      correct: 'Yes! “Thirty thousand seventy” is 30,070.', hint: 'Hint: The 7 is in the tens place. So it is seventy, not seven hundred.' },
    { name: 'Forty thousand five hundred six', answer: 40506, distractors: [40560, 405006, 45006],
      correct: 'Yes! “Forty thousand five hundred six” is 40,506.', hint: 'Hint: It has five hundred, then zero tens, then six ones.' },
    { name: 'Two lakh forty-five thousand', answer: 245000, distractors: [254000, 204500, 245500],
      correct: 'Yes! “Two lakh forty-five thousand” is 2,45,000.', hint: 'Hint: Start with two lakh. Then add forty-five thousand.' },
    { name: 'Three lakh five thousand six hundred', answer: 305600, distractors: [350600, 356000, 305060],
      correct: 'Yes! “Three lakh five thousand six hundred” is 3,05,600.', hint: 'Hint: It has three lakh, then five thousand, then six hundred.' },
    { name: 'Nine lakh forty-five', answer: 900045, distractors: [900450, 90045, 900405],
      correct: 'Yes! “Nine lakh forty-five” is 9,00,045.', hint: 'Hint: Start with nine lakh. Then add forty-five. The places in between are all zero.' }
  ];

  const LINES = {   // storyboard FR0T / FR wrong / inactivity / FR✓
    intro: 'Please help me find the records! Read the name at the top. Find the same number below. Tap that number two times.',
    task: 'Find the number for this name. Tap it two times to choose it.',
    doubleTap: 'Tap the same number again to choose it.',
    wrong: 'Not quite. Read the name again, one part at a time.',
    idle: 'Read the name at the top. Then tap the matching number two times.',
    outro: 'Well done! You did a great job. You found every record.',
    reveal: q => `The answer is ${formatIndian(q.answer)}. Tap it two times to choose it.`
  };

  // Indian grouping: last three digits, then pairs. 245000 → "2,45,000", 2045000 → "20,45,000".
  function formatIndian(n) {
    const digits = String(Math.trunc(Math.abs(n)));
    const sign = n < 0 ? '-' : '';
    if (digits.length <= 3) return sign + digits;
    const head = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return `${sign}${head},${digits.slice(-3)}`;
  }

  function options(q) { return [q.answer, ...q.distractors]; }

  // Shuffle the four pedestal values; the answer never lands in `previousSlot`.
  function arrange(q, previousSlot = -1, random = Math.random) {
    const out = options(q);
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    const slot = out.indexOf(q.answer);
    if (slot === previousSlot) {
      const others = out.map((_, i) => i).filter(i => i !== slot);
      const swap = others[Math.floor(random() * others.length) % others.length];
      [out[slot], out[swap]] = [out[swap], out[slot]];
    }
    return out;
  }

  const PLACE_NAMES = ['Ten Lakhs', 'Lakhs', 'Ten Thousands', 'Thousands', 'Hundreds', 'Tens', 'Ones'];
  // Six columns (Lakhs → Ones), plus Ten Lakhs only when the number needs it.
  function placeValue(n) {
    const digits = String(n);
    const count = Math.max(6, digits.length);
    const names = PLACE_NAMES.slice(PLACE_NAMES.length - count);
    const padded = digits.padStart(count, ' ');
    return names.map((name, i) => ({ name, digit: padded[i] === ' ' ? '' : padded[i] }));
  }

  const api = { QUESTIONS, LINES, formatIndian, options, arrange, placeValue };
  root.TitanLevel1Data = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
