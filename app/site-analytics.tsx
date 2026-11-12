"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackScratch } from './scratch/telemetry';
import { attributedUrl, campaignContext, gaEvent } from "./campaign-analytics";

import { initializeMeta, metaPage, metaTicket } from './meta-pixel';

export default function SiteAnalytics({metaPixelId}: {metaPixelId?: string}) {
  const pathname = usePathname();
  const lastPage = useRef<string | null>(null);
  useEffect(() => {
    initializeMeta(metaPixelId);
    metaPage(pathname);
    campaignContext();
    if (lastPage.current !== pathname) {
      lastPage.current = pathname;
      gaEvent("page_view", { page_path: pathname });
      if(pathname==='/scratch')trackScratch('page_viewed','scratch_page');
    }
    const decorate = (anchor: HTMLAnchorElement) => {
      const url = new URL(anchor.href, location.href);
      const own = ["jackpottwins.ca", "companytheatre.ca", "www.companytheatre.ca"];
      if (url.origin === location.origin) return null; // Never campaign-tag internal links.
      const ticket = /^(www\.)?mirvish\.com$/.test(url.hostname) && url.pathname.includes("/shows/jackpot-twins");
      const crossSite = own.includes(url.hostname);
      const donation = /^(www\.)?canadahelps\.org$/.test(url.hostname);
      if (!ticket && !crossSite && !donation) return null;
      const placement = anchor.dataset.analyticsPlacement || anchor.dataset.ticketPlacement || "outbound";
      if (ticket || crossSite) anchor.href = attributedUrl(anchor.href, placement, "jackpottwins.ca");
      return { event: ticket ? "ticket_click" : donation ? "donation_link_click" : "owned_site_click", placement, destination_host: url.hostname, destination_path: url.pathname };
    };
    document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(decorate);
    const clicked = (event: MouseEvent) => {
      if (event.type === "auxclick" && event.button !== 1) return;
      const anchor = (event.target as Element)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      try {
        metaTicket(anchor.href);
        const result = decorate(anchor);
        if (result) { const { event: name, ...params } = result; gaEvent(name, params); if(pathname==='/scratch'&&name==='ticket_click'&&anchor.dataset.ticketPlacement==='scratch_footer')trackScratch('ticket_outbound','scratch_page',{cta:'footer'}); }
      } catch { /* Preserve navigation. */ }
    };
    document.addEventListener("click", clicked, true);
    document.addEventListener("auxclick", clicked, true);
    return () => { document.removeEventListener("click", clicked, true); document.removeEventListener("auxclick", clicked, true); };
  }, [pathname, metaPixelId]);
  return null;
}
