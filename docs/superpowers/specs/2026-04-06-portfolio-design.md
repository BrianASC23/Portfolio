# Brian Cao — Personal Portfolio Design Spec

**Status:** Draft for approval
**Author:** Brian Cao (brainstormed with Claude)
**Date:** 2026-04-06
**Target launch:** Week-one MVP, iterative polish thereafter

---

## 1. Overview

A high-craft personal portfolio site for **Brian Cao**, Stony Brook CS Honors student (class of 2027) targeting internship and new-grad recruiters. The site itself is the demo — the stack, animations, and polish showcase senior-level front-end + systems engineering skill, while still delivering information clearly.

The brand story is **"full-stack builder with an AI/ML lean"**, grounded by the bio's thoughtful, craft-oriented tone. Visuals lean into a warm dark-tech aesthetic: near-black base, amber accent, editorial serif display, and a custom GLSL shader hero that signals "this person actually writes graphics code."

The content strategy is lean by design: five flagship projects with deep case studies, an experience timeline, a Medium-fed writing section, and a downloadable resume. Nothing extraneous. Every pixel earns its place.

## 2. Goals and non-goals

### Goals

1. **Impress recruiters in the first five seconds** with a shader-backed hero and precise micro-interactions.
2. **Communicate Brian's identity and projects clearly** without sacrificing visual depth — the copy is concise, the story is legible, the CTAs are obvious.
3. **Rank #1 for the query "brian cao"** and associated long-tail queries (`brian cao stony brook`, `brian cao developer`, project names).
4. **Ship a polished MVP in roughly one week**, then iterate.
5. **Be maintainable forever.** Content is Git-tracked MDX; adding a project is one file; swapping Medium for a native blog is one module.
6. **Demonstrate senior engineering discipline** through the codebase itself — strict typing, tests, CI gates, performance budgets, accessibility compliance.

### Non-goals

- **Light mode in MVP.** Deferred to v1.1. Dark-only ships first.
- **A native blog.** Writing comes from Medium via RSS in v1. Native MDX blog is on the post-launch roadmap.
- **Headless CMS.** Overkill for a solo portfolio.
- **Service worker / PWA.** No offline use case; skipping.
- **Generic "developer portfolio" SEO.** Saturated and low-intent. Focusing on name + specific projects.
- **Level-3 animation features in MVP** except the Three.js hero (terminal easter egg, live GitHub graph, Konami, boot sequence, sound, pinned scrollytelling are roadmap).

## 3. Decisions at a glance

| Area | Decision |
|---|---|
| Identity | Brian Cao · Stony Brook CS Honors '27 · full-stack + AI/ML lean |
| Audience | Recruiters and engineering hiring managers |
| Stack | Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · MDX · pnpm |
| Hosting | Vercel (Git-integrated) |
| Site structure | Hybrid: rich single-page home + dedicated case study routes + writing + resume |
| Content management | File-based MDX with Zod-validated frontmatter (Approach 1, "Lean MDX monolith") |
| Writing section | Medium RSS pull (`@brianc40722`), ISR cached 1 h, empty-state fallback on failure |
| Contact | Form via Resend + email link + social row (all three) |
| Analytics | Vercel Analytics + Vercel Speed Insights |
| GitHub handle | `BrianASC23` (unchanged) |
| Resume | PDF hosted at `/resume.pdf` (converted from `.docx`) |
| Domain | TBD — `briancao.dev` preferred; registration instructions included in the plan |
| Visual direction | Dark Tech (near-black warm base, subtle grid, gradient text) |
| Accent | Amber Warm-Tech — `#FBBF24` / `#F59E0B` in oklch |
| Typography | Instrument Serif (display) + Inter (body) + JetBrains Mono (metadata), self-hosted |
| Hero treatment | Three.js / R3F shader-displaced icosphere with custom GLSL noise, amber emissive, cursor-reactive |
| Animation tier | Level 2 (Framer Motion + Lenis + cmdk + 3D tilt + custom cursor + View Transitions) plus one Level 3 feature (R3F hero) |
| Featured projects | 5: Advising Bot · Financial News Sentiment RNN · Playlister · Fuzzer · Custom Heap |

## 4. Architecture

### 4.1 Stack

- **Framework:** Next.js 15 (App Router, React Server Components, Turbopack dev)
- **Language:** TypeScript strict — `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`
- **Styling:** Tailwind CSS v4 with `@theme` CSS-variable tokens, no runtime CSS-in-JS
- **Content:** MDX via `next-mdx-remote/rsc`, Zod-validated frontmatter
- **Animation:** Framer Motion (default), Lenis (smooth scroll), `@react-three/fiber` + `drei` (hero only, dynamic), `cmdk` (palette), `@use-gesture/react` (cursor + tilt)
- **Forms:** Resend API for contact email delivery
- **Analytics:** Vercel Analytics + Speed Insights
- **Package manager:** pnpm
- **Linter/formatter:** Biome (single tool, faster than ESLint)
- **Tests:** Vitest (unit) + Playwright (E2E + visual regression)
- **CI:** GitHub Actions
- **Deploy:** Vercel production + PR previews

### 4.2 Routing

All routes are statically generated at build time unless noted.

