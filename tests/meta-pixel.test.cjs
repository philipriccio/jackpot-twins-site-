require('../scripts/scratch-register.cjs');
const {test}=require('node:test'),assert=require('node:assert/strict');
function fixture(url='https://jackpottwins.ca/',referrer=''){
 delete require.cache[require.resolve('../app/meta-pixel.ts')];
 const scripts=[];global.window={location:new URL(url)};global.document={referrer,createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}};
 const meta=require('../app/meta-pixel.ts');return {meta,scripts};
}
test('production guard, strict safe query/referrer and bounded one-time init',()=>{
 for(const url of ['http://localhost:3000/','https://preview.example/','https://jackpottwins.ca/?email=person@example.invalid','https://jackpottwins.ca/?token=private','https://jackpottwins.ca/#private','https://jackpottwins.ca/api/scratch/verify']){const {meta,scripts}=fixture(url);meta.initializeMeta('2190938354964220');assert.equal(scripts.length,0);}
 let f=fixture('https://jackpottwins.ca/','https://example.com/?verification=secret');f.meta.initializeMeta('2190938354964220');assert.equal(f.scripts.length,0);
 f=fixture('https://jackpottwins.ca/?utm_source=instagram&fbclid=abc_123');f.meta.initializeMeta(undefined);assert.equal(f.scripts.length,0);f.meta.initializeMeta('2190938354964220');f.meta.initializeMeta('2190938354964220');assert.equal(f.scripts.length,1);assert.equal(f.scripts[0].async,true);assert.equal(window.fbq.disablePushState,true);assert.deepEqual(window.fbq.queue.slice(0,2),[['set','autoConfig',false,'2190938354964220'],['init','2190938354964220']]);
});
test('SPA PageView dedup, first verified Lead only and safe payloads',()=>{
 const {meta}=fixture();meta.initializeMeta('2190938354964220');meta.metaPage('/');meta.metaPage('/');window.location=new URL('https://jackpottwins.ca/scratch');meta.metaPage('/scratch');meta.metaPage('/scratch');meta.metaVerified({verified:true,firstVerification:false},'repeat');meta.metaVerified({verified:false,firstVerification:true},'failed');meta.metaVerified({verified:true,firstVerification:true,email:'never@example.invalid'},'private-verification-id');meta.metaVerified({verified:true,firstVerification:true},'private-verification-id');
 const q=window.fbq.queue;assert.equal(q.filter(x=>x[2]==='PageView').length,2);assert.equal(q.filter(x=>x[2]==='Lead').length,1);assert.ok(!JSON.stringify(q).includes('private-verification-id'));assert.ok(!JSON.stringify(q).includes('@'));
});
test('confirmed card transitions only, dedup repeats, exclude test and no ID or reward leakage',()=>{
 const {meta}=fixture();meta.initializeMeta('2190938354964220');const playing={id:'private-card-id',round:{status:'playing'},prize:null},won={...playing,round:{status:'won'},prize:'25'};
 meta.metaScratchTransition('start',[],[playing]);meta.metaScratchTransition('start',[],[playing]);meta.metaScratchTransition('start',[playing],[playing]);meta.metaScratchTransition('complete',[playing],[won]);meta.metaScratchTransition('complete',[playing],[won]);meta.metaScratchTransition('complete',[won],[won]);meta.metaScratchTransition('start',[],[{...playing,id:'test',isTest:true}]);
 assert.equal(window.fbq.queue.filter(x=>x[2]==='ScratchStart').length,1);assert.equal(window.fbq.queue.filter(x=>x[2]==='ScratchComplete').length,1);assert.ok(!JSON.stringify(window.fbq.queue).includes('private-card-id'));assert.deepEqual(window.fbq.queue.at(-1)[3],{outcome:'won',prize_tier:'25'});
});
test('both ticket hosts supported, non-tickets rejected; blocked tracker does not throw',()=>{
 const {meta}=fixture();meta.initializeMeta('2190938354964220');for(const url of ['https://www.mirvish.com/shows/jackpot-twins','https://tickets.mirvish.com/events/jackpot?promo=secret'])meta.metaTicket(url);assert.equal(window.fbq.queue.filter(x=>x[2]==='TicketClick').length,2);for(const url of ['https://tickets.mirvish.com.evil.invalid/events/jackpot','https://www.mirvish.com/ticket-info','javascript:alert(1)'])assert.equal(meta.isMirvishTicket(url),false);assert.ok(!JSON.stringify(window.fbq.queue).includes('secret'));window.fbq.callMethod=()=>{throw Error('blocked')};assert.doesNotThrow(()=>{meta.metaTicket('https://tickets.mirvish.com/events/jackpot');meta.metaPage('/scratch');meta.metaVerified({verified:true,firstVerification:true},'another');});
});
test('scratch canonicalization preserves validated ad click ID and drops arbitrary and duplicate input',()=>{
 const {scratchCanonicalQuery:q}=require('../lib/scratch-canonical-query.ts');assert.equal(q({utm_source:'instagram',fbclid:'abc_123',email:'private@example.invalid',token:'secret'}),'?source=social&fbclid=abc_123');assert.equal(q({source:'social',fbclid:['a','b']}),'?source=social');assert.equal(q({fbclid:'bad@email.invalid'}),'');assert.equal(q({fbclid:'x'.repeat(501)}),'');assert.equal(q({code:'123456',redirect:'https://evil.invalid'}),'');
});
