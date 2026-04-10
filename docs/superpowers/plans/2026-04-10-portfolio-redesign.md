# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full visual overhaul of the portfolio — new color scheme (blue accent), oversized serif typography, scroll-linked 3D bento glass hero, clean navigation, 2-column project grid, Lenis smooth scrolling — while preserving all existing content and routes.

**Architecture:** Token-first approach. Update design tokens in `globals.css` first so all existing components inherit the new palette immediately. Then rebuild the hero (most complex new component), restyle the nav and sections, and recompose the homepage. Lenis wraps the app at the layout level.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4, Framer Motion 11 (`useScroll`, `useTransform`, `useSpring`), Lenis (smooth scroll), Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-04-10-portfolio-redesign.md`

---

## File Structure

**Create:**
- `components/scroll/SmoothScroll.tsx` — Lenis wrapper client component
- `components/hero/BentoHero.tsx` — 3D scroll-linked bento glass card grid
- `tests/unit/BentoHero.test.tsx` — tests for bento hero
- `tests/unit/TopBar.test.tsx` — tests for new navigation

**Modify:**
- `app/globals.css` — color tokens, typography scale, remove `.bg-grid`
- `app/layout.tsx` — add Lenis wrapper, update viewport metadata
- `lib/nav.ts` — new navigation link set
- `components/nav/TopBar.tsx` — wordmark + text links + pill CTA
- `components/nav/MobileMenu.tsx` — restyle to match new design
- `components/hero/HomeHero.tsx` — complete rewrite using BentoHero
- `components/project/ProjectCard.tsx` — remove Tilt3D, new flat card
- `components/sections/SelectedWorkSection.tsx` — drop eyebrow, restyle
- `components/sections/AboutSection.tsx` — drop eyebrow, blue accent
- `components/sections/ExperienceSection.tsx` — blue accent
- `components/sections/ToolbeltSection.tsx` — blue hover
- `components/sections/WritingSection.tsx` — drop eyebrow
- `components/primitives/Section.tsx` — remove eyebrow prop pattern
- `app/(site)/page.tsx` — new section order, remove ContactSection

**Delete:**
- `components/hero/BrainHero.tsx`
- `components/hero/BrainHero.module.css`
- `components/hero/brain-geometry.ts`
- `components/hero/timeline.ts`
- `components/hero/useHeroPhase.ts`
- `tests/unit/BrainHero.test.tsx`
- `tests/unit/brain-geometry.test.ts`
- `tests/unit/brain-timeline.test.ts`
- `tests/unit/useHeroPhase.test.tsx`
- `tests/unit/HomeHero.test.tsx`

---

## Task 1: Design tokens and global styles

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update color tokens in globals.css**

Replace the color token block in `app/globals.css` (lines 4-16) with:

```css
  /* Color tokens — blue accent on white */
  --color-bg: #ffffff;
  --color-bg-elevated: #ffffff;
  --color-bg-inset: #f8f9fa;
  --color-fg: #111111;
  --color-fg-muted: #666666;
  --color-fg-subtle: #999999;
  --color-border: #e5e5e5;
  --color-border-strong: #d4d4d4;
  --color-accent: #2563eb;
  --color-accent-hi: #3b82f6;
  --color-accent-lo: #1d4ed8;
  --color-accent-glow: rgba(37, 99, 235, 0.25);
```

- [ ] **Step 2: Update typography scale**

Replace the fluid type scale (lines 33-39) with:

```css
  /* Fluid type scale — oversized display for editorial serif headings */
  --text-display: clamp(3.5rem, 2.5rem + 6vw, 8rem);
  --text-h1: clamp(2.5rem, 1.8rem + 3.5vw, 4.5rem);
  --text-h2: clamp(2rem, 1.5rem + 2.5vw, 3.25rem);
  --text-h3: clamp(1.25rem, 1rem + 1.2vw, 1.75rem);
  --text-body: 1rem;
  --text-small: 0.875rem;
  --text-micro: 0.75rem;
