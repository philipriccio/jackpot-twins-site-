export type PrizeMail={status:string;delivery:string|null};
// Card-scoped evidence only: queue/acceptance is not confirmed inbox delivery.
export function prizeMailStatus(mail:PrizeMail|null|undefined,email?:string){
 if(!mail)return 'Your prize is saved here. No reward email is recorded for this card.';
 if(['bounced','complained','rejected'].includes(mail.delivery??''))return 'The email could not be delivered. Your prize remains saved here.';
 if(mail.delivery==='delivered')return 'The email provider confirmed delivery of your reward email.';
 if(mail.status==='unknown')return 'Email delivery is being checked. Your prize remains saved.';
 if(mail.status==='failed')return 'Email could not be sent. Your prize remains saved; please contact us.';
 if(mail.status==='accepted')return 'The email provider accepted your reward email. Delivery is not yet confirmed.';
 if(['pending','working'].includes(mail.status))return `Your reward email is queued${email?' for '+email:''}. No extra step is needed. Delivery is not yet confirmed.`;
 return 'Your prize is saved here. Email delivery is not yet confirmed.';
}
