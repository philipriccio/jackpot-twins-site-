# Jackpot Twins Site — Complete Specification

*Written by Mildred, March 27, 2026*
*Source of truth: `/workspace/jt-prototype/index.html`*

This document captures every visual, structural, and interactive detail of the approved jackpottwins.ca site design so it can be faithfully rebuilt if ever needed.

---

## Color Palette (CSS Custom Properties)

```css
:root {
  --black:       #0A0A0A;
  --off-white:   #FFF8F0;
  --pink:        #E8308A;
  --red:         #E8272A;
  --blue:        #5BB8E8;
  --yellow:      #F5D020;
  --orange:      #F06B20;
  --cream:       #FFF8F0;
  --white:       #FFFFFF;
  --hot-pink:    #FF1493;
  --deep-orange: #E85D20;
}
```

---

## Typography

| Usage | Font | Weight | Style |
|-------|------|--------|-------|
| Headlines, dates, section titles | Bebas Neue | 400 | All-caps, wide letter-spacing |
| Cast section headers, buttons | Luckiest Guy | 400 | Cursive/carnival feel |
| Body text, buttons, labels | Nunito | 400–900 | Clean, modern |
| Subheadings | Oswald | 300–700 | Condensed |
| Body fallback | Inter | 300–600 | Neutral sans-serif |

All fonts loaded via Google Fonts. In Next.js, use `next/font/google`.

---

## Page Structure (Top to Bottom)

### 1. Ticker Bar
- **Background:** `var(--hot-pink)` (solid hot pink)
- **Height:** ~36px with 10px vertical padding
- **Border:** 4px solid black bottom
- **Content:** Scrolling marquee with gold stars (★) separating items
- **Text:** Bebas Neue, 16px, white, 0.16em letter-spacing
- **Items:** JACKPOT TWINS ★ WRITTEN AND DIRECTED BY PHILIP RICCIO ★ WORLD PREMIERE ★ CAA THEATRE · TORONTO ★ SPRING 2027 ★ THE COMPANY THEATRE + MIRVISH PRODUCTIONS
- **Animation:** `ticker 18s linear infinite` translateX(0) → translateX(-50%)
- **Duplication:** Items are duplicated for seamless loop

### 2. Hero Section
- **Background:** `#2a3a1e` (olive green) — only visible if poster image fails to load
- **Border:** 4px solid black bottom

#### 2a. Hero Poster
- Full-width landscape poster image (`hero-landscape.jpg`, 1800×750)
- `object-fit: contain`, `object-position: top center`

#### 2b. Hero Right (Title/Countdown Area)
- **Background:** `linear-gradient(135deg, var(--hot-pink) 0%, var(--deep-orange) 100%)`
- **Polka dot overlay:** `::before` pseudo-element with `radial-gradient(circle, rgba(255,255,255,.06) 2px, transparent 2px)`, `background-size: 24px 24px`
- **Border:** 4px solid black top
- **Padding:** 64px 40px 56px

**Content (top to bottom):**
1. Eyebrow: "World Premiere · Toronto · Spring 2027" — Bebas Neue 13px, 0.3em spacing, with yellow blinking dot (8px, 1.6s ease-in-out blink)
2. Title: Two stacked images (title-jackpot.png 520w, title-twins.png 380w) — marquee-style lettering with `drop-shadow(0 2px 8px rgba(245,208,32,.4)) brightness(1.08)`
3. Canvas overlays on each title word — animated bouncing light bulb particles (gold/yellow/white, contained within letter boundaries using pixel mask)
4. Byline: "A New Comedy by Philip Riccio" — Bebas Neue clamp(24px, 3.5vw, 36px)
5. Dates: "March 9th – March 28th, 2027" — Bebas Neue clamp(20px, 2.8vw, 28px)
6. Countdown: 4 red circles (80×80px, 3px yellow border, box-shadow) showing Days/Hours/Mins/Secs to March 9, 2027
7. CTA teaser: "Be the first to know when tickets go on sale" — Nunito 16px yellow
8. "Sign Me Up" button — black background, white text, Nunito 16px bold, 40px border-radius

