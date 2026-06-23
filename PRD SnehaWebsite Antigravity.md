# 📋 Product Requirements Document

## “Hey Rasmalai 🍮” — Surprise Love Website for Sneha Saliyan

**Version:** 2.0 | **Author:** Santosh Poojari | **Date:** June 2026
**Platform:** Antigravity (React + Vite, Single-Page App)
**Stack:** React · Vite · Framer Motion · GSAP + ScrollTrigger · HTML5 Canvas · Howler.js
**Primary Target:** Mobile portrait — 390×844 px (iPhone 14 base), 9:16 ratio

-----

## 1. Project Overview

A surprise single-page interactive love website built for Santosh’s girlfriend **Sneha Saliyan** — aka **Rasmalai**, **Chirkutt**, and **Snehhh**. The site is a celebration of their relationship: chaotic, warm, funny, and deeply personal. It is designed exclusively for mobile portrait viewing — every layout decision, every animation, every tap target is optimized for a phone held in one hand.

The tone: if Santosh texted Sneha a whole website, this would be it.

**Primary User:** Sneha Saliyan — opens on her phone, portrait mode
**Maker:** Santosh Poojari — fills `config/content.js` before deploying

-----

## 2. Mobile-First Grid System

### 2.1 Viewport Philosophy

The entire site is designed for **9:16 portrait ratio**. Every section is treated as a “screen” — meaning each section fills exactly `100svh` (small viewport height, respects mobile browser chrome). No horizontal scrolling. No landscape support needed.

### 2.2 Base Grid

```
Viewport base:   390px wide × 844px tall (iPhone 14)
Safe zone:       padding: 0 20px (left/right gutters)
Content width:   350px max (390 - 40px gutters)
Section height:  100svh per section (snaps like stories)
Scroll:          Vertical, section-snap (scroll-snap-type: y mandatory)
```

### 2.3 Grid Columns (inside each section)

|Context           |Columns                     |Gap |
|------------------|----------------------------|----|
|Default content   |1 column (full width)       |—   |
|Photo grid        |2 columns                   |10px|
|Inside jokes wall |2 columns                   |12px|
|Appreciation cards|1 column (horizontal scroll)|12px|
|Game canvas       |Full bleed (0 padding)      |—   |

### 2.4 Touch Targets

All interactive elements minimum **48×48 px** (Apple HIG standard). No hover-only states — every interaction is tap or swipe.

### 2.5 Scroll Behaviour

```css
html {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
}

.section {
  height: 100svh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  overflow: hidden;
}
```

Each section snaps into place like Instagram Stories — the user swipes up to move between sections. This is the core navigation metaphor.

-----

## 3. Design System

### 3.1 The Aesthetic: “Sweet Chaos”

Warm, playful, handmade scrapbook energy. The background is **not black** — it is soft warm cream. This is intentionally opposite to dark-themed sites. The palette is literally inspired by rasmalai: saffron, milky cream, pistachio, with rasmalai-pink for chaos moments.

### 3.2 Color Palette

|Token              |Hex                     |Usage                              |
|-------------------|------------------------|-----------------------------------|
|`--cream-base`     |`#FFF8F0`               |Global background                  |
|`--saffron`        |`#F4A623`               |Primary accent, CTAs, active states|
|`--rasmalai-pink`  |`#F472B6`               |Love moments, hover, game items    |
|`--pistachio`      |`#86EFAC`               |Tags, success states, dividers     |
|`--chirkutt-purple`|`#A78BFA`               |Easter egg, inside jokes           |
|`--ink-dark`       |`#1C1917`               |All body text                      |
|`--card-white`     |`rgba(255,255,255,0.85)`|Card surfaces                      |
|`--card-border`    |`rgba(244,166,35,0.3)`  |Card borders                       |

### 3.3 Typography

|Role           |Family             |Weight |Size (mobile)|
|---------------|-------------------|-------|-------------|
|Display        |`Syne`             |700–800|36–48px      |
|Body           |`Plus Jakarta Sans`|400–500|14–16px      |
|Handwritten    |`Caveat`           |700    |18–24px      |
|Mono / Counters|`JetBrains Mono`   |400    |11–13px      |

### 3.4 Animation Principles

