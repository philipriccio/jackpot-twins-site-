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
