(function(){
"use strict";

/* ---------- icons ---------- */
const I={
 check:'<svg class="i" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 x:'<svg class="i" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 copy:'<svg class="i" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
 down:'<svg class="i" viewBox="0 0 24 24"><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/></svg>',
 wifi:'<svg class="i" viewBox="0 0 24 24"><path d="M4 9.5a12 12 0 0 1 16 0M7 13a7.5 7.5 0 0 1 10 0M10 16.5a3 3 0 0 1 4 0M12 20h.01"/></svg>',
 off:'<svg class="i" viewBox="0 0 24 24"><path d="M3 3l18 18M8.5 5.3A12 12 0 0 1 20 9.5M4 9.5a12 12 0 0 1 2.2-1.6M7 13a7.5 7.5 0 0 1 3.6-1.9M10 16.5a3 3 0 0 1 4 0M12 20h.01"/></svg>',
 users:'<svg class="i" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.3A6.5 6.5 0 0 1 21.5 20"/></svg>',
 key:'<svg class="i" viewBox="0 0 24 24"><circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l2.5 2.5M14 9l2 2"/></svg>',
 lock:'<svg class="i" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
 search:'<svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
 flag:'<svg class="i" viewBox="0 0 24 24"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
 eye:'<svg class="i" viewBox="0 0 24 24"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>',
 arrow:'<svg class="i" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>'
};
/* ---------- Game 3 designer assets (Oct 2026): pictures only, no new narrated words ---------- */
/* dark theme (default) uses the designer's dark twins in assets/dark/ */
const DK=()=>document.documentElement.getAttribute("data-theme")!=="light";
const ICO=(n,c)=>`<img class="ga-ic ${c||""}" src="assets/${DK()?"dark":"icons"}/icon-${n}.webp" alt="" aria-hidden="true">`;
const HELP_IC=["help-get","help-self","help-notallowed"];
/* every sort item gets an icon (safe and private alike), so an icon never gives the answer away */
const SORT_IC={iti:["safe-tools","private-aadhaar","safe-topic","private-phone","private-marks"],he:["safe-topic","private-password","safe-notes","private-address","private-marks"]};
const PRIV_IC=[["private-password"],["private-aadhaar","private-phone","private-address"],["private-marks","private-health"],["private-records"]];
const SETUP_ALT=["Example screen: the institute's approved list, with an Open tool button for the approved assistant.",
 "Example screen: signing in to the approved assistant with a name and a hidden password.",
 "Example screen: a language menu with English and Gujarati.",
 "Example screen: the learner sends Hello and the assistant replies."];
const ANIM_ALT="Animation: copy the prompt, paste it into the AI tool and send it, then copy the first lines of the answer and paste them into your log.";
const reduceMotion=()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}};

/* ---------- the ten card prompts (verbatim from AAI-E-MC1-S01-CARD01) ---------- */
const PROMPTS=[
 {g:0,en:{t:"Understanding a topic before class",p:"Explain [topic name] in simple terms, as if to a first-year student, using one everyday example. Keep it to 150 words."},
      gu:{t:"ક્લાસ પહેલાં વિષય સમજવો",p:"[વિષયનું નામ] સરળ ભાષામાં સમજાવો, જાણે પહેલા વર્ષના વિદ્યાર્થીને સમજાવતા હો, અને રોજિંદા જીવનનું એક ઉદાહરણ આપો. જવાબ 150 શબ્દોમાં રાખો."}},
 {g:0,en:{t:"Turning class notes into revision points",p:"Turn these notes into 5 short revision points I can read before a test: [paste your notes here]."},
      gu:{t:"ક્લાસની નોંધોમાંથી રિવિઝન પોઇન્ટ",p:"આ નોંધોને 5 ટૂંકા રિવિઝન પોઇન્ટમાં ફેરવો, જે હું ટેસ્ટ પહેલાં વાંચી શકું: [તમારી નોંધો અહીં પેસ્ટ કરો]."}},
 {g:0,en:{t:"Structuring an assignment",p:"I have an assignment due on [date] about [topic]. Suggest a simple structure with headings, and one question to answer under each heading."},
      gu:{t:"અસાઇનમેન્ટનું માળખું",p:"મારે [તારીખ] સુધીમાં [વિષય] પર એક અસાઇનમેન્ટ આપવાનું છે. હેડિંગ સાથે એક સરળ માળખું સૂચવો, અને દરેક હેડિંગ નીચે જવાબ આપવા માટે એક પ્રશ્ન આપો."}},
 {g:1,en:{t:"Practical-session reminder",p:"Write a short reminder for my batch about [practical session, e.g. tool return]. No more than 3 lines, in plain language."},
      gu:{t:"પ્રેક્ટિકલ સેશનનું રિમાઇન્ડર",p:"મારી બેચ માટે [પ્રેક્ટિકલ સેશન, જેમ કે ટૂલ પરત કરવા] વિશે એક ટૂંકું રિમાઇન્ડર લખો. વધુમાં વધુ 3 લીટી, સરળ ભાષામાં."}},
 {g:1,en:{t:"Workshop inventory notes",p:"Here is my workshop inventory list. Point out anything that looks missing or unclear, and suggest a simple format to record it: [paste your list]."},
      gu:{t:"વર્કશોપ ઇન્વેન્ટરીની નોંધ",p:"આ મારી વર્કશોપની ઇન્વેન્ટરી યાદી છે. જે કંઈ ખૂટતું કે અસ્પષ્ટ લાગે તે બતાવો, અને તેને નોંધવા માટે એક સરળ ફોર્મેટ સૂચવો: [તમારી યાદી પેસ્ટ કરો]."}},
 {g:1,en:{t:"Writing a campus email",p:"Draft a polite email to my [facilitator / faculty title] asking for [a short extension / a clarification] on [assignment name]. Keep it under 80 words."},
      gu:{t:"કેમ્પસ ઇમેઇલ લખવો",p:"મારા [ફેસિલિટેટર / ફેકલ્ટીનું પદ]ને [અસાઇનમેન્ટનું નામ] માટે [થોડો વધુ સમય / સ્પષ્ટતા] માગતો એક નમ્ર ઇમેઇલ લખો. 80 શબ્દોથી ઓછો રાખો."}},
 {g:1,en:{t:"Planning a project checklist",p:"Make a checklist for my project on [project topic], from first draft to submission on [date]. No more than 8 items."},
      gu:{t:"પ્રોજેક્ટ ચેકલિસ્ટ",p:"[પ્રોજેક્ટનો વિષય] પરના મારા પ્રોજેક્ટ માટે, પહેલા ડ્રાફ્ટથી [તારીખ]ના સબમિશન સુધીની ચેકલિસ્ટ બનાવો. વધુમાં વધુ 8 મુદ્દા."}},
 {g:2,en:{t:"Planning a study or practice week",p:"Suggest a simple one-week plan to practise [subject or skill], with one rest day and no more than one hour a day."},
      gu:{t:"અભ્યાસ કે પ્રેક્ટિસનું અઠવાડિયું",p:"[વિષય કે કૌશલ્ય]ની પ્રેક્ટિસ માટે એક અઠવાડિયાનો સરળ પ્લાન સૂચવો, જેમાં એક દિવસ આરામ હોય અને રોજ એક કલાકથી વધુ ન હોય."}},
 {g:2,en:{t:"Planning a small event",p:"Turn these notes into a short checklist for [event, e.g. a study group meet-up]: [paste your notes]."},
      gu:{t:"નાનો કાર્યક્રમ ગોઠવવો",p:"આ નોંધોને [કાર્યક્રમ, જેમ કે સ્ટડી ગ્રુપની મીટિંગ] માટે ટૂંકી ચેકલિસ્ટમાં ફેરવો: [તમારી નોંધો પેસ્ટ કરો]."}},
 {g:2,en:{t:"Summarising something quickly",p:"Summarise this in 3 plain-English bullet points: [paste any short text]."},
      gu:{t:"ઝડપથી સાર કાઢવો",p:"આને 3 સરળ બુલેટ પોઇન્ટમાં ટૂંકમાં સમજાવો: [કોઈ પણ ટૂંકું લખાણ પેસ્ટ કરો]."}}
];

