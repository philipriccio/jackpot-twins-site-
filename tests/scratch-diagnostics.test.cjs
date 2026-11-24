require('../scripts/scratch-register.cjs');
const {test}=require('node:test'),assert=require('node:assert/strict');
const {createDiagnostics,createPauseObserver,failureCategory,invalidResponse,DIAGNOSTIC_EVENTS}=require('../lib/scratch-diagnostics.ts');
const {parseEvent}=require('../lib/scratch-analytics.ts');
const id='11111111-1111-4111-8111-111111111111';
test('diagnostics use accepted categorical props and reject personal/raw values',()=>{
 const events=[];const d=createDiagnostics((name,props)=>events.push({name,props}));
 d.failed('settings',{status:503});d.failed('settings',{status:503});d.recovered('settings');d.failed('settings',invalidResponse('private text'));
 d.emit('retry_attempt',{operation:'saved_game'});d.emit('retry_result',{operation:'saved_game',result:'signed_out'});d.emit('gameplay_pause',{stage:'scratch_square',duration:'90s'});d.emit('action_failed',{operation:'complete',failure:'network'});
 assert.equal(events.filter(e=>e.name==='load_failed').length,2);
 for(const e of events){assert(DIAGNOSTIC_EVENTS.includes(e.name));assert.doesNotThrow(()=>parseEvent({id,...e}));assert(!JSON.stringify(e).includes('private'));}
 for(const props of [{email:'test@example.invalid'},{operation:'https://example.com'},{failure:'private error'},{cardId:id},{duration:'12345'}])assert.throws(()=>parseEvent({id,name:'load_failed',props}));
});
test('categories are bounded; diagnostics cap and thrown transports cannot affect gameplay',()=>{
 assert.equal(failureCategory({status:429}),'rate_limit');assert.equal(failureCategory({status:401}),'auth');assert.equal(failureCategory({status:400}),'request');assert.equal(failureCategory(new TypeError('secret')),'network');assert.equal(failureCategory(new Error('secret')),'unknown');
 let count=0;const d=createDiagnostics(()=>{count++;throw Error('offline')});for(let i=0;i<100;i++)assert.doesNotThrow(()=>d.emit('action_failed',{operation:'start',failure:'server'}));assert.equal(count,60);
});
test('pause requires continuous eligible 90s, dedupes each stage, resets for progress/card/logout',()=>{
 const p=createPauseObserver(),sample=(t,card='card-a',progress='0:0:null',stage='choose_square',eligible=true)=>p.sample(t,card,progress,stage,eligible);
 assert.equal(sample(0),false);assert.equal(sample(89999),false);assert.equal(sample(90000),true);assert.equal(sample(180000),false);
 assert.equal(sample(180001,'card-a','1:0:0','scratch_square'),false);assert.equal(sample(270001,'card-a','1:0:0','scratch_square'),true);
 assert.equal(sample(270002,'card-b'),false);assert.equal(sample(350000,'card-b',undefined,undefined,false),false);assert.equal(sample(360002,'card-b'),false);assert.equal(sample(450002,'card-b'),true);
 sample(450003,null);assert.equal(sample(450004,'card-b'),false);assert.equal(sample(540004,'card-b'),true);
});
test('normal progressing play never produces pause',()=>{
 const p=createPauseObserver();for(let i=0;i<10;i++)assert.equal(p.sample(i*60000,'card',String(i),'scratch_square',true),false);
});