### 3. Sound Toggle (Fixed)
- Position: fixed, top-right (16px offset)
- z-index: 9999
- Semi-transparent black background with backdrop-filter blur
- Shows 🔇/🔊 + "SOUND OFF"/"SOUND ON"
- Controls Web Audio API synth sounds (reveal, flip, toggle, signup)

### 4. Co-Production Bar
- **Background:** var(--black)
- **Border:** 4px solid var(--deep-orange) top
- **Content:** "A Production By" label + CT logo (210×56) + pipe divider + Mirvish logo (205×28)
- Logos link to respective websites

### 5. Quote Strip
- **Background:** var(--blue) (sky blue)
- **Borders:** 4px solid black top and bottom
- **Text:** Bebas Neue clamp(28px, 3.5vw, 52px), white with text-shadow
- **Content:** "THE ODDS WERE 1 IN 1.226 QUINTILLION." + yellow text "THE FITZGERALD SISTERS JUST BEAT THEM."

### 6. About Section
- **Background:** var(--black)
- **Border:** 4px solid var(--hot-pink) bottom
- **Layout:** CSS Grid — 260px left column + 1fr right column, 72px gap
- **Left:** Heading "Is it possible to be too lucky?" (Bebas Neue clamp(56px, 7vw, 80px)), pink rule (32×4px)
- **Right:** Lead paragraph (Nunito 20px bold), body paragraphs (17px, line-height 1.9), actor names in hot pink bold
- **Full synopsis text included in prototype**

### 7. Cast Section (Scratch & Reveal)
- **Background:** var(--black)
- **Border:** 4px solid var(--deep-orange) top
- **Header:** "CAST" (Luckiest Guy clamp(48px, 6vw, 76px) white) + "Scratch & Reveal!" (Luckiest Guy clamp(36px, 5vw, 60px) yellow with text-stroke, rotated -2deg) + "HOW TO PLAY" (Luckiest Guy 16px yellow) + instructions + "reveal all" (yellow link) + "play again" (pink link)

#### Scratch Cards (5 in a row)
- **Grid:** 5 columns, 20px gap, max-width 1200px
- **Card:** 16px border-radius, 3px yellow border, perspective 800px for 3D flip
- **Aspect ratio:** 3:4
- **Card front:** Actor headshot (fill mode, object-fit cover) + name bar at bottom (black bg, Bebas Neue 20px white)
- **Gold scratch overlay:** Canvas-drawn gold gradient (B8860B → D4A017 → F5D020 → FFEA70), silver border insets, corner stars, "JACKPOT TWINS" text (Bebas Neue), character icon emoji (greyscale), "SCRATCH ME" text (Luckiest Guy), 5-star row at bottom
- **Scratch interaction:**
  - Desktop: Penny cursor image (52px circle, fixed position, follows mouse in grid area), mousedown+drag to scratch
  - Mobile: Touch directly on canvas
  - Erases gold overlay using `globalCompositeOperation: 'destination-out'`
  - Gold flecks spawn on desktop scratch (2px-5px particles, gold colors, fade out 500ms)
  - At >35% transparency: card auto-reveals
- **Card back (bio):** Off-white background, actor name (Bebas Neue 24px), pink rule, bio text (Inter 11.5px, line-height 1.7)
- **3D flip:** `transform: rotateY(180deg)` with `transform-style: preserve-3d`, 0.6s cubic-bezier transition

#### Slot Machine Buttons (below each card)
- **Default state ("PLAY"):** Red background, white text, Luckiest Guy 16px, 20px border-radius, 36px height, cursor: default
- **Lit state (after reveal):** Yellow border, red glow (box-shadow pulse animation 1s), cursor: pointer. Text cycles between "YOU WIN!" and "FLIP" every 800ms via setInterval.
- **Hover (lit):** Yellow background, black text, scale 1.05
- **Flipped state:** Blue background, white border, no animation

