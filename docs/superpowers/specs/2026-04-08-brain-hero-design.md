# Brain Hero — Design Spec

**Date:** 2026-04-08
**Author:** Brian Cao (with Claude)
**Status:** Approved — ready for implementation plan

## Concept

Replace the current pixel-knight hero with a 2D stylized homage to the
"anatomy meets architecture" brief: a translucent brain-shaped vessel
that fills, chamber by chamber, with bioluminescent amber fluid. The
name "Brian Cao" sits etched inside the vessel from the first frame
and brightens as each chamber fills, culminating in a single glowing
pulse when the vessel is full. The animation plays once per session,
then holds its final state.

## Non-Goals

- **No 3D, no WebGL, no R3F.** We just removed three.js and all
  associated dependencies for a ~38% first-load bundle reduction on
  `/`. The spec is deliberately scoped to SVG so those wins stay.
- **No photorealism.** The original visual prompt described cinematic
  lighting, glass refraction, volumetric fluid, and holographic
  projections. Those are pre-rendered-video territory. This spec
  captures the *concept* (brain as vessel, fluid fill, chamber
  activation, name reveal) in a form that actually ships.
- **No site-wide theme changes.** The site is light mode as of the
  previous commit (`9e16e36`). The brain hero adapts to that palette
  instead of reverting to dark.
- **No real-time interactivity beyond the scripted sequence.** No
  scroll-scrubbing, no hover responses, no cursor reactivity. The
  animation is a cinematic moment that plays once.

## Architecture

### Layout

The `BrainHero` replaces the current pixel knight inside `HomeHero`.
Hero content stacks vertically, center-aligned, in this order:

```
┌──────────────────────────────────────────────┐
│              Portfolio · 01                  │  mono eyebrow
│                                              │
│              ╭─────────────╮                 │
│             ╱               ╲                │  chamber 1 — AI / ML
│            │ ·─·─·─·─·─·─·─  │                │
│            │                  │  chamber 2 — Systems
│            │  Brian  Cao     │  (etched text)
│            │  ─·─·─·─·─·─·─  │                │
│            │                  │  chamber 3 — Web
│             ╲                ╱                │
│              ╰──────────────╯ chamber 4 — Tools
│                                                │
│      Full-stack engineer building systems      │  tagline
│      at the edge of software and AI.           │
│      Stony Brook '27.                          │
│                                                │
│      [ View work ]  [ Get in touch ]           │  buttons
│                                                │
│  ● Available · Summer 2026         Scroll ↓    │  bottom bar
└──────────────────────────────────────────────┘
```

- Brain SVG: `w-[22rem]` (~340px) desktop, `w-60` (~240px) mobile.
- The etched "Brian Cao" SVG text is centered horizontally across the
  chamber-2 / chamber-3 boundary. Uses Instrument Serif, sized to fit
  interior width: ~`2.25rem` desktop, `1.5rem` mobile.
- Tagline, buttons, and bottom bar use current `HomeHero` styling and
  spacing. They are *not* children of the SVG — they are sibling
  elements in the existing `HomeHero` flex column.

### Visual Tokens (light palette)

| Element | Value |
| --- | --- |
| Brain stroke | `oklch(0.7 0.01 60 / 0.5)`, 1.5px |
| Brain fill | `none` (transparent glass) |
| Chamber dividers | `oklch(0.8 0.005 60)`, 1px hairline |
| Fluid gradient top | `var(--color-accent-hi)` |
| Fluid gradient bottom | `var(--color-accent-lo)` |
| Fluid opacity | `0.85` |
| Chamber label flash | `var(--color-accent)`, mono 9px |
| Name — dim | `oklch(0.7 0.01 60 / 0.35)` |
| Name — lit | `var(--color-accent)` + `drop-shadow(0 0 12px var(--color-accent-glow))` |

The only saturated element on screen is the amber fluid and the lit
name. Everything else is soft gray. Contrast carries the drama.

### File Structure

```
components/hero/
├── BrainHero.tsx              ← client component, orchestrates sequence
├── BrainHero.module.css       ← scoped keyframes for surface wobble
├── brain-geometry.ts          ← pure data: SVG path, chambers, anchors
├── timeline.ts                ← shared delay constants
├── HomeHero.tsx               ← modified to use BrainHero instead of PixelHero
└── (delete) PixelHero.tsx
```

