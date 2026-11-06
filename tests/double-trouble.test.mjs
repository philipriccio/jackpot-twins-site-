import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,mkdtempSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const require=createRequire(import.meta.url),ts=require('typescript');
const target=join(mkdtempSync(join(tmpdir(),'dt-test-')),'game.cjs');
writeFileSync(target,ts.transpileModule(readFileSync(new URL('../lib/double-trouble.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText);
const {ITEMS,createRound,choose,finish,shuffledBoard}=require(target);
test('all 126 four-pick sets yield exactly 21 wins',()=>{let sets=0,wins=0;for(let a=0;a<6;a++)for(let b=a+1;b<7;b++)for(let c=b+1;c<8;c++)for(let d=c+1;d<9;d++){let r=createRound(ITEMS.slice(0,9));for(const i of [a,b,c,d])r=finish(choose(r,i),i);sets++;if(r.status==='won')wins++;assert.notEqual(r.status,'playing');assert.ok(r.chosen.length<=4);}assert.equal(sets,126);assert.equal(wins,21);});
test('first commitment locks other tiles; duplicate and stale events cannot spend or reveal',()=>{const r=choose(createRound(ITEMS.slice(0,9)),4);assert.equal(choose(r,1),r);assert.equal(choose(r,4),r);assert.equal(finish(r,1),r);const done=finish(r,4);assert.equal(finish(done,4),done);assert.equal(choose(done,4),done);assert.deepEqual(done.chosen,[4]);assert.deepEqual(done.revealed,[4]);});
test('four props lose, ending disallows all further choices',()=>{let r=createRound(ITEMS.slice(0,9));for(const i of [2,3,4,5])r=finish(choose(r,i),i);assert.equal(r.status,'lost');assert.equal(choose(r,0),r);assert.equal(finish(r,0),r);});
test('two twins end early, no object rewards and board never changes',()=>{let r=createRound(ITEMS.slice(0,9));const board=[...r.board];for(const i of [1,0])r=finish(choose(r,i),i);assert.equal(r.status,'won');assert.equal(r.chosen.length,2);assert.deepEqual(r.board,board);assert.equal(choose(r,2),r);});
test('validates board and bounded shuffle inputs',()=>{assert.throws(()=>createRound(['bernie']));assert.throws(()=>createRound(Array(9).fill('gerry')));assert.throws(()=>shuffledBoard(()=>9));for(let k=0;k<9;k++){const b=shuffledBoard(max=>k%max);assert.equal(b.length,9);assert.equal(new Set(b).size,9);assert.ok(b.includes('bernie')&&b.includes('gerry'));assert.ok(b.every(x=>ITEMS.includes(x)));}const r=createRound(ITEMS.slice(0,9));for(const i of [-1,9,NaN,1.5])assert.equal(choose(r,i),r);});

test('expanded prop pool retains two twins and seven distinct distractors',()=>{const seen=new Set();for(let k=0;k<100;k++){let n=k;const board=shuffledBoard(max=>{n=(n*1664525+1013904223)>>>0;return n%max;});assert.equal(board.filter(x=>x==='bernie'||x==='gerry').length,2);assert.equal(board.length,9);assert.equal(new Set(board).size,9);assert.ok(!board.includes('tea')&&!board.includes('remote'));board.forEach(x=>seen.add(x));}assert.deepEqual([...seen].sort(),[...ITEMS].sort());assert.throws(()=>createRound(ITEMS.slice(2)));});

test('all 3024 ordered four-choice paths match exact early-win probabilities',()=>{
 const outcomes={lost:0,2:0,3:0,4:0};let paths=0;
 function visit(picks){if(picks.length<4){for(let i=0;i<9;i++)if(!picks.includes(i))visit([...picks,i]);return;}
 let r=createRound(ITEMS.slice(0,9));for(const i of picks)r=finish(choose(r,i),i);
 outcomes[r.status==='won'?r.chosen.length:'lost']++;paths++;assert.notEqual(r.status,'playing');
 }
 visit([]);assert.equal(paths,3024);assert.deepEqual(outcomes,{lost:2520,2:84,3:168,4:252});
});


test('malformed completion callbacks cannot reveal an uncommitted square',()=>{
 const idle=createRound(ITEMS.slice(0,9));
 for(const index of [null,undefined,NaN,Infinity,-1,9,0,'0'])assert.equal(finish(idle,index),idle);
 const active=choose(idle,0);
 for(const index of [null,undefined,NaN,Infinity,-1,9,1,'0'])assert.equal(finish(active,index),active);
 const revealed=finish(active,0);assert.deepEqual(revealed.revealed,[0]);assert.equal(finish(revealed,0),revealed);
});