/* ---------- lane content (only context changes; the task stays the same) ---------- */
const LANE={
 iti:{
  en:{
   q:"How do I get ready for my basic electricity theory test next week?",
   worked:[
    "Explain Ohm's law in simple terms, as if to a first-year student, using one everyday example. Keep it to 150 words.",
    "Turn these notes into 5 short revision points I can read before a test: V = I × R; voltage is in volts; current is in amperes; resistance is in ohms; more resistance means less current.",
    "I have an assignment due on 12 October about series and parallel circuits. Suggest a simple structure with headings, and one question to answer under each heading."],
   hint5:"Write a short practice list yourself, like the tools you need for revision. Do not paste your institute's stock register.",
   sort:[["The list of tools I need for my practical",1,"This is general. It does not say who you are."],
         ["My Aadhaar number, to help fill a form",0,"Never put an Aadhaar number into an AI tool."],
         ["Topics from my basic electricity class",1,"Class topics are not personal."],
         ["My friend's phone number",0,"Phone numbers are private, and this one is not even yours."],
         ["My marks from the record book",0,"Marks are private records. Do not put them into an AI tool."]],
   spot:{prompt:"Write a short reminder for my batch about returning tools to the store by 4 pm on Friday. No more than 3 lines, in plain language.",
    lines:["Reminder: please return all tools to the tool store by 4 pm on Friday.","Check each tool against the issue list before you hand it in.","Anyone who returns tools late will lose 10 marks in the practical."],hit:2,
    yes:"Yes. Nobody gave this rule, so the AI made it up. Check any rule with your instructor before you send a message like this.",
    no:"Not quite. This line matches what the prompt asked for. Look for the line the AI added by itself."}
  },
  gu:{
   q:"આવતા અઠવાડિયે મારી બેઝિક ઇલેક્ટ્રિસિટી થિયરી ટેસ્ટની તૈયારી કેવી રીતે કરું?",
   worked:[
    "ઓહ્મનો નિયમ સરળ ભાષામાં સમજાવો, જાણે પહેલા વર્ષના વિદ્યાર્થીને સમજાવતા હો, અને રોજિંદા જીવનનું એક ઉદાહરણ આપો. જવાબ 150 શબ્દોમાં રાખો.",
    "આ નોંધોને 5 ટૂંકા રિવિઝન પોઇન્ટમાં ફેરવો, જે હું ટેસ્ટ પહેલાં વાંચી શકું: V = I × R; વોલ્ટેજ વોલ્ટમાં માપાય; કરંટ એમ્પિયરમાં માપાય; રેઝિસ્ટન્સ ઓહ્મમાં માપાય; રેઝિસ્ટન્સ વધે તો કરંટ ઘટે.",
    "મારે 12 ઓક્ટોબર સુધીમાં સિરીઝ અને પેરેલલ સર્કિટ પર એક અસાઇનમેન્ટ આપવાનું છે. હેડિંગ સાથે એક સરળ માળખું સૂચવો, અને દરેક હેડિંગ નીચે જવાબ આપવા માટે એક પ્રશ્ન આપો."],
   hint5:"જાતે એક નાની પ્રેક્ટિસ યાદી લખો, જેમ કે રિવિઝન માટે જોઈતી વસ્તુઓ. સંસ્થાનું સ્ટોક રજિસ્ટર પેસ્ટ ન કરો.",
   sort:[["મારા પ્રેક્ટિકલ માટે જોઈતાં ટૂલની યાદી",1,"આ સામાન્ય માહિતી છે. તે તમારી ઓળખ નથી બતાવતી."],
         ["ફોર્મ ભરવા માટે મારો આધાર નંબર",0,"આધાર નંબર ક્યારેય AI ટૂલમાં ન લખો."],
         ["બેઝિક ઇલેક્ટ્રિસિટીના ક્લાસના વિષયો",1,"ક્લાસના વિષયો અંગત નથી."],
         ["મારા મિત્રનો ફોન નંબર",0,"ફોન નંબર ખાનગી છે, અને આ તો તમારો પણ નથી."],
         ["રેકોર્ડ બુકમાંથી મારા માર્ક્સ",0,"માર્ક્સ ખાનગી રેકોર્ડ છે. તેને બહાર રાખો."]],
   spot:{prompt:"મારી બેચ માટે શુક્રવારે સાંજે 4 વાગ્યા સુધીમાં ટૂલ સ્ટોરમાં ટૂલ પરત કરવા વિશે ટૂંકું રિમાઇન્ડર લખો. વધુમાં વધુ 3 લીટી, સરળ ભાષામાં.",
    lines:["રિમાઇન્ડર: શુક્રવારે સાંજે 4 વાગ્યા સુધીમાં બધાં ટૂલ ટૂલ સ્ટોરમાં પરત કરો.","ટૂલ આપતાં પહેલાં દરેક ટૂલ ઇશ્યૂ લિસ્ટ સાથે મેળવી લો.","જે મોડું ટૂલ પરત કરશે તેના પ્રેક્ટિકલમાં 10 માર્ક્સ કપાશે."],hit:2,
    yes:"સાચું. આ નિયમ કોઈએ આપ્યો નહોતો. AI એ જાતે બનાવી દીધો. આવો મેસેજ મોકલતાં પહેલાં કોઈ પણ નિયમ ઇન્સ્ટ્રક્ટર સાથે તપાસો.",
    no:"આ લીટી પ્રોમ્પ્ટમાં માગ્યા પ્રમાણે છે. AI એ જાતે ઉમેરેલી લીટી શોધો."}
  }
 },
 he:{
  en:{
   q:"How do I plan my first economics assignment on inflation?",
   worked:[
    "Explain inflation in simple terms, as if to a first-year student, using one everyday example. Keep it to 150 words.",
    "Turn these notes into 5 short revision points I can read before a test: inflation means prices go up over time; the same money buys less; it is measured with a price index.",
    "I have an assignment due on 15 October about inflation. Suggest a simple structure with headings, and one question to answer under each heading."],
   hint5:"If you have no workshop, list the things you need, like books, notes or files. Make the list yourself.",
   sort:[["The topic of my first assignment",1,"This is general. It does not say who you are."],
         ["My college login password",0,"Never put a password into an AI tool."],
         ["Notes I made in today's class",1,"Your own class notes are fine to use."],
         ["My home address, for a letter",0,"Addresses are private. Add them yourself later."],
         ["A list of my classmates' marks",0,"Other people's marks are private records."]],
   spot:{prompt:"Draft a polite email to my faculty asking for a short extension on my inflation assignment. Keep it under 80 words.",
    lines:["Dear Sir or Ma'am, I am writing about my assignment on inflation.","Under University Rule 14(b), every student can get a 3-day extension.","Could I please have two more days to finish it? Thank you."],hit:1,
    yes:"Yes. This rule was not in the prompt, so the AI made it up. It sounds official, so check your college handbook before you send.",
    no:"Not quite. This line matches what the prompt asked for. Look for the line the AI added by itself."}
  },
  gu:{
   q:"મોંઘવારી (ઇન્ફ્લેશન) પરનું મારું પહેલું અર્થશાસ્ત્રનું અસાઇનમેન્ટ કેવી રીતે પ્લાન કરું?",
   worked:[
    "મોંઘવારી (ઇન્ફ્લેશન) સરળ ભાષામાં સમજાવો, જાણે પહેલા વર્ષના વિદ્યાર્થીને સમજાવતા હો, અને રોજિંદા જીવનનું એક ઉદાહરણ આપો. જવાબ 150 શબ્દોમાં રાખો.",
    "આ નોંધોને 5 ટૂંકા રિવિઝન પોઇન્ટમાં ફેરવો, જે હું ટેસ્ટ પહેલાં વાંચી શકું: મોંઘવારી એટલે સમય સાથે ભાવ વધવા; એ જ પૈસામાં ઓછું મળે; તેને પ્રાઇસ ઇન્ડેક્સથી માપવામાં આવે.",
    "મારે 15 ઓક્ટોબર સુધીમાં મોંઘવારી પર એક અસાઇનમેન્ટ આપવાનું છે. હેડિંગ સાથે એક સરળ માળખું સૂચવો, અને દરેક હેડિંગ નીચે જવાબ આપવા માટે એક પ્રશ્ન આપો."],
   hint5:"વર્કશોપ નથી? તમારા કામ માટે જોઈતી વસ્તુઓની યાદી બનાવો, જેમ કે પુસ્તકો, નોંધો કે ફાઇલો. યાદી જાતે બનાવો.",
   sort:[["મારા પહેલા અસાઇનમેન્ટનો વિષય",1,"આ સામાન્ય માહિતી છે. તે તમારી ઓળખ નથી બતાવતી."],
         ["મારો કોલેજ લોગિન પાસવર્ડ",0,"પાસવર્ડ ક્યારેય AI ટૂલમાં ન લખો."],
         ["આજના ક્લાસમાં મેં બનાવેલી નોંધ",1,"તમારી પોતાની ક્લાસ નોંધ વાપરી શકાય."],
         ["પત્ર માટે મારા ઘરનું સરનામું",0,"સરનામું ખાનગી છે. પછીથી જાતે ઉમેરો."],
         ["મારા સહપાઠીઓના માર્ક્સની યાદી",0,"બીજાના માર્ક્સ ખાનગી રેકોર્ડ છે."]],
   spot:{prompt:"મોંઘવારી પરના મારા અસાઇનમેન્ટ માટે થોડો વધુ સમય માગતો, મારા ફેકલ્ટીને એક નમ્ર ઇમેઇલ લખો. 80 શબ્દોથી ઓછો રાખો.",
    lines:["આદરણીય સર / મેડમ, હું મોંઘવારી પરના મારા અસાઇનમેન્ટ વિશે લખું છું.","યુનિવર્સિટી નિયમ 14(b) મુજબ દરેક વિદ્યાર્થીને 3 દિવસનો વધુ સમય મળી શકે છે.","શું મને તે પૂરું કરવા બે દિવસ વધુ મળી શકે? આભાર."],hit:1,
    yes:"સાચું. આ નિયમ પ્રોમ્પ્ટમાં નહોતો. AI એ જાતે બનાવ્યો, અને તે સત્તાવાર લાગે છે. મોકલતાં પહેલાં કોલેજની હેન્ડબુકમાં નિયમ તપાસો.",
    no:"આ લીટી પ્રોમ્પ્ટમાં માગ્યા પ્રમાણે છે. AI એ જાતે ઉમેરેલી લીટી શોધો."}
  }
 }
};

