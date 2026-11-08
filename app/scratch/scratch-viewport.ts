// Native listeners deliberately supplement touch-action for iOS Safari.
// The body lock lasts for the modal lifetime, not each panel/render change.
export function lockScratchViewport(root: HTMLElement) {
  const body = document.body;
  const x = window.scrollX, y = window.scrollY;
  const saved = {position: body.style.position, top: body.style.top, left: body.style.left,
    width: body.style.width, overflow: body.style.overflow};
  Object.assign(body.style, {position: 'fixed', top: `${-y}px`, left: `${-x}px`, width: '100%', overflow: 'hidden'});
  let guarded = false;
  let frozen: {element: HTMLElement; overflow: string; top: number; left: number}[] = [];
  const release = () => {
    for (const entry of frozen) {
      entry.element.style.overflow = entry.overflow;
      entry.element.scrollTop = entry.top;
      entry.element.scrollLeft = entry.left;
    }
    frozen = [];
    guarded = false;
  };
  const start = (event: TouchEvent) => {
    if (guarded || !(event.target instanceof Element)) return;
    const area = event.target.closest('.dt-grid[data-scratch-area="true"], .dt-prize-scratch:not(.is-revealed)');
    if (!area || !root.contains(area)) return;
    guarded = true;
    // Stop momentum/bounce on every scrolling ancestor before the first move.
    for (let node = area.parentElement; node && root.contains(node); node = node.parentElement) {
      if (!node.matches('.dt-overlay, .dt-result-layer, .dt-result-popup')) continue;
      frozen.push({element: node, overflow: node.style.overflow, top: node.scrollTop, left: node.scrollLeft});
      node.style.overflow = 'hidden';
    }
  };
  const move = (event: TouchEvent) => {
    if (!guarded) return;
    if (event.cancelable) event.preventDefault();
    for (const entry of frozen) {
      entry.element.scrollTop = entry.top;
      entry.element.scrollLeft = entry.left;
    }
  };
  const end = (event: TouchEvent) => { if (!event.touches.length) release(); };
  const hide = () => { if (document.hidden) release(); };
  // Do not cancel touchstart: the canvas still needs its pointer event stream.
  root.addEventListener('touchstart', start, {passive: true, capture: true});
  document.addEventListener('touchmove', move, {passive: false, capture: true});
  document.addEventListener('touchend', end, true);
  document.addEventListener('touchcancel', end, true);
  window.addEventListener('pagehide', release);
  document.addEventListener('visibilitychange', hide);
  return () => {
    release();
    root.removeEventListener('touchstart', start, true);
    document.removeEventListener('touchmove', move, true);
    document.removeEventListener('touchend', end, true);
    document.removeEventListener('touchcancel', end, true);
    window.removeEventListener('pagehide', release);
    document.removeEventListener('visibilitychange', hide);
    Object.assign(body.style, saved);
    window.scrollTo({left: x, top: y, behavior: 'instant'});
  };
}
