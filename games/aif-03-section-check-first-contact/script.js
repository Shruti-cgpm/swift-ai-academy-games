/* ====================================================================
   AAI-E-MC1-S01-EVAL01  Section Check - First Contact
   Item bank: 20 items = 10 concept slots x 2 parallel forms (A, B).
   Each attempt shows 10 items from one form; forms alternate by attempt.
   Pass = 7 of 10 (70%). Unlimited attempts. Feedback after every answer.
   Mapped PC range on every item: "PC 1.1 to 1.5" (workbook text; no PC
   definitions invented). Non-compensatory: not flagged in workbook.
   Language: English only in this build (Gujarati pending).
   All names, notes and AI outputs are fictional demonstration data.
   ==================================================================== */
const SCHEMA = 'AAI-E-MC1-S01-EVAL01';
const PC = 'PC 1.1 to 1.5';
const PASS = 7, TOTAL = 10;

const GLOSS = {
  'AI tool': 'A computer program that writes or answers when you type a request.',
  'approved': 'Allowed by your institute or college for you to use.',
  'account': 'Your own login for a tool. Only you should use it.',
  'personal details': 'Facts about a person, like phone number, address, ID number, health or password.',
  'confidential': 'Private. Only certain people are allowed to see it.',
  'syllabus': 'The official list of topics for your course.'
};

const CONCEPTS = {
  tool:   {name:'Use the right tool and account', review:'Set-up lab (LAB01)', look:'Look again at the set-up lab.'},
  task:   {name:'Start with a small task', review:'First Contact video (VID02)', look:'Look again at the First Contact video.'},
  privacy:{name:'Keep private details out', review:'Set-up lab (LAB01), privacy step', look:'Look again at the privacy step of the set-up lab.'},
  check:  {name:'Check before you use it', review:'First Contact video (VID02), checking part', look:'Look again at the checking part of the First Contact video.'}
};

