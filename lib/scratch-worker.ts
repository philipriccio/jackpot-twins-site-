import {setTimeout as sleep} from 'node:timers/promises';

export function validateWorkerConfiguration(env:NodeJS.ProcessEnv=process.env){
  const https=(value:string|undefined)=>{if(!value)throw Error('Worker configuration missing');const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash)throw Error('Invalid worker endpoint');};
  if(!env.SCRATCH_DATABASE_URL||!env.SCRATCH_CAMPAIGN_ID||!env.SCRATCH_INTAKE_TOKEN||env.SCRATCH_SEND_ENABLED!=='1')throw Error('Worker configuration missing or sending disabled');
  https(env.SCRATCH_CRM_URL);
  if(env.SCRATCH_MAIL_PROVIDER==='ses'){
    if(!env.SCRATCH_FROM_EMAIL||!env.AWS_SES_REGION)throw Error('SES configuration missing');
    if(env.SCRATCH_MAIL_MODE!=='live'&&!env.SCRATCH_TEST_RECIPIENTS)throw Error('Restricted recipients missing');
  }else if(env.SCRATCH_MAIL_PROVIDER==='broker'){
    https(env.SCRATCH_MAIL_URL);if(!env.SCRATCH_MAIL_TOKEN)throw Error('Broker configuration missing');
  }else throw Error('Unsupported mail provider');
}

// A single serial dispatcher, bounded batches and no overlapping leased work.
// Fatal database/configuration errors propagate; supervisor restart is explicit.
export async function runWorker(step:()=>Promise<boolean>,signal:AbortSignal,options:{batchSize?:number;pollMs?:number;pause?:(ms:number,signal:AbortSignal)=>Promise<void>;onBatch?:(count:number)=>void}={}){
  const batchSize=options.batchSize??100,pollMs=options.pollMs??1000;
  if(!Number.isInteger(batchSize)||batchSize<1||batchSize>100||!Number.isInteger(pollMs)||pollMs<100||pollMs>60000)throw Error('Invalid worker bounds');
  const pause=options.pause??(async(ms,abort)=>{try{await sleep(ms,undefined,{signal:abort});}catch(e){if(!abort.aborted)throw e;}});
  while(!signal.aborted){
    let count=0;
    while(!signal.aborted&&count<batchSize&&await step())count++;
    options.onBatch?.(count);
    if(!signal.aborted)await pause(pollMs,signal);
  }
}
