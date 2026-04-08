# Brain Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the pixel-knight hero with an SVG brain-vessel that fills with amber fluid chamber by chamber, culminating in an etched "Brian Cao" name reveal, playing once per session.

**Architecture:** A pure-SVG, Framer-Motion-orchestrated hero. Phase state (`initial` | `playing` | `held`) lives in a custom hook that reads `prefers-reduced-motion` and `sessionStorage`, and is owned by `HomeHero` (now a client component) so it can coordinate the BrainHero SVG animation and the supporting content's fade-in.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Framer Motion 11 (already in the bundle), Tailwind v4, Vitest + Testing Library. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-04-08-brain-hero-design.md`

---

## File Structure

**Create:**
- `components/hero/brain-geometry.ts` — pure data: viewBox, brain path, 4 chambers, name anchor.
- `components/hero/timeline.ts` — shared delay constants for the animation sequence.
- `components/hero/useHeroPhase.ts` — custom hook managing phase + session + reduced-motion.
- `components/hero/BrainHero.tsx` — client component, rendered by HomeHero, accepts `phase` prop.
- `components/hero/BrainHero.module.css` — wobble keyframes + supporting-content transitions keyed on `data-brain-phase`.
- `tests/unit/brain-geometry.test.ts`
- `tests/unit/brain-timeline.test.ts`
- `tests/unit/useHeroPhase.test.tsx`
- `tests/unit/BrainHero.test.tsx`
- `tests/unit/HomeHero.test.tsx`

**Modify:**
- `components/hero/HomeHero.tsx` — becomes a client component, uses `useHeroPhase`, passes `phase` to `BrainHero`, animates supporting content via `data-brain-phase` attribute.

**Delete:**
- `components/hero/PixelHero.tsx`

---

## Task 1: brain-geometry + timeline data modules

**Files:**
- Create: `components/hero/brain-geometry.ts`
- Create: `components/hero/timeline.ts`
- Test: `tests/unit/brain-geometry.test.ts`
- Test: `tests/unit/brain-timeline.test.ts`

- [ ] **Step 1: Write the failing geometry test**

Create `tests/unit/brain-geometry.test.ts`:

```ts
import { BRAIN_OUTLINE_PATH, CHAMBERS, NAME_ANCHOR, VIEWBOX } from '@/components/hero/brain-geometry';
import { describe, expect, it } from 'vitest';

describe('brain-geometry', () => {
  it('viewBox has positive dimensions', () => {
    expect(VIEWBOX.w).toBeGreaterThan(0);
    expect(VIEWBOX.h).toBeGreaterThan(0);
  });

  it('has exactly 4 chambers', () => {
    expect(CHAMBERS).toHaveLength(4);
  });

  it('chambers have monotonically increasing y ranges covering the vessel', () => {
    for (let i = 0; i < CHAMBERS.length; i++) {
      expect(CHAMBERS[i].y0).toBeLessThan(CHAMBERS[i].y1);
      if (i > 0) {
        expect(CHAMBERS[i].y0).toBeGreaterThanOrEqual(CHAMBERS[i - 1].y1);
      }
    }
  });

  it('chambers each have a kebab-case id and non-empty label', () => {
    for (const c of CHAMBERS) {
      expect(c.id).toMatch(/^[a-z][a-z0-9-]*$/);
      expect(c.label.length).toBeGreaterThan(0);
    }
  });

  it('chamber labels match the approved taxonomy', () => {
    expect(CHAMBERS.map((c) => c.label)).toEqual(['AI / ML', 'Systems', 'Web', 'Tools']);
  });

  it('name anchor is inside the viewBox', () => {
    expect(NAME_ANCHOR.x).toBeGreaterThan(0);
    expect(NAME_ANCHOR.x).toBeLessThan(VIEWBOX.w);
    expect(NAME_ANCHOR.y).toBeGreaterThan(0);
    expect(NAME_ANCHOR.y).toBeLessThan(VIEWBOX.h);
    expect(NAME_ANCHOR.maxWidth).toBeGreaterThan(0);
  });

  it('brain outline path is a closed SVG path starting with move-to', () => {
    expect(BRAIN_OUTLINE_PATH.trim()).toMatch(/^M/);
    expect(BRAIN_OUTLINE_PATH.trim()).toMatch(/Z\s*$/);
  });
});
```

- [ ] **Step 2: Run the geometry test to verify it fails**

Run: `pnpm exec vitest run tests/unit/brain-geometry.test.ts`
Expected: FAIL — `Cannot find module '@/components/hero/brain-geometry'`.

- [ ] **Step 3: Implement brain-geometry.ts**

Create `components/hero/brain-geometry.ts`:

```ts
/**
 * Pure data module describing the brain vessel geometry.
 * No React, no imports — safe to import anywhere, including tests.
 */

export const VIEWBOX = { w: 400, h: 340 } as const;

/**
 * Stylized anatomical brain silhouette, side-view leaning.
 * Hand-authored cubic beziers. Intentionally simple — the fluid and
 * etched name do the heavy lifting, not the outline detail.
 * Refine visually during Task 5 if needed.
 */
export const BRAIN_OUTLINE_PATH =
  'M 60,170 C 60,90 120,40 210,40 C 290,40 350,90 340,170 C 340,210 315,245 270,260 C 225,275 195,265 185,250 C 180,240 190,230 200,237 C 210,245 220,242 220,232 C 220,215 200,210 180,215 C 140,225 100,245 75,225 C 55,210 50,190 60,170 Z';

export type Chamber = {
  readonly id: string;
  readonly label: string;
  /** top of the chamber in viewBox units (smaller y = higher) */
  readonly y0: number;
  /** bottom of the chamber in viewBox units */
  readonly y1: number;
};

export const CHAMBERS: readonly Chamber[] = [
  { id: 'ai-ml', label: 'AI / ML', y0: 40, y1: 115 },
  { id: 'systems', label: 'Systems', y0: 115, y1: 180 },
  { id: 'web', label: 'Web', y0: 180, y1: 245 },
  { id: 'tools', label: 'Tools', y0: 245, y1: 310 },
] as const;

export const NAME_ANCHOR = {
  x: 200,
  y: 178,
  maxWidth: 200,
} as const;
```

- [ ] **Step 4: Run the geometry test to verify it passes**

Run: `pnpm exec vitest run tests/unit/brain-geometry.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Write the failing timeline test**

Create `tests/unit/brain-timeline.test.ts`:

```ts
import * as T from '@/components/hero/timeline';
import { describe, expect, it } from 'vitest';

describe('brain-hero timeline', () => {
  it('exposes numeric delays for every animation beat', () => {
    expect(typeof T.BRAIN_STROKE_START).toBe('number');
    expect(typeof T.EYEBROW_START).toBe('number');
    expect(typeof T.CHAMBER_STARTS).toBe('object');
    expect(T.CHAMBER_STARTS).toHaveLength(4);
    expect(typeof T.PULSE_START).toBe('number');
    expect(typeof T.SUPPORTING_CONTENT_START).toBe('number');
    expect(typeof T.CHAMBER_FILL_DURATION).toBe('number');
  });

  it('delays are strictly ascending', () => {
    const series = [
      T.BRAIN_STROKE_START,
      T.EYEBROW_START,
      ...T.CHAMBER_STARTS,
      T.PULSE_START,
      T.SUPPORTING_CONTENT_START,
    ];
    for (let i = 1; i < series.length; i++) {
      expect(series[i]).toBeGreaterThan(series[i - 1]);
    }
  });

  it('chamber fill duration is between 0.5 and 2 seconds', () => {
    expect(T.CHAMBER_FILL_DURATION).toBeGreaterThanOrEqual(0.5);
    expect(T.CHAMBER_FILL_DURATION).toBeLessThanOrEqual(2);
  });
});
```

- [ ] **Step 6: Run the timeline test to verify it fails**

Run: `pnpm exec vitest run tests/unit/brain-timeline.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement timeline.ts**

Create `components/hero/timeline.ts`:

```ts
/**
 * Shared delay constants for the brain hero animation.
 * All values in seconds. Mirrors the beat sheet in the design spec.
 */

export const BRAIN_STROKE_START = 0;
export const BRAIN_STROKE_DURATION = 0.4;

export const EYEBROW_START = 0.6;
export const EYEBROW_DURATION = 0.3;

/** Start time for each chamber fill, in order (top → bottom). */
export const CHAMBER_STARTS = [0.9, 1.8, 2.7, 3.6] as const;
export const CHAMBER_FILL_DURATION = 0.9;

/** Honey ease curve — slow start, accelerating finish. */
export const HONEY_EASE = [0.32, 0, 0.67, 0.12] as const;

/** Name brightness steps: opacity value per chamber boundary. */
export const NAME_OPACITY_STEPS = [0.35, 0.55, 0.75, 0.9, 1] as const;

export const PULSE_START = 4.8;
export const PULSE_DURATION = 0.3;

export const SUPPORTING_CONTENT_START = 5.1;
export const SUPPORTING_CONTENT_DURATION = 0.5;
export const SUPPORTING_CONTENT_STAGGER = 0.08;

/** Total animation length from page load to held state. */
export const TOTAL_DURATION = SUPPORTING_CONTENT_START + SUPPORTING_CONTENT_DURATION;
```

- [ ] **Step 8: Run the timeline test to verify it passes**

Run: `pnpm exec vitest run tests/unit/brain-timeline.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 9: Commit**

```bash
git add components/hero/brain-geometry.ts components/hero/timeline.ts tests/unit/brain-geometry.test.ts tests/unit/brain-timeline.test.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat(hero): add brain geometry and animation timeline modules"
```

---

## Task 2: useHeroPhase hook

**Files:**
- Create: `components/hero/useHeroPhase.ts`
- Test: `tests/unit/useHeroPhase.test.tsx`

- [ ] **Step 1: Write the failing hook test**

Create `tests/unit/useHeroPhase.test.tsx`:

```tsx
import { useHeroPhase } from '@/components/hero/useHeroPhase';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function mockReducedMotion(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced && query.includes('reduce'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('useHeroPhase', () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockReducedMotion(false);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('resolves to held when reduced motion is preferred', async () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useHeroPhase());
    await waitFor(() => expect(result.current).toBe('held'));
    expect(sessionStorage.getItem('bc:brain-hero-played')).toBeNull();
  });

  it('resolves to held when the session flag is already set', async () => {
    sessionStorage.setItem('bc:brain-hero-played', '1');
    const { result } = renderHook(() => useHeroPhase());
    await waitFor(() => expect(result.current).toBe('held'));
  });

  it('resolves to playing on a fresh mount and writes the session flag', async () => {
    const { result } = renderHook(() => useHeroPhase());
    await waitFor(() => expect(result.current).toBe('playing'));
    expect(sessionStorage.getItem('bc:brain-hero-played')).toBe('1');
  });

  it('starts in initial on the first render (pre-effect) then transitions', () => {
    const { result } = renderHook(() => useHeroPhase());
    expect(['initial', 'playing', 'held']).toContain(result.current);
  });
});
```

- [ ] **Step 2: Run the hook test to verify it fails**

Run: `pnpm exec vitest run tests/unit/useHeroPhase.test.tsx`
Expected: FAIL — `Cannot find module '@/components/hero/useHeroPhase'`.

- [ ] **Step 3: Implement useHeroPhase**

Create `components/hero/useHeroPhase.ts`:

```ts
'use client';