/* type: mcq | spot | order. diff: E/M/H. recall: direct-recall item flag. */
const ITEMS = [
 // Slot 1  approved tool  (scenario, easy)
 {slot:1,form:'A',lane:'ITI',type:'mcq',diff:'E',recall:false,concept:'tool',
  stem:'Ravi is an ITI trainee. His institute has given trainees one {approved} {AI tool}. A friend sends Ravi a link to a different free AI app.',
  ask:'Ravi wants help to write a workshop inventory list. What should he do?',
  options:[
   {t:'Use the approved tool with his own institute account.',ok:true},
   {t:'Use the friend\u2019s app, because it is free.',why:'Free does not mean allowed. The institute has not approved this app.'},
   {t:'Use both apps and keep the longer answer.',why:'A longer answer is not always better. The second app is still not approved.'},
   {t:'Use the friend\u2019s app, but sign up with a new email.',why:'A new email does not make the app approved.'}],
  explain:'Your institute has checked the approved tool. Using it with your own account keeps your work safe and allowed.'},
 {slot:1,form:'B',lane:'HE',type:'mcq',diff:'E',recall:false,concept:'tool',
  stem:'Meera is a first-year college student. Her college has {approved} one {AI tool} for students. A classmate says another website gives faster answers.',
  ask:'Meera wants help to plan her study week. What should she do?',
  options:[
   {t:'Use the college-approved tool with her own student account.',ok:true},
   {t:'Try the faster website once, then decide.',why:'Even one try sends her request to a tool the college has not approved.'},
   {t:'Use the faster website, but only for study plans.',why:'The type of task does not change the rule. Use the approved tool.'},
   {t:'Ask the classmate to type her request on his account.',why:'Use your own permitted account, not someone else\u2019s.'}],
  explain:'Use the tool your college approved, with your own account. Speed is not the reason to choose a tool.'},

 // Slot 2  AI is a helper  (direct recall, easy)
 {slot:2,form:'A',lane:'Both',type:'mcq',diff:'E',recall:true,concept:'task',
  stem:'', ask:'Which sentence about an {AI tool} is true?',
  options:[
   {t:'It can help with a task, but you must check what it gives you.',ok:true},
   {t:'It knows the correct answer to every question.',why:'AI tools make mistakes. An answer can sound sure and still be wrong.'},
   {t:'It means you do not need your trainer or teacher.',why:'AI does not replace your trainer, your teacher or your own skill. It only helps.'},
   {t:'Only people who are good with computers can use it.',why:'You do not need special computer skills. You can start with a small, simple task.'}],
  explain:'An AI tool is a helper. You stay in charge of the work.'},
 {slot:2,form:'B',lane:'Both',type:'mcq',diff:'E',recall:true,concept:'task',
  stem:'', ask:'What is the best way to think about an {AI tool} when you start?',
  options:[
   {t:'As a helper for small tasks. You still decide and check.',ok:true},
   {t:'As an expert whose answers are final.',why:'AI answers are not final. You decide what to keep and what to fix.'},
   {t:'As a tool only for technical experts.',why:'Anyone can start with a small, everyday task. No technical skill is needed.'},
   {t:'As a way to finish work without reading it.',why:'You must always read and check what AI gives you.'}],
  explain:'Think of AI as a practical helper. You decide, and you check.'},

 // Slot 3  safe first setup  (scenario, medium)
 {slot:3,form:'A',lane:'HE',type:'mcq',diff:'M',recall:false,concept:'tool',
  stem:'Sameer used the {approved} {AI tool} for the first time on a shared computer in the college lab. He has finished his work.',
  ask:'What should Sameer do next?',
  options:[
   {t:'Sign out of his account before he leaves.',ok:true},
   {t:'Stay signed in, so it is faster next time.',why:'The next person on this computer could open his account.'},
   {t:'Save his password in the browser for next time.',why:'A saved password on a shared computer lets other people sign in as him.'},
   {t:'Close only the tab. The account will sign out by itself.',why:'Closing a tab often does not sign you out. Use the sign-out option.'}],
  explain:'On a shared computer, always sign out. This protects your account and your work.'},
 {slot:3,form:'B',lane:'ITI',type:'mcq',diff:'M',recall:false,concept:'tool',
  stem:'Aditi is an ITI trainee in the fitter trade. She is setting up the {approved} {AI tool} for the first time. It shows an optional box: \u201cTell us about yourself.\u201d',
  ask:'What should Aditi do?',
  options:[
   {t:'Leave it empty, or write only something general like \u201cITI trainee\u201d.',ok:true},
   {t:'Write her full name, date of birth and batch number, so answers fit her.',why:'The tool does not need these details to help with simple tasks.'},
   {t:'Skip set-up and use a classmate\u2019s account that is ready.',why:'Use your own permitted account, not a classmate\u2019s.'},
   {t:'Add her phone number, in case she forgets her login.',why:'Never put your phone number into an AI tool. Ask your institute for login help.'}],
  explain:'Optional means you can skip it. If you write anything, keep it general. Keep {personal details} out.'},

 // Slot 4  choose a small routine task  (scenario, easy)
 {slot:4,form:'A',lane:'ITI',type:'mcq',diff:'E',recall:false,concept:'task',
  stem:'Joseph is an ITI trainee. He is trying the {approved} {AI tool} for the first time.',
  ask:'Which task is a good one to start with?',
  options:[
   {t:'Turn his rough notes into a neat checklist for tomorrow\u2019s practical.',ok:true},
   {t:'Decide if a machine is safe to use after a repair.',why:'Safety decisions need your instructor and proper trade checks. Do not leave them to AI.'},
   {t:'Write his record book entry and submit it without reading it.',why:'Never submit AI work without reading and checking it.'},
   {t:'Work out the marks for the whole batch.',why:'Marks are private records. Do not put them into an AI tool.'}],
  explain:'Start small and ordinary. A checklist from your own notes is easy to check.'},
 {slot:4,form:'B',lane:'HE',type:'mcq',diff:'E',recall:false,concept:'task',
  stem:'Neha is a first-year student. She is trying the {approved} {AI tool} for the first time.',
  ask:'Which task is a good one to start with?',
  options:[
   {t:'Make a simple five-day study plan from her own list of topics.',ok:true},
   {t:'Write her full assignment and submit it without reading it.',why:'Never submit AI work without reading and checking it.'},
   {t:'Write a leave letter that includes her health details.',why:'Health information is personal. Do not put it into an AI tool.'},
   {t:'Check her classmates\u2019 answers and give them marks.',why:'Marking is the teacher\u2019s job, and classmates\u2019 work is not hers to share.'}],
  explain:'Start small and ordinary. A study plan from your own topics is easy to check.'},

 // Slot 5  identify the problem in a request  (identify-the-problem, medium)
 {slot:5,form:'A',lane:'HE',type:'mcq',diff:'M',recall:false,concept:'privacy',
  stem:'Pooja types this request into the approved AI tool:',
  quote:'Write a polite email to my class group. Remind them to send the event notes by Friday. My college login password is ________ so you can send it for me.',
  ask:'What is the problem with this request?',
  options:[
   {t:'It shares her password. A password must never go into an AI tool.',ok:true},
   {t:'It is too short to get a useful email.',why:'The request is clear enough. Length is not the problem.'},
   {t:'It should not ask for a polite email.',why:'Asking for a polite tone is helpful. That part is fine.'},
   {t:'It should not say the deadline.',why:'The deadline is needed in the email. That part is fine.'}],
  explain:'Give the tool only what the task needs. A password is never needed. Keep it private.'},
 {slot:5,form:'B',lane:'ITI',type:'mcq',diff:'M',recall:false,concept:'privacy',
  stem:'Karan types this request into the approved AI tool:',
  quote:'Write a short reminder for my batch about Friday\u2019s welding practical. Tell them to bring safety goggles and record books. My Aadhaar number is ____________ for reference.',
  ask:'What is the problem with this request?',
  options:[
   {t:'It includes his Aadhaar number, which the tool does not need.',ok:true},
   {t:'It is too short to get a useful reminder.',why:'The request is clear enough. Length is not the problem.'},
   {t:'It should not mention safety goggles.',why:'Safety items are useful in a reminder. That part is fine.'},
   {t:'It should not say which day the practical is.',why:'The day is needed for the reminder. That part is fine.'}],
  explain:'Give the tool only what the task needs. ID numbers are {personal details}. Keep them out.'},

 // Slot 6  safe vs unsafe information  (scenario, medium)
 {slot:6,form:'A',lane:'ITI',type:'mcq',diff:'M',recall:false,concept:'privacy',
  stem:'Nikhil wants the AI tool to help him write a tool issue list for the workshop.',
  ask:'Which detail is safe to type in?',
  options:[
   {t:'\u201cTwo drill bits are broken. One vernier caliper is missing.\u201d',ok:true},
   {t:'The names and phone numbers of trainees who used the tools.',why:'Other people\u2019s names and phone numbers are personal details. Keep them out.'},
   {t:'The lock code for the store room.',why:'Lock codes are {confidential}. They must stay private.'},
   {t:'A photo of the instructor\u2019s attendance register.',why:'Attendance registers are institute records. Do not share them.'}],
  explain:'Share only what the task needs. Here, that is the tools and their problems.'},
 {slot:6,form:'B',lane:'HE',type:'mcq',diff:'M',recall:false,concept:'privacy',
  stem:'Fatima wants the AI tool to help her make a project checklist.',
  ask:'Which detail is safe to type in?',
  options:[
   {t:'The list of project tasks and the due date.',ok:true},
   {t:'Her group members\u2019 marks from the last test.',why:'Marks are private records. Keep them out.'},
   {t:'Her student ID and password.',why:'IDs and passwords are personal details. Never type them into an AI tool.'},
   {t:'A college budget file marked \u201cConfidential\u201d.',why:'Confidential files must not go into an AI tool.'}],
  explain:'Share only what the task needs. Here, that is the tasks and the due date.'},

 // Slot 7  spot the error in an AI output  (error spotting, hard)
 {slot:7,form:'A',lane:'HE',type:'spot',diff:'H',recall:false,concept:'check',
  stem:'Riya asked the AI tool to write a message from her notes.',
  ask:'Compare the AI answer with her notes. Which line has a mistake?',
  notes:'Science club meeting: Thursday, 4 pm, Room 12. Bring project drafts.',
  options:[
   {t:'The science club will meet this Tuesday.',ok:true},
   {t:'The meeting starts at 4 pm.',why:'This line matches the notes: 4 pm.'},
   {t:'It will be in Room 12.',why:'This line matches the notes: Room 12.'},
   {t:'Please bring your project drafts.',why:'This line matches the notes: project drafts.'}],
  explain:'The notes say Thursday. The AI wrote Tuesday. AI can change small details, so check days, times and places.'},
 {slot:7,form:'B',lane:'ITI',type:'spot',diff:'H',recall:false,concept:'check',
  stem:'Harish asked the AI tool to write a reminder from his notes.',
  ask:'Compare the AI answer with his notes. Which line has a mistake?',
  notes:'Fitter practical: Monday, 9 am, Workshop 2. Bring files and record book.',
  options:[
   {t:'The fitter practical is on Monday.',why:'This line matches the notes: Monday.'},
   {t:'It starts at 9 am.',why:'This line matches the notes: 9 am.'},
   {t:'Please come to Workshop 4.',ok:true},
   {t:'Bring your files and record book.',why:'This line matches the notes: files and record book.'}],
  explain:'The notes say Workshop 2. The AI wrote Workshop 4. AI can change small details, so check days, times and places.'},

 // Slot 8  ordering the safe workflow  (ordering, medium)
 {slot:8,form:'A',lane:'ITI',type:'order',diff:'M',recall:false,concept:'check',
  stem:'Harpreet wants AI help to make a tool issue list for the instructor.',
  ask:'In what order should Harpreet do these steps?',
  steps:['Open the approved AI tool with the institute account.',
         'Ask for a neat list. Give only the tool names and problems.',
         'Read the list and compare it with the workshop notes.',
         'Fix any mistakes. Then give it to the instructor.'],
  explain:'Use the approved tool, ask with only the details needed, check, and only then use it.'},
 {slot:8,form:'B',lane:'HE',type:'order',diff:'M',recall:false,concept:'check',
  stem:'Sneha wants AI help to write an email to her class group about a college event.',
  ask:'In what order should Sneha do these steps?',
  steps:['Open the approved AI tool with the college account.',
         'Ask for a short email. Give only the event details.',
         'Check the date, time and place against the notice.',
         'Correct the draft. Then send it.'],
  explain:'Use the approved tool, ask with only the details needed, check, and only then send.'},

 // Slot 9  next best action after output  (next-best-action, hard)
 {slot:9,form:'A',lane:'HE',type:'mcq',diff:'H',recall:false,concept:'check',
  stem:'The AI tool gives Divya a study plan. One topic in the plan is not in her {syllabus}.',
  ask:'What should Divya do?',
  options:[
   {t:'Change or remove that topic using her syllabus. Then use the plan.',ok:true},
   {t:'Follow the plan. The AI may know the syllabus better.',why:'Her syllabus is the source to trust. The AI does not know her course.'},
   {t:'Delete the whole plan and stop using AI.',why:'One mistake does not make the whole plan useless. Fix it, then use it.'},
   {t:'Add more topics so the plan looks complete.',why:'More topics do not fix the wrong one. Check against the syllabus.'}],
  explain:'Check the answer against a trusted source, fix what is wrong, then use it.'},
 {slot:9,form:'B',lane:'ITI',type:'mcq',diff:'H',recall:false,concept:'check',
  stem:'The AI tool gives Imran a neat inventory list for the workshop. It looks good. His instructor needs it in 10 minutes.',
  ask:'What should Imran do?',
  options:[
   {t:'Quickly compare the list with his own count. Then send it.',ok:true},
   {t:'Send it now, because it looks neat.',why:'Neat does not mean correct. A quick check can catch a wrong number.'},
   {t:'Ask the AI tool \u201cIs this correct?\u201d and send it if it says yes.',why:'The AI cannot check against his count. Only Imran can.'},
   {t:'Send it, and tell the instructor that AI made it.',why:'Saying AI made it does not fix mistakes. Check it first.'}],
  explain:'Even when time is short, check the answer against your own information before you use it.'},

 // Slot 10  checking habit  (direct recall, easy)
 {slot:10,form:'A',lane:'Both',type:'mcq',diff:'E',recall:true,concept:'check',
  stem:'', ask:'Before you copy, send or act on an AI answer, what should you do?',
  options:[
   {t:'Read it and check it against your notes or what you know.',ok:true},
   {t:'Trust it if it sounds confident.',why:'AI can sound confident and still be wrong.'},
   {t:'Check only the spelling.',why:'Spelling matters, but names, dates and facts can also be wrong.'},
   {t:'Ask a friend to send it for you.',why:'Someone else sending it does not check it. You must read it first.'}],
  explain:'Always read and check an AI answer before you use it.'},
 {slot:10,form:'B',lane:'Both',type:'mcq',diff:'E',recall:true,concept:'check',
  stem:'', ask:'Which sentence about AI answers is true?',
  options:[
   {t:'An AI answer can sound correct and still be wrong.',ok:true},
   {t:'A long answer is always a correct answer.',why:'Length does not show correctness. Long answers can have mistakes too.'},
   {t:'Answers from an approved tool never have mistakes.',why:'Approved means allowed to use. It does not mean always correct.'},
   {t:'Only the numbers in an AI answer need checking.',why:'Names, dates, places and facts can also be wrong.'}],
  explain:'Every AI answer needs checking, even from an approved tool.'}
];
ITEMS.forEach(it=>{ it.id = SCHEMA+'-Q'+String(it.slot).padStart(2,'0')+it.form; it.pc = PC; it.lang='EN'; });

