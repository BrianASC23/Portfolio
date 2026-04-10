# File Map

## Root Config

```
.env.example                    Environment variable template
.lintstagedrc.json              Lint-staged pre-commit config
biome.json                      Biome linter/formatter config
commitlint.config.mjs           Conventional commits enforcement
eslint.config.mjs               ESLint config
lighthouserc.json               Lighthouse CI config
next.config.ts                  Next.js config (bundle analyzer, MDX, images, security headers)
package.json                    Dependencies & scripts
playwright.config.ts            Playwright E2E test config
postcss.config.mjs              PostCSS / Tailwind v4 config
tsconfig.json                   TypeScript strict mode config
vitest.config.ts                Vitest unit test config
```

## `.github/`

```
workflows/ci.yml                CI pipeline (lint, typecheck, test, build)
workflows/lighthouse.yml        Lighthouse performance CI
pull_request_template.md        PR template
```

## `.husky/`

```
commit-msg                      Validate commit messages
pre-commit                      Run lint-staged before commit
```

## `app/` — Next.js 15 App Router

```
layout.tsx                      Root layout (HTML, fonts, metadata, analytics)
not-found.tsx                   Custom 404 page
fonts.ts                        Font definitions (Instrument Serif, Inter, JetBrains Mono)
globals.css                     Global styles + CSS custom properties
icon.tsx                        Dynamic favicon generator
favicon.ico                     Favicon
manifest.ts                     PWA manifest
robots.ts                       robots.txt generator
sitemap.ts                      XML sitemap generator

(site)/
  layout.tsx                    Site layout (TopBar, Footer, CommandPalette, ScrollProgress)
  page.tsx                      Home page (/)

  projects/
    page.tsx                    Projects index (/projects)
    [slug]/page.tsx             Project case study (/projects/[slug])

  writing/
    page.tsx                    Writing index (/writing)

  resume/
    page.tsx                    Resume page (/resume)

api/
  contact/
    route.ts                    POST handler — Resend email + rate limiting
    schema.ts                   Zod contact form validation
  og/
    route.tsx                   GET handler — dynamic OG image generation
  rss.xml/
    route.ts                    GET handler — RSS feed generator
```

## `components/` — React Components

```
hero/
  HomeHero.tsx                  Homepage hero section with 3D shader
  PixelHero.tsx                 Alternative pixel-based hero

mdx/
  mdx-components.tsx            MDX component overrides (typography, code blocks)
  MDXRenderer.tsx               Renders MDX content

motion/
  FadeIn.tsx                    Fade-in on scroll (memo'd)
  Marquee.tsx                   Infinite scrolling marquee (memo'd)
  Parallax.tsx                  Parallax scroll effect
  Reveal.tsx                    Vertical mask reveal (memo'd)
  StaggerGroup.tsx              Staggered animation container
  TextScramble.tsx              Text scramble/glitch effect
  TextSplit.tsx                 Split text animation (memo'd)
  Tilt3D.tsx                    3D tilt on pointer move (RAF-throttled)

nav/
  TopBar.tsx                    Top navigation bar
  Footer.tsx                    Footer
  CommandPalette.tsx            cmdk command palette
  CommandPaletteLazy.tsx        Lazy-loaded command palette wrapper
  CommandTrigger.tsx            Command palette trigger button
  MobileMenu.tsx                Mobile navigation menu
  ScrollProgress.tsx            Page scroll progress indicator

primitives/
  Button.tsx                    Button (polymorphic, multiple variants)
  Container.tsx                 Layout container (max-width, padding)
  Heading.tsx                   Heading (h1-h6)
  Icon.tsx                      Icon wrapper
  Link.tsx                      Link with active state
  Pill.tsx                      Pill/badge
  Section.tsx                   Section layout wrapper
  Text.tsx                      Text (p, span)

project/
  ProjectCard.tsx               Project card preview (memo'd)
  CaseStudyHeader.tsx           Case study header
  CaseStudyMeta.tsx             Project metadata (role, timeline, stack, metrics)
  CaseStudyNav.tsx              Previous/next project navigation
  CaseStudyGallery.tsx          Project image gallery

sections/
  AboutSection.tsx              About/bio section
  SelectedWorkSection.tsx       Featured projects section
  ExperienceSection.tsx         Experience timeline section
  ToolbeltSection.tsx           Tech stack marquee section
  WritingSection.tsx            Writing preview section
  ContactSection.tsx            Contact section
  ContactForm.tsx               Contact form implementation

seo/
  StructuredData.tsx            JSON-LD structured data

writing/
  WritingEmptyState.tsx         Empty state when no Medium posts
```

