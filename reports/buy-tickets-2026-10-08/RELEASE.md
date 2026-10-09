# Buy Tickets release

## October 8 — Buy Tickets and ticket-click analytics
- Philip requested Buy Tickets above the title and in both prior subscription-button positions, plus updated analytics. Release isolated from production base 9136562; unrelated signup/scratch-preview work excluded.
- Three standard Mirvish links with ticket_click GA4 events (above_title, hero, ticket_section) and distinct utm_content. Existing GA4 property and cast/signup event names retained. Early events queue; analytics failure does not block navigation. No personal information added.
- Destination is https://www.mirvish.com/shows/jackpot-twins, explicitly linked in Mirvish’s October 5 press release. Release says sales open October 9 at 10AM Toronto time. Direct booking is bot-blocked; no purchase or checkout-success claim. No on-sale-now copy added.
- Subscription links/copy removed; email CTA now ongoing updates. No signup API/config changes or email sends. Existing photo, title and all eight credits retained. Fixed countdown’s nondeterministic initial render while verifying clean hydration.
- Production build and independent TypeScript pass. ESLint zero errors/four pre-existing warnings. Browser proof at 1440/390/320: no overflow, top button above artwork/in viewport, all three event payloads and UTM links correct, navigation with broken/missing analytics, signup modal open/close, no page errors.
- Reports: reports/buy-tickets-2026-10-08/. GA dashboard ingestion, custom-dimension registration, and Mirvish purchase attribution not verified.

Deployment and public verification pending.