| Route | Purpose | Rendering |
|---|---|---|
| `/` | Single-page home (hero, about, work, experience, toolbelt, writing, contact) | SSG |
| `/projects` | Full project index | SSG |
| `/projects/[slug]` | MDX-driven case study | SSG via `generateStaticParams` |
| `/writing` | Medium RSS feed + any native posts | ISR, revalidate 3600 s |
| `/resume` | PDF viewer page + direct download link | SSG |
| `/api/contact` | Resend handler for the contact form | Edge runtime |
| `/api/og` | Dynamic OG image generator (satori) | Edge runtime |
| `/sitemap.xml` | Auto-generated from content loaders | SSG |
| `/robots.txt` | Allow all, disallow `/api/*` | SSG |
| `/rss.xml` | Combined project + Medium feed | ISR |
| `/icon` | Dynamic favicon via satori | Edge runtime |

### 4.3 File layout

```
portfolio/
├── app/
│   ├── (site)/
│   │   ├── page.tsx                    # homepage composition
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── writing/page.tsx
│   │   └── resume/page.tsx
│   ├── api/
│   │   ├── contact/route.ts
│   │   └── og/route.tsx
│   ├── layout.tsx                      # fonts, theme, analytics, Lenis provider
│   ├── globals.css                     # Tailwind v4 theme + CSS vars
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── rss.xml/route.ts
│   ├── icon.tsx
│   └── not-found.tsx
├── components/
│   ├── primitives/                     # Container, Section, Heading, Text, Button, Pill, Link, Icon
│   ├── motion/                         # FadeIn, Reveal, StaggerGroup, TextSplit, Magnetic, Marquee, Tilt3D, Parallax, TextScramble
│   ├── mdx/                            # Callout, Diagram, Video, CodeBlock, Quote, Columns, Metrics
│   ├── nav/                            # TopBar, CommandPalette, ScrollProgress, MobileMenu, ThemeToggle
│   ├── cursor/                         # CursorLayer, CursorDot, CursorRing
│   ├── hero/                           # Hero3DCanvas (dynamic), ShaderBlob, HeroStaticFallback
│   ├── project-card/                   # project-card.tsx, shell, media, meta, hover
│   ├── sections/                       # HomeHero, About, SelectedWork, Experience, Toolbelt, Writing, Contact
│   └── case-study/                     # CaseStudyHeader, CaseStudyMeta, CaseStudyGallery, CaseStudyNav, ContactCta
├── content/
│   ├── projects/
│   │   ├── advising-bot.mdx
│   │   ├── financial-sentiment-rnn.mdx
│   │   ├── playlister.mdx
│   │   ├── fuzzer.mdx
│   │   └── custom-heap.mdx
│   └── about.mdx
├── lib/
│   ├── content.ts                      # MDX loader + Zod validation
│   ├── schemas/
│   │   └── project.ts                  # Zod project schema
│   ├── medium.ts                       # RSS fetch + parse + cache
│   ├── metadata.ts                     # SEO helpers (buildMetadata)
│   ├── commands.ts                     # Command palette registry
│   ├── motion.ts                       # ease, duration, stagger constants
│   ├── cursor.ts                       # useCursorPosition + cursor state context
│   ├── lenis.ts                        # LenisProvider + useLenisScroll
│   ├── reduced-motion.ts               # useReducedMotion
│   └── utils.ts                        # cn, formatters
├── public/
│   ├── fonts/                          # Instrument Serif, Inter, JetBrains Mono (self-hosted)
│   ├── projects/<slug>/                # screenshots, videos, diagrams
│   ├── og/                             # static OG fallback
│   └── resume.pdf
├── tests/
│   ├── unit/                           # Vitest specs
│   └── e2e/                            # Playwright specs
├── .env.example
├── .gitignore
├── biome.json
├── next.config.ts
├── package.json
├── playwright.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── vitest.config.ts
├── README.md
├── LICENSE
└── ROADMAP.md
```

### 4.4 Modularity principles (apply throughout the repo)

- **Single responsibility per module.** Every `lib/*` file has one exported public interface.
- **Pages are thin compositions.** They fetch data once and hand it to sections. They contain zero animation logic, zero styles beyond layout, zero business logic.
- **Sections are dumb presenters.** They accept data via props, consume primitives and motion wrappers, never touch loaders or Framer Motion directly.
- **Primitives consume tokens.** No hard-coded colors, sizes, or durations anywhere outside `globals.css` and `lib/motion.ts`.
- **Loaders have a stable public API.** `lib/content.ts` and `lib/medium.ts` can swap their internals (Velite, Sanity, a different blog platform) without touching any page.

## 5. Design system

### 5.1 Theme strategy

**Dark-only for MVP.** Light mode is on the roadmap — it doubles the design work and 95% of recruiter traffic hits once and never toggles. Nav has space reserved for a theme toggle that ships in v1.1.

### 5.2 Color tokens (oklch, exposed as CSS variables)