/* ====================================================================
   Learner app (Swift AI Academy frame, Oct 2026 upgrade)
   Screens: cover, how it works, the 10 questions, result.
   The footer owns Back, the "n / N" count and the one amber button.
   Scoring, pass mark, forms, item order and feedback content are unchanged.
   ==================================================================== */
const $ = s=>document.querySelector(s);
const pop=$('#pop'), live=$('#live');
const esc = s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const plain = s=>String(s||'').replace(/[{}]/g,'');
/* dotted glossary words: a span (not a button) so the narrator reads them as part of the sentence */
const rich = s=>esc(s||'').replace(/\{([^}]+)\}/g,(m,w)=>{
  const key = Object.keys(GLOSS).find(k=>k.toLowerCase()===w.toLowerCase());
  return key ? `<span class="term" role="button" tabindex="0" data-term="${esc(key)}" aria-label="${esc(w)}, show meaning">${esc(w)}</span>` : esc(w);
});
const shuffle = a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const ICON = {
  check:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  x:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>',
  info:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/></svg>',
  book:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5.5c2.5-1 5-1 7.5.5v13c-2.5-1.5-5-1.5-7.5-.5zM19.5 5.5c-2.5-1-5-1-7.5.5v13c2.5-1.5 5-1.5 7.5-.5z"/></svg>',
  undo:'<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7L5 11l4 4"/><path d="M5 11h9a5 5 0 0 1 0 10h-2"/></svg>'
};
const store = {
  get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v);}catch(e){return d;}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
};
const KEY = 'aaie-mc1-s01-eval01';
const sfx = ok=>{ try{ if(window.SAA_SFX){ ok?SAA_SFX.correct():SAA_SFX.wrong(); } }catch(e){} };

