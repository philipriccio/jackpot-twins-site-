/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS browser regression. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const assert=require('node:assert/strict');
// Synthetic API fixtures only; no real players, awards or mail.
const base=process.env.BASE||'http://127.0.0.1:3395';
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
for(const mode of ['mouse','touch']){
const ctx=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:mode==='touch',deviceScaleFactor:2});const page=await ctx.newPage();
const state={profile:{name:'Synthetic QA',email:'qa@example.invalid'},remaining:3,rules:'Fixture only',freeEnabled:true,plays:[],mail:[]};const actions=[];let failed=false;
await ctx.route('**/*',async route=>{const u=new URL(route.request().url());if(/facebook|google-analytics|googletagmanager|doubleclick/.test(u.hostname))return route.abort();if(!u.pathname.startsWith('/api/scratch/'))return route.continue();const op=u.pathname.split('/').at(-1);if(op==='action'){const b=route.request().postDataJSON();if(process.env.RETRY&&!failed&&b.action==='complete'){failed=true;return route.fulfill({status:503,json:{error:'Synthetic retry'}});}actions.push(b.action);if(b.action==='start'){state.remaining--;state.plays.push({id:'fixture-'+state.plays.length,day:'2026-11-15',prize:null,prizeRevealed:false,round:{maxChoices:5,board:Array(9).fill('chair'),chosen:[],revealed:[],active:null,status:'playing'}});}const p=state.plays.at(-1);if(b.action==='commit'){p.round.active=b.index;if(!p.round.chosen.includes(b.index))p.round.chosen.push(b.index);}if(b.action==='complete'){p.round.revealed.push(b.index);p.round.active=null;if(p.round.revealed.length===5)p.round.status='lost';}}
return route.fulfill({json:op==='config'?{rules:'Fixture',freeEnabled:true}:op==='event'?{accepted:true}:state});});
await page.goto(base+(process.env.POPUP?'/':'/scratch'));if(process.env.POPUP)await page.getByRole('button',{name:'Play the Scratch Game',exact:true}).click();await page.getByRole('button',{name:'PLAY NOW',exact:true}).click();
for(let card=0;card<3;card++){
await page.locator('.dt-grid[data-scratch-area] canvas').first().waitFor();
const inert=await page.locator('.dt-grid[data-scratch-area]').evaluate(e=>!!e.closest('[inert]'));
console.log(JSON.stringify({mode,card:card+1,inert,actions:actions.slice()}));
if(inert){if(process.env.BASELINE){await page.screenshot({path:__dirname+'/baseline-inert-'+mode+'.png'});break;}assert.fail('New card is inert');}
if(card===1){await page.setViewportSize({width:320,height:568});await page.setViewportSize({width:390,height:844});}
for(let spot=0;spot<5;spot++){
const sel='.dt-spot[data-spot="'+spot+'"] canvas',canvas=page.locator(sel);await canvas.scrollIntoViewIfNeeded();await page.waitForFunction(s=>{const c=document.querySelector(s);return c&&c.width>0&&c.getContext('2d').getImageData(0,0,1,1).data[3]>0;},sel);
let removed;
if(mode==='mouse'){const b=await canvas.boundingBox();await page.mouse.move(b.x+1,b.y+1);await page.mouse.down();for(let row=0;row<=12;row++){await page.mouse.move(b.x+1,b.y+b.height*row/12);await page.mouse.move(b.x+b.width-1,b.y+b.height*row/12);}removed=await canvas.evaluate(c=>{const a=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<a.length;i+=4)n+=1-a[i]/255;return n/(c.width*c.height);});await page.mouse.up();}
else if(process.env.HIT_TOUCH){const cd=await ctx.newCDPSession(page),b=await canvas.boundingBox();await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+1,y:b.y+1}]});for(let row=0;row<=12;row++){await cd.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:b.x+1,y:b.y+(b.height-2)*row/12+1}]});await cd.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:b.x+b.width-1,y:b.y+(b.height-2)*row/12+1}]});}removed=await canvas.evaluate(c=>{const a=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<a.length;i+=4)n+=1-a[i]/255;return n/(c.width*c.height);});await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cd.detach();}
else removed=await canvas.evaluate(c=>{const r=c.getBoundingClientRect();const send=(type,x,y)=>{const t=new Touch({identifier:1,target:c,clientX:r.left+x*r.width,clientY:r.top+y*r.height});c.dispatchEvent(new TouchEvent(type,{bubbles:true,cancelable:true,touches:type==='touchend'?[]:[t],targetTouches:type==='touchend'?[]:[t],changedTouches:[t]}));};send('touchstart',0,0);for(let y=0;y<=1.01;y+=.08){send('touchmove',0,y);send('touchmove',1,y);}const a=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<a.length;i+=4)n+=1-a[i]/255;send('touchend',1,1);return n/(c.width*c.height);});
assert(removed>.85,'pixel erasure '+removed);if(process.env.RETRY&&card===0&&spot===0){await page.getByRole('button',{name:'Dismiss message',exact:true}).click();await page.getByRole('button',{name:'Finish this square',exact:true}).click();}await canvas.waitFor({state:'detached'});
}
await page.getByRole('dialog',{name:'Scratch result',exact:true}).waitFor();await page.getByRole('button',{name:'See my card',exact:true}).click();assert.equal(await page.locator('.dt-grid[data-scratch-area]').evaluate(e=>!!e.closest('[inert]')),false,'Dismissed result unlocks card');await page.getByRole('button',{name:'View result',exact:true}).click();if(card<2)await page.getByRole('button',{name:'PLAY AGAIN',exact:true}).click();
}
assert.equal(actions.filter(a=>a==='start').length,3);assert.equal(actions.filter(a=>a==='complete').length,15);
if(process.env.POPUP){await page.getByRole('button',{name:'See my card',exact:true}).click();await page.getByRole('button',{name:'Close Jackpot Twins — The Scratch Game',exact:true}).click();assert.equal(await page.evaluate(()=>document.body.style.position),'');await page.getByRole('button',{name:'Play the Scratch Game',exact:true}).click();await page.getByRole('dialog',{name:'Scratch result',exact:true}).waitFor();}
console.log('DONE '+mode+' '+JSON.stringify(actions));await ctx.close();
}}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
