import {createRound, choiceLimit, choose, finish, type Item, type Round} from './double-trouble';
export const STORAGE_KEY='jt-double-trouble-demo-v2';
export type Prize='25'|'40'|'50'|'free';
export type Play={id:string;day:string;round:Round;prize:Prize;prizeRevealed:boolean};
export type Account={name:string;email:string;consent:boolean;plays:Play[]};
export type Store={version:2;current:string|null;accounts:Record<string,Account>};
export const emptyStore=():Store=>({version:2,current:null,accounts:{}});
export function emailKey(email:string){return email.trim().toLowerCase();}
export function torontoDay(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function winningPlay(account:Account){return account.plays.find(p=>p.round.status==='won');}
export function remaining(account:Account,day=torontoDay()){if(winningPlay(account))return 0;return Math.max(0,3-account.plays.filter(p=>p.day===day).length);}
export function reserve(account:Account,board:Item[],prize:Prize,id:string,day=torontoDay()):Account{
 if(account.plays.some(p=>p.id===id))return account;
 if(winningPlay(account))throw Error('You already won! Reveal your prize and explore tickets.');
 if(typeof id!=='string'||!id.trim()||!validDay(day)||!['25','40','50','free'].includes(prize))throw Error('Invalid play details.');
 if(account.plays.some(p=>p.round.status==='playing'))throw Error('Finish your current card first.');
 if(!remaining(account,day))throw Error('You have used today’s three plays. Come back after midnight Toronto time.');
 return {...account,plays:[...account.plays,{id,day,round:createRound(board),prize,prizeRevealed:false}]};
}
function validDay(day:unknown):day is string {
 return typeof day==='string' && /^\d{4}-\d{2}-\d{2}$/.test(day) && !Number.isNaN(Date.parse(day)) && new Date(day).toISOString().slice(0,10)===day;
}
function validateRound(value:unknown):Round {
 if(!value||typeof value!=='object')throw Error('Saved card is unreadable.');
 const r=value as Round;
 if(r.maxChoices!==undefined&&r.maxChoices!==4&&r.maxChoices!==5)throw Error('Saved card is unreadable.');
 if(!Array.isArray(r.board)||!Array.isArray(r.chosen)||!Array.isArray(r.revealed)||r.chosen.length>5||r.revealed.length>r.chosen.length)throw Error('Saved card is unreadable.');
 // Upgrade the earlier local artwork draft without discarding plays or prizes.
 r.board=r.board.map(item=>(item as string)==='tea'?'freshener':(item as string)==='remote'?'subaru':item);
 let replay:Round;
 try{replay=createRound(r.board,choiceLimit(r));}catch{throw Error('Saved card is unreadable.');}
 // Replay the real state machine: a chosen square must finish before the next
 // can begin, and no choices may follow a completed win/loss.
 for(let i=0;i<r.chosen.length;i++){
  const next=choose(replay,r.chosen[i]);
  if(next===replay)throw Error('Saved card is unreadable.');
  replay=next;
  if(i<r.revealed.length){
   if(r.revealed[i]!==r.chosen[i])throw Error('Saved card is unreadable.');
   replay=finish(replay,r.chosen[i]);
  }
 }
 if(replay.status!==r.status||replay.active!==r.active)throw Error('Saved card is unreadable.');
 return r;
}
export function readStore(raw:string|null):Store{
 if(raw===null)return emptyStore();
 let x:Store;
 try{x=JSON.parse(raw) as Store;}catch{throw Error('Saved game is unreadable.');}
 if(!x||typeof x!=='object'||x.version!==2||!x.accounts||typeof x.accounts!=='object'||Array.isArray(x.accounts)||!(x.current===null||typeof x.current==='string'))throw Error('Saved game is unreadable.');
 // Coating caches use play IDs across all accounts in this browser.
 const ids=new Set<string>();
 for(const [key,a] of Object.entries(x.accounts)){
 if(!key.trim()||!a||typeof a.name!=='string'||typeof a.email!=='string'||emailKey(a.email)!==key||typeof a.consent!=='boolean'||!Array.isArray(a.plays))throw Error('Saved account is unreadable.');
 const days=new Map<string,number>();
 for(const [index,p] of a.plays.entries()){
 if(!p||typeof p.id!=='string'||!p.id.trim()||ids.has(p.id)||!validDay(p.day)||!['25','40','50','free'].includes(p.prize)||typeof p.prizeRevealed!=='boolean')throw Error('Saved play is unreadable.');
 ids.add(p.id);
 days.set(p.day,(days.get(p.day)??0)+1);
 if(days.get(p.day)!>3)throw Error('Saved play limit is unreadable.');
 const r=validateRound(p.round);
 if((p.prizeRevealed&&r.status!=='won')||(r.status==='playing'&&index!==a.plays.length-1))throw Error('Saved play is unreadable.');
 }
 }
 if(x.current!==null&&!Object.hasOwn(x.accounts,x.current))throw Error('Saved player is missing.');
 return x;
}