```css
@theme {
  /* Base — warm dark, not pure black */
  --color-bg:            oklch(0.16 0.01 60);      /* #0b0a08 */
  --color-bg-elevated:   oklch(0.20 0.012 60);
  --color-bg-subtle:     oklch(0.23 0.014 60);
  --color-border:        oklch(0.30 0.015 60 / 0.6);
  --color-border-strong: oklch(0.45 0.02 60 / 0.5);

  /* Foreground */
  --color-fg:            oklch(0.97 0.005 80);
  --color-fg-muted:      oklch(0.72 0.015 70);
  --color-fg-subtle:     oklch(0.55 0.01 65);

  /* Accent — amber warm-tech */
  --color-accent:        oklch(0.78 0.16 75);      /* ~#fbbf24 */
  --color-accent-hi:     oklch(0.85 0.17 80);
  --color-accent-lo:     oklch(0.68 0.14 70);
  --color-accent-glow:   oklch(0.78 0.16 75 / 0.35);

  /* Semantic */
  --color-success:       oklch(0.75 0.15 150);
  --color-danger:        oklch(0.70 0.20 25);
}
```

Contrast verification (WCAG 2.2):
- `--color-accent` on `--color-bg` → ~10.3:1 ✅ AAA
- `--color-fg-muted` on `--color-bg` → ~7.8:1 ✅ AAA
- `--color-fg` on `--color-bg` → ~17:1 ✅ AAA

### 5.3 Typography

Self-hosted via `next/font/local` (zero CLS, zero third-party request):

| Token | Family | Weights | Use |
|---|---|---|---|
| `font-display` | Instrument Serif | 400, 400-italic | Hero name, section headings, pull quotes |
| `font-sans` | Inter Variable | 400–700 | Body, UI, nav, buttons |
| `font-mono` | JetBrains Mono | 400, 500 | Metadata, code, pills, labels |

**Fluid type scale** (clamp-based, scales smoothly mobile → desktop):

```
text-xs     → clamp(0.75rem,   0.72rem + 0.15vw, 0.8125rem)
text-sm     → clamp(0.8125rem, 0.78rem + 0.17vw, 0.875rem)
text-base   → clamp(0.9375rem, 0.9rem  + 0.19vw, 1rem)
text-lg     → clamp(1.0625rem, 1rem    + 0.31vw, 1.25rem)
text-xl     → clamp(1.25rem,   1.15rem + 0.5vw,  1.5rem)
text-2xl    → clamp(1.5rem,    1.35rem + 0.75vw, 2rem)
text-3xl    → clamp(2rem,      1.75rem + 1.25vw, 2.75rem)
text-4xl    → clamp(2.5rem,    2.1rem  + 2vw,    3.5rem)
text-5xl    → clamp(3rem,      2.5rem  + 2.5vw,  4.5rem)
text-hero   → clamp(3.5rem,    2.8rem  + 3.5vw,  6.5rem)
```

### 5.4 Spacing, radius, grid

- **Spacing:** Tailwind v4 defaults (`0.25rem` step)
- **Container:** `max-width: 1200px`, gutters `clamp(1rem, 4vw, 2rem)`
- **Radius:** `sm: 6px · md: 10px · lg: 14px · xl: 20px · full: 9999px`
- **Grid:** 12-col desktop, 4-col mobile, shared gap from spacing scale
- **Borders:** `1px` hairlines (subtle surface separation)
- **Shadows:** `sm` for cards, `accent-glow` for primary buttons (`0 0 32px var(--color-accent-glow)`), no heavy drops

### 5.5 Motion constants (`lib/motion.ts`)

```ts
export const ease = {
  out:    [0.16, 1, 0.3, 1],
  inOut:  [0.65, 0, 0.35, 1],
  spring: { type: 'spring', damping: 20, stiffness: 180, mass: 1 },
} as const;

export const duration = {
  fast:   0.2,
  base:   0.4,
  slow:   0.8,
  reveal: 1.2,
} as const;

export const stagger = {
  tight:  0.04,
  base:   0.08,
  loose:  0.14,
} as const;
```

Every animation imports from here — no magic numbers anywhere in the codebase.

### 5.6 Z-index layers

```ts
export const z = {
  base:     0,
  sticky:   10,
  dropdown: 20,
  cursor:   40,
  nav:      50,
  palette:  60,
  toast:    70,
  modal:    80,
} as const;
```

## 6. Content model and data flow

### 6.1 Zod project schema (`lib/schemas/project.ts`)

```ts
export const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  tagline: z.string().max(120),
  summary: z.string().max(280),
  role: z.string(),
  timeframe: z.string(),
  status: z.enum(['shipped', 'in-progress', 'archived']),
  featured: z.boolean().default(false),
  order: z.number().default(999),
  stack: z.array(z.string()),
  tags: z.array(z.enum([
    'full-stack', 'frontend', 'backend', 'ai-ml', 'systems', 'devtools', 'data',
  ])),
  links: z.object({
    github: z.string().url().optional(),
    live:   z.string().url().optional(),
    demo:   z.string().url().optional(),
    paper:  z.string().url().optional(),
  }).default({}),
  cover: z.object({
    src: z.string(),
    alt: z.string(),
    video: z.string().optional(),
  }),
  gallery: z.array(z.object({
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  })).default([]),
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).default([]),
  accentColor: z.string().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).default([]),
  }).default({}),
});

export type Project = z.infer<typeof projectSchema>;
```

