const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
for(const [w,h] of [[1280,720],[1024,600]]){
const p=await b.newPage({viewport:{width:w,height:h}});p.setDefaultTimeout(4000);const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto((process.env.GAME_URL||'file://'+process.cwd()+'/index.html'));
const over=[];let where='';
const chk=async i=>{where='chk'+i;const r=await p.evaluate(()=>{const s=document.querySelector('.step.on');return s.scrollHeight-s.clientHeight});if(r>0)over.push('s'+i+':'+r);if(w==1280)await p.screenshot({path:require('os').tmpdir()+`/f${i}.png`});};
const nx=async()=>{where='next@'+await p.evaluate(()=>document.getElementById('count').textContent);await p.click('#next');await p.waitForTimeout(150)};
try{
await p.click('#startBtn');await p.waitForTimeout(600);
await p.click('#chips .choice >> nth=1');await chk(1);await nx();
await p.click('.seg-b[data-t=ph]');await chk(2);await nx();
await p.click('#copyPrompt');await p.fill('#resp1','Reminder: practical tomorrow. Bring your record book. Be on time.');await chk(3);await nx();
await p.click('.step.on .choice >> nth=2');await chk(4);await nx();await p.waitForTimeout(1800);await chk(5);await p.evaluate(()=>{const k=document.querySelector('.step.on .saa-kit[data-kit=order]');if(!k)return;for(let g=0;g<30;g++){const lis=[...k.querySelectorAll('.saa-steps>li')];const i=lis.findIndex((l,j)=>+l.dataset.n!==j+1);if(i<0)break;lis.find(l=>+l.dataset.n===i+1).querySelector('.saa-mv button').click();}k.querySelector('.saa-k-check').click();});await p.waitForTimeout(300);await nx();
await p.click('.opt >> nth=1');await chk(6);await nx();
for(const k of ['search','calc','ai']){where='quiz '+k;await p.click(`.tcard[data-k=${k}]`);await p.waitForFunction(()=>!document.querySelector('.tcard').disabled||document.getElementById('qlabel').textContent.startsWith('All'),null,{timeout:12000});}await chk(7);await nx();
for(let i=0;i<6;i++){where='sort'+i;const c=await p.$('#pool .chip');const bk=await c.getAttribute('data-b');await c.click();await p.click(`.bucket[data-b=${bk}]`);}await chk(8);await nx();
where='s9';await p.click('.nseg >> nth=3');await p.click('#reveal');await chk(9);await nx();
for(const c of await p.$$('.step.on .chk .choice'))await c.click();await chk(10);await nx();
await p.waitForTimeout(600);await chk(11);
const sel=await p.evaluate(()=>getComputedStyle(document.querySelector('h2')).userSelect);over.push('h2 select='+sel);
}catch(e){over.push('FAIL at '+where+': '+e.message.split('\n')[0])}
console.log(w,h,over.join(' '),errs);await p.close();}
await b.close()})();