import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useEffect, useState } from 'react';

export type HeroPhase = 'initial' | 'playing' | 'held';

const SESSION_KEY = 'bc:brain-hero-played';

/**
 * Owns the brain hero animation lifecycle.
 *
 *  - `initial` — server-rendered / pre-effect state. The DOM renders
 *    the held final state so there is no layout shift.
 *  - `playing` — the first mount in a fresh session with motion
 *    enabled. Writes a session flag so reloads within the tab skip
 *    straight to held.
 *  - `held` — reduced motion preferred, session flag already set, or
 *    the animation has completed.
 */
export function useHeroPhase(): HeroPhase {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<HeroPhase>('initial');

  useEffect(() => {
    if (reduced) {
      setPhase('held');
      return;
    }
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) {
      setPhase('held');
      return;
    }
    setPhase('playing');
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // sessionStorage can throw in private mode — fail silent.
    }
  }, [reduced]);

  return phase;
}
```

- [ ] **Step 4: Run the hook test to verify it passes**

Run: `pnpm exec vitest run tests/unit/useHeroPhase.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add components/hero/useHeroPhase.ts tests/unit/useHeroPhase.test.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat(hero): add useHeroPhase lifecycle hook"
```

---

## Task 3: BrainHero held state (SSR-safe DOM)

**Files:**
- Create: `components/hero/BrainHero.tsx`
- Test: `tests/unit/BrainHero.test.tsx`

- [ ] **Step 1: Write the failing held-state test**

Create `tests/unit/BrainHero.test.tsx`:

```tsx
import { BrainHero } from '@/components/hero/BrainHero';
import { CHAMBERS } from '@/components/hero/brain-geometry';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('BrainHero — held state', () => {
  it('renders an svg with role=img labeled by brian cao', () => {
    render(<BrainHero phase="held" />);
    const img = screen.getByRole('img', { name: /brian cao/i });
    expect(img.tagName.toLowerCase()).toBe('svg');
  });

  it('exposes a title and description for screen readers', () => {
    const { container } = render(<BrainHero phase="held" />);
    expect(container.querySelector('svg > title')?.textContent).toBe('Brian Cao');
    expect(container.querySelector('svg > desc')?.textContent).toMatch(
      /four chambers labeled ai\s*\/\s*ml, systems, web, and tools/i,
    );
  });

  it('renders a fluid rect for every chamber, all full in held state', () => {
    const { container } = render(<BrainHero phase="held" />);
    const rects = container.querySelectorAll('[data-fluid-chamber]');
    expect(rects).toHaveLength(CHAMBERS.length);
    rects.forEach((rect, i) => {
      const chamber = CHAMBERS[i];
      expect(Number(rect.getAttribute('y'))).toBe(chamber.y0);
      expect(Number(rect.getAttribute('height'))).toBe(chamber.y1 - chamber.y0);
    });
  });

  it('renders the etched name text', () => {
    const { container } = render(<BrainHero phase="held" />);
    const text = container.querySelector('text[data-brain-name]');
    expect(text).not.toBeNull();
    expect(text?.textContent).toMatch(/brian\s*cao/i);
  });

  it('chamber labels are aria-hidden decorative text', () => {
    const { container } = render(<BrainHero phase="held" />);
    const labels = container.querySelectorAll('[data-chamber-label]');
    expect(labels.length).toBe(CHAMBERS.length);
    labels.forEach((el) => expect(el.getAttribute('aria-hidden')).toBe('true'));
  });
});
```

- [ ] **Step 2: Run the held-state test to verify it fails**

Run: `pnpm exec vitest run tests/unit/BrainHero.test.tsx`
Expected: FAIL — `Cannot find module '@/components/hero/BrainHero'`.

- [ ] **Step 3: Implement BrainHero held state**

Create `components/hero/BrainHero.tsx`:

```tsx
'use client';

import { BRAIN_OUTLINE_PATH, CHAMBERS, NAME_ANCHOR, VIEWBOX } from './brain-geometry';
import type { HeroPhase } from './useHeroPhase';

interface BrainHeroProps {
  phase: HeroPhase;
  className?: string;
}

/**
 * SVG brain vessel. Controlled entirely by the `phase` prop:
 *  - `initial` and `held` render the fluid at full height (SSR-safe).
 *  - `playing` additionally sets data-motion="playing" so CSS can run
 *    the wobble and Framer Motion variants (added in Task 4) can
 *    animate the fill.
 */
