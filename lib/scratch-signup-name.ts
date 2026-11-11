/** Keep the existing full-name API and storage compatible with older clients. */
export function signupFullName(firstName:string,lastName:string):string {
 const first=firstName.trim(),last=lastName.trim();
 if(!first||!last)throw new Error('Please enter both your first and last name.');
 const name=`${first} ${last}`;
 if(name.length>80)throw new Error('Please keep your first and last name to 80 characters combined, including the space between them.');
 return name;
}