/* ---------- UI strings ---------- */
const T={
en:{
 title:"Set Up and Send Ten Prompts", lane:"Your stream", iti:"ITI", he:"Higher ed", stuck:"Stuck?", back:"Back", min:"min", total:"Total",
 stepOf:"Step {n} of 6",
 stages:["Set up your tool","Pick your question","Send ten prompts","Check the answers","Privacy and reflection","Save your evidence"],
 mins:[15,10,45,10,5,5],
 railFoot:"Mapped: PC 1.1 to 1.5",
 s0h:"Use an AI tool and check its answers.",
 s0p:"You set up an approved AI tool and send 10 prompts about 1 real question. You write a short log of each answer.",
 s0key:"An AI answer is only a draft. Read it and check it before you copy, send or use it.",
 s0time:"Your 90 minutes", s0rules:"Help rules",
 rTabs:["Get help","Do it yourself","Not allowed"],
 rLists:[["Ask for help to sign in to the approved tool.","Ask for help to change the language.","Ask about a word in these steps you do not know."],
         ["Fill the brackets in each prompt.","Write what changed after each try.","Do your privacy check and reflection."],
         ["Do not let anyone else write your prompts or log.","Do not use a tool or account your institute has not approved.","Never type real personal or private data into the AI tool."]],
 s0do:"Your task. Tap each card to see the help rules.",
 nextItem:"Next item", finishSort:"See all 5", start:"Start the lab", cont:"Continue", mp:{0:["Time","Help rules"],2:["Safe or not","Your question"],3:["Write and send","Log the answer"],4:["Practice","Your log"],5:["Privacy","Reflection"]},
 s1h:"Set up your AI tool in 4 short steps.", s1p:"Do each step in the AI tool that your institute has approved.", s1do:"Your task. Tick each box when you finish that step.",
 setup:[["Open the AI tool your institute has approved.","If you are not sure which tool, ask your facilitator."],
        ["Sign in with the account your institute allows.","Type your password yourself. Never put it in a prompt."],
        ["Set the language you want to use.","You can choose English or Gujarati. You can change it later."],
        ["Send a short test message, like “Hello”.","If you get a reply, your setup works."]],
 cantGetIn:"Cannot sign in or connect? See other ways to do this lab.",
 offlineOn:"Offline mode is on. Write your prompts here now, then send them and add the answers when you are online.",
 offlineOff:"Turn off offline mode",
 s2h:"Pick 1 real question from your life.",
 s2p:"All 10 prompts will be about this question. First, decide what is safe to share with an AI tool.", s2do:"Your task. Mark each item Safe or Not safe, then write your question.",
 sortH:"Is it safe to type this into an AI tool?", safe:"Safe", notSafe:"Not safe", right:"Yes.", again:"Not quite. Think about whether this is private or personal.",
 qH:"Write your question", qTip:"Make it real, but not private.", qEx:"Made-up example:", qPh:"Type your question here",
 priv:"This may be private: {x}. Remove it before you continue.",
 pt:{phone:"a phone number",aadhaar:"an Aadhaar-like number",email:"an email address",secret:"a password, OTP or PIN"},
 s3h:"Prompt {n} of 10", s3title:"Fill and send prompt {n} of 10.", s3do:"Your task. Fill every bracket, send the prompt, then log the answer.", groups:["Study","Work","Home"],
 starter:"Starter prompt", yourQ:"Your question:",
 worked:"Worked example", workedFor:"For the made-up question, it could look like this:",
 hint:"Hint", turn:"Your turn", turnP:"There is no example this time. You have done this 7 times now.",
 hints:{3:"Link it to your question. Name 1 session or class and say what people must do.",5:"Use a title like “Sir”, “Ma'am” or “faculty”, not a real full name. Do not add your roll number.",6:"Use your question as the project topic, and pick a date."},
 yv:"Your version. Replace every [bracket] with your own details.",
 left:"{n} brackets left", left1:"1 bracket left", noneLeft:"All brackets filled",
 copy:"Copy my prompt", copied:"Your prompt is copied. Paste it into your AI tool and send it.", copyFail:"The copy did not work. Select the text and copy it yourself.",
 paneW:"1. Write and send", paneL:"2. Log the answer",
 ans:"Paste the AI answer here, or its first few lines.", ansPh:"Paste the answer here",
 ansOff:"You are offline, so write “To send later” for now. Add the answer when you are online.",
 cRead:"I read the whole answer", cFact:"I checked a fact, date or number against something I trust", cProb:"Something was wrong or missing",
 probPh:"What was wrong or missing?",
 chFirst:"What did you notice in this first answer? Write 1 sentence.", ch:"What changed from the last answer? Write 1 sentence.",
 chPh:"Example: This answer was shorter and used my own topic.",
 need:"To save, you need to:", nBr:"fill all brackets", nAns:"add the answer", nRead:"tick “I read the whole answer”", nCh:"write what changed", nPriv:"remove private data",
 saveNext:"Save and go to prompt {n}", saveLast:"Save and continue", toCheck:"Continue to checking",
 s4h:"Find the line that the prompt did not ask for.",
 s4p:"This AI answer is made up for practice. The AI added 1 line by itself.", s4do:"Your task. Tap the added line, then pick the answer you trust least and say why.",
 thePrompt:"The prompt", theAns:"The AI's answer", practice:"Practice data",
 trustH:"Now look at your own log. Which answer would you trust least?", trustWhy:"Why do you trust it least? What would you check first?", trustPh:"Example: It gave a date I did not give it.",
 s5h:"Check your privacy, then write your reflection.", s5do:"Your task. Tick each line that is true, then answer the 2 questions.",
 privH:"Look at your 10 prompts again. Tick each line that is true.",
 privItems:["I did not share a password, OTP or PIN.","I did not share an Aadhaar number, phone number or address.","I did not share marks, health details or other people's names.","I did not share real records from my institute or workplace."],
 scanOk:"We scanned your log and found no private data.", scanBad:"Prompt {n} may contain {x}.", fix:"Fix prompt {n}",
 reflH:"Your first-use reflection",
 r1:"What surprised you about using AI for the first time?", r2:"What will you check next time, before you use an AI answer?",
 s6h:"Your evidence is ready to save.",
 s6p:"Save the file and submit it the way your facilitator tells you. Your work also stays on this device.",
 tSetup:"Setup", done:"Done", offRoute:"Offline route", tLog:"Prompts logged", tFact:"Answers fact-checked", tProb:"Problems found", tPriv:"Privacy check", tRefl:"Reflection",
 logH:"Your log", download:"Download my evidence", copyText:"Copy as text", assessor:"Assessor view",
 saved:"Your file is saved.", declined:"The download was cancelled. You can try again.", textCopied:"Your evidence is copied as text.",
 restart:"Start again", restartQ:"This clears your log on this device. Do you want to start again?",
 hH:"Other ways to do this lab", close:"Close",
 rec:[["wifi","Slow internet",["Use text only. Turn off images and voice in the tool.","Send one prompt. Wait for the full answer. Then log it.","Your log saves on this device after every change."]],
      ["off","No internet",["Fill all ten prompts here, or in your record book.","Send them when you are connected, in this session or the next one.","Your facilitator will note that answers were added later."]],
      ["users","Sharing one device",["Work in groups of 2 or 3. Each person gets 15 minutes on the AI tool.","While you wait, fill the brackets for your next prompts.","Everyone keeps their own log. Do not type in someone else's."]],
      ["key","Cannot sign in",["Ask your facilitator to check your account.","Do not use a friend's account or password."]]],
 goOffline:"Switch to offline mode",
 aH:"Assessor view", aP:"Levels are suggested from the evidence (marked with a dot). You decide the final level.",
 aMeta:"AAI-E-MC1-S01-LAB01  |  Mapped performance criteria: PC 1.1 to 1.5",
 gatesH:"Completion gates", gates:["Setup done, or offline route recorded","Ten prompts logged","Privacy check complete, no flags"],
 nc:"The workbook does not flag any criterion as non-compensatory. These gates only check that the task is complete.",
 levels:["Not demonstrated","Emerging","Meets standard","Secure transfer"],
 crit:[["Fits prompts to own question",["Fewer than 5 prompts have all brackets replaced.","5 to 9 prompts have all brackets replaced.","All 10 prompts have all brackets replaced with details from the learner's question.","All 10 are filled, and at least 2 prompts add the learner's own limit or detail beyond the brackets."]],
       ["Checks the output before use",["No answer has a fact, date or number checked.","1 or 2 answers have a fact, date or number checked.","At least 3 answers are checked, and the least-trusted answer is named with a reason.","Also records a specific problem in an answer and what was done about it."]],
       ["Notes what changed after each try",["3 or more change sentences are missing.","All 10 are present, but 4 or more are under 5 words or repeat the same text.","All 10 are present, and each names one difference in the answer.","At least 3 sentences link a change in the prompt to a change in the answer."]],
       ["Reflects on first use",["The reflection is missing.","The reflection describes feelings only.","The reflection names one thing the learner will check before using an AI answer.","The reflection also says when the learner would not rely on AI, with a reason."]]],
 ruleTxt:"Proposed pass rule (needs content-expert sign-off): all gates met, no criterion at Not demonstrated, and at least 3 criteria at Meets standard or above.",
 pass:"Result: meets the proposed pass rule", notYet:"Result: not yet", pick:"Result: choose a level for each criterion",
 modH:"Moderation examples",
 mod:[["Borderline pass","All gates met. All 10 prompts filled. Facts checked in 3 answers, and the least-trusted answer is named: “the date in prompt 3 looked wrong”. Change sentences are short but specific, like “Now only 3 lines”. The reflection talks about feelings only. Levels: Meets, Meets, Meets, Emerging. This passes."],
      ["Clear non-pass","7 prompts logged, and two still have brackets. Prompt 6 has a real phone number in it. Gates 2 and 3 are not met, so the task is not complete, whatever the other levels are."]]
},
gu:{
 title:"સેટઅપ કરો અને દસ પ્રોમ્પ્ટ મોકલો", lane:"તમારો પ્રવાહ", iti:"ITI", he:"ઉચ્ચ શિક્ષણ", stuck:"અટવાયા છો?", back:"પાછળ", min:"મિનિટ", total:"કુલ",
 stepOf:"પગલું {n} / 6",
 stages:["તમારું ટૂલ સેટ કરો","તમારો પ્રશ્ન પસંદ કરો","દસ પ્રોમ્પ્ટ મોકલો","જવાબો તપાસો","પ્રાઇવસી અને વિચાર","તમારો પુરાવો સાચવો"],
 mins:[15,10,45,10,5,5],
 railFoot:"મેપિંગ: PC 1.1 થી 1.5",
 s0h:"પહેલી વાર AI ટૂલ વાપરો, અને તે જે આપે તે તપાસો",
 s0p:"તમે માન્ય AI ટૂલ સેટ કરશો. પછી તમારા જીવનના એક સાચા પ્રશ્ન પર દસ સ્ટાર્ટર પ્રોમ્પ્ટ મોકલશો. સાથે સાથે ટૂંકો લોગ રાખશો.",
 s0key:"AI નો જવાબ માત્ર ડ્રાફ્ટ છે. તેની નકલ કરતાં, મોકલતાં કે તે પ્રમાણે કામ કરતાં પહેલાં તેને વાંચો અને તપાસો.",
 s0time:"તમારી 90 મિનિટ", s0rules:"મદદના નિયમો",
 rTabs:["આમાં મદદ લઈ શકો","આ જાતે જ કરો","મંજૂરી નથી"],
 rLists:[["માન્ય ટૂલમાં સાઇન ઇન કરવું","ભાષાનું સેટિંગ બદલવું","આ પગલાંમાં ન સમજાતો કોઈ શબ્દ"],
         ["દરેક પ્રોમ્પ્ટના કૌંસ ભરવા","દરેક પ્રયાસ પછી શું બદલાયું તે લખવું","તમારી પ્રાઇવસી તપાસ અને વિચાર"],
         ["બીજું કોઈ તમારા પ્રોમ્પ્ટ કે લોગ લખી આપે","સંસ્થાએ મંજૂર ન કર્યું હોય તેવું ટૂલ કે એકાઉન્ટ વાપરવું","AI ટૂલમાં સાચો અંગત કે ખાનગી ડેટા લખવો"]],
 nextItem:"આગળની વસ્તુ", finishSort:"પાંચેય જુઓ", start:"લેબ શરૂ કરો", cont:"આગળ વધો", mp:{0:["સમય","મદદના નિયમો"],2:["સલામત કે નહીં","તમારો પ્રશ્ન"],3:["લખો અને મોકલો","જવાબ લોગ કરો"],4:["પ્રેક્ટિસ","તમારો લોગ"],5:["પ્રાઇવસી","વિચાર"]},
 s1h:"તમારું ટૂલ સેટ કરો", s1p:"દરેક પગલું માન્ય AI ટૂલમાં કરો. પૂરું થાય એટલે ટિક કરો.",
 setup:[["તમારી સંસ્થાએ મંજૂર કરેલું AI ટૂલ ખોલો.","કયું ટૂલ છે તે ખબર નથી? ફેસિલિટેટરને પૂછો."],
        ["સંસ્થાએ મંજૂરી આપી હોય તે એકાઉન્ટથી સાઇન ઇન કરો.","પાસવર્ડ જાતે ટાઇપ કરો. તેને ક્યારેય પ્રોમ્પ્ટમાં ન લખો."],
        ["તમે વાપરવા માગો તે ભાષા સેટ કરો.","અંગ્રેજી કે ગુજરાતી. પછીથી બદલી શકો છો."],
        ["“Hello” જેવો ટૂંકો ટેસ્ટ મેસેજ મોકલો.","જવાબ આવે તો તમારું સેટઅપ બરાબર છે."]],
 cantGetIn:"અંદર જઈ શકતા નથી? આ લેબ કરવાની બીજી રીતો જુઓ",
 offlineOn:"ઓફલાઇન મોડ ચાલુ છે. પ્રોમ્પ્ટ અત્યારે અહીં લખો. કનેક્શન મળે ત્યારે મોકલો, પછી જવાબ ઉમેરો.",
 offlineOff:"ઓફલાઇન મોડ બંધ કરો",
 s2h:"તમારા જીવનમાંથી એક પ્રશ્ન પસંદ કરો",
 s2p:"દસેય પ્રોમ્પ્ટ આ એક જ પ્રશ્ન વિશે હશે. પહેલાં, શું શેર કરવું સલામત છે તે ઓળખવાની પ્રેક્ટિસ કરો.",
 sortH:"આ AI ટૂલમાં લખવું સલામત છે?", safe:"સલામત", notSafe:"સલામત નથી", right:"સાચું.", again:"ફરી પ્રયાસ કરો.",
 qH:"તમારો પ્રશ્ન લખો", qTip:"પ્રશ્ન સાચો હોય, પણ ખાનગી નહીં.", qEx:"કાલ્પનિક ઉદાહરણ:", qPh:"તમારો પ્રશ્ન અહીં લખો",
 priv:"આ ખાનગી હોઈ શકે: {x}. આગળ વધતાં પહેલાં તેને કાઢી નાખો.",
 pt:{phone:"ફોન નંબર",aadhaar:"આધાર જેવો નંબર",email:"ઇમેઇલ સરનામું",secret:"પાસવર્ડ, OTP કે PIN"},
 s3h:"પ્રોમ્પ્ટ {n} / 10", groups:["અભ્યાસ","કામ","ઘર"],
 starter:"સ્ટાર્ટર પ્રોમ્પ્ટ", yourQ:"તમારો પ્રશ્ન:",
 worked:"ઉકેલેલું ઉદાહરણ", workedFor:"કાલ્પનિક પ્રશ્ન માટે, તે આવું દેખાઈ શકે:",
 hint:"સંકેત", turn:"હવે તમારો વારો", turnP:"આ વખતે ઉદાહરણ નથી. તમે આ સાત વાર કરી ચૂક્યા છો.",
 hints:{3:"તેને તમારા પ્રશ્ન સાથે જોડો. કોઈ એક સેશન કે ક્લાસનું નામ લખો, અને લોકોએ શું કરવાનું છે તે લખો.",5:"“સર”, “મેડમ” કે “ફેકલ્ટી” જેવું પદ લખો, સાચું પૂરું નામ નહીં. રોલ નંબર ન ઉમેરો.",6:"તમારા પ્રશ્નને પ્રોજેક્ટનો વિષય બનાવો, અને એક તારીખ પસંદ કરો."},
 yv:"તમારું વર્ઝન: દરેક [કૌંસ] ને તમારી પોતાની વિગતથી બદલો",
 left:"{n} કૌંસ બાકી", left1:"1 કૌંસ બાકી", noneLeft:"બધા કૌંસ ભરાઈ ગયા",
 copy:"મારો પ્રોમ્પ્ટ કોપી કરો", copied:"કોપી થઈ ગયું. AI ટૂલમાં પેસ્ટ કરીને મોકલો.", copyFail:"કોપી ન થયું. લખાણ પસંદ કરીને જાતે કોપી કરો.",
 paneW:"1. લખો અને મોકલો", paneL:"2. જવાબ લોગ કરો",
 ans:"AI નો જવાબ: પેસ્ટ કરો, અથવા પહેલી થોડી લીટીઓ", ansPh:"જવાબ અહીં પેસ્ટ કરો",
 ansOff:"ઓફલાઇન: હમણાં “પછી મોકલીશ” લખો. કનેક્શન મળે ત્યારે જવાબ ઉમેરો.",
 cRead:"મેં આખો જવાબ વાંચ્યો", cFact:"મેં કોઈ હકીકત, તારીખ કે આંકડો વિશ્વાસપાત્ર સ્રોત સાથે તપાસ્યો", cProb:"કંઈક ખોટું હતું કે ખૂટતું હતું",
 probPh:"શું ખોટું કે ખૂટતું હતું?",
 chFirst:"આ પહેલા જવાબમાં તમે શું જોયું? એક વાક્ય.", ch:"છેલ્લા જવાબની સરખામણીમાં શું બદલાયું? એક વાક્ય.",
 chPh:"ઉદાહરણ: આ જવાબ ટૂંકો હતો અને તેમાં મારો પોતાનો વિષય હતો.",
 need:"સાચવવા માટે:", nBr:"બધા કૌંસ ભરો", nAns:"જવાબ ઉમેરો", nRead:"“મેં આખો જવાબ વાંચ્યો” ટિક કરો", nCh:"શું બદલાયું તે લખો", nPriv:"ખાનગી ડેટા કાઢી નાખો",
 saveNext:"સાચવો, પ્રોમ્પ્ટ {n} પર જાઓ", saveLast:"સાચવો અને આગળ વધો", toCheck:"તપાસ તરફ આગળ વધો",
 s4h:"તપાસવાની લીટી શોધો",
 s4p:"આ AI જવાબ પ્રેક્ટિસ માટે બનાવેલો છે. એક લીટી પ્રોમ્પ્ટમાં માગી નહોતી. તેને ટેપ કરો.",
 thePrompt:"પ્રોમ્પ્ટ", theAns:"AI નો જવાબ", practice:"પ્રેક્ટિસ ડેટા",
 trustH:"હવે તમારો પોતાનો લોગ જુઓ. કયા જવાબ પર તમને સૌથી ઓછો વિશ્વાસ છે?", trustWhy:"કેમ? તમે પહેલાં શું તપાસશો?", trustPh:"ઉદાહરણ: તેમાં એવી તારીખ હતી જે મેં આપી નહોતી.",
 s5h:"પ્રાઇવસી તપાસ અને વિચાર",
 privH:"તમારા દસ પ્રોમ્પ્ટ ફરી જુઓ. જે લીટી સાચી હોય તે ટિક કરો.",
 privItems:["મેં પાસવર્ડ, OTP કે PIN શેર કર્યો નથી.","મેં આધાર નંબર, ફોન નંબર કે સરનામું શેર કર્યું નથી.","મેં માર્ક્સ, આરોગ્યની વિગતો કે બીજાનાં નામ શેર કર્યાં નથી.","મેં સંસ્થા કે કાર્યસ્થળના સાચા રેકોર્ડ શેર કર્યા નથી."],
 scanOk:"તમારા લોગની ઝડપી તપાસ: કોઈ ખાનગી ડેટા મળ્યો નથી.", scanBad:"પ્રોમ્પ્ટ {n} માં {x} હોઈ શકે.", fix:"પ્રોમ્પ્ટ {n} સુધારો",
 reflH:"પહેલા ઉપયોગ પરનો તમારો વિચાર",
 r1:"પહેલી વાર AI વાપરતાં તમને શું નવાઈ લાગી?", r2:"આગલી વાર AI નો જવાબ વાપરતાં પહેલાં તમે શું તપાસશો?",
 s6h:"તમારો પુરાવો તૈયાર છે",
 s6p:"ફાઇલ સાચવો અને ફેસિલિટેટર કહે તે રીતે સબમિટ કરો. તમારું કામ આ ડિવાઇસ પર પણ સચવાયેલું રહે છે.",
 tSetup:"સેટઅપ", done:"પૂરું", offRoute:"ઓફલાઇન રીત", tLog:"લોગ થયેલા પ્રોમ્પ્ટ", tFact:"હકીકત તપાસેલા જવાબ", tProb:"મળેલી ખામીઓ", tPriv:"પ્રાઇવસી તપાસ", tRefl:"વિચાર",
 logH:"તમારો લોગ", download:"મારો પુરાવો ડાઉનલોડ કરો", copyText:"લખાણ તરીકે કોપી કરો", assessor:"અસેસર વ્યૂ",
 saved:"સચવાઈ ગયું.", declined:"ડાઉનલોડ રદ થયું. ફરી પ્રયાસ કરી શકો.", textCopied:"પુરાવો લખાણ તરીકે કોપી થયો.",
 restart:"ફરી શરૂ કરો", restartQ:"આથી આ ડિવાઇસ પરનો તમારો લોગ ભૂંસાઈ જશે. ફરી શરૂ કરવું છે?",
 hH:"આ લેબ કરવાની બીજી રીતો", close:"બંધ કરો",
 rec:[["wifi","ધીમું ઇન્ટરનેટ",["માત્ર લખાણ વાપરો. ટૂલમાં ચિત્રો અને અવાજ બંધ રાખો.","એક પ્રોમ્પ્ટ મોકલો. આખો જવાબ આવે ત્યાં સુધી રાહ જુઓ. પછી લોગ કરો.","દરેક ફેરફાર પછી તમારો લોગ આ ડિવાઇસ પર સચવાય છે."]],
      ["off","ઇન્ટરનેટ નથી",["દસેય પ્રોમ્પ્ટ અહીં કે તમારી રેકોર્ડ બુકમાં ભરો.","કનેક્શન મળે ત્યારે આ જ સેશનમાં કે પછીના સેશનમાં મોકલો.","જવાબ પછીથી ઉમેર્યા છે તેની નોંધ ફેસિલિટેટર કરશે."]],
      ["users","એક જ ડિવાઇસ વહેંચીને",["બે કે ત્રણના ગ્રુપમાં કામ કરો. દરેકને AI ટૂલ પર 15 મિનિટ મળે.","રાહ જુઓ ત્યારે આગલા પ્રોમ્પ્ટના કૌંસ ભરો.","દરેક પોતાનો લોગ રાખે. બીજાના લોગમાં ન લખો."]],
      ["key","સાઇન ઇન થતું નથી",["ફેસિલિટેટરને તમારું એકાઉન્ટ તપાસવા કહો.","મિત્રનું એકાઉન્ટ કે પાસવર્ડ ન વાપરો."]]],
 goOffline:"ઓફલાઇન મોડ પર જાઓ",
 aH:"અસેસર વ્યૂ", aP:"સ્તર પુરાવા પરથી સૂચવેલા છે (બિંદુથી દર્શાવેલ). અંતિમ સ્તર તમે નક્કી કરો.",
 aMeta:"AAI-E-MC1-S01-LAB01  |  મેપ કરેલા પરફોર્મન્સ ક્રાઇટેરિયા: PC 1.1 થી 1.5",
 gatesH:"પૂર્ણતાની શરતો", gates:["સેટઅપ પૂરું, અથવા ઓફલાઇન રીત નોંધાઈ","દસ પ્રોમ્પ્ટ લોગ થયા","પ્રાઇવસી તપાસ પૂરી, કોઈ ચેતવણી નહીં"],
 nc:"વર્કબુકમાં કોઈ માપદંડ નોન-કોમ્પેન્સેટરી તરીકે દર્શાવાયો નથી. આ શરતો માત્ર કાર્ય પૂરું થયું છે કે નહીં તે તપાસે છે.",
 levels:["દર્શાવ્યું નથી","વિકસી રહ્યું છે","ધોરણ મુજબ","સુરક્ષિત ટ્રાન્સફર"],
 crit:[["પ્રોમ્પ્ટને પોતાના પ્રશ્ન મુજબ બનાવે છે",["5 થી ઓછા પ્રોમ્પ્ટમાં બધા કૌંસ બદલાયા છે.","5 થી 9 પ્રોમ્પ્ટમાં બધા કૌંસ બદલાયા છે.","દસેય પ્રોમ્પ્ટમાં બધા કૌંસ શીખનારના પ્રશ્નની વિગતોથી બદલાયા છે.","દસેય ભરાયા છે, અને ઓછામાં ઓછા 2 પ્રોમ્પ્ટમાં કૌંસ ઉપરાંત પોતાની મર્યાદા કે વિગત ઉમેરી છે."]],
       ["વાપરતાં પહેલાં આઉટપુટ તપાસે છે",["કોઈ જવાબમાં હકીકત, તારીખ કે આંકડો તપાસાયો નથી.","1 કે 2 જવાબમાં હકીકત, તારીખ કે આંકડો તપાસાયો છે.","ઓછામાં ઓછા 3 જવાબ તપાસાયા છે, અને સૌથી ઓછા વિશ્વાસપાત્ર જવાબનું નામ કારણ સાથે આપ્યું છે.","સાથે જ કોઈ જવાબની ચોક્કસ ખામી અને તેના માટે શું કર્યું તે નોંધ્યું છે."]],
       ["દરેક પ્રયાસ પછી શું બદલાયું તે નોંધે છે",["3 કે વધુ ફેરફારનાં વાક્યો ખૂટે છે.","દસેય છે, પણ 4 કે વધુ વાક્યો 5 શબ્દથી ટૂંકાં છે અથવા એકસરખાં છે.","દસેય છે, અને દરેક જવાબમાં એક તફાવત જણાવે છે.","ઓછામાં ઓછાં 3 વાક્યો પ્રોમ્પ્ટના ફેરફારને જવાબના ફેરફાર સાથે જોડે છે."]],
       ["પહેલા ઉપયોગ પર વિચાર કરે છે",["વિચાર ખૂટે છે.","વિચારમાં માત્ર લાગણીઓ છે.","વિચારમાં AI નો જવાબ વાપરતાં પહેલાં તપાસવાની એક બાબત જણાવી છે.","સાથે જ શીખનાર ક્યારે AI પર આધાર નહીં રાખે તે કારણ સાથે જણાવ્યું છે."]]],
 ruleTxt:"સૂચિત પાસ નિયમ (કન્ટેન્ટ નિષ્ણાતની મંજૂરી જરૂરી): બધી શરતો પૂરી, કોઈ માપદંડ “દર્શાવ્યું નથી” પર નહીં, અને ઓછામાં ઓછા 3 માપદંડ “ધોરણ મુજબ” કે તેથી ઉપર.",
 pass:"પરિણામ: સૂચિત પાસ નિયમ પૂરો થાય છે", notYet:"પરિણામ: હજી નહીં", pick:"પરિણામ: દરેક માપદંડ માટે સ્તર પસંદ કરો",
 modH:"મોડરેશન ઉદાહરણો",
 mod:[["બોર્ડરલાઇન પાસ","બધી શરતો પૂરી. દસેય પ્રોમ્પ્ટ ભરાયા. 3 જવાબમાં હકીકત તપાસી, અને સૌથી ઓછા વિશ્વાસપાત્ર જવાબનું નામ આપ્યું: “પ્રોમ્પ્ટ 3 ની તારીખ ખોટી લાગી”. ફેરફારનાં વાક્યો ટૂંકાં પણ ચોક્કસ છે, જેમ કે “હવે માત્ર 3 લીટી”. વિચારમાં માત્ર લાગણીઓ છે. સ્તર: ધોરણ મુજબ, ધોરણ મુજબ, ધોરણ મુજબ, વિકસી રહ્યું છે. આ પાસ છે."],
      ["સ્પષ્ટ નોન-પાસ","7 પ્રોમ્પ્ટ લોગ થયા, અને બેમાં હજી કૌંસ છે. પ્રોમ્પ્ટ 6 માં સાચો ફોન નંબર છે. શરત 2 અને 3 પૂરી નથી, તેથી બીજાં સ્તર ગમે તે હોય, કાર્ય પૂરું નથી."]]
}
};

