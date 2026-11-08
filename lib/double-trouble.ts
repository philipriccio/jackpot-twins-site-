export const ITEMS = ['bernie','gerry','chair','snacks','phone','slippers','cake','subaru','freshener','jacket','penny','peter','harold','abigail'] as const;
export type Item = typeof ITEMS[number];
export const MAX_CHOICES = 5;
// Saves created before four-choice rules have no explicit limit.
export const choiceLimit = (round: Round): 4|5 => round.maxChoices ?? 5;
export type Round = { maxChoices?: 4|5; board: Item[]; chosen: number[]; revealed: number[]; active: number|null; status: 'playing'|'won'|'lost' };
export function createRound(board: readonly Item[], maxChoices: 4|5 = MAX_CHOICES): Round {
 if(maxChoices!==4&&maxChoices!==5)throw Error('Invalid choice limit');
 if(board.length!==9 || new Set(board).size!==9 || board.some(x=>!ITEMS.includes(x)) || !board.includes('bernie') || !board.includes('gerry')) throw Error('Invalid board');
 return {maxChoices,board:[...board],chosen:[],revealed:[],active:null,status:'playing'};
}
export function shuffledBoard(randomInt:(max:number)=>number): Item[] {
 const props: Item[]=ITEMS.filter(item=>item!=='bernie'&&item!=='gerry');
 const shuffle=(list:Item[])=>{for(let i=list.length-1;i>0;i--){const j=randomInt(i+1);if(!Number.isInteger(j)||j<0||j>i)throw Error('Invalid random index');[list[i],list[j]]=[list[j],list[i]];}};
 shuffle(props);
 const board:Item[]=['bernie','gerry',...props.slice(0,7)];
 shuffle(board);
 return board;
}
export function choose(round:Round,index:number):Round {
 if(round.status!=='playing'||round.active!==null||round.chosen.length>=choiceLimit(round)||round.chosen.includes(index)||!Number.isInteger(index)||index<0||index>8)return round;
 return {...round,chosen:[...round.chosen,index],active:index};
}
export function finish(round:Round,index:number):Round {
 if(round.status!=='playing'||!Number.isInteger(index)||index<0||index>=9||round.active===null||round.active!==index||!round.chosen.includes(index)||round.revealed.includes(index))return round;
 const revealed=[...round.revealed,index],found=revealed.map(i=>round.board[i]);
 return {...round,revealed,active:null,status:found.includes('bernie')&&found.includes('gerry')?'won':round.chosen.length===choiceLimit(round)?'lost':'playing'};
}