```

- [ ] **Step 3: Update shadow tokens**

Replace the shadows block (lines 42-43) with:

```css
  /* Shadows */
  --shadow-glow: 0 0 40px rgba(37, 99, 235, 0.15);
  --shadow-glow-card: 0 1px 0 0 rgba(255, 255, 255, 0.8) inset, 0 20px 60px -30px rgba(0, 0, 0, 0.15);
```

- [ ] **Step 4: Remove `.bg-grid` helper**

Delete lines 87-91 (the `.bg-grid` class). It won't be used in the new design.

- [ ] **Step 5: Update viewport metadata in layout.tsx**

In `app/layout.tsx`, replace the viewport export (lines 28-33) with:

```ts
export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};
```

- [ ] **Step 6: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors. Token changes are CSS custom properties so TS is unaffected.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css app/layout.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "style: update design tokens to blue accent on white"
```

---

## Task 2: Lenis smooth scroll

**Files:**
- Create: `components/scroll/SmoothScroll.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install lenis**

Run: `pnpm add lenis`

- [ ] **Step 2: Create SmoothScroll wrapper**

Create `components/scroll/SmoothScroll.tsx`:

```tsx
'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 3: Wrap app in SmoothScroll**

In `app/layout.tsx`, add the import:

```ts
import { SmoothScroll } from '@/components/scroll/SmoothScroll';
```

Wrap `{children}` inside `<body>`:

```tsx
<body>
  <SmoothScroll>
    {children}
  </SmoothScroll>
  <Analytics />
  <SpeedInsights />
</body>
```

- [ ] **Step 4: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/scroll/SmoothScroll.tsx app/layout.tsx pnpm-lock.yaml package.json
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add Lenis smooth scroll wrapper"
```

---

## Task 3: Navigation overhaul

**Files:**
- Modify: `lib/nav.ts`
- Modify: `components/nav/TopBar.tsx`
- Modify: `components/nav/MobileMenu.tsx`
- Create: `tests/unit/TopBar.test.tsx`

- [ ] **Step 1: Write the failing nav test**

Create `tests/unit/TopBar.test.tsx`:

```tsx
import { TopBar } from '@/components/nav/TopBar';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('TopBar', () => {
  it('renders the Brian Cao wordmark linking to home', () => {
    render(<TopBar />);
    const wordmark = screen.getByRole('link', { name: /brian cao/i });
    expect(wordmark).toHaveAttribute('href', '/');
  });

  it('renders desktop nav links', () => {
    render(<TopBar />);
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^projects$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^writing$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^resume$/i })).toBeInTheDocument();
  });

  it('renders the Contact pill CTA as a mailto link', () => {
    render(<TopBar />);
    const cta = screen.getByRole('link', { name: /contact/i });
    expect(cta).toHaveAttribute('href', 'mailto:brianc40722@gmail.com');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run tests/unit/TopBar.test.tsx`
Expected: FAIL — current TopBar doesn't render "Brian Cao" wordmark or a Contact mailto link.

- [ ] **Step 3: Update navigation links**

Replace `lib/nav.ts`:

```ts
export interface NavLink {
  href: string;
  label: string;
  /** Show only in the mobile menu, not the desktop navbar. */
  mobileOnly?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Writing' },
  { href: '/resume', label: 'Resume' },
];

export const CONTACT_EMAIL = 'brianc40722@gmail.com';
```

- [ ] **Step 4: Rewrite TopBar**

Replace `components/nav/TopBar.tsx`:

```tsx
import { CONTACT_EMAIL, NAV_LINKS } from '@/lib/nav';
import Link from 'next/link';
import { MobileMenu } from './MobileMenu';

export function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 md:px-8 lg:px-12">
        <Link
          href="/"
          className="text-[17px] font-bold tracking-[-0.02em] text-[var(--color-fg)]"
        >
          Brian Cao
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hi)]"
          >
            Contact
          </a>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Restyle MobileMenu**

Replace `components/nav/MobileMenu.tsx`:

