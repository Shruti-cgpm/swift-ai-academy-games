const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
const defs=[['Pixel 7',devices['Pixel 7']],['Small 360x640',{viewport:{width:360,height:640},hasTouch:true,isMobile:true,deviceScaleFactor:2,userAgent:devices['Pixel 7'].userAgent}]];
for(const [name,dev] of defs){
const ctx=await b.newContext(dev);const p=await ctx.newPage();p.setDefaultTimeout(5000);
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto((process.env.GAME_URL||'file://'+process.cwd()+'/index.html'));
const notes=[];let where='';
const hs=async i=>{const r=await p.evaluate(()=>{const s=document.querySelector('.step.on');return [document.documentElement.scrollWidth-innerWidth,s.scrollWidth-s.clientWidth]});if(r[0]>0||r[1]>0)notes.push(`s${i}:hscroll ${r}`)};
const nx=async()=>{where='next '+await p.evaluate(()=>document.getElementById('count').textContent);await p.tap('#next');await p.waitForTimeout(150)};
try{
where='start';await p.tap('#startBtn');await p.waitForTimeout(700);
where='s1';await p.tap('#chips .choice >> nth=1');await hs(1);await nx();
where='s2 tab';await p.tap('.seg-b[data-t=ph]');const st=await p.evaluate(()=>[document.querySelector('.seg-b[data-t=ph]').getAttribute('aria-pressed'),!document.querySelector('.steps3[data-for=ph]').hidden]);if(st[0]!=='true'||!st[1])notes.push('s2 phone tab did not switch '+st);await hs(2);await nx();
where='s3 copy';await p.tap('#copyPrompt');where='s3 paste';await p.fill('#resp1','A pasted answer that is long enough to pass.');await hs(3);await nx();
where='s4 quote';await p.tap('#quote');await p.waitForTimeout(300);const mo=await p.evaluate(()=>!document.getElementById('ansModal').hidden);if(!mo)notes.push('s4 popup did not open');await p.tap('#ansDone');where='s4 option';await p.tap('.step.on .chk .choice >> nth=0');await hs(4);await nx();
await hs(5);await p.evaluate(()=>{const k=document.querySelector('.step.on .saa-kit[data-kit=order]');if(!k)return;for(let g=0;g<30;g++){const lis=[...k.querySelectorAll('.saa-steps>li')];const i=lis.findIndex((l,j)=>+l.dataset.n!==j+1);if(i<0)break;lis.find(l=>+l.dataset.n===i+1).querySelector('.saa-mv button').click();}k.querySelector('.saa-k-check').click();});await p.waitForTimeout(300);await nx();
where='s6';await p.tap('.opt >> nth=1');await hs(6);await nx();
for(const k of ['search','calc','ai']){where='s7 '+k;await p.tap(`.tcard[data-k=${k}]`);await p.waitForFunction(()=>!document.querySelector('.tcard').disabled||document.getElementById('qlabel').textContent.startsWith('All'),null,{timeout:15000});}
await hs(7);await nx();
for(let i=0;i<6;i++){where='s8 sort'+i;const c=await p.$('#pool .chip');const bk=await c.getAttribute('data-b');await c.tap();await p.tap(`.bucket[data-b=${bk}]`);}
await hs(8);await nx();
where='s9';await p.tap('.nseg >> nth=3');await p.tap('#reveal');await hs(9);await nx();
where='s10';for(const c of await p.$$('.step.on .chk .choice'))await c.tap();await hs(10);await nx();
await hs(11);
}catch(e){notes.push('FAIL at '+where+': '+e.message.split('\n')[0])}
console.log(name,notes.join(' | ')||'all taps OK, no sideways scroll',errs);
await p.screenshot({path:require('os').tmpdir()+`/ph_${name.split(' ')[0]}.png`});await ctx.close();}
await b.close()})();
