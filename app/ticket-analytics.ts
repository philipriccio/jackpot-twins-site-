// Ticket destination published in Mirvish’s official October 5 announcement.
const ticketDestination = "https://www.mirvish.com/shows/jackpot-twins";

export function ticketUrl(placement: string): string {
  const url = new URL(ticketDestination);
  url.searchParams.set("utm_source", "jackpottwins.ca");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "jackpot_twins_tickets");
  url.searchParams.set("utm_content", placement);
  return url.toString();
}

// Keep navigation working even if analytics is blocked. Queue early interactions
// using Google's standard command shape until the afterInteractive tag loads.
export function gaEvent(action: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const analytics = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    if (typeof analytics.gtag === "function") analytics.gtag("event", action, params);
    else {
      analytics.dataLayer = analytics.dataLayer || [];
      // Google’s gtag queue uses Arguments objects, not data-layer event objects.
      // eslint-disable-next-line prefer-rest-params
      Reflect.apply(function () { analytics.dataLayer!.push(arguments); }, undefined, ["event", action, params]);
    }
  } catch { /* Analytics must never prevent the visitor from buying tickets. */ }
}