Invalid frontmatter causes a build failure with a file-and-field error pointer, never a runtime crash.

### 6.2 Content loader (`lib/content.ts`) — public interface

```ts
export async function getAllProjects(): Promise<Project[]>;
export async function getFeaturedProjects(): Promise<Project[]>;
export async function getProjectBySlug(slug: string): Promise<{
  project: Project;
  content: React.ReactNode;
} | null>;
export async function getAbout(): Promise<{ content: React.ReactNode }>;
```

Internals: read `content/projects/*.mdx`, parse frontmatter via `gray-matter`, validate via Zod, compile MDX with `next-mdx-remote/rsc`, wrap with React's `cache()` so multiple calls in one request hit disk once.

### 6.3 Medium loader (`lib/medium.ts`) — public interface

```ts
export interface MediumPost {
  title: string;
  link: string;
  published: Date;
  excerpt: string;        // first 280 chars, HTML-stripped
  readingTime: number;    // minutes
  coverImage: string | null;
  tags: string[];
}

export async function getMediumPosts(limit?: number): Promise<MediumPost[]>;
```

Fetches `https://medium.com/feed/@brianc40722`, parses RSS via `rss-parser`, normalizes. ISR cached with `fetch(..., { next: { revalidate: 3600 } })`. Returns `[]` on any failure — never throws. Pages render an empty-state placeholder when the list is empty.

### 6.4 Data flow

```
 ┌──────────────────┐   ┌──────────────────┐   ┌─────────────────┐
 │ content/*.mdx    │   │ medium.com/feed  │   │  public/*       │
 │  (git-tracked)   │   │  (external RSS)  │   │  (assets)       │
 └────────┬─────────┘   └────────┬─────────┘   └─────────────────┘
          │                      │
          ▼                      ▼
 ┌──────────────────┐   ┌──────────────────┐
 │ lib/content.ts   │   │ lib/medium.ts    │
 │ · Zod validation │   │ · RSS parse      │
 │ · MDX compile    │   │ · ISR cache      │
 │ · React cache    │   │ · empty-state    │
 └────────┬─────────┘   └────────┬─────────┘
          └──────────┬───────────┘
                     ▼
          ┌──────────────────┐
          │ page.tsx         │  ← thin compositions, no fetching
          └──────────────────┘
                     ▼
          ┌──────────────────┐
          │ section comps    │  ← dumb presenters, props only
          └──────────────────┘
```

### 6.5 Initial content inventory

The five featured projects seed with these MDX files:

1. **`advising-bot.mdx`** — `featured: true, order: 1, status: in-progress, tags: [ai-ml, backend, full-stack]`, stack `[Python, LangGraph, Pinecone, OpenAI, FastAPI]`
2. **`financial-sentiment-rnn.mdx`** — `featured: true, order: 2, status: in-progress, tags: [ai-ml, data]`, stack `[Python, PyTorch, NumPy, NLTK]`
3. **`playlister.mdx`** — `featured: true, order: 3, status: shipped, tags: [full-stack, frontend, backend]`, stack `[React, Node.js, Express, MongoDB]`
4. **`fuzzer.mdx`** — `featured: true, order: 4, status: in-progress, tags: [systems, devtools]`, stack `[C]`
5. **`custom-heap.mdx`** — `featured: true, order: 5, status: shipped, tags: [systems]`, stack `[C]`

Stack lists on the fuzzer and heap entries are initial placeholders; Brian will confirm actual languages and libraries when he fills in the case study bodies.

Case-study bodies (problem / architecture / what-I-learned) are authored progressively post-launch — day-one MVP can ship with partial bodies and the cards still render correctly.

## 7. Pages and components

### 7.1 Component taxonomy

| Directory | Responsibility |
|---|---|
| `components/primitives/` | Design-system atoms, zero business logic |
| `components/motion/` | Reusable animation wrappers consuming `lib/motion.ts` |
| `components/mdx/` | Slot components mounted via MDX provider |
| `components/sections/` | Full-width page sections composed on pages |
| `components/hero/` | R3F canvas and shader, isolated and dynamic-imported |
| `components/nav/` | Top bar, command palette, mobile menu |
| `components/project-card/` | 3D tilt card (used on home AND `/projects`) |
| `components/cursor/` | Custom cursor layer |
| `components/case-study/` | Case study page building blocks |

### 7.2 Primitives

| Component | Notes |
|---|---|
| `<Container>` | Max-width + responsive gutters |
| `<Section>` | `<section>` with anchor id, eyebrow label slot, vertical rhythm |
| `<Heading>` | `h1`–`h4`, display or sans variant, optional `reveal` prop |
| `<Text>` | Body text with `size` and `muted` variants |
| `<Button>` | Primary / secondary / ghost; optional `magnetic` and `glow` props |
| `<Pill>` | Status chip with optional dot indicator |
| `<Link>` | `next/link` for internal, external with icon + underline animation |
| `<Icon>` | Lucide wrapper with size tokens |

All primitives accept `className`, use `cn()` for class merging, consume CSS variables, and hard-code nothing.

### 7.3 Motion primitives