#### Cast Data
| Index | Name | Emoji | Headshot Position |
|-------|------|-------|-------------------|
| 0 | Seana McKenna | ✝️ | center 20% |
| 1 | Nora McLellan | 🪑 | center center |
| 2 | Tony Nappo | 🚗 | center 5% |
| 3 | Colin A Doyle | 🔍 | center 30% |
| 4 | Caroline Toal | 👗 | center center |

### 8. Creative Team Section
- **Background:** var(--blue)
- **Borders:** 4px solid var(--hot-pink) top, 4px solid black bottom
- **Content:** "CREATIVE TEAM" heading (Bebas Neue clamp(44px, 5vw, 64px) white) + flex-wrap list of role/person pairs

### 9. Sign Up Section
- **Background:** var(--hot-pink) with polka dot ::before overlay (same as hero-right)
- **Border:** 4px solid black bottom
- **Content:** "STAY IN THE LOOP" label + "BE FIRST TO KNOW" heading + description + "Sign Me Up" button (black)

### 10. Sign Up Modal
- Fixed overlay, centered card (400px max-width, white, 24px border-radius)
- Form: First Name, Last Name, Email inputs + "Sign Up" button (red, pink on hover)
- Posts to `https://crm.companytheatre.ca/api/signup` with source "jackpottwins.ca interest form"
- Success state: Pink text confirmation

### 11. Footer
- **Background:** var(--black)
- **Border:** 4px solid var(--deep-orange) top
- **Content:** CT logo (120×32) + pipe + Mirvish logo (146×20) + copyright "© 2026 The Company Theatre. All rights reserved."

---

## Animated Title Bulbs (Canvas)

Each title word ("JACKPOT", "TWINS") has a canvas overlay with animated bouncing light particles:

1. **Pixel mask:** Title image drawn onto hidden canvas, alpha sampled to determine letter boundaries
2. **Bulb spawning:** ~(width/4) particles placed randomly inside letter boundaries (up to 200 attempts per bulb)
3. **Colors:** #F5D020, #FFEB3B, #FFD700, #FFF8DC, #FFFFFF
4. **Physics:** Gravity (vy += 0.015), boundary bouncing (velocity reflection * -0.7), random perturbation, occasional upward "pop" (0.8% chance per frame)
5. **Rendering:** Glow (shadowBlur = radius * 4), twinkling (sin wave alpha modulation), white highlight center (35% radius)
6. **Blend mode:** `mix-blend-mode: screen` on the canvas element

**CRITICAL for Next.js:** Title images used as pixel masks MUST be native `<img>` elements with `crossOrigin="anonymous"`, NOT Next.js `<Image>` components. The canvas `drawImage` + `getImageData` pipeline requires same-origin pixel access.

---

## Responsive Breakpoints

### ≤900px
- About: single column
- Scratch grid: 3 columns
- Creative: reduced padding
- Various sections: 32px horizontal padding

### ≤600px
- Scratch grid: 2 columns
- Countdown circles: 64×64px, smaller text
- Hero right: 36px 20px 40px padding
- Modal card: reduced padding

---

## Sounds (Web Audio API)

All sounds generated via oscillator synthesis (no audio files):
- **Reveal:** 4 ascending tones (523→659→784→1047 Hz), sine, 80ms stagger
- **Flip:** 880Hz + 660Hz sine, quick decay
- **Toggle:** 440Hz sine, 160ms
- **Signup:** 6-note melody (523→659→784→1047→784→1047), celebration

Sounds are OFF by default, toggled via the sound button. AudioContext created on first user interaction.

---

## Technical Requirements for Rebuild

1. Use regular CSS file imports, NOT styled-jsx
2. All CSS custom properties in `:root` selector
3. Canvas pixel mask images: native `<img>` with `crossOrigin="anonymous"`
4. All canvas operations must account for `devicePixelRatio`
5. Canvas `ctx.font` must use actual font family names, not CSS variables
6. Canvas draw operations must `save()` / `restore()` context state
7. Scratch interaction handlers on canvas element directly (not document-level)
8. All Next.js Image components need proper width/height/alt
9. `allowedDevOrigins` in next.config for local network dev access
10. Test at DPR=1 AND DPR=2 before shipping
