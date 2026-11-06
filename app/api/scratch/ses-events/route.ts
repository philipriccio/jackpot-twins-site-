import {NextResponse} from 'next/server';
import {authenticateNotification,recordDelivery} from '@/lib/scratch-delivery';
import {ScratchError} from '@/lib/scratch-server';
export const runtime='nodejs';
export async function POST(req:Request){try{if(!process.env.SCRATCH_SES_TOPIC_ARN)throw new ScratchError(503,'Delivery events not configured');const reader=req.body?.getReader();let size=0;const chunks:Uint8Array[]=[];if(reader)while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>128000){await reader.cancel();throw new ScratchError(413,'Notification too large');}chunks.push(value);}const verified=await authenticateNotification(JSON.parse(Buffer.concat(chunks).toString('utf8')));return NextResponse.json(await recordDelivery(verified),{headers:{'Cache-Control':'no-store'}});}catch(e){return NextResponse.json({error:e instanceof ScratchError?e.message:'Notification could not be verified'},{status:e instanceof ScratchError?e.status:403});}}
