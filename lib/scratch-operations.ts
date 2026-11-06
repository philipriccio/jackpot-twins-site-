import {transaction} from './scratch-server';

export function parseEndDate(value:unknown):Date|null {
  if(value==='none')return null;
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value))throw Error('Use an exact UTC timestamp or none');
  const date=new Date(value);
  if(!Number.isFinite(date.getTime())||date.toISOString()!==(value.length===20?value.replace('Z','.000Z'):value))throw Error('Invalid UTC date');
  return date;
}

// Private operator role only: public runtime has no UPDATE(ends_at) grant.
export async function setCampaignEnd(value:unknown){
  const date=parseEndDate(value);
  return transaction(async db=>{
    const c=(await db.query('SELECT id,starts_at FROM scratch_campaign WHERE id=$1 FOR UPDATE',[process.env.SCRATCH_CAMPAIGN_ID])).rows[0];
    if(!c)throw Error('Campaign missing');
    if(date&&(date.getTime()<=Date.now()||date<=new Date(c.starts_at)))throw Error('End date must be in the future and after the start');
    await db.query('UPDATE scratch_campaign SET ends_at=$2 WHERE id=$1',[c.id,date]);
    return {campaign:c.id,endsAt:date?.toISOString()??null};
  });
}

// Bounded private maintenance, separate from web/worker role. Never delete players,
// awards, fulfillment, consent/audit evidence, or request-idempotency records.
export async function maintain(){
  return transaction(async db=>{
    const campaign=process.env.SCRATCH_CAMPAIGN_ID;
    if(!campaign)throw Error('Campaign required');
    const sessions=await db.query(`DELETE FROM scratch_session WHERE expires_at<now()-interval '7 days' AND hash IN (SELECT s.hash FROM scratch_session s JOIN scratch_player p ON p.id=s.player WHERE p.campaign=$1 AND s.expires_at<now()-interval '7 days' LIMIT 1000)`,[campaign]);
    const rates=await db.query(`DELETE FROM scratch_rate WHERE expires_at<now()-interval '7 days' AND key IN (SELECT key FROM scratch_rate WHERE expires_at<now()-interval '7 days' LIMIT 1000)`);
    const challenges=await db.query(`UPDATE scratch_verification SET profile='{}'::jsonb WHERE id IN (SELECT v.id FROM scratch_verification v JOIN scratch_player p ON p.id=v.player WHERE p.campaign=$1 AND (v.used OR v.expires_at<now()) AND v.profile<>'{}'::jsonb LIMIT 1000)`,[campaign]);
    const payloads=await db.query(`UPDATE scratch_outbox SET payload='{}'::jsonb, status=CASE WHEN status='pending' THEN 'failed' ELSE status END, error_code=CASE WHEN status='pending' THEN 'verification_expired' ELSE error_code END WHERE id IN (SELECT o.id FROM scratch_outbox o JOIN scratch_player p ON p.id=o.player JOIN scratch_verification v ON o.payload->>'verificationId'=v.id::text WHERE p.campaign=$1 AND o.kind='verification' AND o.status<>'working' AND (v.used OR v.expires_at<now()) AND o.payload<>'{}'::jsonb LIMIT 1000)`,[campaign]);
    return {sessions:sessions.rowCount,rates:rates.rowCount,challenges:challenges.rowCount,payloads:payloads.rowCount};
  });
}