1. **Bouncy springs** — `stiffness: 200, damping: 15` — feels alive on touch
1. **Swipe-native** — drag gestures use Framer Motion `drag` with `dragConstraints`
1. **No hover states** — every animation triggers on `onTap` or `onPanEnd`
1. **GPU-only transforms** — only `transform` and `opacity` animated, never `width/height/top/left`
1. **Entrance per section** — elements animate in when their section snaps into view (`IntersectionObserver`)
1. **Reduced motion respected** — `@media (prefers-reduced-motion)` disables all decorative animations

-----

## 4. Global Architecture

```
src/
├── main.jsx
├── App.jsx                      # Root: DoodleBG + all sections in snap container
│
├── components/
│   ├── layout/
│   │   ├── SectionDots.jsx      # Fixed right-edge vertical dot progress indicator
│   │   ├── MusicPlayer.jsx      # Floating bottom pill (persistent)
│   │   └── ConfettiEngine.jsx   # Global canvas confetti
│   │
│   └── ui/
│       ├── StickyCard.jsx       # Tilted sticky-note card, tap to lift
│       ├── Toast.jsx            # Bottom toast notification
│       ├── NicknameTag.jsx      # Pill badge component
│       └── SwipeHint.jsx        # "swipe up" animated arrow (fades after first swipe)
│
├── modules/
│   ├── 00_DoodleBG/             # Fixed doodle background layer
│   ├── 01_Hero/                 # Section 1 — landing + nickname reveal
│   ├── 02_PhotoDump/            # Section 2 — photo grid
│   ├── 03_Timeline/             # Section 3 — chaos timeline
│   ├── 04_InsideJokes/          # Section 4 — corkboard
│   ├── 05_Appreciation/         # Section 5 — appreciation cards
│   ├── 06_ScratchCard/          # Section 6 — scratch-off
│   ├── 07_MiniGame/             # Section 7 — catch the rasmalai
│   ├── 08_Letter/               # Section 8 — letter from Santosh
│   └── 09_EasterEgg/            # Hidden overlay (no dedicated section)
│
├── hooks/
│   ├── useConfetti.js
│   ├── useAudioPlayer.js
│   ├── useSectionSnap.js        # IntersectionObserver for active section tracking
│   └── useStickyTilt.js
│
├── context/
│   └── AppContext.jsx           # activeSection, audioState, confettiTrigger, eggUnlocked
│
├── assets/
│   ├── photos/                  # All photos (WebP, max 150KB each)
│   ├── audio/                   # Playlist MP3s (128kbps)
│   ├── doodles/                 # SVG doodle elements
│   └── fonts/
│
└── config/
    └── content.js               # ALL personalised strings — Santosh fills this
```

-----

## 5. Section Specifications

Each section = `100svh`, `scroll-snap-align: start`, `overflow: hidden`.

-----

### Section 01 — Hero

**Layout:** Single centered column, content vertically centered in `100svh`

```
┌─────────────────────────┐  ← 390px wide
│                         │
│                         │
│     hey,                │  ← Syne 700, 48px, ink-dark
│                         │
│   [ Rasmalai 🍮 ]       │  ← Syne 800, 44px, saffron — cycles
│                         │
│  yes this whole site    │  ← Plus Jakarta Sans, 16px
│  is for you.            │
│                         │
│  ┌─────────────────┐    │
│  │  okay fine 👇   │    │  ← CTA button, full width, saffron bg
│  └─────────────────┘    │
│                         │
│  ╔═════════════════╗    │  ← Sticky note, Caveat, bottom-right
│  ║ this took       ║    │     rotation -6deg
│  ║ forever btw     ║    │
│  ╚═════════════════╝    │
│                         │
│  ↑ swipe up             │  ← SwipeHint, fades after first swipe
└─────────────────────────┘
```

**Nickname Cycle Animation:**

- `Rasmalai 🍮` (saffron) → holds 1.2s → crossfades → `Chirkutt 🐣` (pink) → holds 1.2s → crossfades → `Snehhh 🌸` (pistachio) → stays

**Entrance Sequence (Framer Motion orchestrated):**

1. `0ms` — cream BG + doodles appear
1. `300ms` — “hey,” slides in from left
1. `700ms` — nickname fades in, starts cycling
1. `1200ms` — subline fades up
1. `1800ms` — CTA button bounces in (`scale: 0.8 → 1.05 → 1`)
1. `2200ms` — sticky note tilts in from off-screen bottom-right
1. `2800ms` — swipe hint pulses

-----

### Section 02 — Photo Dump

**Layout:** 2-column CSS Grid, `gap: 10px`, `padding: 20px`

