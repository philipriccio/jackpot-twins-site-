"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { attributedUrl, campaignContext, gaEvent } from "./campaign-analytics";

export default function SiteAnalytics() {
  const pathname = usePathname();
  const lastPage = useRef<string | null>(null);
  useEffect(() => {
    campaignContext();
    if (lastPage.current !== pathname) {
      lastPage.current = pathname;
      gaEvent("page_view", { page_path: pathname });
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
        const result = decorate(anchor);
        if (result) { const { event: name, ...params } = result; gaEvent(name, params); }
      } catch { /* Preserve navigation. */ }
    };
    document.addEventListener("click", clicked, true);
    document.addEventListener("auxclick", clicked, true);
    return () => { document.removeEventListener("click", clicked, true); document.removeEventListener("auxclick", clicked, true); };
  }, [pathname]);
  return null;
}