export function BrainHero({ phase, className }: BrainHeroProps) {
  const isPlaying = phase === 'playing';

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      className={className}
      role="img"
      aria-labelledby="brain-hero-title brain-hero-desc"
      data-brain-hero
      data-motion={isPlaying ? 'playing' : 'static'}
    >
      <title id="brain-hero-title">Brian Cao</title>
      <desc id="brain-hero-desc">
        Illustration of a brain-shaped vessel containing four chambers labeled AI / ML, Systems,
        Web, and Tools.
      </desc>

      <defs>
        <clipPath id="brain-clip">
          <path d={BRAIN_OUTLINE_PATH} />
        </clipPath>
        <linearGradient id="fluid-gradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--color-accent-lo)" />
          <stop offset="100%" stopColor="var(--color-accent-hi)" />
        </linearGradient>
      </defs>

      {/* Brain outline stroke */}
      <path
        d={BRAIN_OUTLINE_PATH}
        fill="none"
        stroke="oklch(0.7 0.01 60 / 0.5)"
        strokeWidth={1.5}
        data-brain-outline
      />

      {/* Fluid rects clipped to the brain silhouette, one per chamber */}
      <g clipPath="url(#brain-clip)" data-fluid-group>
        {CHAMBERS.map((c) => (
          <rect
            key={c.id}
            data-fluid-chamber={c.id}
            x={0}
            width={VIEWBOX.w}
            y={c.y0}
            height={c.y1 - c.y0}
            fill="url(#fluid-gradient)"
            opacity={0.85}
          />
        ))}
      </g>

      {/* Chamber divider hairlines, clipped to the brain */}
      <g clipPath="url(#brain-clip)">
        {CHAMBERS.slice(1).map((c) => (
          <line
            key={`div-${c.id}`}
            x1={0}
            x2={VIEWBOX.w}
            y1={c.y0}
            y2={c.y0}
            stroke="oklch(0.8 0.005 60)"
            strokeWidth={1}
          />
        ))}
      </g>

      {/* Chamber labels — decorative, aria-hidden */}
      {CHAMBERS.map((c) => (
        <text
          key={`label-${c.id}`}
          data-chamber-label={c.id}
          aria-hidden="true"
          x={VIEWBOX.w - 10}
          y={(c.y0 + c.y1) / 2}
          textAnchor="end"
          fontFamily="var(--font-mono), ui-monospace, monospace"
          fontSize={9}
          fill="var(--color-accent)"
          opacity={0}
        >
          {c.label}
        </text>
      ))}

      {/* Etched name */}
      <text
        data-brain-name
        x={NAME_ANCHOR.x}
        y={NAME_ANCHOR.y}
        textAnchor="middle"
        fontFamily="var(--font-serif), Georgia, serif"
        fontSize={36}
        fill="var(--color-accent)"
        opacity={1}
        style={{ filter: 'drop-shadow(0 0 12px var(--color-accent-glow))' }}
      >
        Brian <tspan fontStyle="italic">Cao</tspan>
      </text>
    </svg>
  );
}
```

- [ ] **Step 4: Run the held-state test to verify it passes**

Run: `pnpm exec vitest run tests/unit/BrainHero.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add components/hero/BrainHero.tsx tests/unit/BrainHero.test.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat(hero): BrainHero held state SVG with a11y"
```

---

## Task 4: BrainHero playing-phase motion variants

**Files:**
- Modify: `components/hero/BrainHero.tsx`
- Modify: `tests/unit/BrainHero.test.tsx`

- [ ] **Step 1: Add the failing playing-state tests**

Append to `tests/unit/BrainHero.test.tsx`:

```tsx
describe('BrainHero — playing state', () => {
  it('sets data-motion="playing" on the svg', () => {
    const { container } = render(<BrainHero phase="playing" />);
    expect(container.querySelector('svg')?.getAttribute('data-motion')).toBe('playing');
  });

  it('sets data-motion="static" on initial and held phases', () => {
    const { container: c1 } = render(<BrainHero phase="initial" />);
    expect(c1.querySelector('svg')?.getAttribute('data-motion')).toBe('static');
    const { container: c2 } = render(<BrainHero phase="held" />);
    expect(c2.querySelector('svg')?.getAttribute('data-motion')).toBe('static');
  });

  it('still renders all fluid chambers in the playing state (framer motion applies animations, not removals)', () => {
    const { container } = render(<BrainHero phase="playing" />);
    expect(container.querySelectorAll('[data-fluid-chamber]')).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Run the new tests to verify the new assertions fail**

Run: `pnpm exec vitest run tests/unit/BrainHero.test.tsx`
Expected: the `initial` assertion in the second new test passes (already static), but the rest confirm the attribute behaves for `playing` (already passing from Task 3). If all three new tests already pass, that's fine — Task 3 already wired the attribute. Proceed to add the Framer Motion variants.

- [ ] **Step 3: Replace BrainHero with a motion-variant implementation**

Replace `components/hero/BrainHero.tsx` with the variant-driven version. The key change: each animated SVG element becomes a `motion.*` element with a `variants` map keyed by phase, and a single root `motion.g` sets `initial="initial"` and `animate={phase}`. Elements fully defined below:

```tsx
'use client';

import { motion, type Variants } from 'framer-motion';
import {
  BRAIN_STROKE_DURATION,
  BRAIN_STROKE_START,
  CHAMBER_FILL_DURATION,
  CHAMBER_STARTS,
  HONEY_EASE,
  NAME_OPACITY_STEPS,
  PULSE_DURATION,
  PULSE_START,
} from './timeline';
import { BRAIN_OUTLINE_PATH, CHAMBERS, NAME_ANCHOR, VIEWBOX } from './brain-geometry';
import type { HeroPhase } from './useHeroPhase';

interface BrainHeroProps {
  phase: HeroPhase;
  className?: string;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const strokeVariants: Variants = {
  initial: { opacity: 0 },
  playing: {
    opacity: 0.5,
    transition: { delay: BRAIN_STROKE_START, duration: BRAIN_STROKE_DURATION, ease: EASE_OUT },
  },
  held: { opacity: 0.5 },
};

function chamberVariants(index: number): Variants {
  const start = CHAMBER_STARTS[index];
  const { y0, y1 } = CHAMBERS[index];
  return {
    initial: { y: y0, height: y1 - y0 }, // SSR-safe: full so there is no layout shift
    playing: {
      y: [y1, y0],
      height: [0, y1 - y0],
      transition: { delay: start, duration: CHAMBER_FILL_DURATION, ease: HONEY_EASE, times: [0, 1] },
    },
    held: { y: y0, height: y1 - y0 },
  };
}

function chamberLabelVariants(index: number): Variants {
  const start = CHAMBER_STARTS[index] + 0.2;
  return {
    initial: { opacity: 0 },
    playing: {
      opacity: [0, 1, 1, 0],
      transition: { delay: start, duration: 1.0, times: [0, 0.2, 0.6, 1] },
    },
    held: { opacity: 0 },
  };
}

const nameVariants: Variants = {
  initial: { opacity: 1, scale: 1 }, // SSR-safe: lit so no shift
  playing: {
    opacity: [
      NAME_OPACITY_STEPS[0],
      NAME_OPACITY_STEPS[0],
      NAME_OPACITY_STEPS[1],
      NAME_OPACITY_STEPS[2],
      NAME_OPACITY_STEPS[3],
      1,
      1,
    ],
    scale: [1, 1, 1, 1, 1, 1.02, 1],
    transition: {
      duration: PULSE_START + PULSE_DURATION,
      times: [
        0,
        CHAMBER_STARTS[0] / (PULSE_START + PULSE_DURATION),
        CHAMBER_STARTS[1] / (PULSE_START + PULSE_DURATION),
        CHAMBER_STARTS[2] / (PULSE_START + PULSE_DURATION),
        CHAMBER_STARTS[3] / (PULSE_START + PULSE_DURATION),
        PULSE_START / (PULSE_START + PULSE_DURATION),
        1,
      ],
    },
  },
  held: { opacity: 1, scale: 1 },
};

export function BrainHero({ phase, className }: BrainHeroProps) {
  const isPlaying = phase === 'playing';

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      className={className}
      role="img"
      aria-labelledby="brain-hero-title brain-hero-desc"
      data-brain-hero
      data-motion={isPlaying ? 'playing' : 'static'}
    >
      <title id="brain-hero-title">Brian Cao</title>
      <desc id="brain-hero-desc">
        Illustration of a brain-shaped vessel containing four chambers labeled AI / ML, Systems,
        Web, and Tools.
      </desc>

      <defs>
        <clipPath id="brain-clip">
          <path d={BRAIN_OUTLINE_PATH} />
        </clipPath>
        <linearGradient id="fluid-gradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--color-accent-lo)" />
          <stop offset="100%" stopColor="var(--color-accent-hi)" />
        </linearGradient>
      </defs>

      <motion.path
        d={BRAIN_OUTLINE_PATH}
        fill="none"
        stroke="oklch(0.7 0.01 60 / 0.5)"
        strokeWidth={1.5}
        data-brain-outline
        variants={strokeVariants}
        initial="initial"
        animate={phase}
      />

      <g clipPath="url(#brain-clip)" data-fluid-group>
        {CHAMBERS.map((c, i) => (
          <motion.rect
            key={c.id}
            data-fluid-chamber={c.id}
            x={0}
            width={VIEWBOX.w}
            fill="url(#fluid-gradient)"
            opacity={0.85}
            variants={chamberVariants(i)}
            initial="initial"
            animate={phase}
          />
        ))}
      </g>

      <g clipPath="url(#brain-clip)">
        {CHAMBERS.slice(1).map((c) => (
          <line
            key={`div-${c.id}`}
            x1={0}
            x2={VIEWBOX.w}
            y1={c.y0}
            y2={c.y0}
            stroke="oklch(0.8 0.005 60)"
            strokeWidth={1}
          />
        ))}
      </g>

      {CHAMBERS.map((c, i) => (
        <motion.text
          key={`label-${c.id}`}
          data-chamber-label={c.id}
          aria-hidden="true"
          x={VIEWBOX.w - 10}
          y={(c.y0 + c.y1) / 2}
          textAnchor="end"
          fontFamily="var(--font-mono), ui-monospace, monospace"
          fontSize={9}
          fill="var(--color-accent)"
          variants={chamberLabelVariants(i)}
          initial="initial"
          animate={phase}
        >
          {c.label}
        </motion.text>
      ))}

      <motion.text
        data-brain-name
        x={NAME_ANCHOR.x}
        y={NAME_ANCHOR.y}
        textAnchor="middle"
        fontFamily="var(--font-serif), Georgia, serif"
        fontSize={36}
        fill="var(--color-accent)"
        style={{ filter: 'drop-shadow(0 0 12px var(--color-accent-glow))' }}
        variants={nameVariants}
        initial="initial"
        animate={phase}
      >
        Brian <tspan fontStyle="italic">Cao</tspan>
      </motion.text>
    </svg>
  );
}
```

- [ ] **Step 4: Run the full BrainHero test file**

Run: `pnpm exec vitest run tests/unit/BrainHero.test.tsx`
Expected: PASS, 8 tests (5 from Task 3 + 3 new).

- [ ] **Step 5: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/hero/BrainHero.tsx tests/unit/BrainHero.test.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat(hero): drive BrainHero with framer motion variants per phase"
```

---

## Task 5: BrainHero wobble CSS

**Files:**
- Create: `components/hero/BrainHero.module.css`
- Modify: `components/hero/BrainHero.tsx`
- Modify: `tests/unit/BrainHero.test.tsx`

- [ ] **Step 1: Add the failing wobble test**

Append to `tests/unit/BrainHero.test.tsx`:

```tsx
describe('BrainHero — wobble', () => {
  it('fluid group has the wobble class so the CSS keyframe can target it', () => {
    const { container } = render(<BrainHero phase="playing" />);
    const group = container.querySelector('[data-fluid-group]');
    expect(group?.className.toString()).toMatch(/wobble/i);
  });
});
```

- [ ] **Step 2: Run the wobble test to verify it fails**

Run: `pnpm exec vitest run tests/unit/BrainHero.test.tsx`
Expected: FAIL on the new test — `group?.className` does not contain "wobble".

- [ ] **Step 3: Create the CSS module**

Create `components/hero/BrainHero.module.css`:

```css
/*
 * Brain hero — wobble keyframes.
 * Active only while [data-motion="playing"] is set on the svg.
 * A subtle ±0.8px vertical micro-bounce on the fluid group reads as
 * liquid settling without re-introducing a JS RAF loop. The amplitude
 * is intentionally low — too much and it looks like the whole SVG is
 * shaking.
 */

@keyframes brain-meniscus-wobble {
  0%,
  100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-0.8px);
  }
  75% {
    transform: translateY(0.4px);
  }
}

.fluidWobble {
  transform-box: fill-box;
  transform-origin: center;
}

[data-brain-hero][data-motion='playing'] .fluidWobble {
  animation: brain-meniscus-wobble 340ms ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .fluidWobble {
    animation: none !important;
  }
}
```

- [ ] **Step 4: Wire the CSS module into BrainHero**

Modify `components/hero/BrainHero.tsx`. Add the import at the top and apply the class to the fluid group `<g>`:

```tsx
import styles from './BrainHero.module.css';
```

Find the line:
```tsx
      <g clipPath="url(#brain-clip)" data-fluid-group>
```

Replace with:
```tsx
      <g clipPath="url(#brain-clip)" data-fluid-group className={styles.fluidWobble}>
```

- [ ] **Step 5: Run the full BrainHero test file**

Run: `pnpm exec vitest run tests/unit/BrainHero.test.tsx`
Expected: PASS, 9 tests.

- [ ] **Step 6: Commit**

```bash
git add components/hero/BrainHero.tsx components/hero/BrainHero.module.css tests/unit/BrainHero.test.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat(hero): add fluid wobble keyframe for playing phase"
```

---

## Task 6: HomeHero integration and PixelHero removal

**Files:**
- Modify: `components/hero/HomeHero.tsx`
- Modify: `components/hero/BrainHero.module.css`
- Delete: `components/hero/PixelHero.tsx`
- Create: `tests/unit/HomeHero.test.tsx`

- [ ] **Step 1: Write the failing HomeHero integration test**

Create `tests/unit/HomeHero.test.tsx`:

```tsx
import { HomeHero } from '@/components/hero/HomeHero';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

function mockReducedMotion(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced && query.includes('reduce'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('HomeHero', () => {
  it('renders BrainHero and a screen-reader-only h1 with the name', () => {
    mockReducedMotion(false);
    sessionStorage.clear();
    render(<HomeHero />);
    expect(screen.getByRole('img', { name: /brian cao/i })).toBeInTheDocument();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent(/brian\s*cao/i);
    expect(h1.className).toContain('sr-only');
  });

  it('renders the tagline and primary CTAs', () => {
    mockReducedMotion(false);
    sessionStorage.clear();
    render(<HomeHero />);
    expect(screen.getByText(/full-stack engineer/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view work/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get in touch/i })).toBeInTheDocument();
  });

  it('sets data-brain-phase on the section so CSS can time supporting content', () => {
    mockReducedMotion(true); // force held immediately, synchronous assertion
    sessionStorage.clear();
    const { container } = render(<HomeHero />);
    const section = container.querySelector('section#hero');
    expect(section?.getAttribute('data-brain-phase')).toBe('held');
  });
});
```

- [ ] **Step 2: Run the HomeHero test to verify it fails**

Run: `pnpm exec vitest run tests/unit/HomeHero.test.tsx`
Expected: FAIL — assertions fail because current HomeHero still uses PixelHero and has no `data-brain-phase`.

- [ ] **Step 3: Replace HomeHero**

Replace `components/hero/HomeHero.tsx`:

```tsx
'use client';

import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import { BrainHero } from './BrainHero';
import styles from './BrainHero.module.css';
import { SUPPORTING_CONTENT_START, SUPPORTING_CONTENT_STAGGER } from './timeline';
import { useHeroPhase } from './useHeroPhase';

export function HomeHero() {
  const phase = useHeroPhase();

  return (
    <section
      id="hero"
      className={`relative flex min-h-[calc(100dvh-56px)] items-center justify-center overflow-hidden ${styles.heroSection}`}
      aria-label="Introduction"
      data-brain-phase={phase}
    >
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Real h1 for SEO and screen readers — visually hidden */}
          <h1 className="sr-only">Brian Cao</h1>

          <p
            className={`mb-6 font-mono text-[11px] text-[var(--color-fg-subtle)] uppercase tracking-[0.18em] ${styles.eyebrow}`}
          >
            Portfolio · 01
          </p>

          <BrainHero phase={phase} className="h-auto w-60 md:w-[22rem]" />

          <FadeIn
            delay={phase === 'playing' ? SUPPORTING_CONTENT_START : 0}
            className={`mt-6 max-w-md ${styles.tagline}`}
          >
            <p className="text-[var(--color-fg-muted)]">
              Full-stack engineer building systems at the edge of software and AI.
              <br />
              Stony Brook '27.
            </p>
          </FadeIn>

          <FadeIn
            delay={phase === 'playing' ? SUPPORTING_CONTENT_START + SUPPORTING_CONTENT_STAGGER : 0}
            className={`mt-8 flex flex-wrap justify-center gap-3 ${styles.buttons}`}
          >
            <Button href="/#work">View work</Button>
            <Button href="/#contact" variant="secondary">
              Get in touch
            </Button>
          </FadeIn>
        </div>
      </Container>

      <div className="absolute inset-x-0 bottom-6 z-10">
        <Container>
          <div className="flex items-center justify-between font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.18em]">
            <span>
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              Available · Summer 2026
            </span>
            <span>Scroll ↓</span>
          </div>
        </Container>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add the supporting-content CSS hooks**

Append to `components/hero/BrainHero.module.css`:

```css
/*
 * Placeholder class hooks for supporting content so HomeHero can
 * attach styles.eyebrow/tagline/buttons without className collisions.
 * No rules yet — FadeIn's delay prop handles the timing. Kept as
 * empty selectors so future CSS tweaks (e.g. a named transition that
 * respects data-brain-phase) can land without a component edit.
 */
.heroSection {
}
.eyebrow {
}
.tagline {
}
.buttons {
}
```

- [ ] **Step 5: Delete PixelHero.tsx**

Run: `rm components/hero/PixelHero.tsx`

- [ ] **Step 6: Run the HomeHero test to verify it passes**

Run: `pnpm exec vitest run tests/unit/HomeHero.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 7: Run typecheck to catch any stale imports**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add components/hero/HomeHero.tsx components/hero/BrainHero.module.css tests/unit/HomeHero.test.tsx
git rm components/hero/PixelHero.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat(hero): wire BrainHero into HomeHero, remove PixelHero"
```

---

## Task 7: Full verification, bundle comparison, and manual QA

**Files:**
- None modified (verification only)

- [ ] **Step 1: Run full test suite**

Run: `pnpm test`
Expected: all tests pass. New count: 38 previous + brain-geometry (6) + brain-timeline (3) + useHeroPhase (4) + BrainHero (9) + HomeHero (3) = **63 tests passing**.

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Run production build and capture the bundle report**

Run: `pnpm build 2>&1 | tee /tmp/brain-hero-build.txt`
Expected: build succeeds with no errors. Note the `/` route's page size and first-load JS in the table output.

Baseline reference (from commit `238f708`, pre-brain-hero):
- `/` page size: **3.09 kB**
- `/` first-load JS: **159 kB**
- Shared JS: **102 kB**

Acceptable budget after this task: `/` first-load ≤ **166 kB** (+7 kB).

- [ ] **Step 4: Start the dev server for manual QA**

Run: `pnpm dev`
Open `http://localhost:3000` in a fresh browser tab.

- [ ] **Step 5: Manual QA — fresh session animation**

In the DevTools console, run `sessionStorage.clear()` and then hard-refresh (`Ctrl+Shift+R`).

Expected observations:
- Brain outline fades in ~0.4s.
- `Portfolio · 01` brightens ~0.6s.
- Four chambers fill in sequence top → bottom, each ~0.9s, with a subtle honey ease and the fluid group micro-bouncing during fills.
- Each chamber label (`AI / ML`, `Systems`, `Web`, `Tools`) flashes in briefly as its chamber fills.
- At ~4.8s the name ignites — amber glow, slight overshoot, settles.
- Tagline and buttons fade in staggered at ~5.1s.
- After completion, the brain holds its lit state.

If any beat is off (timing, wobble too strong/weak, colors not reading), tune the constants in `components/hero/timeline.ts` or adjust the brain path in `components/hero/brain-geometry.ts`. Commit tweaks as follow-up commits with the message pattern `style(hero): tune <thing>`.

- [ ] **Step 6: Manual QA — session persistence**

Without clearing storage, soft-navigate to `/projects` and back to `/`. Expected: held state renders immediately, no animation.

Hard-refresh (`Ctrl+Shift+R`). Expected: animation plays again (sessionStorage is tied to the tab, but `Ctrl+Shift+R` clears the session flag's effect by reloading a fresh document — if it doesn't, run `sessionStorage.clear()` first, then refresh).

Close the tab. Open a new tab to `http://localhost:3000`. Expected: animation plays again.

- [ ] **Step 7: Manual QA — reduced motion**

Enable `prefers-reduced-motion: reduce` in DevTools Rendering tab. Hard-refresh. Expected: held state renders instantly — no fill animation, no wobble, name lit from frame 1, tagline and buttons visible immediately.

Disable `prefers-reduced-motion`, run `sessionStorage.clear()`, hard-refresh. Expected: animation plays normally.

- [ ] **Step 8: Manual QA — mobile viewport**

Toggle DevTools device emulation to iPhone 14 Pro. Run `sessionStorage.clear()`, hard-refresh. Expected: brain renders at `w-60` (~240px), nothing overflows, address bar does not clip the bottom bar, animation still plays smoothly.

- [ ] **Step 9: Manual QA — contrast check on held name**

With the brain in held state, pick the color of the lit "Brian Cao" text and the page background. Verify the contrast ratio is ≥ 3:1 (WCAG AA for large text). Reference: the accent is `oklch(0.68 0.17 60)` (~#c17a2b sRGB), the background is `oklch(0.995 0.002 80)` (~#fdfdfc). This should clear 3:1 with margin.

If it fails, darken `--color-accent` by ~0.05 lightness in `app/globals.css` as a follow-up commit.

- [ ] **Step 10: Kill dev server and report**

Stop `pnpm dev`. In the summary to the user, report:
- Bundle delta: `<before>` → `<after>` (Δ `<diff>`)
- Total test count
- All seven QA checks (fresh, session, reduced motion, mobile, contrast, typecheck, build) status
- Any tuning commits beyond the seven task commits

- [ ] **Step 11: Final verification commit (only if tuning changes were made)**

If Steps 5–9 required tuning the timeline or the path, those tweaks should already be committed. No final commit required for this step.

---

## Self-Review Summary

**Spec coverage:**

| Spec section | Covered by |
| --- | --- |
| Concept (fluid-fill brain vessel) | Tasks 3–5 |
| Non-Goals (no 3D, no photorealism) | Implicit — no new deps, no three.js |
| Non-Goals (no site-wide theme changes) | No CSS changes outside `components/hero/` |
| Non-Goals (no scripted interactivity beyond the sequence) | No scroll/hover handlers in BrainHero |
| Architecture → Layout (centered stack + sizes) | Task 6 |
| Architecture → Visual Tokens | Tasks 3 and 6 (CSS uses `--color-accent*` vars) |
| Architecture → File Structure | Tasks 1, 2, 3, 5, 6 |
| Architecture → Component Boundaries | Task 6 (HomeHero owns phase, passes to BrainHero) |
| Architecture → Bundle Budget (< 5.2 kB) | Task 7 Step 3 (verified against baseline) |
| Animation Sequence timeline | Tasks 1, 4 (timeline constants + motion variants) |
| Honey Viscosity (ease + wobble) | Tasks 1 (HONEY_EASE), 4 (variants), 5 (CSS) |
| Session Behavior | Task 2 (hook tests), Task 7 (manual QA) |
| Accessibility → Semantic Structure | Task 3 (title/desc), Task 6 (sr-only h1) |
| Accessibility → Reduced Motion | Task 2 (hook), Task 7 (manual QA) |
| Accessibility → Contrast | Task 7 Step 9 (manual QA with fallback instruction) |
| SSR & Hydration | Task 4 (variants use initial = held to avoid rewind flash) |
| Testing → Unit | Tasks 1, 2, 3, 4, 5, 6 |
| Testing → Visual Manual QA | Task 7 |

**Placeholder scan:** No TBDs, no "implement later", no bare "add error handling". All code blocks are complete. The brain outline path is concrete (not a placeholder) with a note that visual refinement is a Task 7 polish step.

**Type consistency:**
- `HeroPhase` type defined in `useHeroPhase.ts`, consumed by `BrainHero.tsx` (Task 3 onward) and `HomeHero.tsx` (Task 6).
- `Chamber` type in `brain-geometry.ts`, consumed by `BrainHero.tsx`.
- Timeline constants: `BRAIN_STROKE_START`, `EYEBROW_START`, `CHAMBER_STARTS` (array), `CHAMBER_FILL_DURATION`, `HONEY_EASE`, `NAME_OPACITY_STEPS`, `PULSE_START`, `PULSE_DURATION`, `SUPPORTING_CONTENT_START`, `SUPPORTING_CONTENT_STAGGER`. All used consistently in Task 4 and Task 6.
- `data-brain-phase` attribute on the section, `data-motion="playing"|"static"` on the svg, `data-brain-hero`, `data-fluid-group`, `data-fluid-chamber`, `data-chamber-label`, `data-brain-name`, `data-brain-outline` — each defined once and consumed by the corresponding tests/CSS.
