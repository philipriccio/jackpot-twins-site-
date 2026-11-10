// Only these coarse categories may leave the browser; never retain raw campaign values.
export type ScratchSource='direct'|'newsletter'|'social'|'partner'|'other';
export function classifyScratchSource(search:string):ScratchSource {
 const query=new URLSearchParams(search);
 const explicit=query.get('source')?.toLowerCase();
 if(explicit&&['direct','newsletter','social','partner','other'].includes(explicit))return explicit as ScratchSource;
 const source=query.get('utm_source')?.toLowerCase(),medium=query.get('utm_medium')?.toLowerCase();
 if(['newsletter','email','mailchimp'].includes(source??'')||medium==='email')return 'newsletter';
 if(['facebook','instagram','meta','tiktok','social'].includes(source??'')||['social','paid_social','organic_social'].includes(medium??''))return 'social';
 if(['partner','mirvish'].includes(source??'')||medium==='partner')return 'partner';
 return ['source','utm_source','utm_medium','utm_campaign','utm_content','utm_id'].some(key=>query.has(key))?'other':'direct';
}
