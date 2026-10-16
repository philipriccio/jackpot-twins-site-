// Campaign metadata only: never read forms, identities, redirect tokens or arbitrary query keys.
const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_id"] as const;
type Context = Partial<Record<(typeof keys)[number], string>>;
const storageKey = "tct-acquisition-v1";
let memory: Context = {};
let configured = false;
export function campaignContext(): Context {
  if (typeof window === "undefined") return {};
  const clean = (input: URLSearchParams): Context => Object.fromEntries(keys.flatMap(key => {
    const value = input.get(key);
    return value && /^[a-z0-9][a-z0-9_.-]{0,99}$/i.test(value) ? [[key, value]] : [];
  }));
  const incoming = clean(new URLSearchParams(window.location.search));
  if (incoming.utm_source && incoming.utm_medium && incoming.utm_campaign) {
    memory = incoming;
    try { sessionStorage.setItem(storageKey, JSON.stringify({ at: Date.now(), context: memory })); } catch { /* Optional persistence. */ }
  } else if (!memory.utm_source) {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      if (saved && Date.now() - saved.at < 30 * 60 * 1000) memory = clean(new URLSearchParams(saved.context));
    } catch { /* Storage blocked or malformed. */ }
  }
  return memory;
}
export function safePageUrl(raw: string): string {
  try {
    const url = new URL(raw);
    const clean = new URL(url.origin + url.pathname);
    for (const key of keys) {
      const value = url.searchParams.get(key);
      if (value && /^[a-z0-9][a-z0-9_.-]{0,99}$/i.test(value)) clean.searchParams.set(key, value);
    }
    return clean.toString();
  } catch { return ""; }
}
export function gaEvent(action: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  try {
    const context = campaignContext();
    const acquisition = Object.fromEntries(Object.entries(context).map(([key, value]) => ["acquisition_" + key.slice(4), value]));
    const analytics = window as unknown as { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
    const data = { send_to: "G-KCPDK21Y7G", ...acquisition, page_location: safePageUrl(location.href), page_referrer: safePageUrl(document.referrer), ...params };
    if (!analytics.gtag) {
      analytics.dataLayer ||= [];
      analytics.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        analytics.dataLayer!.push(arguments);
      };
    }
    if (!configured) {
      analytics.gtag("js", new Date());
      analytics.gtag("config", "G-KCPDK21Y7G", { send_page_view: false, page_location: safePageUrl(location.href), page_referrer: safePageUrl(document.referrer) });
      configured = true;
    }
    analytics.gtag("event", action, data);
  } catch { /* Measurement must not affect navigation or successful signup. */ }
}
export function attributedUrl(href: string, placement: string, source: string): string {
  try {
    const url = new URL(href);
    const context = campaignContext();
    const tags = context.utm_source ? context : { utm_source: source, utm_medium: "referral", utm_campaign: "jackpot_twins_tickets" };
    for (const [key, value] of Object.entries(tags)) url.searchParams.set(key, value);
    // Preserve email/ad creative placement, separately identify this site's outbound placement.
    url.searchParams.set("site_placement", placement);
    if (!context.utm_content) url.searchParams.set("utm_content", placement);
    return url.toString();
  } catch { return href; }
}
