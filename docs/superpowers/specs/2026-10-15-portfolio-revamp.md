# Portfolio Revamp — Design Spec

> **References:** ashimrudrapaul-style editorial portfolio (left rail, oversized serif statement, project grid) and a Wayeez-Giash-style cinematic hero (full-bleed dithered field, serif lockup, annotation marks).
> **Driver:** Summer 2027 SWE internship recruiting.
> **Branch:** `redesign`
> **Date:** 2026-10-15

---

## 1. What the references actually share

Stripped of their surface difference, both references run the same play:

| Element | Both references do this |
|---|---|
| Identity | A **large serif statement** carrying the name and what the person does |
| Meta | **Small sans/mono labels** in deliberate contrast to the serif |
| Nav | Minimal, unobtrusive, no command palette or scroll hijacking |
| Accent | **One** accent colour, used sparingly |
| Space | Confident negative space; nothing competes with the statement |

They differ on exactly one axis: **light editorial grid** vs **dark full-bleed cinematic**. That axis is the open decision (§6). Everything else below is settled either way.

---

## 2. Positioning

Brian is a systems and AI-infrastructure engineer, not a product designer. The site must survive the realistic case: **a recruiter opening the link on a phone and skimming for about twenty seconds.**

That produces three hard rules:

1. **Projects are visible without scrolling past a cinematic set piece.** The strongest credential — CyanoAgent's 96% gene-identification accuracy against a 4% baseline — should be reachable immediately, not buried under an animation.
2. **Resume is one click from anywhere.** Already true after `23aca5f`; keep it.
3. **The phone layout is the primary layout**, not an adaptation of the desktop one.

---

## 3. Typography — fix first, independent of direction

`app/fonts.ts` already loads Instrument Serif, Inter and JetBrains Mono correctly as local `woff2` files. The regression is entirely in `app/globals.css`, where all three family tokens point at Figtree:

```css
/* current — all three collapse to one face */
--font-family-serif: var(--font-figtree), sans-serif;
--font-family-sans:  var(--font-figtree), ui-sans-serif, system-ui, sans-serif;
--font-family-mono:  var(--font-figtree), ui-monospace, SFMono-Regular, monospace;
```

Restore them to `--font-serif` / `--font-sans` / `--font-mono`, then drop the Figtree import and `public/fonts/SpaceGrotesk-Regular.woff2` (unreferenced). This is a three-line change that recovers the whole intended type system.

**Roles:** Instrument Serif for the display statement and case-study titles. Inter for body and UI. JetBrains Mono for eyebrows, metadata, stack tags and captions.

---

## 4. Content architecture

Homepage, in order:

1. **Statement** — serif, the name and what he builds, drawn from `content/site/bio.mdx`.
2. **Currently / Previously** — two columns of small-type meta. Current: Stony Brook CS Honors '27, Resident Assistant. Previous: WUSEF AI Research Fellow, Stony Brook CS software engineer, Pulp SWE intern.
3. **Selected work** — the four featured projects as a grid: CyanoAgent, Advising Bot, Financial Sentiment RNN, Coverage-guided Fuzzer. Each caption carries a *result*, not a category.
4. **Footer** — availability, email, GitHub, LinkedIn, resume.

Experience, writing and the full project list stay on their own routes. The homepage does not try to hold everything.

---

## 5. Motion and performance budget

The current homepage ships **243 kB of First Load JS** and runs Lenis, GSAP and Framer Motion before a single project is visible. Target: **under 130 kB**, with the statement and first project painting on the initial frame.

- Drop GSAP entirely; keep Framer Motion only for entrance reveals.
- Lenis smooth scroll is optional and off by default on touch devices.
- Honour `prefers-reduced-motion` on every animation (`lib/hooks/useReducedMotion.ts` already exists).
- No scroll-jacked pinned hero sequence.

---

## 6. The open decision — which direction

| | **A — Editorial Systems** | **B — Cinematic** |
|---|---|---|
| Ground | Warm paper `#FAFAF7`, ink `#15171A` | Near-black `#05050A`, deep blue field |
| Accent | Amber `#B45309` (carries forward the existing amber) | Pale blue `#BFDBFE` on dark |
| Hero | Serif statement + meta, projects immediately below | Full-bleed dithered horizon, serif lockup bottom-left |
| Nav | Fixed left rail, active item outlined | Top bar: name / centre nav / "Let's talk" |
| Cost | Light. Paints instantly, trivially responsive | Heavy. Large background, harder on phones |
| Risk | Could read as plain if the type is not handled well | Beautiful but reads as a *designer's* site |

**Recommendation: A, with B's dither texture.** Direction A's structure serves the recruiting case, and the halftone/dither treatment from B — applied to project thumbnails and as a background motif — gives the site an identity that is distinctly *computational* rather than generic. It reads as pixels and sampling, which fits an engineer who wrote a fuzzer and a heap allocator far better than the current mountain metaphor does.

Critically, the dither can be generated in CSS (layered gradients plus a dot screen) rather than shipped as an image, so the identity costs almost nothing in load time. The mockup's thumbnails demonstrate this — no image files.

---

## 7. What carries over untouched

`content/`, `lib/schemas/`, `lib/content/`, `lib/writing/medium.ts`, `app/api/contact/`, `app/api/og/`, `app/sitemap.ts`, `app/robots.ts`, `app/rss.xml/`, `lib/seo/`, and the 20 unit-test files. None of it is design-coupled.

---

## 8. Sequence

1. Restore the three font tokens (§3).
2. Rewrite the colour and spacing tokens in `app/globals.css` for the chosen direction.
3. Rebuild `TopBar` / nav for the chosen pattern.
4. Build the new homepage statement + meta block, replacing `SummitHero`.
5. Rebuild the project grid with dithered thumbnails.
6. Retire the summit components (`SummitHero`, `MountainRidge`, `MountainMarkers`, `PixelClimber`, `ScrollCue`, `BioCard`) once nothing references them.
7. Re-point case study, `/writing` and `/resume` pages at the new tokens.
8. Verify: typecheck, unit tests, Playwright a11y, bundle size against the §5 budget.
