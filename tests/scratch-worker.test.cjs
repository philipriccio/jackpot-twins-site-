require('../scripts/scratch-register.cjs');
const {test}=require('node:test'),assert=require('node:assert/strict');
const {runWorker}=require('../lib/scratch-worker.ts');
test('worker rejects incomplete configuration before consuming queue retries',()=>{
 const {validateWorkerConfiguration}=require('../lib/scratch-worker.ts');
 assert.throws(()=>validateWorkerConfiguration({}),/configuration/);
 const env={SCRATCH_DATABASE_URL:'synthetic',SCRATCH_CAMPAIGN_ID:'fixture',SCRATCH_INTAKE_TOKEN:'fixture',SCRATCH_SEND_ENABLED:'1',SCRATCH_CRM_URL:'https://example.invalid/intake',SCRATCH_MAIL_PROVIDER:'ses',SCRATCH_FROM_EMAIL:'fixture@example.invalid',AWS_SES_REGION:'ca-central-1',SCRATCH_TEST_RECIPIENTS:'fixture@example.invalid'};
 validateWorkerConfiguration(env);
 assert.throws(()=>validateWorkerConfiguration({...env,SCRATCH_CRM_URL:'http://example.invalid'}),/endpoint/);
 assert.throws(()=>validateWorkerConfiguration({...env,SCRATCH_TEST_RECIPIENTS:''}),/recipients/);
});
test('worker bounds batches, remains serial, waits when empty, and stops without another dispatch',async()=>{
 const c=new AbortController();let calls=0,active=0,maxActive=0,pauses=0;const batches=[];
 await runWorker(async()=>{active++;maxActive=Math.max(maxActive,active);await Promise.resolve();active--;calls++;return calls<=3;},c.signal,{batchSize:2,pause:async()=>{if(++pauses===2)c.abort();},onBatch:n=>batches.push(n)});
 assert.equal(maxActive,1);assert.equal(calls,4);assert.deepEqual(batches,[2,1]);assert.equal(pauses,2);
});
test('shutdown lets current dispatch finish and skips all remaining work',async()=>{
 const c=new AbortController();let finished=false,calls=0;
 await runWorker(async()=>{calls++;c.abort();await Promise.resolve();finished=true;return true;},c.signal,{pause:async()=>assert.fail('No pause after stop')});
 assert.equal(calls,1);assert.equal(finished,true);
});
test('fatal dispatch error propagates, no silent restart or overlapping retries',async()=>{
 let calls=0;await assert.rejects(runWorker(async()=>{calls++;throw Error('database unavailable');},new AbortController().signal),/database unavailable/);assert.equal(calls,1);
});
test('idle wait is abortable and invalid batch configuration fails before work',async()=>{
 const c=new AbortController();const timer=setTimeout(()=>c.abort(),20);await runWorker(async()=>false,c.signal);clearTimeout(timer);
 await assert.rejects(runWorker(async()=>assert.fail(),new AbortController().signal,{batchSize:101}),/bounds/);
});
