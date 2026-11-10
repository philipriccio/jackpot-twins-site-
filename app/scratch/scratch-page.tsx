import Image from 'next/image';
import Link from 'next/link';
import ScratchSidebar from './scratch-sidebar';
import DoubleTrouble from './double-trouble';
import './scratch-page.css';

const faces = [
  {name:'Bernie',image:'/images/double-trouble/bernie.webp',description:'Gerry’s twin'},
  {name:'Gerry',image:'/images/double-trouble/gerry.webp',description:'Bernie’s twin'},
  {name:'Pete',image:'/images/cast-20261103/tony.webp',description:'Bernie’s boyfriend.'},
  {name:'Harold',image:'/images/cast-20261103/colin.webp',description:'The lottery investigator.'},
  {name:'Abigail',image:'/images/cast-20261103/caroline.webp',description:'Bernie’s daughter.'},
];
const props = [
  {name:'Recliner',description:'B and G’s Chairs'},
  {name:'Cheese Snacks',description:'B and G’s fave treats'},
  {name:'Telephone',description:'G’s landline'},
  {name:'Overalls',description:'B and G’s work uniform'},
  {name:'Birthday Cake',description:'B and G’s Bday dessert'},
  {name:'Car',description:'Pete’s Subaru'},
  {name:'Air Freshener',description:'Secret to Pete’s success'},
  {name:'Leather Jacket',description:'Abigail’s new jacket'},
  {name:'Penny',description:'B’s lucky penny'},
];

export default function ScratchPage(){
 return <main className="scratch-room">
  <header className="scratch-room-header"><Link href="/" className="scratch-home-link">← Jackpot Twins</Link><p>A little luck. A lot of trouble.</p><a href="#scratch-image-guide">People & objects ↓</a></header>
  <div className="scratch-room-layout">
   <section className="scratch-game-column" aria-labelledby="scratch-page-title"><h1 id="scratch-page-title" className="scratch-page-title">The Jackpot Twins Scratch Game</h1><DoubleTrouble embedded/></section>
   <ScratchSidebar className="scratch-sidebar scratch-guide" id="scratch-image-guide" title="Scratch Game" subtitle="People and Objects"><div className="scratch-sidebar-content">
    <h2>People</h2><ul className="scratch-guide-list scratch-guide-people">{faces.map(face=><li key={face.name}><span className={`scratch-guide-image scratch-guide-head scratch-guide-head-${face.name.toLowerCase()}`}><Image src={face.image} width={96} height={96} alt={`${face.name} — ${face.description}`} unoptimized/></span><div><h3>{face.name}</h3><p>{face.description}</p></div></li>)}</ul>
    <h2>Objects</h2><ul className="scratch-guide-list">{props.map((prop,index)=><li key={prop.name}><span className="scratch-guide-image scratch-guide-prop" role="img" aria-label={`${prop.name} — ${prop.description}`} style={{backgroundPosition:`${index%3*50}% ${Math.floor(index/3)*50}%`}}/><div><h3>{prop.name}</h3><p>{prop.description}</p></div></li>)}</ul>
   </div></ScratchSidebar>
  </div>
  <footer className="scratch-room-footer"><Link href="/">Discover Jackpot Twins</Link><span>The Company Theatre & Mirvish Productions</span></footer>
 </main>;
}
