# jackpottwins.ca — Project Notes

*Last updated: 2026-03-21 by Mildred*

---

## ⚠️ CRITICAL: APPROVED DESIGN DIRECTION

**The approved design is the prototype at `/Users/mildred/.openclaw/workspace/jt-prototype/index.html`**

**DO NOT change the design direction without Philip's explicit approval.**

The Next.js site has been redesigned twice (commits 35ea707, 0f70074) away from the approved direction — both times incorrectly. Always return to the prototype as the source of truth.

---

## Approved Design Direction

**Tone:** Bright, bold, carnival/game-show energy. NOT dark prestige theatre.

**Palette (extracted from Plinko/poster images, confirmed by Philip):**
- Hot pink: `#E8308A`
- Bright red: `#E8272A`
- Sky blue: `#5BB8E8`
- Sunshine yellow: `#F5D020`
- Orange: `#F06B20`
- Cream/ivory: `#F5EDD8`
- Black: `#0A0A0A`

**Typography:**
- Display/headlines: Bebas Neue (bold, condensed, all-caps)
- Subheadings: Oswald
- Body: Inter

**Key design elements (from approved prototype):**
1. **Yellow ticker at top** — scrolling marquee: "JACKPOT TWINS ★ WORLD PREMIERE ★ CAA THEATRE · TORONTO ★ SPRING 2027 ★ THE COMPANY THEATRE + MIRVISH PRODUCTIONS ★ SEANA McKENNA · NORA McLELLAN"
2. **Hero:** Poster image on left, bold typographic content on right. Big stacked "JACKPOT / TWINS" in Bebas Neue. NOT a full-bleed dark hero.
3. **Co-production bar** below hero: "A production by | The Company Theatre | Mirvish Productions"
4. **Quote strip:** cream/yellow accent — "THE ODDS WERE 1 IN 1.226 QUINTILLION. THE FITZGERALD SISTERS JUST BEAT THEM."
5. **About section:** Two-column layout, label/heading/rule on left, body text on right
6. **Cast section:** Grid of headshot cards with name + role below. **Bios to be added** (drafted, pending Philip's review — see below)
7. **Creative team section**
8. **Tickets section:** Date blocks in a row, big CTA to Mirvish
9. **Footer:** Simple links to companytheatre.ca and mirvish.com

---

## Sections / Page Structure

```
[Yellow scrolling ticker]
[Hero — poster + title + tagline + dates + CTA]
[Co-pro bar — CT + Mirvish]
[Quote strip]
[About — two-column]
[Cast — headshot grid with bios]
[Creative team]
[Tickets + dates]
[Footer]
```

---

## Production Information

- **Show:** Jackpot Twins — World Premiere
- **Written & Directed by:** Philip Riccio
- **Venue:** CAA Theatre, 651 Yonge Street, Toronto
- **Previews from:** March 9, 2027
- **Press Opening:** March 14, 2027 · 2 PM (Sunday)
- **Closing:** March 28, 2027 (possible extension to April 4)
- **Co-producers:** The Company Theatre + Mirvish Productions
- **Tickets:** Via Mirvish Productions (mirvish.com)

---

## Cast

| Actor | Role |
|-------|------|
| Seana McKenna | Geraldine (Gerry) Fitzgerald |
| Nora McLellan | Bernadette (Bernie) Fitzgerald |
| Tony Nappo | Peter Mallory |
| Colin A. Doyle | Harold Bates |
| Caroline Toal | Abigail |

---

## Creative Team (as built)

| Role | Person |
|------|--------|
| Written & Directed by | Philip Riccio |
| Set Design | Anahita Dehbonehie |
| Lighting Design | Kevin Lamotte |

**Status:** Confirmed as of 2026-03-21. More credits may be added as additional creatives confirm.

---

## Assets

**Prototype (source of truth):**
- `/Users/mildred/.openclaw/workspace/jt-prototype/index.html`

**Next.js site:**
- `/Users/mildred/.openclaw/workspace/projects/jackpot-twins-site/`
- Currently on the wrong dark design (needs to be rebuilt to match prototype)

**Images (in jackpot-twins-site/public/images/):**
- `poster-5x8-web.jpg` — portrait poster
- `poster-web-1800x1200.jpg` — landscape hero image
- `poster-web-1200x630.jpg` — OG social image
- `poster-web-1800x750.jpg` — wide banner
- `production-photo-twins.jpg` — cast photo
- `headshots/` — seana-mckenna.jpeg, nora-mclellan.jpeg, tony-nappo.jpg, colin-doyle.jpg, caroline-toal.jpg

**Logo asset needed:** `jt-logo-marquee.png` — marquee-style show logo (was used in wrong dark redesign, check if it exists and fits bright design)

---

## Cast Bios — APPROVED by Philip 2026-03-21

⚠️ Bios approved for content/tone. Cast approval required before going live March 31.

Format: punchy hook, career highlights, witty closer matching show tone. No character references. CT credits woven in naturally.

**SEANA McKENNA**
Seana McKenna is a recipient of the Order of Canada — do we need to say more? No. But we will anyway. A National Theatre School graduate, she has spent four decades setting the standard at Stratford, Shaw, Canadian Stage, and stages across North America, playing everything from Juliet to Julius Caesar along the way. She made history as Stratford's first female Richard III. Three Dora Awards, a Genie, a Jessie, and an Honorary Doctorate later — if you saw her in *Things I Know to Be True* and needed a few days to recover, good news: this one's a comedy.

**NORA McLELLAN**
Nora McLellan has been one of Canadian theatre's great pleasures for over fifty years, and she shows absolutely no signs of stopping. She spent 22 seasons at the Shaw Festival and four at Stratford, trained with the legendary Uta Hagen in New York, and has four Jessie Awards and two Doras to her name. Toronto audiences know her from *John* at The Company Theatre — for which she won the Dora for Outstanding Performance — and as Sister Rose in CBC's *Son of a Critch*, a role written especially for her. She is, in every sense, a force of nature.

**TONY NAPPO**
Tony Nappo has appeared in roughly 70 films, hundreds of TV episodes, and more Toronto stages than most people have visited. Born in Scarborough, trained at the American Academy of Dramatic Arts in Manhattan, he's the kind of actor critics describe as "razor-sharp" and "effortlessly magnetic." He's appeared alongside Al Pacino, played a recurring villain in *Bad Blood*, voiced a gangster in *Fugget About It*, and wrote the beloved column *Nappoholics Anonymous* for Intermission Magazine. If you've watched Canadian TV in the last twenty years, you've seen him.

**COLIN A. DOYLE**
Colin A. Doyle is a Toronto-based actor and theatre producer who has performed across Canada, the US, and Europe. A York University Acting Conservatory graduate, he has worked with some of the most inventive companies in the country — Outside the March, Factory Theatre, Theatre Passe Muraille, Why Not Theatre — and has played everything from Peter Pan to a post-apocalyptic Homer Simpson. The range is real.

**CAROLINE TOAL**
Caroline Toal is a two-time Dora Award winner, a Stratford Festival Mary Savidge Award recipient, and the person most recently responsible for making half of Ontario cry about Anne Shirley. She grew up in Orangeville, trained at George Brown Theatre School, and has originated roles in new Canadian plays at Young People's Theatre, The Howland Company, and the Stratford Festival. Her credits include *Casimir and Caroline*, *Selfie*, *To Kill a Mockingbird*, and *Anne of Green Gables* — which received an extension because the audiences refused to let it close. Some performers make you want to stay. She is one of them.

---

## What Needs To Happen Next

1. **Philip reviews/approves cast bios** (drafted above)
2. **Philip to get cast approval** on bios from all 5 actors before March 31 go-live
3. **Next.js site needs to be rebuilt** to match the approved prototype design — carnival/bold direction
4. **Bios added to cast section** in both jackpottwins.ca AND companytheatre.ca/jackpot-twins
5. **March 31 reveal:** Site goes live at midnight. companytheatre.ca homepage teaser flips to reveal Jackpot Twins automatically.
6. **Ticket link:** Currently pointing to mirvish.com homepage. Philip to confirm if a direct ticket URL exists yet.

---

## What NOT To Do

- ❌ Do NOT redesign to dark/prestige theatre aesthetic
- ❌ Do NOT change approved colour palette without Philip's explicit sign-off
- ❌ Do NOT brief Dev until Philip approves bios and creative team credits
- ❌ Do NOT launch before March 31

---

## Deployment

- **Domain:** jackpottwins.ca (not yet live — site still in development)
- **Hosting:** TBD — likely Coolify on DigitalOcean (same as other CT properties)
- **GitHub:** TBD — no repo created yet for the Next.js version

---

*The prototype HTML file is the single source of truth for design direction until Philip approves changes.*
