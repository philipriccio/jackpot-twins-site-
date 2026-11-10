'use client';
import {useEffect,useRef,type ReactNode} from 'react';
export default function ScratchSidebar({className,id,title,subtitle,children}:{className:string;id?:string;title:string;subtitle?:string;children:ReactNode}){
 const details=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{const reveal=()=>{if(id&&location.hash==='#'+id&&details.current)details.current.open=true;};if(details.current&&matchMedia('(max-width:600px)').matches)details.current.open=false;reveal();window.addEventListener('hashchange',reveal);return()=>window.removeEventListener('hashchange',reveal);},[id]);
 return <details open ref={details} className={className} id={id}><summary><div>{title}{subtitle&&<small className="scratch-guide-subtitle">{subtitle}</small>}</div><span aria-hidden="true">＋</span></summary>{children}</details>;
}