```
┌─────────────────────────┐
│  📸 photo dump          │  ← Section label, Caveat 20px, top-left
│                         │
│  ┌────────┐ ┌────────┐  │
│  │ photo  │ │ photo  │  │  ← Row 1: both cards same height (170px)
│  │   01   │ │   02   │  │     slight rotation ±4deg
│  │caption │ │caption │  │     Caveat 12px caption below image
│  └────────┘ └────────┘  │
│                         │
│  ┌────────────────────┐ │
│  │    photo  03       │ │  ← Row 2: full-width card (landscape photo)
│  │    caption         │ │     height: 200px
│  └────────────────────┘ │
│                         │
│  ┌────────┐ ┌────────┐  │
│  │ photo  │ │ photo  │  │  ← Row 3: same as row 1
│  │   04   │ │   05   │  │
│  └────────┘ └────────┘  │
│                         │
│  (scrollable within     │
│   section if >5 photos) │
└─────────────────────────┘
```

**Each Card:**

- White background, `border-radius: 12px`, `box-shadow: 0 4px 20px rgba(0,0,0,0.08)`
- Image fills top 80% of card, `object-fit: cover`
- Caption strip: cream background, Caveat 12px, `padding: 6px 8px`
- Rotation: seeded from photo `id` — stable, not random on re-render
- On tap: Framer Motion `layoutId` → expands to full-screen lightbox (100vw × 100svh, black overlay, full image + caption)
- Lightbox: swipe left/right to navigate between photos, swipe down to close

**Entrance:** Cards enter staggered `0.06s` apart, `scale(0.9) → scale(1)` + `opacity 0 → 1` when section snaps in

-----

### Section 03 — Chaos Timeline

**Layout:** Single center column, internally scrollable within the section snap

```
┌─────────────────────────┐
│  our chaos timeline 💀  │  ← Syne 700, 22px, sticky at top of section
│                         │
│       ┊                 │
│  ╔══╗ ┊                 │
│  ║💀║ ┊  The First      │  ← Node left: emoji card (48×48px)
│  ╚══╝ ┊  Chaotic Moment │     Text right: headline + story + date
│       ┊  "story..."     │
│       ┊  Nov 2023       │
│       ┊                 │
│       ┊  ╔══╗           │
│       ┊  ║😭║           │  ← Node right: alternates side
│       ┊  ╚══╝           │
│  When We Both           │
│  Lost It                │
│       ┊                 │
│  (continues...)         │
└─────────────────────────┘
```

**SVG Line:** Vertical zigzag path, `stroke-dashoffset` driven by internal scroll progress (not page scroll — uses a `ref` scroll listener inside the section)

**Node cards:** `StickyCard` component, alternating left/right, `rotate: ±3deg`, tap to expand story text (Framer Motion height animate)

**Tech:** GSAP ScrollTrigger scoped to `#timeline-section` container, not window

-----

### Section 04 — Inside Jokes Wall

**Layout:** 2-column grid on corkboard texture, internally scrollable

```
┌─────────────────────────┐
│  things only we get 🤫  │  ← Header, sticky
│                         │
│  ┌─────────┐ ┌────────┐ │
│  │  📌     │ │  📌    │ │  ← Pushpin SVG top-center each card
│  │ joke    │ │ joke   │ │
│  │ title   │ │ title  │ │  ← Caveat 18px
│  │ context │ │        │ │  ← Plus Jakarta Sans 12px (optional)
│  └─────────┘ └────────┘ │
│                         │
│  ┌─────────┐ ┌────────┐ │
│  │  📌     │ │  🔒    │ │  ← Locked card: blurred, lock icon
│  │  ...    │ │ ????   │ │     Tap → toast: "ask me in person 😌"
│  └─────────┘ └────────┘ │
└─────────────────────────┘
```

**Card colours** cycle: `#FEF9C3` (yellow), `#FCE7F3` (pink), `#DCFCE7` (green), `#EDE9FE` (lavender)

**Tap:** Card lifts `y: -6px, scale: 1.04`, rotate snaps to `0deg`, shadow deepens — feels like picking up from corkboard

-----

### Section 05 — Appreciation Board

**Layout:** Horizontal scroll lane (single row of cards, swipe left to reveal more)

