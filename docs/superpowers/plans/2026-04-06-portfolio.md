# Brian Cao Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a dark-tech personal portfolio for Brian Cao with an R3F shader hero, amber warm-tech aesthetic, MDX-driven case studies, and Medium-fed writing — in one week.

**Architecture:** Lean MDX monolith on Next.js 15 App Router. File-based content with Zod-validated frontmatter. Sections are dumb presenters, pages are thin compositions, primitives consume theme tokens. R3F canvas is dynamic-imported behind a static fallback to protect LCP.

**Tech Stack:** Next.js 15 · React 19 · TypeScript strict · Tailwind CSS v4 · MDX · Framer Motion · Lenis · @react-three/fiber · drei · cmdk · Zod · Resend · Vitest · Playwright · Biome · Vercel

**Reference spec:** `docs/superpowers/specs/2026-04-06-portfolio-design.md`

---

## File Structure Overview

```
portfolio/
├─ app/
│  ├─ (site)/
│  │  ├─ layout.tsx              # Site chrome: TopBar, CursorLayer, CommandPalette, footer
│  │  ├─ page.tsx                # Homepage composition
│  │  ├─ projects/
│  │  │  ├─ page.tsx             # Projects index
│  │  │  └─ [slug]/page.tsx      # Case study
│  │  ├─ writing/page.tsx        # Medium posts list
│  │  └─ resume/page.tsx         # Resume PDF viewer
│  ├─ api/
│  │  ├─ contact/route.ts        # Resend proxy
│  │  └─ og/route.tsx            # Dynamic OG images
│  ├─ layout.tsx                 # Root layout: fonts, metadata, analytics
│  ├─ globals.css                # Tailwind v4 @theme + resets
│  ├─ sitemap.ts
│  ├─ robots.ts
│  ├─ manifest.ts
│  ├─ rss.xml/route.ts
│  ├─ icon.tsx                   # Dynamic favicon
│  └─ not-found.tsx
├─ components/
│  ├─ primitives/                # Container, Section, Heading, Text, Button, Pill, Link, Icon
│  ├─ motion/                    # FadeIn, Reveal, StaggerGroup, TextSplit, Magnetic, Marquee, Tilt3D, Parallax, TextScramble
│  ├─ nav/                       # TopBar, MobileMenu, ScrollProgress, CommandPalette
│  ├─ cursor/                    # CursorLayer
│  ├─ hero/                      # HomeHero, HeroStaticFallback, Hero3DCanvas, HeroBlob
│  ├─ sections/                  # About, SelectedWork, Experience, Toolbelt, Writing, Contact
│  ├─ project/                   # ProjectCard, CaseStudyHeader, CaseStudyMeta, CaseStudyGallery, CaseStudyNav
│  ├─ seo/                       # StructuredData
│  └─ mdx/                       # MDXProvider, mdx-components
├─ content/
│  ├─ projects/                  # *.mdx
│  ├─ experience/                # *.mdx
│  └─ site/                      # bio.mdx, toolbelt.json
├─ lib/
│  ├─ schemas/                   # project.ts, experience.ts, writing.ts
│  ├─ content/                   # projects.ts, experience.ts, site.ts
│  ├─ writing/                   # medium.ts
│  ├─ seo/                       # metadata.ts
│  ├─ motion.ts                  # ease/duration/stagger constants
│  ├─ hooks/                     # useReducedMotion, usePointerFine, useIsomorphicLayoutEffect
│  ├─ utils/                     # cn.ts, format.ts
│  └─ commands/                  # registry.ts
├─ public/
│  ├─ fonts/                     # Instrument Serif, Inter, JetBrains Mono (self-hosted)
│  ├─ resume/BrianCao-Resume.pdf
│  └─ projects/                  # cover images
├─ tests/
│  ├─ unit/                      # Vitest
│  └─ e2e/                       # Playwright specs
├─ scripts/
│  └─ build-og-cache.ts          # (optional) prebuild OG assets
├─ .github/workflows/ci.yml
├─ biome.json
├─ next.config.mjs
├─ tailwind.config.ts            # Tailwind v4 is CSS-first; this file minimal
├─ tsconfig.json
├─ vitest.config.ts
├─ playwright.config.ts
├─ package.json
├─ pnpm-lock.yaml
├─ .env.example
├─ .gitignore                    # already created
├─ README.md
├─ ROADMAP.md
└─ LICENSE
```

**Modularity principles (locked in spec):**
- Sections never import other sections
- Primitives never import sections
- Content loaders are the only files that touch the filesystem for MDX
- Pages compose; sections present; primitives render
- Every animated component has a `prefers-reduced-motion` fallback path

---

## Phase 0: Scaffold & Setup

### Task 0.1: Initialize Next.js 15 project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `next-env.d.ts`

- [ ] **Step 1: Run `create-next-app` with the desired flags**

Run from `C:\Users\bcfra\Projects\Portfolio\Portfolio`:
```bash
pnpm dlx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint=false \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --use-pnpm \
  --turbopack \
  --yes
```

If the prompt asks about overwriting the existing `.gitignore`, decline (keep ours). Expected: scaffolded Next.js 15 project with Tailwind v4, app router, TypeScript.

- [ ] **Step 2: Verify dev server boots**

```bash
pnpm dev
```
Expected: `▲ Next.js 15.x.x  - Local: http://localhost:3000`. Stop with Ctrl+C.

- [ ] **Step 3: Confirm tooling versions in `package.json`**

Open `package.json` and verify:
- `"next": "^15"`
- `"react": "^19"`
- `"react-dom": "^19"`
- `"tailwindcss": "^4"`
- `"typescript": "^5"`

If any are on older majors, run `pnpm add next@latest react@latest react-dom@latest tailwindcss@latest typescript@latest`.

- [ ] **Step 4: Commit scaffold**

```bash
git add -A
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "chore: scaffold next.js 15 app with tailwind v4"
```

---

### Task 0.2: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
pnpm add framer-motion@^11 lenis@^1 @react-three/fiber@^9 @react-three/drei@^10 three@^0.169 cmdk@^1 @use-gesture/react@^10 zod@^3 next-mdx-remote@^5 remark-gfm@^4 rehype-slug@^6 rehype-autolink-headings@^7 shiki@^1 gray-matter@^4 reading-time@^1 fast-xml-parser@^4 resend@^4 @vercel/analytics@^1 @vercel/speed-insights@^1 @vercel/og@^0.6 satori@^0.12 clsx@^2 tailwind-merge@^2
```

- [ ] **Step 2: Install dev dependencies**

```bash
pnpm add -D @types/three@^0.169 @biomejs/biome@^1 vitest@^2 @vitest/ui@^2 @testing-library/react@^16 @testing-library/jest-dom@^6 jsdom@^25 @playwright/test@^1 husky@^9 lint-staged@^16 @commitlint/cli@^19 @commitlint/config-conventional@^19 @next/bundle-analyzer@^15
```

- [ ] **Step 3: Install Playwright browsers**

```bash
pnpm dlx playwright install chromium
```
Expected: Chromium downloaded for E2E testing.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "chore: install runtime and dev dependencies"
```

---

### Task 0.3: Configure TypeScript strict mode & path aliases

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Replace `tsconfig.json` with strict configuration**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next", "out", "dist", "build", "playwright-report", "test-results"]
}
```

- [ ] **Step 2: Type-check the scaffold**

```bash
pnpm tsc --noEmit
```
Expected: exit code 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add tsconfig.json
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "chore: enable strict typescript and path alias"
```

---

### Task 0.4: Configure Biome for lint + format

**Files:**
- Create: `biome.json`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Create `biome.json`**

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": { "ignore": [".next", "out", "dist", "node_modules", "coverage", "playwright-report", "test-results", "public"] },
  "organizeImports": { "enabled": true },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "trailingCommas": "all",
      "semicolons": "always",
      "arrowParentheses": "always"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": { "noNonNullAssertion": "warn", "useConst": "error" },
      "suspicious": { "noExplicitAny": "warn" },
      "a11y": { "recommended": true },
      "complexity": { "noForEach": "off" }
    }
  }
}
```

- [ ] **Step 2: Add scripts to `package.json`**

Replace the existing `scripts` block with:
```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "biome check .",
  "lint:fix": "biome check --write .",
  "format": "biome format --write .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "prepare": "husky"
}
```

- [ ] **Step 3: Run lint once**

```bash
pnpm lint
```
Expected: passes on the scaffold, possibly with minor warnings.

- [ ] **Step 4: Commit**

```bash
git add biome.json package.json
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "chore: configure biome for lint and format"
```

---

### Task 0.5: Configure Husky + lint-staged + commitlint

**Files:**
- Create: `.husky/pre-commit`, `.husky/commit-msg`, `commitlint.config.mjs`, `.lintstagedrc.json`

- [ ] **Step 1: Initialize Husky**

```bash
pnpm exec husky init
```
Expected: creates `.husky/pre-commit` with a default `pnpm test` line.

- [ ] **Step 2: Replace `.husky/pre-commit` contents**

```bash
pnpm exec lint-staged
```

- [ ] **Step 3: Create `.husky/commit-msg`**

```bash
pnpm exec commitlint --edit $1
```

Make it executable (git bash on Windows ignores chmod, but run anyway):
```bash
chmod +x .husky/pre-commit .husky/commit-msg
```

- [ ] **Step 4: Create `.lintstagedrc.json`**

```json
{
  "*.{ts,tsx,js,jsx,json,css,md}": ["biome check --write --no-errors-on-unmatched"]
}
```

- [ ] **Step 5: Create `commitlint.config.mjs`**

```js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'build', 'revert'],
    ],
  },
};
```

- [ ] **Step 6: Commit**

```bash
git add .husky .lintstagedrc.json commitlint.config.mjs package.json
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "chore: add husky pre-commit and commitlint"
```

---

### Task 0.6: Configure Next.js MDX + bundle analyzer + security headers

**Files:**
- Modify: `next.config.mjs`

- [ ] **Step 1: Replace `next.config.mjs`**

```js
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['framer-motion', '@react-three/drei', 'cmdk'],
    mdxRs: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn-images-1.medium.com' },
      { protocol: 'https', hostname: 'miro.medium.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
```

- [ ] **Step 2: Verify build succeeds**

```bash
pnpm build
```
Expected: Next.js builds successfully (may warn about unused deps, ignore for now).

- [ ] **Step 3: Commit**

```bash
git add next.config.mjs
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "chore: configure next.js headers and mdx support"
```

---

### Task 0.7: Set up Vitest

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`, `tests/unit/smoke.test.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    css: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

- [ ] **Step 2: Create `tests/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 3: Create `tests/unit/smoke.test.ts` to verify wiring**

```ts
import { describe, expect, it } from 'vitest';

describe('vitest smoke', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 4: Run the smoke test**

```bash
pnpm test
```
Expected: 1 passing test.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts tests/setup.ts tests/unit/smoke.test.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "test: configure vitest with jsdom and smoke test"
```

---

### Task 0.8: Set up Playwright

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'pnpm build && pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
```

- [ ] **Step 2: Create `tests/e2e/smoke.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/./);
});
```

- [ ] **Step 3: Commit (tests will run in CI later)**

```bash
git add playwright.config.ts tests/e2e/smoke.spec.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "test: configure playwright with smoke e2e"
```

---

### Task 0.9: Environment variables scaffolding

**Files:**
- Create: `.env.example`, `lib/env.ts`

- [ ] **Step 1: Create `.env.example`**

```
# Public
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MEDIUM_FEED=https://medium.com/feed/@brianc40722

# Server-only
RESEND_API_KEY=
CONTACT_TO_EMAIL=brianc40722@gmail.com
CONTACT_FROM_EMAIL=hello@briancao.dev
```

- [ ] **Step 2: Create `lib/env.ts` with Zod validation**

```ts
import { z } from 'zod';

const serverSchema = z.object({
  RESEND_API_KEY: z.string().optional(),
  CONTACT_TO_EMAIL: z.string().email().default('brianc40722@gmail.com'),
  CONTACT_FROM_EMAIL: z.string().email().default('hello@briancao.dev'),
});

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_MEDIUM_FEED: z.string().url().default('https://medium.com/feed/@brianc40722'),
});

export const serverEnv = serverSchema.parse({
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
});

export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_MEDIUM_FEED: process.env.NEXT_PUBLIC_MEDIUM_FEED,
});
```

- [ ] **Step 3: Write test `tests/unit/env.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { publicEnv } from '@/lib/env';

describe('publicEnv', () => {
  it('provides defaults', () => {
    expect(publicEnv.NEXT_PUBLIC_SITE_URL).toMatch(/^https?:\/\//);
    expect(publicEnv.NEXT_PUBLIC_MEDIUM_FEED).toContain('medium.com');
  });
});
```

- [ ] **Step 4: Run tests**

```bash
pnpm test
```
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add .env.example lib/env.ts tests/unit/env.test.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "chore: add env validation with zod"
```

---

## Phase 1: Design Tokens & Global Styles

### Task 1.1: Self-host fonts

**Files:**
- Create: `public/fonts/` (placeholders), `app/fonts.ts`

- [ ] **Step 1: Download font files**

Download these fonts and place them in `public/fonts/`:
- Instrument Serif: https://fonts.google.com/specimen/Instrument+Serif → download `InstrumentSerif-Regular.ttf` and `InstrumentSerif-Italic.ttf`
- Inter (variable): https://fonts.google.com/specimen/Inter → download `Inter-VariableFont.ttf`
- JetBrains Mono: https://fonts.google.com/specimen/JetBrains+Mono → download `JetBrainsMono-VariableFont.ttf`

Convert TTFs to WOFF2 at https://transfonts.com/ or via `fonttools` (`pyftsubset`). Target filenames:
- `public/fonts/InstrumentSerif-Regular.woff2`
- `public/fonts/InstrumentSerif-Italic.woff2`
- `public/fonts/Inter-Variable.woff2`
- `public/fonts/JetBrainsMono-Variable.woff2`

- [ ] **Step 2: Create `app/fonts.ts`**

```ts
import localFont from 'next/font/local';

export const fontSerif = localFont({
  src: [
    { path: '../public/fonts/InstrumentSerif-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/InstrumentSerif-Italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'ui-serif', 'serif'],
});

export const fontSans = localFont({
  src: '../public/fonts/Inter-Variable.woff2',
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

export const fontMono = localFont({
  src: '../public/fonts/JetBrainsMono-Variable.woff2',
  variable: '--font-mono',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'monospace'],
});
```

- [ ] **Step 3: Commit**

```bash
git add public/fonts app/fonts.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: self-host display and body fonts"
```

---

### Task 1.2: Tailwind v4 @theme tokens in `globals.css`

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `app/globals.css` entirely**

```css
@import 'tailwindcss';

@theme {
  /* Color tokens — oklch for perceptual uniformity */
  --color-bg: oklch(0.16 0.01 60);
  --color-bg-elevated: oklch(0.20 0.012 60);
  --color-bg-inset: oklch(0.13 0.009 60);
  --color-fg: oklch(0.97 0.005 80);
  --color-fg-muted: oklch(0.72 0.015 70);
  --color-fg-subtle: oklch(0.55 0.013 70);
  --color-border: oklch(0.26 0.01 60 / 0.6);
  --color-border-strong: oklch(0.32 0.012 60);
  --color-accent: oklch(0.78 0.16 75);
  --color-accent-hi: oklch(0.85 0.17 80);
  --color-accent-lo: oklch(0.62 0.13 70);
  --color-accent-glow: oklch(0.78 0.16 75 / 0.35);

  /* Radii */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;

  /* Typography families (wired from next/font variables) */
  --font-family-serif: var(--font-serif), Georgia, ui-serif, serif;
  --font-family-sans: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
  --font-family-mono: var(--font-mono), ui-monospace, SFMono-Regular, monospace;

  /* Fluid type scale (clamped for modern browsers) */
  --text-display: clamp(3rem, 2rem + 5vw, 6.5rem);
  --text-h1: clamp(2.25rem, 1.6rem + 3.2vw, 4rem);
  --text-h2: clamp(1.75rem, 1.3rem + 2vw, 2.75rem);
  --text-h3: clamp(1.25rem, 1rem + 1.2vw, 1.75rem);
  --text-body: 1rem;
  --text-small: 0.875rem;
  --text-micro: 0.75rem;

  /* Shadows */
  --shadow-glow: 0 0 40px -8px var(--color-accent-glow);
  --shadow-card: 0 1px 0 0 oklch(1 0 0 / 0.04) inset, 0 20px 60px -30px oklch(0 0 0 / 0.6);
}

:root {
  color-scheme: dark;
}

html, body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-family-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  min-height: 100dvh;
  overflow-x: hidden;
}

::selection {
  background: var(--color-accent);
  color: var(--color-bg);
}

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: 2px;
}

/* Global reduced-motion override */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Utility: hide native cursor when custom cursor is active */
.cursor-none,
.cursor-none * {
  cursor: none !important;
}

/* Grid background helper (used by Hero, Sections) */
.bg-grid {
  background-image:
    linear-gradient(to right, var(--color-border) 1px, transparent 1px),
    linear-gradient(to bottom, var(--color-border) 1px, transparent 1px);
  background-size: 32px 32px;
}
```

- [ ] **Step 2: Verify the build picks up the theme**

```bash
pnpm dev
```
Visit http://localhost:3000 — should see a dark background. Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: define design tokens and global styles"
```

---

### Task 1.3: Wire fonts and metadata in root `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace `app/layout.tsx`**

```tsx
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { fontMono, fontSans, fontSerif } from '@/app/fonts';
import { publicEnv } from '@/lib/env';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: 'Brian Cao — Full-stack engineer',
    template: '%s · Brian Cao',
  },
  description:
    'Brian Cao is a full-stack engineer and Stony Brook CS honors student building systems at the edge of software and AI.',
  authors: [{ name: 'Brian Cao', url: 'https://github.com/BrianASC23' }],
  creator: 'Brian Cao',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: publicEnv.NEXT_PUBLIC_SITE_URL,
    siteName: 'Brian Cao',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0b0a08',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontSerif.variable} ${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify typecheck**

```bash
pnpm typecheck
```
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: wire fonts, metadata, and analytics in root layout"
```

---

### Task 1.4: Motion constants in `lib/motion.ts`

**Files:**
- Create: `lib/motion.ts`, `tests/unit/motion.test.ts`

- [ ] **Step 1: Write failing test `tests/unit/motion.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { duration, ease, stagger } from '@/lib/motion';

describe('motion constants', () => {
  it('exports a four-stop ease curve', () => {
    expect(ease.out).toHaveLength(4);
  });

  it('exports duration keys', () => {
    expect(duration.base).toBeGreaterThan(0);
    expect(duration.slow).toBeGreaterThan(duration.base);
  });

  it('exports stagger keys', () => {
    expect(stagger.base).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test (expect failure)**

```bash
pnpm test motion
```
Expected: FAIL — module not found.

- [ ] **Step 3: Create `lib/motion.ts`**

```ts
export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  back: [0.34, 1.56, 0.64, 1] as const,
} as const;

