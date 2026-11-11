require('../scripts/scratch-register.cjs');
const {test}=require('node:test'),assert=require('node:assert/strict');
const {signupFullName}=require('../lib/scratch-signup-name.ts');
test('both name fields must contain non-whitespace text',()=>{
 for(const pair of [['','Riccio'],['Philip',''],['  ','Riccio'],['Philip','\t\n'],['\u00a0','Smith']])assert.throws(()=>signupFullName(...pair),/both/);
});
test('preserves Unicode, compound names, hyphens and apostrophes while trimming edges',()=>{
 assert.equal(signupFullName('  Anne-Marie  ',"  O’Neill de Silva  "),'Anne-Marie O’Neill de Silva');
 assert.equal(signupFullName('李','王'),'李 王');
 assert.equal(signupFullName('José Luis',"D'Angelo"),"José Luis D'Angelo");
});
test('combined storage boundary is enforced without truncating either name',()=>{
 assert.equal(signupFullName('a'.repeat(39),'b'.repeat(40)).length,80);
 assert.throws(()=>signupFullName('a'.repeat(40),'b'.repeat(40)),/80 characters/);
});
