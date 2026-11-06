'use client';
import {useEffect,useState,useRef} from 'react';
import {usePathname} from 'next/navigation';
import dynamic from 'next/dynamic';
import {observedSession} from './telemetry';
const Game=dynamic(()=>import('./double-trouble'),{ssr:false,loading:()=> <p role="status">Opening your game…</p>});
export default function ScratchInvitation(){const [open,setOpen]=useState(false),path=usePathname(),button=useRef<HTMLButtonElement>(null),wasOpen=useRef(false);useEffect(()=>{if(wasOpen.current&&!open)button.current?.focus();wasOpen.current=open;},[open]);useEffect(()=>{if(path!=='/')return;void fetch('/api/scratch/event',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:crypto.randomUUID(),visitorId:observedSession(),name:'invitation_seen',props:{placement:'homepage',source:'direct',device:matchMedia('(max-width:600px)').matches?'mobile':'desktop'}})}).catch(()=>{});},[path]);if(path!=='/')return null;return <>{open?<Game placement="homepage" onClose={()=>setOpen(false)}/>:<button ref={button} style={{position:'fixed',bottom:20,right:20,zIndex:900,background:'#ffe16c',color:'#38142d',border:'3px solid #ec2589',borderRadius:12,padding:'14px 20px',fontWeight:900}} onClick={()=>setOpen(true)}>Play the Jackpot Twins Scratch Game</button>}</>;}
