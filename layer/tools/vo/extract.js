// node extract.js "<game dir>" [--print]
// Visits every screen of a game, takes the narration text exactly as the player reads it (window.SAA_VO),
// plus every fixed kit feedback line, and writes <game>/audio/vo/texts.json  { key: {text, kind, screens} }.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const dir=process.argv[2], print=process.argv.includes('--print');
const find=(d)=>{let o=null;(function wk(x,dep){if(dep>3||o)return;const fl=fs.readdirSync(x);if(fl.includes('index.html')){o=path.join(x,'index.html');return}for(const f of fl){const p=path.join(x,f);if(fs.statSync(p).isDirectory()&&!/^(rulebook-site|section-check-site|audio|assets|node_modules)$/.test(f))wk(p,dep+1)}})(d,0);return o};
(async()=>{
 const idx=find(dir); if(!idx){console.log('no index.html');return}
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+idx,{waitUntil:'load',timeout:20000});await p.waitForTimeout(700);
 if(!await p.evaluate(()=>!!window.SAA_VO)){console.log('no narration module');await b.close();return}
 await p.evaluate(()=>{const s=document.getElementById('saa-start');if(s){const g=s.querySelector('.saa-go');if(g)g.click()}});await p.waitForTimeout(700);
 const n=await p.evaluate(()=>{window.__S=SAA_VO.pages();window.__H=window.__S.some(e=>e.hasAttribute('hidden'));return window.__S.length});
 const out={};const add=(t,kind,i)=>{if(!t)return;const k=t.key;out[k]=out[k]||{text:t.text,kind,screens:[]};if(i!=null&&!out[k].screens.includes(i))out[k].screens.push(i)};
 for(let i=0;i<Math.max(n,1);i++){
  if(n) await p.evaluate(i=>{if(window.Deck){Deck.go(i);return}
     window.__S.forEach((s,k)=>{const on=k===i;['active','show','is-active','current','on'].forEach(c=>s.classList.toggle(c,on));if(window.__H)s.hidden=!on;});},i);
  await p.waitForTimeout(250);
  const r=await p.evaluate(i=>{const pg=window.__S.length?window.__S[i]:SAA_VO.current();const x=pg&&SAA_VO.info(pg);return x?{key:x.key,text:x.text}:null},i);
  add(r,'screen',i+1);
 }
 const fbs=await p.evaluate(()=>SAA_VO.fbTexts());
 for(const [k,t] of Object.entries(fbs)) if(!out[k]) out[k]={text:t,kind:'feedback',screens:[]};
 const vo=path.join(path.dirname(idx),'audio','vo');fs.mkdirSync(vo,{recursive:true});
 fs.writeFileSync(path.join(vo,'texts.json'),JSON.stringify(out,null,1)+'\n');
 const sc=Object.values(out).filter(o=>o.kind==='screen');
 console.log(path.basename(dir).padEnd(40),'screens',n,'clips',sc.length,'feedback',Object.keys(out).length-sc.length,'words',sc.reduce((a,o)=>a+o.text.split(' ').length,0),errs.length?'ERR '+errs[0]:'');
 if(print) for(const o of sc) console.log('  ['+o.screens.join(',')+'] '+o.text);
 await b.close();
})();