`timeline.ts` exports the sequence delays as plain constants so
`HomeHero` can pass them to its existing `FadeIn` / `Reveal` wrappers
without turning into a client component. `BrainHero` is the only new
client island.

### Component Boundaries

**`BrainHero`** — client component. Single responsibility: render the
brain SVG and drive the fill / glow animation through three phases
(`initial` → `playing` → `held`). Exposes no callbacks. Uses
`sessionStorage` to skip to `held` on subsequent navigations within
the same tab. Uses `useReducedMotion` to skip to `held` immediately
when the user prefers reduced motion.

**`brain-geometry.ts`** — pure data module. No React, no imports. Exports
the brain outline path string, the four chamber definitions (id,
label, y0, y1), the name anchor coordinates, and the SVG viewBox. Can
be imported from tests without mocking.

**`timeline.ts`** — pure constants module. Exports named delays
(`EYEBROW_DELAY`, `TAGLINE_DELAY`, `BUTTONS_DELAY`, etc.) shared by
`BrainHero` and `HomeHero` so the sequence stays coherent without
either component knowing about the other's implementation.

**`HomeHero`** — stays a server component. Imports timeline constants
and passes them as `delay` props to existing `FadeIn` / `Reveal`
wrappers. The only change is swapping `<PixelHero />` for
`<BrainHero />` and updating delays.

### Dependencies

No new dependencies. Framer Motion is already in the bundle for
`FadeIn`, `Reveal`, and `Tilt3D`. Adding `BrainHero` reuses that
dependency at ~0 kB incremental cost.

### Bundle Budget

| Piece | Size (gz) |
| --- | --- |
| `BrainHero.tsx` + `BrainHero.module.css` | < 4 kB |
| `brain-geometry.ts` path + data | < 1 kB |
| `timeline.ts` | < 0.2 kB |
| **Total incremental** | **< 5.2 kB** |

`PixelHero.tsx` is deleted (net -0.6 kB). First-load JS on `/` should
stay within +5 kB of the current baseline (3.09 kB page / 159 kB first
load).

## Animation Sequence

Total duration: **~5.2 seconds** from page load to held state.

| t (s) | Event | Details |
| --- | --- | --- |
| 0.0 | Brain outline fades in | stroke opacity 0 → 0.5 over 400ms |
| 0.4 | Brief silence | — |
| 0.6 | `Portfolio · 01` brightens | opacity → 1 over 300ms |
| 0.9 | Chamber 1 (AI / ML) fill begins | 900ms, honey ease |
| 1.1 | `AI / ML` label flashes | fade 200ms, hold 400ms, fade 400ms |
| 1.8 | Chamber 2 (Systems) begins; name → 0.55 | 900ms |
| 2.0 | `Systems` label flashes | — |
| 2.7 | Chamber 3 (Web) begins; name → 0.75 | 900ms |
| 2.9 | `Web` label flashes | — |
| 3.6 | Chamber 4 (Tools) begins; name → 0.9 | 900ms |
| 3.8 | `Tools` label flashes | — |
| 4.5 | Brain full — held silence | 300ms |
| 4.8 | **The pulse** | fluid brightens to accent-hi 300ms; name ignites to full lit state, scale overshoots to 1.02, settles |
| 5.1 | Tagline + buttons fade in, staggered 80ms | y: 8 → 0, opacity 0 → 1, 500ms |
| 5.6 | Final held state | — |

### Honey Viscosity

Two techniques give the fluid a "honey-like" feel instead of a watery
one:

1. **Ease curve** `cubic-bezier(0.32, 0, 0.67, 0.12)` — slow start,
   accelerating finish. Applied to every chamber fill.
2. **Surface wobble** — during a chamber's fill, the top edge of the
   fluid visibly ripples at ~3 Hz with ±1.5px amplitude. Implementation
   picks the specific mechanism (SVG filter, animated path control
   points, or masked overlay) during the plan — whichever lands cleanly
   without re-introducing a JS RAF loop. Wobble damps to zero over
   300ms once the chamber is full, and is gated by a
   `data-motion="playing"` attribute that is only set in the `playing`
   phase.

### Session Behavior

- First mount in a new session: plays the full sequence, writes
  `sessionStorage['bc:brain-hero-played'] = '1'` on animation start.
- Subsequent mounts in the same session: skips straight to the held
  state.
- Hard refresh, new tab, or new browser window: replays.
- `prefers-reduced-motion: reduce`: renders held state immediately
  without writing sessionStorage (so turning motion back on still
  works).