/* ---------- state ---------- */
const KEY="aaie-mc1-s01-lab01-v2";
const blank=()=>({lang:"en",lane:"iti",step:0,maxStep:0,ruleTab:0,setup:[0,0,0,0],offline:false,sort:{},question:"",
  entries:Array.from({length:10},()=>({text:"",ans:"",read:false,fact:false,prob:false,probNote:"",change:"",saved:false})),
  cur:0,mp:0,sortIdx:0,spot:null,trust:null,trustWhy:"",privacy:[0,0,0,0],r1:"",r2:"",assess:[null,null,null,null],started:null,rulesSeen:false});
let S=blank();
try{const raw=localStorage.getItem(KEY); if(raw){S=Object.assign(blank(),JSON.parse(raw));}}catch(e){}
let saveTimer=null;
function persist(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}},250);}

const t=k=>T[S.lang][k];
const f=(s,o)=>s.replace(/\{(\w+)\}/g,(_,k)=>o[k]);
const L=()=>LANE[S.lane][S.lang];
/* ESL upgrade: new English-only keys fall back to a matching key in the current language, then to English */
const tx=(k,fb)=>T[S.lang][k]!==undefined?T[S.lang][k]:(fb&&T[S.lang][fb]!==undefined?T[S.lang][fb]:T.en[k]);
function doLine(k){const s=tx(k),m=/^Your task\.\s*/.exec(s);return `<p class="do"><b>Your task.</b> ${m?s.slice(m[0].length):s}</p>`;}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $=id=>document.getElementById(id);
const words=s=>(s||"").trim().split(/\s+/).filter(Boolean).length;
const P=i=>PROMPTS[i][S.lang];
const isM=()=>window.innerWidth<=760;
const MP={0:1,2:1,3:1,4:1,5:1};
const hasMP=()=>MP[S.step]!==undefined;
function mtog(){const m=t("mp")[S.step];return `<div class="seg mtog" role="group">${m.map((k,i)=>`<button data-mp="${i}" aria-pressed="${S.mp===i}">${i+1}. ${k}</button>`).join("")}</div>`;}
function pane0ok(){if(S.step===2)return sortDone();if(S.step===4)return S.spot===L().spot.hit;if(S.step===3){const e=S.entries[S.cur];return !!e.text.trim()&&brackets(e.text)===0&&!scan(e.text).length;}return true;}