```
┌─────────────────────────┐
│  things i love          │
│  about you 💛           │  ← Header
│                         │
│  ◄ swipe ►              │
│  ┌──────┐ ┌──────┐ ┌──┐ │
│  │ 01   │ │ 02   │ │03│ │  ← Cards: 280px wide, full section height - 140px
│  │      │ │      │ │  │ │     left border: 4px saffron
│  │ text │ │ text │ │  │ │     Syne 600, 18px
│  │      │ │      │ │  │ │     emoji bottom-right
│  └──────┘ └──────┘ └──┘ │
│  ● ○ ○ ○ ○ ○           │  ← Dot indicator for scroll position
└─────────────────────────┘
```

**Swipe:** Framer Motion `drag="x"` with `dragConstraints` calculated from card count × card width

**Tap a card:** Saffron glow pulses (`box-shadow` keyframe), small heart particle bursts from card center (canvas, 0.8s lifetime, 20 particles)

**All cards seen:** After swiping to last card, confetti fires + toast: `"okay now you know 🍮"`

**Tracking:** `localStorage` stores which cards have been seen

-----

### Section 06 — Scratch-Off Card

**Layout:** Single centered card, full section height minus header

```
┌─────────────────────────┐
│  something for you 🎁   │  ← Header
│                         │
│  ┌─────────────────────┐│
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓││  ← Canvas overlay: pink-gold gradient
│  │▓ scratch me,       ▓││     Caveat text on surface
│  │▓ chirkutt 🐣       ▓││
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓││
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓││
│  │▓▓▓  (scratching  ) ▓││
│  │▓▓▓   reveals msg  ) ▓││
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓││
│  └─────────────────────┘│
│                         │
│  progress: [████░░░] 60%│  ← Scratch progress bar below card
└─────────────────────────┘
```

**Canvas size:** `350px × 420px` (fits within section on all phones)

**Touch:** `touchmove` event drives `ctx.globalCompositeOperation = 'destination-out'`, brush radius `28px` (finger-sized)

**At 65% scratched:** Remaining canvas `opacity: 0` animates out over 0.5s, message revealed underneath, confetti fires

**Revealed message area:** Cream bg, Caveat 26px centered, saffron decorative border

-----

### Section 07 — Mini Game: “Catch the Rasmalai 🍮”

**Layout:** Full bleed canvas, `100svh × 100vw`, `padding: 0`

```
┌─────────────────────────┐
│ ❤️❤️❤️       Score: 0   │  ← HUD overlay (Canvas drawn)
│                         │
│        🍮               │  ← Falling rasmalai
│                 📄      │  ← Falling assignment (enemy)
│     🐣                  │  ← Chirkutt bird (bonus)
│                         │
│                         │
│                         │
│                         │
│       🍽️               │  ← Player plate (touch/drag to move)
│  ◄────────────────────► │  ← Touch anywhere on bottom 30% to move
└─────────────────────────┘
```

**Controls:** Touch anywhere in the bottom 30% of the canvas — plate follows finger X position (no drag-start needed, just touch position)

**Game Loop:**

- 60s timer, speed ramps every 15s
- Catch 🍮 → +1 point, catch 🐣 → +5 points, catch 📄 → lose 1 life
- 3 lives (❤️ × 3 displayed top-left)
- Game over on 0 lives OR timer end

**End Screen (drawn on canvas):**

```
"You caught [N] rasmalais! 🍮"
[grade from config.GAME_GRADES]
[Play Again button]  [Share Score button]
```

**Share Score:** Web Share API (`navigator.share`) with text: `"I caught [N] rasmalais on Santosh's website 🍮"` — falls back to clipboard copy

-----

### Section 08 — Letter from Santosh

**Layout:** Single centered column, letter card fills most of section height

```
┌─────────────────────────┐
│                         │
│  ┌─────────────────────┐│
│  │ ✉️ tap to open      ││  ← Sealed envelope illustration
│  │                     ││     Tap → envelope opens (clip-path anim)
│  └─────────────────────┘│     → letter modal takes over full screen
│                         │
│  (after opening:)       │
│  ┌─────────────────────┐│
│  │ ──────────────────  ││  ← Lined paper BG (CSS repeating-gradient)
│  │ hey rasmalai,       ││     Caveat 18px, line-height 2
│  │                     ││
│  │ [letter body]       ││
│  │                     ││
│  │              — S    ││  ← Signature, Caveat 22px, bottom-right
│  └─────────────────────┘│
│                         │
└─────────────────────────┘
```

**Envelope Animation:**

