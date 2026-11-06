import {notFound,redirect} from 'next/navigation';
import DoubleTrouble from './double-trouble';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){if(process.env.SCRATCH_ENABLED!=='1')notFound();const query=await searchParams;const source=typeof query.source==='string'&&['newsletter','social','partner'].includes(query.source)?query.source:null;if(Object.keys(query).some(k=>k!=='source')||query.source!==undefined&&!source)redirect('/scratch'+(source?'?source='+source:''));return <DoubleTrouble/>;}