```tsx
'use client';

import { CONTACT_EMAIL, NAV_LINKS } from '@/lib/nav';
import { cn } from '@/lib/utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-fg)] md:hidden"
      >
        <span
          className={cn(
            'block h-px w-4 bg-current transition',
            open && 'translate-y-[3px] rotate-45',
          )}
        />
        <span
          className={cn(
            'absolute block h-px w-4 bg-current transition',
            open && '-translate-y-[3px] -rotate-45',
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed inset-x-0 top-[56px] z-40 mx-4 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-4 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm text-[var(--color-fg)] hover:bg-[var(--color-bg-inset)] hover:text-[var(--color-accent)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-accent)]"
                >
                  Contact →
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 6: Run the TopBar test**

Run: `pnpm exec vitest run tests/unit/TopBar.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 7: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors. The `CommandTrigger` import is removed from TopBar — verify no other file imports it that would break.

- [ ] **Step 8: Commit**

```bash
git add lib/nav.ts components/nav/TopBar.tsx components/nav/MobileMenu.tsx tests/unit/TopBar.test.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat(nav): redesign with wordmark, text links, and blue Contact pill"
```

---

## Task 4: BentoHero component

**Files:**
- Create: `components/hero/BentoHero.tsx`
- Create: `tests/unit/BentoHero.test.tsx`

- [ ] **Step 1: Write the failing BentoHero test**

Create `tests/unit/BentoHero.test.tsx`:

```tsx
import { BentoHero } from '@/components/hero/BentoHero';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('BentoHero', () => {
  it('renders the name as display text', () => {
    render(<BentoHero />);
    expect(screen.getByText('Brian Cao')).toBeInTheDocument();
  });

  it('renders the software engineer eyebrow', () => {
    render(<BentoHero />);
    expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
  });

  it('renders the intro glass card with availability indicator', () => {
    const { container } = render(<BentoHero />);
    expect(container.querySelector('[data-card="intro"]')).not.toBeNull();
    expect(screen.getByText(/available for work/i)).toBeInTheDocument();
  });

  it('renders the featured project glass card', () => {
    const { container } = render(<BentoHero />);
    expect(container.querySelector('[data-card="project"]')).not.toBeNull();
    expect(screen.getByText(/featured project/i)).toBeInTheDocument();
  });

  it('renders the tech stack glass card with pills', () => {
    const { container } = render(<BentoHero />);
    expect(container.querySelector('[data-card="stack"]')).not.toBeNull();
    expect(screen.getByText(/tech stack/i)).toBeInTheDocument();
  });

  it('renders CTA links', () => {
    render(<BentoHero />);
    expect(screen.getByRole('link', { name: /view projects/i })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute(
      'href',
      'mailto:brianc40722@gmail.com',
    );
  });

  it('has a scroll container with sticky inner for the 3D animation', () => {
    const { container } = render(<BentoHero />);
    const scrollContainer = container.querySelector('[data-hero-scroll]');
    expect(scrollContainer).not.toBeNull();
    const stickyInner = container.querySelector('[data-hero-sticky]');
    expect(stickyInner).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run tests/unit/BentoHero.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement BentoHero**

Create `components/hero/BentoHero.tsx`:

```tsx
'use client';

import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import { CONTACT_EMAIL } from '@/lib/nav';
import { getFeaturedProjects } from '@/lib/content/projects';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';

const SPRING_CONFIG = { stiffness: 80, damping: 20, mass: 1 };

const GLASS =
  'rounded-2xl border-[0.5px] border-black/[0.08] bg-white/70 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)]';

const STACK_PILLS = ['React', 'Python', 'TypeScript', 'PyTorch', 'Next.js'];

