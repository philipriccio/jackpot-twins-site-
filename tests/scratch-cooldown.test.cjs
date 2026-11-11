require('../scripts/scratch-register.cjs');
const {test,after}=require('node:test'),assert=require('node:assert/strict'),{randomUUID}=require('node:crypto');
process.env.SCRATCH_DATABASE_URL='postgresql://jt_scratch_fixture@localhost/jt_scratch_synthetic_20261105';process.env.SCRATCH_CAMPAIGN_ID='synthetic-cooldown';
const api=require('../lib/scratch-server.ts');
const db=new (require('pg').Pool)({connectionString:'postgresql://localhost/jt_scratch_synthetic_20261105'});
after(async()=>{await db.end();await api.pool().end();});
test('restricted-role atomic resend cooldown, replay, isolation and hourly ceiling',async()=>{
 await db.query("INSERT INTO scratch_campaign VALUES('synthetic-cooldown',true,true,now()-interval '1 day',now()+interval '1 day',$1,0,'Synthetic only','Synthetic only') ON CONFLICT(id) DO NOTHING",[{25:1,40:0,50:0,free:0}]);
 const email=randomUUID()+'@example.invalid',profile={name:'Synthetic',email,consent:false},request={...profile,requestId:randomUUID()};
 const first=await api.signup(request);assert.equal(first.retryAfter,30);
 assert.equal((await api.signup(request)).verificationId,first.verificationId);
 await assert.rejects(api.signup({...request,name:'Different'}),/conflict/);
 const attempts=await Promise.allSettled(Array.from({length:8},()=>api.signup({...profile,email:email.toUpperCase(),requestId:randomUUID()})));
 assert.ok(attempts.every(x=>x.status==='rejected'&&x.reason.status===429&&x.reason.retryAfter>=1&&x.reason.retryAfter<=30));
 assert.equal((await db.query("SELECT count(*)::int n FROM scratch_outbox WHERE player=(SELECT id FROM scratch_player WHERE email=$1 AND campaign='synthetic-cooldown') AND kind='verification'",[email])).rows[0].n,1);
 assert.equal((await db.query('SELECT count FROM scratch_rate WHERE key=$1',['email:'+api.hash('synthetic-cooldown'+email)])).rows[0].count,1);
 const payload=(await db.query('SELECT payload FROM scratch_outbox WHERE dedupe=$1',['verify:'+first.verificationId])).rows[0].payload;
 assert.equal(typeof await api.verify({verificationId:first.verificationId,code:payload.code}),'string');
 const other=await api.signup({...profile,email:randomUUID()+'@example.invalid',requestId:randomUUID()});assert.ok(other.verificationId);
 const age=()=>db.query("UPDATE scratch_verification SET expires_at=clock_timestamp()+interval '14 minutes 29 seconds' WHERE player=(SELECT id FROM scratch_player WHERE email=$1 AND campaign='synthetic-cooldown')",[email]);
 await age();const race=await Promise.allSettled(Array.from({length:6},()=>api.signup({...profile,requestId:randomUUID()})));
 assert.equal(race.filter(x=>x.status==='fulfilled').length,1);assert.equal(race.filter(x=>x.status==='rejected'&&x.reason.status===429).length,5);
 for(let i=0;i<3;i++){await age();assert.ok((await api.signup({...profile,requestId:randomUUID()})).verificationId);}
 await age();assert.deepEqual(await api.signup({...profile,requestId:randomUUID()}),{limited:true});
});