- Tap sealed envelope → clip-path of flap opens: `polygon(0 0, 100% 0, 100% 40%, 50% 60%, 0 40%)` → `polygon(0 0, 100% 0, 100% 0, 50% 0, 0 0)` over 0.6s
- Letter card scales up from envelope center: `scale(0.1) → scale(1)`, Framer Motion `layoutId`

**Letter scroll:** If letter is long, the letter card itself is scrollable (`overflow-y: auto`, max-height 80svh)

**Ink animation:** First line underlines itself via SVG `stroke-dashoffset` over 1.5s on letter open

**State:** `localStorage` marks letter as opened → envelope shows wax-seal “read” stamp on revisit

-----

### Section 09 (Hidden) — Easter Egg: The Chirkutt Secret

**Trigger:** Tap the word `"Snehhh 🌸"` in Section 01 Hero exactly **5 times** rapidly (within 3 seconds)

**Overlay (full-screen, `z-index: 200`):**

```
┌─────────────────────────┐
│                         │
│   ✦  ✦   ✦   ✦  ✦      │  ← Stars raining CSS animation
│                         │
│  okay fine,             │  ← Caveat 36px, white on purple bg
│  you found it,          │
│  chirkutt 🐣            │
│                         │
│  [secret message]       │  ← Plus Jakarta Sans 16px
│                         │
│     🐣 ──────────►      │  ← Pixel bird waddles across (CSS keyframe)
│                         │
│  (tap to close)         │
└─────────────────────────┘
```

**Background:** `--chirkutt-purple` with `opacity: 0.96`, fade in over 0.4s

**Auto-dismiss:** 10 seconds, or tap anywhere

**Post-dismiss toast:** `"secret unlocked 🔓"` — state stored in `localStorage`

-----

## 6. Persistent UI Elements

### 6.1 Section Dot Indicator

```
Fixed right edge, vertically centered
8 dots stacked vertically, 8px × 8px each, gap 10px
Active dot: saffron, scale(1.4)
Inactive dot: ink-dark opacity 0.2
Transitions: Framer Motion spring on active change
```

### 6.2 Music Player (Floating Pill)

```
Fixed bottom-center (not bottom-right — centered on mobile)
Collapsed: 220px × 48px pill
  [⏮] [▶/⏸] [track name scrolling marquee] [⏭]
  saffron border, cream bg, backdrop blur

Expanded (tap pill → grows up):
  320px × 180px card (centered, above bottom safe area)
  album art square + track info + progress bar + controls
  Framer Motion height animate: 48px → 180px
```

### 6.3 Confetti Engine

Canvas fixed full-viewport, `pointer-events: none`, `z-index: 90`

|Trigger                    |Style                        |
|---------------------------|-----------------------------|
|Page load (2s delay)       |Light saffron shower from top|
|All appreciation cards seen|Full rainbow burst           |
|Scratch card revealed      |Pink + gold cascade          |
|Game high score            |Rasmalai-pink torrent        |
|Easter egg triggered       |Purple + white stars         |

Particles: circles + `✦` stars + `🍮` emoji via `ctx.fillText`, max 120 particles, 2s lifetime, gravity + horizontal drift

-----

## 7. Navigation

**No traditional navbar.** Navigation is purely swipe-up gesture + section dot indicator.

**Swipe hint:** On first load, a subtle `"swipe up 👆"` label pulses at the bottom of Section 01, fades out after first swipe (tracked in `sessionStorage`)

**Deep link:** Each section has an `id` attribute — URL hash can jump to a section (`#photos`, `#letter`, etc.) for sharing specific sections

-----

## 8. Performance Requirements

|Metric                  |Target                                                 |
|------------------------|-------------------------------------------------------|
|First Contentful Paint  |< 1.5s on 4G mobile                                    |
|Largest Contentful Paint|< 2.5s                                                 |
|Cumulative Layout Shift |< 0.05                                                 |
|Animation frame rate    |60 fps on mid-range Android                            |
|Images                  |WebP, max 150 KB each, lazy-loaded via `loading="lazy"`|
|Audio                   |MP3 128 kbps, no autoplay (iOS policy)                 |
|Canvas (game)           |Isolated — does not run when section not in view       |
|Bundle                  |< 350 KB JS gzip, code-split per module                |
|Safe areas              |`env(safe-area-inset-*)` on all fixed elements         |

-----

## 9. iOS / Android Compatibility Notes