| Component | Use |
|---|---|
| `<FadeIn>` | Scroll-triggered fade + rise, `once: true` by default |
| `<Reveal>` | Mask reveal with clip-path (for headings) |
| `<StaggerGroup>` | Orchestrates child stagger |
| `<TextSplit>` | Splits text into words/chars for kinetic reveals |
| `<Magnetic>` | Cursor-attracting wrapper |
| `<Marquee>` | Infinite horizontal scroller (pure CSS animation) |
| `<Tilt3D>` | Cursor-tracked 3D rotation |
| `<Parallax>` | Scroll-linked `y` offset |
| `<TextScramble>` | Per-character scramble on in-view |

Every motion primitive consults `useReducedMotion()` — one hook, one enforcement point.

### 7.4 Homepage composition

```tsx
// app/(site)/page.tsx
export default async function HomePage() {
  const [projects, posts] = await Promise.all([
    getFeaturedProjects(),
    getMediumPosts(3),
  ]);
  return (
    <>
      <HomeHero />
      <About />
      <SelectedWork projects={projects} />
      <Experience />
      <Toolbelt />
      <Writing posts={posts} />
      <Contact />
    </>
  );
}
```

### 7.5 Section inventory

| Section | Anatomy | Motion |
|---|---|---|
| `HomeHero` | Status pill · display name "Brian *Cao*" (italic amber) · tagline · CTA row (View work / ⌘K search) · scroll hint · R3F canvas behind | Masked reveal on name, pill fade, canvas fade-in at 0.6s |
| `About` | Eyebrow · expanded bio · photo placeholder · 4-stat grid (GPA, school, grad year, location) · quiet-life line | Scroll reveal, stat count-up |
| `SelectedWork` | Eyebrow · vertical list of 5 `<ProjectCard variant="home">` · "See all projects →" | Stagger + 3D tilt |
| `Experience` | Eyebrow · interactive timeline of 4 roles (Pulp Corp · SBU Operations · SBU Data · RA), expand-on-click | Rail draws top-to-bottom, clip reveal on items |
| `Toolbelt` | Eyebrow · three category marquees (Languages / Frameworks / Tools) | Continuous CSS marquee, slow on hover |
| `Writing` | Eyebrow · 3 Medium post cards · "Read all on Medium →" | Stagger on cards |
| `Contact` | Huge kinetic "Let's build something" heading · contact form · email link · socials row | Text scramble, form focus glow |

Each section file targets **≤150 lines** and is reorderable by moving one line on the page.

### 7.6 `<ProjectCard>` composition

```
components/project-card/
├── project-card.tsx            # composition (the only public export)
├── project-card.shell.tsx      # 3D tilt shell
├── project-card.media.tsx      # image / video preview with parallax
├── project-card.meta.tsx       # title, tagline, stack pills
└── project-card.hover.tsx      # hover state orchestration
```

Props: `{ project: Project; variant: 'home' | 'index' }`. `home` is the big tilt card; `index` is a denser row. Two densities, one component.

### 7.7 Case study page

```tsx
// app/(site)/projects/[slug]/page.tsx
export default async function CaseStudyPage({ params }) {
  const result = await getProjectBySlug(params.slug);
  if (!result) notFound();
  const { project, content } = result;
  return (
    <>
      <CaseStudyHeader project={project} />
      <CaseStudyMeta project={project} />
      <article className="prose-case-study">{content}</article>
      <CaseStudyGallery images={project.gallery} />
      <CaseStudyNav currentSlug={project.slug} />
      <ContactCta />
    </>
  );
}
```

MDX provider exposes custom components: `<Callout>`, `<Diagram>`, `<Video>`, `<CodeBlock>`, `<Quote>`, `<Columns>`, `<Metrics>` — the authoring vocabulary for case studies.

### 7.8 Navigation

| Piece | Behavior |
|---|---|
| `<TopBar>` | Logo (BC wordmark, monogram on scroll) · 4 links with magnetic hover · `⌘K` trigger. Sticky with backdrop blur on scroll. Auto-hides on scroll-down, reveals on scroll-up. |
| `<CommandPalette>` | `⌘K` / `/` trigger, fuzzy search (cmdk), groups: Navigation · Projects · Writing · Social · Actions. Focus-trapped, ESC closes, restores focus. |
| `<ScrollProgress>` | Thin amber rail tracking scroll depth on case studies |
| `<MobileMenu>` | Full-screen overlay for `<md` viewports |

### 7.9 Footer

Minimal: copyright · "built with Next.js · deployed on Vercel · [source →]" · `⌘K` hint · subtle amber ★ on hover.

## 8. Animation strategy

### 8.1 Library roster

| Library | Purpose | Approximate gz |
|---|---|---|
| Framer Motion | Default React animation | ~50 KB |
| Lenis | Smooth scroll | ~3 KB |
| @react-three/fiber + drei | Hero 3D only, dynamic | ~140 KB |
| cmdk | Command palette | ~6 KB |
| @use-gesture/react | Cursor + tilt tracking | ~6 KB |

No GSAP in MVP. Framer Motion covers every section. GSAP ScrollTrigger is reserved for pinned scrollytelling in Level 3.

### 8.2 Scroll orchestration

Lenis initialised once in `LenisProvider` at root. `useLenisScroll()` wraps Framer's `useScroll` — single integration point. Sections never import Lenis or Framer directly; they consume motion primitives.

