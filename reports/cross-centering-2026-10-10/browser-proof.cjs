const {chromium}=require('/opt/homebrew/lib/node_modules/agent-browser/node_modules/playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const results=[];
 for(const width of [320,390,430,1440]){
  const c=await b.newContext({viewport:{width,height:900},deviceScaleFactor:2});
  await c.route(/google-analytics|googletagmanager/,r=>r.abort());
  const p=await c.newPage(); const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:3167');await p.waitForTimeout(900);
  const metrics=await p.evaluate(()=>{
   const canvas=document.querySelector('#scratchCanvas-0'),ctx=canvas.getContext('2d');
   const {width:w,height:h}=canvas;const d=ctx.getImageData(0,0,w,h).data;
   let min=w,max=-1;
   for(let y=Math.floor(h*.35);y<h*.57;y++)for(let x=0;x<w;x++){
    const i=(y*w+x)*4;if(d[i]>70&&d[i+2]>d[i]+10&&d[i+2]>d[i+1]*1.4){min=Math.min(min,x);max=Math.max(max,x);}
   }
   return {canvasWidth:w,purpleMin:min,purpleMax:max,centreError:Math.abs((min+max+1)/2-w/2),overflow:document.documentElement.scrollWidth>innerWidth};
  });
  assert(metrics.purpleMax>metrics.purpleMin);assert(metrics.centreError<=1);assert.equal(metrics.overflow,false);
  await p.locator('#scratch-0').scrollIntoViewIfNeeded();await p.waitForTimeout(300);
  await p.screenshot({path:`reports/cross-centering-2026-10-10/mobile-${width}.png`});
  // Exercise actual scratch gestures, then reveal/reset controls.
  const box=await p.locator('#scratchCanvas-0').boundingBox();
  await p.mouse.move(box.x+box.width/2,box.y+box.height*.46);await p.mouse.down();await p.mouse.move(box.x+box.width/2+10,box.y+box.height*.46,{steps:3});await p.mouse.up();
  const alpha=await p.locator('#scratchCanvas-0').evaluate(c=>c.getContext('2d').getImageData(Math.floor(c.width/2),Math.floor(c.height*.46),1,1).data[3]);assert.equal(alpha,0);
  await p.getByRole('button',{name:'reveal all',exact:true}).click();await p.waitForTimeout(350);assert.equal(await p.locator('.scratch-card.revealed').count(),5);
  await p.getByRole('button',{name:'play again',exact:true}).click();await p.waitForTimeout(350);assert.equal(await p.locator('.scratch-card.revealed').count(),0);
  assert.equal(await p.locator('a[data-ticket-placement]').count(),3);assert.deepEqual(errors,[]);
  results.push({width,...metrics,scratchRevealReplay:'pass',pageErrors:errors});await c.close();
 }
 await b.close();fs.writeFileSync('reports/cross-centering-2026-10-10/proof.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
})().catch(e=>{console.error(e);process.exit(1)});