## Accessibility

### Semantic Structure

- A real `<h1>Brian Cao</h1>` stays in the DOM as a visually-hidden
  (`sr-only`) element for SEO and screen-reader outline. This is the
  accessible name of the page.
- The `<svg>` gets `role="img"` and `aria-labelledby` pointing to an
  inline `<title>` and `<desc>`.
  - `<title>`: `Brian Cao`
  - `<desc>`: `Illustration of a brain-shaped vessel containing four chambers labeled AI/ML, Systems, Web, and Tools.`
- Chamber label text nodes are `aria-hidden="true"` — the `<desc>`
  already names them.

### Keyboard & Focus

`BrainHero` has no interactive elements. Tab order is unchanged from
today: skip link → logo → nav → ⌘K trigger → `View work` → `Get in
touch`.

### Reduced Motion

A single branch in the `useEffect` handles this: if `useReducedMotion`
returns `true`, phase is set to `held` immediately on mount. The
`data-motion="playing"` attribute is never set, so the CSS wobble
keyframe never runs. Framer Motion's own reduced-motion handling
disables any `motion.*` transitions in this branch automatically.

### Contrast

- The dim-etched name during the animation is decorative. The
  accessible name is the hidden `<h1>`.
- The lit-name state (held) must pass WCAG AA for large text
  (`--color-accent` on near-white background). The accent is currently
  `oklch(0.68 0.17 60)` — manual verification required in the
  implementation plan as a QA step.

### Print

`@media print { [data-brain-hero] { animation: none; } }` renders the
held state for print regardless of session.

## SSR & Hydration

- Server renders the **held** state (brain full, fluid visible, name
  lit, supporting content visible). This guarantees:
  - No layout shift after hydration.
  - Graceful degradation for users with JS disabled — they see a
    complete hero, just without the cinematic intro.
  - Crawlers index the name and tagline without needing to execute
    scripts.
- Client hydration: on first `useEffect`, if conditions are met
  (motion OK, no session flag), flip the phase to `playing`. Framer
  Motion's motion values animate *from* the initial (empty) state
  *toward* the final (held) state.
- To prevent a visible "rewind" flash when the playing state starts
  mid-hydration, all SVG animated elements use `motion.*` primitives
  whose `initial` prop matches the held state and whose `animate`
  prop switches based on phase. On the server, `initial === animate`
  so the SSR HTML matches the held layout. On the client, `animate`
  flips to the playing sequence only after `setPhase('playing')`
  fires, using Framer Motion's `variants` API to coordinate.

## Testing

### Unit (vitest + testing-library)

1. **Reduced motion path** — mock `useReducedMotion` to `true`, render
   `BrainHero`, assert the fluid rects all have `opacity > 0` and the
   name text has `opacity: 1`. Protects the a11y path.
2. **Session persistence** — clear `sessionStorage`, render
   `BrainHero`, fire `useEffect`, assert
   `sessionStorage.getItem('bc:brain-hero-played')` equals `'1'`.
3. **Session skip** — preload `sessionStorage['bc:brain-hero-played'] = '1'`,
   render, assert the held state is rendered immediately (no playing
   phase).
4. **brain-geometry module** — import path, chambers, and name anchor;
   assert path string is non-empty, chambers are exactly 4 entries
   with monotonically increasing y ranges, name anchor is within the
   viewBox.

### Visual (manual QA checklist, part of the implementation plan)

- First load in a fresh tab: full animation plays, name glows at the
  end, buttons fade in.
- Soft navigation away and back: held state, no animation.
- Hard refresh: full animation plays again.
- OS-level "reduce motion" on: held state immediately, no wobble.
- `@media print` preview: held state, no animation.
- Mobile Safari viewport with address bar visible: brain fits
  comfortably, nothing clipped.
- Manual contrast check on the lit name against the background: pass
  WCAG AA large-text (3:1).

### Not in scope

No Playwright visual regression test for this spec. Can be added as a
follow-up once baselines settle.

## Open Questions

None at time of writing. All decisions captured above are explicit.

## Out-of-Scope Follow-Ups

- Replacing the inline-authored brain path with a hand-drawn sprite
  (e.g., a commissioned SVG from a designer) — would be a drop-in
  replacement in `brain-geometry.ts`.
- Playwright visual baseline for the held state.
- Optional `?replay=1` URL param or small replay button for users who
  missed the animation.
