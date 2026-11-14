require('../scripts/scratch-register.cjs');
const {test}=require('node:test'),assert=require('node:assert/strict');
const {prizeMailStatus}=require('../lib/prize-mail-status.ts');
const {renderPrizeEmail}=require('../lib/prize-email.ts');
test('reward status never equates enqueue or acceptance with delivery; old awards are not promised mail',()=>{
 assert.match(prizeMailStatus(null),/No reward email is recorded/);
 for(const status of ['pending','working']){const message=prizeMailStatus({status,delivery:null},'synthetic@example.invalid');assert.match(message,/queued for synthetic@example.invalid/);assert.match(message,/not yet confirmed/);}
 for(const status of ['accepted','unknown'])assert.doesNotMatch(prizeMailStatus({status,delivery:null}),/confirmed delivery/);
 assert.match(prizeMailStatus({status:'failed',delivery:null}),/could not be sent/);
 assert.match(prizeMailStatus({status:'accepted',delivery:'delivered'}),/confirmed delivery/);
 for(const delivery of ['bounced','complained','rejected'])assert.match(prizeMailStatus({status:'accepted',delivery}),/could not be delivered/);
});
test('congratulations email includes all discount codes and accurate automatic footer; free fulfillment retained',()=>{
 for(const prize of ['25','40','50']){const email=renderPrizeEmail({name:'Synthetic',prize});assert.match(email.text,/Congratulations/);for(const body of [email.text,email.html]){assert.match(body,new RegExp('SCRATCHPR'+prize));assert.match(body,/promo=scratchpr/);assert.match(body,/This email saves the prize you won/);assert.doesNotMatch(body,/You requested/);}}
 const free=renderPrizeEmail({name:'Synthetic',prize:'free',awardReference:'synthetic-reference',freeInstructions:'Team will contact you.'});assert.match(free.text,/synthetic-reference/);assert.match(free.html,/Team will contact you/);
});
