'use client';
import {useEffect,useRef,type PointerEvent,type TouchEvent} from 'react';

type Point={x:number;y:number};
type Props={storageId:string;prize?:boolean;disabled?:boolean;onStart:()=>boolean;onComplete:()=>void};
const prefix='jt-scratch-coating-v1:';
// Only cosmetic scratch coverage lives here. Choices and prizes use the validated game store.
export function clearScratchCoatings(){try{for(const key of Object.keys(sessionStorage))if(key.startsWith(prefix))sessionStorage.removeItem(key);}catch{/* Optional cosmetic cache. */}}
export default function ScratchSurface({storageId,prize=false,disabled=false,onStart,onComplete}:Props){
 const canvas=useRef<HTMLCanvasElement>(null),pointer=useRef<number|null>(null),last=useRef<Point|null>(null),ready=useRef(false),snapshot=useRef<HTMLCanvasElement|null>(null);
 const touch=useRef<number|null>(null),ignoreMouseUntil=useRef(0);
 const key=prefix+storageId;
 function remember(){const el=canvas.current;if(!ready.current||!el||!el.width||!el.height)return;const small=snapshot.current??document.createElement('canvas');small.width=256;small.height=256;const c=small.getContext('2d',{willReadFrequently:true});if(!c)return;c.drawImage(el,0,0,256,256);snapshot.current=small;return c;}
 function persist(){const c=remember();if(c)try{sessionStorage.setItem(key,snapshot.current!.toDataURL());}catch{/* Play remains usable when optional cosmetic storage is unavailable. */}return c;}
 useEffect(()=>{
  const el=canvas.current;if(!el)return;let disposed=false,loaded=false;
  function paint(){if(!el)return;const r=el.getBoundingClientRect();if(!r.width||!r.height)return;const w=Math.round(r.width*Math.min(devicePixelRatio,3)),h=Math.round(r.height*Math.min(devicePixelRatio,3));if(el.width===w&&el.height===h&&ready.current)return;if(ready.current)remember();el.width=w;el.height=h;const c=el.getContext('2d');if(!c)return;
   const g=c.createLinearGradient(0,0,w,h);for(const [stop,color] of (prize?[[0,'#c0c6d1'],[.25,'#ffffff'],[.5,'#aeb7c8'],[.75,'#f4f4fa'],[1,'#a3aec2']]:[[0,'#b8bec7'],[.3,'#f4f5f7'],[.55,'#a5adb8'],[.78,'#e4e8ed'],[1,'#a3aab4']]) as [number,string][])g.addColorStop(stop,color);
   c.fillStyle=g;c.fillRect(0,0,w,h);c.fillStyle=prize?'#392109':'#939da9';c.textAlign='center';c.textBaseline='middle';if(prize){c.fillStyle='#68204e';c.font=`900 ${w*.105}px Impact, Arial Black, sans-serif`;c.fillText('JACKPOT TWINS',w/2,h*.34);c.font=`bold ${w*.043}px Arial`;c.fillText('THE SCRATCH GAME',w/2,h*.48);c.fillStyle='#aa2068';c.font=`bold ${w*.052}px Arial`;c.fillText('SCRATCH TO REVEAL',w/2,h*.69);}else{c.font=`900 ${w*.19}px Impact, Arial Black, sans-serif`;c.fillText('JACKPOT',w/2,h*.34);c.fillText('TWINS',w/2,h*.53);c.font=`700 ${w*.075}px Arial`;c.fillText('MARCH 9–28, 2027',w/2,h*.76);}
   if(snapshot.current){c.globalCompositeOperation='destination-in';c.drawImage(snapshot.current,0,0,w,h);}c.globalCompositeOperation='destination-out';ready.current=true;
  }
  ready.current=false;snapshot.current=null;pointer.current=null;touch.current=null;last.current=null;const observer=new ResizeObserver(()=>{if(loaded)paint();});observer.observe(el);
  let saved:string|null=null;try{saved=sessionStorage.getItem(key);}catch{/* Optional cache. */}
  if(saved?.startsWith('data:image/png;base64,')&&saved.length<500000){const img=new window.Image();img.onload=()=>{if(disposed)return;const small=document.createElement('canvas');small.width=256;small.height=256;small.getContext('2d')?.drawImage(img,0,0,256,256);snapshot.current=small;loaded=true;paint();};img.onerror=()=>{if(!disposed){loaded=true;paint();}};img.src=saved;}else {loaded=true;paint();}
  const hide=()=>{pointer.current=null;touch.current=null;last.current=null;persist();};window.addEventListener('pagehide',hide);document.addEventListener('visibilitychange',hide);
  return()=>{disposed=true;persist();observer.disconnect();window.removeEventListener('pagehide',hide);document.removeEventListener('visibilitychange',hide);};
  // Each coating is keyed by immutable play/spot identity, never by render state.
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[key,prize]);
 // Touch owns its own stream: canceling native scrolling may cancel Pointer Events on iOS.
 // Never draw a touch twice through both event families.
 function draw(clientX:number,clientY:number){const el=canvas.current;if(disabled||!ready.current||!el)return;const r=el.getBoundingClientRect(),c=el.getContext('2d');if(!c||!r.width||!r.height)return;const p={x:Math.max(-1,Math.min(2,(clientX-r.left)/r.width)),y:Math.max(-1,Math.min(2,(clientY-r.top)/r.height))},prev=last.current;c.globalCompositeOperation='destination-out';c.lineWidth=el.width*(prize?.17:.25);c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo((prev?.x??p.x)*el.width,(prev?.y??p.y)*el.height);c.lineTo(p.x*el.width+.01,p.y*el.height+.01);c.stroke();last.current=p;}
 function finish(complete:boolean){pointer.current=null;touch.current=null;last.current=null;const c=persist();if(complete&&c&&!disabled){const pixels=c.getImageData(0,0,256,256).data;let removed=0;for(let i=3;i<pixels.length;i+=4)removed+=1-pixels[i]/255;if(removed/(256*256)>=.85)onComplete();}}
 function scratch(e:PointerEvent<HTMLCanvasElement>){if(e.pointerType==='touch'||pointer.current!==e.pointerId)return;draw(e.clientX,e.clientY);}
 function stop(e:PointerEvent<HTMLCanvasElement>,complete:boolean){if(e.pointerType==='touch'||pointer.current!==e.pointerId)return;if(complete)scratch(e);finish(complete);}
 function touchPoint(e:TouchEvent<HTMLCanvasElement>){return Array.from(e.changedTouches).find(t=>t.identifier===touch.current);}
 function touchStop(e:TouchEvent<HTMLCanvasElement>,complete:boolean){const point=touchPoint(e);if(!point)return;ignoreMouseUntil.current=Date.now()+1000;if(complete)draw(point.clientX,point.clientY);finish(complete);}
 return <canvas ref={canvas} aria-hidden="true"
  onTouchStart={e=>{ignoreMouseUntil.current=Date.now()+1000;if(!ready.current||disabled||touch.current!==null||pointer.current!==null||!onStart())return;const point=e.changedTouches[0];if(!point)return;touch.current=point.identifier;last.current=null;draw(point.clientX,point.clientY);}}
  onTouchMove={e=>{const point=touchPoint(e);if(point)draw(point.clientX,point.clientY);}}
  onTouchEnd={e=>touchStop(e,true)} onTouchCancel={e=>touchStop(e,false)}
  onPointerDown={e=>{if(e.pointerType==='touch'||(e.pointerType==='mouse'&&Date.now()<ignoreMouseUntil.current)||!ready.current||disabled||!e.isPrimary||e.button!==0||pointer.current!==null||touch.current!==null||!onStart())return;pointer.current=e.pointerId;last.current=null;e.currentTarget.setPointerCapture(e.pointerId);scratch(e);}}
  onPointerMove={scratch} onPointerUp={e=>stop(e,true)} onPointerCancel={e=>stop(e,false)} onLostPointerCapture={e=>stop(e,false)} style={{pointerEvents:disabled?'none':'auto'}}/>;
}