### 8.3 Motion behaviour per section

| Section | Effect |
|---|---|
| Hero name | Masked word reveal; italic "Cao" glows in 200 ms after |
| Hero pill | Fade + scale `0.9 → 1` |
| Hero canvas | Opacity `0 → 1` at 0.6 s |
| Section eyebrows | Horizontal rule draws left → right on enter |
| Section headings | Word-stagger reveal |
| Project cards | `y: 20 → 0`, `opacity: 0 → 1`, stagger 80 ms |
| Card hover | 3D tilt (cursor tracked), subtle scale, cover parallax |
| Timeline | Rail draws top-to-bottom on scroll-in |
| Toolbelt | CSS marquee, slow + reverse on hover |
| Writing cards | Stagger + gradient border trace on hover |
| Contact heading | Per-character scramble on in-view |
| Route transitions | View Transitions API — fade + slight y |

### 8.4 Custom cursor

`<CursorLayer>` rendered once at root. Two elements — `<CursorDot>` (small, high z) and `<CursorRing>` (larger, trailing, softer). Driven by a single RAF-based `useCursorPosition()` hook using `transform: translate3d` only.

Cursor states: default · hover link · hover card · hover text (I-beam) · dragging. State is published via React Context so any primitive can request it. Hidden on touch devices via `@media (hover: hover)`.

### 8.5 Command palette

Built on **cmdk**. Commands defined in `lib/commands.ts`, grouped:

```
Navigation   Home · Projects · Writing · Resume · Contact
Projects     <auto from getAllProjects()>
Writing      <auto from getMediumPosts()>
Social       GitHub · LinkedIn · Medium · Email
Actions      Download resume · Copy email · View source · Toggle cursor · Toggle motion
```

Rendered in a portal, focus-trapped, opens with scale `0.95 → 1` + backdrop blur (200 ms).

### 8.6 Hero 3D

Isolated and dynamic-imported:

```tsx
const Hero3DCanvas = dynamic(() => import('./hero-3d-canvas'), {
  ssr: false,
  loading: () => <HeroStaticFallback />,
});
```

`HeroStaticFallback` is a static SVG/CSS version of the scene (amber radial gradient over grid). LCP fires on the fallback — canvas never blocks meaningful paint. Users with `prefers-reduced-motion` see only the fallback.

Canvas contents:

```tsx
<Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3.2], fov: 35 }}>
  <ambientLight intensity={0.2} />
  <directionalLight position={[5, 5, 5]} intensity={0.6} color="#fff" />
  <ShaderBlob />
  <Environment preset="warehouse" />
  <EffectComposer>
    <Bloom luminanceThreshold={0.8} intensity={0.4} />
    <Vignette offset={0.3} darkness={0.6} />
  </EffectComposer>
</Canvas>
```

`<ShaderBlob>` is its own module: an icosphere with a custom GLSL vertex shader that displaces vertices using 3D simplex noise driven by `uTime` and `uMouse` uniforms. Fragment shader applies an amber emissive material with rim lighting.

Performance: 60 fps on M1, 30 fps floor on iPhone 12. Throttles to 30 fps when offscreen. Pauses on `document.hidden`.

### 8.7 Reduced motion

Single source of truth — `useReducedMotion()`:
- Durations → 0, stagger → 0, marquees paused, custom cursor hidden, 3D canvas replaced with static fallback
- Honours OS preference **and** an in-site toggle (`localStorage`-persisted) accessible via the command palette

### 8.8 Performance budget

| Metric | Target | Strategy |
|---|---|---|
| LCP (home) | < 1.8 s on 4G | Static hero fallback, font preload, canvas lazy |
| CLS | 0.00 | `next/font` with size-adjust, explicit image dimensions |
| INP | < 200 ms | No heavy JS on input paths, RAF-throttled listeners |
| Initial JS (home) | < 180 KB gz | R3F dynamic, palette dynamic, marquees pure CSS |
| Total page weight | < 400 KB (excl. 3D canvas) | `next/image`, video posters, WebP |
| Lighthouse | ≥ 98 all categories | CI gate on every PR |

## 9. SEO, metadata, accessibility

### 9.1 Keyword targets