/* ---------- checks ---------- */
function brackets(s){return (s.match(/\[[^\]]*\]/g)||[]).length + ((s.match(/[\[\]]/g)||[]).length%2);}
function scan(s){
  const out=[]; if(!s) return out;
  if(/(^|\D)(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}(\D|$)/.test(s)) out.push("phone");
  if(/(^|\D)\d{4}[\s-]?\d{4}[\s-]?\d{4}(\D|$)/.test(s)) out.push("aadhaar");
  if(/[^\s@]+@[^\s@]+\.[a-z]{2,}/i.test(s)) out.push("email");
  if(/\b(password|passcode|otp|pin\s*(no|number|:)|pwd)\b|પાસવર્ડ|पासवर्ड/i.test(s)) out.push("secret");
  return [...new Set(out)];
}
function privMsg(types){return f(t("priv"),{x:types.map(k=>t("pt")[k]).join(", ")});}
const sortDone=()=>L().sort.every((it,i)=>S.sort[i]!==undefined && (S.sort[i]?1:0)===it[1]);
function entryMissing(i){
  const e=S.entries[i],m=[];
  if(!e.text.trim()||brackets(e.text)>0) m.push("nBr");
  if(e.ans.trim().length<(S.offline?4:10)) m.push("nAns");
  if(!e.read && !S.offline) m.push("nRead");
  if(words(e.change)<3) m.push("nCh");
  if(scan(e.text).length) m.push("nPriv");
  return m;
}
const loggedCount=()=>S.entries.filter(e=>e.saved).length;
function logFlags(){const r=[];S.entries.forEach((e,i)=>{const s=scan(e.text+" "+e.ans);if(s.length)r.push([i,s]);});const q=scan(S.question);if(q.length)r.push([-1,q]);return r;}

function canNext(){
  switch(S.step){
    case 0:return true;
    case 1:return S.setup.every(Boolean)||S.offline;
    case 2:return sortDone() && words(S.question)>=4 && !scan(S.question).length;
    case 3:return entryMissing(S.cur).length===0;
    case 4:return S.spot===L().spot.hit && S.trust!==null && words(S.trustWhy)>=3;
    case 5:return S.privacy.every(Boolean) && !logFlags().length && words(S.r1)>=3 && words(S.r2)>=3;
    default:return false;
  }
}

