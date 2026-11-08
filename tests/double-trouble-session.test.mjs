import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,mkdtempSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const require=createRequire(import.meta.url),ts=require('typescript'),dir=mkdtempSync(join(tmpdir(),'dt-session-'));
for(const name of ['double-trouble','double-trouble-session'])writeFileSync(join(dir,name+'.js'),ts.transpileModule(readFileSync(new URL('../lib/'+name+'.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText);
const {ITEMS,choose,finish}=require(join(dir,'double-trouble.js'));
const {reserve,remaining,torontoDay,readStore,emailKey,winningPlay}=require(join(dir,'double-trouble-session.js'));
const base=()=>({name:'QA',email:'qa@example.invalid',consent:false,plays:[]});
function win(a){const p=a.plays.at(-1);return {...a,plays:[...a.plays.slice(0,-1),{...p,round:finish(choose(finish(choose(p.round,0),0),1),1)}]};}
test('Toronto reset timezone and daylight saving',()=>{assert.equal(torontoDay(new Date('2026-11-04T04:59:59Z')),'2026-11-03');assert.equal(torontoDay(new Date('2026-11-04T05:00:00Z')),'2026-11-04');assert.equal(torontoDay(new Date('2026-07-04T04:00:00Z')),'2026-07-04');});
test('three reservations, next day allowed; duplicate start id idempotent',()=>{let a=base();for(let i=0;i<3;i++){a=reserve(a,ITEMS.slice(0,9),'40','p'+i,'2026-11-03');assert.equal(reserve(a,ITEMS.slice(0,9),'25','p'+i,'2026-11-03'),a);a.plays.at(-1).round={...a.plays.at(-1).round,status:'lost',chosen:[2,3,4,5,6],revealed:[2,3,4,5,6]};}assert.equal(remaining(a,'2026-11-03'),0);assert.throws(()=>reserve(a,ITEMS.slice(0,9),'25','p4','2026-11-03'));assert.equal(reserve(a,ITEMS.slice(0,9),'25','p4','2026-11-04').plays.length,4);});
test('unfinished card cannot be replaced; persistence retains prize and active tile',()=>{let a=reserve(base(),ITEMS.slice(0,9),'50','id','2026-11-03');assert.throws(()=>reserve(a,ITEMS.slice(0,9),'25','new','2026-11-03'));a.plays[0].round=choose(a.plays[0].round,3);const s={version:2,current:a.email,accounts:{[a.email]:a}};assert.deepEqual(readStore(JSON.stringify(s)),s);assert.equal(a.plays[0].prize,'50');});
test('email normalization and corrupt storage failure',()=>{assert.equal(emailKey(' QA@Example.Invalid '),'qa@example.invalid');for(const s of ['bad','{}','{"version":2,"current":"missing","accounts":{}}'])assert.throws(()=>readStore(s));});

test('a winner cannot reserve another play on any day, including after refresh',()=>{const a=win(reserve(base(),ITEMS.slice(0,9),'40','win','2026-11-03'));a.plays[0].prizeRevealed=true;const stored=readStore(JSON.stringify({version:2,current:a.email,accounts:{[a.email]:a}})).accounts[a.email];for(const day of ['2026-11-03','2026-11-04']){assert.equal(remaining(stored,day),0);assert.throws(()=>reserve(stored,ITEMS.slice(0,9),'25','new',day),/already won/);}assert.equal(winningPlay(stored).id,'win');});
test('legacy later losing cards never hide an earlier prize or unlock play',()=>{const a=win(reserve(base(),ITEMS.slice(0,9),'free','first','2026-11-03'));a.plays.push({...a.plays[0],id:'later',round:{...a.plays[0].round,status:'lost'}});assert.equal(winningPlay(a).id,'first');assert.equal(remaining(a,'2026-12-01'),0);assert.throws(()=>reserve(a,ITEMS.slice(0,9),'25','new','2026-12-01'),/already won/);});

const serializeAccount=a=>JSON.stringify({version:2,current:a.email,accounts:{[a.email]:a}});
test('saved cards reject impossible outcomes, active choices and premature prizes',()=>{
 const a=reserve(base(),ITEMS.slice(0,9),'25','valid','2026-11-03');
 const changes=[
  p=>{delete p.round;},p=>{p.round=null;},p=>{p.round.status='won';},p=>{p.round.status='lost';},
  p=>{p.round.chosen=[2,3];p.round.active=3;},
  p=>{p.round.chosen=[2];p.round.revealed=[2];p.round.active=2;},
  p=>{p.round.chosen=[2];p.round.active=null;},
  p=>{p.round.chosen=[2,3];p.round.revealed=[3,2];p.round.active=null;},
  p=>{p.round.chosen=[0,1,2];p.round.revealed=[0,1,2];p.round.active=null;p.round.status='won';},
  p=>{p.round.chosen=[2,3,4,5,6];p.round.revealed=[2,3,4,5,6];p.round.active=null;},
  p=>{p.prizeRevealed=true;},p=>{p.day='2026-02-30';},p=>{p.id='';}
 ];
 for(const change of changes){const copy=structuredClone(a);change(copy.plays[0]);assert.throws(()=>readStore(serializeAccount(copy)),/Saved/);}
 for(const raw of ['null','[]','true','3','"text"'])assert.throws(()=>readStore(raw),/Saved game/);
});
test('saved history rejects duplicate identities, hidden unfinished cards and excess daily reservations',()=>{
 const a=reserve(base(),ITEMS.slice(0,9),'25','one','2026-11-03');
 const loss={...a.plays[0],round:{...a.plays[0].round,chosen:[2,3,4,5,6],revealed:[2,3,4,5,6],status:'lost'}};
 assert.throws(()=>readStore(serializeAccount({...a,plays:[loss,loss]})),/Saved play/);
 assert.throws(()=>readStore(serializeAccount({...a,plays:[a.plays[0],{...loss,id:'two'}]})),/Saved play/);
 assert.throws(()=>reserve({...a,plays:[a.plays[0],{...loss,id:'two'}]},ITEMS.slice(0,9),'25','three','2026-11-04'),/Finish/);
 assert.throws(()=>readStore(serializeAccount({...a,plays:Array.from({length:4},(_,i)=>({...loss,id:String(i)}))})),/Saved play limit/);
});
test('legacy artwork and valid pre-lockout history preserve exact prizes and dates',()=>{
 const a=win(reserve(base(),ITEMS.slice(0,9),'free','first','2026-11-03'));
 a.plays[0].prizeRevealed=true;
 a.plays[0].round.board=a.plays[0].round.board.map(x=>x==='subaru'?'remote':x==='freshener'?'tea':x);
 a.plays.push({...a.plays[0],id:'old-later',prizeRevealed:false,round:{board:ITEMS.slice(0,9),chosen:[2,3,4,5,6],revealed:[2,3,4,5,6],active:null,status:'lost'}});
 const restored=readStore(serializeAccount(a)).accounts[a.email];
 assert.deepEqual(restored.plays[0].round.board,ITEMS.slice(0,9));
 assert.equal(winningPlay(restored).prize,'free');assert.equal(winningPlay(restored).prizeRevealed,true);assert.equal(remaining(restored,'2026-11-04'),0);
 assert.equal(reserve(restored,ITEMS.slice(0,9),'25','first','2026-11-04'),restored);
});
test('every reachable board prefix round-trips while partially scratched and after release',()=>{
 const a=reserve(base(),ITEMS.slice(0,9),'50','all-states','2026-11-03');let checked=0;
 function check(r){const copy={...a,plays:[{...a.plays[0],round:r}]};assert.deepEqual(readStore(serializeAccount(copy)).accounts[a.email],copy);checked++;}
 function walk(r){check(r);if(r.status!=='playing')return;for(let i=0;i<9;i++){const c=choose(r,i);if(c===r)continue;check(c);walk(finish(c,i));}}
 walk({...a.plays[0].round,maxChoices:4});assert.equal(checked,6687);
 const legacy={...a.plays[0].round};delete legacy.maxChoices;walk(legacy);
 assert.equal(checked,6687+31887);console.log('Legal saved states checked (four-choice and legacy five-choice):',checked);
});
test('reservation validates metadata without spending a play',()=>{
 for(const [id,day,prize] of [['','2026-11-03','25'],['x','2026-02-30','25'],['x','2026-11-03','unknown']])assert.throws(()=>reserve(base(),ITEMS.slice(0,9),prize,id,day),/Invalid play/);
});

test('legacy fifth scratch survives; subsequent cards use five choices',()=>{
 let a=reserve(base(),ITEMS.slice(0,9),'25','legacy','2026-11-03');
 delete a.plays[0].round.maxChoices;
 for(const i of [2,3,4,5])a.plays[0].round=finish(choose(a.plays[0].round,i),i);
 a=readStore(serializeAccount(a)).accounts[a.email];
 assert.equal(a.plays[0].round.status,'playing');
 a.plays[0].round=finish(choose(a.plays[0].round,6),6);
 a=readStore(serializeAccount(a)).accounts[a.email];
 assert.equal(a.plays[0].round.status,'lost');
 assert.equal(reserve(a,ITEMS.slice(0,9),'25','new','2026-11-03').plays[1].round.maxChoices,5);
});


test('cross-account play identities cannot share a cosmetic scratch cache',()=>{
 const first=reserve(base(),ITEMS.slice(0,9),'25','shared','2026-11-03');
 const second={...reserve(base(),ITEMS.slice(0,9),'free','shared','2026-11-03'),email:'other@example.invalid'};
 const store={version:2,current:first.email,accounts:{[first.email]:first,[second.email]:second}};
 assert.throws(()=>readStore(JSON.stringify(store)),/Saved play/);
 second.plays[0].id='distinct';assert.deepEqual(readStore(JSON.stringify(store)),store);
});
test('blank account keys cannot become invisible signed-in players',()=>{
 const a={...base(),email:''};assert.throws(()=>readStore(serializeAccount(a)),/Saved account/);
 const store={version:2,current:'constructor',accounts:{}};assert.throws(()=>readStore(JSON.stringify(store)),/Saved player/);
 // An own property is data, not an inherited account. No prototype mutation.
 const special={...base(),email:'__proto__'};
 const parsed=readStore(serializeAccount(special));assert.equal(Object.hasOwn(parsed.accounts,'__proto__'),true);
 assert.equal(Object.getPrototypeOf(parsed.accounts),Object.prototype);
});
test('invalid reservation identifiers fail explicitly without mutation',()=>{
 const a=base();for(const id of [null,undefined,5,{},[]])assert.throws(()=>reserve(a,ITEMS.slice(0,9),'25',id,'2026-11-03'),/Invalid play details/);
 assert.deepEqual(a,base());
});
