# Approved hero implementation — October 12, 2026

Local implementation only. No commit, push, deployment, production mutation or email.

## Scope

- `app/approved-hero.tsx`: dedicated client component with exact approved JPEG, presenter credit, Nora left/Seana right names, original tagline, dates and one hero ticket link. Accessible `h1` identifies Jackpot Twins without competing with title artwork.
- `app/approved-hero.css`: scoped approved desktop/mobile layout. Desktop tagline is subordinate sentence-case white Oswald; mobile retains bold two-line tagline. Presenter billing 18px desktop/15px mobile.
- `app/page.tsx`: replaces former hero and duplicate portrait with component; removes now-unused countdown and title-animation lifecycle. Copro band and every following section remain unchanged.
- `public/images/jackpot-twins-instagram-hero.jpg`: byte-identical approved `instagram.jpg`, SHA256 `564883a4e61de5f714cb8cd436d7334ea1d4d9114bb30758fc09cff519181963`.

Existing ticket URL/UTM/event helper reused with placement `hero`; lower `ticket_section` preserved. Signup/API/modal, scratch/reveal/replay/bios, all creative credits and footer untouched. No new dependencies.

## Lifecycle and implementation details

Decorative canvas extends photograph edges, with image/load + ResizeObserver + font/resize notification handling; requestAnimationFrame batches redraws, cleanup disconnects listeners/observer and cancels pending frames. DPR coordinates retained, bitmap resolution capped at DPR2 for decorative blurred background. Solid matched pink remains if image/canvas is unavailable. No per-frame animation loop.

Next 16 local `use-client` documentation and React best-practices skill read before implementation. Explicit Next font variables map new hero typography to intended actual fonts. Presenter text uses ordinary breakable spaces (exact wording preserved) to avoid an unbreakable full line at narrow widths.

## Verification

- `npm run build`: passes.
- Independent `npx tsc --noEmit`: passes.
- `npx eslint app/approved-hero.tsx app/page.tsx`: zero errors, three existing page warnings (`_type`, unused revealCard, fleckTimeouts ref cleanup).
- `git diff --check`: passes.
- Approved/public JPEG SHA256 match.
- Separate knowledge graph rebuilt: 9 files / 0 errors; existing untracked root graph preserved.

Production server for parent acceptance: http://127.0.0.1:3191.
Parent owns independent desktop/mobile/full-site browser acceptance and deployment. Native iPhone/Instagram browser and real Mirvish purchase completion are not established here. No real signup submission made.

Existing dirty PROJECT.md, cross-centering reports and untracked graph/artifacts preserved.