/* ---------- chrome ---------- */
function chrome(){
  document.documentElement.lang=S.lang;
  $("hTitle").textContent=t("title");
  document.title=t("title")+" — Swift AI Academy";
  $("helpLbl").textContent=t("stuck"); $("helpBtn").setAttribute("aria-label",t("stuck"));
  $("backLbl").textContent=t("back");
  const ls=$("laneSeg"); ls.setAttribute("aria-label",t("lane"));
  ls.innerHTML=`<button data-lane="iti" aria-pressed="${S.lane==="iti"}">${t("iti")}</button><button data-lane="he" aria-pressed="${S.lane==="he"}">${t("he")}</button>`;
  $("langSeg").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.lang===S.lang));
  // rail
  const st=t("stages"),mi=t("mins");
  $("rail").innerHTML=st.map((s,i)=>{const n=i+1,cls=S.step===n?"cur":(S.maxStep>n?"done":"");
    return `<li class="${cls}"><button data-go="${n}" ${S.maxStep>=n?"":"disabled"} ${S.step===n?'aria-current="step"':""}><span class="n">${S.maxStep>n?I.check.replace('class="i"','class="i" style="width:14px;height:14px"'):n}</span><span>${s}</span><span class="m">${mi[i]}</span></button></li>`}).join("");
  $("railFoot").innerHTML=`${t("railFoot")}<code>${t("total")} 90 ${t("min")}</code>`;
  // mobile bar
  if(S.step>0&&S.step<=6){$("mbar").style.display="";$("mbar").innerHTML=`<span>${f(t("stepOf"),{n:S.step})}</span><span class="track"><i style="width:${S.step/6*100}%"></i></span><span>${st[S.step-1]}</span>`;}
  else $("mbar").style.display="none";
  if(window.innerWidth>1060) $("mbar").style.display="none";
}

function footer(){
  const nb=$("nextBtn"),bb=$("backBtn"),ex=$("extraBtns"),msg=$("msg");
  bb.disabled=S.step===0; ex.innerHTML=""; msg.textContent=""; nb.style.display="";
  if(isM()&&hasMP()&&S.mp===0){nb.innerHTML=(S.step===3?t("mp")[3][1]:t("cont"))+I.arrow;nb.disabled=!pane0ok();return;}
  if(S.step===0){nb.innerHTML=t("start")+I.arrow;}
  else if(S.step===3){
    const last=S.cur===9||S.entries.every((e,i)=>e.saved||i===S.cur);
    nb.innerHTML=last?t("toCheck"):f(t("saveNext"),{n:nextOpen()+1});
    const m=entryMissing(S.cur),txt=m.length?t("need")+" "+m.map(k=>t(k)).join(", "):""; msg.textContent=txt; const nm=$("needM"); if(nm) nm.textContent=txt;
  }
  else if(S.step===6){
    nb.style.display="none";
    ex.style.flex=isM()?"1":"";ex.innerHTML=DL?`<button class="primary" id="dlBtn" style="flex:1">${I.down}${t("download")}</button>`:`<button class="primary" id="cpBtn" style="flex:1">${I.copy}${t("copyText")}</button>`;
  }
  else nb.innerHTML=t("cont")+I.arrow;
  nb.disabled=!canNext();
}
function nextOpen(){for(let k=1;k<=10;k++){const j=(S.cur+k)%10;if(!S.entries[j].saved&&j!==S.cur)return j;}return Math.min(S.cur+1,9);}

/* ---------- screens ---------- */
function vStart(){
  const mi=t("mins"),st=t("stages");
  return `<div class="lead" data-saa-lead><h1>${t("s0h")}</h1><p class="lede">${t("s0p")}</p>
  <div class="key">${I.search}<span>${t("s0key")}</span></div></div>
  ${mtog()}<div class="cols grow start" data-mp="${S.mp}">
   <section class="card c0"><h2>${t("s0time")}</h2><ol class="time">${st.map((s,i)=>`<li><span class="n">${i+1}</span><span>${s}</span><span class="m">${mi[i]} ${t("min")}</span></li>`).join("")}<li><span></span><span>${t("total")}</span><span class="m">90 ${t("min")}</span></li></ol></section>
   <section class="card c1 rules"><h2>${t("s0rules")}</h2>${doLine("s0do")}
    <div class="saa-kit" data-kit="reveal" data-theme="light"${S.rulesSeen?"":" data-required"}>
     <div class="saa-cards">${t("rTabs").map((x,i)=>`<button class="saa-card r${i}${S.rulesSeen?" open":""}" type="button"><span class="saa-front">${ICO(HELP_IC[i],"ga-ic32")}${x}</span><span class="saa-back"><ul class="plain ${i===2?"no":""}">${t("rLists")[i].map(y=>`<li>${i===2?I.x:I.check}<span>${y}</span></li>`).join("")}</ul></span></button>`).join("")}</div>
    </div>
   </section>
  </div>`;
}
function vSetup(){
  const suNow=(()=>{const k=S.setup.findIndex(v=>!v);return k<0?3:k;})();
  return `<div class="lead" data-saa-lead><h1>${t("s1h")}</h1><p class="lede">${t("s1p")}</p>${doLine("s1do")}</div>
  ${S.offline?`<div class="banner">${I.off}<span>${t("offlineOn")} <button class="linkbtn" data-act="offlineOff">${t("offlineOff")}</button></span></div>`:""}
  <div class="ga-setup"><div class="checks">${t("setup").map((x,i)=>`<button class="chk${i===suNow?" ga-now":""}" role="checkbox" aria-checked="${!!S.setup[i]}" data-setup="${i}"><span class="box">${I.check}</span><span><b>${x[0]}</b><span class="s">${x[1]}</span></span></button>`).join("")}</div>
   <figure class="ga-mock"><img src="assets/${DK()?"dark/":""}mock-setup-0${suNow+1}.webp" width="600" height="400" alt="${SETUP_ALT[suNow]}"></figure></div>
  <div><button class="linkbtn" data-act="help">${I.wifi}${t("cantGetIn")}</button></div>`;
}
function vQuestion(){
  const Ln=L(),n=Ln.sort.length,k=Math.min(S.sortIdx||0,n);
  const dots=`<div class="dots" aria-hidden="true">${Ln.sort.map((_,i)=>`<i class="${i<k?"on":i===k?"now":""}"></i>`).join("")}</div>`;
  let body;
  if(k<n){
    const it=Ln.sort[k],a=S.sort[k],answered=a!==undefined,ok=answered&&(a?1:0)===it[1];
    body=`<div class="item ga-item">${ICO(SORT_IC[S.lane][k],"ga-ic40")}<span>${esc(it[0])}</span></div>
     <div class="pair big"><button data-sort="${k}" data-v="1" aria-pressed="${a===1}">${t("safe")}</button><button data-sort="${k}" data-v="0" aria-pressed="${a===0}">${t("notSafe")}</button></div>
     <div aria-live="polite">${answered?`<div class="banner ${ok?"ok":"warn"}">${ok?I.check:I.x}<span>${ok?t("right"):t("again")} ${ok?esc(it[2]):""}</span></div>`:""}</div>
     ${ok?`<div><button class="secondary" data-act="sortNext" style="padding:8px 16px">${k<n-1?t("nextItem"):t("finishSort")}${I.arrow}</button></div>`:""}`;
  } else {
    body=`<div>${Ln.sort.map((it,j)=>`<div class="sumrow"><span class="ga-sr">${ICO(SORT_IC[S.lane][j],"ga-ic20")}<span>${esc(it[0])}</span></span><em class="${it[1]?"y":"n"}">${it[1]?t("safe"):t("notSafe")}</em></div>`).join("")}</div>`;
  }
  const pv=scan(S.question);
  return `<div class="lead" data-saa-lead><h1>${t("s2h")}</h1><p class="lede">${t("s2p")}</p>${doLine("s2do")}</div>
  ${mtog()}<div class="cols grow" data-mp="${S.mp}">
   <section class="card c0"><div class="sort"><h2 style="margin:0">${t("sortH")}</h2>${dots}${body}</div></section>
   <section class="card c1" style="display:flex;flex-direction:column">
    <label class="fl" for="qIn">${t("qH")}</label><div class="note" style="margin:-4px 0 8px">${t("qTip")}</div>
    <textarea id="qIn" rows="3" placeholder="${t("qPh")}" style="flex:1;min-height:80px">${esc(S.question)}</textarea>
    <div id="qWarn" style="margin-top:8px">${pv.length?`<div class="banner warn">${I.lock}<span>${privMsg(pv)}</span></div>`:""}</div>
    <div class="ex">${t("qEx")} <q>${esc(Ln.q)}</q></div>
   </section>
  </div>`;
}
function renderStarter(s){return esc(s).replace(/\[([^\]]+)\]/g,'<span class="slot">[$1]</span>');}
function guideBox(i){
  if(i<3) return `<div class="guide"><b>${t("worked")}</b>${t("workedFor")}<div class="w" style="margin-top:4px">${esc(L().worked[i])}</div></div>`;
  if(i<7){const h=i===4?L().hint5:t("hints")[i];return `<div class="guide"><b>${t("hint")}</b><span class="w">${esc(h)}</span></div>`;}
  return `<div class="guide"><b>${t("turn")}</b><span class="w">${t("turnP")}</span></div>`;
}
function vPrompts(){
  const i=S.cur,e=S.entries[i],p=P(i);
  if(!e.text) e.text=p.p;
  const strip=S.entries.map((x,k)=>`<button data-pick="${k}" class="${x.saved?"logged":""} ${k===i?"cur":""}" aria-label="${f(t("s3h"),{n:k+1})}${x.saved?", "+t("tLog"):""}">${ICO("prompt-"+String(k+1).padStart(2,"0"),"ga-ic16")}<span>${k+1}</span></button>`).join("");
  return `<div class="strip" role="group">${strip}</div>
  <div class="phead" data-saa-lead><h1>${f(tx("s3title","s3h"),{n:i+1})}</h1><span class="tag">${t("groups")[PROMPTS[i].g]}</span><span class="note saa-vo-skip">${esc(p.t)}</span>${doLine("s3do")}</div>
  ${mtog()}
  <div class="pgrid" data-mp="${S.mp}">
   <div class="pane c0">
    <section class="card" style="padding:14px 16px"><div class="note ga-starter" style="margin-bottom:4px">${ICO("prompt-"+String(i+1).padStart(2,"0"),"ga-ic20")}<span>${t("starter")}</span></div><div class="starter">${renderStarter(p.p)}</div>
     <div class="note" style="margin-top:8px">${t("yourQ")} <span style="color:var(--navy)">${esc(S.question)}</span></div></section>
    ${guideBox(i)}
    <div class="yv"><label class="fl" for="pIn">${t("yv")}</label><textarea id="pIn">${esc(e.text)}</textarea>
     <div class="yvfoot"><span class="count" id="brCount"></span><span class="ga-yvr">${i===0?`<button class="ga-thumb" type="button" data-act="anim" aria-label="${ANIM_ALT}"><img src="assets/anim-copy-paste-loop-poster.webp" alt="" aria-hidden="true"><span class="ga-play" aria-hidden="true"></span></button>`:""}<button class="secondary" data-act="copy" style="padding:7px 14px">${I.copy}${t("copy")}</button></span></div>
     <div id="pWarn"></div></div>
   </div>
   <div class="pane c1">
    <div class="ans"><label class="fl" for="aIn">${t("ans")}</label>${S.offline?`<div class="note" style="margin:-2px 0 6px">${t("ansOff")}</div>`:""}<div class="ta"><textarea id="aIn" placeholder="${t("ansPh")}">${esc(e.ans)}</textarea></div></div>
    <div class="checks" style="gap:6px">
     ${[["read","cRead"],["fact","cFact"],["prob","cProb"]].map(([k,l])=>`<button class="chk sm" role="checkbox" aria-checked="${e[k]}" data-ck="${k}"><span class="box">${I.check}</span><b>${t(l)}</b></button>`).join("")}
     <input type="text" id="probIn" placeholder="${t("probPh")}" value="${esc(e.probNote)}" style="${e.prob?"":"display:none"}">
    </div>
    <div><label class="fl" for="cIn">${i===0?t("chFirst"):t("ch")}</label><input type="text" id="cIn" placeholder="${t("chPh")}" value="${esc(e.change)}"></div>
    <div class="need mneed" id="needM"></div>
   </div>
  </div>`;
}
function vCheck(){
  const sp=L().spot,hit=S.spot===sp.hit;
  const lines=sp.lines.map((l,k)=>{let c="";if(S.spot===k)c=k===sp.hit?"hit":"miss";return `<button class="line ${c}" data-spot="${k}" aria-pressed="${S.spot===k}">${esc(l)}</button>`}).join("");
  const fb=S.spot===null?"":`<div class="banner ${hit?"ok":"warn"}" style="margin-top:10px">${hit?I.check:I.search}<span>${hit?sp.yes:sp.no}</span></div>`;
  const chips=S.entries.map((e,k)=>`<button data-trust="${k}" aria-pressed="${S.trust===k}"><code>${k+1}</code>${esc(t("groups")[PROMPTS[k].g])}</button>`).join("");
  return `<div class="lead" data-saa-lead><h1>${t("s4h")}</h1><p class="lede">${t("s4p")}</p>${doLine("s4do")}</div>
  ${mtog()}<div class="cols grow check" data-mp="${S.mp}">
   <section class="card c0 ga-chat"><h2 class="ga-chat-h">${t("thePrompt")}<span class="practice">${t("practice")}</span></h2><div class="quote">${esc(sp.prompt)}</div><h2>${t("theAns")}</h2><div class="lines">${lines}</div>${fb}</section>
   <section class="card c1" style="display:flex;flex-direction:column;gap:10px"><h2 style="margin:0">${t("trustH")}</h2><div class="chips">${chips}</div>
    ${S.trust!==null?`<div class="note">${f(t("s3h"),{n:S.trust+1})}: ${esc(S.entries[S.trust].text).slice(0,140)}${S.entries[S.trust].text.length>140?"…":""}</div>`:""}
    <div><label class="fl" for="twIn">${t("trustWhy")}</label><input type="text" id="twIn" placeholder="${t("trustPh")}" value="${esc(S.trustWhy)}"></div>
   </section>
  </div>`;
}
function vPrivacy(){
  const fl=logFlags();
  const scanBox=fl.length?fl.map(([i,s])=>`<div class="banner warn">${I.lock}<span>${i<0?privMsg(s):f(t("scanBad"),{n:i+1,x:s.map(k=>t("pt")[k]).join(", ")})} ${i>=0?`<button class="linkbtn" data-fix="${i}">${f(t("fix"),{n:i+1})}</button>`:""}</span></div>`).join(""):`<div class="banner ok">${I.check}<span>${t("scanOk")}</span></div>`;
  return `<div class="lead" data-saa-lead><h1>${t("s5h")}</h1>${doLine("s5do")}</div>
  ${mtog()}<div class="cols grow" data-mp="${S.mp}">
   <section class="card c0" style="display:flex;flex-direction:column;gap:10px"><h2 style="margin:0">${t("privH")}</h2>
    <div class="checks" style="gap:6px">${t("privItems").map((x,i)=>`<button class="chk sm" role="checkbox" aria-checked="${!!S.privacy[i]}" data-priv="${i}"><span class="box">${I.check}</span><b>${x}</b><span class="ga-pic" aria-hidden="true">${PRIV_IC[i].map(n=>ICO(n,"ga-ic20")).join("")}</span></button>`).join("")}</div>
    ${scanBox}
   </section>
   <section class="card c1" style="display:flex;flex-direction:column;gap:10px"><h2 style="margin:0">${t("reflH")}</h2>
    <div style="flex:1;display:flex;flex-direction:column;min-height:0"><label class="fl" for="r1">${t("r1")}</label><textarea id="r1" style="flex:1;min-height:60px">${esc(S.r1)}</textarea></div>
    <div style="flex:1;display:flex;flex-direction:column;min-height:0"><label class="fl" for="r2">${t("r2")}</label><textarea id="r2" style="flex:1;min-height:60px">${esc(S.r2)}</textarea></div>
   </section>
  </div>`;
}
function vEvidence(){
  const facts=S.entries.filter(e=>e.fact).length,probs=S.entries.filter(e=>e.prob).length,fl=logFlags().length;
  const tiles=[[t("tSetup"),S.setup.every(Boolean)?t("done"):t("offRoute"),1],[t("tLog"),loggedCount()+" / 10",loggedCount()===10],[t("tFact"),facts,1],[t("tProb"),probs,1],[t("tPriv"),S.privacy.every(Boolean)&&!fl?t("done"):"!",S.privacy.every(Boolean)&&!fl],[t("tRefl"),words(S.r1)>=3&&words(S.r2)>=3?t("done"):"!",1]];
  const log=S.entries.map((e,k)=>`<li><code>${String(k+1).padStart(2,"0")}</code><span class="c" title="${esc(e.change)}">${esc(e.change)||"—"}</span><span class="f"><span class="${e.read?"on":""}" title="${t("cRead")}">${I.eye}</span><span class="${e.fact?"on":""}" title="${t("cFact")}">${I.search}</span><span class="${e.prob?"on":""}" title="${t("cProb")}">${I.flag}</span></span></li>`).join("");
  return `<div class="lead" data-saa-lead><h1>${t("s6h")}</h1><p class="lede">${t("s6p")}</p></div>
  <div class="tiles">${tiles.map(x=>`<div class="tile ${x[2]?"":"flag"}"><span>${x[0]}</span><b>${x[2]&&typeof x[1]==="string"&&x[1]!=="!"&&!/\d/.test(x[1])?I.check:""}${esc(x[1])}</b></div>`).join("")}</div>
  <section class="card grow" style="display:flex;flex-direction:column"><h2>${t("logH")}</h2><ol class="log" style="overflow:hidden">${log}</ol></section>
  <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:center"><button class="linkbtn" data-act="assessor">${I.eye}${t("assessor")}</button>${DL?`<button class="linkbtn" data-act="copyEv">${I.copy}${t("copyText")}</button>`:""}<button class="linkbtn" data-act="restart" style="color:var(--muted);font-size:13px;margin-left:auto">${t("restart")}</button></div>`;
}

