const { chromium } = require('/opt/homebrew/lib/node_modules/agent-browser/node_modules/playwright-core');
const assert = require('node:assert/strict'); const fs = require('node:fs');
const dir=__dirname; const results=[];
const query='?utm_source=company_theatre&utm_medium=email&utm_campaign=jackpot_twins_onsale_202610&utm_content=creative-123456789abc-placement-1&utm_id=batch-123456789abc&email=private%40example.test&token=secret-token';
const events=page=>page.evaluate(()=>Array.from(window.dataLayer||[],x=>Array.from(x)).filter(x=>x[0]==='event'));
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:900}});
  await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:3201/'+query);await page.waitForTimeout(700);
  assert.equal((await events(page)).filter(x=>x[1]==='page_view').length,1);
  const href=await page.locator('[data-ticket-placement="hero"]').getAttribute('href');const url=new URL(href);
  assert.equal(url.searchParams.get('utm_source'),'company_theatre');assert.equal(url.searchParams.get('utm_content'),'creative-123456789abc-placement-1');assert.equal(url.searchParams.get('site_placement'),'hero');
  await page.locator('[data-ticket-placement="hero"]').click();
  assert.equal((await events(page)).filter(x=>x[1]==='ticket_click').length,1);
  assert.equal(await page.locator('[data-analytics-placement="company_footer"]').evaluate(a=>new URL(a.href).searchParams.get('utm_id')),'batch-123456789abc');
  // Repeated real pointer passes across canvas: one activation event per card per round.
  const canvas=page.locator('#scratchCanvas-0');await canvas.scrollIntoViewIfNeeded();const box=await canvas.boundingBox();
  await page.mouse.move(box.x+10,box.y+10);await page.mouse.down();
  for(let pass=0;pass<2;pass++) for(let y=15;y<box.height-10;y+=24) for(let x=15;x<box.width-10;x+=24) await page.mouse.move(box.x+x,box.y+y);
  await page.mouse.up();
  assert.equal((await events(page)).filter(x=>x[1]==='card_scratched').length,1);
  await page.getByRole('button',{name:'reveal all',exact:true}).click();await page.getByRole('button',{name:'reveal all',exact:true}).click();
  assert.equal((await events(page)).filter(x=>x[1]==='cast_reveal_all').length,1);assert.equal((await events(page)).find(x=>x[1]==='cast_reveal_all')[2].newly_revealed,4);
  await page.getByRole('button',{name:'play again',exact:true}).click();await page.getByRole('button',{name:'reveal all',exact:true}).click();
  assert.equal((await events(page)).filter(x=>x[1]==='cast_reveal_all').length,2);
  await page.screenshot({path:dir+'/jt-'+width+'.png',fullPage:true});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(errors.length,0);
  for(const subscribed of [false,true]){
   await page.route('**/api/signup',r=>r.fulfill({json:{recorded:true,subscribed}}));
   await page.getByRole('button',{name:'Sign Up for Updates'}).click();
   const form=page.locator('form');await form.locator('[name=firstName]').fill('Synthetic');await form.locator('[name=lastName]').fill('Visitor');await form.locator('input[type=email]').fill('synthetic@example.test');await form.locator('input[type=checkbox]').check();await form.locator('button[type=submit]').click();await page.waitForTimeout(100);
   assert.equal((await events(page)).filter(x=>x[1]==='email_signup').length,subscribed?1:0);
   await page.getByRole('button',{name:'Close signup form'}).click();
  }
  const payload=JSON.stringify(await events(page));assert(!payload.includes('private'));assert(!payload.includes('secret-token'));assert(!payload.includes('synthetic@example'));
  results.push({site:'JT',width,checks:'pageview, campaign handoff, distinct placements, click, scratch dedup, reveal-all, replay, subscribed/review, privacy, overflow',errors});
  await page.goto('http://127.0.0.1:3202/jackpot-twins'+query);await page.waitForTimeout(500);
  assert.equal((await events(page)).filter(x=>x[1]==='page_view').length,1);
  assert.equal(await page.locator('[data-analytics-placement="production_hero"]').evaluate(a=>new URL(a.href).searchParams.get('utm_medium')),'email');
  await page.locator('[data-analytics-placement="production_hero"]').click();assert.equal((await events(page)).filter(x=>x[1]==='owned_site_click').length,1);
  await page.screenshot({path:dir+'/ct-'+width+'.png',fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  for(const outcome of ['review','failure','success']){
   await page.route('**/api/newsletter',r=>r.fulfill({status:outcome==='failure'?500:200,json:outcome==='failure'?{error:'Synthetic failure'}:{recorded:true,subscribed:outcome==='success',message:'Synthetic confirmation'}}));
   await page.getByRole('button',{name:'Single Ticket Notification'}).click();const dialog=page.getByRole('dialog');await dialog.locator('input[type=email]').fill('synthetic@example.test');await dialog.locator('input[type=checkbox]').check();await dialog.locator('button[type=submit]').click();await page.waitForTimeout(100);
   assert.equal((await events(page)).filter(x=>x[1]==='email_signup').length,outcome==='success'?1:0);await dialog.getByRole('button',{name:'Close',exact:true}).click();await page.waitForTimeout(350);
  }
  assert(!JSON.stringify(await events(page)).includes('synthetic@example'));
  // Real Next internal navigation retains campaign context without decorating internal anchors.
  const internal=page.locator('a[href="/support"]:visible').first();assert.equal(await internal.getAttribute('href'),'/support');await internal.click();await page.waitForTimeout(200);assert.equal((await events(page)).filter(x=>x[1]==='page_view').length,2);
  await page.locator('a[href*=canadahelps]').first().click();assert.equal((await events(page)).filter(x=>x[1]==='donation_link_click').length,1);assert.equal((await events(page)).filter(x=>x[1]==='purchase').length,0);
  results.push({site:'CT',width,checks:'pageview, cross-site attribution, owned-site click, modal success/review/failure, internal route pageview, privacy, overflow'});
  await context.close();
 }
 // Denied storage and throwing analytics never block outbound navigation.
 const context=await browser.newContext();await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await context.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){throw Error('blocked')}})});
 const p=await context.newPage();await p.goto('http://127.0.0.1:3201/'+query);await p.waitForTimeout(300);await p.evaluate(()=>{window.gtag=()=>{throw Error('blocked')}});
 const popup=context.waitForEvent('page');await p.locator('[data-ticket-placement="hero"]').click();await popup;assert.equal(await p.locator('[data-ticket-placement="hero"]').evaluate(a=>new URL(a.href).searchParams.get('utm_medium')),'email');results.push({blockedStorageAndAnalytics:'navigation preserved'});
 await context.close();await browser.close();fs.writeFileSync(dir+'/browser-proof.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
})().catch(e=>{console.error(e);process.exit(1)});
