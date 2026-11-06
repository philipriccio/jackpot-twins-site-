require('../scripts/scratch-register.cjs');
const {test}=require('node:test'),assert=require('node:assert/strict');
const {signupConversion}=require('../lib/scratch-analytics.ts');
test('signup conversion counts distinct server players, not repeat requests or client events',()=>{
 const rows=[{authority:'client',name:'verified',events:99,verified_or_registered_players:99},{authority:'server',name:'signup_submitted',events:10,verified_or_registered_players:2},{authority:'server',name:'verified',events:1,verified_or_registered_players:1}];
 assert.equal(signupConversion(rows),0.5);
 assert.equal(signupConversion([]),null);
 assert.equal(signupConversion([rows[1]]),0);
});