const VIEWS=[vStart,vSetup,vQuestion,vPrompts,vCheck,vPrivacy,vEvidence];
/* light/dark switch in the header: redraw so the icons and example screens match the theme */
window.addEventListener("saa:theme",()=>render(false));
function render(focus){
  chrome();
  $("stage").innerHTML=VIEWS[S.step]();
  footer(); live();
  if(focus) $("stage").focus({preventScroll:true});
}

/* live partial updates while typing (no full re-render) */
function live(){
  if(S.step===3){
    const e=S.entries[S.cur],n=brackets(e.text),c=$("brCount");
    if(c){c.className="count "+(n?"left":"done");c.textContent=n===0?t("noneLeft"):(n===1?t("left1"):f(t("left"),{n}));}
    const pv=scan(e.text),w=$("pWarn"); if(w) w.innerHTML=pv.length?`<div class="banner warn" style="margin-top:8px">${I.lock}<span>${privMsg(pv)}</span></div>`:"";
  }
  if(S.step===2){const pv=scan(S.question),w=$("qWarn");if(w)w.innerHTML=pv.length?`<div class="banner warn">${I.lock}<span>${privMsg(pv)}</span></div>`:"";}
  footer();
}

/* ---------- navigation ---------- */
function go(n){S.step=Math.max(0,Math.min(6,n));S.maxStep=Math.max(S.maxStep,S.step);S.mp=0;persist();render(true);}
$("nextBtn").addEventListener("click",()=>{
  if(isM()&&hasMP()&&S.mp===0){if(!pane0ok())return;S.mp=1;persist();render(true);return;}
  if(!canNext())return;
  if(S.step===0&&!S.started)S.started=new Date().toISOString();
  if(S.step===3){
    S.entries[S.cur].saved=true;
    if(S.entries.every(e=>e.saved)){go(4);return;}
    S.cur=nextOpen();S.mp=0;persist();render(true);return;
  }
  go(S.step+1);
});
$("backBtn").addEventListener("click",()=>{
  if(isM()&&hasMP()&&S.mp===1){S.mp=0;persist();render(true);return;}
  go(S.step-1);
});

