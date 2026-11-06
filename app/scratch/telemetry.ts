// Opaque, short-lived observation identity. Never based on email or authentication.
let memory:string|undefined;
export function observedSession(){try{const raw=JSON.parse(sessionStorage.getItem('jt-scratch-observed-v1')??'null');if(raw&&Date.now()-raw.at<1800000&&/^[a-f0-9-]{36}$/.test(raw.id))return raw.id as string;const id=crypto.randomUUID();sessionStorage.setItem('jt-scratch-observed-v1',JSON.stringify({id,at:Date.now()}));return id;}catch{return memory??=crypto.randomUUID();}}
