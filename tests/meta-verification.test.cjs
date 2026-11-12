require('../scripts/scratch-register.cjs');
const {test,after}=require('node:test'),assert=require('node:assert/strict'),{randomUUID}=require('node:crypto');
process.env.SCRATCH_DATABASE_URL='postgresql://jt_scratch_fixture@localhost/jt_scratch_synthetic_20261105';
process.env.SCRATCH_CAMPAIGN_ID='synthetic-meta-'+randomUUID();
const api=require('../lib/scratch-server.ts');
const db=new(require('pg').Pool)({connectionString:'postgresql://localhost/jt_scratch_synthetic_20261105'});
after(async()=>{try{for(const table of ['scratch_event','scratch_session','scratch_verification','scratch_outbox'])await db.query('DELETE FROM '+table+' WHERE player IN(SELECT id FROM scratch_player WHERE campaign=$1)',[process.env.SCRATCH_CAMPAIGN_ID]);await db.query('DELETE FROM scratch_player WHERE campaign=$1',[process.env.SCRATCH_CAMPAIGN_ID]);await db.query('DELETE FROM scratch_campaign WHERE id=$1',[process.env.SCRATCH_CAMPAIGN_ID]);}finally{await db.end();await api.pool().end();}});
test('concurrent valid challenges produce one first-verification conversion, repeat login produces none',async()=>{
 assert.equal((await db.query('SELECT current_database() AS name')).rows[0].name,'jt_scratch_synthetic_20261105');
 await db.query("INSERT INTO scratch_campaign VALUES($1,true,true,now()-interval '1 day',now()+interval '1 day',$2,0,'Synthetic only','Synthetic only')",[process.env.SCRATCH_CAMPAIGN_ID,{25:1,40:0,50:0,free:0}]);
 const email=randomUUID()+'@example.invalid';
 const challenge=async()=>{const {verificationId}=await api.signup({name:'Synthetic Meta',email,consent:false,requestId:randomUUID()});const code=(await db.query('SELECT payload FROM scratch_outbox WHERE dedupe=$1',['verify:'+verificationId])).rows[0].payload.code;await db.query("UPDATE scratch_verification SET expires_at=now()+interval '14 minutes' WHERE id=$1",[verificationId]);return {verificationId,code};};
 const a=await challenge(),b=await challenge();
 await assert.rejects(api.verifyRegistration({...a,code:'invalid'}),/invalid or expired/);
 const results=await Promise.all([api.verifyRegistration(a),api.verifyRegistration(b)]);
 assert.equal(results.filter(r=>r.firstVerification).length,1);assert.equal(results.filter(r=>!r.firstVerification).length,1);
 for(const r of results){assert.equal(typeof r.token,'string');assert.equal((await api.state(r.token)).profile.email,email);}
 await assert.rejects(api.verifyRegistration(a),/invalid or expired/);
 assert.equal((await api.verifyRegistration(await challenge())).firstVerification,false);
 assert.equal(typeof await api.verify(await challenge()),'string');
 const events=(await db.query("SELECT count(*)::int AS n FROM scratch_event WHERE campaign=$1 AND name='verified'",[process.env.SCRATCH_CAMPAIGN_ID])).rows[0];assert.equal(events.n,1);
});
