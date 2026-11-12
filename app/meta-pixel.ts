// Explicit events only. Never pass profiles, verification data, card IDs or offer URLs.
const pixel = '2190938354964220';
type PixelQueue = ((...args: unknown[]) => void) & {callMethod?: (...args: unknown[]) => void; queue?: unknown[][]; push?: PixelQueue; loaded?: boolean; version?: string; disablePushState?: boolean};
type MetaWindow = Window & {fbq?: PixelQueue; _fbq?: PixelQueue};
let configured = false;
let lastPage: string | null = null;
const seen = new Set<string>();
export function safeMetaUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.hash) return false;
    for (const [key, value] of url.searchParams) {
      if (key === 'source' && /^(direct|newsletter|social|partner|other)$/.test(value)) continue;
      if (/^utm_(source|medium|campaign|content|id)$/.test(key) && /^[a-z0-9][a-z0-9_.-]{0,99}$/i.test(value)) continue;
      if (key === 'fbclid' && /^[a-zA-Z0-9_-]{1,500}$/.test(value)) continue;
      return false;
    }
    return true;
  } catch { return false; }
}
function allowed() {
  return typeof window !== 'undefined' && window.location.protocol === 'https:' && ['jackpottwins.ca', 'www.jackpottwins.ca'].includes(window.location.hostname) && ['/', '/scratch', '/privacy'].includes(window.location.pathname) && safeMetaUrl(window.location.href) && (!document.referrer || safeMetaUrl(document.referrer));
}
export function initializeMeta(id: string | undefined) {
  try {
    if (configured || id !== pixel || !allowed()) return;
    const target = window as MetaWindow;
    // Do not share or reconfigure an unknown installation.
    if (target.fbq) return;
    const queue: PixelQueue = function (...args) { if (queue.callMethod) queue.callMethod(...args); else if (queue.queue!.length < 100) queue.queue!.push(args); };
    queue.queue = []; queue.push = queue; queue.loaded = true; queue.version = '2.0'; queue.disablePushState = true;
    target.fbq = target._fbq = queue;
    queue('set', 'autoConfig', false, pixel);
    queue('init', pixel);
    const script = document.createElement('script');
    script.async = true; script.src = 'https://connect.facebook.net/en_US/fbevents.js'; script.referrerPolicy = 'no-referrer';
    document.head.appendChild(script);
    configured = true;
  } catch { /* Blocked tracking must never affect the site. */ }
}
function send(name: 'PageView'|'Lead'|'TicketClick'|'ScratchStart'|'ScratchComplete', data: Record<string,string> = {}) {
  try {
    if (!configured || !allowed()) return;
    (window as MetaWindow).fbq?.(name === 'PageView' || name === 'Lead' ? 'trackSingle' : 'trackSingleCustom', pixel, name, data);
  } catch { /* Navigation and gameplay are independent of Meta. */ }
}
export function metaPage(path: string) {
  if (lastPage === path || !configured || !allowed()) return;
  lastPage = path;
  send('PageView', {page_category: path === '/scratch' ? 'scratch' : path === '/privacy' ? 'privacy' : 'home'});
}
export function metaVerified(result: {verified?: unknown; firstVerification?: unknown}, verificationId: string) {
  if (result.verified !== true || result.firstVerification !== true || seen.has('Lead:'+verificationId)) return;
  seen.add('Lead:'+verificationId);
  send('Lead', {content_name:'Scratch verified registration'});
}
export function isMirvishTicket(href: string) {
  try {const url = new URL(href);return url.protocol === 'https:' && ((/^(www\.)?mirvish\.com$/.test(url.hostname) && url.pathname === '/shows/jackpot-twins') || (url.hostname === 'tickets.mirvish.com' && url.pathname === '/events/jackpot'));} catch {return false;}
}
export function metaTicket(href: string) {if (isMirvishTicket(href)) send('TicketClick');}
type Card = {id:string;round:{status:string};prize?:string|null;isTest?:boolean};
export function metaScratchTransition(action:string, before:Card[], after:Card[]) {
  try {
    for (const card of after) {
      if (card.isTest) continue;
      const previous = before.find(p => p.id === card.id);
      const name = action === 'start' && !previous ? 'ScratchStart' : action === 'complete' && previous?.round.status === 'playing' && ['won','lost'].includes(card.round.status) ? 'ScratchComplete' : null;
      if (!name) continue;
      // Server IDs are used only locally for deduplication, never sent to Meta.
      const key = name + ':' + card.id;
      if (seen.has(key)) continue;
      seen.add(key);
      send(name, name === 'ScratchComplete' ? {outcome:card.round.status,prize_tier:['25','40','50','free'].includes(card.prize ?? '') ? card.prize! : 'none'} : {});
    }
  } catch { /* Measurement must not affect confirmed state. */ }
}