/* ---------- light / dark: icons and kits follow the page theme ---------- */
const isLight = ()=>document.documentElement.getAttribute('data-theme')==='light';
function paintTheme(){
  const t = isLight()?'light':'dark';
  document.querySelectorAll('img[src^="assets/icons/"]').forEach(im=>{
    const want = im.getAttribute('src').replace(/assets\/icons\/(dark|light)\//,'assets/icons/'+t+'/');
    if(want!==im.getAttribute('src')) im.setAttribute('src',want);
  });
  document.querySelectorAll('.saa-kit').forEach(k=>{ if(t==='light') k.setAttribute('data-theme','light'); else k.removeAttribute('data-theme'); });
}
window.addEventListener('saa:theme',paintTheme);

/* ---------- state ---------- */
let S = {attempts:store.get(KEY+':attempts',0), passedEver:store.get(KEY+':passed',false), queue:[], i:0, results:[], form:'A', page:'intro'};
let snaps = [];          /* each checked question as it looked after Check (Back shows it again, read-only) */
let Q = null;            /* the question on screen: {it, picked, order, checked} */
let dirty = false;       /* an attempt has answers that are not finished */

function buildQueue(form){
  const pick = slot=>ITEMS.find(x=>x.slot===slot && x.form===form);
  // clusters keep difficulty equivalent; order inside each cluster is random
  const order = [...shuffle([2,1]), 4, ...shuffle([3,6,5]), ...shuffle([8,7,9]), 10];
  return order.map(pick);
}

/* ---------- glossary popover ---------- */
function showPop(t){
  const k=t.dataset.term; pop.innerHTML=`<b>${esc(k)}</b>${esc(GLOSS[k])}`; pop.hidden=false;
  const r=t.getBoundingClientRect(), pw=pop.offsetWidth, ph=pop.offsetHeight;
  let x=Math.min(Math.max(10,r.left), innerWidth-pw-10), y=r.bottom+8;
  if(y+ph>innerHeight-10) y=r.top-ph-8;
  pop.style.left=x+'px'; pop.style.top=y+'px';
  live.textContent = k+': '+GLOSS[k];
}
document.addEventListener('click',e=>{
  const t = e.target.closest && e.target.closest('.term');
  if(t){ e.preventDefault(); e.stopPropagation(); showPop(t); return; }
  if(!e.target.closest || !e.target.closest('#pop')) pop.hidden=true;
},true);
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') pop.hidden=true;
  const t = e.target.closest && e.target.closest('.term');
  if(t && (e.key==='Enter'||e.key===' ')){ e.preventDefault(); e.stopPropagation(); showPop(t); }
},true);
window.addEventListener('resize',()=>{pop.hidden=true;});

