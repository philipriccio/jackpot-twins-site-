const ts=require('../../node_modules/typescript');const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');const path=require('node:path');
for(const relative of ['../../app/campaign-analytics.ts','../../../ct-signup-release/lib/campaign-analytics.ts']){
 const source=fs.readFileSync(path.resolve(__dirname,relative),'utf8'); const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const location=new URL('https://jackpottwins.ca/?utm_source=company_theatre&utm_medium=email&utm_campaign=jackpot_twins_onsale_202610&utm_content=creative-abcd-placement-1&utm_id=batch-abcd&email=private@example.test&token=secret');
 const saved=new Map();const window={location};const context={exports:{},URL,URLSearchParams,window,location,document:{referrer:'https://crm.companytheatre.ca/api/track/click?token=secret'},sessionStorage:{setItem:(k,v)=>saved.set(k,v),getItem:k=>saved.get(k)},Date};vm.createContext(context);vm.runInContext(code,context);const api=context.exports;
 const onward=new URL(api.attributedUrl('https://www.mirvish.com/shows/jackpot-twins','hero','jackpottwins.ca'));
 assert.equal(onward.searchParams.get('utm_medium'),'email');assert.equal(onward.searchParams.get('utm_content'),'creative-abcd-placement-1');assert.equal(onward.searchParams.get('site_placement'),'hero');assert(!onward.searchParams.has('token'));
 api.gaEvent('ticket_click',{placement:'hero'});const commands=window.dataLayer.map(x=>Array.from(x));assert.equal(JSON.stringify(commands.map(x=>x[0])),JSON.stringify(['js','config','event']));assert(!JSON.stringify(commands).includes('private@example'));assert(!JSON.stringify(commands).includes('secret'));assert(commands[2][2].page_location.includes('utm_campaign='));
 window.location=new URL('https://jackpottwins.ca/about');assert.equal(api.campaignContext().utm_medium,'email');
 window.location=new URL('https://jackpottwins.ca/?utm_source=instagram&utm_medium=paid_social&utm_campaign=jt_tickets_onsale_202610');assert.equal(api.campaignContext().utm_source,'instagram');assert(!api.campaignContext().utm_id);
 window.location=new URL('https://jackpottwins.ca/?utm_source=user%40example.test&utm_medium=email&utm_campaign=bad');assert.equal(api.campaignContext().utm_source,'instagram');
 window.gtag=()=>{throw Error('blocked')};assert.doesNotThrow(()=>api.gaEvent('email_signup'));assert.equal(api.attributedUrl('invalid','x','site'),'invalid');
 console.log(relative+': attribution, privacy, queue order, internal continuity, campaign replacement, rejected PII syntax, blocked analytics passed');
}