## `lib/` — Utilities & Data

```
env.ts                          Environment variable validation (Zod)
motion.ts                       Animation constants (duration, ease, stagger)
nav.ts                          Navigation link definitions

commands/
  registry.ts                   Command palette command registry

content/
  projects.ts                   Load project MDX content + metadata
  experience.ts                 Load experience entries
  site.ts                       Load site-wide content (bio, toolbelt)

hooks/
  useIsomorphicLayoutEffect.ts  SSR-safe layout effect
  useReducedMotion.ts           Detect prefers-reduced-motion

schemas/
  project.ts                    Zod schema for project frontmatter
  experience.ts                 Zod schema for experience entries
  writing.ts                    Zod schema for Medium posts

seo/
  metadata.ts                   SEO metadata utilities

utils/
  cn.ts                         clsx classname utility
  format.ts                     Date & reading time formatting

writing/
  medium.ts                     Fetch + parse Medium RSS feed
```

## `content/` — MDX & Data

```
projects/
  advising-bot.mdx              Advising Bot case study
  custom-heap.mdx               Custom Heap case study
  financial-sentiment.mdx       Financial Sentiment RNN case study
  fuzzer.mdx                    Fuzzer case study
  playlister.mdx                Playlister case study

experience/
  pulp.mdx                      Pulp (startup) experience
  sbu-cs-ops.mdx                SBU CS Honors Operations
  sbu-ra.mdx                    SBU Research Assistant
  sbu-web.mdx                   SBU Web development role

site/
  bio.mdx                       Bio/about content
  toolbelt.json                 Tech stack/tools data
```

## `public/` — Static Assets

```
fonts/
  InstrumentSerif-Regular.woff2   Display font (serif)
  InstrumentSerif-Italic.woff2    Display font italic
  Inter-Variable.woff2            Body font (sans-serif)
  JetBrainsMono-Variable.woff2    Monospace font

resume/
  BrianCao-Resume.pdf             Resume PDF

*.svg                             Various icon SVGs
placeholder-portrait.svg          Portrait placeholder
```

## `tests/` — Test Suite

```
setup.ts                        Test setup/configuration

e2e/                            Playwright E2E tests
  a11y.spec.ts                  Accessibility tests
  case-study.spec.ts            Case study page tests
  homepage.spec.ts              Homepage tests
  smoke.spec.ts                 Smoke tests
  visual.spec.ts                Visual regression tests
  writing.spec.ts               Writing page tests

unit/                           Vitest unit tests
  Button.test.tsx               Button component tests
  Container.test.tsx            Container component tests
  Heading.test.tsx              Heading component tests
  Section.test.tsx              Section component tests
  cn.test.ts                    Classname utility tests
  contact-schema.test.ts        Contact form schema tests
  content-experience.test.ts    Experience content loader tests
  content-projects.test.ts      Project content loader tests
  env.test.ts                   Environment variable tests
  format.test.ts                Format utility tests
  hooks.test.tsx                Custom hooks tests
  medium.test.ts                Medium feed parser tests
  metadata.test.ts              SEO metadata tests
  motion.test.ts                Motion utility tests
  schemas.test.ts               Zod schema tests
  smoke.test.ts                 General smoke tests
```

## `docs/` — Documentation

```
superpowers/
  plans/
    2026-04-06-portfolio.md       Portfolio implementation plan
    2026-04-08-brain-hero.md      Brain hero feature plan
  specs/
    2026-04-06-portfolio-design.md  Design specification
    2026-04-08-brain-hero-design.md Brain hero design spec
```
