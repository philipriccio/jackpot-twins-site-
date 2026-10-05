# jackpottwins.ca — Project Notes

*Last updated: 2026-03-30 9:50 PM EST by Mildred*

---

## Status: LIVE ✅

**URL:** https://jackpottwins.ca
**Coolify UUID:** `sws4sc0c08okwwccw8k0kccc`
**GitHub:** `philipriccio/jackpot-twins-site-` (public, `stable-deploy` branch)
**Latest commit:** `319c9aa` (GA4 + custom events)
**Stack:** Next.js + TypeScript + Tailwind CSS

---

## Google Analytics

- **GA4 Measurement ID:** `G-KCPDK21Y7G`
- **Custom events:**
  - `card_scratched` — cast member revealed via scratch (includes `cast_member` param)
  - `card_flipped_to_bio` — card flipped to bio side (includes `cast_member` param)
  - `email_signup` — newsletter signup completed
- Events visible in GA → Reports → Engagement → Events

---

## Design Direction

**Tone:** Bright, bold, carnival/game-show energy. NOT dark prestige theatre.

**Palette:**
- Hot pink: `#E8308A`
- Bright red: `#E8272A`
- Sky blue: `#5BB8E8`
- Sunshine yellow: `#F5D020`
- Orange: `#F06B20`
- Cream/ivory: `#F5EDD8`
- Black: `#0A0A0A`

**Typography:**
- Display/headlines: Bebas Neue
- Subheadings: Oswald
- Body: Inter

**Key features (all implemented):**
1. Yellow scrolling ticker marquee
2. Hero with poster + bold typography
3. Scratch-to-reveal cast cards (gold overlay, silver trim, character icons)
4. Flip card bios with slot machine PLAY/FLIP buttons
5. Countdown to first performance (March 9, 2027)
6. Email signup modal → feeds into CT CRM
7. Subtle game show sounds (Web Audio API synth, muted by default)

---

## Production Information

- **Show:** Jackpot Twins — World Premiere
- **Written & Directed by:** Philip Riccio
- **Producer:** Janice Peters Gibson
- **Venue:** CAA Theatre, 651 Yonge Street, Toronto
- **Previews from:** March 9, 2027
- **Press Opening:** March 14, 2027 · 2 PM (Sunday)
- **Closing:** March 28, 2027 (possible extension to April 4)
- **Co-producers:** The Company Theatre + Mirvish Productions

---

## Cast

| Actor | Role |
|-------|------|
| Seana McKenna | Geraldine (Gerry) Fitzgerald |
| Nora McLellan | Bernadette (Bernie) Fitzgerald |
| Tony Nappo | Peter Mallory |
| Colin A. Doyle | Harold Bates |
| Caroline Toal | Abigail |

All bios approved by Philip and cast. Live on site.

---

## Creative Team

| Role | Person |
|------|--------|
| Written & Directed by | Philip Riccio |
| Producer | Janice Peters Gibson |
| Set Design | Anahita Dehbonehie |
| Lighting Design | Kevin Lamotte |

---

## Known Issues

- [ ] Animated bouncing bulbs inside marquee title letters — still has rendering issues (styled-jsx abandoned, needs new approach)
- [ ] Mobile responsive fixes (375px breakpoints)
- [ ] GitHub repo still public (need Coolify GitHub App integration to make private)

---

## ⚠️ HARD-WON TECHNICAL RULES (March 27, 2026 Incident)

See `INCIDENT-REPORT-2026-03-27.md` and `SITE-SPECIFICATION.md` for full details.

### Before touching ANY code:
1. Compare against the prototype before AND after
2. Test the FULL page — every section, scroll top to bottom
3. Test at DPR=1 AND DPR=2 if touching canvas code
4. Do NOT push until Philip has verified locally

### Technical rules:
- **NO styled-jsx** — Use regular `.css` file imports only
- **Canvas pixel mask images** must be native `<img>` with `crossOrigin="anonymous"`
- **Canvas `ctx.font`** must use actual font names, not CSS variables
- All canvas coordinates must account for `devicePixelRatio`
- Scratch handlers must be on the canvas element directly
- Never `npm install`/`npm uninstall` packages without version research

---

## Image Optimization (Mar 30)
All images compressed — 35-90% reductions. PNGs still large (title-jackpot.png 1.5MB, JT-2026-portrait-logo.png 2.7MB) — could convert to WebP later.

