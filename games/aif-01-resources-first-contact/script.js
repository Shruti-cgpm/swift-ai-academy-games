/* Resources: First Contact - one idea per screen (ESL upgrade, Oct 2026).
   - Screens are the <section class="screen"> blocks in index.html. Back and Continue on every screen.
   - Screen 1 has 3 rules to read first (a required kit: Continue stays locked until all 3 are open).
   - Screen 2 is the 3-question picker: it picks 2 or 3 resources and can jump to their screens.
   - Each resource card has Key points (a pop-up with the takeaways, a tip and a note box) and Open (new tab).
   - Notes go to My AI toolkit (header button and the last screen): download or clear them there.
   - Nothing is sent anywhere. Notes and opened cards are kept in this browser only (localStorage).
   - The host platform can listen for postMessage {source:'swift-ai-academy', segment, event:'complete'}. */
(function () {
  'use strict';
  /* lane: 'both' | 'iti' | 'he'  ·  min: minutes, used by the picker (null = varies)
     opt: optional extra  ·  url: unchanged from the original resource list
     adds / take / tryit / note: rewritten in plain English (facts unchanged) */
  var RES = [
    /* ---------- Section 1: Prompt better ---------- */
    { id: 'openai-prompting', sec: 's1', lane: 'both', min: 10,
      title: 'Prompting fundamentals', org: 'OpenAI Academy (OpenAI)', url: 'https://openai.com/academy/prompting/',
      format: 'Short guide', level: 'Beginner', time: 'About 10 min', access: 'Free. No account needed.',
      adds: 'It gives you 3 simple steps to write your own prompts. It has a practice activity too.',
      take: ['A good prompt has 3 steps. Say the task, give the background, and describe the answer you want, such as its tone, format and length.', 'A practice activity shows the same prompt written 3 ways: okay, better and best.', 'Ask for options. Say what matters most: accuracy, creativity or speed. Keep your prompt specific but simple.'],
      tryit: 'Rewrite your Watch It Get It Wrong prompt with the 3 steps. Then compare the 2 answers.' },
    { id: 'anthropic-prompting', sec: 's1', lane: 'both', min: 10,
      title: 'Best practices for prompt engineering', org: 'Anthropic (Claude blog)', url: 'https://claude.com/blog/best-practices-for-prompt-engineering',
      format: 'Article', level: 'Beginner to intermediate', time: 'About 10 min', access: 'Free. No account needed.',
      adds: 'It gives quick fixes for the most common problems with AI answers.',
      take: ['Tell the AI tool that it may say “I do not know”. Then it makes up fewer answers.', 'A table gives the fix for each common problem: a general answer, an off-topic answer, a format that keeps changing, and made-up facts.', 'A longer prompt is not always better. You do not need every method at once.', 'Start with 1 example. Add more only if you need them.'],
      note: 'The part about prefilling is for developers. You can skip it.',
      tryit: 'Add “If you do not know, say so” to your next prompt. See what changes.' },
    { id: 'openai-college', sec: 's1', lane: 'he', min: 45,
      title: 'AI for College Students', org: 'OpenAI Academy (OpenAI)', url: 'https://academy.openai.com/pages/courses',
      format: 'Course', level: 'Beginner', time: 'About 45 min', access: 'Free. Needs a ChatGPT account.',
      adds: 'It shows how to use AI for study, group work and jobs. The AI should not do your thinking for you.',
      take: ['It covers study plans, group work, writing and getting ready for a job.', 'It shows how to decide what to share with the AI tool. It also shows how to check its answers before you accept them.', 'It shows how to prepare job applications and interviews within your institute’s rules.'],
      note: 'Find “AI for College Students” in the course list. You need a ChatGPT account. Check that your institute allows it before you sign up. Use only an account you are allowed to use.',
      warn: true,
      tryit: 'Pick 1 study task this week. Write down what you will check before you use the AI answer.' },
    { id: 'openai-reasoning', sec: 's1', lane: 'both', min: 15, opt: true,
      title: 'Reasoning best practices', org: 'OpenAI (developer documentation)', url: 'https://developers.openai.com/api/docs/guides/reasoning-best-practices',
      format: 'Developer documentation', level: 'Advanced', time: 'About 15 min', access: 'Free. No account needed.',
      adds: 'It explains how newer reasoning models are different. Some old prompt tricks no longer help.',
      take: ['Treat a reasoning model like a senior co-worker. Give it the goal, not every step.', 'You do not need to ask it to “think step by step”. This can sometimes make the answer worse.', 'Try without examples first. Say clearly what a good answer looks like.'],
      note: 'It is written for developers. Read only the part on how to prompt reasoning models. Skip the customer quotes and the cost tips.',
      tryit: 'In your next prompt, give the goal and say what a good answer looks like. Do not list every step.' },

    /* ---------- Section 2: Check before you trust ---------- */
    { id: 'unt', sec: 's2', lane: 'both', min: 15,
      title: 'Evaluating AI Outputs', org: 'University of North Texas Libraries', url: 'https://guides.library.unt.edu/c.php?g=1536486&p=11517576',
      format: 'Online guide with activities', level: 'Beginner', time: '10 to 15 min', access: 'Free. No account needed.',
      adds: 'This 15-minute guide corrects common wrong beliefs about AI answers.',
      take: ['Good writing does not prove that an answer is correct.', 'If you ask again, you get a different answer. It is not always a better answer.', 'Some AI tools search the web and some do not. Check which kind you are using.', 'Ask 6 questions. Is it accurate? Who is the authority? What is the proof? Is it biased? Is it relevant? What is checked and what is a guess?'],
      note: 'Some library links on the site are only for UNT students. The guide itself is open to everyone.',
      tryit: 'Ask the 6 questions about the first AI answer in Watch It Get It Wrong.' },
    { id: 'umd', sec: 's2', lane: 'both', min: 15,
      title: 'AI and Information Literacy', org: 'University of Maryland Libraries', url: 'https://lib.guides.umd.edu/AI',
      format: 'Online guide with short videos', level: 'Beginner to intermediate', time: 'About 15 min for the fact-checking page', access: 'Free. No account needed. Licensed CC BY-NC 4.0.',
      adds: 'It teaches lateral reading, a step-by-step way to check any AI answer. It also shows how to spot bias.',
      take: ['Break the answer into separate claims. Check each claim in other trusted sources.', 'If the AI tool names a source, open it. Check that it exists and says what the AI claims.', 'Ask what your question assumed. Ask what the AI tool assumed.', 'AI can leave out whole points of view. When asked about art history, it often gives only European art.'],
      note: 'The full guide takes 1 to 2 hours. The fact-checking page is enough to start.',
      tryit: 'Pick 1 claim from an AI answer. Find it in 2 other trusted sources.' },
    { id: 'usask', sec: 's2', lane: 'he', min: 15,
      title: 'Using AI: the ACCURATE-LE checklist', org: 'University of Saskatchewan Library', url: 'https://libguides.usask.ca/gen_ai/evaluating',
      format: 'Online checklist (web page)', level: 'Intermediate', time: 'About 15 min', access: 'Free. No account needed.',
      adds: 'It is a checklist you can print, for before, during and after you use AI. It also shows when and how to say that you used AI.',
      take: ['Check that links work. Check that the page says what the AI claims.', 'Remove names, addresses and birth dates before you paste anything into an AI tool.', 'Say clearly when and how you used AI. Check that you are allowed to use it for the task.', 'Check the answer against your task, so nothing important is missing.'],
      note: 'It is written for university students. Some parts cover research ethics and journal rules. A poster version to print is linked at the bottom of the page.',
      tryit: 'Print the checklist or save it on your phone. Use it on your next assignment where you use AI.' },
    { id: 'openai-responsible', sec: 's2', lane: 'both', min: 10,
      title: 'Responsible and safe use', org: 'OpenAI Academy (OpenAI)', url: 'https://openai.com/academy/responsible-and-safe-use/',
      format: 'Short guide', level: 'Beginner', time: 'About 10 min', access: 'Free. No account needed.',
      adds: 'It gives clear rules for using AI in a responsible way at your institute or workplace.',
      take: ['The AI rules of your institute or employer come first.', 'Check important facts again. Watch for bias in answers.', 'Ask a qualified expert before you act on health, legal or money advice.', 'Keep the chat link in case you must show how you used AI. Get permission before you share another person’s voice or data.'],
      tryit: 'Find the AI rules of your institute or workplace. Note 1 thing they allow and 1 thing they do not allow.' },

    /* ---------- Section 3: Keep information safe ---------- */
    { id: 'certin', sec: 's3', lane: 'both', min: 5,
      title: 'CERT-In advisory on AI applications', org: 'IndiaAI (Ministry of Electronics and IT, Government of India)', url: 'https://indiaai.gov.in/news/cert-in-issues-advisory-on-security-implications-to-minimize-threats-from-ai-applications',
      format: 'News summary', level: 'Beginner', time: 'About 5 min', access: 'Free. No account needed.',
      adds: 'CERT-In is India’s national cyber security agency. It explains how scammers misuse AI apps.',
      take: ['Fake websites and apps can pretend to be popular AI tools. They spread harmful software called malware.', 'AI tools can be used to collect people’s personal details from the internet without permission.', 'Check the website address and the app publisher before you use any AI tool.'],
      note: 'This advisory is from 2023. CERT-In has given newer AI advice since then. Ask your facilitator for the latest.',
      tryit: 'Before you install any AI app, check that the website address and the publisher are the official ones.' },
    { id: 'csa', sec: 's3', lane: 'both', min: 10,
      title: 'Safe and Secure Use of Generative AI for Individuals', org: 'Cyber Security Agency of Singapore and IMDA (government advisory)', url: 'https://www.imda.gov.sg/assets/ad9b8b71-35d0-4539-b3dd-15e8aa8781b2.pdf',
      format: 'Advisory (2-page PDF)', level: 'Beginner', time: 'About 10 min', access: 'Free. No account needed.',
      adds: 'It gives practical steps on what to keep out of AI tools. It also shows how to spot risky AI apps.',
      take: ['Even casual chats can show a lot about you over time. If an AI tool is hacked, this can be used for scams.', 'Keep out your full name, address, ID numbers, and money or medical records. Never enter workplace data without permission.', 'Be careful with unofficial AI apps and browser add-ons, mainly ones that ask for camera or location access they do not need.', 'Use AI to support your thinking, not to replace it.'],
      note: 'It is written for Singapore. When it talks about the NRIC, the national ID card, think of your Aadhaar number.',
      tryit: 'Write down 3 things you will never type into an AI tool.' },
    { id: 'stanford', sec: 's3', lane: 'both', min: 8,
      title: 'Be Careful What You Tell Your AI Chatbot', org: 'Stanford Institute for Human-Centered AI (HAI)', url: 'https://hai.stanford.edu/news/be-careful-what-you-tell-your-ai-chatbot',
      format: 'News article', level: 'Beginner to intermediate', time: 'About 8 min', access: 'Free. No account needed.',
      adds: 'It compares what 6 big AI companies do with your chats.',
      take: ['All 6 companies in the study use people’s chats to train their AI, unless people change the setting.', 'Some companies keep chats with no end date. Some let people read them.', 'Files you upload can be collected too.', 'Even a harmless question can show something private about you. An example is asking for heart-healthy recipes.'],
      note: 'It was published in October 2025 and looks at US companies. Their rules may have changed since then.',
      tryit: 'Open the settings of your AI tool. Check if your chats are used for training.' },

    /* ---------- Section 4: How AI works ---------- */
    { id: 'openai-models', sec: 's4', lane: 'both', min: 10,
      title: 'How ChatGPT and our foundation models are developed', org: 'OpenAI Help Center', url: 'https://help.openai.com/en/articles/7842364-how-chatgpt-and-our-foundation-models-are-developed',
      format: 'Help article', level: 'Beginner', time: 'About 10 min', access: 'Free. No account needed.',
      adds: 'It explains where an AI model gets its knowledge, and the steps to build it.',
      take: ['Models learn from public information on the internet. They also learn from partner organisations, and from users, trainers and researchers.', 'A model is built in stages: preparing the data, pre-training, post-training, and checks that go on after release.', 'It explains how to stop your chats being used to improve the models.'],
      note: 'OpenAI wrote this about its own models.',
      tryit: 'Find the setting that stops your chats being used to improve the model.' },
    { id: 'hallucinate', sec: 's4', lane: 'both', min: 10,
      title: 'Why language models hallucinate', org: 'OpenAI', url: 'https://openai.com/index/why-language-models-hallucinate/',
      format: 'Blog article', level: 'Intermediate', time: 'About 10 min', access: 'Free. No account needed.',
      adds: 'It explains why AI makes things up, with an example every student knows. This is the reason behind Watch It Get It Wrong.',
      take: ['A student may guess on a hard exam question. In the same way, AI guesses when it is not sure.', 'Training and tests reward a lucky guess more than an honest “I do not know”.', 'In training, the model sees only smooth, natural text. So false sentences can sound as natural as true ones.', 'AI can be built to say when it is not sure. But the problem is not fully solved.'],
      note: 'It was published in September 2025. Read the blog article. The research paper linked inside it is very technical.',
      tryit: 'Ask an AI tool something it cannot know, like your own timetable. See if it says that it does not know.' },
    { id: 'yuva', sec: 's4', lane: 'both', min: 270,
      title: 'YUVA AI for ALL', org: 'IndiaAI Mission, Ministry of Electronics and IT, Government of India', url: 'https://youtube.com/playlist?list=PL7GY38cluZJHAhoGmwP3ao3TXIZT5HwkU',
      format: 'Video course, 6 modules', level: 'Beginner', time: 'About 4.5 hours, in parts', access: 'Free. No account needed.',
      adds: 'It is a full tour of AI from the Government of India. It covers how AI works, its uses in study and work, ethics and safe use.',
      take: ['It is made for people with no technical background.', 'It covers what AI is, how it works, and how it is changing study and work.', 'One module is on using AI tools safely and responsibly, with Indian examples.'],
      note: 'Watch 1 module at a time. You do not need to finish it in one sitting.',
      tryit: 'Watch module 1. Note 1 Indian example of AI at work.' },
    { id: 'soar', sec: 's4', lane: 'iti', min: null,
      title: 'SOAR: Skilling for AI Readiness', org: 'Skill India Digital Hub (MSDE and NCVET, Government of India)', url: 'https://www.skillindiadigital.gov.in/',
      format: 'Online courses, self-paced', level: 'Beginner', time: 'Varies by course', access: 'Free. Needs a Skill India Digital account.',
      adds: 'These are government AI courses aligned to the NSQF, with AI for jobs and for work. They are a good next step for ITI learners.',
      take: ['The online courses are aligned to the NSQF. You learn at your own speed.', 'They cover basic AI skills, AI for jobs, getting more done at work, and uses in different sectors.', 'When you finish a course, you can get a digital certificate on Skill India Digital.'],
      note: 'Sign in and search for SOAR. Course names and lengths are different, so check them before you start.',
      tryit: 'Find 1 SOAR course that matches your trade or subject. Note how long it takes.' },
    { id: 'claude-capabilities', sec: 's4', lane: 'both', min: 210,
      title: 'AI capabilities and limitations', org: 'Anthropic Academy (Anthropic)', url: 'https://academy.claude.com/courses/ai-capabilities-and-limitations',
      format: 'Course', level: 'Beginner', time: 'About 3.5 hours', access: 'Free. Sign in only to save your progress.',
      adds: 'It explains why AI behaves the way it does. Then you can predict where it will go wrong.',
      take: ['AI writes one small piece of a word at a time. This is why it can sound right and still be wrong.', 'It shows what AI knows well, and why it is weaker on rare, recent or local topics.', 'It explains why a new chat forgets the last chat.', 'It shows how to tell which kind of strange answer you got, and how to fix it.'],
      tryit: 'After 1 lesson, guess where an AI answer might go wrong before you read it.' },
    { id: 'ai-fluency', sec: 's4', lane: 'both', min: 240, opt: true,
      title: 'AI Fluency: Framework and foundations', org: 'Anthropic Academy (Anthropic)', url: 'https://academy.claude.com/courses/ai-fluency-framework-foundations',
      format: 'Course, 14 lessons', level: 'Beginner to intermediate', time: 'About 4 hours', access: 'Free. Sign in only to save your progress.',
      adds: 'It gives you a way to decide which work to give to AI, and how to check that work.',
      take: ['It teaches 4 habits for working with AI: Delegation, Description, Discernment and Diligence.', 'It shows how to decide which tasks to give to AI and which to keep.', 'It shows how to take responsibility for work you did with AI, and how to be open about using it.'],
      note: 'Take this after the capabilities course if you want the bigger picture.',
      tryit: 'Pick 1 task. Decide if you will give it to AI, do it yourself, or share it.' },
    { id: 'tracing', sec: 's4', lane: 'both', min: 15, opt: true,
      title: 'Tracing the thoughts of a large language model', org: 'Anthropic (research)', url: 'https://www.anthropic.com/news/tracing-thoughts-language-model',
      format: 'Research article with video', level: 'Advanced', time: 'About 15 min', access: 'Free. No account needed.',
      adds: 'It shows what researchers see when they look inside an AI model while it works.',
      take: ['AI writes one word at a time, but it can plan ahead. For example, it picks a rhyming word before it writes a line of a poem.', 'When it gets a wrong hint, it sometimes builds a strong argument to agree with the user.', 'The reason an AI gives for its answer may not match how it really got the answer.'],
      note: 'The simple idea is still true: AI predicts likely text. This shows that the inside is more complex. Researchers can explain only a small part of it.',
      tryit: 'Ask an AI tool how it got an answer. Remember that its reason may not match what happened inside.' }
  ];

  var LANE_LABEL = { iti: 'Good for ITI', he: 'Good for college' };
  var STORE = 'fc-res-explored', NOTES = 'fc-res-notes';
  var SEGMENT = document.body.getAttribute('data-segment') || '';
  function load(k, f) { try { var v = localStorage.getItem(k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function $(id) { return document.getElementById(id); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function icon(id, cls) { var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('class', cls || 'ic'); s.setAttribute('aria-hidden', 'true'); var u = document.createElementNS('http://www.w3.org/2000/svg', 'use'); u.setAttribute('href', '#' + id); s.appendChild(u); return s; }
  function shortTime(r) { if (r.min == null) return 'Time varies'; if (r.min < 60) return r.min + ' min'; var h = r.min / 60; return (Math.round(h * 2) / 2) + ' hours'; }
  function shortAccess(r) { if (/Needs a ChatGPT account/.test(r.access)) return 'Free, needs a ChatGPT account'; if (/Needs a/.test(r.access)) return 'Free, needs an account'; if (/Sign in only/.test(r.access)) return 'Free, sign-in optional'; return 'Free, no account'; }
  /* AI Fluency designer assets (Oct 2026): a small ivory icon on the card's fact chips (decorative: the chip text says it) */
  function chipIcon(k) { var i = el('img', 'chip-ic'); i.src = 'assets/icons/ivory/icon-' + k + '.webp'; i.alt = ''; i.setAttribute('aria-hidden', 'true'); return i; }
  /* the format chip, from RES.format: [icon, short label] */
  function formatOf(r) {
    var f = r.format;
    if (/PDF/.test(f)) return ['pdf', 'PDF'];
    if (/^Video/.test(f)) return ['video', 'Video'];
    if (/developer/i.test(f)) return ['devdoc', 'Developer docs'];
    if (/course/i.test(f)) return ['course', 'Course'];
    if (/guide|checklist/i.test(f)) return ['guide', 'Guide'];
    return ['article', 'Article'];
  }
  function sfx(k) { try { if (window.SAA_SFX && SAA_SFX[k]) SAA_SFX[k](); } catch (e) {} }
  function byId(id) { return RES.filter(function (r) { return r.id === id; })[0]; }

  var explored = load(STORE, []); if (!Array.isArray(explored)) explored = [];
  var notes = load(NOTES, {}); if (!notes || typeof notes !== 'object') notes = {};

  /* ---------- screens ---------- */
  var screens = $$('.screen');
  var current = 0;
  var pos = document.querySelector('[data-pos]'), nextBtn = document.querySelector('[data-next]'), nextLabel = document.querySelector('[data-next-label]'), prevBtn = document.querySelector('[data-prev]');
  function notify(ev) { try { window.parent.postMessage({ source: 'swift-ai-academy', segment: SEGMENT, event: ev }, '*'); } catch (e) {} }
  function render() {
    screens.forEach(function (s, i) { s.hidden = i !== current; });
    pos.textContent = (current + 1) + ' of ' + screens.length;
    nextLabel.textContent = current === screens.length - 1 ? (document.body.getAttribute('data-finish-label') || 'Done') : 'Continue';
    prevBtn.hidden = current === 0;
  }
  function go(i) {
    if (i < 0 || i >= screens.length) return;
    current = i; render();
    window.scrollTo(0, 0);
    var h = screens[i].querySelector('h1');
    if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) {} }
  }
  /* the layer's kits block this click (capture) while screen 1's rules are not all open */
  nextBtn.addEventListener('click', function () {
    if (current === screens.length - 1) { notify('complete'); return; }
    go(current + 1);
  });
  prevBtn.addEventListener('click', function () { go(current - 1); });
  function screenOf(id) { var c = $('res-' + id); return c ? screens.indexOf(c.closest('.screen')) : -1; }

  /* ---------- resource cards (right column) and their Key points pop-ups ---------- */
  var host = $('details-host'), drawer = $('toolkit');
  function card(r) {
    var a = el('article', 'res'); a.id = 'res-' + r.id; a.setAttribute('data-url', r.url);
    var main = el('div', 'res-main');
    var fm = formatOf(r), h2 = el('h2', 'res-h');
    var fi = el('span', 'res-fmt'); fi.title = fm[1]; fi.appendChild(chipIcon('res-' + fm[0])); fi.appendChild(el('span', 'sr-only', fm[1] + ': ')); h2.appendChild(fi);
    h2.appendChild(document.createTextNode(r.title)); main.appendChild(h2);
    main.appendChild(el('span', 'by', r.org));
    var facts = el('div', 'facts');
    facts.appendChild(el('span', '', shortTime(r)));
    facts.appendChild(el('span', '', shortAccess(r)));
    if (r.lane !== 'both') { var lc = el('span', 'tag-lane'); lc.appendChild(chipIcon(r.lane === 'iti' ? 'lane-iti' : 'lane-college-cap')); lc.appendChild(document.createTextNode(LANE_LABEL[r.lane])); facts.appendChild(lc); }
    if (r.opt) facts.appendChild(el('span', 'tag-opt', 'Optional extra'));
    var pk = el('span', 'tag-pick', 'Picked for you'); pk.hidden = true; facts.appendChild(pk);
    var sn = el('span', 'tag-seen'); sn.appendChild(icon('i-check')); sn.appendChild(document.createTextNode('Opened')); facts.appendChild(sn);
    main.appendChild(facts);
    main.appendChild(el('p', 'why', r.adds));
    a.appendChild(main);
    var btns = el('div', 'res-btns');
    var kb = el('button', 'kp-btn'); kb.type = 'button'; kb.setAttribute('aria-haspopup', 'dialog');
    kb.appendChild(icon('i-list')); kb.appendChild(document.createTextNode('Key points'));
    kb.appendChild(el('span', 'sr-only', ' for ' + r.title));
    kb.addEventListener('click', function () { openKP(r, kb); });
    btns.appendChild(kb);
    btns.appendChild(openLink(r, 'Open'));
    a.appendChild(btns);
    return a;
  }
  function openLink(r, label) {
    var l = el('a', 'open-link'); l.href = r.url; l.target = '_blank'; l.rel = 'noopener noreferrer';
    l.appendChild(document.createTextNode(label)); l.appendChild(icon('i-ext')); l.appendChild(el('span', 'sr-only', ' ' + r.title + ' (opens in a new tab)'));
    l.addEventListener('click', function () { markExplored(r.id); });
    return l;
  }
  function popup(r) {
    var d = el('div', 'kp'); d.id = 'kp-' + r.id; d.hidden = true;
    d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'kp-' + r.id + '-h');
    d.setAttribute('data-saa-say-open', '');      /* the layer reads the key points aloud when the learner opens them */
    var p = el('div', 'kp-panel'); p.setAttribute('data-url', r.url);
    var head = el('div', 'kp-head');
    var ht = el('div', 'saa-vo-skip');
    ht.appendChild(el('p', 'kp-eb', 'Key points'));
    var h = el('h2', '', r.title); h.id = 'kp-' + r.id + '-h'; ht.appendChild(h);
    ht.appendChild(el('p', 'kp-by', r.org));
    head.appendChild(ht);
    var x = el('button', 'icon-btn kp-x'); x.type = 'button'; x.setAttribute('aria-label', 'Close key points'); x.appendChild(icon('i-x'));
    x.addEventListener('click', closeKP); head.appendChild(x);
    p.appendChild(head);
    var meta = el('ul', 'kp-meta saa-vo-skip');
    [['Format', r.format], ['Level', r.level], ['Time', r.time], ['Access', r.access]].forEach(function (m) { var li = el('li'); li.appendChild(el('span', 'k', m[0])); li.appendChild(el('span', '', m[1])); meta.appendChild(li); });
    p.appendChild(meta);
    p.appendChild(el('p', 'kp-h saa-vo-skip', 'What you will learn'));
    var ul = el('ul', 'kp-take'); r.take.forEach(function (t) { ul.appendChild(el('li', '', t)); }); p.appendChild(ul);
    var tr = el('div', 'callout task'); tr.appendChild(icon('i-spark')); var trd = el('div'); trd.appendChild(el('b', '', 'Try it now.')); trd.appendChild(document.createTextNode(' ' + r.tryit)); tr.appendChild(trd); p.appendChild(tr);
    if (r.note) { var nt = el('div', 'callout warn'); nt.appendChild(icon(r.warn ? 'i-alert' : 'i-info')); var ntd = el('div'); ntd.appendChild(el('b', '', 'Good to know.')); ntd.appendChild(document.createTextNode(' ' + r.note)); nt.appendChild(ntd); p.appendChild(nt); }
    /* the note: 1 thing I will try (optional, saved to My AI toolkit) */
    var nf = el('div', 'note-field');
    var lab = el('label'); lab.htmlFor = 'note-' + r.id; lab.appendChild(document.createTextNode('1 thing I will try')); lab.appendChild(el('span', '', 'optional, saved to My AI toolkit'));
    var inp = el('input'); inp.type = 'text'; inp.id = 'note-' + r.id; inp.maxLength = 200; inp.autocomplete = 'off';
    inp.placeholder = 'For example: ' + r.tryit.charAt(0).toLowerCase() + r.tryit.slice(1, 56) + (r.tryit.length > 56 ? '…' : '');
    inp.value = notes[r.id] || '';
    var sv = el('span', 'saved'); sv.setAttribute('role', 'status');
    var tmr = 0;
    inp.addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(function () { saveNote(r, inp, sv); }, 400); });
    inp.addEventListener('change', function () { clearTimeout(tmr); saveNote(r, inp, sv); });
    nf.appendChild(lab); nf.appendChild(inp); nf.appendChild(sv);
    p.appendChild(nf);
    var act = el('div', 'kp-actions saa-vo-skip');
    act.appendChild(openLink(r, 'Open the resource'));
    var c = el('button', 'btn btn-ghost'); c.type = 'button'; c.textContent = 'Close'; c.addEventListener('click', closeKP); act.appendChild(c);
    p.appendChild(act);
    d.appendChild(p);
    d.addEventListener('click', function (e) { if (e.target === d) closeKP(); });
    d.addEventListener('keydown', function (e) { trap(e, d, closeKP); });
    return d;
  }
  /* a note is kept only when it has real words: at least 3 letters in any script (Hindi and Gujarati too), not only emoji or symbols */
  function realWords(v) { var m = v.match(/[\p{L}\p{M}]/gu); return !!m && m.length >= 3; }
  function saveNote(r, inp, sv) {
    var v = inp.value.trim();
    if (!v) { delete notes[r.id]; sv.textContent = ''; sv.className = 'saved'; }
    else if (!realWords(v)) { delete notes[r.id]; sv.textContent = 'Not saved yet. Write a few words about what you will try.'; sv.className = 'saved no'; }
    else { notes[r.id] = v; sv.textContent = 'Saved to My AI toolkit.'; sv.className = 'saved'; }
    save(NOTES, notes); paintToolkit();
  }
  var openPop = null, lastFocus = null;
  function openKP(r, from) {
    closeKP(true);
    var d = $('kp-' + r.id); lastFocus = from || document.activeElement;
    d.hidden = false; openPop = d; document.body.classList.add('kp-open');
    var x = d.querySelector('.kp-x'); if (x) x.focus();
    markExplored(r.id);
  }
  function closeKP(quiet) {
    if (!openPop) return;
    openPop.hidden = true; openPop = null; document.body.classList.remove('kp-open');
    if (quiet !== true && lastFocus) { try { lastFocus.focus(); } catch (e) {} }
  }
  function trap(e, box, close) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    var f = $$('button:not([disabled]), a[href], input', box).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    /* move focus ourselves, in the same order in every browser, and wrap at the ends */
    e.preventDefault();
    var i = f.indexOf(document.activeElement);
    f[(i < 0 ? 0 : i + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
  }

  /* focus never leaves an open pop-up or the toolkit drawer (Safari skips buttons on Tab, so the Tab trap alone is not enough) */
  document.addEventListener('focusin', function (e) {
    var box = openPop || (!drawer.hidden ? drawer : null);
    if (!box || box.contains(e.target)) return;
    var f = $$('button:not([disabled]), a[href], input', box).filter(function (x) { return x.offsetParent !== null; })[0];
    if (f) f.focus();
  });

  $$('.res-list[data-res]').forEach(function (list) {
    list.getAttribute('data-res').split(/\s+/).forEach(function (id) { var r = byId(id); if (!r) return; list.appendChild(card(r)); host.appendChild(popup(r)); });
  });

  /* ---------- screen 8: the "See example" pop-up (same pattern as Key points) ---------- */
  $$('[data-fc-example]').forEach(function (b) {
    var d = $(b.getAttribute('data-fc-example')); if (!d) return;
    b.addEventListener('click', function () {
      closeKP(true); lastFocus = b;
      d.hidden = false; openPop = d; document.body.classList.add('kp-open');
      var x = d.querySelector('.kp-x'); if (x) x.focus();
    });
  });
  $$('.fc-ex').forEach(function (d) {
    $$('[data-fc-close]', d).forEach(function (c) { c.addEventListener('click', closeKP); });
    d.addEventListener('click', function (e) { if (e.target === d) closeKP(); });
    d.addEventListener('keydown', function (e) { trap(e, d, closeKP); });
  });

  /* the diagrams under the lead text open larger in a pop-up. They become buttons only after the layer has split
     the screen (a control inside the lead text would move it to the right-hand side). */
  window.addEventListener('load', function () {
    var d = $('ex-fig'), big = $('ex-fig-img'); if (!d || !big) return;
    $$('.fc-fig img').forEach(function (im) {
      im.setAttribute('role', 'button'); im.tabIndex = 0; im.title = 'Tap to see it larger';
      function show() { closeKP(true); lastFocus = im; big.src = im.src; big.alt = im.alt; d.hidden = false; openPop = d; document.body.classList.add('kp-open'); var x = d.querySelector('.kp-x'); if (x) x.focus(); }
      im.addEventListener('click', show);
      im.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } });
    });
  });

  /* ---------- opened cards ---------- */
  function paintExplored() {
    RES.forEach(function (r) { var c = $('res-' + r.id); if (c) c.classList.toggle('is-seen', explored.indexOf(r.id) > -1); });
    var n = RES.filter(function (r) { return explored.indexOf(r.id) > -1; }).length;
    $('tk-count').textContent = 'You opened ' + n + ' of ' + RES.length + ' links.';
    return n;
  }
  function markExplored(id) { if (explored.indexOf(id) > -1) return; explored.push(id); save(STORE, explored); if (paintExplored() === RES.length) sfx('correct'); }
  paintExplored();

  /* ---------- start-here picker ---------- */
  var answers = {};
  $$('#router [data-q]').forEach(function (group) {
    $$('.chip', group).forEach(function (b) {
      b.addEventListener('click', function () {
        answers[group.dataset.q] = b.dataset.v;
        $$('.chip', group).forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
        $('router-status').textContent = '';
      });
    });
  });
  function pick() {
    var limit = Number(answers.time), ln = answers.lane;
    var inSec = RES.filter(function (r) { return r.sec === answers.goal && (r.lane === 'both' || r.lane === ln); });
    var fits = function (r) { return r.min == null ? limit >= 999 : r.min <= limit; };
    var chosen = inSec.filter(function (r) { return !r.opt && fits(r); });
    if (chosen.length < 2) chosen = chosen.concat(inSec.filter(function (r) { return r.opt && fits(r); }));
    if (limit >= 999) chosen.sort(function (a, b) { return (b.min || 300) - (a.min || 300); });
    if (ln === 'iti') chosen.sort(function (a, b) { return (b.lane === 'iti') - (a.lane === 'iti'); });
    if (!chosen.length) chosen = inSec.slice().sort(function (a, b) { return (a.min || 999) - (b.min || 999); }).slice(0, 1);
    return chosen.slice(0, 3);
  }
  $('show-picks').addEventListener('click', function () {
    var miss = ['goal', 'time', 'lane'].filter(function (k) { return !answers[k]; });
    if (miss.length) { $('router-status').textContent = 'Answer all 3 questions first.'; sfx('wrong'); return; }
    var picks = pick();
    $$('.res').forEach(function (c) { c.classList.remove('picked'); c.querySelector('.tag-pick').hidden = true; });
    var box = $('picks'); box.innerHTML = '';
    box.appendChild(el('p', 'ph', 'Picked for you. Start with ' + (picks.length > 1 ? 'these ' + picks.length + ' links.' : 'this link.')));
    picks.forEach(function (r, i) {
      var c = $('res-' + r.id); c.classList.add('picked'); c.querySelector('.tag-pick').hidden = false;
      var b = el('button', 'pick-go'); b.type = 'button';
      b.appendChild(el('span', 'num', String(i + 1)));
      var t = el('span', 'pt'); t.appendChild(el('b', '', r.title)); t.appendChild(el('small', '', shortTime(r) + ' · ' + r.org.split(' (')[0].split(',')[0])); b.appendChild(t);
      var g = el('span', 'go'); g.appendChild(document.createTextNode('Go to it')); g.appendChild(icon('i-arrow')); b.appendChild(g);
      b.addEventListener('click', function () { go(screenOf(r.id)); var k = c.querySelector('.kp-btn'); if (k) try { k.focus({ preventScroll: true }); } catch (e) {} });
      box.appendChild(b);
    });
    var again = el('button', 'btn btn-ghost pick-again'); again.type = 'button'; again.textContent = 'Change my answers';
    again.addEventListener('click', function () { $('router').classList.remove('showing'); box.hidden = true; var f = document.querySelector('#router [data-q] .chip[aria-checked="true"]') || document.querySelector('#router .chip'); if (f) f.focus(); });
    box.appendChild(again);
    /* the picks take the place of the questions, so the screen still fits */
    $('router').classList.add('showing');
    box.hidden = false; sfx('correct');
    var fp = box.querySelector('.pick-go'); if (fp) try { fp.focus({ preventScroll: true }); } catch (e) {}
  });

  /* ---------- My AI toolkit: the header drawer and the last screen ---------- */
  function paintToolkit() {
    var ids = RES.filter(function (r) { return notes[r.id]; });
    $$('[data-toolkit-list]').forEach(function (list) {
      list.innerHTML = '';
      ids.forEach(function (r) { var li = el('li'); li.appendChild(el('small', '', r.title)); li.appendChild(document.createTextNode(notes[r.id])); list.appendChild(li); });
    });
    $$('[data-toolkit-empty]').forEach(function (e) { e.hidden = ids.length > 0; });
    $$('[data-toolkit-download], [data-toolkit-clear]').forEach(function (b) { b.disabled = !ids.length; });
    $('toolkit-n').textContent = ids.length;
  }
  paintToolkit();
  var drawerFrom = null;
  function openDrawer() { closeKP(true); drawerFrom = document.activeElement; drawer.hidden = false; $('toolkit-close').focus(); }
  function closeDrawer() { drawer.hidden = true; if (drawerFrom) try { drawerFrom.focus(); } catch (e) {} }
  $('toolkit-open').addEventListener('click', openDrawer);
  $('toolkit-close').addEventListener('click', closeDrawer);
  drawer.addEventListener('click', function (e) { if (e.target === drawer) closeDrawer(); });
  drawer.addEventListener('keydown', function (e) { trap(e, drawer, closeDrawer); });
  $$('[data-toolkit-download]').forEach(function (b) {
    b.addEventListener('click', function () {
      var lines = ['My AI toolkit', 'Resources: First Contact', ''];
      RES.forEach(function (r) { if (notes[r.id]) { lines.push('- ' + r.title + ': ' + notes[r.id]); lines.push('  ' + r.url); } });
      var url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/plain' }));
      var a = document.createElement('a'); a.href = url; a.download = 'my-ai-toolkit.txt'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 8000);
    });
  });
  $$('[data-toolkit-clear]').forEach(function (b) {
    b.addEventListener('click', function () {
      notes = {}; save(NOTES, notes);
      $$('.note-field input').forEach(function (i) { i.value = ''; });
      $$('.saved').forEach(function (s) { s.textContent = ''; s.className = 'saved'; });
      paintToolkit();
      if (!drawer.hidden) $('toolkit-close').focus();
    });
  });

  render();
})();
