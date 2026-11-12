import {classifyScratchSource} from './scratch-acquisition';
export function scratchCanonicalQuery(query:Record<string,string|string[]|undefined>){
 const params=new URLSearchParams(Object.entries(query).flatMap(([key,value])=>typeof value==='string'?[[key,value]]:[]));
 const source=classifyScratchSource(params.toString());
 const clean=new URLSearchParams();
 if(source!=='direct')clean.set('source',source);
 // Preserve only a syntactically valid Meta click identifier for ad attribution.
 // Duplicate keys, arbitrary UTM values, email, verification and redirect data are dropped.
 if(typeof query.fbclid==='string'&&/^[a-zA-Z0-9_-]{1,500}$/.test(query.fbclid))clean.set('fbclid',query.fbclid);
 return clean.size?'?'+clean.toString():'';
}
