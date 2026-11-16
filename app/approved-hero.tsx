"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ticketUrl } from "./ticket-analytics";

/** The photograph stays untouched; only its edge colours fill the surrounding hero. */
export default function ApprovedHero({ scratchMode = false }: { scratchMode?: boolean }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const photo = photoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!hero || !photo || !canvas || !ctx) return;
    let disposed = false;
    let frame = 0;
    const source = document.createElement("canvas");
    const sourceContext = source.getContext("2d");
    if (!sourceContext) return;
    const paint = () => {
      frame = 0;
      if (disposed || !photo.complete || !photo.naturalWidth) return;
      const h = hero.getBoundingClientRect();
      const p = photo.getBoundingClientRect();
      if (!h.width || !h.height || !p.width || !p.height) return;
      const x = p.left - h.left, y = p.top - h.top;
      const w = p.width, height = p.height;
      const sw = photo.naturalWidth, sh = photo.naturalHeight;
      // srcSet density-corrects naturalWidth, but drawImage source rectangles
      // address decoded pixels. Normalize the WHOLE image before sampling edges.
      source.width = sw;
      source.height = sh;
      sourceContext.drawImage(photo, 0, 0, sw, sh);
      // Decorative, blurred canvas needs no more than two device pixels per CSS pixel.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(h.width * dpr);
      canvas.height = Math.ceil(h.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      const right = Math.max(0, h.width - x - w);
      const bottom = Math.max(0, h.height - y - height);
      const regions: [number, number, number, number, number, number, number, number][] = [
        [0, 0, 1, 1, 0, 0, x, y], [sw - 1, 0, 1, 1, x + w, 0, right, y],
        [0, sh - 1, 1, 1, 0, y + height, x, bottom],
        [sw - 1, sh - 1, 1, 1, x + w, y + height, right, bottom],
        [0, 0, 1, sh, 0, y, x, height], [sw - 1, 0, 1, sh, x + w, y, right, height],
        [0, 0, sw, 1, x, 0, w, y], [0, sh - 1, sw, 1, x, y + height, w, bottom],
        [0, 0, sw, sh, x, y, w, height],
      ];
      for (const region of regions) {
        if (region[6] > 0 && region[7] > 0) ctx.drawImage(source, ...region);
      }
      hero.dataset.backgroundReady = "true";
    };
    const schedule = () => {
      if (!disposed && !frame) frame = window.requestAnimationFrame(paint);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(hero);
    observer.observe(photo);
    photo.addEventListener("load", schedule);
    window.addEventListener("resize", schedule);
    document.fonts.addEventListener("loadingdone", schedule);
    void document.fonts.ready.then(schedule);
    schedule();
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      photo.removeEventListener("load", schedule);
      window.removeEventListener("resize", schedule);
      document.fonts.removeEventListener("loadingdone", schedule);
    };
  }, []);

  return (
    <section className="hero approved-hero" aria-labelledby="jackpot-title">
      <h1 id="jackpot-title" className="approved-hero-title">Jackpot Twins</h1>
      <div className="hero-right" ref={heroRef}>
        <canvas ref={canvasRef} aria-hidden="true" className="photo-background" />
        <div className="insta-hero-grid">
          <div className="insta-hero-art">
            <div className="portrait-names">
              <p>Nora<span>McLellan</span></p><p>Seana<span>McKenna</span></p>
            </div>
            {/* Responsive derivatives preserve the approved composition without cropping. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={photoRef} src="/images/jackpot-twins-instagram-hero-1080.webp" srcSet="/images/jackpot-twins-instagram-hero-480.webp 480w, /images/jackpot-twins-instagram-hero-800.webp 800w, /images/jackpot-twins-instagram-hero-1080.webp 1080w" sizes="(max-width: 360px) 250px, (max-width: 600px) 280px, 50vw" width={1080} height={1350}
              fetchPriority="high" loading="eager" alt="Nora McLellan and Seana McKenna holding the Jackpot Twins lottery cheque" />
          </div>
          <div className="insta-hero-copy">
            <p className="hero-billing"><span className="billing-names"><span className="billing-party">David and Hannah Mirvish</span>{" "}<span className="billing-and">and</span>{" "}<span className="billing-party">The Company Theatre</span></span><span className="billing-present">present</span></p>
            <p className="hero-byline"><span className="byline-copy">A New Comedy by Philip Riccio</span>{/* eslint-disable-next-line @next/next/no-img-element */}
              <picture className="desktop-lettering"><source media="(min-width: 601px)" srcSet="/images/jt-diamond-byline-900.webp"/><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" width={1410} height={352} alt="" aria-hidden="true" /></picture></p>
            <div className="conversion-pitch"><h2>Winning the Lottery is easy.<br /><span>Surviving it is the hard part.</span></h2><p>A sharp-witted new comedy about the price of getting<br className="desktop-break" /> everything you ever wanted.</p></div>
            <p className="hero-signup-teaser visit-details"><span className="visit-details-copy">March 9–28, 2027 · CAA Theatre, Toronto</span>{/* eslint-disable-next-line @next/next/no-img-element */}
              <picture className="desktop-lettering"><source media="(min-width: 601px)" srcSet="/images/jt-gold-dates-theatre-900.webp"/><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" width={2173} height={724} alt="" aria-hidden="true" /></picture></p>
            <div className="cta-row">
              <a className="btn-main ticket-slot" href={ticketUrl("hero")} data-ticket-placement="hero" target="_blank" rel="noopener noreferrer">
                <span className="ticket-slot-face"><span aria-hidden="true" className="ticket-slot-star">★</span><span>Buy Tickets</span><span aria-hidden="true" className="ticket-slot-star">★</span></span>
              </a>
              {scratchMode && <Link href="/scratch" className="hero-scratch-link">Scratch Card</Link>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