/* ---------- frame: pages, footer ---------- */
const PAGES = ['intro','how','quiz','result'];
const back=$('#back'), primary=$('#primary'), counter=$('#counter');
let onPrimary = null, onBack = null;
function go(name){
  S.page=name; pop.hidden=true;
  PAGES.forEach(p=>{ const el=$('#p-'+p); const on=p===name; el.classList.toggle('active',on); el.hidden=!on; });
  if(name==='intro') enterIntro(); else if(name==='how') enterHow(); else if(name==='quiz') enterQuiz(); else enterResult();
  const h=$('#p-'+name+' h1, #p-'+name+' h2');
  if(h){ try{h.focus({preventScroll:true});}catch(e){} }
  const st=$('#stage'); if(st) st.scrollTop=0;
}
function lockPrimary(on){
  primary.classList.toggle('is-locked',!!on);
  if(on) primary.setAttribute('aria-disabled','true'); else if(!primary.classList.contains('saa-locked')) primary.removeAttribute('aria-disabled');
}
function setPrimary(label, fn, locked){
  primary.textContent=label; onPrimary=fn; lockPrimary(locked);
}
function setBack(fn){ onBack=fn; back.hidden=!fn; }
function setCount(n,tot){ counter.textContent=n+' / '+tot; }
primary.addEventListener('click',()=>{ if(onPrimary) onPrimary(); });
back.addEventListener('click',()=>{ if(onBack) onBack(); });

/* ---------- 1. cover ---------- */
function enterIntro(){
  setCount(1,4); setBack(null);
  setPrimary('Next',()=>go('how'));
}

/* ---------- 2. how it works ---------- */
function enterHow(){
  setCount(2,4); setBack(()=>go('intro'));
  const inAttempt = S.queue.length && S.results.length < TOTAL && S.inQ;
  const ag=$('#again');
  if(S.attempts>0 && !inAttempt){ ag.hidden=false; ag.textContent='This is try '+(S.attempts+1)+'. You will see new examples this time.'; } else ag.hidden=true;
  setPrimary(inAttempt?'Back to the check':'Start the check',()=>{ if(inAttempt) go('quiz'); else start(); });
}

function start(){
  S.attempts++; store.set(KEY+':attempts',S.attempts);
  S.form = (S.attempts % 2 === 1) ? 'A' : 'B';
  S.queue = buildQueue(S.form); S.i=0; S.results=[]; S.inQ=true; snaps=[];
  go('quiz');
}

/* ---------- 3. questions ---------- */
const qcard=$('#qcard');
const TASK = {mcq:'Choose one answer, then press Check answer.', spot:'Tap the line with the mistake, then press Check answer.', order:'Tap the steps in the right order, then press Check answer.'};
const EYEBROW = {mcq:'Quick check', spot:'Find the mistake', order:'Put in order'};
const NEED = {mcq:'Choose one answer first.', spot:'Tap one line of the AI answer first.', order:'Tap all 4 steps first.'};
/* the spoken feedback line (one clip per text; narrate.js reads .saa-k-why) */
function fbText(it, ok, k){
  if(ok) return 'Yes. '+plain(it.explain);
  if(it.type==='order') return 'Not quite. '+plain(it.explain);
  return 'Not quite. '+plain(it.options[k].why);
}

