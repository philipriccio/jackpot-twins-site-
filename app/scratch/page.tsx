import {notFound,redirect} from 'next/navigation';
import {scratchCanonicalQuery} from '../../lib/scratch-canonical-query';
import ScratchPage from './scratch-page';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){if(process.env.SCRATCH_ENABLED!=='1')notFound();const query=await searchParams;const params=new URLSearchParams(Object.entries(query).flatMap(([key,value])=>typeof value==='string'?[[key,value]]:[]));const canonical=scratchCanonicalQuery(query);if(params.toString()!==canonical.slice(1)||Object.values(query).some(Array.isArray))redirect('/scratch'+canonical);return <ScratchPage/>;}