---

*Prototype source of truth: `/workspace/jt-prototype/index.html`*

## Sep 10, 2026 — New Mirvish Title Lockup Release
- Retrieved Otto Pierre's approved transparent title lockup and preserved the original 2405×1518 RGBA PNG in the production asset folder.
- Replaced the split `title-jackpot.png` / `title-twins.png` hero with the combined lockup. The hero uses an optimized 926 KB WebP; Open Graph and Twitter metadata use the original PNG.
- Preserved the existing canvas sparkle treatment over the new title artwork.
- Production build and full-page desktop/mobile visual proof passed with no horizontal overflow.
- Philip approved the verified local release candidate for production deployment on Sep. 10.
- Released as commit `4157030d7db1723027147203963924821b86e071` from `stable-deploy` through Coolify deployment `esguguycf8kwmzvprac8pwng`; the rolling update finished successfully.
- Live proof passed on `https://jackpottwins.ca`: both the PNG social asset and WebP hero are byte-for-byte identical to the release files, metadata references the new PNG, desktop/mobile layouts show the combined lockup uncropped, and both viewports have zero horizontal overflow.

## Oct 2, 2026 — Sisters + Title Hero Composition
- Enhanced approved photo selects 7 and 38; changed Seana McKenna's cream outfit to Jackpot Twins pink while preserving identity, pose, glasses, hair, and studio lighting.
- Created transparent, optimized WebP cutouts and placed Nora McLellan left / existing title lockup centre / Seana McKenna right in the main hero. Their feet share the title lockup's bottom baseline and all three elements scale responsively.
- The initial cast-card placement was rejected by Philip and fully reverted; original cast headshots remain unchanged.
- Production build passed. Browser proof at 1440px, 768px, and 390px showed the intended composition and no horizontal overflow.
- Philip approved the live release after confirming that only the transparent women—not their studio backgrounds—should appear beside the title.
- Released as commit `ca7adc11f62e0a9000c6e7a00b726f1caaa4309a` from `stable-deploy` through Coolify deployment `go0443iv954vu7bvljnek2d8`; the rolling update finished successfully.
- Live proof passed on `https://jackpottwins.ca`: both transparent WebP assets match the release files byte-for-byte, the homepage references both figures, and desktop/mobile visual checks show Nora left, Seana right, the shared title baseline, and zero horizontal overflow.
- Philip requested a tighter second pass: both figures were reduced to the visual height of the `TWINS` word, normalized to identical rendered heights, tightly cropped to remove hidden transparent side padding, and placed 2px off the title on desktop and mobile without overlap.
- Released as commit `bb50df4942b1de575f05f5ae4844e899564e65d7` through Coolify deployment `si44hlnuw5lgoi6h75ww49cx`; the rolling update finished successfully.
- Live proof passed: Nora and Seana render at identical heights (240px desktop, 83.84px mobile), both sit 2px from the title, the new cache-busted assets match the release files byte-for-byte, and desktop/mobile have zero horizontal overflow.
- Philip requested that Seana's hero figure be replaced with approved marketing photo 33. The Drive source was checksum-verified, the cream suit was recoloured to the established campaign pink, and a new transparent cache-busted cutout replaced photo 38 without changing the hero sizing or placement rules.
- Release commit `76374cf29a9988078cf4d639dc12b43d6e6c98ac` was deployed successfully through Coolify deployment `vg13g7f2jozberadahozzn8l`. The first deployment attempt `rat3wzms398ezyfljruqc56r` failed safely during Nixpacks environment setup before app compilation; host disk, memory, swap, and OOM checks were healthy, and one clean retry succeeded.
- Live proof passed: the public photo 33 asset matches the release file byte-for-byte; Nora and Seana remain identical heights (240px desktop, 83.84px mobile), share the title baseline, remain 2px from the title, and produce no horizontal overflow.

## Oct 5, 2026 — Single-Ticket On-Sale Date
- Replaced the vague “available at a later date” copy in the hero and ticket section with: “Single tickets go on sale October 9.”
- Updated the signup modal to offer an October 9 on-sale reminder while preserving the existing subscription and alert flows.
- Production build and desktop/mobile visual checks passed with no horizontal overflow.