function enterQuiz(){
  if(!S.queue.length){ start(); return; }
  if(snaps[S.i]) showSnap(S.i); else question();
}
function chrome(){
  setCount(S.i+1,TOTAL);
  setBack(()=>{ if(S.i>0 && snaps[S.i-1]){ S.i--; showSnap(S.i); } else go('how'); });
}
function question(){
  const it = S.queue[S.i];
  Q = {it, picked:-1, order:[], checked:false};
  let work='';
  if(it.type==='mcq' || it.type==='spot'){
    const opts = it.type==='spot' ? it.options.map((o,k)=>({...o,k})) : shuffle(it.options.map((o,k)=>({...o,k})));
    work = `
      ${it.type==='spot'?'<span class="tag" aria-hidden="true">AI answer</span>':''}
      <fieldset class="opts${it.type==='spot'?' ai-lines':''}" id="opts">
        <legend class="sr">${it.type==='spot'?'AI answer. Choose the line with a mistake.':'Choose one answer.'}</legend>
        ${opts.map((o,n)=>`<label class="opt" data-k="${o.k}">
            <input type="radio" name="a" value="${o.k}">
            ${it.type==='spot'?`<span class="ln" aria-hidden="true">${n+1}</span>`:''}
            <span class="mark" aria-hidden="true"></span><span class="ot">${rich(o.t)}</span></label>`).join('')}
      </fieldset>`;
  } else {
    let sh; do { sh = shuffle(it.steps.map((t,k)=>({t,k}))); } while(sh.every((s,n)=>s.k===n));
    work = `
      <div class="opts" id="opts" role="group" aria-label="Steps. Tap them in order.">
        ${sh.map(s=>`<button type="button" class="opt ostep" data-k="${s.k}" aria-label="${esc(s.t)}. Not placed."><span class="num" aria-hidden="true"></span><span class="ot">${esc(s.t)}</span></button>`).join('')}
      </div>
      <div><button type="button" class="reset" id="reset" disabled>${ICON.undo}Start over</button></div>`;
  }
  qcard.innerHTML = `
    <div class="saa-lead q-left" data-saa-lead>
      <p class="eyebrow">${EYEBROW[it.type]}</p>
      ${it.stem?`<p class="q-scene">${rich(it.stem)}</p>`:''}
      <h2 class="q-ask" id="qask" tabindex="-1">${rich(it.ask)}</h2>
      ${it.quote?`<div class="quote"><span class="tag">Example request</span><p>${esc(it.quote)}</p></div>`:''}
      ${it.notes?`<div class="notes"><span class="tag">Example notes</span><p>${esc(it.notes)}</p></div>`:''}
      <p class="do saa-do"><b class="saa-do-label">Your task.</b> ${TASK[it.type]}</p>
    </div>
    <div class="saa-work q-right">
      ${work}
      <div class="q-fb" id="qfb"><p class="saa-k-why q-why" id="qwhy" aria-live="polite"></p><div class="q-more" id="qmore"><p class="q-hint">${ICON.info}<span>You see the reason here after you press Check answer.</span></p></div></div>
    </div>`;
  qcard.setAttribute('data-saa-locked','');
  chrome();
  if(it.type==='order'){
    const steps=[...qcard.querySelectorAll('.ostep')];
    const sync=()=>{
      steps.forEach(b=>{const p=Q.order.indexOf(+b.dataset.k);b.classList.toggle('placed',p>-1);b.querySelector('.num').textContent=p>-1?p+1:'';
        b.setAttribute('aria-label',b.querySelector('.ot').textContent+(p>-1?'. Placed as step '+(p+1)+'.':'. Not placed.'));});
      $('#reset').disabled=!Q.order.length; ready(Q.order.length===it.steps.length);
    };
    steps.forEach(b=>b.onclick=()=>{ if(Q.checked)return; const k=+b.dataset.k,p=Q.order.indexOf(k);
      if(p>-1) Q.order.splice(p,1); else Q.order.push(k); sync(); live.textContent=p>-1?'Removed.':'Step '+Q.order.length+' placed.'; });
    $('#reset').onclick=()=>{Q.order=[];sync();};
  } else {
    qcard.querySelectorAll('input[name=a]').forEach(r=>r.onchange=()=>{
      if(Q.checked) return;
      qcard.querySelectorAll('.opt').forEach(l=>l.classList.toggle('sel',l.contains(r)&&r.checked));
      Q.picked=+r.value; ready(true);
    });
  }
  ready(false);
  setPrimary('Check answer',check,true);
  const h=$('#qask'); if(h){ try{h.focus({preventScroll:true});}catch(e){} }
}
/* Check answer stays pressable while locked (dimmed, aria-disabled): pressing it says what is missing */
function ready(on){
  if(on) qcard.removeAttribute('data-saa-locked'); else qcard.setAttribute('data-saa-locked','');
  primary.classList.remove('saa-locked'); lockPrimary(!on);
  if(on){ const w=$('#qwhy'); if(w && w.dataset.need){ w.textContent=''; delete w.dataset.need; } }
}
function check(){
  const it=Q.it;
  if(Q.checked) return;
  const done = it.type==='order' ? Q.order.length===it.steps.length : Q.picked>-1;
  if(!done){
    const w=$('#qwhy'); w.className='saa-k-why q-why need'; w.dataset.need='1'; w.textContent=NEED[it.type];
    const o=$('#opts'); o.classList.remove('saa-shake'); void o.offsetWidth; o.classList.add('saa-shake');
    return;
  }
  grade();
}
function grade(){
  const it=Q.it; Q.checked=true;
  let ok;
  if(it.type==='order'){
    ok = Q.order.every((k,n)=>k===n);
    /* show the right order: the list is redrawn 1 to 4; green = you put it in the right place, red = you did not */
    const box=$('#opts');
    box.innerHTML = it.steps.map((t,k)=>{ const right=Q.order[k]===k;
      return `<div class="opt ostep locked ${right?'right':'wrong'}"><span class="num" aria-hidden="true">${k+1}</span><span class="ot">${esc(t)}</span><span class="mark" aria-hidden="true">${right?ICON.check:ICON.x}</span></div>`; }).join('');
    box.setAttribute('aria-label','The right order.');
    $('#reset').parentNode.remove();
  } else {
    ok = !!it.options[Q.picked].ok;
    qcard.querySelectorAll('.opt').forEach(l=>{
      const k=+l.dataset.k; l.classList.add('locked'); l.querySelector('input').disabled=true; l.classList.remove('sel');
      const m=l.querySelector('.mark');
      if(it.options[k].ok){l.classList.add('right');m.innerHTML=ICON.check;}
      else if(k===Q.picked){l.classList.add('wrong');m.innerHTML=ICON.x;}
      else l.classList.add('dim');
    });
  }
  S.results.push({slot:it.slot,id:it.id,concept:it.concept,ok});
  qcard.removeAttribute('data-saa-locked'); primary.classList.remove('saa-locked'); lockPrimary(false);
  const w=$('#qwhy'); delete w.dataset.need;
  w.className='saa-k-why q-why '+(ok?'ok':'bad');
  const more=$('#qmore');
  if(ok) more.innerHTML='';
  else if(it.type==='order') more.innerHTML=`<p class="q-right-ans">The list now shows the right order.</p>`;
  else more.innerHTML=`<p class="q-right-ans"><b>Right answer:</b> ${rich(it.options.find(o=>o.ok).t)}</p><p class="q-explain">${rich(it.explain)}</p>`;
  w.innerHTML = '<b>'+(ok?'Yes.':'Not quite.')+'</b> '+rich(fbText(it,ok,Q.picked).replace(/^(Yes|Not quite)\.\s*/,''));
  /* the spoken text must be exactly fbText(): rich() keeps the words, only {braces} become dotted words */
  sfx(ok);
  $('#qfb').classList.add('on');
  const last = S.i===TOTAL-1;
  setPrimary(last?'See my result':'Next question',next);
  snaps[S.i]=qcard.innerHTML;
  if(innerWidth<=700){ const f=$('#qfb'); setTimeout(()=>{ try{f.scrollIntoView({block:'nearest',behavior:'smooth'});}catch(e){} },60); }
}
function next(){
  S.i++;
  if(S.i<TOTAL){ if(snaps[S.i]) showSnap(S.i); else question(); }
  else { S.inQ=false; go('result'); }
}
function showSnap(i){
  S.i=i; Q={it:S.queue[i],checked:true};
  qcard.innerHTML=snaps[i]; qcard.removeAttribute('data-saa-locked'); primary.classList.remove('saa-locked'); lockPrimary(false);
  chrome();
  setPrimary(i===TOTAL-1?(S.results.length===TOTAL?'See my result':'See my result'):'Next question',next);
  const h=$('#qask'); if(h){ try{h.focus({preventScroll:true});}catch(e){} }
}

