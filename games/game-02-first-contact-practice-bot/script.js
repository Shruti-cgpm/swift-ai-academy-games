(function(){
"use strict";
var LOGO = "data:image/png;base64,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";
var KEY = "saa-mc1-s01-bot01-v1";

/* ---------- Icons (single line, 1.75 stroke) ---------- */
function ic(p){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';}
var I = {
  shield: ic('<path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>'),
  user: ic('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-3.5 3.8-5.5 7-5.5s6 2 7 5.5"/>'),
  msg: ic('<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/>'),
  doc: ic('<path d="M7 3h7l4 4v14H7V3Z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>'),
  search: ic('<circle cx="11" cy="11" r="6"/><path d="m20 20-4.2-4.2"/>'),
  send: ic('<path d="M4 12 20 4l-6 16-3-7-7-1Z"/>'),
  cpu: ic('<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>'),
  me: ic('<circle cx="12" cy="9" r="4"/><path d="M6 20c.8-3 3.2-4.5 6-4.5s5.2 1.5 6 4.5"/>'),
  check: ic('<path d="M20 6 9 17l-5-5"/>'),
  x: ic('<path d="M18 6 6 18M6 6l12 12"/>'),
  half: ic('<circle cx="12" cy="12" r="9"/><path d="M12 3v18"/>'),
  info: ic('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
  arrow: ic('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  settings: ic('<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M10 17h4"/>'),
  pen: ic('<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>'),
  clock: ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  mix: ic('<path d="M4 7h4l8 10h4M4 17h4l2.5-3M14 10l2-3h4"/><path d="m18 5 2 2-2 2M18 15l2 2-2 2"/>'),
  flag: ic('<path d="M5 21V4h11l-2 4 2 4H5"/>'),
  alert: ic('<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/>'),
  loop: ic('<path d="M4 12a8 8 0 0 1 14-5.3L20 8"/><path d="M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-14 5.3L4 16"/><path d="M4 20v-4h4"/>')
};

/* ---------- State ---------- */
function blankCluster(){return {met:false,evidence:[],skipped:null,tries:0};}
function fresh(){return {lane:null,assets:[],feeling:null,prediction:null,mistakeGuess:null,device:null,
  clusters:{pick:blankCluster(),setup:blankCluster(),ask:blankCluster(),check:blankCluster()},
  rot:{},history:[],cur:"ENTRY_WELCOME",retryFor:null,spot:null,built:null,complete:false,events:[],build:false,started:Date.now()};}
var S = fresh(), L = {};
var store = {
  get:function(){try{var v=localStorage.getItem(KEY);return v?JSON.parse(v):null;}catch(e){return null;}},
  set:function(v){try{localStorage.setItem(KEY,JSON.stringify(v));}catch(e){}},
  clear:function(){try{localStorage.removeItem(KEY);}catch(e){}}
};
function save(){ var copy=Object.assign({},S); copy.events=S.events.slice(-60); store.set(copy); }
function log(name,data){ var ev={t:new Date().toISOString(),event:name,node:S.cur}; if(data){for(var k in data)ev[k]=data[k];} S.events.push(ev); updateBuild(); }

function resolve(v){ if(Array.isArray(v)) return v.map(resolve); if(v&&typeof v==="object"){ if("iti" in v||"he" in v) return resolve(v[S.lane||"iti"]); var o={}; for(var k in v) o[k]=resolve(v[k]); return o;} return v; }
function lane(v){ if(v&&typeof v==="object"&&!Array.isArray(v)&&("iti" in v||"he" in v)) return v[S.lane||"iti"]; return v; }
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}

/* ---------- Clusters ---------- */
var CL = [
  {k:"pick",  name:"Pick the tool", short:"Pick"},
  {k:"setup", name:"Set up safely", short:"Set up"},
  {k:"ask",   name:"Ask clearly", short:"Ask"},
  {k:"check", name:"Check the output", short:"Check"}
];
function clName(k){for(var i=0;i<CL.length;i++)if(CL[i].k===k)return CL[i].name;return "";}
function markMet(k,node){ var c=S.clusters[k]; if(!c) return; if(!c.met){c.met=true;log("cluster_met",{cluster:k});} if(c.evidence.indexOf(node)<0)c.evidence.push(node); }

/* ---------- Shared view pieces ---------- */
function coach(t,reply){return '<div class="coach'+(reply?' reply':'')+'"><div class="av"><img src="'+LOGO+'" alt=""></div><div class="bub">'+t+'</div></div>';}
function head(t){return '<h1 tabindex="-1" id="h">'+t+'</h1>';}
function scen(t){return '<div class="card scenario"><span class="tag">Example</span>'+t+'</div>';}
/* ESL upgrade: one "Your task." line per activity screen, and the kit helpers (light theme) */
function task(t){return '<p class="do"><b>Your task.</b> '+t+'</p>';}
/* designer assets (Game 2 pack): icons in assets/icons/, mock screens and scenes in assets/ */
/* light / dark: the page starts dark (html[data-theme]); the dark twins of the pictures are in assets/dark/, kits follow the page theme */
function isLight(){return document.documentElement.getAttribute("data-theme")==="light";}
function AP(){return isLight()?"assets/":"assets/dark/";}
function KT(){return isLight()?"light":"dark";}
window.addEventListener("saa:theme",function(){
  Array.prototype.forEach.call(document.querySelectorAll('img[src^="assets/"]'),function(im){
    var src=im.getAttribute("src"); if(/^assets\/icons\/active\//.test(src)) return;
    var bare=src.replace(/^assets\/(dark\/)?/,""); var want=AP()+bare; if(src!==want) im.setAttribute("src",want);
  });
  Array.prototype.forEach.call(document.querySelectorAll(".saa-kit[data-theme]"),function(k){k.setAttribute("data-theme",KT());});
});
function aic(n,cls){return n?'<img class="'+(cls||'aic')+'" src="'+AP()+'icons/'+n+'.webp" alt="" aria-hidden="true">':'';}
function amock(n,alt,cls){return '<figure class="amock '+(cls||'')+'"><img src="'+AP()+''+n+'" alt="'+alt+'"></figure>';}
var PART_IC={Task:"icon-task",Details:"icon-context",Shape:"icon-format"};
function kitQuick(q,opts){return '<div class="saa-kit" data-kit="quick" data-theme="'+KT()+'" data-required><p class="saa-q">'+q+'</p><div class="saa-k-opts">'+
  opts.map(function(o){return '<button class="saa-k-opt" type="button"'+(o[1]?' data-ok':'')+' data-why="'+esc(o[2])+'">'+o[0]+'</button>';}).join("")+'</div><p class="saa-k-why"></p></div>';}
var FBT = {c:["Yes."],p:["Not quite. You are partly right."],x:["Not quite."],n:["Noted."]};
function fbox(kind,title,body){
  var icon = kind==="c"?I.check:kind==="x"?I.x:kind==="p"?I.half:I.info;
  return '<div class="fb '+kind+'" role="status">'+icon+'<div><b>'+title+'</b>'+body+'</div></div>';
}
/* right / wrong sounds: the stage is redrawn on every answer, so the game plays them itself */
function sfx(ok){ try{ if(window.SAA_SFX){ if(ok) SAA_SFX.correct(); else SAA_SFX.wrong(); } }catch(e){} }
function pick(arr,seed){return arr[Math.abs(seed||0)%arr.length];}

/* ======================================================================
   SCORED ITEM ENGINE
   Every scored node: attempt 1 -> feedback. If not correct: a new example
   (never the same wording). If attempt 2 is not correct: answer revealed,
   explained, and the cluster returns in the recap retry path.
   ====================================================================== */
function makeItem(cfg){
  return {
    id:cfg.id, cluster:cfg.cluster, skippable:true, scored:true, kind:cfg.kind, next:cfg.next,
    init:function(L){
      var n=cfg.variants.length, r=S.rot[cfg.id]||0;
      L.v=r%n; L.attempt=1; L.phase="answer"; L.sel=null; L.res=null;
      S.rot[cfg.id]=r+1;
      KINDS[cfg.kind].reset(L, resolve(cfg.variants[L.v]));
    },
    variant:function(L){return resolve(cfg.variants[L.v]);},
    view:function(L){
      var v=this.variant(L), k=KINDS[cfg.kind], h="";
      var c = L.phase==="feedback" ? (L.res.res==="c"?pick(v.coachOk||["You got it right.","That is the habit.","You spotted it."],L.attempt+L.v):(L.attempt===1?"Read why. Then try a new example.":"Here is the reason. You will try again at the end.")) : (L.attempt===2?(v.retryCoach||"Here is a new example. The idea is the same."):v.coach);
      h+=coach(c).replace('class="coach','class="coach soft');
      if(v.scenario) h+=scen(v.scenario);
      h+=head(v.q).replace('<h1','<h1 class="q" style="font-size:inherit"');
      if(L.phase==="answer") h+=task(v.task||TASKS[cfg.kind]);
      h+=k.view(L,v);
      if(L.phase==="feedback") h+=L.res.html;
      if(L.phase==="feedback" && L.res.res==="c" && v.okPic) h+=amock(v.okPic[0],v.okPic[1],(v.okPic[2]||'')+' ok-pic');
      return h;
    },
    on:function(act,val,L){
      var v=this.variant(L);
      if(L.phase!=="answer") return;
      KINDS[cfg.kind].on(act,val,L,v);
    },
    primary:function(L){
      var self=this, v=this.variant(L), k=KINDS[cfg.kind];
      if(L.phase==="answer"){
        return {label:"Check",enabled:k.ready(L,v),act:function(){
          var r=k.evaluate(L,v);
          if(r.res==="empty"||r.res==="off"){ L.nudge=r.html; log("input_"+(r.res==="empty"?"no_response":"off_topic"),{}); draw(); return; }
          L.nudge=null;
          var titles=FBT[r.res]; var title=pick(titles,L.attempt+(L.v||0));
          var body=r.body;
          if(r.res!=="c"){
            if(L.attempt===1){ body+= v.clue?'<p class="clue">Clue for the next example: '+v.clue+'</p>':""; }
            else { body+= '<p class="clue">The best answer is this: '+r.reveal+'</p>'; }
          }
          L.res={res:r.res,html:fbox(r.res,title,body)};
          L.phase="feedback";
          S.clusters[cfg.cluster].tries++;
          log("answer_submitted",{node:cfg.id+"_"+(r.res==="c"?"CORRECT":r.res==="p"?"PARTIAL":"INCORRECT"),attempt:L.attempt,variant:L.v});
          if(r.res==="c") markMet(cfg.cluster,cfg.id);
          sfx(r.res==="c");
          draw(true);
        }};
      }
      if(L.res.res!=="c" && L.attempt===1){
        return {label:"Try a new example",enabled:true,act:function(){
          var n=cfg.variants.length; L.v=(L.v+1)%n; S.rot[cfg.id]=(S.rot[cfg.id]||0)+1;
          L.attempt=2; L.phase="answer"; L.res=null; L.nudge=null;
          KINDS[cfg.kind].reset(L, self.variant(L));
          log("retry_started",{node:cfg.id+"_RETRY",variant:L.v}); draw();
        }};
      }
      return {label:"Continue",enabled:true,act:function(){ goNext(self); }};
    }
  };
}

/* ---------- Item kinds ---------- */
var TASKS = {mcq:"Tap one answer. Then tap Check.",multi:"Tap every right answer. Then tap Check.",sort:"Tap Type it or Keep out for each detail. Then tap Check.",
  order:"Tap the steps in order, from first to last. Then tap Check.",text:"Type the last part, or tap Show choices instead. Then tap Check.",
  slots:"Choose each part of the request, one at a time. Then tap Check.",spot:"Tap each line that is wrong or added. Then tap Check."};
var KINDS = {
  mcq:{
    reset:function(L){L.sel=null;},
    view:function(L,v){
      var h='<div class="opts">';
      v.options.forEach(function(o,i){
        if(L.phase==="feedback" && i!==L.sel) return;
        var cls="opt"+(L.phase==="feedback"?" r-"+o.r:"");
        h+='<button class="'+cls+(o.img?' opt-mock':'')+'" data-act="sel" data-v="'+i+'" aria-pressed="'+(L.phase==="answer"&&L.sel===i)+'"'+(L.phase==="feedback"?" disabled":"")+'><span class="dot"></span>'+(o.img?'<img class="omock" src="'+AP()+''+o.img+'" alt="" aria-hidden="true">':'')+(o.ic?aic(o.ic):'')+'<span>'+o.t+'</span></button>';
      });
      return (v.pic&&L.phase==="answer"?amock(v.pic[0],v.pic[1],v.pic[2]):'')+h+'</div>';
    },
    on:function(act,val,L){ if(act==="sel") L.sel=+val; },
    ready:function(L){return L.sel!==null;},
    evaluate:function(L,v){
      var o=v.options[L.sel]; var best=v.options.filter(function(x){return x.r==="c";})[0];
      return {res:o.r,body:'<p>'+o.fb+'</p>',reveal:best?best.t:""};
    }
  },
  multi:{
    reset:function(L){L.sel=[];},
    view:function(L,v){
      var h='<div class="opts">';
      v.options.forEach(function(o,i){
        var on=L.sel.indexOf(i)>=0;
        var cls="opt box";
        if(L.phase==="feedback"){ if(on) cls+=o.r==="c"?" r-c":" r-x"; else if(o.r==="c") cls+=" r-p"; }
        h+='<button class="'+cls+'" data-act="tog" data-v="'+i+'" aria-pressed="'+on+'"'+(L.phase==="feedback"?" disabled":"")+'><span class="dot"></span><span>'+o.t+'</span></button>';
      });
      return (v.pic&&L.phase==="answer"?amock(v.pic[0],v.pic[1],v.pic[2]):'')+h+'</div>';
    },
    on:function(act,val,L){ if(act!=="tog")return; val=+val; var i=L.sel.indexOf(val); if(i>=0)L.sel.splice(i,1); else L.sel.push(val); },
    ready:function(L){return L.sel.length>0;},
    evaluate:function(L,v){
      var good=0,need=0,wrong=[],missed=[];
      v.options.forEach(function(o,i){var on=L.sel.indexOf(i)>=0; if(o.r==="c"){need++; if(on)good++; else missed.push(o);} else if(on) wrong.push(o);});
      var res = (good===need&&wrong.length===0)?"c":(good>0?"p":"x");
      var body="";
      if(res==="c") body='<p>'+v.okText+'</p>';
      else{
        wrong.slice(0,1).forEach(function(o){body+='<p>'+o.fb+'</p>';});
        if(missed.length) body+='<p>'+(missed.length===1?"1 step is missing. It is marked in yellow.":missed.length+" steps are missing. They are marked in yellow.")+'</p>';
      }
      return {res:res,body:body,reveal:v.options.filter(function(o){return o.r==="c";}).map(function(o){return o.t;}).join(" ")};
    }
  },
  sort:{
    reset:function(L,v){L.sel=v.items.map(function(){return null;});},
    view:function(L,v){
      var h='<div class="rows">';
      v.items.forEach(function(it,i){
        var cls="row"; if(L.phase==="feedback") cls+= (L.sel[i]===it.ok)?" r-c":" r-x";
        var dis=L.phase==="feedback"?" disabled":"";
        h+='<div class="'+cls+'">'+aic(it.ic,'aic row-ic')+'<span class="txt">'+it.t+'</span><div class="pair" role="group" aria-label="'+esc(it.t)+'">'+
          '<button data-act="set" data-v="'+i+':1" aria-pressed="'+(L.sel[i]===true)+'"'+dis+'>Type it</button>'+
          '<button data-act="set" data-v="'+i+':0" aria-pressed="'+(L.sel[i]===false)+'"'+dis+'>Keep out</button></div></div>';
      });
      return h+'</div>';
    },
    on:function(act,val,L){ if(act!=="set")return; var p=val.split(":"); L.sel[+p[0]]=p[1]==="1"; },
    ready:function(L){return L.sel.every(function(x){return x!==null;});},
    evaluate:function(L,v){
      var wrong=[]; v.items.forEach(function(it,i){if(L.sel[i]!==it.ok)wrong.push(it);});
      var res=wrong.length===0?"c":wrong.length===1?"p":"x";
      var body = res==="c" ? '<p>'+v.okText+'</p>' : '<p><strong>'+wrong[0].t+':</strong> '+wrong[0].why+'</p>'+(wrong.length>1?'<p>'+(wrong.length===2?"1 more answer is wrong. It is marked in red.":(wrong.length-1)+" more answers are wrong. They are marked in red.")+'</p>':'');
      return {res:res,body:body,reveal:"Type in only these details: "+v.items.filter(function(i){return i.ok;}).map(function(i){return i.t;}).join(" and ")+". Keep everything else out."};
    }
  },
  order:{
    reset:function(L,v){L.sel=[]; L.shuf=v.shuffle;},
    view:function(L,v){
      var h='<div class="opts">';
      L.shuf.forEach(function(si){
        var pos=L.sel.indexOf(si);
        var cls="opt";
        if(L.phase==="feedback"){ cls+= (L.okPos&&L.okPos[pos])?" r-c":" r-x"; }
        h+='<button class="'+cls+'" data-act="add" data-v="'+si+'" aria-pressed="'+(pos>=0)+'"'+(L.phase==="feedback"?" disabled":"")+'>'+
          '<span class="num'+(pos<0?" empty":"")+'">'+(pos>=0?pos+1:"")+'</span><span>'+v.steps[si]+'</span></button>';
      });
      h+='</div>';
      if(L.phase==="answer" && L.sel.length) h+='<div><button class="link" data-act="clear" style="padding:0">Clear and start again</button></div>';
      return h;
    },
    on:function(act,val,L){ if(act==="clear"){L.sel=[];return;} if(act!=="add")return; val=+val; var i=L.sel.indexOf(val); if(i>=0) L.sel=L.sel.slice(0,i); else L.sel.push(val); },
    ready:function(L,v){return L.sel.length===v.steps.length;},
    evaluate:function(L,v){
      var match=v.accept.some(function(a){return a.join()===L.sel.join();});
      var ref=v.accept[0];
      L.okPos=L.sel.map(function(s,i){return v.accept.some(function(a){return a[i]===s;});});
      if(match){L.okPos=L.sel.map(function(){return true;});return {res:"c",body:'<p>'+v.okText+'</p>'};}
      var first=L.okPos.indexOf(false);
      var res = L.okPos[0]?"p":"x";
      return {res:res,body:'<p>'+v.why[ref[first]]+'</p>',reveal:ref.map(function(s,i){var t=v.steps[s].replace(/\.$/,"");return i?t.charAt(0).toLowerCase()+t.slice(1):t;}).join(", then ")+"."};
    }
  },
  text:{
    reset:function(L){L.text="";L.showChoices=false;L.sel=null;},
    view:function(L,v){
      var h='<div class="tool"><div class="tool-h"><span class="live"></span>Approved assistant · practice</div><div class="tool-b"><div class="msg me">'+v.stem+' <span class="blank">'+(L.phase==="feedback"&&L.answerShown?esc(L.answerShown):"&nbsp;")+'</span></div></div></div>';
      if(L.phase==="answer"){
        if(!L.showChoices){
          h+='<label class="sr" for="ta">Type the last part of the request</label><textarea id="ta" data-k="ta" placeholder="Type the last part here" maxlength="160">'+esc(L.text)+'</textarea>';
          h+='<div><button class="link" data-act="choices" style="padding:0">Show choices instead</button></div>';
        } else {
          h+='<div class="opts">'+v.choices.map(function(o,i){return '<button class="opt" data-act="sel" data-v="'+i+'" aria-pressed="'+(L.sel===i)+'"><span class="dot"></span><span>'+o.t+'</span></button>';}).join("")+'</div>';
          h+='<div><button class="link" data-act="type" style="padding:0">Type it myself</button></div>';
        }
        if(L.nudge) h+=L.nudge;
      }
      return h;
    },
    on:function(act,val,L){ if(act==="choices"){L.showChoices=true;L.nudge=null;} else if(act==="type"){L.showChoices=false;L.sel=null;} else if(act==="sel"){L.sel=+val;} },
    ready:function(L){return L.showChoices? L.sel!==null : true;},
    evaluate:function(L,v){
      var reveal=v.choices.filter(function(c){return c.r==="c";})[0].t;
      if(L.showChoices){ var o=v.choices[L.sel]; L.answerShown=o.t; return {res:o.r,body:'<p>'+o.fb+'</p>',reveal:reveal}; }
      var t=(L.text||"").trim(); L.answerShown=t;
      if(t.length<2||!/[A-Za-z\u0900-\u097F\u0A80-\u0AFF]/.test(t)) return {res:"empty",html:fbox("n","Take your time.","<p>Type how the answer should look. Say how long it is, or ask for a list. You can also tap Show choices instead.</p>")};
      var low=t.toLowerCase();
      if(/\b\d{10}\b|\b\d{4}\s?\d{4}\s?\d{4}\b|password|passcode|aadhaar|aadhar|\botp\b|\bpin\b|(home|my|house|your|residential|email|e-mail) address|phone|mobile no|roll no|roll number|\bmarks\b/.test(low))
        return {res:"x",body:"<p>That adds personal information. The tool does not need it for this task, so keep it out.</p>",reveal:reveal};
      var shape=/\b(list|lines?|points?|steps?|table|bullets?|numbered|checklist|short|brief|sentences?|words?|paragraph|day[- ]?wise|daily|each day|per day|format|simple|under|within|max|maximum|limit|columns?|rows?|order|one page|half page)\b/;
      /* Hindi and Gujarati shape words: list, line, point, short, steps */
      var shapeIn=/(सूची|लिस्ट|पंक्ति|पंक्तियाँ|लाइन|बिंदु|पॉइंट|छोटा|छोटी|संक्षेप|चरण|यादी|સૂચિ|યાદી|લીટી|લાઇન|મુદ્દા|ટૂંક|પગલાં)/;
      if(shape.test(low)||shapeIn.test(t)) return {res:"c",body:"<p>You told the tool what shape to send back. That makes the answer easier to use and easier to check.</p>"};
      if(/\b(hi|hello|joke|song|movie|film|cricket|match|game|lol)\b/.test(low) && t.split(/\s+/).length<6)
        return {res:"off",html:fbox("n","That is not part of this task.","<p>Stay with the request above. Tell the tool the shape you want, like a short list or a few lines.</p>")};
      return {res:"p",body:"<p>You added to the request, but the shape is still missing. Say how long the answer is, or ask for a list.</p>",reveal:reveal};
    }
  },
  slots:{
    reset:function(L){L.picks=[];},
    view:function(L,v){
      var h='<div class="tool"><div class="tool-h"><span class="live"></span>Your request</div><div class="tool-b"><div class="msg me">';
      v.slots.forEach(function(s,i){
        var p=L.picks[i];
        var cls = (L.phase==="feedback")?(s.opts[p].r==="c"?"":' style="text-decoration:underline wavy var(--bad);text-underline-offset:4px"'):"";
        h+='<span class="part"><span class="pl">'+aic(PART_IC[s.label],'pl-ic')+s.label+'</span>'+(p!=null?'<span'+cls+'>'+s.opts[p].t+'</span>':'<span class="blank">&nbsp;</span>')+'</span>';
      });
      h+='</div></div></div>';
      if(L.phase==="answer"){
        var cur=L.picks.length;
        if(cur<v.slots.length){
          h+='<p style="color:var(--muted);font-size:14px">Part '+(cur+1)+' of 3. Choose the '+v.slots[cur].label.toLowerCase()+'.</p><div class="opts">';
          v.slots[cur].opts.forEach(function(o,i){h+='<button class="opt" data-act="slot" data-v="'+i+'"><span class="dot"></span><span>'+o.t+'</span></button>';});
          h+='</div>';
        }
        if(cur>0) h+='<div><button class="link" data-act="undo" style="padding:0">Change the last part</button></div>';
      }
      return h;
    },
    on:function(act,val,L,v){ if(act==="slot" && L.picks.length<v.slots.length) L.picks.push(+val); else if(act==="undo") L.picks.pop(); },
    ready:function(L,v){return L.picks.length===v.slots.length;},
    evaluate:function(L,v){
      var chosen=v.slots.map(function(s,i){return s.opts[L.picks[i]];});
      var bad=chosen.filter(function(o){return o.r==="x";});
      var weak=chosen.filter(function(o){return o.r==="p";});
      S.built={lane:S.lane,parts:chosen.map(function(o){return o.t;}),ok:bad.length===0&&weak.length===0};
      var reveal=v.slots.map(function(s){return s.opts.filter(function(o){return o.r==="c";})[0].t;}).join(" ");
      if(bad.length) return {res:"x",body:'<p>'+bad[0].fb+'</p>',reveal:reveal};
      if(weak.length) return {res:"p",body:weak.slice(0,2).map(function(o){return '<p>'+o.fb+'</p>';}).join(""),reveal:reveal};
      return {res:"c",body:'<p>'+v.okText+'</p>'};
    }
  },
  spot:{
    reset:function(L){L.sel=[];},
    view:function(L,v){
      var h='<section class="check-pair"><article class="source-note"><h2>Your notes (source)</h2><p>'+v.source+'</p></article>';
      h+='<article class="answer-frame"><h2>'+aic("icon-compare-source",'af-ic')+'Approved assistant · practice</h2><div class="answer-lines">';
      var fbk=L.phase==="feedback";
      v.lines.forEach(function(ln,i){
        var on=L.sel.indexOf(i)>=0, cls="line", note="";
        if(fbk){
          if(!ln.err&&!on) return;
          if(ln.err&&on){cls+=" r-c";note=ln.why;}
          else if(ln.err){cls+=" r-m";note=ln.why;}
          else {cls+=" r-x";note="This matches your notes, so it can stay.";}
        }
        h+='<button class="'+cls+'" data-act="tog" data-v="'+i+'" aria-pressed="'+on+'"'+(fbk?" disabled":"")+'><span class="mk"></span><span>'+ln.t+(note?'<small class="why">'+note+'</small>':'')+'</span></button>';
      });
      return h+'</div></article></section>';
    },
    on:function(act,val,L){ if(act!=="tog")return; val=+val; var i=L.sel.indexOf(val); if(i>=0)L.sel.splice(i,1); else L.sel.push(val); },
    ready:function(L){return L.sel.length>0;},
    evaluate:function(L,v){
      var errs=[],found=[],fp=[];
      v.lines.forEach(function(ln,i){var on=L.sel.indexOf(i)>=0; if(ln.err){errs.push(ln); if(on)found.push(ln);} else if(on) fp.push(ln);});
      S.spot={found:found.length,total:errs.length};
      var body="";
      if(found.length===errs.length && fp.length===0){ return {res:"c",body:'<p>'+v.okText+'</p>'}; }
      body='';
      return {res:found.length?"p":"x",body:body,reveal:"look at the lines marked above."};
    }
  }
};

/* ---------- Reflection (non-scored self-explanation) ---------- */
function makeReflect(cfg){
  return {
    id:cfg.id, cluster:cfg.cluster, next:cfg.next,
    init:function(L){L.sel=null;L.done=false;},
    view:function(L){
      var v=resolve(cfg.v), h=coach(v.coach)+head(v.q).replace('<h1','<h1 class="q" style="font-size:inherit"')+(L.done?'':task("Tap the best reason. Then tap Check my thinking."))+'<div class="opts">';
      v.options.forEach(function(o,i){
        if(L.done&&i!==L.sel) return;
        h+='<button class="opt'+(L.done?" r-"+(o.r||"c"):"")+'" data-act="sel" data-v="'+i+'" aria-pressed="'+(!L.done&&L.sel===i)+'"'+(L.done?" disabled":"")+'><span class="dot"></span><span>'+o.t+'</span></button>';
      });
      h+='</div>';
      if(L.done){ var o=resolve(cfg.v).options[L.sel]; h+=fbox(o.r==="x"?"p":"c",o.r==="x"?"Not quite.":"Yes.",'<p>'+o.fb+'</p>'); }
      return h;
    },
    on:function(a,val,L){ if(!L.done&&a==="sel") L.sel=+val; },
    primary:function(L){ var self=this; if(!L.done) return {label:"Check my thinking",enabled:L.sel!==null,act:function(){L.done=true;log("reflection",{node:cfg.id+"_ANSWERED",choice:L.sel});sfx(resolve(cfg.v).options[L.sel].r!=="x");draw(true);}}; return {label:"Continue",enabled:true,act:function(){goNext(self);}}; }
  };
}

/* ---------- Cluster intro and done screens ---------- */
function makeIntro(k,n,icon,title,line,quick){
  return {id:clId(k,"INTRO"),cluster:k,
    view:function(){return '<div class="hero-ic">'+icon+'</div><p class="kicker">Decision '+n+' of 4</p>'+head(title)+'<p class="lead">'+line+'</p>'+
      (quick?task("Answer this quick question to start.")+kitQuick(quick[0],quick[1]):'');},
    primary:function(){var self=this;return {label:"Start",enabled:true,act:function(){goNext(self);}};}
  };
}
var DONE_H={pick:"You know how to pick the right tool.",setup:"You know how to set up safely.",ask:"You know how to ask clearly.",check:"You know how to check the output."};
function makeDone(k,n,nextLine){
  return {id:clId(k,"DONE"),cluster:k,
    view:function(){
      var c=S.clusters[k];
      if(c.met) return '<div class="badge pop">'+I.check+'</div><p class="kicker">Decision '+n+' of 4 done</p>'+head(DONE_H[k])+'<p class="lead">'+nextLine+'</p>';
      return '<div class="badge pend">'+I.loop+'</div><p class="kicker">Decision '+n+' of 4</p>'+head("You will try this decision again at the end.")+'<p class="lead">'+(c.skipped?"You skipped it for now. ":"")+"At the end, you get a new example for &ldquo;"+clName(k)+"&rdquo;. "+nextLine+'</p>';
    },
    primary:function(){var self=this;return {label:"Continue",enabled:true,act:function(){goNext(self);}};}
  };
}
function clId(k,s){return ({pick:"PICK",setup:"SETUP",ask:"ASK",check:"CHECK"})[k]+"_"+s;}

/* ======================================================================
   CONTENT
   ====================================================================== */
var SC = {};
function add(s){SC[s.id]=s;}

/* --- ENTRY --- */
add({id:"ENTRY_WELCOME",
  view:function(){return coach("Hi. I am your practice coach for this section.")+head("This is your first time with an AI tool.")+
    '<p class="lead">You will make 4 small decisions about using AI for a task. Nothing is graded, and you can try again as often as you need.</p>'+
    '<div class="card" style="display:flex;gap:12px;align-items:center"><span style="color:var(--blue);width:22px;flex:0 0 auto">'+I.clock+'</span><span style="color:var(--ink);font-size:15px">This takes about 30 minutes. You can stop and come back on this device.</span></div>';},
  primary:function(){var self=this;return {label:"Let's start",enabled:true,act:function(){log("segment_start",{});goNext(self);}};}
});
add({id:"ENTRY_LANE",
  init:function(L){L.sel=S.lane;},
  view:function(L){return coach("I will choose examples that fit your place of study.")+head("Where will you try AI first?")+task("Tap the place that fits you.")+
    '<div class="opts">'+[["iti","ITI workshop and trade practicals","scene-iti-workshop.webp"],["he","College classes and campus work","scene-campus.webp"]].map(function(o){return '<button class="opt opt-scene" data-act="sel" data-v="'+o[0]+'" aria-pressed="'+(L.sel===o[0])+'"><span class="dot"></span><img class="scene" src="'+AP()+''+o[2]+'" alt="" aria-hidden="true"><span>'+o[1]+'</span></button>';}).join("")+'</div>'+
    '<p style="font-size:14px;color:var(--muted)">This only changes the examples. The skills are the same.</p>';},
  on:function(a,v,L){if(a==="sel")L.sel=v;},
  primary:function(L){var self=this;return {label:"Continue",enabled:!!L.sel,act:function(){S.lane=L.sel;log("lane_selected",{lane:L.sel});goNext(self);}};}
});
add({id:"ENTRY_ASSETS",
  init:function(L){L.sel=S.assets.slice();L.done=false;},
  view:function(L){
    var opts=["I follow instructions carefully","I notice small details","I use a phone every day","I have taught someone to use an app","I am not sure yet"];
    var h=coach("First, tell me what you already bring.")+head("Which of these sound like you?")+(L.done?'':task("Tap every sentence that fits you. Then tap Share."))+
      '<div class="chips">'+opts.map(function(o,i){return '<button class="chip" data-act="tog" data-v="'+i+'" aria-pressed="'+(L.sel.indexOf(i)>=0)+'"'+(L.done?" disabled":"")+'>'+o+'</button>';}).join("")+'</div>';
    if(L.done){
      var t = L.sel.indexOf(1)>=0 ? "Noticing small details is the main skill in this course. You already have it." :
              L.sel.indexOf(0)>=0 ? "Careful instructions matter here. Clear instructions get you useful answers from AI." :
              L.sel.indexOf(4)>=0||L.sel.length===0 ? "That is fine. Using AI well needs careful everyday habits. You will build them here." :
              "Those skills count. Using AI well needs careful everyday habits, not technical skill.";
      h+=coach(t,true);
    }
    return h;},
  on:function(a,v,L){if(L.done||a!=="tog")return;v=+v;var i=L.sel.indexOf(v);if(i>=0)L.sel.splice(i,1);else L.sel.push(v);},
  primary:function(L){var self=this; if(!L.done) return {label:"Share",enabled:L.sel.length>0,act:function(){S.assets=L.sel.slice();L.done=true;log("assets_shared",{picks:L.sel});draw(true);}}; return {label:"Continue",enabled:true,act:function(){goNext(self);}};}
});
add({id:"ENTRY_FEELING",
  init:function(L){L.sel=null;L.done=false;},
  view:function(L){
    var o=[["Curious","Good. Curiosity is a great start. Every task today is small."],
           ["Unsure","That is normal on day 1. Every decision is small, and you can try again."],
           ["Worried that I will do something wrong","A question cannot break the tool. The real risks are what you type and what you trust. You will practise both today."],
           ["I have tried one before","Good. Today you add the habits for safe, real work. You use the right tool, and you check the answer."]];
    var h=coach("Here is 1 honest question. There is no wrong answer.")+head("How do you feel about using an AI tool?")+(L.done?'':task("Tap the answer that fits you."))+'<div class="opts">';
    o.forEach(function(x,i){ if(L.done&&i!==L.sel)return; h+='<button class="opt" data-act="sel" data-v="'+i+'" aria-pressed="'+(L.sel===i)+'"'+(L.done?" disabled":"")+'><span class="dot"></span><span>'+x[0]+'</span></button>';});
    h+='</div>'; if(L.done) h+=coach(o[L.sel][1],true); return h;},
  on:function(a,v,L){if(!L.done&&a==="sel")L.sel=+v;},
  primary:function(L){var self=this; if(!L.done) return {label:"Tell the coach",enabled:L.sel!==null,act:function(){S.feeling=L.sel;L.done=true;log("feeling_shared",{choice:L.sel});draw(true);}}; return {label:"Continue",enabled:true,act:function(){goNext(self);}};}
});
var PRED=["Typing a clever question","Picking the fastest tool","Checking the answer before you use it","Using AI for as many tasks as possible"];
add({id:"ENTRY_PREDICT",
  init:function(L){L.sel=null;L.done=false;},
  view:function(L){
    var h=coach("Make a guess before we start. I will not mark it.")+head("Which step matters most when you use AI for a task?")+(L.done?'':task("Tap your guess. Then tap Lock in my guess."))+'<div class="opts">';
    PRED.forEach(function(t,i){ if(L.done&&i!==L.sel)return; h+='<button class="opt" data-act="sel" data-v="'+i+'" aria-pressed="'+(L.sel===i)+'"'+(L.done?" disabled":"")+'><span class="dot"></span><span>'+t+'</span></button>';});
    h+='</div>'; if(L.done) h+=coach("I saved your guess. We will look at it again at the end.",true); return h;},
  on:function(a,v,L){if(!L.done&&a==="sel")L.sel=+v;},
  primary:function(L){var self=this; if(!L.done) return {label:"Lock in my guess",enabled:L.sel!==null,act:function(){S.prediction=L.sel;L.done=true;log("prediction_made",{choice:L.sel});draw(true);}}; return {label:"Continue",enabled:true,act:function(){goNext(self);}};}
});

/* --- PRETRAINING --- */
function termScreen(id,coachT,title,terms){
  return {id:id,
    init:function(L){L.open=[];},
    view:function(L){
      return coach(coachT)+head(title)+task("Tap each word to see what it means.")+'<div class="terms">'+terms.map(function(t,i){
        var on=L.open.indexOf(i)>=0;
        return '<button class="term" data-act="open" data-v="'+i+'" aria-expanded="'+on+'"><span class="ic">'+t[0]+'</span><span><b>'+t[1]+'</b>'+(on?'<span class="d">'+t[2]+'</span>':'<span class="hint">Tap to see what it means</span>')+'</span></button>';
      }).join("")+'</div>'+terms.map(function(t,i){return (t[3]&&L.open.indexOf(i)>=0)?amock(t[3],t[4],'term-mock'):'';}).join("");},
    on:function(a,v,L){if(a==="open"&&L.open.indexOf(+v)<0)L.open.push(+v);},
    primary:function(L){var self=this;return {label:L.open.length<terms.length?"Open both words":"Continue",enabled:L.open.length===terms.length,act:function(){goNext(self);}};}
  };
}
add(termScreen("PRETRAIN_TERMS_TOOL","Here are 2 words first. You will see them in every decision today.","These 2 words tell you where to use AI.",[
  [I.shield,"Approved tool","Your institute or facilitator lists this AI tool for you. Someone has checked where your information goes.","mock-approved-list.webp","Example: an institute notice that lists the approved AI tools."],
  [I.user,"Permitted account","This is the login you may use, usually your own institute account. It is not a friend's account or a random new one."]]));
add(termScreen("PRETRAIN_TERMS_TASK","Here are 2 more words. Then you will see how they fit together.","These 2 words tell you what goes in and out.",[
  [I.msg,"Request","The request is what you type to the tool. It has the task, only the needed details and the shape you want back."],
  [I.doc,"Output","The output is the answer that the tool sends back. It can look neat and sure and still have mistakes."]]));
var FLOWN=[
  [I.me,"You","You have a small, ordinary task, like a reminder or a checklist."],
  [I.msg,"Request","You write what you need, with only the details the task needs."],
  [I.shield,"Approved tool","You send it to an approved tool. You sign in with your own account."],
  [I.doc,"Output","The tool answers in seconds. A fast answer is not always right."],
  [I.search,"Check","You compare the answer with your source. You fix it or ask again before you use it."],
  [I.send,"Use","Only now do you copy it, send it or act on it."]];
add({id:"PRETRAIN_FLOW",
  init:function(L){L.at=0;L.max=0;},
  view:function(L){
    var h=coach("Here is the whole path, step by step.")+head("Every AI task follows the same 6 steps.")+task("Tap Next step to see each step on the path.")+'<div class="flow" role="list">';
    FLOWN.forEach(function(n,i){ h+='<button class="node'+(i===L.at?" cur":i<L.at?" seen":"")+(i===4?" key":"")+'" role="listitem" data-act="go" data-v="'+i+'" aria-current="'+(i===L.at)+'"><span class="c">'+n[0]+'</span><span>'+n[1]+'</span></button>'; });
    h+='</div><div class="card flow-cap"><p style="color:var(--ink);font-size:15.5px"><strong>'+FLOWN[L.at][1]+'.</strong> '+FLOWN[L.at][2]+'</p></div>';
    return h;},
  on:function(a,v,L){if(a==="go"&&+v<=L.max+1){L.at=+v;L.max=Math.max(L.max||0,L.at);}},
  primary:function(L){var self=this; L.max=L.max||0; if(L.at<FLOWN.length-1) return {label:"Next step",enabled:true,act:function(){L.at++;L.max=Math.max(L.max,L.at);draw();}}; return {label:"Continue",enabled:true,act:function(){goNext(self);}};}
});

/* --- CLUSTER 1: PICK THE TOOL --- */
add(makeIntro("pick",1,I.shield,"Decision 1 is to pick the right tool.","There are many AI apps. Only some are approved for you, and your account matters too.",
  ["Which AI apps can you use for your work?",[["Any app that is free to use.",0,"Not quite. A free app is not always an approved app."],["Only the apps that are approved for you.",1,"Yes. Only some AI apps are approved for you."]]]));
add(makeItem({id:"PICK_TOOL",cluster:"pick",kind:"mcq",variants:[
  {coach:"Here is a situation you might meet this week.",
   scenario:{iti:"Your instructor asks the batch to prepare a tool issue list before Friday's practical. You want AI help to make it neat.",he:"You want AI help to turn your assignment instructions into a simple checklist."},
   q:"Which AI tool and account do you use?",
   clue:"Start from your institute's list, and use your own login.",
   options:[
    {img:"mock-app-approved.webp",t:"Use the assistant on your institute's approved list. Sign in with your institute account.",r:"c",fb:"The tool is approved, and the account is permitted. Your institute knows where your information goes, and the work is in your name."},
    {img:"mock-app-group.webp",t:"Use a new app from a group chat. It asks to see your contacts.",r:"x",fb:"An unknown app that asks for your contacts is a warning sign. It is not on your approved list, so nobody has checked where your information goes."},
    {img:"mock-app-ad.webp",t:"Use a website from an ad. It promises free answers with no login.",r:"x",fb:"Free with no login sounds easy, but your institute has not checked it. Easy to use does not mean approved."}]},
  {retryCoach:"Here is a new situation. The decision is the same.",
   scenario:{iti:"Arjun from your batch offers you his account on the approved assistant. He is already signed in. You need a reminder for your practical session.",he:"A senior offers you their account on the college's approved assistant. They are already signed in. You need a project checklist."},
   q:"What do you do?",
   clue:"Check 2 things every time: the tool and the owner of the account.",
   options:[
    {t:"Use their account. The tool is approved, so it is fine.",r:"x",fb:"The tool is approved, but the account is not yours. Your work and everything you type go under another person's name."},
    {t:"Sign in with your own institute account on the same approved tool.",r:"c",fb:"This is the right tool and the right account. What you type stays with you and follows your institute's rules."},
    {t:"Make a new personal account on a different app instead.",r:"x",fb:"This takes you away from the approved tool. The account is yours, but nobody has checked the tool."}]}
]}));
add(makeItem({id:"PICK_APPROVED",cluster:"pick",kind:"mcq",variants:[
  {coach:"Now, how do you know which tool is approved?",
   q:"How do you know that a tool is approved for you?",
   clue:"Approval comes from your institute, not from other users.",
   options:[
    {t:"It has high ratings in the app store.",r:"x",fb:"Ratings show that people like it. They do not show that your institute checked it."},
    {t:"It is on the list from your institute or facilitator.",r:"c",fb:"That list is the approval. If you cannot find the list, ask your facilitator for it."},
    {t:"Most people in your class already use it.",r:"x",fb:"Popular does not mean approved. A whole class can use the wrong tool."}]},
  {retryCoach:"Here is a harder one.",
   scenario:{iti:"The approved assistant does not open in the workshop. Sana suggests an app with almost the same name and a similar logo.",he:"The approved assistant does not open in the library. Sana suggests an app with almost the same name and a similar logo."},
   q:"What do you do?",
   pic:["mock-lookalike-app.webp","A real app named on the institute list next to a sponsored lookalike app. Same look. Not the same app.","wide"],
   clue:"A lookalike app is not the listed tool, even if it looks the same.",
   options:[
    {t:"Use the lookalike app. It is almost the same.",r:"x",fb:"Lookalike apps copy names and logos on purpose. It is not the tool on your list."},
    {t:"Tell your facilitator that it does not open. Use only the link on the approved list.",r:"c",fb:"You stay on the approved tool, and your facilitator learns about the access problem."},
    {t:"Search for the name and pick the top result.",r:"x",fb:"Top search results can be ads or copies. Use the approved list, not a search."}]}
]}));
add(makeReflect({id:"PICK_WHY",cluster:"pick",v:{
  coach:"Stop for a moment. Explain the idea to yourself.",
  q:"Why does an approved tool matter?",
  options:[
    {t:"Approved tools always give correct answers.",r:"x",fb:"Approval does not make answers correct. Approved tools still make mistakes, so you will check answers later today."},
    {t:"Someone has checked where your information goes and what the rules are.",r:"c",fb:"Approval is about your information and your institute's rules. It does not promise that the answers are right."},
    {t:"Approved tools are faster.",r:"x",fb:"Approval is not about speed. It is about where your information goes and the rules you follow."}]}}));
add(makeDone("pick",1,"Next, you will learn to set up safely."));

/* --- CLUSTER 2: SET UP SAFELY --- */
add(makeIntro("setup",2,I.settings,"Decision 2 is to set up safely.","The first setup takes a few minutes. Do it once, the right way, on the device you have.",
  ["What is the best way to do the first setup?",[["Do it fast, and fix problems later.",0,"Not quite. Setup takes only a few minutes, so do it right."],["Do it once, and do it the right way.",1,"Yes. You do it once, so take a few minutes to do it right."]]]));
add({id:"SETUP_DEVICE",cluster:"setup",
  init:function(L){L.sel=null;},
  view:function(L){
    var o=["Yes, on my own phone or computer","Yes, on a shared or lab device","No, I cannot get access yet","No, I am only practising here"];
    return coach("First, tell me about your device. Your answer decides the next step.")+head("Can you open the approved tool right now?")+task("Tap the answer that is true for you.")+
      '<div class="opts">'+o.map(function(t,i){return '<button class="opt" data-act="sel" data-v="'+i+'" aria-pressed="'+(L.sel===i)+'"><span class="dot"></span>'+aic(["icon-device-own","icon-device-shared","icon-device-noaccess","icon-device-practice"][i])+'<span>'+t+'</span></button>';}).join("")+'</div>';},
  on:function(a,v,L){if(a==="sel")L.sel=+v;},
  primary:function(L){return {label:"Continue",enabled:L.sel!==null,act:function(){
    S.device=["own","shared","none","practice"][L.sel]; log("device_branch",{node:"SETUP_DEVICE_"+S.device.toUpperCase()});
    show(S.device==="shared"?"SETUP_SHARED":S.device==="none"?"SETUP_NOACCESS":"SETUP_ORDER");}};}
});
add(makeItem({id:"SETUP_SHARED",cluster:"setup",kind:"multi",next:"SETUP_ORDER",variants:[
  {coach:"Shared devices are common. They need 1 extra habit.",
   scenario:{iti:"You used the approved assistant on the workshop computer to draft a tool issue list. The next trainee is waiting.",he:"You used the approved assistant on a library computer to plan your study week. The next student is waiting."},
   q:"What do you do before the next person uses it?",
   pic:["mock-save-password.webp","A browser asks to save the password. Tap Never. The account menu shows Sign out.","wide"],
   clue:"Think about what the next person could see or use.",
   okText:"You signed out, closed the chat and did not save the password. The next person starts clean, and your account stays yours.",
   options:[
    {t:"Sign out of your account.",r:"c",fb:""},
    {t:"Close or clear the chat you started.",r:"c",fb:""},
    {t:"Say no when the browser offers to save your password.",r:"c",fb:""},
    {t:"Stay signed in so the next person saves time.",r:"x",fb:"Staying signed in lets the next person use your account and read your chats."}]},
  {retryCoach:"Here is a new situation on a shared phone.",
   scenario:{iti:"Your batch shares one phone for the approved assistant during practicals. Your turn is over.",he:"Your project group shares one phone for the approved assistant. Your turn is over."},
   q:"What do you do before you give the phone to the next person?",
   pic:["mock-save-password.webp","A browser asks to save the password. Tap Never. The account menu shows Sign out.","wide"],
   clue:"Your account and your chat must not stay on the phone.",
   okText:"Your account and your chat stay with you, not with the phone.",
   options:[
    {t:"Sign out of the assistant.",r:"c",fb:""},
    {t:"Leave your chat open so others can reuse your request.",r:"x",fb:"An open chat shows everything you typed. Share a request by telling people, not by leaving your account open."},
    {t:"Close the chat you started.",r:"c",fb:""},
    {t:"Check that the app did not save your password.",r:"c",fb:""}]}
]}));
add(makeItem({id:"SETUP_NOACCESS",cluster:"setup",kind:"mcq",next:"SETUP_NOACCESS_NOTE",variants:[
  {coach:"Many people have no access at first. Here is what to do.",
   q:"The approved tool asks for a login that you do not have. What do you do first?",
   clue:"Access problems go to the people who manage access.",
   options:[
    {t:"Ask your facilitator or the institute help desk how to get access.",r:"c",fb:"They can set up a permitted account for you. A borrowed login or a guess puts you on the wrong account or the wrong tool."},
    {t:"Borrow a friend's login for today.",r:"x",fb:"A friend's login is not a permitted account for you. Your work goes under their name."},
    {t:"Create an account on any other AI app.",r:"x",fb:"That takes you off the approved list. Nobody has checked that tool."}]},
  {retryCoach:"Here is another access problem.",
   q:"Your institute account works everywhere except in the AI assistant. What do you do now?",
   clue:"Report it, then wait for the fix.",
   options:[
    {t:"Tell your facilitator exactly what you see, and wait for a fix.",r:"c",fb:"A clear report gets it fixed faster, and you stay on approved tools."},
    {t:"Use the free version of any AI app until it is fixed.",r:"x",fb:"A free app is not on your approved list, even for a short time."},
    {t:"Keep trying different passwords until one works.",r:"x",fb:"Repeated wrong passwords can lock your account. Report it instead."}]}
]}));
add({id:"SETUP_NOACCESS_NOTE",cluster:"setup",
  view:function(){return '<div class="hero-ic">'+I.pen+'</div>'+head("You can still practise every decision here.")+
    '<p class="lead">Every decision in this drill works without the real tool. Before you go on, write down who you will ask for access.</p>'+
    task("Tap the person you will ask. Then write it down.")+
    kitQuick("Who will you ask for access?",[["A friend who already has a login.",0,"Not quite. A friend's login is not a permitted account for you."],["My facilitator or the institute help desk.",1,"Yes. They manage access, so they can set up your account."]]);},
  primary:function(){var self=this;return {label:"Continue",enabled:true,act:function(){show("SETUP_ORDER");}};}
});
add(makeItem({id:"SETUP_ORDER",cluster:"setup",kind:"order",variants:[
  {coach:"Now do the setup itself. The order matters.",
   q:"Put the setup steps in the right order.",
   clue:"Do nothing until you are on the right tool and the right account.",
   okText:"First the right tool, then your account. Then you check that it is really you, and you start a new chat.",
   steps:["Start a new chat.","Open the tool from the approved link.","Check that your own name shows.","Sign in with your institute account."],
   okPic:["mock-check-your-name.webp","Example: your own name and institute account show in the AI tool. Check your name here.","wide"],
   shuffle:[0,2,1,3], accept:[[1,3,2,0]],
   why:{1:"Start by opening the tool from the approved link. Everything else happens inside it.",3:"You sign in right after you open the tool. You need your own account before anything else.",2:"Check the name on the account before you type anything. It shows that you are not in another person's account.",0:"A new chat comes last, when you know the tool and the account are right."}},
  {retryCoach:"Here is the first setup on a phone.",
   q:"Put the phone setup steps in the right order.",
   clue:"Your first request should be something small and ordinary.",
   okText:"Install the app from the list and sign in. Then learn the rules and start small.",
   steps:["Try 1 small, ordinary request.","Read the rules on what not to type.","Install the app on the approved list.","Sign in with your institute account."],
   shuffle:[1,0,3,2], accept:[[2,3,1,0],[2,1,3,0]],
   why:{2:"First install the app named on your list, not one from a search.",3:"Sign in with your institute account before you use the app.",1:"Read the rules before your first request, so you know what to keep out.",0:"Your first request comes last, and it should be small."}}
]}));
add(makeItem({id:"SETUP_INFO",cluster:"setup",kind:"sort",variants:[
  {coach:"Setup has 1 more habit. Give the tool only what the task needs.",
   q:{iti:"You are making a tool issue list. Which details do you type in?",he:"You are making an assignment checklist. Which details do you type in?"},
   clue:"Ask yourself if the task needs this detail to work.",
   okText:"Only task details went in. Personal details and passwords never go in.",
   items:{iti:[
     {ic:"icon-safe-tools",t:"Tools needed: 6 files, 2 hacksaws",ok:true,why:"The list needs the tool names and counts."},
     {ic:"icon-private-aadhaar",t:"Your Aadhaar number",ok:false,why:"A tool list does not need your identity number. It never goes into an AI tool."},
     {ic:"icon-safe-time",t:"Practical on Friday, 10 am",ok:true,why:"The time is part of the task. It helps the list make sense."},
     {ic:"icon-private-password",t:"Your account password",ok:false,why:"You never type a password into a chat, for any task."},],
    he:[
     {ic:"icon-safe-topic",t:"Topic: water conservation",ok:true,why:"The checklist needs the topic to make sense."},
     {ic:"icon-private-marks",t:"Your roll number and last term's marks",ok:false,why:"Marks and roll numbers are personal records. The checklist does not need them."},
     {ic:"icon-safe-topic",t:"Word limit: 1500 words",ok:true,why:"The word limit is part of the task."},
     {ic:"icon-private-password",t:"Your email password",ok:false,why:"You never type a password into a chat, for any task."},]}},
  {retryCoach:"Here is a new task with new details. The question is the same.",
   q:{iti:"You are making a cleaning checklist. Which details do you type in?",he:"You are making notes for a college quiz. Which details do you type in?"},
   clue:"Personal details and records stay out, even when they seem to fit.",
   okText:"Task details go in, and personal details stay out. That is the habit.",
   items:{iti:[
     {ic:"icon-safe-workshop",t:"Workshop has 10 benches",ok:true,why:"The checklist needs to know what there is to clean."},
     {ic:"icon-private-password",t:"Your bank OTP",ok:false,why:"An OTP is a password in another form. It never goes into any chat."},
     {ic:"icon-safe-time",t:"Clean-up starts at 4 pm",ok:true,why:"The time is part of the task."},
     {ic:"icon-private-id",t:"A photo of your ID card",ok:false,why:"A cleaning checklist does not need your ID card."},],
    he:[
     {ic:"icon-safe-time",t:"Quiz: Friday, 4 pm",ok:true,why:"The date and time are the main part of the notes."},
     {ic:"icon-private-phone",t:"Your phone number",ok:false,why:"The notes do not need your phone number."},
     {ic:"icon-safe-topic",t:"Teams of 3",ok:true,why:"The team size is part of the event details."},
     {ic:"icon-private-health",t:"Your medical certificate details",ok:false,why:"Health information never goes into an AI tool."},]}}
]}));
add(makeDone("setup",2,"Next, you will learn to ask clearly."));

/* --- CLUSTER 3: ASK CLEARLY (worked -> faded -> full) --- */
add(makeIntro("ask",3,I.msg,"Decision 3 is to ask clearly.","A good first request is small and ordinary. You will see one, finish one and then build your own.",
  ["What makes a good first request?",[["It is long and asks for many things.",0,"Not quite. A first request should be small and ordinary."],["It is small and ordinary.",1,"Yes. A small, ordinary request is easy to check."]]]));
var WORKED={
  iti:{task:"Turn these notes into a short reminder for my batch's class group.",details:"Notes: practical Friday 10 am, Workshop 2, bring record book and safety shoes.",shape:"Keep it to 4 short lines."},
  he:{task:"Turn these notes into a short message for my class group.",details:"Notes: seminar Wednesday 3 pm, Room 204, register by Monday.",shape:"Keep it under 50 words."}};
add({id:"ASK_WORKED",cluster:"ask",
  init:function(L){L.n=0;},
  view:function(L){
    var w=WORKED[S.lane||"iti"], parts=[["Task",w.task],["Details",w.details],["Shape",w.shape]];
    var notes=["The task says what you want done, in one sentence.","The details give only what the task needs. Nothing personal goes in.","The shape says how long the answer is, or what form it takes. This makes it easy to check."];
    var h=coach("Here is a request that someone wrote. See how it is built.")+head("A good request has 3 parts.")+(L.n<3?task("Tap Show part to see each part of the request."):'')+
      '<div class="tool"><div class="tool-h"><span class="live"></span>Approved assistant · practice</div><div class="tool-b"><div class="msg me">';
    parts.forEach(function(p,i){h+='<span class="part"><span class="pl">'+aic(PART_IC[p[0]],'pl-ic')+p[0]+'</span>'+(i<L.n?p[1]:'<span class="skel" aria-label="Hidden until revealed"></span>')+'</span>';});
    h+='</div></div></div>';
    h+='<div class="card" style="min-height:58px"><p style="color:var(--ink);font-size:15.5px">'+(L.n===0?"There are 3 parts. You see them one at a time.":notes[L.n-1])+'</p></div>';
    return h;},
  primary:function(L){var self=this; if(L.n<3) return {label:L.n===0?"Show part 1":"Show part "+(L.n+1),enabled:true,act:function(){L.n++;draw();}}; return {label:"Continue",enabled:true,act:function(){goNext(self);}};}
});
add(makeReflect({id:"ASK_WHY",cluster:"ask",v:{
  coach:"Explain this to yourself before you try one.",
  q:{iti:"Why does the request end with 'Keep it to 4 short lines'?",he:"Why does the request end with 'Keep it under 50 words'?"},
  options:[
    {t:"It makes the tool work faster.",r:"x",fb:"Speed is not the reason. The shape makes the answer fit the job, and it makes the answer quick to check."},
    {t:"It makes the answer come back in a form you can use and check.",r:"c",fb:"A short answer with a clear shape is easier to send. It is also much easier to compare with your notes."},
    {t:"AI only understands exact numbers.",r:"x",fb:"AI understands ordinary language too. The number only makes the shape clear."}]}}));
add(makeItem({id:"ASK_FADED",cluster:"ask",kind:"text",variants:[
  {coach:"Now it is your turn. I wrote most of it, and you finish the last part.",
   q:"Add the shape. How should the answer look?",
   clue:"Say how long it should be, or give a form like a list, a few lines or a table.",
   stem:{iti:"Make a checklist for closing the workshop from these steps: switch off machines, clean the bench, return tools to the store, sign the register.",he:"Make a study plan for my maths test from these topics: limits, derivatives, integration. I have 5 days."},
   choices:[
     {t:{iti:"Give it as a numbered list of short steps.",he:"Show it as a day-wise plan in short lines."},r:"c",fb:"That tells the tool exactly what shape to send back."},
     {t:"Make it really good.",r:"p",fb:"'Really good' does not tell the tool the shape you need. Say how long it is, or what form."},
     {t:"Add my home address so it is personal.",r:"x",fb:"This task does not need your address. Personal details stay out."}]},
  {retryCoach:"Here is a new request. The same part is missing.",
   q:"Add the shape to this request.",
   clue:"Try words like 'in 3 lines', 'as a list' or 'under 40 words'.",
   stem:{iti:"Write a note to the store keeper listing the tools our batch returned today: 6 files, 2 hacksaws.",he:"Summarise these assignment instructions: 1500 words, due 20 October, cite 3 sources."},
   choices:[
     {t:{iti:"Keep it to 3 short lines.",he:"Give it as 3 short points."},r:"c",fb:"The shape is clear. The answer will be short and easy to check."},
     {t:"Whatever you think is best.",r:"p",fb:"That leaves the shape to the tool. Tell it what you need."},
     {t:"Include my roll number so they know it is me.",r:"x",fb:"This task does not need your roll number. It stays out."}]}
]}));
add(makeItem({id:"ASK_BUILD",cluster:"ask",kind:"slots",variants:[
  {coach:"Now build a whole request. Pick one part at a time.",
   q:{iti:"Build a request for a day-end workshop cleaning checklist.",he:"Build a request for a one-week exam study timetable."},
   clue:"Each part has 1 job. Say the task, give only the needed details, and name the shape.",
   okText:"The task is clear, the details are only what it needs, and the shape is easy to check. That is a strong first request.",
   slots:{iti:[
     {label:"Task",opts:[{t:"Make a day-end cleaning checklist for our workshop.",r:"c"},{t:"Tell me about workshops.",r:"p",fb:"'Tell me about workshops' is too broad. The task should say exactly what you want made."},{t:"Do my work.",r:"p",fb:"'Do my work' does not say what the work is. Name the task."}]},
     {label:"Details",opts:[{t:"It has 10 benches, 2 lathe areas and one tool store.",r:"c"},{t:"Here is my ITI login and password, so you can see our timetable.",r:"x",fb:"A password never goes into a chat. The checklist does not need your login."},{t:"No details needed.",r:"p",fb:"Without details, the tool will guess what your workshop has. Give it what the task needs."}]},
     {label:"Shape",opts:[{t:"Give it as 6 to 8 short points.",r:"c"},{t:"Make it perfect.",r:"p",fb:"'Perfect' is not a shape. Say how long it is, or what form."},{t:"Whatever you like.",r:"p",fb:"That leaves the shape to the tool. Name it yourself."}]}],
    he:[
     {label:"Task",opts:[{t:"Plan a one-week study timetable for my first-semester exams.",r:"c"},{t:"Tell me about exams.",r:"p",fb:"'Tell me about exams' is too broad. Say exactly what you want made."},{t:"Do my studying for me.",r:"p",fb:"The tool can plan with you. It cannot study for you. Name a task it can do."}]},
     {label:"Details",opts:[{t:"Subjects: English, Physics, Maths. Classes end at 2 pm.",r:"c"},{t:"Here are my marks and roll number from last term.",r:"x",fb:"Marks and roll numbers are personal records. A timetable does not need them."},{t:"No details needed.",r:"p",fb:"Without your subjects and times, the tool will guess. Give it what the task needs."}]},
     {label:"Shape",opts:[{t:"Show it as a day-wise table.",r:"c"},{t:"Make it amazing.",r:"p",fb:"'Amazing' is not a shape. Say what form you want."},{t:"Whatever you like.",r:"p",fb:"That leaves the shape to the tool. Name it yourself."}]}]}},
  {retryCoach:"Here is a new task. Build the request again.",
   q:{iti:"The practical has moved. Build a request for a message to your batch.",he:"Build a request for joining notes for tech fest volunteers."},
   clue:"Check the details part. Is anything personal in it?",
   okText:"It is clear, short and easy to check. Use this pattern for every request.",
   slots:{iti:[
     {label:"Task",opts:[{t:"Write a message telling my batch the practical time has changed.",r:"c"},{t:"Write something.",r:"p",fb:"'Write something' does not say what to write. Name the task."},{t:"Fix my week.",r:"p",fb:"This is too broad. Name the one task you want done."}]},
     {label:"Details",opts:[{t:"Practical moved from 10 am to 2 pm on Friday, same workshop.",r:"c"},{t:"Add all 24 trainees' phone numbers so it reaches everyone.",r:"x",fb:"Other people's phone numbers never go into an AI tool. The message does not need them."},{t:"It is about a change.",r:"p",fb:"This is too vague. The tool needs the old time and the new time."}]},
     {label:"Shape",opts:[{t:"Keep it to 3 short lines.",r:"c"},{t:"Make it sound nice.",r:"p",fb:"'Nice' is not a shape. Say how long it is."},{t:"As long as you want.",r:"p",fb:"People skip long messages. Name a short shape."}]}],
    he:[
     {label:"Task",opts:[{t:"Write joining notes for tech fest volunteers.",r:"c"},{t:"Write something.",r:"p",fb:"'Write something' does not say what to write. Name the task."},{t:"Run the fest for me.",r:"p",fb:"This is too broad. Name the one task you want done."}]},
     {label:"Details",opts:[{t:"Volunteers meet 8 am at Gate 1 and wear the event T-shirt.",r:"c"},{t:"Include each volunteer's home address.",r:"x",fb:"Other people's addresses never go into an AI tool. The notes do not need them."},{t:"It is about the fest.",r:"p",fb:"This is too vague. The tool needs the time, the place and what to wear."}]},
     {label:"Shape",opts:[{t:"Give it as 5 short points.",r:"c"},{t:"Make it cool.",r:"p",fb:"'Cool' is not a shape. Say what form you want."},{t:"As long as you want.",r:"p",fb:"People skip long notes. Name a short shape."}]}]}}
]}));
add({id:"ASK_SEND",cluster:"ask",
  init:function(L){L.stage=0;},
  view:function(L){
    var parts = S.built&&S.built.ok&&S.built.lane===S.lane ? S.built.parts : null;
    var w=WORKED[S.lane||"iti"];
    var req = parts ? parts.join(" ") : (w.task+" "+w.details+" "+w.shape);
    var h=coach(L.stage<2?"Now send a request and see the answer.":"It answered in seconds. A fast answer is not always right.")+head(L.stage<2?"Send your request to the tool.":"Is this answer right?")+(L.stage===0?task("Tap Send request."):'')+
      '<div class="tool"><div class="tool-h"><span class="live"></span>Approved assistant · practice</div><div class="tool-b">';
    if(L.stage>=1) h+='<div class="msg me">'+esc(req)+'</div>';
    if(L.stage===1) h+='<div class="msg ai"><span class="typing" aria-label="Tool is typing"><i></i><i></i><i></i></span></div>';
    if(L.stage>=2) h+='<div class="msg ai">Here is your answer. I kept it short and in the shape you asked for.</div>';
    h+='</div></div>';
    if(L.stage===0) h+='<p style="font-size:14px;color:var(--muted)">This is only practice. Nothing is sent anywhere.</p>';
    if(L.stage>=2) h+='<p class="lead">Next, you will check an answer like this, line by line.</p>';
    return h;},
  primary:function(L){var self=this;
    if(L.stage===0) return {label:"Send request",enabled:true,act:function(){L.stage=1;draw();log("request_sent_sim",{});setTimeout(function(){if(S.cur==="ASK_SEND"&&L.stage===1){L.stage=2;draw();}},1200);}};
    if(L.stage===1) return {label:"Waiting",enabled:false,act:function(){}};
    return {label:"Continue",enabled:true,act:function(){goNext(self);}};}
});
add(makeDone("ask",3,"Next, you will learn the most important step. You check the answer."));

/* --- CLUSTER 4: CHECK THE OUTPUT --- */
add(makeIntro("check",4,I.search,"Decision 4 is to check the output.","The tool has answered. Check the answer every time, before you copy it, send it or act on it.",
  ["When do you check an AI answer?",[["Only when it looks wrong.",0,"Not quite. A neat answer can still be wrong."],["Every time, before I use it.",1,"Yes. You check every answer before you copy, send or act on it."]]]));
/* ESL upgrade: the 3 moves were shown one by one with the main button; now the student puts them in order (order kit). */
var ROUTINE=["Compare the answer with your source, not with the tool.","Spot anything added, like fees, rules or promises.","Decide: use it, fix it or do not use it."];
add({id:"CHECK_ROUTINE",cluster:"check",
  view:function(){
    return coach("A basic check has 3 moves.")+head("Make 3 moves before you use an AI answer.")+
      '<p class="lead">Your source is your notes, the notice or the instructions. The tool is never your source.</p>'+task("Put the 3 moves in the right order. Then tap Check the order.")+
      '<div class="saa-kit" data-kit="order" data-theme="'+KT()+'" data-required><ol class="saa-steps">'+
      ROUTINE.map(function(r,i){return '<li data-n="'+(i+1)+'">'+aic(["icon-compare-source","icon-spot-added","icon-decide"][i])+r+'</li>';}).join("")+'</ol>'+
      '<p class="saa-k-why" data-right="Yes. Compare first, then spot anything added, then decide." data-wrong="Not yet. You can only decide after you compare and spot."></p></div>';},
  primary:function(){var self=this; return {label:"Continue",enabled:true,act:function(){goNext(self);}};}
});
add({id:"CHECK_PREDICT",cluster:"check",
  init:function(L){L.sel=null;L.done=false;},
  view:function(L){
    var o=["None, it looks neat","1","2 or more","I cannot guess"];
    var h=coach("Next, you will see the tool's answer for the worked example. First, make a guess.")+head("How many mistakes do you expect in a short AI answer?")+(L.done?'':task("Tap your guess. Then tap Lock in my guess."))+'<div class="chips">';
    o.forEach(function(t,i){h+='<button class="chip" data-act="sel" data-v="'+i+'" aria-pressed="'+(L.sel===i)+'"'+(L.done?" disabled":"")+'>'+t+'</button>';});
    h+='</div>'; if(L.done) h+=coach("Now find out. Use the 3 moves.",true); return h;},
  on:function(a,v,L){if(!L.done&&a==="sel")L.sel=+v;},
  primary:function(L){var self=this; if(!L.done) return {label:"Lock in my guess",enabled:L.sel!==null,act:function(){S.mistakeGuess=L.sel;L.done=true;log("prediction_made",{node:"CHECK_PREDICT",choice:L.sel});draw(true);}}; return {label:"Continue",enabled:true,act:function(){goNext(self);}};}
});
add(makeItem({id:"CHECK_SPOT",cluster:"check",kind:"spot",variants:[
  {coach:"Compare each line with your notes.",
   q:"Which lines are wrong or not in your notes?",
   clue:"Check times and numbers first. Then look for anything the notes never mention.",
   source:{iti:"Practical Friday 10 am, Workshop 2. Bring record book and safety shoes.",he:"Seminar Wednesday 3 pm, Room 204. Register by Monday."},
   hint:"Look again for anything the notes never mentioned.",
   okText:"You found both mistakes. The tool filled a gap with something that sounds right.",
   lines:{iti:[
     {t:"Reminder for our batch: practical on Friday."},
     {t:"Time: 11 am in Workshop 2.",err:true,why:"The notes say 10 am, not 11 am."},
     {t:"Bring your record book and safety shoes."},
     {t:"Also bring ₹100 for materials.",err:true,why:"The notes do not mention a ₹100 fee. The tool made it up."}],
    he:[
     {t:"Dear classmates, there is a seminar on Wednesday at 3 pm."},
     {t:"Venue: Room 402.",err:true,why:"The notes say Room 204, not 402."},
     {t:"Please register by Monday."},
     {t:"Certificates will be given to all who attend.",err:true,why:"The notes do not mention certificates. The tool added that."}]}},
  {retryCoach:"Here is a different answer. Use the same 3 moves.",
   q:"Which lines are wrong or not in the notes?",
   clue:"Compare every number, one by one.",
   source:{iti:"Tool issue: 6 vernier callipers, 4 files, 2 try squares. Return by Thursday.",he:"Project: survey draft by 12 Oct, data collection 13 to 20 Oct, report due 27 Oct."},
   hint:"Compare every number one by one, then look for anything extra.",
   okText:"You found both mistakes. That is why you check.",
   lines:{iti:[
     {t:"Vernier callipers: 6"},
     {t:"Files: 4, try squares: 4",err:true,why:"The notes say 2 try squares, not 4."},
     {t:"Return all tools by Thursday."},
     {t:"Late returns are fined ₹20 per day.",err:true,why:"The notes do not mention a fine. The tool made it up."}],
    he:[
     {t:"Survey draft: 12 Oct"},
     {t:"Data collection: 13 to 20 Oct"},
     {t:"Report due: 25 Oct",err:true,why:"The notes say 27 Oct, not 25 Oct."},
     {t:"Group presentation on 30 Oct.",err:true,why:"The notes do not mention a presentation. The tool added it."}]}}
]}));
add(makeItem({id:"CHECK_ACTION",cluster:"check",kind:"mcq",variants:[
  {coach:"You found the problems. Now decide.",
   q:{iti:"The reminder has the wrong time. What do you do before you send it to the class group?",he:"The message has the wrong room. What do you do before you send it to the class group?"},
   clue:"Your source is the notes, not the tool.",
   options:[
    {t:"Send it anyway. People will ask if something is not clear.",r:"x",fb:"Some people will not ask. They will go at the wrong time or to the wrong room."},
    {t:"Fix it with your notes, and then send it.",r:"c",fb:"The notes are your source. Fix the detail from your notes, and then it is ready to use."},
    {t:"Ask the tool 'Are you sure?' and send whatever it says.",r:"x",fb:"The tool can sound sure and still be wrong. You check by comparing with your source, not by asking the tool again."}]},
  {retryCoach:"Here is a different problem. Decide again.",
   q:{iti:"The tool added a ₹100 fee that is not in your notes. What do you do now?",he:"The tool promised certificates that are not in your notes. What do you do now?"},
   clue:"If a real source does not confirm it, do not send it.",
   options:[
    {t:"Keep it. It might be true.",r:"x",fb:"'It might be true' is not enough. People will act on it."},
    {t:"Remove it, unless your instructor or the notice confirms it.",r:"c",fb:"Remove anything that a real source does not confirm."},
    {t:"Add a line saying 'AI-written, may be wrong' and send it.",r:"x",fb:"A warning line does not fix the wrong detail. People will still act on it."}]}
]}));
add(makeDone("check",4,"Next, you will do a short mixed round."));

/* --- MIXED REVIEW (interleaving, single attempt, explained) --- */
function makeMix(id,cluster,v){
  return {id:id,cluster:cluster,
    init:function(L){L.sel=null;L.done=false;},
    view:function(L){
      var x=resolve(v), h=coach(x.coach)+head(x.q).replace('<h1','<h1 class="q" style="font-size:inherit"')+(L.done?'':task("Tap one answer. Then tap Check."))+'<div class="opts">';
      x.options.forEach(function(o,i){ if(L.done&&i!==L.sel)return; h+='<button class="opt'+(L.done?" r-"+o.r:"")+'" data-act="sel" data-v="'+i+'" aria-pressed="'+(!L.done&&L.sel===i)+'"'+(L.done?" disabled":"")+'><span class="dot"></span><span>'+o.t+'</span></button>';});
      h+='</div>';
      if(L.done){ var o=x.options[L.sel], best=x.options.filter(function(q){return q.r==="c";})[0];
        h+=fbox(o.r,o.r==="c"?"Yes.":"Not quite.",'<p>'+o.fb+'</p>'+(o.r!=="c"?'<p class="clue">The best answer is this: '+best.t+'</p>':"")); }
      return h;},
    on:function(a,val,L){if(!L.done&&a==="sel")L.sel=+val;},
    primary:function(L){var self=this,x=resolve(v); if(!L.done) return {label:"Check",enabled:L.sel!==null,act:function(){L.done=true;var r=x.options[L.sel].r;if(r==="c")markMet(cluster,id);sfx(r==="c");log("answer_submitted",{node:id+"_"+(r==="c"?"CORRECT":"INCORRECT"),attempt:1});draw(true);}}; return {label:"Continue",enabled:true,act:function(){goNext(self);}};}
  };
}
add({id:"MIX_INTRO",
  view:function(){return '<div class="hero-ic">'+I.mix+'</div>'+head("This round mixes all 4 decisions.")+'<p class="lead">You answer 3 quick questions from all 4 decisions. Mixing them helps you remember the habits.</p>';},
  primary:function(){var self=this;return {label:"Start the round",enabled:true,act:function(){goNext(self);}};}
});
add(makeMix("MIX_TOOL","pick",{coach:"This one is from Decision 1.",q:"A friend sends you a link to a 'better AI' app. What do you ask yourself first?",
  options:[{t:"Is it faster?",r:"x",fb:"Speed is not the first question. First, ask if it is approved for you."},
           {t:"Is it on my approved list?",r:"c",fb:"That is always the first check, whoever sends the link."},
           {t:"Do my friends use it?",r:"x",fb:"Your friends using it does not make it approved."}]}));
add(makeMix("MIX_ASK","ask",{coach:"This one is from Decisions 2 and 3.",q:"Which request gives the tool only what it needs?",
  options:{iti:[{t:"Here is my login and password. Make me a checklist.",r:"x",fb:"A password never goes in. The checklist does not need your login."},
           {t:"Make a 5-point checklist for closing the workshop: machines off, bench clean, tools returned, register signed.",r:"c",fb:"It has the task, the needed details and the shape. Nothing personal is in it."},
           {t:"Help.",r:"x",fb:"'Help' gives the tool nothing to work with."}],
           he:[{t:"Here is my student ID and password. Make me a study plan.",r:"x",fb:"A password never goes in. The plan does not need your ID."},
           {t:"Make a 5-day study plan for limits, derivatives and integration, as short daily lines.",r:"c",fb:"It has the task, the needed details and the shape. Nothing personal is in it."},
           {t:"Help.",r:"x",fb:"'Help' gives the tool nothing to work with."}]}}));
add(makeMix("MIX_CHECK","check",{coach:"This one is from Decision 4.",q:"The answer looks neat and sure. Can you use it now?",
  options:[{t:"Yes. Neat usually means correct.",r:"x",fb:"You saw that a neat answer can still have a wrong time, room or number."},
           {t:"Yes, if it is short.",r:"x",fb:"Short answers can still be wrong. You still need to check them."},
           {t:"Only after I compare it with my source.",r:"c",fb:"You compare it, spot anything added, and then decide."}]}));

/* --- RECAP --- */
add({id:"RECAP_PREDICT",
  view:function(){
    var g=S.prediction, gt=g!=null?PRED[g]:"No guess";
    var right = g===2;
    var sp=S.spot, sl = sp?('<span class="saa-work">'+"You found "+sp.found+" of "+sp.total+" mistakes in the tool's answer."+'</span>'):""; /* a live count: shown, not narrated */
    return coach("Do you remember your guess from the start?")+head(right?"Your guess was right.":"Here is what today showed.")+
      '<div class="card"><p style="font-size:14px;color:var(--muted)">You guessed</p><p style="color:var(--ink);font-weight:600">'+esc(gt)+'</p></div>'+
      '<p class="lead">'+(right?"Checking the answer before you use it matters most. ":"The step that matters most is checking the answer before you use it. ")+'The tool answered in seconds and still got details wrong. '+sl+'</p>';},
  primary:function(){var self=this;return {label:"Continue",enabled:true,act:function(){goNext(self);}};}
});
var RETRY_NODE={pick:"PICK_TOOL",setup:"SETUP_INFO",ask:"ASK_BUILD",check:"CHECK_SPOT"};
add({id:"RECAP_STATUS",
  view:function(){
    var unmet=CL.filter(function(c){return !S.clusters[c.k].met;});
    var h=coach(unmet.length?"You are nearly there. Try "+(unmet.length===1?"this decision":"these decisions")+" 1 more time.":"You showed all 4 decisions.")+head("Here are your 4 decisions.")+'<div class="status">';
    CL.forEach(function(c){var m=S.clusters[c.k].met;
      h+='<div class="st '+(m?"met":"not")+'"><span class="s-ic">'+(m?I.check:I.loop)+'</span><b>'+c.name+'</b><small>'+(m?"Shown":"Not yet")+'</small></div>';});
    h+='</div>';
    if(unmet.length) h+='<div><button class="link" data-act="finish" style="padding:0">Finish for now and come back later</button></div>';
    return h;},
  on:function(a){ if(a==="finish"){ log("finish_partial",{}); show("RECAP_TAKEAWAY"); return "nav"; } },
  primary:function(){var self=this;var unmet=CL.filter(function(c){return !S.clusters[c.k].met;});
    if(unmet.length) return {label:"Try one more: "+unmet[0].name.toLowerCase(),enabled:true,act:function(){S.retryFor=unmet[0].k;log("recap_retry",{cluster:unmet[0].k});show(RETRY_NODE[unmet[0].k]);}};
    return {label:"Continue",enabled:true,act:function(){goNext(self);}};}
});
add({id:"RECAP_TAKEAWAY",
  view:function(){
    var t=[["Approved tool, your own account","Check the approved list. Sign in with your own account."],["Only what the task needs","Give the task, the needed details and the shape. Leave out anything personal."],["Check before you use it","Compare with your source. Spot anything added. Then decide."]];
    /* ESL upgrade: the 3 static habit rows are now tap-to-open cards (reveal kit) */
    return coach("Take these 3 habits with you.")+head("Keep these 3 habits every time you use AI.")+task("Tap each habit to see what it means.")+
      '<div class="saa-kit" data-kit="reveal" data-theme="'+KT()+'" data-required><div class="saa-cards">'+t.map(function(r,i){return '<button class="saa-card" type="button"><span class="saa-front">'+aic(["icon-rule-approved","icon-rule-private","icon-rule-read"][i],'aic habit-ic')+r[0]+'</span><span class="saa-back">'+r[1]+'</span></button>';}).join("")+'</div></div>';},
  primary:function(){var self=this;return {label:"Finish",enabled:true,act:function(){goNext(self);}};}
});
add({id:"END_COMPLETE",
  init:function(){ var all=CL.every(function(c){return S.clusters[c.k].met;}); if(!S.complete){S.complete=all; log(all?"segment_complete":"segment_exit_partial",{met:CL.filter(function(c){return S.clusters[c.k].met;}).length});} },
  view:function(){
    var met=CL.filter(function(c){return S.clusters[c.k].met;}).length, all=met===4;
    return '<div class="badge pop'+(all?"":" pend")+'">'+(all?I.check:I.loop)+'</div><p class="kicker">'+(all?"Practice complete":"Saved for later")+'</p>'+
      head(all?"You made all 4 decisions.":"You made "+met+" of 4 decisions.")+
      '<p class="lead">'+(all?"You picked an approved tool, set up safely, asked clearly and checked the output before you used it.":"Your progress is saved on this device. Come back to finish the rest when you are ready.")+'</p>'+
      '<div class="lead-link"><button class="link" data-act="again" style="padding:0">'+(all?"Practise again with new examples":"Go back to the decisions")+'</button></div>';},
  on:function(a){ if(a==="again"){ if(S.complete){ var lane0=S.lane; var keep=S.rot; S=fresh(); S.lane=lane0; S.rot=keep; log("segment_restart",{}); show("PICK_INTRO",false); } else show("RECAP_STATUS"); return "nav"; } },
  primary:function(){return {label:"Return to Section 1.1",enabled:true,act:function(){toast("In the live course, this button takes you back to the Section 1.1 page.");}};}
});

/* ---------- Flow order ---------- */
var FLOW=["ENTRY_WELCOME","ENTRY_LANE","ENTRY_ASSETS","ENTRY_FEELING","ENTRY_PREDICT",
  "PRETRAIN_TERMS_TOOL","PRETRAIN_TERMS_TASK","PRETRAIN_FLOW",
  "PICK_INTRO","PICK_TOOL","PICK_APPROVED","PICK_WHY","PICK_DONE",
  "SETUP_INTRO","SETUP_DEVICE","SETUP_ORDER","SETUP_INFO","SETUP_DONE",
  "ASK_INTRO","ASK_WORKED","ASK_WHY","ASK_FADED","ASK_BUILD","ASK_SEND","ASK_DONE",
  "CHECK_INTRO","CHECK_ROUTINE","CHECK_PREDICT","CHECK_SPOT","CHECK_ACTION","CHECK_DONE",
  "MIX_INTRO","MIX_TOOL","MIX_ASK","MIX_CHECK",
  "RECAP_PREDICT","RECAP_STATUS","RECAP_TAKEAWAY","END_COMPLETE"];
var BRANCH_POS={SETUP_SHARED:"SETUP_DEVICE",SETUP_NOACCESS:"SETUP_DEVICE",SETUP_NOACCESS_NOTE:"SETUP_DEVICE"};

/* ======================================================================
   NAVIGATION + CHROME
   ====================================================================== */
var stage=document.getElementById("stage"), primaryBtn=document.getElementById("primary"),
    backBtn=document.getElementById("backBtn"), skipBtn=document.getElementById("skipBtn"),
    ov=document.getElementById("overlay"), buildTag=document.getElementById("buildTag"), segsEl=document.getElementById("segs"), warmEl=document.getElementById("warm");
var currentPrimary=null;

function goNext(sc){
  if(S.retryFor && sc.scored){ S.retryFor=null; show("RECAP_STATUS"); return; }
  if(sc.next){ show(sc.next); return; }
  var i=FLOW.indexOf(sc.id); if(i>=0&&i<FLOW.length-1) show(FLOW[i+1]);
}
function show(id,push){
  if(!SC[id]){ techError("Missing node "+id); return; }
  if(push!==false && S.cur && S.cur!==id) S.history.push(S.cur);
  if(S.history.length>80) S.history=S.history.slice(-80);
  S.cur=id; L={}; if(SC[id].init) SC[id].init(L);
  log("node_view",{node:id+"_VIEW"}); draw(false,true); save(); resetIdle();
}
function draw(focusFeedback,newScreen){
  var sc=SC[S.cur];
  var keep=document.activeElement&&document.activeElement.getAttribute?document.activeElement.getAttribute("data-k"):null;
  try{
    stage.innerHTML='<div class="screen"'+(newScreen?'':' style="animation:none"')+'>'+sc.view(L)+'</div>';
    splitScreen(stage.firstElementChild);
    voMark(stage.firstElementChild);
  }catch(e){ techError(e&&e.message); return; }
  var ta=stage.querySelector("textarea");
  if(ta){ ta.addEventListener("input",function(){L.text=ta.value;L.nudge=null;chrome();}); if(keep==="ta"){ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length);} }
  chrome();
  if(newScreen){ var h=document.getElementById("h"); if(h) h.focus({preventScroll:true}); }
  else if(focusFeedback){ var f=stage.querySelector(".fb,.coach.reply"); if(f){f.setAttribute("tabindex","-1");f.focus({preventScroll:true});} else primaryBtn.focus(); }
  fitCheck();
  clearTimeout(draw._f1); clearTimeout(draw._f2);
  draw._f1=setTimeout(fitCheck,180); draw._f2=setTimeout(fitCheck,800);
}
/* ESL upgrade: coach line, heading, short text and the task line go LEFT; the activity and its feedback go RIGHT.
   Below 900px wide the two columns use display:contents, so the phone keeps the one-column order. */
var LEADQ=".coach:not(.reply), .scenario, h1, .kicker, .lead, .hero-ic, .badge, .do, .lead-link";
function splitScreen(scr){
  if(!scr) return;
  var kids=Array.prototype.slice.call(scr.children);
  var lead=kids.filter(function(k){return k.matches(LEADQ);}), work=kids.filter(function(k){return !k.matches(LEADQ);});
  if(!lead.length||!work.length) return;
  var l=document.createElement("div"), r=document.createElement("div"); l.className="fc-l"; r.className="fc-r";
  lead.forEach(function(k){l.appendChild(k);}); work.forEach(function(k){r.appendChild(k);});
  scr.appendChild(l); scr.appendChild(r); scr.classList.add("fc-split");
}
/* narration markers (saa-upgrade narrate.js): the screen is a page, the left column is read.
   The activity column and the coach line of a scored item (hidden when space is tight) are never read,
   so the text is the same at every size. After Check the screen is not narrated (the feedback is on screen). */
function voMark(scr){
  if(!scr) return;
  var sc=SC[S.cur];
  scr.setAttribute("data-saa-page","");
  var l=scr.querySelector(":scope > .fc-l"), r=scr.querySelector(":scope > .fc-r");
  var fb=scr.querySelector(".fb");
  if(fb && ((sc.scored && L.phase==="feedback") || L.done)) fbSay(fb);
  else if(l) l.setAttribute("data-saa-lead","");
  if(r) r.classList.add("saa-work");
  Array.prototype.forEach.call(scr.querySelectorAll(".coach.soft"),function(c){c.classList.add("saa-work");});
}
/* after Check the feedback is read aloud: its title and its first line (counts and the clue box are only shown) */
function fbSay(fb){
  fb.setAttribute("data-saa-lead","");
  var box=fb.querySelector(":scope > div"); if(!box) return;
  var t=box.querySelector(":scope > b"); if(t) t.setAttribute("data-saa-say","");
  var ps=box.querySelectorAll(":scope > p");
  Array.prototype.forEach.call(ps,function(p,i){ if(i===0&&!p.classList.contains("clue")) p.setAttribute("data-saa-say",""); });
}
function chrome(){
  var sc=SC[S.cur];
  currentPrimary=sc.primary?sc.primary(L):{label:"Continue",enabled:true,act:function(){goNext(sc);}};
  primaryBtn.innerHTML=esc(currentPrimary.label)+(currentPrimary.enabled?I.arrow:"");
  primaryBtn.disabled=!currentPrimary.enabled;
  backBtn.disabled=S.history.length===0;
  skipBtn.hidden=!(sc.scored && L.phase==="answer");
  // progress
  var pos=FLOW.indexOf(BRANCH_POS[S.cur]||S.cur);
  var ci=CL.map(function(c){return c.k;}).indexOf(sc.cluster);
  var ranges=CL.map(function(c){var ids=FLOW.filter(function(f){return SC[f].cluster===c.k;});return [FLOW.indexOf(ids[0]),FLOW.indexOf(ids[ids.length-1])];});
  segsEl.innerHTML=CL.map(function(c,i){
    var r=ranges[i], pct = pos>r[1]?100 : pos<r[0]?0 : Math.round(((pos-r[0]+1)/(r[1]-r[0]+1))*100);
    if(S.retryFor===c.k) pct=100;
    return '<div class="seg'+(i===ci?" on":"")+'"><div class="bar"><i style="width:'+pct+'%"></i></div><div class="lbl">'+(S.clusters[c.k].met?I.check:"")+'<span class="full">'+c.name+'</span><span class="short">'+c.short+'</span></div></div>';
  }).join("");
  warmEl.textContent = pos>=0 && pos<FLOW.indexOf("PICK_INTRO") ? "Warm-up, "+(pos+1)+" of 8" : pos>=FLOW.indexOf("MIX_INTRO") ? "Review" : "";
  updateBuild();
}
function fitCheck(){
  /* 1. show the coach line when it fits; drop it when space is tight.
     2. safety net for very small screens or large text: scroll only if content still overflows. */
  stage.classList.remove("tight"); stage.style.overflowY="hidden"; stage.style.justifyContent="center";
  if(stage.scrollHeight>stage.clientHeight+2) stage.classList.add("tight");
  var over=stage.scrollHeight>stage.clientHeight+2;
  stage.style.overflowY = over?"auto":"hidden"; stage.style.justifyContent = over?"flex-start":"center";
}
window.addEventListener("resize",fitCheck);

stage.addEventListener("click",function(e){
  var b=e.target.closest("[data-act]"); if(!b||b.disabled) return;
  var sc=SC[S.cur]; if(!sc.on) return;
  var r=sc.on(b.getAttribute("data-act"),b.getAttribute("data-v"),L,sc.variant?sc.variant(L):null);
  resetIdle();
  if(r==="nav") return;
  var k=b.getAttribute("data-act")+":"+b.getAttribute("data-v");
  draw();
  var again=stage.querySelector('[data-act="'+b.getAttribute("data-act")+'"][data-v="'+b.getAttribute("data-v")+'"]');
  if(again && !again.disabled) again.focus({preventScroll:true});
});
primaryBtn.addEventListener("click",function(){ if(currentPrimary&&currentPrimary.enabled){resetIdle();currentPrimary.act();} });
backBtn.addEventListener("click",function(){ if(!S.history.length)return; var p=S.history.pop(); log("nav_back",{to:p}); show(p,false); });
skipBtn.addEventListener("click",openSkip);
document.getElementById("helpBtn").addEventListener("click",openHelp);

/* ---------- Overlays ---------- */
function openSheet(html,onBind){
  ov.innerHTML='<div class="ov" role="dialog" aria-modal="true"><div class="sheet">'+html+'</div></div>';
  var appEl=document.getElementById("app"); if(appEl) appEl.setAttribute("inert","");
  var first=ov.querySelector("button,textarea"); if(first) first.focus();
  ov.querySelector(".ov").addEventListener("click",function(e){ if(e.target.classList.contains("ov")) closeSheet(); });
  if(onBind) onBind(ov);
}
function closeSheet(){ ov.innerHTML=""; var appEl=document.getElementById("app"); if(appEl) appEl.removeAttribute("inert"); primaryBtn.focus(); }
document.addEventListener("keydown",function(e){
  if(e.key==="Escape"&&ov.innerHTML) closeSheet();
  if(e.key==="Tab"&&ov.innerHTML){   /* keep Tab inside the open sheet */
    var f=Array.prototype.filter.call(ov.querySelectorAll("button,textarea,input,a[href]"),function(x){return !x.disabled&&x.getClientRects().length;});
    if(!f.length) return;
    var a=f[0], z=f[f.length-1];
    if(!ov.contains(document.activeElement)){ e.preventDefault(); a.focus(); }
    else if(e.shiftKey&&document.activeElement===a){ e.preventDefault(); z.focus(); }
    else if(!e.shiftKey&&document.activeElement===z){ e.preventDefault(); a.focus(); }
  }
});

function openSkip(){
  var sc=SC[S.cur], reasons=["I already know this well","I can't use a device right now","Something isn't working","I'll come back to it later"], sel=null;
  function render(){
    openSheet('<h2>Do you want to skip this decision?</h2><p>Tell me why. It helps your facilitator plan. You will get this decision again at the end.</p><div class="opts">'+
      reasons.map(function(r,i){return '<button class="opt" data-r="'+i+'" aria-pressed="'+(sel===i)+'"><span class="dot"></span><span>'+r+'</span></button>';}).join("")+
      '</div><div class="acts"><button class="link" data-x="cancel">Keep going</button><button class="cta" data-x="ok"'+(sel===null?" disabled":"")+'>Skip this decision</button></div>',function(root){
        root.querySelectorAll("[data-r]").forEach(function(b){b.addEventListener("click",function(){sel=+b.getAttribute("data-r");render();root.querySelector('[data-r="'+sel+'"]').focus();});});
        root.querySelector('[data-x="cancel"]').addEventListener("click",closeSheet);
        root.querySelector('[data-x="ok"]').addEventListener("click",function(){
          if(sel===null)return; S.clusters[sc.cluster].skipped=reasons[sel]; log("skip_with_reason",{node:sc.id+"_SKIPPED",reason:reasons[sel]}); closeSheet();
          if(sel===2){ techError("Reported from skip"); return; }
          if(S.retryFor){ S.retryFor=null; show("RECAP_STATUS"); return; }
          show(clId(sc.cluster,"DONE"));
        });
      });
  }
  render();
}
function openHelp(){
  log("help_opened",{});
  openSheet('<h2>Help</h2><div class="hlist">'+
    '<button class="hbtn" data-h="how">How this works<small>Tap an answer, then tap the yellow button. After a wrong answer, you get a new example.</small></button>'+
    '<button class="hbtn" data-h="access">I cannot open the AI tool<small>Ask your facilitator or the institute help desk. You can still practise every decision here.</small></button>'+
    '<button class="hbtn" data-h="shared">I am on a shared device<small>Sign out and close your chat. Do not let the browser save your password.</small></button>'+
    '<button class="hbtn" data-h="broken">Something is not working<small>See what to do, and get a code to share.</small></button>'+
    '<button class="hbtn" data-h="build">'+(S.build?"Hide":"Show")+' build notes<small>This shows node IDs and analytics events for the production team.</small></button>'+
    '</div><dl class="meta"><dt>Schema</dt><dd>AAI-E-MC1-S01-BOT01</dd><dt>Section</dt><dd>1.1 First Contact</dd><dt>Mapped PC</dt><dd>PC 1.1 to 1.5</dd><dt>Duration</dt><dd>0.5 hours, practical</dd><dt>Non-compensatory</dt><dd>Not flagged in workbook</dd></dl>'+
    '<div class="acts"><button class="link" data-h="restart">Start over</button><button class="cta" data-h="close">Back to practice</button></div>',function(root){
      root.querySelectorAll("[data-h]").forEach(function(b){b.addEventListener("click",function(){
        var h=b.getAttribute("data-h");
        if(h==="close"||h==="how"||h==="access"||h==="shared"){closeSheet();}
        else if(h==="broken"){closeSheet();techError("Reported from help");}
        else if(h==="build"){S.build=!S.build;save();closeSheet();updateBuild();}
        else if(h==="restart"){ if(confirmRestart()){ store.clear(); S=fresh(); closeSheet(); show("ENTRY_WELCOME",false);} }
      });});
    });
}
function confirmRestart(){ return true; }
function techError(msg){
  var code="E-BOT01-"+(S.cur||"UNKNOWN");
  log("technical_error",{node:S.cur+"_ERROR",detail:String(msg||"")});
  openSheet('<div class="hero-ic" style="width:52px;height:52px">'+I.alert+'</div><h2>Something went wrong on this screen.</h2>'+
    '<p>Your progress is saved on this device. Reload the page to go back to where you stopped.</p><p>If it happens again, tell your facilitator and share this code.</p><p class="mono" style="color:var(--ink);font-size:14px">'+esc(code)+'</p>'+
    '<div class="acts"><button class="link" data-e="reload">Reload page</button><button class="cta" data-e="ok">Keep going</button></div>',function(root){
      root.querySelector('[data-e="reload"]').addEventListener("click",function(){location.reload();});
      root.querySelector('[data-e="ok"]').addEventListener("click",function(){closeSheet(); if(!stage.innerHTML) show("ENTRY_WELCOME",false);});
    });
}
function toast(t){var el=document.getElementById("toast");el.textContent=t;el.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(function(){el.hidden=true;},3200);}

/* ---------- Inactive session ---------- */
var idleT=null, IDLE_MS=120000;
function resetIdle(){ clearTimeout(idleT); idleT=setTimeout(idlePrompt,IDLE_MS); }
function idlePrompt(){
  if(ov.innerHTML) return;
  log("inactive_prompt",{node:S.cur+"_IDLE"});
  openSheet('<h2>Are you still there?</h2><p>Take your time. Your progress is saved on this device, so you can also stop and come back later.</p><div class="acts"><button class="cta" data-i="ok">Keep going</button></div>',function(root){
    root.querySelector('[data-i="ok"]').addEventListener("click",function(){log("inactive_resumed",{});closeSheet();resetIdle();});
  });
}
["keydown","pointerdown"].forEach(function(ev){document.addEventListener(ev,resetIdle,{passive:true});});

/* ---------- Build notes ---------- */
function updateBuild(){
  if(!S.build){buildTag.hidden=true;return;}
  var last=S.events[S.events.length-1];
  buildTag.hidden=false;
  buildTag.textContent=S.cur+(last?"  |  "+last.event+(last.node&&last.node!==S.cur?" "+last.node:""):"")+"  |  events: "+S.events.length;
}

/* ---------- Start / resume ---------- */
/* Help is drawn last in the header, so it comes last when you press Tab */
setTimeout(function(){ var hb=document.getElementById("helpBtn"); if(hb&&hb.parentNode) hb.parentNode.appendChild(hb); },400);
(function start(){
  var saved=store.get();
  if(saved && saved.cur && saved.cur!=="ENTRY_WELCOME" && SC[saved.cur]){
    S=Object.assign(fresh(),saved);
    show(S.cur,false);
    openSheet('<h2>Do you want to go on from where you stopped?</h2><p>You were on '+(clName(SC[S.cur].cluster)?"<strong>"+clName(SC[S.cur].cluster)+"</strong>":"the warm-up")+'.</p><div class="acts"><button class="link" data-s="new">Start again</button><button class="cta" data-s="go">Continue</button></div>',function(root){
      root.querySelector('[data-s="go"]').addEventListener("click",function(){log("session_resumed",{});closeSheet();});
      root.querySelector('[data-s="new"]').addEventListener("click",function(){store.clear();S=fresh();closeSheet();show("ENTRY_WELCOME",false);});
    });
  } else { show("ENTRY_WELCOME",false); }
})();
})();