/* ---------- events ---------- */
document.addEventListener("click",ev=>{
  const b=ev.target.closest("button");if(!b)return;
  const d=b.dataset;
  if(d.lang){const old=S.lang;S.entries.forEach((e,i)=>{if(e.text===PROMPTS[i][old].p)e.text=PROMPTS[i][d.lang].p;});S.lang=d.lang;persist();render();if($("helpModal").classList.contains("open"))openHelp();if($("asModal").classList.contains("open"))openAssessor();return;}
  if(d.lane){S.lane=d.lane;S.sort={};S.sortIdx=0;S.spot=null;persist();render();return;}
  if(d.go){go(+d.go);return;}
  if(d.rtab!==undefined){S.ruleTab=+d.rtab;persist();render();return;}
  if(d.setup!==undefined){S.setup[+d.setup]=S.setup[+d.setup]?0:1;persist();render();return;}
  if(d.sort!==undefined){S.sort[+d.sort]=+d.v;persist();render();return;}
  if(d.pick!==undefined){S.cur=+d.pick;S.mp=0;persist();render();return;}
  if(d.mp!==undefined&&b.closest(".mtog")){if(+d.mp===1&&!pane0ok())return;S.mp=+d.mp;persist();render();return;}
  if(d.ck){const e=S.entries[S.cur];e[d.ck]=!e[d.ck];persist();b.setAttribute("aria-checked",e[d.ck]);if(d.ck==="prob")$("probIn").style.display=e.prob?"":"none";live();return;}
  if(d.spot!==undefined){S.spot=+d.spot;persist();render();return;}
  if(d.trust!==undefined){S.trust=+d.trust;persist();render();return;}
  if(d.priv!==undefined){S.privacy[+d.priv]=S.privacy[+d.priv]?0:1;persist();render();return;}
  if(d.fix!==undefined){S.cur=+d.fix;S.entries[S.cur].saved=false;S.privacy=[0,0,0,0];go(3);return;}
  if(d.lvl!==undefined){S.assess[+d.c]=+d.lvl;persist();openAssessor();return;}
  if(d.act==="help"){openHelp();return;}
  if(d.act==="anim"){openAnim();return;}
  if(d.act==="sortNext"){S.sortIdx=(S.sortIdx||0)+1;persist();render();return;}
  if(d.act==="assessor"){openAssessor();return;}
  if(d.act==="copyEv"){copy(evidenceText(),t("textCopied"));return;}
  if(d.act==="offline"){S.offline=true;persist();closeM("helpModal");if(S.step<1)go(1);else render();return;}
  if(d.act==="offlineOff"){S.offline=false;persist();render();return;}
  if(d.act==="copy"){copy(S.entries[S.cur].text,t("copied"));return;}
  if(d.act==="restart"){if(confirm(t("restartQ"))){const lang=S.lang,lane=S.lane;S=blank();S.lang=lang;S.lane=lane;persist();render(true);}return;}
  if(d.close){closeM(d.close);return;}
  if(b.id==="helpBtn"){openHelp();return;}
  if(b.id==="asBtn"){openAssessor();return;}
  if(b.id==="cpBtn"){copy(evidenceText(),t("textCopied"));return;}
  if(b.id==="dlBtn"){doDownload();return;}
});
document.addEventListener("input",ev=>{
  const el=ev.target,id=el.id,e=S.entries[S.cur];
  if(id==="qIn")S.question=el.value;
  else if(id==="pIn")e.text=el.value;
  else if(id==="aIn")e.ans=el.value;
  else if(id==="probIn")e.probNote=el.value;
  else if(id==="cIn")e.change=el.value;
  else if(id==="twIn")S.trustWhy=el.value;
  else if(id==="r1")S.r1=el.value;
  else if(id==="r2")S.r2=el.value;
  else return;
  if(S.step===3&&["pIn","aIn","cIn"].includes(id))e.saved=e.saved&&entryMissing(S.cur).length===0;
  persist();live();
});
document.addEventListener("saa:done",ev=>{if(S.step===0&&ev.target.closest&&ev.target.closest(".rules")&&!S.rulesSeen){S.rulesSeen=true;persist();}});
document.addEventListener("keydown",ev=>{if(ev.key==="Escape"){closeM("helpModal");closeM("asModal");closeM("animModal");}});
let rz;window.addEventListener("resize",()=>{clearTimeout(rz);rz=setTimeout(()=>{chrome();footer();},120);});

/* ---------- modals ---------- */
let lastFocus=null;
function openM(id){lastFocus=document.activeElement;$(id).classList.add("open");const c=$(id).querySelector("[data-close]");if(c)c.focus();}
function closeM(id){if(!$(id).classList.contains("open"))return;$(id).classList.remove("open");if(id==="animModal")$("animBody").innerHTML="";if(lastFocus)lastFocus.focus();}
function openHelp(){
  $("helpBody").innerHTML=`<div class="mhead"><h2 id="helpH">${t("hH")}</h2><button class="ghost" data-close="helpModal">${I.x}${t("close")}</button></div>
  <div class="mbody"><div class="rec">${t("rec").map(([ic,h,list],k)=>`<div class="card"><h3>${I[ic]}${h}</h3><ul>${list.map(x=>`<li>${x}</li>`).join("")}</ul>${k===1&&!S.offline?`<button class="secondary" data-act="offline" style="margin-top:10px;padding:7px 14px">${I.off}${t("goOffline")}</button>`:""}</div>`).join("")}</div></div>`;
  if(!$("helpModal").classList.contains("open"))openM("helpModal");
}
function openAnim(){
  const rm=reduceMotion();
  $("animBody").innerHTML=`<div class="mhead"><button class="ghost" data-close="animModal">${I.x}${t("close")}</button></div>
  <figure class="ga-anim"><video src="assets/anim-copy-paste-loop.mp4" poster="assets/anim-copy-paste-loop-poster.webp" muted loop playsinline ${rm?"controls":"autoplay"} width="600" height="400" aria-label="${ANIM_ALT}"></video></figure>`;
  openM("animModal");
}
function suggest(){
  const e=S.entries,filled=e.filter((x,i)=>x.text.trim()&&brackets(x.text)===0&&x.text.trim()!==P(i).p).length;
  const c1=filled<5?0:filled<10?1:2;
  const facts=e.filter(x=>x.fact).length; const c2=facts===0?0:(facts<3||words(S.trustWhy)<3)?1:2;
  const ch=e.map(x=>x.change.trim()); const missing=ch.filter(x=>!x).length;
  const weak=ch.filter(x=>words(x)<5).length+ (ch.length-new Set(ch.map(x=>x.toLowerCase())).size);
  const c3=missing>=3?0:(missing>0||weak>=4)?1:2;
  const c4=!S.r1.trim()&&!S.r2.trim()?0:words(S.r2)>=5?2:1;
  return [c1,c2,c3,c4];
}
function openAssessor(){
  const sug=suggest(),fl=logFlags().length;
  const gates=[S.setup.every(Boolean)||S.offline,loggedCount()===10,S.privacy.every(Boolean)&&!fl];
  const lv=t("levels");
  const crit=t("crit").map(([nm,ds],c)=>{const sel=S.assess[c];const show=sel===null?sug[c]:sel;
    return `<div class="crit"><div class="nm">${nm}<code>C${c+1}</code></div><div><div class="lv" role="group" aria-label="${esc(nm)}">${lv.map((l,k)=>`<button data-c="${c}" data-lvl="${k}" class="${sug[c]===k?"sug":""}" aria-pressed="${sel===k}">${l}</button>`).join("")}</div><div class="desc">${esc(ds[show])}</div></div></div>`}).join("");
  let res=t("pick");
  if(S.assess.every(x=>x!==null)){const ok=gates.every(Boolean)&&S.assess.every(x=>x>0)&&S.assess.filter(x=>x>=2).length>=3;res=ok?t("pass"):t("notYet");}
  else if(!gates.every(Boolean)) res=t("notYet");
  $("asBody").innerHTML=`<div class="mhead"><h2 id="asH">${t("aH")}</h2><button class="ghost" data-close="asModal">${I.x}${t("close")}</button></div>
  <div class="mbody">
   <div class="meta">${t("aMeta")}${S.offline?"  |  "+t("offRoute"):""}</div>
   <div><h2 style="font-size:15px;margin:0 0 8px">${t("gatesH")}</h2><div class="gates">${t("gates").map((g,k)=>`<span class="gate ${gates[k]?"y":"n"}">${gates[k]?I.check:I.x}${g}</span>`).join("")}</div><p class="note" style="margin:8px 0 0">${t("nc")}</p></div>
   <p class="note" style="margin:0">${t("aP")}</p>
   <div>${crit}</div>
   <div class="banner ${res===t("pass")?"ok":""}"><span><span class="res">${res}</span><br><span style="font-size:12.5px">${t("ruleTxt")}</span></span></div>
   <details><summary style="cursor:pointer;font-weight:500">${t("modH")}</summary><div class="mod" style="margin-top:10px">${t("mod").map(([h,p])=>`<div><b>${h}</b>${p}</div>`).join("")}</div></details>
  </div>`;
  if(!$("asModal").classList.contains("open"))openM("asModal");
}
document.querySelectorAll(".scrim").forEach(s=>s.addEventListener("click",ev=>{if(ev.target===s)closeM(s.id);}));

/* ---------- evidence export ---------- */
function evidenceText(){
  const E=T.en,lines=[];
  lines.push("# Evidence: Set Up and Send Ten Prompts","",
   "Schema: AAI-E-MC1-S01-LAB01 (Practical Lab Task)","Mapped performance criteria: PC 1.1 to 1.5",
   "Stream: "+(S.lane==="iti"?"ITI trade":"Higher education")+"  |  Language used: "+(S.lang==="en"?"English":"Gujarati"),
   "Started: "+(S.started||"—")+"  |  Exported: "+new Date().toISOString(),
   "Route: "+(S.offline?"Offline route (answers added later)":"Online"),"",
   "## Setup","- Approved tool opened, permitted account signed in, language set, test message sent: "+(S.setup.every(Boolean)?"yes":"not all ticked"),"",
   "## My question",S.question||"—","",
   "## Prompt-and-output log");
  S.entries.forEach((e,i)=>{lines.push("",`### ${i+1}. ${PROMPTS[i].en.t}`,"Prompt sent: "+(e.text||"—"),"AI answer (as logged): "+(e.ans||"—"),
   "Read whole answer: "+(e.read?"yes":"no")+"  |  Checked a fact/date/number: "+(e.fact?"yes":"no")+"  |  Problem found: "+(e.prob?"yes"+(e.probNote?" ("+e.probNote+")":""):"no"),
   "What changed: "+(e.change||"—"));});
  lines.push("","## Checking","Practice task, line needing a check found: "+(S.spot===L().spot.hit?"yes":"no"),
   "Least-trusted answer: "+(S.trust!==null?"Prompt "+(S.trust+1):"—"),"Reason: "+(S.trustWhy||"—"),"",
   "## Privacy check",...E.privItems.map((x,i)=>"- "+(S.privacy[i]?"[x] ":"[ ] ")+x),"Automatic scan flags: "+(logFlags().length?logFlags().map(([i])=>i<0?"question":"prompt "+(i+1)).join(", "):"none"),"",
   "## First-use reflection","Surprised me: "+(S.r1||"—"),"Will check next time: "+(S.r2||"—"));
  if(S.assess.some(x=>x!==null)) lines.push("","## Assessor levels",...E.crit.map(([n],c)=>`- ${n}: ${S.assess[c]!==null?E.levels[S.assess[c]]:"not set"}`));
  return lines.join("\n");
}
function toast(m){const el=$("toast");el.textContent=m;el.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove("show"),2600);}
async function copy(txt,okMsg){
  try{await navigator.clipboard.writeText(txt);toast(okMsg);}
  catch(e){try{const ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();const ok=document.execCommand("copy");ta.remove();toast(ok?okMsg:t("copyFail"));}catch(e2){toast(t("copyFail"));}}
}
let DL=null;
async function doDownload(){
  if(!DL)return;
  try{await DL.save({filename:"AAI-E-MC1-S01-LAB01_evidence.md",data:evidenceText()});toast(t("saved"));}
  catch(e){toast(e&&e.code==="declined"?t("declined"):t("copyFail"));}
}
(async()=>{try{if(window.claude&&window.claude.use){DL=await window.claude.use("downloads");if(S.step===6)render();}}catch(e){DL=null;}})();

render();
})();