/* ---------- 4. result ---------- */
function enterResult(){
  setCount(4,4); setBack(null);
  if(S.results.length<TOTAL){ go(S.queue.length?'quiz':'how'); return; }
  const score = S.results.filter(r=>r.ok).length, passed = score>=PASS;
  if(passed){ S.passedEver=true; store.set(KEY+':passed',true); }
  $('#rh').textContent = passed?'You passed the First Contact check.':'You have not passed yet.';
  $('#rmsg').textContent = passed?'Well done. You can now go to the next part of the course.':'Look at the topics with a book sign. Then try again with new examples.';
  $('#rscore').innerHTML = `You got <b>${score} of ${TOTAL}</b> right. You need ${PASS} to pass.`;
  $('#concepts').innerHTML = Object.entries(CONCEPTS).map(([k,c])=>{
    const rs=S.results.filter(r=>r.concept===k), good=rs.filter(r=>r.ok).length, all=good===rs.length;
    return `<li class="${all?'ok':'no'}"><span class="ci" aria-hidden="true">${all?ICON.check:ICON.book}</span>
      <span class="cn">${esc(c.name)}${all?'':`<small>${esc(c.look)}</small>`}</span>
      <span class="st">${good} of ${rs.length}</span></li>`;
  }).join('');
  $('#saved').hidden=true;
  const payload = {source:SCHEMA, attempt:S.attempts, form:S.form, score, total:TOTAL, passMark:PASS, passed, items:S.results.map(r=>({id:r.id,correct:r.ok}))};
  if(!S.posted){ S.posted=true; try{ window.parent && window.parent!==window && window.parent.postMessage(payload,'*'); }catch(e){} }
  const rt=$('#retake');
  rt.hidden=!passed; rt.onclick=again;
  if(passed) setPrimary('Continue',()=>{ const s=$('#saved'); s.hidden=false; s.textContent='Your result is saved. You can go to the next part of the course.'; try{window.parent!==window && window.parent.postMessage({...payload,action:'continue'},'*');}catch(e){} });
  else setPrimary('Try again',again);
  live.textContent = 'You got '+score+' of '+TOTAL+'. '+(passed?'You passed.':'You need '+PASS+' to pass.');
}
/* a new try: the old attempt is finished, so it is cleared; the next form is used */
function again(){ S.queue=[]; S.results=[]; S.i=0; S.inQ=false; S.posted=false; snaps=[]; go('how'); }

