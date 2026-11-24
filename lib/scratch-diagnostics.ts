// Coarse first-party diagnostics only. Never include payloads, IDs or error messages.
export const DIAGNOSTIC_EVENTS = ['load_failed','load_recovered','retry_attempt','retry_result','gameplay_pause','action_failed'] as const;
export const diagnosticValues = {
 operation:['settings','saved_game','start','commit','complete','reveal_prize','other'],
 failure:['network','server','rate_limit','auth','request','invalid_response','unknown'],
 result:['success','failure','signed_out'],
 stage:['choose_square','scratch_square'],
 duration:['90s'],
} as const;
export function failureCategory(error:unknown):string {
 const e=error as {status?:number;diagnostic?:string}|null;
 if(e?.diagnostic==='invalid_response')return 'invalid_response';
 if(e?.status===429)return 'rate_limit';
 if(e?.status===401||e?.status===403)return 'auth';
 if(typeof e?.status==='number'&&e.status>=500)return 'server';
 if(typeof e?.status==='number'&&e.status>=400)return 'request';
 if(error instanceof TypeError)return 'network';
 return 'unknown';
}
export function invalidResponse(message:string){return Object.assign(new Error(message),{diagnostic:'invalid_response'});}
export function diagnosticOperation(value:string){return ['start','commit','complete','reveal_prize'].includes(value)?value:'other';}
export function createDiagnostics(send:(name:string,props:Record<string,string>)=>void){
 let budget=60;
 const failures=new Map<string,string>();
 function emit(name:string,props:Record<string,string>){if(budget<=0)return;budget--;try{send(name,props);}catch{/* Diagnostics never affect play. */}}
 return {
  emit,
  failed(operation:string,error:unknown){const failure=failureCategory(error);if(failures.get(operation)!==failure){failures.set(operation,failure);emit('load_failed',{operation,failure});}},
  recovered(operation:string,result:'success'|'signed_out'='success'){if(failures.delete(operation))emit('load_recovered',{operation,result});},
  reset(){failures.clear();},
 };
}
// One observation per broad stage per card; pauses are NOT proof of trouble.
// cardKey/progressKey stay in memory and must never be included in event props.
export function createPauseObserver(){
 let cardKey:string|null=null,progressKey='',since:number|null=null;
 const observed=new Set<string>();
 return {sample(now:number,card:string|null,progress:string,stage:'choose_square'|'scratch_square',eligible:boolean){
  if(card!==cardKey){cardKey=card;observed.clear();since=null;progressKey='';}
  if(!card||!eligible){since=null;return false;}
  if(progress!==progressKey||since===null){progressKey=progress;since=now;return false;}
  if(now-since<90000||observed.has(stage))return false;
  observed.add(stage);return true;
 }};
}
