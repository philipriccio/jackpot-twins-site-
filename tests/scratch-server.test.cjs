require('../scripts/scratch-register.cjs');
const {test,after}=require('node:test'),assert=require('node:assert/strict'),{randomUUID}=require('node:crypto');
process.env.SCRATCH_DATABASE_URL='postgresql://jt_scratch_fixture@localhost/jt_scratch_synthetic_20261105';process.env.SCRATCH_CAMPAIGN_ID='synthetic-launch';
const api=require('../lib/scratch-server.ts'),analytics=require('../lib/scratch-analytics.ts'),{work}=require('../lib/scratch-outbox.ts');
const db=new (require('pg').Pool)({connectionString:'postgresql://localhost/jt_scratch_synthetic_20261105'});after(async()=>{await db.end();await api.pool().end();});
async function makePlayer(email){const id=randomUUID(),v=await api.signup({name:'Synthetic',email:email??id+'@example.invalid',consent:false,requestId:id});const payload=(await db.query("SELECT payload FROM scratch_outbox WHERE dedupe=$1",['verify:'+v.verificationId])).rows[0].payload;assert.match(payload.code,/^\d{6}$/);return api.verify({verificationId:v.verificationId,code:payload.code});}
const act=(token,action,extra={})=>api.mutate(token,{action,requestId:randomUUID(),...extra});
async function fixtureBoard(id,win=true){const board=win?['bernie','gerry','chair','snacks','phone','slippers','cake','subaru','freshener']:['chair','snacks','phone','slippers','cake','subaru','freshener','bernie','gerry'];await db.query("UPDATE scratch_card SET round=jsonb_set(round,'{board}',$2) WHERE id=$1",[id,JSON.stringify(board)]);}
async function reveal(token,id,index){await act(token,'commit',{cardId:id,index,method:'keyboard'});return act(token,'complete',{cardId:id,index});}
test('authoritative integration: persistence, retries, quotas, stock, verification, analytics and outbox',async()=>{
 await db.query('TRUNCATE scratch_campaign,scratch_rate CASCADE');await db.query("INSERT INTO scratch_campaign VALUES('synthetic-launch',true,true,now()-interval '1 day',now()+interval '1 day',$1,1,'Synthetic collection only','Synthetic campaign; not valid for public use')",[{25:1,40:0,50:0,free:100000}]);
 const challengeId=randomUUID();await api.signup({name:'Attempt limit',email:challengeId+'@example.invalid',consent:false,requestId:challengeId});const issued=(await db.query("SELECT payload FROM scratch_outbox WHERE dedupe=$1",['verify:'+challengeId])).rows[0].payload.code;assert.match(issued,/^\d{6}$/);const wrong=issued==='000000'?'000001':'000000';for(let i=0;i<8;i++)await assert.rejects(api.verify({verificationId:challengeId,code:wrong}),/invalid or expired/);await assert.rejects(api.verify({verificationId:challengeId,code:issued}),/invalid or expired/);
 const token=await makePlayer();const request={action:'start',requestId:randomUUID()};const results=await Promise.all(Array.from({length:8},()=>api.mutate(token,request)));assert.equal(new Set(results.map(x=>x.plays[0].id)).size,1);const id=results[0].plays[0].id;assert.deepEqual(results[0].plays[0].round.board,Array(9).fill('hidden'));assert.equal(results[0].remaining,2);
 await assert.rejects(api.mutate(token,{...request,action:'claim'}),/conflict/);await fixtureBoard(id);
 const commits=await Promise.allSettled([act(token,'commit',{cardId:id,index:0}),act(token,'commit',{cardId:id,index:1})]);assert.equal(commits.filter(x=>x.status==='fulfilled').length,1);await act(token,'complete',{cardId:id,index:0});await reveal(token,id,1);const won=await api.state(token);assert.equal(won.plays[0].round.status,'won');assert.equal(won.plays[0].prize,null);assert.equal(won.remaining,0);await assert.rejects(act(token,'start'),/No plays/);const awarded=await act(token,'reveal_prize',{cardId:id});assert.ok(['free','25'].includes(awarded.plays[0].prize));await Promise.all(Array.from({length:8},()=>act(token,'email_prize',{cardId:id})));assert.equal((await db.query("SELECT count(*)::int n FROM scratch_outbox WHERE dedupe=$1",['prize:'+id])).rows[0].n,1);
 // Another winner cannot overdraw the single free reward.
 const t2=await makePlayer();const s2=await act(t2,'start');const id2=s2.plays[0].id;await fixtureBoard(id2);await reveal(t2,id2,0);await reveal(t2,id2,1);assert.ok((await db.query('SELECT free_remaining FROM scratch_campaign')).rows[0].free_remaining>=0);assert.ok((await db.query("SELECT count(*)::int n FROM scratch_card WHERE prize='free'")).rows[0].n<=1);
 // Three losses, no fourth; changing day only in synthetic SQL reopens allowance.
 const loser=await makePlayer();for(let j=0;j<3;j++){const s=await act(loser,'start'),card=s.plays.at(-1).id;await fixtureBoard(card,false);for(let i=0;i<4;i++)await reveal(loser,card,i);}assert.equal((await api.state(loser)).remaining,0);await assert.rejects(act(loser,'start'),/No plays/);await db.query("UPDATE scratch_card SET day=day-1 WHERE player=(SELECT player FROM scratch_session WHERE hash=$1)",[api.hash(loser)]);assert.equal((await api.state(loser)).remaining,3);
 await assert.rejects(api.state('forged'),/verify/);const invalid=await api.signup({name:'Expiry',email:'expire@example.invalid',consent:true,requestId:randomUUID()});await db.query("UPDATE scratch_verification SET expires_at=now()-interval '1 second' WHERE id=$1",[invalid.verificationId]);await assert.rejects(api.verify({verificationId:invalid.verificationId,code:'invalid'}),/expired/);
 const e={id:randomUUID(),name:'prize_outbound',props:{tier:'25',device:'mobile',source:'direct',placement:'scratch_page'}};await analytics.collect(e,token);await analytics.collect(e,token);await assert.rejects(analytics.collect({...e,id:randomUUID(),props:{email:'private@example.invalid'}},token),/Invalid/);await assert.rejects(analytics.collect({...e,id:randomUUID(),name:'prize_awarded'},token),/Invalid/);const report=await analytics.report();assert.equal(report.counts.find(x=>x.name==='prize_outbound').events,1);assert.equal(report.counts.find(x=>x.name==='prize_awarded').events,2);assert.equal(report.synthetic,true);assert.ok(!JSON.stringify(report).includes('@'));
 // Failed transports never report accepted; retry dedupe stable; accepted code payload scrubbed.
 await work(async()=>{throw Error('synthetic outage');});assert.equal((await db.query("SELECT count(*)::int n FROM scratch_outbox WHERE status='accepted'")).rows[0].n,0);await db.query("UPDATE scratch_outbox SET available_at=now() WHERE status='pending'");const seen=[];while(await work(async job=>{seen.push(job.dedupe);return {receipt:'synthetic-receipt'};})){}assert.ok(seen.length>0);assert.equal((await db.query("SELECT count(*)::int n FROM scratch_outbox WHERE kind='verification' AND status='accepted' AND payload<>'{}'::jsonb")).rows[0].n,0);
 // Unverified prior signup cannot smuggle marketing opt-in into a later verified signup.
 const sharedEmail='consent-isolation@example.invalid';await api.signup({name:'Unverified',email:sharedEmail,consent:true,requestId:randomUUID()});const legitimateId=randomUUID();await api.signup({name:'Verified',email:sharedEmail,consent:false,requestId:legitimateId});const challenge=(await db.query("SELECT payload FROM scratch_outbox WHERE dedupe=$1",['verify:'+legitimateId])).rows[0].payload;await api.verify({verificationId:legitimateId,code:challenge.code});assert.equal((await db.query('SELECT consent FROM scratch_player WHERE email=$1',[sharedEmail])).rows[0].consent,false);assert.equal((await db.query("SELECT payload->'marketingConsent'->>'granted' AS granted FROM scratch_outbox WHERE dedupe=$1",['crm:'+legitimateId])).rows[0].granted,'false');await assert.rejects(api.signup({name:'Changed',email:sharedEmail,consent:true,requestId:legitimateId}),/conflict/);
 // Non-idempotent providers: mark uncertain before dispatch; never retry an ambiguous send.
 await db.query("UPDATE scratch_outbox SET status='accepted' WHERE status IN('pending','working')");const unknownId=randomUUID();const fixturePlayer=(await db.query('SELECT id FROM scratch_player LIMIT 1')).rows[0].id;await db.query("INSERT INTO scratch_outbox(id,dedupe,player,kind,payload) VALUES($1,$2,$3,'prize','{}')",[unknownId,'uncertain:'+unknownId,fixturePlayer]);let deliveries=0;await work(async()=>{deliveries++;throw Error('connection lost after possible acceptance');},{nonIdempotentMail:true});assert.equal((await db.query('SELECT status FROM scratch_outbox WHERE id=$1',[unknownId])).rows[0].status,'unknown');assert.equal(await work(async()=>{deliveries++;return {receipt:'should-not-send'};},{nonIdempotentMail:true}),false);assert.equal(deliveries,1);
 // Verified provider evidence resolves UNKNOWN without sending again; duplicates do not inflate delivery.
 const delivery=require('../lib/scratch-delivery.ts');const envelope={Message:JSON.stringify({eventType:'Delivery',mail:{messageId:'synthetic-ses-id',tags:{scratch_job:[unknownId]}}})};await delivery.recordDelivery(envelope);await delivery.recordDelivery(envelope);assert.equal((await db.query('SELECT delivery FROM scratch_outbox WHERE id=$1',[unknownId])).rows[0].delivery,'delivered');assert.equal((await db.query("SELECT count(*)::int n FROM scratch_event WHERE id=$1",['delivery:'+unknownId+':Delivery'])).rows[0].n,1);await delivery.recordDelivery({Message:JSON.stringify({eventType:'Complaint',mail:{messageId:'synthetic-ses-id',tags:{scratch_job:[unknownId]}}})});await delivery.recordDelivery(envelope);assert.equal((await db.query('SELECT delivery FROM scratch_outbox WHERE id=$1',[unknownId])).rows[0].delivery,'complained');await assert.rejects(delivery.recordDelivery({Message:JSON.stringify({eventType:'Delivery',mail:{messageId:'wrong-receipt',tags:{scratch_job:[unknownId]}}})}),/mismatch/);
 // Different players contend for the same last free reward under a campaign-row lock.
 await db.query("UPDATE scratch_campaign SET free_remaining=1 WHERE id='synthetic-launch'");const ta=await makePlayer(),tb=await makePlayer();const ca=(await act(ta,'start')).plays[0].id,cb=(await act(tb,'start')).plays[0].id;await fixtureBoard(ca);await fixtureBoard(cb);await reveal(ta,ca,0);await reveal(tb,cb,0);await Promise.all([reveal(ta,ca,1),reveal(tb,cb,1)]);assert.ok((await db.query("SELECT count(*)::int n FROM scratch_card WHERE id=ANY($1::uuid[]) AND prize='free'",[[ca,cb]])).rows[0].n<=1);assert.ok((await db.query('SELECT free_remaining FROM scratch_campaign')).rows[0].free_remaining>=0);
 const fulfillment=require('../lib/scratch-fulfillment.ts');assert.throws(()=>fulfillment.approvedWeights(null),/frequency/);assert.deepEqual(fulfillment.approvedWeights(1),{'25':6930,'40':1980,'50':990,free:100});const awardedCount=Number((await db.query("SELECT count(*) n FROM scratch_card WHERE prize='free'")).rows[0].n);assert.equal((await fulfillment.fulfillment()).length,awardedCount);assert.deepEqual(await fulfillment.adjustCap(6),{total:6,awarded:awardedCount,remaining:6-awardedCount});assert.deepEqual(await fulfillment.adjustCap(8),{total:8,awarded:awardedCount,remaining:8-awardedCount});await assert.rejects(fulfillment.adjustCap(awardedCount-1),/below/);await assert.rejects(api.pool().query("UPDATE scratch_fulfillment SET status='booked'"),/permission denied/);
 // A crashed worker's expired verification must be retired without sending.
 await db.query("UPDATE scratch_outbox SET status='accepted' WHERE status IN ('pending','working')");
 const staleChallenge=randomUUID(),staleJob=randomUUID();
 await db.query("INSERT INTO scratch_verification(id,player,hash,profile,request_hash,expires_at) VALUES($1,$2,'synthetic-hash','{}','synthetic-request',now()-interval '1 second')",[staleChallenge,fixturePlayer]);
 await db.query("INSERT INTO scratch_outbox(id,dedupe,player,kind,payload,status,lease_until) VALUES($1,$2,$3,'verification',$4,'working',now()-interval '1 second')",[staleJob,'stale:'+staleJob,fixturePlayer,{verificationId:staleChallenge,code:'synthetic-expired'}]);
 assert.equal(await work(async()=>assert.fail('Expired verification must not dispatch')),false);
 const stale=(await db.query('SELECT status,payload FROM scratch_outbox WHERE id=$1',[staleJob])).rows[0];assert.equal(stale.status,'failed');assert.deepEqual(stale.payload,{});
 // VIP authorization remains verified server identity; test wins never consume public inventory.
 const beforeVip=await analytics.report();
 const inventory=(await db.query('SELECT free_remaining FROM scratch_campaign')).rows[0].free_remaining;
 const fulfillmentBefore=(await fulfillment.fulfillment()).length;
 const vip=await makePlayer('philip@companytheatre.ca');
 assert.equal((await api.state(vip)).vipTest,true);
 // Seed one legacy genuine award to prove it is retained and not reclassified.
 const vipPlayer=(await db.query('SELECT player FROM scratch_session WHERE hash=$1',[api.hash(vip)])).rows[0].player;
 const legacy=randomUUID();await db.query("INSERT INTO scratch_card(id,player,day,round,prize,revealed) VALUES($1,$2,current_date,$3,'25',true)",[legacy,vipPlayer,{board:[],chosen:[],revealed:[],active:null,status:'won'}]);
 for(let n=0;n<5;n++){
  const current=await act(vip,'start'),card=current.plays.at(-1).id;
  assert.equal(current.vipTest,true);assert.equal(current.plays.at(-1).isTest,true);assert.equal(current.remaining,1);
  await fixtureBoard(card);await reveal(vip,card,0);await reveal(vip,card,1);
  const result=await act(vip,'reveal_prize',{cardId:card});assert.equal(result.plays.at(-1).prize,'25');
  await assert.rejects(act(vip,'email_prize',{cardId:card}),/test prize emails are disabled/);
 }
 assert.equal((await db.query('SELECT free_remaining FROM scratch_campaign')).rows[0].free_remaining,inventory);
 assert.equal((await fulfillment.fulfillment()).length,fulfillmentBefore);
 assert.equal((await db.query('SELECT is_test,prize FROM scratch_card WHERE id=$1',[legacy])).rows[0].is_test,false);
 assert.equal((await db.query("SELECT count(*)::int n FROM scratch_outbox WHERE player=$1 AND kind='prize'",[vipPlayer])).rows[0].n,0);
 await analytics.collect({id:randomUUID(),name:'prize_outbound',props:{tier:'25'}},vip);
 const afterVip=await analytics.report();assert.deepEqual(afterVip.counts,beforeVip.counts);
 assert.equal((await db.query("SELECT count(*)::int n FROM scratch_event WHERE player=$1 AND props->>'vip_test'='true'",[vipPlayer])).rows[0].n>20,true);
 assert.equal(afterVip.cards.reduce((n,d)=>n+d.cards,0),beforeVip.cards.reduce((n,d)=>n+d.cards,0)+1); // only legacy public card
 const lookalike=await makePlayer('philip+vip@companytheatre.ca');assert.equal((await api.state(lookalike)).vipTest,false);
 await assert.rejects(api.mutate(lookalike,{action:'start',requestId:randomUUID(),vipTest:true}),/Invalid request/);
 await assert.rejects(api.mutate(lookalike,{action:'start',requestId:randomUUID(),email:'philip@companytheatre.ca'}),/Invalid request/);
 await db.query('UPDATE scratch_player SET verified=false WHERE id=$1',[vipPlayer]);await assert.rejects(api.state(vip),/verify/);
 await db.query('UPDATE scratch_player SET verified=true WHERE id=$1',[vipPlayer]);
 // Owner-only preview gate fails before any signup persistence or mail queue.
 process.env.SCRATCH_PREVIEW_ONLY='1';
 const previewCounts=async()=> (await db.query('SELECT (SELECT count(*)::int FROM scratch_player) players,(SELECT count(*)::int FROM scratch_outbox) jobs')).rows[0];
 const previewBefore=await previewCounts();
 await assert.rejects(makePlayer('not-invited@example.invalid'),e=>e.status===403&&/limited to invited testers/.test(e.message));
 assert.deepEqual(await previewCounts(),previewBefore);
 const previewOwner=await makePlayer('PHILIP@COMPANYTHEATRE.CA');assert.equal((await api.state(previewOwner)).vipTest,true);
 process.env.SCRATCH_PREVIEW_ONLY='0';await makePlayer('preview-disabled@example.invalid');
 delete process.env.SCRATCH_PREVIEW_ONLY;
 await assert.rejects(api.pool().query('DELETE FROM scratch_event'),/permission denied/);
 console.log('Verified restricted role; concurrent start/choice, hidden board, winner/three-play limits, stock, expiry, event dedupe/privacy, worker outage/recovery.');
});