/* ---------- reviewer view: open with #review (staff only, never linked from the learner view) ---------- */
function review(){
  document.body.classList.add('scroll');
  $('#app').style.display='none';
  const counts = f=>{const xs=ITEMS.filter(i=>i.form===f);return {E:xs.filter(i=>i.diff==='E').length,M:xs.filter(i=>i.diff==='M').length,H:xs.filter(i=>i.diff==='H').length,R:xs.filter(i=>i.recall).length,ITI:xs.filter(i=>i.lane==='ITI').length,HE:xs.filter(i=>i.lane==='HE').length};};
  const a=counts('A'), b=counts('B');
  const fmt={mcq:'Scenario / next-best-action MCQ',spot:'Error spotting',order:'Ordering'};
  const answer = it=> it.type==='order' ? it.steps.map((s,n)=>(n+1)+'. '+s).join('<br>') : esc(plain(it.options.find(o=>o.ok).t));
  const distr = it=> it.type==='order' ? 'Any other order (all-or-nothing scoring). Steps shuffled; never shown already in order.' : it.options.filter(o=>!o.ok).map(o=>'• '+esc(plain(o.t))+' <em>'+esc(plain(o.why))+'</em>').join('<br>');
  const wrap = document.createElement('div'); wrap.className='rv'; wrap.setAttribute('data-saa-keep','');
  wrap.innerHTML = `
   <p class="mono">${SCHEMA} | Reviewer copy | v0.2</p>
   <h1>Section Check: First Contact. Item bank and blueprint</h1>
   <p><a href="#" id="toLearner">Open learner view</a></p>
   <h2>Blueprint</h2>
   <ul>
    <li>Bank: 20 items = 10 concept slots x 2 parallel forms (A, B). Each attempt shows 10 items from one form. Odd attempts use Form A, even attempts Form B, so every retry shows different examples.</li>
    <li>Order: clusters fixed (start, task, privacy and setup, checking, closing recall); items shuffled inside each cluster; MCQ options shuffled each attempt.</li>
    <li>Pass mark: ${PASS} of ${TOTAL} (70 percent). Unlimited attempts. Feedback after every answer; wrong answers show why-not, the right answer and a short explanation; the result screen names the asset to revisit per concept.</li>
    <li>Mapped performance criteria on every item: <b>${PC}</b> (workbook text). No item-level PC split is claimed.</li>
    <li>Non-compensatory status: not flagged in workbook. No must-pass items are enforced.</li>
    <li>Form A: ${a.E} easy, ${a.M} medium, ${a.H} hard; ${a.R} recall (${a.R*10}%); ${a.ITI} ITI, ${a.HE} HE, ${10-a.ITI-a.HE} both. Form B: ${b.E} easy, ${b.M} medium, ${b.H} hard; ${b.R} recall (${b.R*10}%); ${b.ITI} ITI, ${b.HE} HE, ${10-b.ITI-b.HE} both.</li>
    <li>Language: English (ESL-adapted, short sentences, glossary tap-words, Narakeet narration in Indian English). Gujarati versions not yet produced.</li>
    <li>LMS result: on finish the page posts {source, attempt, form, score, total, passMark, passed, items[]} to the parent window.</li>
   </ul>
   <h2>Items</h2>
   <div class="wrap"><table>
    <thead><tr><th class="mono">Item ID</th><th>Form</th><th>Concept</th><th>Format</th><th>Diff.</th><th>Lane</th><th>Recall</th><th class="mono">PC range</th><th>Stem</th><th>Correct answer</th><th>Rationale</th><th>Distractor rationale</th><th>Language</th></tr></thead>
    <tbody>${ITEMS.slice().sort((x,y)=>x.slot-y.slot||x.form.localeCompare(y.form)).map(it=>`<tr>
      <td class="mono">${it.id}</td><td>${it.form}</td><td>${esc(CONCEPTS[it.concept].name)}</td><td>${fmt[it.type]}</td><td>${it.diff}</td><td>${it.lane}</td><td>${it.recall?'Yes':'No'}</td><td class="mono">${PC}</td>
      <td>${esc(plain(it.stem))} ${it.quote?'<br><em>Request: '+esc(it.quote)+'</em>':''}${it.notes?'<br><em>Notes: '+esc(it.notes)+'</em>':''}<br><b>${esc(plain(it.ask))}</b></td>
      <td>${answer(it)}</td><td>${esc(plain(it.explain))}</td><td>${distr(it)}</td><td>EN (GU pending)</td></tr>`).join('')}</tbody>
   </table></div>
   <h2>Change log</h2>
   <ul><li>v0.1 (07 Oct 2026): first English learner build and reviewer copy. Gujarati, LMS package format and post-pilot item analysis pending.</li>
   <li>v0.2 (09 Oct 2026): Swift AI Academy frame (dark and light), narration, ESL screen standard. Items, answers, scoring and pass mark unchanged.</li></ul>`;
  document.body.appendChild(wrap);
  wrap.querySelector('#toLearner').onclick=e=>{e.preventDefault();location.hash='';location.reload();};
  /* the layer's start screen is for learners: not over the reviewer copy */
  const off=()=>{ const s=document.getElementById('saa-start'); if(s) s.remove(); };
  document.addEventListener('DOMContentLoaded',()=>setTimeout(off,0)); setTimeout(off,300);
}

if(location.hash==='#review') review();
else { paintTheme(); go('intro'); document.addEventListener('DOMContentLoaded',paintTheme); }