**Primary (must rank #1):**
- `brian cao`
- `brian cao stony brook`
- `brian cao developer` / `brian cao portfolio` / `brian cao software engineer`
- `brian cao ai` / `brian cao full stack`

**Long-tail (case-study content drives these):**
- `advising bot langgraph`, `course advisor rag chatbot`
- `financial sentiment rnn pytorch`
- `playlister mern`
- Systems-level content from fuzzer + heap case studies

**Explicitly NOT targeted:** generic "full stack developer portfolio" queries.

### 9.2 Metadata helper (`lib/metadata.ts`)

```ts
type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  tags?: string[];
};
export function buildMetadata(input: BuildMetadataInput): Metadata;
```

Every page exports `metadata` or `generateMetadata` that calls this one function. It produces:
- Title template: `{page} — Brian Cao` (home: `Brian Cao — Full-stack engineer & AI builder`)
- Description, canonical URL, OpenGraph, Twitter card, keywords, author, robots, `theme-color: #0b0a08`
- Article fields when applicable

### 9.3 Dynamic OG images (`app/api/og/route.tsx`)

Built with `@vercel/og` (satori JSX → PNG at the edge). Variants:
- **Home:** Instrument Serif name, amber accent dot, tagline in Inter, grid backdrop
- **Project:** title + 1-line summary + stack pills + amber corner accent + BC monogram
- **Writing:** post title + published date + `writing @ briancao.dev`
- **Fallback:** `/og/default.png` if the route errors

### 9.4 Structured data (JSON-LD)

Injected via `<StructuredData>`:
- **Homepage:** `Person` schema — name, jobTitle, alumniOf Stony Brook, sameAs GitHub/LinkedIn/Medium, image, url
- **Project pages:** `CreativeWork` / `SoftwareSourceCode` with author, datePublished, keywords, about
- **Writing pages:** `Article` with headline, author, datePublished, mainEntityOfPage

### 9.5 Sitemap, robots, RSS

Code-generated from the same content loaders:
- `app/sitemap.ts` — home + projects + writing + about + resume, `lastModified` from frontmatter
- `app/robots.ts` — allow all, disallow `/api/*`, point to sitemap
- `app/rss.xml/route.ts` — projects + Medium combined feed

### 9.6 Accessibility baseline

| Requirement | Implementation |
|---|---|
| WCAG 2.2 AA contrast | Verified per token (§5.2) |
| Keyboard navigation | Every interactive reachable by Tab; 2 px amber focus ring w/ 2 px offset; never `outline: none` without replacement |
| Focus management | Palette traps focus; ESC restores focus to trigger; expand-on-click announces state |
| Reduced motion | `useReducedMotion` hook + in-site toggle |
| Semantic HTML | `<nav>`, `<main>`, `<article>`, `<section aria-labelledby>`; decorative `aria-hidden` |
| Hero canvas | `aria-hidden`; meaningful content lives in adjacent DOM |
| Skip link | First focusable element, visible on focus |
| Alt text | Zod-validated required on every image in frontmatter; build fails on missing alt |
| Form errors | `aria-describedby`, inline, never color-only |
| Status signals | Always icon + text, never color alone |

### 9.7 Head tags on every page

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0b0a08">
<link rel="canonical" href="https://briancao.dev/...">
<link rel="icon" href="/icon" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-icon.png">
<link rel="alternate" type="application/rss+xml" href="/rss.xml">
<link rel="manifest" href="/manifest.webmanifest">
<title>...</title>
<meta name="description" content="...">
<meta name="keywords" content="...">
<meta name="author" content="Brian Cao">
<!-- OG, Twitter, and JSON-LD injected per page -->
```

### 9.8 Favicon and manifest

- SVG favicon (BC monogram in amber) via `app/icon.tsx` using satori
- PNG fallbacks for older browsers
- `manifest.webmanifest` with theme color, name, short_name
- iOS touch icon
- **No PWA / service worker** for MVP

## 10. Testing, deployment, operations

### 10.1 Unit tests (Vitest, `tests/unit/`)

| Target | Coverage |
|---|---|
| `lib/content.test.ts` | Valid MDX parses; invalid MDX throws with clear error; sort order; missing slug returns null |
| `lib/medium.test.ts` | RSS parses correctly; empty feed → `[]`; network error → `[]` (never throws); reading-time; HTML stripping |
| `lib/metadata.test.ts` | Title template; description truncation; canonical URL builder; OG image URL builder |
| `lib/commands.test.ts` | Command registry assembles correctly; static + dynamic commands present |
| `components/motion/*.test.tsx` | Reduced-motion hook correctness; `<FadeIn>` renders children; `<TextSplit>` splitting |

Target: whole suite runs in < 5 s on `pnpm test`.

### 10.2 E2E tests (Playwright, `tests/e2e/`)

| Spec | Flow |
|---|---|
| `homepage.spec.ts` | Loads; hero renders (fallback or canvas); all 7 sections present by heading; zero console errors; nav links reachable |
| `project-case-study.spec.ts` | Home → click featured project → case study loads → back works → metadata correct |
| `command-palette.spec.ts` | `⌘K` opens palette; type "advising" → match appears; Enter navigates; ESC closes + restores focus |
| `contact-form.spec.ts` | Valid submit → success; invalid email → inline error; empty submit → all errors |
| `writing.spec.ts` | `/writing` loads; Medium cards present (mocked RSS); external links open in new tab |
| `keyboard-nav.spec.ts` | Tab through home; focus ring visible; skip link works; no traps |
| `reduced-motion.spec.ts` | `prefers-reduced-motion: reduce` → canvas absent, marquees paused, instant transitions |

### 10.3 Visual regression

Per-section Playwright screenshot baselines on home + one case study. Scoped (not full-page) to reduce flakiness.

### 10.4 Code quality gates

| Tool | Role |
|---|---|
| TypeScript strict | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` |
| Biome | Lint + format, single tool |
| Husky + lint-staged | Pre-commit: `biome check --apply` on staged files + `tsc --noEmit` |
| Commitlint | Conventional Commits (`feat:`, `fix:`, `chore:`, …) |

### 10.5 CI pipeline (`.github/workflows/ci.yml`)

```
jobs:
  install:    pnpm install (cached)
  typecheck:  tsc --noEmit
  lint:       biome check
  test:       vitest run
  build:      next build        ← Zod content validation runs here
  e2e:        playwright test (against built output)
  lighthouse: Lighthouse CI on preview URL (home + 1 case study)
```

Merge is blocked on any failure. Lighthouse thresholds: performance ≥ 95, accessibility = 100, SEO = 100, best practices ≥ 95.

### 10.6 Deployment (Vercel)

- Git-integrated: `main` → production, PRs → preview URLs
- Environment variables (Vercel dashboard only, never committed):
  ```
  RESEND_API_KEY
  CONTACT_TO_EMAIL       # brianc40722@gmail.com
  MEDIUM_FEED_URL        # https://medium.com/feed/@brianc40722
  NEXT_PUBLIC_SITE_URL   # https://briancao.dev
  ```
- Edge runtime for `/api/contact` and `/api/og`
- `next/image` with Vercel's CDN
- ISR on `/writing` and `/projects` (3600 s)

### 10.7 Domain and DNS

Instructions included in the implementation plan; not executed in MVP until Brian buys the domain:
1. Register `briancao.dev` at Cloudflare Registrar (at-cost)
2. Add domain to Vercel project (auto SSL)
3. Set DNS records per Vercel's instructions
4. Update `NEXT_PUBLIC_SITE_URL`

### 10.8 Observability

| Signal | Tool |
|---|---|
| Real-user perf (LCP/INP/CLS) | Vercel Speed Insights |
| Page views | Vercel Analytics (cookie-less, privacy-friendly) |
| Errors | Vercel build logs + browser console (no Sentry in MVP) |
| Uptime | Vercel built-in |

### 10.9 Repo hygiene

- `README.md` — project description, stack, local dev, deployment notes
- `.env.example` — committed, documents required vars
- `.gitignore` — `.superpowers/`, `.next/`, `node_modules/`, `.vercel/`, `.DS_Store`, `playwright-report/`, `test-results/`, `coverage/`
- `LICENSE` — MIT
- PR template — checklist: typecheck, tests, Lighthouse, screenshot

## 11. Post-launch roadmap (out of MVP scope)

Tracked in `ROADMAP.md` from day one, in priority order:

1. **Terminal easter egg** — press `` ` `` to drop a working TTY (ls, cat, neofetch, run demos)
2. **Live GitHub contribution graph** in the About section
3. **Light mode** with tuned amber variants
4. **Pinned scrollytelling** on case studies using GSAP ScrollTrigger
5. **Sound design** (click, whoosh, hover) — muted by default, toggle in palette
6. **Konami code** unlock → secret mode
7. **First-visit boot sequence** intro animation
8. **Native MDX blog** migration from Medium

## 12. Open items

- **Domain purchase** — Brian will buy after launch prep is complete; DNS instructions are in the plan
- **Photo** — placeholder only for MVP; replace when a real photo is ready
- **Case study bodies** — day-one bodies may be partial; polished copy is authored iteratively post-launch

---

## Appendix A — Personal and content inputs

**Identity**
- Name: Brian Cao
- School: Stony Brook University, CS Honors, expected May 2027
- GPA: 3.86, Dean's List
- Current year: Junior

**Contact**
- Email: brianc40722@gmail.com
- Phone: (929) 289-6597 (not displayed on site)
- GitHub: github.com/BrianASC23
- LinkedIn: linkedin.com/in/brian-cao-7b9a89211
- Medium: medium.com/@brianc40722

**Bio**
> "I'm a builder who enjoys turning complex ideas into systems that are clear, useful, and meaningful — especially across software, AI, and real-world problems. Outside of that, I slow things down through journaling, cooking, reading, and spending time in nature, which keeps my thinking grounded. I care about creating things that not only work well, but actually matter."

**Experience (to render in timeline)**
1. Stony Brook University CS Department — Operations · Software Developer & IT Support · Sep 2025 – Present · Python, Zabbix, Linux, automation
2. Pulp Corporation · Software Engineer Intern · Jan 2025 – Aug 2025 · Next.js, TypeScript, Neo4j, AWS
3. Stony Brook University CS Department — Data · Web Programmer · Jan 2025 – Aug 2025 · Drupal, PHP, Twig
4. Stony Brook University Campus Residences · Resident Assistant · Aug 2024 – Present

**Featured projects**
1. Advising Bot — RAG chatbot for Stony Brook course bulletin (Python, LangGraph, Pinecone)
2. Financial News Sentiment Analysis — RNN/GRU on FinancialPhraseBank (Python, PyTorch)
3. Playlister — full-stack playlist manager (React, Node, Express, MongoDB)
4. Fuzzer — coverage-guided fuzzer (C, in-progress)
5. Custom Heap — hand-rolled heap implementation (C/C++)

**Languages**
Python, SQL, PostgreSQL, C/C++, Java, JavaScript, TypeScript, R, OCaml, HTML, CSS

**Libraries & tools**
AWS, Hugging Face, Transformers, PyTorch, Jupyter, NumPy, Pandas, Bash, Git, Flask, Bootstrap, .NET, LaTeX