export const duration = {
  fast: 0.2,
  base: 0.4,
  slow: 0.8,
  reveal: 1.2,
} as const;

export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
} as const;

export type MotionEase = (typeof ease)[keyof typeof ease];
```

- [ ] **Step 4: Run test (expect pass)**

```bash
pnpm test motion
```
Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add lib/motion.ts tests/unit/motion.test.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add motion constants"
```

---

### Task 1.5: `cn` utility

**Files:**
- Create: `lib/utils/cn.ts`, `tests/unit/cn.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils/cn';

describe('cn', () => {
  it('merges tailwind classes', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles falsy values', () => {
    expect(cn('a', false && 'b', null, 'c')).toBe('a c');
  });
});
```

- [ ] **Step 2: Run test (expect failure)**

```bash
pnpm test cn
```

- [ ] **Step 3: Create `lib/utils/cn.ts`**

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Run test**

```bash
pnpm test cn
```
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add lib/utils/cn.ts tests/unit/cn.test.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add cn class-name utility"
```

---

### Task 1.6: Format helpers

**Files:**
- Create: `lib/utils/format.ts`, `tests/unit/format.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it } from 'vitest';
import { formatDate, truncate } from '@/lib/utils/format';

describe('formatDate', () => {
  it('formats ISO dates as "Mon YYYY"', () => {
    expect(formatDate('2026-04-06')).toBe('Apr 2026');
  });
});

describe('truncate', () => {
  it('truncates with ellipsis', () => {
    expect(truncate('hello world this is long', 11)).toBe('hello world…');
  });

  it('leaves short strings alone', () => {
    expect(truncate('hi', 10)).toBe('hi');
  });
});
```

- [ ] **Step 2: Run (expect fail)**

```bash
pnpm test format
```

- [ ] **Step 3: Create `lib/utils/format.ts`**

```ts
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  return `${input.slice(0, max).trimEnd()}…`;
}
```

- [ ] **Step 4: Run (expect pass)**

```bash
pnpm test format
```
Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add lib/utils/format.ts tests/unit/format.test.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add format helpers"
```

---

### Task 1.7: `useReducedMotion` and `usePointerFine` hooks

**Files:**
- Create: `lib/hooks/useReducedMotion.ts`, `lib/hooks/usePointerFine.ts`, `lib/hooks/useIsomorphicLayoutEffect.ts`, `tests/unit/hooks.test.tsx`

- [ ] **Step 1: Write failing test `tests/unit/hooks.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

function Probe() {
  const reduced = useReducedMotion();
  return <span>{reduced ? 'reduced' : 'motion'}</span>;
}

describe('useReducedMotion', () => {
  it('returns false when media query does not match', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    render(<Probe />);
    expect(screen.getByText('motion')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run (expect fail)**

```bash
pnpm test hooks
```

- [ ] **Step 3: Create `lib/hooks/useIsomorphicLayoutEffect.ts`**

```ts
import { useEffect, useLayoutEffect } from 'react';

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
```

- [ ] **Step 4: Create `lib/hooks/useReducedMotion.ts`**

```ts
'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return reduced;
}
```

- [ ] **Step 5: Create `lib/hooks/usePointerFine.ts`**

```ts
'use client';

import { useEffect, useState } from 'react';

export function usePointerFine(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)');
    const update = () => setFine(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return fine;
}
```

- [ ] **Step 6: Run tests**

```bash
pnpm test hooks
```
Expected: 1 passing.

- [ ] **Step 7: Commit**

```bash
git add lib/hooks tests/unit/hooks.test.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add reduced-motion, pointer, and layout effect hooks"
```

---

## Phase 2: Primitive Components

### Task 2.1: `Container`

**Files:**
- Create: `components/primitives/Container.tsx`, `tests/unit/Container.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container } from '@/components/primitives/Container';

describe('Container', () => {
  it('renders children with default size', () => {
    render(<Container>hello</Container>);
    const el = screen.getByText('hello');
    expect(el.className).toContain('max-w-6xl');
  });

  it('supports narrow size', () => {
    render(<Container size="narrow">narrow</Container>);
    expect(screen.getByText('narrow').className).toContain('max-w-3xl');
  });
});
```

- [ ] **Step 2: Run (expect fail)**

```bash
pnpm test Container
```

- [ ] **Step 3: Create `components/primitives/Container.tsx`**

```tsx
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type ContainerSize = 'narrow' | 'default' | 'wide' | 'bleed';

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: ContainerSize;
  children: ReactNode;
}

const sizeClasses: Record<ContainerSize, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
  bleed: 'max-w-none',
};

