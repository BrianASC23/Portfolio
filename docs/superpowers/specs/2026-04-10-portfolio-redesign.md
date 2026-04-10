# Portfolio Redesign — Design Spec

> **Primary inspiration:** [ashimrudrapaul.com](https://ashimrudrapaul.com/) — premium, clean, oversized typography, grid portfolio.
> **Secondary inspiration:** Igloo Inc — kinetic hero, glassmorphism, scroll-linked 3D.
> **Date:** 2026-04-10

---

## 1. Scope

Full visual overhaul of the existing portfolio. Same routes, same content, completely new visual identity. This spec covers the homepage redesign; project case study pages, `/writing`, and `/resume` inherit the new design tokens (nav, typography, colors) but their layouts remain unchanged.

### What changes

- Navigation style
- Color scheme (amber → blue)
- Typography scale (oversized serif headings)
- Hero section (brain SVG → scroll-linked 3D bento glass cards)
- Project grid layout (3D tilt cards → 2-column even grid)
- Section styling (all sections adopt new tokens)
- Smooth scrolling (Lenis re-added)
- Section order and composition

### What stays

- Routes: `/`, `/projects`, `/projects/[slug]`, `/writing`, `/resume`
- Content: MDX projects, Medium RSS, experience data, bio
- Stack: Next.js 15, React 19, TypeScript strict, Tailwind v4, Framer Motion, Vitest
- Component primitives (Button, Container, Section, Heading, Text, Pill) — restyled
- Analytics: Vercel Analytics + Speed Insights

### What's removed

- Brain hero SVG (`BrainHero.tsx`, `brain-geometry.ts`, `timeline.ts`, `useHeroPhase.ts`, `BrainHero.module.css`)
- Amber accent color
- 3D tilt on project cards (`Tilt3D` component usage on homepage)
- Command palette (`cmdk` — remove from homepage, keep the package for now)
- Grid background pattern in hero
- Contact section on homepage (reachable via nav CTA and `/resume` page)
- `Reveal` motion component usage in hero
- Numbered section eyebrows ("01 · About", "02 · Work", etc.)

---

## 2. Navigation

**Layout:** Fixed top bar with `backdrop-blur` and subtle bottom border.

- **Left:** "Brian Cao" as a bold sans-serif wordmark (Inter, 17px, font-weight 700, tracking -0.02em). Links to `/`.
- **Right:** Text links — Home, Projects, Writing, Resume — in Inter 14px, `color-fg-muted`. Hover: `color-fg`.
- **CTA:** "Contact" pill — filled blue (`#2563eb`), white text, `rounded-full`, opens `mailto:brianc40722@gmail.com`.
- **Mobile:** Hamburger menu trigger on the right. Same links in a slide-down panel.
- **Scroll behavior:** Stays fixed. Background becomes opaque white with border on scroll (already has this pattern).

**Changes from current:**
- Drop the monospace/uppercase/small-caps style for nav links
- Drop the `CommandTrigger` button from the top bar
- Replace "BC · Portfolio" logo with "Brian Cao" wordmark
- Add filled blue pill CTA

---

## 3. Color Scheme

Replace the warm amber OKLch palette with a blue accent on white.

### Tokens

| Token | Old value | New value |
|-------|-----------|-----------|
| `--color-bg` | `oklch(0.995 0.002 80)` | `#ffffff` |
| `--color-bg-elevated` | `oklch(1 0 0)` | `#ffffff` |
| `--color-bg-inset` | `oklch(0.965 0.004 80)` | `#f8f9fa` |
| `--color-fg` | `oklch(0.2 0.012 60)` | `#111111` |
| `--color-fg-muted` | `oklch(0.46 0.014 60)` | `#666666` |
| `--color-fg-subtle` | `oklch(0.6 0.012 60)` | `#999999` |
| `--color-accent` | `oklch(0.68 0.17 60)` | `#2563eb` |
| `--color-accent-hi` | `oklch(0.75 0.18 65)` | `#3b82f6` |
| `--color-accent-lo` | `oklch(0.58 0.15 55)` | `#1d4ed8` |
| `--color-accent-glow` | `oklch(0.68 0.17 60 / 0.28)` | `rgba(37, 99, 235, 0.25)` |
| `--color-border` | `oklch(0.88 0.008 60 / 0.8)` | `#e5e5e5` |
| `--color-border-strong` | `oklch(0.82 0.01 60)` | `#d4d4d4` |
| `--shadow-glow` | amber glow | `0 0 40px rgba(37, 99, 235, 0.15)` |

Keep OKLch format if preferred for consistency, but the target sRGB values above are the source of truth.

---

## 4. Typography

### Fonts (unchanged)
- **Display:** Instrument Serif (self-hosted)
- **Body:** Inter (self-hosted)
- **Mono:** JetBrains Mono (self-hosted)

### Scale (updated — larger display sizes)

| Token | Old value | New value |
|-------|-----------|-----------|
| `--text-display` | `clamp(3rem, 2rem + 5vw, 6.5rem)` | `clamp(3.5rem, 2.5rem + 6vw, 8rem)` |
| `--text-h1` | `clamp(2.25rem, 1.6rem + 3.2vw, 4rem)` | `clamp(2.5rem, 1.8rem + 3.5vw, 4.5rem)` |
| `--text-h2` | `clamp(1.75rem, 1.3rem + 2vw, 2.75rem)` | `clamp(2rem, 1.5rem + 2.5vw, 3.25rem)` |
| `--text-h3` | unchanged | unchanged |
| `--text-body` | unchanged | unchanged |

### Heading style
- Display/H1/H2: Instrument Serif, light weight (300), tight letter-spacing (-0.03em), dark color.
- Section headings: oversized serif, left-aligned (not centered with eyebrow labels).
- Drop the numbered eyebrow labels ("01 · About" etc.) — clean section headings only.

---

## 5. Hero Section — 3D Bento Glass Card

The centerpiece of the redesign. A scroll-linked 3D animation using Framer Motion's `useScroll` + `useTransform` + `useSpring`.

### Container
- **Height:** `200vh` (scrollable area for the animation)
- **Inner:** `sticky top-0` centered container, `min-h-screen`, flex center
- **Perspective:** `perspective: 1200px` on the wrapper for realistic 3D depth

### Content above the card
- Eyebrow: "Software Engineer" — mono, 11px, uppercase, tracking 0.15em, `color-fg-subtle`
- Name: "Brian Cao" — Instrument Serif, `--text-display` size, light weight, centered
- Both above the bento grid, static (not part of the 3D transform)

### Bento Glass Grid (the 3D-animated element)
- **Layout:** CSS Grid, `grid-template-columns: 1.4fr 1fr`, 2 rows
- **Gap:** 12px
- **Max-width:** ~580px, centered

**Cards:**

1. **Intro card** (left column, spans both rows):
   - Availability indicator: green pulsing dot + "Available for work" label
   - Bio text: "Full-stack engineer building systems at the edge of software and AI. Stony Brook CS Honors '27."
   - CTAs: "View projects" (filled blue pill) + "Get in touch" (outlined pill)

2. **Featured project card** (top right):
   - Label: "Featured Project"
   - Title: Dynamic — pulls from the first featured project in content
   - Description: Project tagline
   - Tech pills: top 2 technologies from the project's stack

3. **Skills card** (bottom right):
   - Label: "Tech Stack"
   - Pills: React, Python, TypeScript, PyTorch, Next.js (top skills)

**Glass material:**
- Background: `rgba(255, 255, 255, 0.7)` (light frosted glass)
- `backdrop-filter: blur(20px)`
- Border: `0.5px solid rgba(0, 0, 0, 0.08)` (subtle rim light)
- Shadow: `0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)`
- Border-radius: 16px

### Scroll Animation Phases

Driven by `scrollYProgress` of the 200vh container via Framer Motion `useScroll`.

| Phase | Scroll range | `rotateX` | `rotateY` | `scale` | `opacity` |
|-------|-------------|-----------|-----------|---------|-----------|
| Entry | 0 → 0.5 | 45° → 0° | -15° → 0° | 0.8 → 1.0 | 0 → 1 |
| Midpoint | 0.5 | 0° | 0° | 1.0 | 1 |
| Exit | 0.5 → 1.0 | 0° → -20° | 0° → 10° | 1.0 → 1.1 | 1 → 0 |

**Spring config:** `{ stiffness: 80, damping: 20, mass: 1 }` via `useSpring` wrapping each `useTransform`.

### Specular Highlight
- A diagonal white-to-transparent gradient overlay (`linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)`)
- Position driven by scroll at 2x speed (when scroll is at 0.25, highlight is at 0.5)
- Applied via a `::before` pseudo-element or an absolutely-positioned div inside the bento grid
- `pointer-events: none`, `border-radius: 16px` to match the card

### Responsive
- **Desktop (≥768px):** Full 3D animation with all phases
- **Mobile (<768px):** Flatten 3D tilt to max ±10° (or disable entirely). Reduce scale range. Keep opacity transitions. Bento grid stacks to single column.
- **Reduced motion:** Skip to midpoint state immediately (flat, full opacity, no animation)

---

## 6. Homepage Sections

### Section order
1. Hero (3D Bento Glass Card)
2. About
3. Toolbelt
4. Selected Work
5. Experience
6. Writing

No Contact section on homepage. Contact is reachable via the nav "Contact" pill.

### About
- Keep: 2-column layout (text + portrait), bio content, role/school/location tags
- Change: Oversized serif heading ("Builder first. Thoughtful second." or simpler), blue accent on tags, drop numbered eyebrow
- Animation: FadeIn on scroll (existing pattern)

### Toolbelt
- Keep: Dual marquee of tools
- Change: Hover color → blue instead of amber. Oversized serif section heading.

### Selected Work
- **Layout:** 2-column even grid (`grid-template-columns: 1fr 1fr`, gap 24px)
- **Card design:**
  - Cover image with `border-radius: 12px`, subtle shadow
  - Title: Inter 18px semi-bold
  - Description: Inter 14px muted
  - Tech pills: bordered pills, 11px, muted text
  - Hover: subtle lift (`translateY(-2px)`) + blue border glow, no 3D tilt
- **CTA:** "See all projects →" text link in blue
- Drop: 3D tilt effect, number badges, gradient overlay on images

### Experience
- Keep: Vertical timeline with dots and staggered FadeIn
- Change: Blue accent line/dots instead of amber. Oversized serif heading.

### Writing
- Keep: 3-column grid of Medium posts, async fetch
- Change: Blue accent on links/hover. Clean card style matching project cards.

---

## 7. Smooth Scrolling — Lenis

Re-add the `lenis` package as a global smooth scroll wrapper.

- Wrap the app in a Lenis provider (client component in `app/layout.tsx` or a dedicated `SmoothScroll.tsx` wrapper)
- Configuration: `{ lerp: 0.1, smoothWheel: true }`
- Required for the hero scroll animation to feel buttery — decouples scroll from mouse wheel notches
- Respects `prefers-reduced-motion`: disable smooth scrolling if reduced motion is preferred

---

## 8. Bundle Impact Estimate

| Change | Size impact |
|--------|------------|
| Remove BrainHero + geometry + timeline + hook | −4 kB |
| Remove cmdk from homepage | −8 kB (lazy-loaded, so only affects homepage) |
| Add Lenis | +8 kB |
| Hero scroll component (useScroll, useSpring, transforms) | +3 kB |
| Net estimate | ~−1 kB |

Framer Motion `useScroll`/`useTransform`/`useSpring` are already in the bundle. No new animation libraries needed.

---

## 9. Files Changed (high-level)

### Create
- `components/hero/BentoHero.tsx` — 3D scroll-linked bento glass card hero
- `components/hero/GlassCard.tsx` — reusable glass card primitive (optional, may inline)
- `components/scroll/SmoothScroll.tsx` — Lenis wrapper client component

### Modify
- `app/globals.css` — color tokens, typography scale
- `app/(site)/page.tsx` — section order, remove Contact section, swap hero
- `components/hero/HomeHero.tsx` — complete rewrite to use BentoHero
- `components/nav/TopBar.tsx` — new nav style (wordmark, text links, pill CTA)
- `components/nav/MobileMenu.tsx` — restyle to match
- `components/project/ProjectCard.tsx` — remove 3D tilt, new grid card style
- `components/sections/SelectedWorkSection.tsx` — 2-col even grid
- `components/sections/AboutSection.tsx` — restyle with new tokens
- `components/sections/ExperienceSection.tsx` — blue accent
- `components/sections/ToolbeltSection.tsx` — blue hover
- `components/sections/WritingSection.tsx` — restyle cards
- `app/layout.tsx` — add Lenis wrapper

### Delete
- `components/hero/BrainHero.tsx`
- `components/hero/BrainHero.module.css`
- `components/hero/brain-geometry.ts`
- `components/hero/timeline.ts`
- `components/hero/useHeroPhase.ts`
- Related test files in `tests/unit/` (BrainHero, brain-geometry, brain-timeline, useHeroPhase, HomeHero — will be replaced with new tests)

---

## 10. Accessibility

- Hero: `role="region"` with `aria-label="Introduction"`. Glass cards are decorative — real content is accessible as text within them. CTA buttons are proper links.
- Reduced motion: Hero renders at midpoint state (flat, full opacity). No scroll animation. Lenis disabled.
- Nav: Proper `<nav>` element, focus-visible rings in blue, skip-to-content link.
- Color contrast: Blue `#2563eb` on white `#ffffff` = 4.56:1 (passes WCAG AA for normal text). All text meets AA.
- Heading hierarchy: H1 (sr-only "Brian Cao" in hero), H2 for section headings, H3 for card titles.

---

## 11. Non-Goals

- Dark mode (light-only for this redesign)
- Redesigning `/projects/[slug]` case study layout (inherits new tokens only)
- Redesigning `/writing` or `/resume` page layouts (inherit new tokens)
- Adding new content or routes
- Changing the build/deploy pipeline
- Custom cursor or page transitions
