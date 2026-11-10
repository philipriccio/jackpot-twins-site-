import {classifyScratchSource} from '../../lib/scratch-acquisition';
export {classifyScratchSource} from '../../lib/scratch-acquisition';
// Opaque, short-lived observation identity. Never based on email or authentication.
let memory:{id:string;at:number}|undefined;
export function observedSession(){
 const now=Date.now(),valid=(value:{id?:unknown;at?:unknown}|null|undefined)=>value&&typeof value.at==='number'&&now>=value.at&&now-value.at<1800000&&typeof value.id==='string'&&/^[a-f0-9-]{36}$/.test(value.id);
 try{const saved=JSON.parse(sessionStorage.getItem('jt-scratch-observed-v1')??'null');if(valid(saved))return saved.id as string;}catch{/* Optional storage. */}
 if(!valid(memory))memory={id:crypto.randomUUID(),at:now};
 try{sessionStorage.setItem('jt-scratch-observed-v1',JSON.stringify(memory));}catch{/* Memory-only identity also expires. */}
 return memory!.id;
}
export function scratchAttribution(placement:'homepage'|'scratch_page'){
 return {placement,source:classifyScratchSource(location.search),device:matchMedia('(max-width:600px)').matches?'mobile':'desktop'};
}
export function trackScratch(name:string,placement:'homepage'|'scratch_page',props:Record<string,string>={}){
 try{void fetch('/api/scratch/event',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:crypto.randomUUID(),visitorId:observedSession(),name,props:{...scratchAttribution(placement),...props}}),keepalive:true}).catch(()=>{});}catch{/* Observation must never interrupt gameplay or navigation. */}
}
