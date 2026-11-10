require('../scripts/scratch-register.cjs');
const {test}=require('node:test'),assert=require('node:assert/strict');
const {classifyScratchSource,observedSession,trackScratch}=require('../app/scratch/telemetry.ts');
const {parseEvent}=require('../lib/scratch-analytics.ts');
test('source mapping emits only categories and supports explicit other',()=>{
 for(const [input,want] of [['','direct'],['?source=other','other'],['?source=partner&utm_medium=email','partner'],['?utm_source=instagram','social'],['?utm_medium=paid_social','social'],['?utm_medium=email','newsletter'],['?utm_source=mirvish','partner'],['?utm_source=person%40example.com','other'],['?utm_campaign=SECRET','other'],['?token=SECRET&email=person%40example.com','direct']])assert.equal(classifyScratchSource(input),want);
});
test('new observation events and bounded footer property accepted; raw metadata rejected',()=>{
 for(const name of ['page_viewed','ticket_outbound'])assert.equal(parseEvent({id:crypto.randomUUID(),name,props:{placement:'scratch_page',source:'other',cta:'footer'}}).name,name);
 for(const props of [{source:'person@example.com'},{utm_source:'instagram'},{cta:'SECRET'}])assert.throws(()=>parseEvent({id:crypto.randomUUID(),name:'ticket_outbound',props}));
});
test('blocked storage retains expiring memory identity and failed transport is harmless',async()=>{
 global.sessionStorage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 global.location={search:'?utm_source=instagram&token=SECRET'};global.matchMedia=()=>({matches:true});
 assert.equal(observedSession(),observedSession());
 const originalNow=Date.now;const before=observedSession();Date.now=()=>originalNow()+1800001;assert.notEqual(observedSession(),before);Date.now=originalNow;
 let request;global.fetch=async(url,options)=>{request={url,...options};throw Error('offline')};
 trackScratch('ticket_outbound','scratch_page',{cta:'footer'});await new Promise(resolve=>setImmediate(resolve));
 assert.equal(request.keepalive,true);assert(!request.body.includes('SECRET'));assert.equal(JSON.parse(request.body).props.source,'social');
});
