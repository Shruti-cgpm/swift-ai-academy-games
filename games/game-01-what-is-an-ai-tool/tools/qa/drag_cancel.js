const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});p.setDefaultTimeout(4000);
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto((process.env.GAME_URL||'file://'+process.cwd()+'/index.html'));
await p.click('#startBtn');await p.evaluate(()=>{document.querySelectorAll('.step').forEach(s=>s.removeAttribute('data-gate'));});
await p.click('#chips .choice');for(let i=0;i<7;i++){await p.evaluate(()=>document.getElementById('next').disabled=false);await p.click('#next');await p.waitForTimeout(80)}
await p.waitForTimeout(400);
const state=()=>p.evaluate(()=>({ghosts:document.querySelectorAll('.drag-ghost').length,dragging:document.querySelectorAll('.chip.dragging').length,over:document.querySelectorAll('.bucket.over').length,armed:document.querySelector('.sort').classList.contains('armed'),pool:document.querySelectorAll('#pool .chip').length}));
const start=async(sel='#pool .chip')=>{const a=await (await p.$(sel)).boundingBox();await p.mouse.move(a.x+a.width/2,a.y+a.height/2);await p.mouse.down();await p.mouse.move(a.x+a.width/2+30,a.y+a.height/2+40,{steps:3});await p.mouse.move(400,480,{steps:5});};
await start();await p.keyboard.press('Escape');await p.waitForTimeout(300);console.log('esc mid-drag',JSON.stringify(await state()));
await p.mouse.up();await start();await p.mouse.move(640,-30,{steps:4});await p.mouse.up();await p.waitForTimeout(300);console.log('released outside window',JSON.stringify(await state()));
await start();await p.mouse.up();await p.waitForTimeout(300);console.log('released on empty area',JSON.stringify(await state()));
// after all that, normal drag still works
const a=await (await p.$('#pool .chip[data-b=use]')).boundingBox();const t=await (await p.$('.bucket[data-b=use]')).boundingBox();
await p.mouse.move(a.x+a.width/2,a.y+a.height/2);await p.mouse.down();await p.mouse.move(a.x+50,a.y+50,{steps:3});await p.mouse.move(t.x+t.width/2,t.y+t.height/2,{steps:6});await p.mouse.up();await p.waitForTimeout(300);
console.log('normal drop after',JSON.stringify(await state()),'placed',await p.evaluate(()=>document.querySelectorAll('.bucket[data-b=use] .slot .chip').length));
// tap a chip still selects (no accidental drag)
await p.click('#pool .chip');console.log('tap selects',await p.evaluate(()=>document.querySelectorAll('#pool .chip[aria-pressed=true]').length));
console.log(errs);await b.close()})();