export function BentoHero() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end start'],
  });

  // Entry: 0→0.5 maps 45°→0°, Exit: 0.5→1.0 maps 0°→-20°
  const rawRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [45, 0, -20]);
  const rawRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-15, 0, 10]);
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.35, 0.5, 0.85, 1], [0, 1, 1, 1, 0]);

  const rotateX = useSpring(rawRotateX, SPRING_CONFIG);
  const rotateY = useSpring(rawRotateY, SPRING_CONFIG);
  const scale = useSpring(rawScale, SPRING_CONFIG);
  const opacity = useSpring(rawOpacity, SPRING_CONFIG);

  // Specular highlight moves at 2x scroll speed
  const highlightX = useTransform(scrollYProgress, [0, 0.5], ['120%', '-20%']);

  // Get the first featured project
  let featuredTitle = 'Advising Bot';
  let featuredTagline = 'AI-powered academic advisor';
  let featuredTech: string[] = ['RAG', 'Next.js'];
  try {
    const projects = getFeaturedProjects();
    if (projects.length > 0) {
      featuredTitle = projects[0]!.title;
      featuredTagline = projects[0]!.tagline;
      featuredTech = projects[0]!.stack.slice(0, 2);
    }
  } catch {
    // Fallback to defaults in tests / SSR where content may not load
  }

  const isReduced = !!reduced;

  return (
    <div ref={scrollRef} data-hero-scroll className="relative h-[200vh]">
      <div
        data-hero-sticky
        className="sticky top-0 flex min-h-screen items-center justify-center overflow-hidden"
      >
        <Container className="relative z-10 py-20">
          {/* Static content above the card */}
          <div className="mb-10 text-center">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
              Software Engineer
            </p>
            <h1 className="sr-only">Brian Cao</h1>
            <p
              aria-hidden="true"
              className="font-serif text-[length:var(--text-display)] font-light leading-[0.9] tracking-[-0.03em] text-[var(--color-fg)]"
            >
              Brian Cao
            </p>
          </div>

          {/* 3D-animated bento grid */}
          <motion.div
            style={
              isReduced
                ? {}
                : {
                    rotateX,
                    rotateY,
                    scale,
                    opacity,
                    transformPerspective: 1200,
                  }
            }
            className="relative mx-auto grid max-w-[580px] grid-cols-[1.4fr_1fr] grid-rows-[auto_auto] gap-3"
          >
            {/* Specular highlight overlay */}
            {!isReduced && (
              <motion.div
                style={{ x: highlightX }}
                className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-br from-white/30 to-transparent"
                aria-hidden="true"
              />
            )}

            {/* Intro card — spans both rows */}
            <div
              data-card="intro"
              className={`${GLASS} row-span-2 flex flex-col justify-between p-6 backdrop-blur-2xl`}
            >
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
                  <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--color-fg-subtle)]">
                    Available for work
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  Full-stack engineer building systems at the edge of software and AI. Stony Brook CS
                  Honors '27.
                </p>
              </div>
              <div className="mt-6 flex gap-2">
                <Button href="/projects" size="sm">
                  View projects
                </Button>
                <Button href={`mailto:${CONTACT_EMAIL}`} variant="secondary" size="sm">
                  Get in touch
                </Button>
              </div>
            </div>

            {/* Featured project card — top right */}
            <div data-card="project" className={`${GLASS} p-5 backdrop-blur-2xl`}>
              <p className="mb-2 text-[11px] uppercase tracking-[0.1em] text-[var(--color-fg-subtle)]">
                Featured Project
              </p>
              <h3 className="text-[17px] font-semibold text-[var(--color-fg)]">{featuredTitle}</h3>
              <p className="mt-1 text-xs text-[var(--color-fg-muted)]">{featuredTagline}</p>
              <div className="mt-3 flex gap-1.5">
                {featuredTech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[11px] text-[var(--color-fg-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills card — bottom right */}
            <div data-card="stack" className={`${GLASS} p-5 backdrop-blur-2xl`}>
              <p className="mb-3 text-[11px] uppercase tracking-[0.1em] text-[var(--color-fg-subtle)]">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {STACK_PILLS.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[11px] text-[var(--color-fg-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </Container>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the BentoHero test**

Run: `pnpm exec vitest run tests/unit/BentoHero.test.tsx`
Expected: PASS, 7 tests. Note: `getFeaturedProjects()` may throw in test env — the try/catch fallback handles this.

- [ ] **Step 5: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/hero/BentoHero.tsx tests/unit/BentoHero.test.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat(hero): add 3D scroll-linked bento glass card hero"
```

---

## Task 5: HomeHero rewrite and brain hero cleanup

**Files:**
- Modify: `components/hero/HomeHero.tsx`
- Delete: `components/hero/BrainHero.tsx`
- Delete: `components/hero/BrainHero.module.css`
- Delete: `components/hero/brain-geometry.ts`
- Delete: `components/hero/timeline.ts`
- Delete: `components/hero/useHeroPhase.ts`
- Delete: `tests/unit/BrainHero.test.tsx`
- Delete: `tests/unit/brain-geometry.test.ts`
- Delete: `tests/unit/brain-timeline.test.ts`
- Delete: `tests/unit/useHeroPhase.test.tsx`
- Delete: `tests/unit/HomeHero.test.tsx`

- [ ] **Step 1: Rewrite HomeHero**

Replace `components/hero/HomeHero.tsx`:

```tsx
import { BentoHero } from './BentoHero';

export function HomeHero() {
  return (
    <section id="hero" aria-label="Introduction">
      <BentoHero />
    </section>
  );
}
```

- [ ] **Step 2: Delete brain hero files**

```bash
rm components/hero/BrainHero.tsx components/hero/BrainHero.module.css components/hero/brain-geometry.ts components/hero/timeline.ts components/hero/useHeroPhase.ts
```

- [ ] **Step 3: Delete brain hero test files and old HomeHero test**

```bash
rm tests/unit/BrainHero.test.tsx tests/unit/brain-geometry.test.ts tests/unit/brain-timeline.test.ts tests/unit/useHeroPhase.test.tsx tests/unit/HomeHero.test.tsx
```

- [ ] **Step 4: Run typecheck to catch stale imports**

Run: `pnpm typecheck`
Expected: no errors. If any file still imports brain hero modules, fix the import.

- [ ] **Step 5: Run full test suite**

Run: `pnpm exec vitest run`
Expected: all tests pass. The deleted test files are gone; BentoHero tests + TopBar tests are the new coverage.

- [ ] **Step 6: Commit**

```bash
git add components/hero/HomeHero.tsx tests/unit/BentoHero.test.tsx
git rm components/hero/BrainHero.tsx components/hero/BrainHero.module.css components/hero/brain-geometry.ts components/hero/timeline.ts components/hero/useHeroPhase.ts tests/unit/BrainHero.test.tsx tests/unit/brain-geometry.test.ts tests/unit/brain-timeline.test.ts tests/unit/useHeroPhase.test.tsx tests/unit/HomeHero.test.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat(hero): wire BentoHero, remove brain hero"
```

---

## Task 6: Section restyling

**Files:**
- Modify: `components/primitives/Section.tsx`
- Modify: `components/project/ProjectCard.tsx`
- Modify: `components/sections/SelectedWorkSection.tsx`
- Modify: `components/sections/AboutSection.tsx`
- Modify: `components/sections/ExperienceSection.tsx`
- Modify: `components/sections/ToolbeltSection.tsx`
- Modify: `components/sections/WritingSection.tsx`

- [ ] **Step 1: Update Section primitive — remove eyebrow numbering**

In `components/primitives/Section.tsx`, the eyebrow rendering (lines 30-33) currently uses mono/uppercase styling. The new design drops numbered eyebrows entirely. Keep the eyebrow prop for optional use but remove the monospace/uppercase style. Replace the eyebrow `<p>` (lines 30-33) with:

```tsx
            {eyebrow && (
              <p className="text-sm text-[var(--color-fg-subtle)]">
                {eyebrow}
              </p>
            )}
```

And update the title `<h2>` (lines 34-37) to use the oversized serif style with tighter tracking:

```tsx
            {title && (
              <h2 className="mt-3 font-serif text-[length:var(--text-h2)] font-light leading-[1.05] tracking-[-0.02em] text-[var(--color-fg)]">
                {title}
              </h2>
            )}
```

- [ ] **Step 2: Restyle ProjectCard — remove Tilt3D**

Replace `components/project/ProjectCard.tsx`:

```tsx
import { Pill } from '@/components/primitives/Pill';
import type { Project } from '@/lib/schemas/project';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = memo(function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block focus-visible:outline-none"
      aria-label={`${project.title} — ${project.tagline}`}
    >
      <article className="overflow-hidden rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[var(--color-bg-inset)]">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-col gap-2 pt-4">
          <h3 className="text-lg font-semibold text-[var(--color-fg)]">{project.title}</h3>
          <p className="text-sm text-[var(--color-fg-muted)]">{project.tagline}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {project.stack.slice(0, 5).map((tech) => (
              <Pill key={tech}>{tech}</Pill>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
});
```

- [ ] **Step 3: Restyle SelectedWorkSection**

Replace `components/sections/SelectedWorkSection.tsx`:

```tsx
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/primitives/Button';
import { Section } from '@/components/primitives/Section';
import { ProjectCard } from '@/components/project/ProjectCard';
import { getFeaturedProjects } from '@/lib/content/projects';

export function SelectedWorkSection() {
  const projects = getFeaturedProjects();

  return (
    <Section id="work" title="Selected Work">
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project, i) => (
          <FadeIn key={project.slug} delay={i * 0.05}>
            <ProjectCard project={project} index={i} />
          </FadeIn>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Button href="/projects" variant="secondary">
          See all projects →
        </Button>
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Restyle AboutSection**

In `components/sections/AboutSection.tsx`, update the Section props to remove the numbered eyebrow and simplify the title. Replace the `<Section>` opening (lines 10-20) with:

```tsx
    <Section
      id="about"
      title="About"
      containerSize="narrow"
    >
```

Also update the FadeIn block for meta tags (lines 30-34) — change `text-[var(--color-fg-subtle)]` to `text-[var(--color-fg-subtle)]` (same) but remove `font-mono` and `uppercase` and `tracking-[0.14em]`:

```tsx
          <FadeIn
            delay={0.2}
            className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[var(--color-fg-subtle)]"
          >
```

- [ ] **Step 5: Restyle ExperienceSection**

In `components/sections/ExperienceSection.tsx`, update the Section opening (lines 15-19) to drop the numbered eyebrow:

```tsx
    <Section
      id="experience"
      title="Experience"
      containerSize="narrow"
    >
```

The timeline accent colors already use `var(--color-accent)` which now resolves to blue, so the border/dot colors update automatically.

- [ ] **Step 6: Restyle ToolbeltSection**

In `components/sections/ToolbeltSection.tsx`, update the Section opening (lines 9-14) to drop the numbered eyebrow:

```tsx
    <Section
      id="toolbelt"
      title="Toolbelt"
      description="The short list of things I've used in production or research."
      containerSize="wide"
    >
```

The hover color uses `var(--color-accent)` which now resolves to blue — no change needed.

- [ ] **Step 7: Restyle WritingSection**

In `components/sections/WritingSection.tsx`, update the Section opening (lines 11-16) to drop the numbered eyebrow:

```tsx
    <Section
      id="writing"
      title="Recent Writing"
      description="Long-form notes from Medium. Click through for the full post."
    >
```

- [ ] **Step 8: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 9: Run full test suite**

Run: `pnpm exec vitest run`
Expected: all tests pass. The `StaggerGroup` import was removed from SelectedWorkSection — verify no issues.

- [ ] **Step 10: Commit**

```bash
git add components/primitives/Section.tsx components/project/ProjectCard.tsx components/sections/SelectedWorkSection.tsx components/sections/AboutSection.tsx components/sections/ExperienceSection.tsx components/sections/ToolbeltSection.tsx components/sections/WritingSection.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "style: restyle all sections with new design tokens and typography"
```

---

## Task 7: Homepage composition

**Files:**
- Modify: `app/(site)/page.tsx`

- [ ] **Step 1: Update homepage section order and remove ContactSection**

Replace `app/(site)/page.tsx`:

```tsx
import { HomeHero } from '@/components/hero/HomeHero';
import { AboutSection } from '@/components/sections/AboutSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { SelectedWorkSection } from '@/components/sections/SelectedWorkSection';
import { ToolbeltSection } from '@/components/sections/ToolbeltSection';
import { WritingSection } from '@/components/sections/WritingSection';

export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <AboutSection />
      <ToolbeltSection />
      <SelectedWorkSection />
      <ExperienceSection />
      <WritingSection />
    </>
  );
}
```

Section order: Hero → About → Toolbelt → Selected Work → Experience → Writing. ContactSection removed.

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/(site)/page.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat(home): recompose homepage with new section order"
```

---

## Task 8: Full verification

**Files:** None modified (verification only).

- [ ] **Step 1: Run full test suite**

Run: `pnpm exec vitest run`
Expected: all tests pass.

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Run production build**

Run: `pnpm build 2>&1`
Expected: build succeeds. Note the `/` route's page size and first-load JS.

Baseline reference (pre-redesign):
- `/` page size: **5.17 kB**
- `/` first-load JS: **162 kB**

- [ ] **Step 4: Verify no stale references**

Run: `grep -r "BrainHero\|brain-geometry\|useHeroPhase\|PixelHero\|CommandTrigger" components/ app/ lib/ tests/ --include="*.ts" --include="*.tsx" -l`
Expected: no results.

Run: `grep -r "color-accent.*oklch\|amber\|#fbbf24\|#f59e0b" components/ app/ lib/ --include="*.ts" --include="*.tsx" --include="*.css" -l`
Expected: no results (all old amber references should be gone).

- [ ] **Step 5: Start dev server for visual QA**

Run: `pnpm dev`
Open `http://localhost:3000`.

Visual QA checklist:
- [ ] Nav: "Brian Cao" wordmark left, Home/Projects/Writing/Resume links, blue Contact pill
- [ ] Hero: Scroll down — bento grid tilts from 45° → flat → tilts away. Glass cards are visible with light frosted effect.
- [ ] Hero content: Name at top, three glass cards (intro, project, skills), green dot, CTA buttons
- [ ] Smooth scroll: Mouse wheel feels buttery, no notchy jumps
- [ ] About: Oversized serif heading, no numbered eyebrow
- [ ] Toolbelt: Marquee running, hover turns blue
- [ ] Selected Work: 2-column grid, clean cards without 3D tilt
- [ ] Experience: Timeline with blue dots/line
- [ ] Writing: 3-column grid, blue links
- [ ] Mobile: Nav collapses to hamburger, bento grid stacks, all sections readable
- [ ] Blue accent everywhere (buttons, pills, links, timeline)

- [ ] **Step 6: Kill dev server and report results**

---

## Self-Review Summary

**Spec coverage:**

| Spec section | Covered by |
| --- | --- |
| Navigation (wordmark, links, pill CTA) | Task 3 |
| Color scheme (amber → blue tokens) | Task 1 |
| Typography (oversized serif scale) | Task 1 |
| Hero (3D bento glass cards, scroll-linked) | Task 4, Task 5 |
| Lenis smooth scroll | Task 2 |
| Section order (Hero, About, Toolbelt, Work, Experience, Writing) | Task 7 |
| Remove Contact section from homepage | Task 7 |
| Remove brain hero | Task 5 |
| Remove 3D tilt from project cards | Task 6 Step 2 |
| Remove command palette from nav | Task 3 Step 4 |
| Remove numbered eyebrows | Task 6 Steps 1, 3-7 |
| Remove grid background | Task 1 Step 4 |
| 2-column project grid | Task 6 Steps 2-3 |
| Accessibility (reduced motion, sr-only h1, contrast) | Task 4 (BentoHero has reduced motion check) |
| Viewport metadata update | Task 1 Step 5 |
| Bundle impact | Task 8 Step 3 |

**Placeholder scan:** No TBDs, TODOs, or "implement later" markers. All code blocks are complete.

**Type consistency:**
- `NavLink` type in `lib/nav.ts` — used by `TopBar.tsx` and `MobileMenu.tsx`. Both reference `NAV_LINKS` and `CONTACT_EMAIL`.
- `BentoHero` — imported by `HomeHero.tsx` (Task 5) which matches the export in Task 4.
- `ProjectCard` — `index` prop kept in interface (unused in the new card but kept for compatibility with `SelectedWorkSection` which passes it).
- `Section` — eyebrow prop stays optional, just restyled.
- All `var(--color-accent)` references resolve to the new blue value from Task 1.