export function Container({
  as: Tag = 'div',
  size = 'default',
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={cn('mx-auto w-full px-6 md:px-8 lg:px-12', sizeClasses[size], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 4: Run (expect pass)**

```bash
pnpm test Container
```
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add components/primitives/Container.tsx tests/unit/Container.test.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add Container primitive"
```

---

### Task 2.2: `Section`

**Files:**
- Create: `components/primitives/Section.tsx`, `tests/unit/Section.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Section } from '@/components/primitives/Section';

describe('Section', () => {
  it('renders a section with id', () => {
    render(
      <Section id="about" eyebrow="01 · About">
        <p>body</p>
      </Section>,
    );
    expect(screen.getByRole('region', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText('01 · About')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run (expect fail)**

```bash
pnpm test Section
```

- [ ] **Step 3: Create `components/primitives/Section.tsx`**

```tsx
import type { ReactNode } from 'react';
import { Container } from './Container';
import { cn } from '@/lib/utils/cn';

interface SectionProps {
  id: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  containerSize?: 'narrow' | 'default' | 'wide' | 'bleed';
  ariaLabel?: string;
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  containerSize = 'default',
  ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel ?? eyebrow ?? id}
      role="region"
      className={cn('relative py-24 md:py-32', className)}
    >
      <Container size={containerSize}>
        {(eyebrow || title || description) && (
          <header className="mb-12 md:mb-16">
            {eyebrow && (
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-3 font-serif text-[length:var(--text-h2)] leading-[1.05] tracking-tight text-[var(--color-fg)]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 max-w-2xl text-[var(--color-fg-muted)]">{description}</p>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Run test**

```bash
pnpm test Section
```
Expected: passing.

- [ ] **Step 5: Commit**

```bash
git add components/primitives/Section.tsx tests/unit/Section.test.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add Section primitive"
```

---

### Task 2.3: `Heading` and `Text`

**Files:**
- Create: `components/primitives/Heading.tsx`, `components/primitives/Text.tsx`, `tests/unit/Heading.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Heading } from '@/components/primitives/Heading';
import { Text } from '@/components/primitives/Text';

describe('Heading', () => {
  it('renders as h1 by default', () => {
    render(<Heading>Title</Heading>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('accepts level override', () => {
    render(<Heading level={3}>Sub</Heading>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });
});

describe('Text', () => {
  it('renders muted variant', () => {
    render(<Text tone="muted">hi</Text>);
    expect(screen.getByText('hi').className).toContain('text-[var(--color-fg-muted)]');
  });
});
```

- [ ] **Step 2: Run (expect fail)**

```bash
pnpm test Heading
```

- [ ] **Step 3: Create `components/primitives/Heading.tsx`**

```tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Level = 1 | 2 | 3 | 4;

interface HeadingProps {
  level?: Level;
  children: ReactNode;
  className?: string;
  display?: boolean;
  id?: string;
}

const levelClasses: Record<Level, string> = {
  1: 'text-[length:var(--text-h1)] leading-[1.05]',
  2: 'text-[length:var(--text-h2)] leading-[1.1]',
  3: 'text-[length:var(--text-h3)] leading-[1.15]',
  4: 'text-xl leading-snug',
};

export function Heading({ level = 1, children, className, display, id }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      id={id}
      className={cn(
        display ? 'font-serif tracking-tight' : 'font-sans font-semibold tracking-tight',
        'text-[var(--color-fg)]',
        levelClasses[level],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 4: Create `components/primitives/Text.tsx`**

```tsx
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Tone = 'default' | 'muted' | 'subtle' | 'accent';
type Size = 'body' | 'small' | 'micro' | 'lead';

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  tone?: Tone;
  size?: Size;
  mono?: boolean;
  children: ReactNode;
}

const toneClasses: Record<Tone, string> = {
  default: 'text-[var(--color-fg)]',
  muted: 'text-[var(--color-fg-muted)]',
  subtle: 'text-[var(--color-fg-subtle)]',
  accent: 'text-[var(--color-accent)]',
};

const sizeClasses: Record<Size, string> = {
  body: 'text-base leading-relaxed',
  small: 'text-sm leading-relaxed',
  micro: 'text-xs leading-normal',
  lead: 'text-lg md:text-xl leading-relaxed',
};

export function Text({
  as: Tag = 'p',
  tone = 'default',
  size = 'body',
  mono = false,
  className,
  children,
  ...rest
}: TextProps) {
  return (
    <Tag
      className={cn(
        toneClasses[tone],
        sizeClasses[size],
        mono ? 'font-mono' : 'font-sans',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 5: Run tests**

```bash
pnpm test Heading
```
Expected: 3 passing.

- [ ] **Step 6: Commit**

```bash
git add components/primitives/Heading.tsx components/primitives/Text.tsx tests/unit/Heading.test.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add Heading and Text primitives"
```

---

### Task 2.4: `Button` and `Pill`

**Files:**
- Create: `components/primitives/Button.tsx`, `components/primitives/Pill.tsx`, `tests/unit/Button.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '@/components/primitives/Button';
import { Pill } from '@/components/primitives/Pill';

describe('Button', () => {
  it('renders as button by default', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
  });

  it('renders as anchor when href provided', () => {
    render(<Button href="/about">About</Button>);
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });
});

describe('Pill', () => {
  it('renders label', () => {
    render(<Pill>Next.js</Pill>);
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run (expect fail)**

```bash
pnpm test Button
```

- [ ] **Step 3: Create `components/primitives/Button.tsx`**

```tsx
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent-hi)] shadow-[var(--shadow-glow)]',
  secondary:
    'bg-[var(--color-bg-elevated)] text-[var(--color-fg)] border border-[var(--color-border)] hover:border-[var(--color-accent)]',
  ghost: 'text-[var(--color-fg)] hover:text-[var(--color-accent)]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:pointer-events-none disabled:opacity-50';

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children, icon, ...rest } = props;
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if ('href' in rest && rest.href) {
    const { href, ...anchorRest } = rest;
    const external = href.startsWith('http');
    return (
      <Link
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...anchorRest}
      >
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
      {icon}
    </button>
  );
}
```

- [ ] **Step 4: Create `components/primitives/Pill.tsx`**

```tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface PillProps {
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'accent';
}

export function Pill({ children, className, tone = 'default' }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em]',
        tone === 'accent'
          ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
          : 'border-[var(--color-border)] text-[var(--color-fg-muted)]',
        className,
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 5: Run tests**

```bash
pnpm test Button
```
Expected: 3 passing.

- [ ] **Step 6: Commit**

```bash
git add components/primitives/Button.tsx components/primitives/Pill.tsx tests/unit/Button.test.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add Button and Pill primitives"
```

---

### Task 2.5: `Link` wrapper and `Icon` helper

**Files:**
- Create: `components/primitives/Link.tsx`, `components/primitives/Icon.tsx`

- [ ] **Step 1: Create `components/primitives/Link.tsx`**

```tsx
import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface AppLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps>,
    NextLinkProps {
  children: ReactNode;
  underline?: boolean;
}

export function AppLink({ children, className, underline = true, href, ...rest }: AppLinkProps) {
  const external = typeof href === 'string' && /^https?:/.test(href);
  return (
    <NextLink
      href={href}
      className={cn(
        'text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent)]',
        underline &&
          'underline decoration-[var(--color-border-strong)] decoration-1 underline-offset-4 hover:decoration-[var(--color-accent)]',
        className,
      )}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </NextLink>
  );
}
```

- [ ] **Step 2: Create `components/primitives/Icon.tsx`**

```tsx
import type { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  label?: string;
}

export function Icon({ label, children, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const icons = {
  arrowRight: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
  arrowUpRight: (
    <>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </>
  ),
  github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  mail: (
    <>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </>
  ),
  command: <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />,
} as const;
```

- [ ] **Step 3: Commit**

```bash
git add components/primitives/Link.tsx components/primitives/Icon.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add Link and Icon primitives"
```

---

## Phase 3: Motion Primitives

### Task 3.1: `FadeIn` and `Reveal` client components

**Files:**
- Create: `components/motion/FadeIn.tsx`, `components/motion/Reveal.tsx`

- [ ] **Step 1: Create `components/motion/FadeIn.tsx`**

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { duration, ease } from '@/lib/motion';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'section' | 'article';
}

export function FadeIn({ children, delay = 0, y = 16, className, as = 'div' }: FadeInProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: duration.base, ease: ease.out, delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
```

- [ ] **Step 2: Create `components/motion/Reveal.tsx`**

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { duration, ease } from '@/lib/motion';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Vertical mask reveal — text slides up from behind a clipping mask.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={`inline-block overflow-hidden align-bottom ${className ?? ''}`}>
      <motion.span
        className="inline-block"
        initial={{ y: '100%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: duration.slow, ease: ease.out, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/motion/FadeIn.tsx components/motion/Reveal.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add FadeIn and Reveal motion primitives"
```

---

### Task 3.2: `StaggerGroup` and `TextSplit`

**Files:**
- Create: `components/motion/StaggerGroup.tsx`, `components/motion/TextSplit.tsx`

- [ ] **Step 1: Create `components/motion/StaggerGroup.tsx`**

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Children, type ReactNode, isValidElement } from 'react';
import { duration, ease, stagger } from '@/lib/motion';

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  gap?: keyof typeof stagger;
  delay?: number;
  y?: number;
}

export function StaggerGroup({
  children,
  className,
  gap = 'base',
  delay = 0,
  y = 16,
}: StaggerGroupProps) {
  const reduced = useReducedMotion();
  const items = Children.toArray(children).filter(isValidElement);

  if (reduced) {
    return <div className={className}>{items}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger[gap], delayChildren: delay },
        },
      }}
    >
      {items.map((child, i) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: positional animation
          key={i}
          variants={{
            hidden: { opacity: 0, y },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: duration.base, ease: ease.out },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create `components/motion/TextSplit.tsx`**

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { duration, ease, stagger } from '@/lib/motion';

interface TextSplitProps {
  text: string;
  className?: string;
  delay?: number;
  by?: 'word' | 'char';
}

export function TextSplit({ text, className, delay = 0, by = 'word' }: TextSplitProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  const units = by === 'word' ? text.split(/(\s+)/) : text.split('');

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger.tight, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {units.map((unit, i) =>
        unit.match(/^\s+$/) ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: space preservation
          <span key={i} aria-hidden="true">
            {unit}
          </span>
        ) : (
          <motion.span
            // biome-ignore lint/suspicious/noArrayIndexKey: positional animation
            key={i}
            className="inline-block"
            aria-hidden="true"
            variants={{
              hidden: { opacity: 0, y: '0.4em' },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: duration.slow, ease: ease.out },
              },
            }}
          >
            {unit}
          </motion.span>
        ),
      )}
    </motion.span>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/motion/StaggerGroup.tsx components/motion/TextSplit.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add StaggerGroup and TextSplit motion primitives"
```

---

### Task 3.3: `Magnetic` and `Tilt3D`

**Files:**
- Create: `components/motion/Magnetic.tsx`, `components/motion/Tilt3D.tsx`

- [ ] **Step 1: Create `components/motion/Magnetic.tsx`**

```tsx
'use client';

import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { type PointerEvent, type ReactNode, useRef } from 'react';

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function Magnetic({ children, strength = 0.25, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(dx);
    y.set(dy);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create `components/motion/Tilt3D.tsx`**

```tsx
'use client';

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { type PointerEvent, type ReactNode, useRef } from 'react';

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  max?: number;
}

export function Tilt3D({ children, className, max = 8 }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 180, damping: 18 });
  const sy = useSpring(my, { stiffness: 180, damping: 18 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/motion/Magnetic.tsx components/motion/Tilt3D.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add Magnetic and Tilt3D motion primitives"
```

---

### Task 3.4: `Marquee`, `Parallax`, and `TextScramble`

**Files:**
- Create: `components/motion/Marquee.tsx`, `components/motion/Parallax.tsx`, `components/motion/TextScramble.tsx`

- [ ] **Step 1: Create `components/motion/Marquee.tsx`**

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}

export function Marquee({ children, speed = 40, reverse = false, className }: MarqueeProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        <div className="flex shrink-0 items-center gap-12">{children}</div>
        <div className="flex shrink-0 items-center gap-12" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Create `components/motion/Parallax.tsx`**

```tsx
'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { type ReactNode, useRef } from 'react';

interface ParallaxProps {
  children: ReactNode;
  offset?: number;
  className?: string;
}

export function Parallax({ children, offset = 60, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Create `components/motion/TextScramble.tsx`**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

interface TextScrambleProps {
  text: string;
  trigger?: 'mount' | 'hover';
  className?: string;
}

export function TextScramble({ text, trigger = 'mount', className }: TextScrambleProps) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef(0);
  const reduced = useReducedMotion();

  const scramble = () => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
    const old = display;
    const len = Math.max(old.length, text.length);
    for (let i = 0; i < len; i++) {
      const from = old[i] ?? '';
      const to = text[i] ?? '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from, to, start, end });
    }
    let frame = 0;
    const update = () => {
      let output = '';
      let complete = 0;
      for (const item of queue) {
        const { from, to, start, end } = item;
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!item.char || Math.random() < 0.28) {
            item.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          output += item.char;
        } else {
          output += from;
        }
      }
      setDisplay(output);
      if (complete < queue.length) {
        frame++;
        frameRef.current = requestAnimationFrame(update);
      }
    };
    cancelAnimationFrame(frameRef.current);
    update();
  };

  useEffect(() => {
    if (trigger === 'mount') scramble();
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span
      className={className}
      onMouseEnter={trigger === 'hover' ? scramble : undefined}
      aria-label={text}
    >
      {display}
    </span>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/motion/Marquee.tsx components/motion/Parallax.tsx components/motion/TextScramble.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add Marquee, Parallax, and TextScramble motion primitives"
```

---

## Phase 4: Content Layer

### Task 4.1: Zod schemas

**Files:**
- Create: `lib/schemas/project.ts`, `lib/schemas/experience.ts`, `lib/schemas/writing.ts`, `tests/unit/schemas.test.ts`

- [ ] **Step 1: Write failing test `tests/unit/schemas.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { projectSchema } from '@/lib/schemas/project';
import { experienceSchema } from '@/lib/schemas/experience';

describe('projectSchema', () => {
  it('parses a minimal valid project', () => {
    const result = projectSchema.parse({
      slug: 'advising-bot',
      title: 'Advising Bot',
      tagline: 'RAG chatbot for Stony Brook advisement',
      summary: 'A retrieval-augmented agent over the full course bulletin.',
      role: 'Solo builder',
      timeframe: '2025 – present',
      status: 'in-progress',
      stack: ['Python', 'LangGraph'],
      tags: ['ai-ml'],
      cover: { src: '/projects/advising-bot/cover.jpg', alt: 'cover' },
    });
    expect(result.slug).toBe('advising-bot');
    expect(result.featured).toBe(false);
  });

  it('rejects invalid tag enum', () => {
    expect(() =>
      projectSchema.parse({
        slug: 'bad',
        title: 'Bad',
        tagline: 't',
        summary: 's',
        role: 'r',
        timeframe: 'tf',
        status: 'shipped',
        stack: [],
        tags: ['not-a-tag'],
        cover: { src: '/x', alt: 'x' },
      }),
    ).toThrow();
  });
});

describe('experienceSchema', () => {
  it('parses a minimal valid experience', () => {
    const result = experienceSchema.parse({
      slug: 'pulp-2025',
      company: 'Pulp Corporation',
      role: 'SWE Intern',
      start: '2025-01',
      end: '2025-08',
      bullets: ['Shipped X.'],
      stack: ['Next.js', 'Neo4j'],
    });
    expect(result.company).toBe('Pulp Corporation');
  });
});
```

- [ ] **Step 2: Run (expect fail)**

```bash
pnpm test schemas
```

- [ ] **Step 3: Create `lib/schemas/project.ts`**

```ts
import { z } from 'zod';

export const projectTag = z.enum([
  'full-stack',
  'frontend',
  'backend',
  'ai-ml',
  'systems',
  'devtools',
  'data',
]);

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  tagline: z.string().min(1).max(140),
  summary: z.string().min(1).max(320),
  role: z.string().min(1),
  timeframe: z.string().min(1),
  status: z.enum(['shipped', 'in-progress', 'archived']),
  featured: z.boolean().default(false),
  order: z.number().int().default(999),
  stack: z.array(z.string()),
  tags: z.array(projectTag),
  links: z
    .object({
      github: z.string().url().optional(),
      live: z.string().url().optional(),
      demo: z.string().url().optional(),
      paper: z.string().url().optional(),
    })
    .default({}),
  cover: z.object({
    src: z.string().min(1),
    alt: z.string().min(1),
    video: z.string().optional(),
  }),
  gallery: z
    .array(
      z.object({
        src: z.string().min(1),
        alt: z.string().min(1),
        caption: z.string().optional(),
      }),
    )
    .default([]),
  metrics: z
    .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
    .default([]),
  accentColor: z.string().optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .default({}),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectFrontmatter = z.input<typeof projectSchema>;
```

- [ ] **Step 4: Create `lib/schemas/experience.ts`**

```ts
import { z } from 'zod';

export const experienceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional(),
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z.union([z.string().regex(/^\d{4}-\d{2}$/), z.literal('present')]),
  bullets: z.array(z.string().min(1)).min(1),
  stack: z.array(z.string()).default([]),
  link: z.string().url().optional(),
});

export type Experience = z.infer<typeof experienceSchema>;
```

- [ ] **Step 5: Create `lib/schemas/writing.ts`**

```ts
import { z } from 'zod';

export const writingPostSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  publishedAt: z.string().min(1),
  link: z.string().url(),
  thumbnail: z.string().url().optional(),
  readingTime: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type WritingPost = z.infer<typeof writingPostSchema>;
```

- [ ] **Step 6: Run tests**

```bash
pnpm test schemas
```
Expected: 3 passing.

- [ ] **Step 7: Commit**

```bash
git add lib/schemas tests/unit/schemas.test.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add zod schemas for project, experience, writing"
```

---

### Task 4.2: Seed MDX content

**Files:**
- Create: `content/projects/advising-bot.mdx`, `content/projects/financial-sentiment.mdx`, `content/projects/playlister.mdx`, `content/projects/fuzzer.mdx`, `content/projects/custom-heap.mdx`, `content/experience/sbu-cs-ops.mdx`, `content/experience/pulp.mdx`, `content/experience/sbu-web.mdx`, `content/experience/sbu-ra.mdx`, `content/site/bio.mdx`, `content/site/toolbelt.json`

- [ ] **Step 1: Create `content/site/bio.mdx`**

```mdx
---
name: Brian Cao
role: Full-stack engineer
location: New York
school: Stony Brook University — CS Honors, Class of 2027
---

I'm a builder who enjoys turning complex ideas into systems that are clear, useful, and
meaningful — especially across software, AI, and real-world problems. Outside of that I slow
things down through journaling, cooking, reading, and time in nature, which keeps my thinking
grounded. I care about creating things that not only work well, but actually matter.
```

- [ ] **Step 2: Create `content/site/toolbelt.json`**

```json
{
  "languages": ["TypeScript", "Python", "C/C++", "Java", "SQL", "OCaml", "R"],
  "frontend": ["Next.js 15", "React 19", "Tailwind v4", "Framer Motion", "R3F"],
  "backend": ["Node.js", "Flask", "PostgreSQL", "Neo4j", "AWS"],
  "aiml": ["PyTorch", "Hugging Face", "LangGraph", "Pinecone"],
  "tools": ["Git", "Biome", "Vitest", "Playwright", "Vercel"]
}
```

- [ ] **Step 3: Create `content/projects/advising-bot.mdx`**

```mdx
---
slug: advising-bot
title: Advising Bot
tagline: A RAG agent that replaces your Stony Brook academic advisor
summary: >-
  A retrieval-augmented chatbot built on LangGraph and Pinecone that ingests the entire Stony Brook course bulletin and answers degree planning, prerequisite, and scheduling questions with source-grounded citations.
role: Solo builder
timeframe: 2025 – present
status: in-progress
featured: true
order: 1
stack: [Python, LangGraph, Pinecone, OpenAI, FastAPI, Next.js]
tags: [ai-ml, backend]
links:
  github: https://github.com/BrianASC23/advising-bot
cover:
  src: /projects/advising-bot/cover.jpg
  alt: Advising Bot chat interface
metrics:
  - { label: Bulletin pages indexed, value: 2,400+ }
  - { label: Mean answer latency, value: "<1.8s" }
  - { label: Retrieval recall@5, value: 92% }
---

## The problem

Stony Brook's course bulletin is 2,400+ pages of prerequisites, degree plans, upper-division
requirements, and corner cases. Academic advising appointments have a ~3 week wait time.
Students need answers in minutes, not weeks.

## What I built

An end-to-end RAG agent stack:

- **Ingestion.** Scrapes the public bulletin into structured Markdown with section-anchored
  metadata (department, course number, level).
- **Retrieval.** Pinecone namespaces per department + HyDE query rewriting.
- **Planning.** A LangGraph orchestrator with a planner → retriever → verifier → answer loop.
- **Grounding.** Every answer surfaces the exact bulletin section it cites.

## Why it matters

Beyond the GPA-math tricks, this is the clearest expression of what I want to do: take an
unstructured, high-stakes domain and turn it into a system that a real person would actually
trust with a real decision.
```

- [ ] **Step 4: Create `content/projects/financial-sentiment.mdx`**

```mdx
---
slug: financial-sentiment
title: Financial News Sentiment RNN
tagline: PyTorch RNN that predicts next-day stock direction from headline sentiment
summary: >-
  An end-to-end pipeline that scrapes financial headlines, fine-tunes an LSTM sentiment classifier, and backtests a long/short strategy against historical S&P 500 prices.
role: Research project
timeframe: 2024
status: shipped
featured: true
order: 2
stack: [Python, PyTorch, Pandas, Hugging Face, Jupyter]
tags: [ai-ml, data]
links:
  github: https://github.com/BrianASC23/financial-sentiment
cover:
  src: /projects/financial-sentiment/cover.jpg
  alt: Sentiment classification confusion matrix
metrics:
  - { label: Test accuracy, value: 81% }
  - { label: Headlines scraped, value: 50k+ }
  - { label: Sharpe (backtest), value: 1.3 }
---

## Pipeline

1. Scraper collects 50k+ headlines tagged with ticker symbols.
2. Tokenizer + embedding layer feeds an LSTM classifier fine-tuned on FinBERT-labeled data.
3. Daily sentiment score joins to historical OHLC data for backtesting.

## What I learned

Sentiment alone is nowhere near sufficient alpha — but the infra to build, train, and evaluate
a model end-to-end transferred to everything I've done since.
```

- [ ] **Step 5: Create `content/projects/playlister.mdx`**

```mdx
---
slug: playlister
title: Playlister
tagline: Collaborative playlist builder in the MERN stack
summary: >-
  A full-stack MERN app that lets friends build, share, and comment on playlists. My first serious exposure to auth, state management, and real database design.
role: Full-stack (school project)
timeframe: 2024
status: shipped
featured: false
order: 3
stack: [MongoDB, Express, React, Node.js, JWT]
tags: [full-stack, frontend]
links:
  github: https://github.com/BrianASC23/playlister
cover:
  src: /projects/playlister/cover.jpg
  alt: Playlister UI screenshot
---

## Scope

Authenticated playlists, nested comments, a drag-and-drop editor, and a shareable public view.
First time I hit real indexing problems (N+1 on comments) and had to actually think about
database shape.
```

- [ ] **Step 6: Create `content/projects/fuzzer.mdx`**

```mdx
---
slug: fuzzer
title: Coverage-guided Fuzzer
tagline: A tiny AFL-style fuzzer written from scratch in C
summary: >-
  A mutation-based fuzzer with edge-coverage feedback, corpus minimization, and crash deduplication — built to understand, not to replace, AFL++.
role: Systems learning project
timeframe: 2026 – present
status: in-progress
featured: true
order: 4
stack: [C]
tags: [systems, devtools]
cover:
  src: /projects/fuzzer/cover.jpg
  alt: Fuzzer terminal output
---

## Why

I wanted to internalize what a fuzzer actually does — not just run `afl-fuzz` and pray.
Writing one from scratch forced me to think about instrumentation, shared-memory IPC, and
deterministic replay of a corpus.

## Status

In-progress. Edge coverage and the basic mutation engine work today. Next up: forkserver and
persistent mode.
```

- [ ] **Step 7: Create `content/projects/custom-heap.mdx`**

```mdx
---
slug: custom-heap
title: Custom Heap Allocator
tagline: An explicit free-list allocator with boundary tags and coalescing
summary: >-
  A replacement for malloc/free built on top of mmap, using explicit free lists, boundary tags, and immediate coalescing. Benchmarked against glibc malloc on a mixed workload.
role: Systems learning project
timeframe: 2025
status: shipped
featured: false
order: 5
stack: [C]
tags: [systems]
cover:
  src: /projects/custom-heap/cover.jpg
  alt: Heap layout diagram
---

## Design

- Explicit free list with LIFO insertion
- Boundary-tagged blocks for O(1) coalescing
- First-fit placement with a splitting threshold

## Takeaway

Beat glibc on the specific workload I tuned for, lost badly on everything else. A good
reminder that "general-purpose" allocators earn their complexity.
```

- [ ] **Step 8: Create experience files**

`content/experience/sbu-cs-ops.mdx`:
```mdx
---
slug: sbu-cs-ops
company: Stony Brook University — CS Operations
role: Operations Engineer
location: Stony Brook, NY
start: 2025-09
end: present
stack: [Python, Zabbix, Bash, Linux]
bullets:
  - Built Python automation that monitors the CS department's fleet via Zabbix and auto-remediates common alerts.
  - Wrote deployment runbooks and on-call playbooks used by the rest of the ops team.
---
```

`content/experience/pulp.mdx`:
```mdx
---
slug: pulp
company: Pulp Corporation
role: Software Engineering Intern
location: Remote
start: 2025-01
end: 2025-08
stack: [Next.js, TypeScript, Neo4j, AWS]
bullets:
  - Shipped features across a Next.js frontend and Neo4j graph backend serving a B2B analytics product.
  - Designed Cypher queries and migration scripts that reduced a critical report's load time by 3x.
  - Owned the AWS deployment pipeline for an internal admin tool.
---
```

`content/experience/sbu-web.mdx`:
```mdx
---
slug: sbu-web
company: Stony Brook CS — Data Web Programmer
role: Web Programmer
location: Stony Brook, NY
start: 2025-01
end: 2025-08
stack: [Drupal, PHP, MySQL]
bullets:
  - Maintained and extended the department's Drupal site, shipping custom modules in PHP.
  - Cleaned up a decade of orphaned content and rebuilt the faculty directory data model.
---
```

`content/experience/sbu-ra.mdx`:
```mdx
---
slug: sbu-ra
company: Stony Brook Campus Residences
role: Resident Assistant
location: Stony Brook, NY
start: 2024-08
end: present
stack: []
bullets:
  - Lead resident for a floor of 40 students; ran weekly programs and first-line crisis response.
  - Translates directly into the "thoughtful builder" half of my bio — this is the part of the résumé where I learn to hold a room.
---
```

- [ ] **Step 9: Commit seed content**

```bash
git add content
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add seed MDX content for projects, experience, and bio"
```

---

### Task 4.3: Project content loader

**Files:**
- Create: `lib/content/projects.ts`, `tests/unit/content-projects.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it } from 'vitest';
import { getAllProjects, getFeaturedProjects, getProjectBySlug } from '@/lib/content/projects';

describe('project content loader', () => {
  it('loads all seed projects', () => {
    const projects = getAllProjects();
    expect(projects.length).toBeGreaterThanOrEqual(5);
  });

  it('returns featured projects sorted by order', () => {
    const featured = getFeaturedProjects();
    expect(featured.every((p) => p.featured)).toBe(true);
    expect(featured[0]?.order ?? 0).toBeLessThanOrEqual(featured[1]?.order ?? 999);
  });

  it('looks up by slug', () => {
    const project = getProjectBySlug('advising-bot');
    expect(project?.title).toBe('Advising Bot');
  });

  it('returns undefined for missing slug', () => {
    expect(getProjectBySlug('does-not-exist')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run (expect fail)**

```bash
pnpm test content-projects
```

- [ ] **Step 3: Create `lib/content/projects.ts`**

```ts
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { type Project, projectSchema } from '@/lib/schemas/project';

const CONTENT_DIR = join(process.cwd(), 'content', 'projects');

export interface LoadedProject {
  project: Project;
  body: string;
}

function loadAll(): LoadedProject[] {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));
  return files.map((file) => {
    const raw = readFileSync(join(CONTENT_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const project = projectSchema.parse(data);
    return { project, body: content };
  });
}

let cache: LoadedProject[] | null = null;
function loaded(): LoadedProject[] {
  if (!cache) cache = loadAll();
  return cache;
}

export function getAllProjects(): Project[] {
  return loaded()
    .map((l) => l.project)
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return loaded().find((l) => l.project.slug === slug)?.project;
}

export function getProjectMdxBySlug(slug: string): LoadedProject | undefined {
  return loaded().find((l) => l.project.slug === slug);
}

export function getProjectSlugs(): string[] {
  return getAllProjects().map((p) => p.slug);
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test content-projects
```
Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add lib/content/projects.ts tests/unit/content-projects.test.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add project content loader"
```

---

### Task 4.4: Experience and site content loaders

**Files:**
- Create: `lib/content/experience.ts`, `lib/content/site.ts`, `tests/unit/content-experience.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it } from 'vitest';
import { getAllExperiences } from '@/lib/content/experience';
import { getBio, getToolbelt } from '@/lib/content/site';

describe('experience loader', () => {
  it('loads experiences sorted newest first', () => {
    const items = getAllExperiences();
    expect(items.length).toBeGreaterThanOrEqual(4);
    const firstStart = items[0]?.start ?? '0000-00';
    const lastStart = items[items.length - 1]?.start ?? '0000-00';
    expect(firstStart.localeCompare(lastStart)).toBeGreaterThanOrEqual(0);
  });
});

describe('site loader', () => {
  it('loads bio frontmatter and body', () => {
    const bio = getBio();
    expect(bio.frontmatter.name).toBe('Brian Cao');
    expect(bio.body.length).toBeGreaterThan(10);
  });

  it('loads toolbelt as typed object', () => {
    const tb = getToolbelt();
    expect(tb.languages).toContain('TypeScript');
  });
});
```

- [ ] **Step 2: Run (expect fail)**

```bash
pnpm test content-experience
```

- [ ] **Step 3: Create `lib/content/experience.ts`**

```ts
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { type Experience, experienceSchema } from '@/lib/schemas/experience';

const DIR = join(process.cwd(), 'content', 'experience');

let cache: Experience[] | null = null;

function loadAll(): Experience[] {
  const files = readdirSync(DIR).filter((f) => f.endsWith('.mdx'));
  return files.map((file) => {
    const raw = readFileSync(join(DIR, file), 'utf8');
    const { data } = matter(raw);
    return experienceSchema.parse(data);
  });
}

export function getAllExperiences(): Experience[] {
  if (!cache) cache = loadAll();
  return [...cache].sort((a, b) => b.start.localeCompare(a.start));
}
```

- [ ] **Step 4: Create `lib/content/site.ts`**

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

const SITE_DIR = join(process.cwd(), 'content', 'site');

const bioFrontmatter = z.object({
  name: z.string(),
  role: z.string(),
  location: z.string().optional(),
  school: z.string().optional(),
});

export type BioFrontmatter = z.infer<typeof bioFrontmatter>;

export function getBio(): { frontmatter: BioFrontmatter; body: string } {
  const raw = readFileSync(join(SITE_DIR, 'bio.mdx'), 'utf8');
  const parsed = matter(raw);
  return { frontmatter: bioFrontmatter.parse(parsed.data), body: parsed.content };
}

const toolbeltSchema = z.object({
  languages: z.array(z.string()),
  frontend: z.array(z.string()),
  backend: z.array(z.string()),
  aiml: z.array(z.string()),
  tools: z.array(z.string()),
});

export type Toolbelt = z.infer<typeof toolbeltSchema>;

export function getToolbelt(): Toolbelt {
  const raw = readFileSync(join(SITE_DIR, 'toolbelt.json'), 'utf8');
  return toolbeltSchema.parse(JSON.parse(raw));
}
```

- [ ] **Step 5: Run tests**

```bash
pnpm test content-experience
```
Expected: 3 passing.

- [ ] **Step 6: Commit**

```bash
git add lib/content/experience.ts lib/content/site.ts tests/unit/content-experience.test.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add experience and site content loaders"
```

---

### Task 4.5: Medium RSS loader

**Files:**
- Create: `lib/writing/medium.ts`, `tests/unit/medium.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it } from 'vitest';
import { parseMediumFeed } from '@/lib/writing/medium';

const fixture = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Brian Cao on Medium</title>
    <item>
      <title>How I built a RAG agent</title>
      <link>https://medium.com/@brianc40722/how-i-built-a-rag-agent-abc123</link>
      <guid>https://medium.com/p/abc123</guid>
      <pubDate>Tue, 01 Apr 2026 12:00:00 GMT</pubDate>
      <content:encoded><![CDATA[<p>This is a story about RAG agents. It covers retrieval, grounding, and evaluation in depth.</p>]]></content:encoded>
      <category>ai</category>
      <category>rag</category>
    </item>
  </channel>
</rss>`;

describe('parseMediumFeed', () => {
  it('parses items into WritingPost objects', () => {
    const posts = parseMediumFeed(fixture);
    expect(posts).toHaveLength(1);
    expect(posts[0]?.title).toBe('How I built a RAG agent');
    expect(posts[0]?.tags).toContain('rag');
    expect(posts[0]?.excerpt.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run (expect fail)**

```bash
pnpm test medium
```

- [ ] **Step 3: Create `lib/writing/medium.ts`**

```ts
import { XMLParser } from 'fast-xml-parser';
import { type WritingPost, writingPostSchema } from '@/lib/schemas/writing';
import { publicEnv } from '@/lib/env';

interface RawItem {
  title: string;
  link: string;
  guid: string | { '#text': string };
  pubDate: string;
  'content:encoded'?: string;
  description?: string;
  category?: string | string[];
}

function toExcerpt(html: string, max = 220): string {
  const stripped = html
    .replace(/<figure[\s\S]*?<\/figure>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return stripped.length > max ? `${stripped.slice(0, max).trimEnd()}…` : stripped;
}

function extractFirstImage(html: string): string | undefined {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1];
}

function estimateReadingTime(html: string): string {
  const words = html
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

export function parseMediumFeed(xml: string): WritingPost[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    cdataPropName: '__cdata',
    isArray: (name) => name === 'item' || name === 'category',
  });
  const parsed = parser.parse(xml);
  const items: RawItem[] = parsed?.rss?.channel?.item ?? [];

  return items.map((item) => {
    const contentRaw =
      // biome-ignore lint/suspicious/noExplicitAny: parser variants
      (item['content:encoded'] as any)?.__cdata ?? item['content:encoded'] ?? item.description ?? '';
    const html = typeof contentRaw === 'string' ? contentRaw : '';
    const categories = Array.isArray(item.category)
      ? item.category
      : item.category
        ? [item.category]
        : [];
    const guid = typeof item.guid === 'string' ? item.guid : item.guid?.['#text'] ?? item.link;

    return writingPostSchema.parse({
      id: guid,
      title: item.title,
      link: item.link,
      publishedAt: new Date(item.pubDate).toISOString(),
      excerpt: toExcerpt(html),
      thumbnail: extractFirstImage(html),
      readingTime: estimateReadingTime(html),
      tags: categories,
    });
  });
}

export async function getMediumPosts(): Promise<WritingPost[]> {
  try {
    const res = await fetch(publicEnv.NEXT_PUBLIC_MEDIUM_FEED, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseMediumFeed(xml);
  } catch {
    return [];
  }
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test medium
```
Expected: 1 passing.

- [ ] **Step 5: Commit**

```bash
git add lib/writing/medium.ts tests/unit/medium.test.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add medium rss loader"
```

---

### Task 4.6: MDX provider and custom components

**Files:**
- Create: `components/mdx/mdx-components.tsx`, `components/mdx/MDXRenderer.tsx`

- [ ] **Step 1: Create `components/mdx/mdx-components.tsx`**

```tsx
import type { MDXComponents } from 'mdx/types';
import NextImage from 'next/image';
import { AppLink } from '@/components/primitives/Link';
import { Heading } from '@/components/primitives/Heading';
import { Text } from '@/components/primitives/Text';

export const mdxComponents: MDXComponents = {
  h1: ({ children, id }) => (
    <Heading level={1} id={id as string | undefined} display className="mt-16 mb-6">
      {children}
    </Heading>
  ),
  h2: ({ children, id }) => (
    <Heading level={2} id={id as string | undefined} display className="mt-14 mb-5">
      {children}
    </Heading>
  ),
  h3: ({ children, id }) => (
    <Heading level={3} id={id as string | undefined} className="mt-10 mb-4">
      {children}
    </Heading>
  ),
  p: ({ children }) => (
    <Text tone="muted" size="body" className="mb-5 max-w-[68ch]">
      {children}
    </Text>
  ),
  ul: ({ children }) => (
    <ul className="mb-6 max-w-[68ch] list-disc space-y-2 pl-6 text-[var(--color-fg-muted)] marker:text-[var(--color-accent)]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-6 max-w-[68ch] list-decimal space-y-2 pl-6 text-[var(--color-fg-muted)] marker:text-[var(--color-accent)]">
      {children}
    </ol>
  ),
  a: ({ href, children }) => <AppLink href={href ?? '#'}>{children}</AppLink>,
  img: ({ src, alt, width, height }) => (
    <figure className="my-10">
      <NextImage
        src={src ?? ''}
        alt={alt ?? ''}
        width={Number(width) || 1200}
        height={Number(height) || 800}
        className="rounded-xl border border-[var(--color-border)]"
      />
      {alt && (
        <figcaption className="mt-2 text-center font-mono text-xs text-[var(--color-fg-subtle)]">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
  code: ({ children, className }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="rounded bg-[var(--color-bg-elevated)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--color-accent)]">
        {children}
      </code>
    ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-2 border-[var(--color-accent)] pl-5 italic text-[var(--color-fg-muted)]">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-12 border-[var(--color-border)]" />,
};
```

- [ ] **Step 2: Create `components/mdx/MDXRenderer.tsx`**

```tsx
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { mdxComponents } from './mdx-components';

interface MDXRendererProps {
  source: string;
}

export function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: ['anchor'] } }],
          ],
        },
      }}
    />
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/mdx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add mdx renderer and custom components"
```

---

## Phase 5: Navigation, Cursor & Command Palette

### Task 5.1: Lenis smooth scroll provider

**Files:**
- Create: `components/motion/SmoothScrollProvider.tsx`

- [ ] **Step 1: Create `components/motion/SmoothScrollProvider.tsx`**

```tsx
'use client';

import Lenis from 'lenis';
import { type ReactNode, useEffect } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - (1 - t) ** 3,
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/SmoothScrollProvider.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add lenis smooth-scroll provider"
```

---

### Task 5.2: `CursorLayer` (custom cursor)

**Files:**
- Create: `components/cursor/CursorLayer.tsx`

- [ ] **Step 1: Create `components/cursor/CursorLayer.tsx`**

```tsx
'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { usePointerFine } from '@/lib/hooks/usePointerFine';

export function CursorLayer() {
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });
  const [hovering, setHovering] = useState<'default' | 'hover' | 'text'>('default');

  useEffect(() => {
    if (!fine || reduced) return;

    document.documentElement.classList.add('cursor-none');

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest('a, button, [role="button"], [data-cursor="hover"]')) setHovering('hover');
      else if (el.closest('p, h1, h2, h3, h4, blockquote, [data-cursor="text"]')) setHovering('text');
      else setHovering('default');
    };

    window.addEventListener('pointermove', onMove);
    return () => {
      document.documentElement.classList.remove('cursor-none');
      window.removeEventListener('pointermove', onMove);
    };
  }, [fine, reduced, x, y]);

  if (!fine || reduced) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
        style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          animate={{
            width: hovering === 'hover' ? 48 : hovering === 'text' ? 2 : 10,
            height: hovering === 'hover' ? 48 : hovering === 'text' ? 24 : 10,
            borderRadius: hovering === 'text' ? 1 : 999,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="bg-white"
        />
      </motion.div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/cursor/CursorLayer.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add custom cursor layer"
```

---

### Task 5.3: Command registry

**Files:**
- Create: `lib/commands/registry.ts`, `tests/unit/commands.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it } from 'vitest';
import { commands } from '@/lib/commands/registry';

describe('commands registry', () => {
  it('contains navigation commands', () => {
    const ids = commands.map((c) => c.id);
    expect(ids).toContain('nav-home');
    expect(ids).toContain('nav-projects');
    expect(ids).toContain('nav-writing');
  });

  it('each command has required fields', () => {
    for (const cmd of commands) {
      expect(cmd.id).toBeTruthy();
      expect(cmd.label).toBeTruthy();
      expect(cmd.group).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run (expect fail)**

```bash
pnpm test commands
```

- [ ] **Step 3: Create `lib/commands/registry.ts`**

```ts
export type CommandAction =
  | { type: 'navigate'; href: string }
  | { type: 'external'; href: string }
  | { type: 'callback'; id: string };

export interface Command {
  id: string;
  label: string;
  group: 'navigate' | 'social' | 'action';
  shortcut?: string;
  keywords?: string[];
  action: CommandAction;
}

export const commands: Command[] = [
  {
    id: 'nav-home',
    label: 'Go to home',
    group: 'navigate',
    keywords: ['home', 'index'],
    action: { type: 'navigate', href: '/' },
  },
  {
    id: 'nav-projects',
    label: 'Browse all projects',
    group: 'navigate',
    keywords: ['work', 'case studies'],
    action: { type: 'navigate', href: '/projects' },
  },
  {
    id: 'nav-writing',
    label: 'Read writing',
    group: 'navigate',
    keywords: ['blog', 'medium', 'posts'],
    action: { type: 'navigate', href: '/writing' },
  },
  {
    id: 'nav-resume',
    label: 'View resume',
    group: 'navigate',
    keywords: ['cv'],
    action: { type: 'navigate', href: '/resume' },
  },
  {
    id: 'social-github',
    label: 'Open GitHub',
    group: 'social',
    action: { type: 'external', href: 'https://github.com/BrianASC23' },
  },
  {
    id: 'social-linkedin',
    label: 'Open LinkedIn',
    group: 'social',
    action: { type: 'external', href: 'https://linkedin.com/in/brian-cao-7b9a89211' },
  },
  {
    id: 'action-email',
    label: 'Copy email address',
    group: 'action',
    action: { type: 'callback', id: 'copy-email' },
  },
];
```

- [ ] **Step 4: Run tests**

```bash
pnpm test commands
```
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add lib/commands/registry.ts tests/unit/commands.test.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add command registry"
```

---

### Task 5.4: `CommandPalette`

**Files:**
- Create: `components/nav/CommandPalette.tsx`

- [ ] **Step 1: Create `components/nav/CommandPalette.tsx`**

```tsx
'use client';

import { Command } from 'cmdk';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { commands } from '@/lib/commands/registry';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const runCallback = useCallback(async (id: string) => {
    if (id === 'copy-email') {
      await navigator.clipboard.writeText('brianc40722@gmail.com');
    }
  }, []);

  const groups = ['navigate', 'social', 'action'] as const;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[20vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Command
              label="Command palette"
              className="overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-4">
                <span className="font-mono text-xs text-[var(--color-fg-subtle)]">⌘K</span>
                <Command.Input
                  placeholder="Type a command or search…"
                  className="flex-1 bg-transparent text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:outline-none"
                />
              </div>
              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                <Command.Empty className="p-6 text-center text-sm text-[var(--color-fg-subtle)]">
                  No results found.
                </Command.Empty>
                {groups.map((group) => {
                  const items = commands.filter((c) => c.group === group);
                  if (items.length === 0) return null;
                  return (
                    <Command.Group
                      key={group}
                      heading={group.toUpperCase()}
                      className="px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"
                    >
                      {items.map((cmd) => (
                        <Command.Item
                          key={cmd.id}
                          value={`${cmd.label} ${cmd.keywords?.join(' ') ?? ''}`}
                          onSelect={async () => {
                            setOpen(false);
                            if (cmd.action.type === 'navigate') router.push(cmd.action.href);
                            else if (cmd.action.type === 'external')
                              window.open(cmd.action.href, '_blank', 'noopener,noreferrer');
                            else await runCallback(cmd.action.id);
                          }}
                          className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-[var(--color-fg)] aria-selected:bg-[var(--color-bg-inset)] aria-selected:text-[var(--color-accent)]"
                        >
                          {cmd.label}
                        </Command.Item>
                      ))}
                    </Command.Group>
                  );
                })}
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/nav/CommandPalette.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add cmdk command palette"
```

---

### Task 5.5: `TopBar` and `ScrollProgress`

**Files:**
- Create: `components/nav/TopBar.tsx`, `components/nav/ScrollProgress.tsx`, `components/nav/MobileMenu.tsx`

- [ ] **Step 1: Create `components/nav/ScrollProgress.tsx`**

```tsx
'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.5 });
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-40 h-[2px] origin-left bg-[var(--color-accent)]"
    />
  );
}
```

- [ ] **Step 2: Create `components/nav/MobileMenu.tsx`**

```tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

const LINKS = [
  { href: '/#work', label: 'Work' },
  { href: '/#about', label: 'About' },
  { href: '/writing', label: 'Writing' },
  { href: '/resume', label: 'Resume' },
  { href: '/#contact', label: 'Contact' },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-fg)]"
      >
        <span className={cn('block h-px w-4 bg-current transition', open && 'rotate-45 translate-y-[3px]')} />
        <span
          className={cn(
            'absolute block h-px w-4 bg-current transition',
            open && '-rotate-45 -translate-y-[3px]',
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
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 font-mono text-sm uppercase tracking-[0.12em] text-[var(--color-fg)] hover:bg-[var(--color-bg-inset)] hover:text-[var(--color-accent)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 3: Create `components/nav/CommandTrigger.tsx` (client)**

```tsx
'use client';

export function CommandTrigger() {
  return (
    <button
      type="button"
      aria-label="Open command palette"
      onClick={() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }),
        );
      }}
      className="hidden h-9 items-center gap-2 rounded-full border border-[var(--color-border)] px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:inline-flex"
    >
      ⌘K · Search
    </button>
  );
}
```

- [ ] **Step 4: Create `components/nav/TopBar.tsx` (server)**

```tsx
import Link from 'next/link';
import { CommandTrigger } from './CommandTrigger';
import { MobileMenu } from './MobileMenu';

const LINKS = [
  { href: '/#work', label: 'Work' },
  { href: '/#about', label: 'About' },
  { href: '/writing', label: 'Writing' },
  { href: '/resume', label: 'Resume' },
];

export function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-[var(--color-border)]/60 bg-[var(--color-bg)]/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 md:px-8 lg:px-12">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-fg)] hover:text-[var(--color-accent)]"
        >
          BC · <span className="text-[var(--color-fg-subtle)]">Portfolio</span>
        </Link>
        <nav className="hidden gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <CommandTrigger />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/nav
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add top bar, mobile menu, scroll progress, and command trigger"
```

---

### Task 5.6: Site layout shell `app/(site)/layout.tsx`

**Files:**
- Create: `app/(site)/layout.tsx`, `components/nav/Footer.tsx`

- [ ] **Step 1: Create `components/nav/Footer.tsx`**

```tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]/60 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row md:items-end md:justify-between md:px-8 lg:px-12">
        <div>
          <p className="font-serif text-3xl text-[var(--color-fg)]">Brian Cao</p>
          <p className="mt-2 max-w-sm text-sm text-[var(--color-fg-muted)]">
            Full-stack engineer building systems at the edge of software and AI.
          </p>
        </div>
        <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
          <Link href="https://github.com/BrianASC23" target="_blank" rel="noopener noreferrer">
            GitHub →
          </Link>
          <Link
            href="https://linkedin.com/in/brian-cao-7b9a89211"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn →
          </Link>
          <Link href="mailto:brianc40722@gmail.com">Email →</Link>
        </div>
      </div>
      <p className="mt-12 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
        © {new Date().getFullYear()} · Brian Cao · Built with Next.js
      </p>
    </footer>
  );
}
```

- [ ] **Step 2: Create `app/(site)/layout.tsx`**

```tsx
import type { ReactNode } from 'react';
import { CursorLayer } from '@/components/cursor/CursorLayer';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';
import { CommandPalette } from '@/components/nav/CommandPalette';
import { Footer } from '@/components/nav/Footer';
import { ScrollProgress } from '@/components/nav/ScrollProgress';
import { TopBar } from '@/components/nav/TopBar';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <TopBar />
      <CursorLayer />
      <CommandPalette />
      <main id="main" className="pt-14">
        {children}
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
```

- [ ] **Step 3: Move existing `app/page.tsx` into the site route group**

```bash
mkdir -p "app/(site)"
mv app/page.tsx "app/(site)/page.tsx"
```

- [ ] **Step 4: Commit**

```bash
git add app components/nav/Footer.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add site layout shell with nav, cursor, and palette"
```

---

## Phase 6: R3F Shader Hero

### Task 6.1: GLSL shaders for displaced blob

**Files:**
- Create: `components/hero/shaders/vertex.glsl.ts`, `components/hero/shaders/fragment.glsl.ts`

- [ ] **Step 1: Create `components/hero/shaders/vertex.glsl.ts`**

```ts
export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uFrequency;
uniform vec2 uMouse;
uniform float uMouseStrength;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

//
// Classic Perlin 3D Noise — Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t){return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000), dot(g010,g010), dot(g100,g100), dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001), dot(g011,g011), dot(g101,g101), dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

void main() {
  vec3 pos = position;

  float t = uTime * uSpeed;
  float noise = cnoise(pos * uFrequency + vec3(t * 0.3));
  float detail = cnoise(pos * uFrequency * 2.0 + vec3(t * 0.7)) * 0.25;

  float mouseInfluence = length(uMouse) * uMouseStrength * 0.5;
  float displacement = (noise + detail) * uAmplitude + mouseInfluence * 0.08;

  vec3 displaced = pos + normal * displacement;
  vDisplacement = displacement;
  vPosition = displaced;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;
```

- [ ] **Step 2: Create `components/hero/shaders/fragment.glsl.ts`**

```ts
export const fragmentShader = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.2);

  float mixFactor = smoothstep(-0.2, 0.2, vDisplacement);
  vec3 base = mix(uColorA, uColorB, mixFactor);
  vec3 finalColor = mix(base, uColorC, fresnel);

  // Subtle scanline
  float scan = sin(vPosition.y * 60.0 + uTime * 0.8) * 0.04;
  finalColor += scan * uColorC;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;
```

- [ ] **Step 3: Commit**

```bash
git add components/hero/shaders
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add GLSL shaders for hero blob"
```

---

### Task 6.2: `HeroBlob` mesh

**Files:**
- Create: `components/hero/HeroBlob.tsx`

- [ ] **Step 1: Create `components/hero/HeroBlob.tsx`**

```tsx
'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { fragmentShader } from './shaders/fragment.glsl';
import { vertexShader } from './shaders/vertex.glsl';

interface HeroBlobProps {
  reduced?: boolean;
}

export function HeroBlob({ reduced = false }: HeroBlobProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: reduced ? 0 : 0.6 },
      uAmplitude: { value: 0.35 },
      uFrequency: { value: 1.1 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseStrength: { value: 1.0 },
      uColorA: { value: new THREE.Color('#0b0a08') },
      uColorB: { value: new THREE.Color('#f59e0b') },
      uColorC: { value: new THREE.Color('#fbbf24') },
    }),
    [reduced],
  );

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta;

    // Mouse lerp
    const target = new THREE.Vector2(
      (state.pointer.x * viewport.width) / 4,
      (state.pointer.y * viewport.height) / 4,
    );
    mouseRef.current.lerp(target, 0.08);
    materialRef.current.uniforms.uMouse.value = mouseRef.current;

    if (meshRef.current && !reduced) {
      meshRef.current.rotation.y += delta * 0.06;
      meshRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.6}>
      <icosahedronGeometry args={[1, 96]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/hero/HeroBlob.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add hero blob r3f mesh"
```

---

### Task 6.3: `Hero3DCanvas` wrapper

**Files:**
- Create: `components/hero/Hero3DCanvas.tsx`

- [ ] **Step 1: Create `components/hero/Hero3DCanvas.tsx`**

```tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { HeroBlob } from './HeroBlob';

export default function Hero3DCanvas() {
  const reduced = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 4], fov: 45 }}
      frameloop={reduced ? 'demand' : 'always'}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#fbbf24" />
      <directionalLight position={[-3, -2, 2]} intensity={0.3} color="#ffffff" />
      <HeroBlob reduced={reduced} />
      {!reduced && (
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.4} luminanceSmoothing={0.9} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
```

Add the postprocessing dependency:
```bash
pnpm add @react-three/postprocessing@^3
```

- [ ] **Step 2: Commit**

```bash
git add components/hero/Hero3DCanvas.tsx package.json pnpm-lock.yaml
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add hero 3d canvas with bloom postprocessing"
```

---

### Task 6.4: `HeroStaticFallback` and `HomeHero`

**Files:**
- Create: `components/hero/HeroStaticFallback.tsx`, `components/hero/HomeHero.tsx`

- [ ] **Step 1: Create `components/hero/HeroStaticFallback.tsx`**

```tsx
export function HeroStaticFallback() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 70% 50%, oklch(0.78 0.16 75 / 0.28) 0%, transparent 55%), radial-gradient(ellipse at 30% 70%, oklch(0.55 0.12 70 / 0.22) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute right-[15%] top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, oklch(0.82 0.16 75) 0%, oklch(0.42 0.11 65) 60%, transparent 72%)',
          filter: 'blur(10px)',
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create `components/hero/HomeHero.tsx`**

```tsx
'use client';

import dynamic from 'next/dynamic';
import { Container } from '@/components/primitives/Container';
import { Reveal } from '@/components/motion/Reveal';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/primitives/Button';
import { HeroStaticFallback } from './HeroStaticFallback';

const Hero3DCanvas = dynamic(() => import('./Hero3DCanvas'), {
  ssr: false,
  loading: () => <HeroStaticFallback />,
});

export function HomeHero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100dvh-56px)] items-center overflow-hidden"
      aria-label="Introduction"
    >
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden="true" />
      <div className="absolute inset-0">
        <Hero3DCanvas />
      </div>

      <Container className="relative z-10">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="max-w-[20ch]">
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              Portfolio · 01
            </p>
            <h1 className="font-serif text-[length:var(--text-display)] leading-[0.95] tracking-tight text-[var(--color-fg)]">
              <Reveal>Brian </Reveal>
              <Reveal delay={0.1}>
                <em className="text-[var(--color-accent)] italic">Cao</em>
              </Reveal>
            </h1>
            <FadeIn delay={0.3} className="mt-6 max-w-md">
              <p className="text-[var(--color-fg-muted)]">
                Full-stack engineer building systems at the edge of software and AI.
                <br />
                Stony Brook '27.
              </p>
            </FadeIn>
            <FadeIn delay={0.5} className="mt-8 flex flex-wrap gap-3">
              <Button href="/#work">View work</Button>
              <Button href="/#contact" variant="secondary">
                Get in touch
              </Button>
            </FadeIn>
          </div>
        </div>
      </Container>

      <div className="absolute inset-x-0 bottom-6 z-10">
        <Container>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
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

- [ ] **Step 3: Commit**

```bash
git add components/hero/HeroStaticFallback.tsx components/hero/HomeHero.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add home hero with dynamic r3f canvas and fallback"
```

---

## Phase 7: Homepage Sections

### Task 7.1: `AboutSection`

**Files:**
- Create: `components/sections/AboutSection.tsx`

- [ ] **Step 1: Create `components/sections/AboutSection.tsx`**

```tsx
import Image from 'next/image';
import { Section } from '@/components/primitives/Section';
import { Text } from '@/components/primitives/Text';
import { FadeIn } from '@/components/motion/FadeIn';
import { getBio } from '@/lib/content/site';

export function AboutSection() {
  const bio = getBio();

  return (
    <Section
      id="about"
      eyebrow="02 · About"
      title={
        <>
          Builder first.
          <br />
          <em className="text-[var(--color-accent)] italic">Thoughtful</em> second.
        </>
      }
      containerSize="narrow"
    >
      <div className="grid gap-10 md:grid-cols-[1fr_240px]">
        <div>
          <FadeIn>
            <Text size="lead" tone="default" className="mb-6 max-w-[60ch]">
              {bio.body.trim().split('\n\n')[0]}
            </Text>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Text size="body" tone="muted" className="max-w-[60ch]">
              {bio.body.trim().split('\n\n').slice(1).join('\n\n')}
            </Text>
          </FadeIn>
          <FadeIn delay={0.2} className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
            <span>{bio.frontmatter.role}</span>
            {bio.frontmatter.school && <span>{bio.frontmatter.school}</span>}
            {bio.frontmatter.location && <span>{bio.frontmatter.location}</span>}
          </FadeIn>
        </div>
        <FadeIn delay={0.15}>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
            <Image
              src="/placeholder-portrait.jpg"
              alt="Brian Cao"
              fill
              sizes="(min-width: 768px) 240px, 100vw"
              className="object-cover"
            />
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Add a placeholder portrait**

Add a 600x800 placeholder image to `public/placeholder-portrait.jpg`. For seeding, download any creative commons silhouette or generate a solid-color placeholder:

```bash
# Create an SVG placeholder and rename — manual step
# OR drop a real photo once available
```

If no image is available yet, create `public/placeholder-portrait.svg` and use `src="/placeholder-portrait.svg"` in the component temporarily.

- [ ] **Step 3: Commit**

```bash
git add components/sections/AboutSection.tsx public/placeholder-portrait*
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add about section"
```

---

### Task 7.2: `ProjectCard`

**Files:**
- Create: `components/project/ProjectCard.tsx`

- [ ] **Step 1: Create `components/project/ProjectCard.tsx`**

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { Pill } from '@/components/primitives/Pill';
import { Tilt3D } from '@/components/motion/Tilt3D';
import type { Project } from '@/lib/schemas/project';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block focus-visible:outline-none"
      aria-label={`${project.title} — ${project.tagline}`}
    >
      <Tilt3D className="relative">
        <article className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] transition-colors group-hover:border-[var(--color-accent)]">
          <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-bg-inset)]">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <p className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
              {String(index + 1).padStart(2, '0')}
            </p>
          </div>
          <div className="flex flex-col gap-3 p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-serif text-2xl leading-tight text-[var(--color-fg)]">
                {project.title}
              </h3>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                {project.timeframe}
              </span>
            </div>
            <p className="text-sm text-[var(--color-fg-muted)]">{project.tagline}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.stack.slice(0, 5).map((tech) => (
                <Pill key={tech}>{tech}</Pill>
              ))}
            </div>
          </div>
        </article>
      </Tilt3D>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/project/ProjectCard.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add project card component"
```

---

### Task 7.3: `SelectedWorkSection`

**Files:**
- Create: `components/sections/SelectedWorkSection.tsx`

- [ ] **Step 1: Create `components/sections/SelectedWorkSection.tsx`**

```tsx
import { Section } from '@/components/primitives/Section';
import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Button } from '@/components/primitives/Button';
import { getFeaturedProjects } from '@/lib/content/projects';

export function SelectedWorkSection() {
  const projects = getFeaturedProjects();

  return (
    <Section
      id="work"
      eyebrow="03 · Selected Work"
      title={<>What I've <em className="italic text-[var(--color-accent)]">built</em></>}
      description="A handful of things I've built — the ones I'd actually want to walk you through."
    >
      <StaggerGroup className="grid gap-8 md:grid-cols-2" gap="base">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </StaggerGroup>
      <div className="mt-12 flex justify-center">
        <Button href="/projects" variant="secondary">
          See all projects →
        </Button>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/SelectedWorkSection.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add selected work section"
```

---

### Task 7.4: `ExperienceSection`

**Files:**
- Create: `components/sections/ExperienceSection.tsx`

- [ ] **Step 1: Create `components/sections/ExperienceSection.tsx`**

```tsx
import { Section } from '@/components/primitives/Section';
import { Pill } from '@/components/primitives/Pill';
import { FadeIn } from '@/components/motion/FadeIn';
import { getAllExperiences } from '@/lib/content/experience';
import { formatDate } from '@/lib/utils/format';

function formatRange(start: string, end: string): string {
  const startFormatted = formatDate(`${start}-01`);
  const endFormatted = end === 'present' ? 'Present' : formatDate(`${end}-01`);
  return `${startFormatted} — ${endFormatted}`;
}

export function ExperienceSection() {
  const experiences = getAllExperiences();

  return (
    <Section
      id="experience"
      eyebrow="04 · Experience"
      title="Where I've been"
      containerSize="narrow"
    >
      <ol className="relative space-y-10 border-l border-[var(--color-border)] pl-8">
        {experiences.map((exp, i) => (
          <FadeIn key={exp.slug} delay={i * 0.05} as="li" className="relative">
            <span className="absolute -left-[37px] top-2 h-3 w-3 rounded-full border border-[var(--color-accent)] bg-[var(--color-bg)]" />
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
              <div>
                <h3 className="font-serif text-xl text-[var(--color-fg)]">{exp.role}</h3>
                <p className="text-sm text-[var(--color-fg-muted)]">
                  {exp.company}
                  {exp.location && <span className="text-[var(--color-fg-subtle)]"> · {exp.location}</span>}
                </p>
              </div>
              <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                {formatRange(exp.start, exp.end)}
              </p>
            </div>
            <ul className="mt-4 space-y-1.5 text-sm text-[var(--color-fg-muted)]">
              {exp.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-2 h-px w-3 shrink-0 bg-[var(--color-accent)]" aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            {exp.stack.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {exp.stack.map((tech) => (
                  <Pill key={tech}>{tech}</Pill>
                ))}
              </div>
            )}
          </FadeIn>
        ))}
      </ol>
    </Section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/ExperienceSection.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add experience timeline section"
```

---

### Task 7.5: `ToolbeltSection` with marquee

**Files:**
- Create: `components/sections/ToolbeltSection.tsx`

- [ ] **Step 1: Create `components/sections/ToolbeltSection.tsx`**

```tsx
import { Section } from '@/components/primitives/Section';
import { Marquee } from '@/components/motion/Marquee';
import { getToolbelt } from '@/lib/content/site';

export function ToolbeltSection() {
  const tb = getToolbelt();
  const all = [...tb.languages, ...tb.frontend, ...tb.backend, ...tb.aiml, ...tb.tools];

  return (
    <Section
      id="toolbelt"
      eyebrow="05 · Toolbelt"
      title="Tools I reach for"
      description="The short list of things I've used in production or research."
      containerSize="wide"
    >
      <Marquee speed={60} className="py-4">
        {all.map((tool) => (
          <span
            key={tool}
            className="font-serif text-4xl text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-accent)] md:text-5xl"
          >
            {tool}
          </span>
        ))}
      </Marquee>
      <Marquee speed={80} reverse className="py-4 opacity-60">
        {all.map((tool) => (
          <span key={`${tool}-2`} className="font-mono text-xl text-[var(--color-fg-subtle)]">
            · {tool}
          </span>
        ))}
      </Marquee>
    </Section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/ToolbeltSection.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add toolbelt section with marquee"
```

---

### Task 7.6: `WritingSection` (Medium preview)

**Files:**
- Create: `components/sections/WritingSection.tsx`

- [ ] **Step 1: Create `components/sections/WritingSection.tsx`**

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/primitives/Section';
import { Button } from '@/components/primitives/Button';
import { FadeIn } from '@/components/motion/FadeIn';
import { getMediumPosts } from '@/lib/writing/medium';
import { formatDate } from '@/lib/utils/format';

export async function WritingSection() {
  const posts = (await getMediumPosts()).slice(0, 3);

  return (
    <Section
      id="writing"
      eyebrow="06 · Writing"
      title="Recent notes"
      description="Long-form notes from Medium. Click through for the full post."
    >
      {posts.length === 0 ? (
        <p className="text-[var(--color-fg-muted)]">
          No posts yet — check back soon, or{' '}
          <Link
            href="https://medium.com/@brianc40722"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] hover:underline"
          >
            read on Medium
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-[var(--color-border)]">
          {posts.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.06} as="li">
              <Link
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-5 py-8 md:flex-row md:items-center"
              >
                {post.thumbnail && (
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg border border-[var(--color-border)] md:w-48">
                    <Image
                      src={post.thumbnail}
                      alt=""
                      fill
                      sizes="192px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                    {formatDate(post.publishedAt)} · {post.readingTime ?? '—'}
                  </p>
                  <h3 className="font-serif text-2xl text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)]">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-fg-muted)] line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </ul>
      )}
      <div className="mt-10 flex justify-center">
        <Button href="/writing" variant="secondary">
          Read all writing →
        </Button>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/WritingSection.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add writing section fed by medium rss"
```

---

### Task 7.7: `ContactSection` with form

**Files:**
- Create: `components/sections/ContactSection.tsx`, `components/sections/ContactForm.tsx`

- [ ] **Step 1: Create `components/sections/ContactForm.tsx`**

```tsx
'use client';

import { type FormEvent, useState } from 'react';
import { Button } from '@/components/primitives/Button';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const { error } = (await res.json().catch(() => ({ error: 'Request failed' }))) as {
          error: string;
        };
        throw new Error(error);
      }
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  const inputClass =
    'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-accent)] focus:outline-none';

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
            Name
          </span>
          <input type="text" name="name" required minLength={2} className={inputClass} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
            Email
          </span>
          <input type="email" name="email" required className={inputClass} />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
          Message
        </span>
        <textarea name="message" required minLength={10} rows={5} className={`${inputClass} resize-y`} />
      </label>
      <div className="flex items-center justify-between gap-4">
        <Button size="lg" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Send message'}
        </Button>
        {status === 'success' && (
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
            Sent — talk soon.
          </p>
        )}
        {status === 'error' && (
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-red-400">
            {errorMessage || 'Failed. Try again.'}
          </p>
        )}
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Create `components/sections/ContactSection.tsx`**

```tsx
import Link from 'next/link';
import { Section } from '@/components/primitives/Section';
import { ContactForm } from './ContactForm';

export function ContactSection() {
  return (
    <Section
      id="contact"
      eyebrow="07 · Contact"
      title={
        <>
          Let's build
          <br />
          <em className="italic text-[var(--color-accent)]">something</em>.
        </>
      }
      description="I'm looking for summer 2026 software engineering internships. Also open to interesting side conversations."
      containerSize="narrow"
    >
      <div className="grid gap-12 md:grid-cols-[1.1fr_1fr]">
        <ContactForm />
        <div className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
          <Link
            href="mailto:brianc40722@gmail.com"
            className="hover:text-[var(--color-accent)]"
          >
            brianc40722@gmail.com →
          </Link>
          <Link
            href="https://github.com/BrianASC23"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)]"
          >
            github.com/BrianASC23 →
          </Link>
          <Link
            href="https://linkedin.com/in/brian-cao-7b9a89211"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)]"
          >
            linkedin → brian-cao
          </Link>
          <Link
            href="https://medium.com/@brianc40722"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)]"
          >
            medium → @brianc40722
          </Link>
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/ContactSection.tsx components/sections/ContactForm.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add contact section and form"
```

---

### Task 7.8: Compose homepage `app/(site)/page.tsx`

**Files:**
- Modify: `app/(site)/page.tsx`

- [ ] **Step 1: Replace `app/(site)/page.tsx`**

```tsx
import { HomeHero } from '@/components/hero/HomeHero';
import { AboutSection } from '@/components/sections/AboutSection';
import { SelectedWorkSection } from '@/components/sections/SelectedWorkSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ToolbeltSection } from '@/components/sections/ToolbeltSection';
import { WritingSection } from '@/components/sections/WritingSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <AboutSection />
      <SelectedWorkSection />
      <ExperienceSection />
      <ToolbeltSection />
      <WritingSection />
      <ContactSection />
    </>
  );
}
```

- [ ] **Step 2: Run dev server and eyeball**

```bash
pnpm dev
```
Visit http://localhost:3000 and scroll through all sections. Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/page.tsx"
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: compose homepage from all sections"
```

---

## Phase 8: Case Study Pages

### Task 8.1: `CaseStudyHeader` and `CaseStudyMeta`

**Files:**
- Create: `components/project/CaseStudyHeader.tsx`, `components/project/CaseStudyMeta.tsx`

- [ ] **Step 1: Create `components/project/CaseStudyHeader.tsx`**

```tsx
import Image from 'next/image';
import { Container } from '@/components/primitives/Container';
import { Pill } from '@/components/primitives/Pill';
import { Reveal } from '@/components/motion/Reveal';
import { FadeIn } from '@/components/motion/FadeIn';
import type { Project } from '@/lib/schemas/project';

interface CaseStudyHeaderProps {
  project: Project;
}

export function CaseStudyHeader({ project }: CaseStudyHeaderProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-12 md:pt-28 md:pb-20">
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
      <Container className="relative">
        <FadeIn>
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
            Case study · {project.status}
          </p>
        </FadeIn>
        <h1 className="max-w-[20ch] font-serif text-[length:var(--text-h1)] leading-[1.02] tracking-tight text-[var(--color-fg)]">
          <Reveal>{project.title}</Reveal>
        </h1>
        <FadeIn delay={0.2} className="mt-6 max-w-[55ch]">
          <p className="text-lg text-[var(--color-fg-muted)] md:text-xl">{project.tagline}</p>
        </FadeIn>
        <FadeIn delay={0.3} className="mt-8 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Pill key={tech}>{tech}</Pill>
          ))}
        </FadeIn>
      </Container>

      <FadeIn delay={0.4} className="mt-16">
        <Container size="wide">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              priority
              sizes="(min-width: 1280px) 1100px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </FadeIn>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/project/CaseStudyMeta.tsx`**

```tsx
import Link from 'next/link';
import type { Project } from '@/lib/schemas/project';

interface CaseStudyMetaProps {
  project: Project;
}

const LINK_LABELS: Record<keyof Project['links'], string> = {
  github: 'GitHub',
  live: 'Live',
  demo: 'Demo',
  paper: 'Paper',
};

export function CaseStudyMeta({ project }: CaseStudyMetaProps) {
  const links = Object.entries(project.links).filter(([, url]) => !!url) as [
    keyof Project['links'],
    string,
  ][];

  return (
    <aside className="grid gap-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 md:grid-cols-3">
      <Field label="Role" value={project.role} />
      <Field label="Timeframe" value={project.timeframe} />
      <Field label="Status" value={project.status} />
      {project.metrics.length > 0 && (
        <div className="md:col-span-3">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
            Outcomes
          </p>
          <dl className="grid gap-6 md:grid-cols-3">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <dt className="text-sm text-[var(--color-fg-muted)]">{m.label}</dt>
                <dd className="font-serif text-3xl text-[var(--color-accent)]">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {links.length > 0 && (
        <div className="flex flex-wrap gap-3 md:col-span-3">
          {links.map(([key, url]) => (
            <Link
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-full border border-[var(--color-border)] px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {LINK_LABELS[key]} ↗
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
        {label}
      </p>
      <p className="text-[var(--color-fg)]">{value}</p>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/project/CaseStudyHeader.tsx components/project/CaseStudyMeta.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add case study header and meta components"
```

---

### Task 8.2: `CaseStudyGallery` and `CaseStudyNav`

**Files:**
- Create: `components/project/CaseStudyGallery.tsx`, `components/project/CaseStudyNav.tsx`

- [ ] **Step 1: Create `components/project/CaseStudyGallery.tsx`**

```tsx
import Image from 'next/image';
import { FadeIn } from '@/components/motion/FadeIn';
import type { Project } from '@/lib/schemas/project';

interface CaseStudyGalleryProps {
  gallery: Project['gallery'];
}

export function CaseStudyGallery({ gallery }: CaseStudyGalleryProps) {
  if (gallery.length === 0) return null;

  return (
    <section className="py-12">
      <div className="grid gap-8 md:grid-cols-2">
        {gallery.map((item, i) => (
          <FadeIn key={item.src} delay={i * 0.05}>
            <figure>
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {item.caption && (
                <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/project/CaseStudyNav.tsx`**

```tsx
import Link from 'next/link';
import type { Project } from '@/lib/schemas/project';

interface CaseStudyNavProps {
  previous?: Project;
  next?: Project;
}

export function CaseStudyNav({ previous, next }: CaseStudyNavProps) {
  return (
    <nav className="mt-20 flex flex-col gap-4 border-t border-[var(--color-border)] pt-12 md:flex-row md:justify-between">
      {previous ? (
        <Link
          href={`/projects/${previous.slug}`}
          className="group flex-1"
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
            ← Previous
          </p>
          <p className="font-serif text-xl text-[var(--color-fg)] group-hover:text-[var(--color-accent)]">
            {previous.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/projects/${next.slug}`}
          className="group flex-1 md:text-right"
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
            Next →
          </p>
          <p className="font-serif text-xl text-[var(--color-fg)] group-hover:text-[var(--color-accent)]">
            {next.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/project/CaseStudyGallery.tsx components/project/CaseStudyNav.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add case study gallery and nav components"
```

---

### Task 8.3: Case study route `app/(site)/projects/[slug]/page.tsx`

**Files:**
- Create: `app/(site)/projects/[slug]/page.tsx`

- [ ] **Step 1: Create the route file**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/primitives/Container';
import { CaseStudyHeader } from '@/components/project/CaseStudyHeader';
import { CaseStudyMeta } from '@/components/project/CaseStudyMeta';
import { CaseStudyGallery } from '@/components/project/CaseStudyGallery';
import { CaseStudyNav } from '@/components/project/CaseStudyNav';
import { MDXRenderer } from '@/components/mdx/MDXRenderer';
import {
  getAllProjects,
  getProjectMdxBySlug,
  getProjectSlugs,
} from '@/lib/content/projects';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const loaded = getProjectMdxBySlug(slug);
  if (!loaded) return {};
  const { project } = loaded;
  return {
    title: project.title,
    description: project.seo.description ?? project.tagline,
    openGraph: {
      title: project.seo.title ?? project.title,
      description: project.seo.description ?? project.tagline,
      images: [project.seo.ogImage ?? `/api/og?slug=${project.slug}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.seo.title ?? project.title,
      description: project.seo.description ?? project.tagline,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const loaded = getProjectMdxBySlug(slug);
  if (!loaded) notFound();
  const { project, body } = loaded;

  const all = getAllProjects();
  const index = all.findIndex((p) => p.slug === slug);
  const previous = index > 0 ? all[index - 1] : undefined;
  const next = index < all.length - 1 ? all[index + 1] : undefined;

  return (
    <article>
      <CaseStudyHeader project={project} />
      <Container size="narrow" className="mt-8">
        <CaseStudyMeta project={project} />
      </Container>
      <Container size="narrow" as="div" className="mt-16">
        <div className="prose-root">
          <MDXRenderer source={body} />
        </div>
      </Container>
      {project.gallery.length > 0 && (
        <Container size="wide" className="mt-8">
          <CaseStudyGallery gallery={project.gallery} />
        </Container>
      )}
      <Container size="narrow">
        <CaseStudyNav previous={previous} next={next} />
      </Container>
    </article>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/(site)/projects"
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add case study dynamic route"
```

---

## Phase 9: Secondary Pages

### Task 9.1: Projects index `/projects`

**Files:**
- Create: `app/(site)/projects/page.tsx`

- [ ] **Step 1: Create `app/(site)/projects/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { Section } from '@/components/primitives/Section';
import { ProjectCard } from '@/components/project/ProjectCard';
import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { getAllProjects } from '@/lib/content/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Every project Brian Cao has shipped or is actively building.',
};

export default function ProjectsIndexPage() {
  const projects = getAllProjects();

  return (
    <Section
      id="projects-index"
      eyebrow="Projects"
      title="Everything I've built"
      description="Shipped work, research projects, and things I'm still figuring out."
    >
      <StaggerGroup className="grid gap-8 md:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </StaggerGroup>
    </Section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/(site)/projects/page.tsx"
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add projects index page"
```

---

### Task 9.2: Writing index `/writing`

**Files:**
- Create: `app/(site)/writing/page.tsx`

- [ ] **Step 1: Create `app/(site)/writing/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/primitives/Section';
import { FadeIn } from '@/components/motion/FadeIn';
import { getMediumPosts } from '@/lib/writing/medium';
import { formatDate } from '@/lib/utils/format';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Long-form notes and essays by Brian Cao, syndicated from Medium.',
};

export const revalidate = 3600;

export default async function WritingPage() {
  const posts = await getMediumPosts();

  return (
    <Section
      id="writing-index"
      eyebrow="Writing"
      title="Notes & essays"
      description="Originally published on Medium. Full posts live there; previews live here."
      containerSize="narrow"
    >
      {posts.length === 0 ? (
        <p className="text-[var(--color-fg-muted)]">
          No posts yet — check back soon, or{' '}
          <Link
            href="https://medium.com/@brianc40722"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] hover:underline"
          >
            read on Medium
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-[var(--color-border)]">
          {posts.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.04} as="li">
              <Link
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-5 py-8 md:flex-row md:items-start"
              >
                {post.thumbnail && (
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg border border-[var(--color-border)] md:w-56">
                    <Image
                      src={post.thumbnail}
                      alt=""
                      fill
                      sizes="224px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                    {formatDate(post.publishedAt)} · {post.readingTime ?? '—'}
                  </p>
                  <h3 className="font-serif text-2xl text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)]">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--color-fg-muted)] line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </ul>
      )}
    </Section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/(site)/writing"
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add writing index page"
```

---

### Task 9.3: Resume page `/resume`

**Files:**
- Create: `app/(site)/resume/page.tsx`
- Add: `public/resume/BrianCao-Resume.pdf` (manual)

- [ ] **Step 1: Copy resume PDF**

```bash
mkdir -p public/resume
cp "/c/Users/bcfra/Downloads/Brian Cao 03_09 Resume .docx" public/resume/BrianCao-Resume.docx
```

Export the `.docx` to PDF using Word or LibreOffice and save as `public/resume/BrianCao-Resume.pdf`.

- [ ] **Step 2: Create `app/(site)/resume/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { Container } from '@/components/primitives/Container';
import { Button } from '@/components/primitives/Button';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Brian Cao — Full-stack engineer. Stony Brook CS Honors, Class of 2027.',
};

const RESUME_PATH = '/resume/BrianCao-Resume.pdf';

export default function ResumePage() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              Resume
            </p>
            <h1 className="font-serif text-[length:var(--text-h1)] leading-[1.05] text-[var(--color-fg)]">
              Brian Cao
            </h1>
          </div>
          <div className="flex gap-3">
            <Button href={RESUME_PATH}>Download PDF</Button>
            <Button href="mailto:brianc40722@gmail.com" variant="secondary">
              Email me
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <object
            data={RESUME_PATH}
            type="application/pdf"
            className="block h-[80vh] w-full"
            aria-label="Resume PDF"
          >
            <p className="p-6 text-[var(--color-fg-muted)]">
              Your browser can't display PDFs inline.{' '}
              <a href={RESUME_PATH} className="text-[var(--color-accent)]">
                Download the PDF
              </a>{' '}
              instead.
            </p>
          </object>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/resume" public/resume
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add resume page with embedded pdf"
```

---

### Task 9.4: `not-found.tsx`

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1: Create `app/not-found.tsx`**

```tsx
import Link from 'next/link';
import { Container } from '@/components/primitives/Container';
import { Button } from '@/components/primitives/Button';

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center">
      <Container className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
          404
        </p>
        <h1 className="mt-4 font-serif text-[length:var(--text-h1)] leading-[1.02] text-[var(--color-fg)]">
          Lost in <em className="italic text-[var(--color-accent)]">space</em>.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[var(--color-fg-muted)]">
          The page you're looking for doesn't exist. Maybe it was renamed, moved, or never shipped.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Button href="/">Go home</Button>
          <Link
            href="/projects"
            className="inline-flex h-11 items-center rounded-full border border-[var(--color-border)] px-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg)] hover:border-[var(--color-accent)]"
          >
            Browse projects
          </Link>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/not-found.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add 404 not found page"
```

---

## Phase 10: API Routes

### Task 10.1: Contact form API (`/api/contact`)

**Files:**
- Create: `app/api/contact/route.ts`, `tests/unit/contact-schema.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it } from 'vitest';
import { contactPayloadSchema } from '@/app/api/contact/schema';

describe('contactPayloadSchema', () => {
  it('accepts a valid payload', () => {
    const result = contactPayloadSchema.safeParse({
      name: 'Alice',
      email: 'alice@example.com',
      message: 'Hello Brian, this is a real message.',
      website: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short messages', () => {
    const result = contactPayloadSchema.safeParse({
      name: 'Al',
      email: 'alice@example.com',
      message: 'hi',
      website: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects when honeypot is filled', () => {
    const result = contactPayloadSchema.safeParse({
      name: 'Bot',
      email: 'bot@bad.com',
      message: 'A valid looking message here.',
      website: 'spam',
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run (expect fail)**

```bash
pnpm test contact-schema
```

- [ ] **Step 3: Create `app/api/contact/schema.ts`**

```ts
import { z } from 'zod';

export const contactPayloadSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  message: z.string().min(10).max(4000),
  website: z
    .string()
    .max(0, 'honeypot must be empty')
    .optional()
    .transform((v) => v ?? ''),
});

export type ContactPayload = z.infer<typeof contactPayloadSchema>;
```

- [ ] **Step 4: Create `app/api/contact/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { serverEnv } from '@/lib/env';
import { contactPayloadSchema } from './schema';

export const runtime = 'edge';

type Bucket = { count: number; ts: number };
const RATE_LIMIT: Map<string, Bucket> = (globalThis as unknown as {
  __contactRate?: Map<string, Bucket>;
}).__contactRate ?? new Map();
(globalThis as unknown as { __contactRate?: Map<string, Bucket> }).__contactRate = RATE_LIMIT;

const WINDOW_MS = 60_000;
const LIMIT = 3;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = RATE_LIMIT.get(ip);
  if (!bucket || now - bucket.ts > WINDOW_MS) {
    RATE_LIMIT.set(ip, { count: 1, ts: now });
    return false;
  }
  bucket.count += 1;
  return bucket.count > LIMIT;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = contactPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (!serverEnv.RESEND_API_KEY) {
    console.warn('[contact] RESEND_API_KEY missing — logging only', parsed.data);
    return NextResponse.json({ ok: true, mocked: true });
  }

  try {
    const resend = new Resend(serverEnv.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: serverEnv.CONTACT_FROM_EMAIL,
      to: serverEnv.CONTACT_TO_EMAIL,
      replyTo: parsed.data.email,
      subject: `Portfolio — ${parsed.data.name}`,
      text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] resend failed', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
```

- [ ] **Step 5: Run tests**

```bash
pnpm test contact-schema
```
Expected: 3 passing.

- [ ] **Step 6: Commit**

```bash
git add app/api/contact tests/unit/contact-schema.test.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add contact api route with resend and rate limiting"
```

---

### Task 10.2: OG image API (`/api/og`)

**Files:**
- Create: `app/api/og/route.tsx`

- [ ] **Step 1: Create `app/api/og/route.tsx`**

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Brian Cao';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'Brian Cao';
  const subtitle =
    searchParams.get('subtitle') ?? 'Full-stack engineer building systems at the edge of software and AI';
  const eyebrow = searchParams.get('eyebrow') ?? 'PORTFOLIO';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px 72px',
        background:
          'radial-gradient(ellipse at 70% 40%, #f59e0b33 0%, transparent 55%), #0b0a08',
        color: '#f4f1ea',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 16,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#8a8578',
        }}
      >
        <span>{eyebrow}</span>
        <span>briancao.dev</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 900 }}>
        <h1
          style={{
            fontSize: 88,
            fontFamily: 'serif',
            lineHeight: 0.98,
            color: '#f4f1ea',
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 28, color: '#a7a198', marginTop: 24, maxWidth: 820 }}>{subtitle}</p>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 16,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#8a8578',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              width: 10,
              height: 10,
              background: '#fbbf24',
              borderRadius: 999,
              marginRight: 12,
            }}
          />
          Available · Summer 2026
        </span>
        <span>Brian Cao · Stony Brook '27</span>
      </div>
    </div>,
    size,
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/og
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add dynamic og image route"
```

---

### Task 10.3: Dynamic favicon `app/icon.tsx`

**Files:**
- Create: `app/icon.tsx`

- [ ] **Step 1: Create `app/icon.tsx`**

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0a08',
        color: '#fbbf24',
        fontSize: 22,
        fontFamily: 'serif',
        fontStyle: 'italic',
        fontWeight: 600,
        borderRadius: 6,
      }}
    >
      b
    </div>,
    size,
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/icon.tsx
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add dynamic favicon"
```

---

## Phase 11: SEO Infrastructure

### Task 11.1: Metadata helper

**Files:**
- Create: `lib/seo/metadata.ts`, `tests/unit/metadata.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it } from 'vitest';
import { buildMetadata } from '@/lib/seo/metadata';

describe('buildMetadata', () => {
  it('produces absolute og image urls', () => {
    const meta = buildMetadata({
      title: 'Advising Bot',
      description: 'A RAG agent',
      path: '/projects/advising-bot',
    });
    const og = meta.openGraph;
    expect(og?.url).toContain('/projects/advising-bot');
    expect(Array.isArray(og?.images) ? og?.images?.[0] : undefined).toBeDefined();
  });
});
```

- [ ] **Step 2: Run (expect fail)**

```bash
pnpm test metadata
```

- [ ] **Step 3: Create `lib/seo/metadata.ts`**

```ts
import type { Metadata } from 'next';
import { publicEnv } from '@/lib/env';

interface BuildMetadataInput {
  title: string;
  description: string;
  path?: string;
  ogImageQuery?: Record<string, string>;
  type?: 'website' | 'article';
  publishedTime?: string;
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const url = new URL(input.path ?? '/', publicEnv.NEXT_PUBLIC_SITE_URL).toString();
  const ogParams = new URLSearchParams({ title: input.title, ...(input.ogImageQuery ?? {}) });
  const ogImage = `${publicEnv.NEXT_PUBLIC_SITE_URL}/api/og?${ogParams.toString()}`;

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      type: input.type ?? 'website',
      title: input.title,
      description: input.description,
      url,
      siteName: 'Brian Cao',
      images: [{ url: ogImage, width: 1200, height: 630, alt: input.title }],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [ogImage],
    },
  };
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test metadata
```
Expected: passing.

- [ ] **Step 5: Commit**

```bash
git add lib/seo/metadata.ts tests/unit/metadata.test.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add metadata helper"
```

---

### Task 11.2: `sitemap.ts` and `robots.ts`

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`

- [ ] **Step 1: Create `app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next';
import { publicEnv } from '@/lib/env';
import { getProjectSlugs } from '@/lib/content/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/writing`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/resume`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
  const projectRoutes: MetadataRoute.Sitemap = getProjectSlugs().map((slug) => ({
    url: `${base}/projects/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  return [...staticRoutes, ...projectRoutes];
}
```

- [ ] **Step 2: Create `app/robots.ts`**

```ts
import type { MetadataRoute } from 'next';
import { publicEnv } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add sitemap and robots routes"
```

---

### Task 11.3: RSS feed and manifest

**Files:**
- Create: `app/rss.xml/route.ts`, `app/manifest.ts`

- [ ] **Step 1: Create `app/rss.xml/route.ts`**

```ts
import { publicEnv } from '@/lib/env';
import { getAllProjects } from '@/lib/content/projects';
import { getMediumPosts } from '@/lib/writing/medium';

export const revalidate = 3600;

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const now = new Date().toUTCString();

  const projectItems = getAllProjects().map(
    (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${base}/projects/${p.slug}</link>
      <guid>${base}/projects/${p.slug}</guid>
      <description>${escapeXml(p.tagline)}</description>
      <pubDate>${now}</pubDate>
    </item>
  `,
  );

  const mediumItems = (await getMediumPosts()).map(
    (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(post.link)}</link>
      <guid>${escapeXml(post.id)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>
  `,
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Brian Cao</title>
    <link>${base}</link>
    <description>Projects and writing from Brian Cao — full-stack engineer.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    ${projectItems.join('')}${mediumItems.join('')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
```

- [ ] **Step 2: Create `app/manifest.ts`**

```ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Brian Cao',
    short_name: 'Brian Cao',
    description: 'Full-stack engineer building systems at the edge of software and AI.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0a08',
    theme_color: '#0b0a08',
    icons: [{ src: '/icon', sizes: '32x32', type: 'image/png' }],
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add app/rss.xml app/manifest.ts
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add rss feed and web manifest"
```

---

### Task 11.4: `StructuredData` JSON-LD

**Files:**
- Create: `components/seo/StructuredData.tsx`

- [ ] **Step 1: Create `components/seo/StructuredData.tsx`**

```tsx
import { publicEnv } from '@/lib/env';

interface StructuredDataProps {
  type?: 'person' | 'article';
  title?: string;
  description?: string;
  url?: string;
  datePublished?: string;
}

export function StructuredData(props: StructuredDataProps = {}) {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Brian Cao',
    url: base,
    jobTitle: 'Full-stack engineer',
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Stony Brook University',
    },
    sameAs: [
      'https://github.com/BrianASC23',
      'https://linkedin.com/in/brian-cao-7b9a89211',
      'https://medium.com/@brianc40722',
    ],
    email: 'mailto:brianc40722@gmail.com',
  };

  const article =
    props.type === 'article'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: props.title,
          description: props.description,
          url: props.url,
          author: { '@type': 'Person', name: 'Brian Cao' },
          datePublished: props.datePublished,
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: json-ld
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      {article && (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: json-ld
          dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
        />
      )}
    </>
  );
}
```

- [ ] **Step 2: Mount `<StructuredData />` in `app/(site)/layout.tsx`**

Open `app/(site)/layout.tsx` and add:
```tsx
import { StructuredData } from '@/components/seo/StructuredData';
// ...
return (
  <SmoothScrollProvider>
    <StructuredData />
    {/* ...rest */}
  </SmoothScrollProvider>
);
```

- [ ] **Step 3: Commit**

```bash
git add components/seo/StructuredData.tsx "app/(site)/layout.tsx"
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "feat: add json-ld structured data"
```

---

## Phase 12: Testing & CI

### Task 12.1: E2E — homepage happy path

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`
- Create: `tests/e2e/homepage.spec.ts`

- [ ] **Step 1: Replace `tests/e2e/homepage.spec.ts` (or create it) with richer flows**

```ts
import { expect, test } from '@playwright/test';

test.describe('homepage', () => {
  test('renders hero, sections, and nav', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /brian/i, level: 1 })).toBeVisible();
    await expect(page.getByRole('region', { name: /about/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /selected work/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /experience/i })).toBeVisible();
    await expect(page.getByRole('region', { name: /contact/i })).toBeVisible();
  });

  test('hero cta scrolls to work section', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'View work' }).first().click();
    await expect(page).toHaveURL(/#work$/);
  });

  test('command palette opens via ⌘K', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Meta+K');
    await expect(page.getByPlaceholder(/type a command/i)).toBeVisible();
  });
});
```

- [ ] **Step 2: Create `tests/e2e/case-study.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

test('advising bot case study renders', async ({ page }) => {
  await page.goto('/projects/advising-bot');
  await expect(page.getByRole('heading', { name: 'Advising Bot', level: 1 })).toBeVisible();
  await expect(page.getByText('Case study · in-progress')).toBeVisible();
});
```

- [ ] **Step 3: Create `tests/e2e/writing.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

test('writing index loads', async ({ page }) => {
  await page.goto('/writing');
  await expect(page.getByRole('heading', { name: /notes/i, level: 2 })).toBeVisible();
});
```

- [ ] **Step 4: Commit**

```bash
git add tests/e2e
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "test: add e2e coverage for homepage, case study, writing"
```

---

### Task 12.2: Accessibility smoke test

**Files:**
- Create: `tests/e2e/a11y.spec.ts`

- [ ] **Step 1: Install axe**

```bash
pnpm add -D @axe-core/playwright
```

- [ ] **Step 2: Create `tests/e2e/a11y.spec.ts`**

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('a11y', () => {
  for (const path of ['/', '/projects', '/projects/advising-bot', '/writing', '/resume']) {
    test(`no critical a11y violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .disableRules(['color-contrast']) // validated manually against OKLCH palette
        .analyze();
      const critical = results.violations.filter((v) => v.impact === 'critical');
      expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
    });
  }
});
```

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/a11y.spec.ts package.json pnpm-lock.yaml
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "test: add axe a11y smoke suite"
```

---

### Task 12.3: Visual regression (Playwright screenshots)

**Files:**
- Create: `tests/e2e/visual.spec.ts`

- [ ] **Step 1: Create `tests/e2e/visual.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

test.describe('visual regression', () => {
  test.beforeEach(async ({ page }) => {
    // Stabilize animation for screenshots
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('homepage above the fold', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-hero.png', { fullPage: false, maxDiffPixelRatio: 0.02 });
  });

  test('projects index', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('projects-index.png', { fullPage: true, maxDiffPixelRatio: 0.02 });
  });
});
```

- [ ] **Step 2: Generate baseline screenshots**

```bash
pnpm test:e2e --update-snapshots
```
Expected: screenshots saved to `tests/e2e/visual.spec.ts-snapshots/`.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/visual.spec.ts tests/e2e/visual.spec.ts-snapshots
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "test: add visual regression baseline"
```

---

### Task 12.4: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Lint · Typecheck · Unit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test

  e2e:
    name: E2E (Playwright)
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm build
      - run: pnpm test:e2e
        env:
          NEXT_PUBLIC_SITE_URL: http://localhost:3000
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
          retention-days: 7
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "ci: add github actions workflow for lint, typecheck, unit, and e2e"
```

---

### Task 12.5: Lighthouse CI

**Files:**
- Create: `lighthouserc.json`, `.github/workflows/lighthouse.yml`

- [ ] **Step 1: Install Lighthouse CI**

```bash
pnpm add -D @lhci/cli
```

- [ ] **Step 2: Create `lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm start",
      "url": ["http://localhost:3000/", "http://localhost:3000/projects", "http://localhost:3000/writing"],
      "numberOfRuns": 2,
      "settings": { "preset": "desktop" }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

- [ ] **Step 3: Create `.github/workflows/lighthouse.yml`**

```yaml
name: Lighthouse

on:
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm exec lhci autorun
```

- [ ] **Step 4: Commit**

```bash
git add lighthouserc.json .github/workflows/lighthouse.yml package.json pnpm-lock.yaml
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "ci: add lighthouse ci performance gates"
```

---

## Phase 13: Deployment & Docs

### Task 13.1: `README.md`

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

```markdown
# Brian Cao — Portfolio

Personal portfolio for [Brian Cao](https://github.com/BrianASC23) — a full-stack engineer and Stony Brook CS Honors student. Dark-tech aesthetic with an R3F shader hero, MDX-driven case studies, and a Medium-fed writing feed.

## Stack

- **Framework:** Next.js 15 App Router · React 19 · TypeScript strict
- **Styling:** Tailwind CSS v4 (`@theme`) · OKLCH color space · self-hosted fonts
- **Content:** File-based MDX with Zod-validated frontmatter · Medium RSS
- **Motion:** Framer Motion · Lenis smooth scroll · @react-three/fiber
- **Testing:** Vitest · Playwright · axe-core · Lighthouse CI
- **Deploy:** Vercel

## Local development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Visit http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Next.js dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | Biome lint + format check |
| `pnpm lint:fix` | Auto-fix lint & formatting |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest unit tests |
| `pnpm test:e2e` | Playwright E2E suite |

## Content

- **Projects:** add MDX files in `content/projects/`. Frontmatter is validated by `lib/schemas/project.ts`.
- **Experience:** add MDX files in `content/experience/`.
- **Bio & toolbelt:** edit `content/site/bio.mdx` and `content/site/toolbelt.json`.
- **Writing:** posts are pulled from Medium via RSS. No local authoring.

## Architecture notes

- **Sections are dumb presenters.** They never import each other. Pages compose them.
- **Primitives consume tokens.** No raw hex values outside `globals.css`.
- **Content loaders are the only filesystem touch-points for MDX.**
- **R3F canvas is dynamic-imported behind a static fallback** to protect LCP.
- **Every animated component has a reduced-motion fallback.**

## Deploying

Push to `main`. Vercel auto-deploys the production branch. Preview deploys run for every PR.

Environment variables required in production (set in Vercel dashboard):

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_MEDIUM_FEED`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

## License

MIT — see [LICENSE](./LICENSE).
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "docs: add readme"
```

---

### Task 13.2: `LICENSE` and `ROADMAP.md`

**Files:**
- Create: `LICENSE`, `ROADMAP.md`

- [ ] **Step 1: Create `LICENSE` (MIT)**

```
MIT License

Copyright (c) 2026 Brian Cao

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: Create `ROADMAP.md`**

```markdown
# Portfolio Roadmap

The MVP ships in one week. This file tracks the post-launch queue — Level 3 ideas that were
deferred to keep the MVP scope honest.

## Post-launch (Level 3)

- [ ] **Terminal mode.** `/terminal` route that renders the site as a simulated shell with `ls`, `cd`, `cat` commands.
- [ ] **Interactive Advising Bot demo.** Embed a live chat with the RAG agent on its case study page.
- [ ] **Live visitor cursors.** Ephemeral shared cursors on the homepage via Pusher/Ably.
- [ ] **Shader playground.** `/play/shaders` showcasing the hero shaders with real-time uniform controls.
- [ ] **Mini games hub.** A small collection of canvas experiments (Conway's Game of Life, particle toys).
- [ ] **"Now" page.** A dated journal of what I'm learning and working on.
- [ ] **Guestbook / signed wall.** Anonymous signed messages with SMS/email notifications.
- [ ] **Light mode.** Dark-only at launch; add a toggle with carefully tuned warm-light palette.

## Ongoing maintenance

- Refresh projects quarterly.
- Replace the placeholder portrait once I have a real photo.
- Swap `placeholder-portrait.jpg` with a real asset before launch.
- Upgrade dependencies monthly.
```

- [ ] **Step 3: Commit**

```bash
git add LICENSE ROADMAP.md
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "docs: add license and roadmap"
```

---

### Task 13.3: PR template

**Files:**
- Create: `.github/pull_request_template.md`

- [ ] **Step 1: Create the template**

```markdown
## What

<!-- One paragraph describing what this PR changes. -->

## Why

<!-- What problem does this solve? -->

## Testing

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm test:e2e`
- [ ] Manual QA on the affected pages

## Screenshots

<!-- Before/after screenshots for visual changes. -->

## Notes for reviewer

<!-- Anything unusual, tradeoffs, or followups. -->
```

- [ ] **Step 2: Commit**

```bash
git add .github/pull_request_template.md
git -c user.name="Brian Cao" -c user.email="brianc40722@gmail.com" commit -m "docs: add pr template"
```

---

### Task 13.4: Vercel deploy

**Files:** (no new files — instructions only)

- [ ] **Step 1: Push to GitHub**

```bash
git remote add origin git@github.com:BrianASC23/portfolio.git
git push -u origin main
```
(If the remote already exists, skip the `remote add`.)

- [ ] **Step 2: Link Vercel**

```bash
pnpm dlx vercel link
```
Pick the `BrianASC23/portfolio` project. This creates `.vercel/` locally (already gitignored).

- [ ] **Step 3: Set environment variables**

```bash
pnpm dlx vercel env add NEXT_PUBLIC_SITE_URL production
# Enter: https://briancao.dev
pnpm dlx vercel env add NEXT_PUBLIC_MEDIUM_FEED production
# Enter: https://medium.com/feed/@brianc40722
pnpm dlx vercel env add RESEND_API_KEY production
# Enter: the Resend API key
pnpm dlx vercel env add CONTACT_TO_EMAIL production
pnpm dlx vercel env add CONTACT_FROM_EMAIL production
```
Repeat for `preview` and `development` environments as needed.

- [ ] **Step 4: Trigger a production deploy**

```bash
pnpm dlx vercel --prod
```
Expected: build succeeds, site live at Vercel-assigned URL.

- [ ] **Step 5: Configure custom domain (once purchased)**

In Vercel dashboard → Project → Settings → Domains → add `briancao.dev` and the www variant. Follow the DNS instructions Vercel provides for your registrar (Namecheap/Cloudflare/etc.).

- [ ] **Step 6: Smoke test production**

```bash
curl -I https://briancao.dev
```
Expected: `200 OK`. Open the site in a browser and verify:
- Hero loads the 3D canvas (or static fallback on reduced motion)
- All sections render
- Case study links work
- Contact form sends a test message
- `/sitemap.xml`, `/robots.txt`, and `/api/og` respond

---

### Task 13.5: Final verification sweep

**Files:** (no new files — verification only)

- [ ] **Step 1: Run all gates locally**

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```
Expected: every command exits 0.

- [ ] **Step 2: Run E2E against the production build**

```bash
pnpm test:e2e
```
Expected: all suites pass including visual regression.

- [ ] **Step 3: Lighthouse locally (sanity check)**

```bash
pnpm build && pnpm start &
pnpm dlx lighthouse http://localhost:3000 --view
```
Expected: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 90.

Stop the server (`kill %1` or Ctrl+C).

- [ ] **Step 4: Update the `tasks/todo.md` review section (per user workflow)**

Append a short review to `tasks/todo.md` summarizing what shipped in the MVP and any items now tracked in `ROADMAP.md`.

- [ ] **Step 5: Tag the MVP release**

```bash
git tag -a v0.1.0 -m "MVP launch"
git push origin v0.1.0
```

---

## Completion Checklist

- [ ] All 13 phases implemented
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e` all pass
- [ ] Homepage renders all sections with animations
- [ ] At least 5 project case studies render with full MDX bodies
- [ ] Medium feed populates writing section
- [ ] Contact form sends mail via Resend (or logs in dev)
- [ ] `/sitemap.xml`, `/robots.txt`, `/rss.xml`, `/manifest.webmanifest`, `/api/og` all respond
- [ ] Lighthouse scores: Performance ≥ 90, A11y ≥ 95, SEO ≥ 95
- [ ] Deployed to Vercel with production domain
- [ ] README, ROADMAP, LICENSE committed

---