```css
/* Use svh not vh for mobile sections */
height: 100svh;

/* Safe area insets for bottom player and dots */
padding-bottom: env(safe-area-inset-bottom);

/* Prevent bounce scroll on iOS */
html { overscroll-behavior: none; }

/* Disable text selection on tap targets */
user-select: none;
-webkit-user-select: none;

/* Disable tap highlight flash on Android */
-webkit-tap-highlight-color: transparent;
```

-----

## 10. Content Configuration File

```js
// config/content.js
// ⚠️ SANTOSH FILLS ALL VALUES BELOW BEFORE DEPLOYING

export const HERO = {
  nicknames: ['Rasmalai 🍮', 'Chirkutt 🐣', 'Snehhh 🌸'],
  subline: 'yes this whole site is for you.',
  body: 'because you deserve more than just a "hbd" text.',
  cta: 'okay fine, scroll 👇',
  stickyNote: 'this took forever btw',
}

export const PHOTOS = [
  // { id: 1, src: '/assets/photos/01.webp', caption: '...', date: '...' }
]

export const TIMELINE = [
  // { emoji: '💀', headline: '...', story: '...', date: '...' }
  // 6–8 entries recommended
]

export const INSIDE_JOKES = [
  // { id: 1, title: '...', context: '...', color: 'yellow', locked: false }
  // include 2 locked cards for mystery
]

export const APPRECIATIONS = [
  // { id: '01', text: '...', emoji: '✨' }
  // 10–15 entries recommended — specific, not generic
]

export const SCRATCH_CARD = {
  label: 'scratch me, chirkutt 🐣',
  reveal: '', // a promise, a plan, or a funny surprise
}

export const GAME_GRADES = [
  { min: 0,  max: 5,   label: 'okay bhai 😑' },
  { min: 6,  max: 15,  label: 'decent chirkutt 🐣' },
  { min: 16, max: 999, label: 'rasmalai certified 🏆🍮' },
]

export const PLAYLIST = [
  // { title: '...', artist: '...', src: '/assets/audio/01.mp3' }
  // songs meaningful to your relationship
]

export const LETTER = {
  body: ``, // Santosh writes full letter — personal, specific, real
}

export const EASTER_EGG = {
  message: ``, // secret message only Sneha would understand
}
```

-----

## 11. Dependency List

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "framer-motion": "^11.0.0",
    "gsap": "^3.12.0",
    "howler": "^2.2.4",
    "react-router-dom": "^6.23.0"
  },
  "devDependencies": {
    "vite": "^5.2.0",
    "@vitejs/plugin-react": "^4.3.0"
  }
}
```

> No Firebase / backend needed — fully static, deploys to Vercel / Netlify in one click.

-----

## 12. Antigravity Build Order

|Step|File(s)                                   |Notes                                    |
|----|------------------------------------------|-----------------------------------------|
|1   |`package.json`, `vite.config.js`          |Foundation                               |
|2   |`config/content.js`                       |All content with placeholders            |
|3   |`src/context/AppContext.jsx`              |Global state                             |
|4   |`src/hooks/*`                             |All 4 hooks                              |
|5   |`src/components/ui/*`                     |StickyCard, Toast, NicknameTag, SwipeHint|
|6   |`src/components/layout/ConfettiEngine.jsx`|Global confetti                          |
|7   |`src/modules/00_DoodleBG/*`               |Fixed doodle layer                       |
|8   |`src/modules/01_Hero/*`                   |Section 1                                |
|9   |`src/modules/02–08/*`                     |Sections 2–8 in order                    |
|10  |`src/modules/09_EasterEgg/*`              |Hidden overlay                           |
|11  |`src/components/layout/SectionDots.jsx`   |Right-edge nav dots                      |
|12  |`src/components/layout/MusicPlayer.jsx`   |Persistent bottom player                 |
|13  |`src/App.jsx`, `src/main.jsx`             |Wire everything, scroll-snap container   |

-----

## 13. Copy Tone Guidelines

Every string in this site should sound like Santosh actually texted it:

- **Lowercase by default.** `"okay fine, scroll 👇"` not `"Explore Below"`
- **Specific over generic.** Not “you’re amazing” — the exact thing she did that was amazing
- **Inside jokes > explanations.** The site doesn’t need to make sense to anyone else
- **Emojis where Santosh would actually use them** in a real text — not sprinkled for decoration
- **The sticky note energy** — imperfect, personal, slightly unhinged in the best way

-----

*This PRD is the complete source of truth for the Sneha Saliyan love website. Designed exclusively for mobile portrait (390×844, 9:16). Fill `config/content.js` before uploading to Antigravity.*