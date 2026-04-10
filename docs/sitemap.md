# Site Map

## Pages

| Route | File | Description | Rendering |
|-------|------|-------------|-----------|
| `/` | `app/(site)/page.tsx` | Home — hero, about, projects, experience, toolbelt, writing, contact | ISG (revalidate 1h) |
| `/projects` | `app/(site)/projects/page.tsx` | Projects index grid | SSG |
| `/projects/[slug]` | `app/(site)/projects/[slug]/page.tsx` | Project case study (MDX body, gallery, prev/next nav) | SSG (generateStaticParams) |
| `/writing` | `app/(site)/writing/page.tsx` | Writing index (Medium RSS feed) | ISG (revalidate 1h) |
| `/resume` | `app/(site)/resume/page.tsx` | Resume PDF viewer + download | SSG |

## API Routes

| Route | File | Method | Description |
|-------|------|--------|-------------|
| `/api/contact` | `app/api/contact/route.ts` | POST | Contact form submission via Resend |
| `/api/og` | `app/api/og/route.tsx` | GET | Dynamic Open Graph image generation |
| `/rss.xml` | `app/rss.xml/route.ts` | GET | RSS feed (projects + Medium posts) |

## SEO & Metadata

| Route | File | Description |
|-------|------|-------------|
| `/sitemap.xml` | `app/sitemap.ts` | XML sitemap with all routes + project slugs |
| `/robots.txt` | `app/robots.ts` | Robots.txt (disallows `/api/`) |
| `/manifest.webmanifest` | `app/manifest.ts` | PWA manifest |
| `/icon` | `app/icon.tsx` | Dynamic generated icon |
| `/favicon.ico` | `app/favicon.ico` | Favicon |

## Error Pages

| Route | File | Description |
|-------|------|-------------|
| 404 | `app/not-found.tsx` | Custom not-found page |

## Layouts

| Scope | File | Provides |
|-------|------|----------|
| Root | `app/layout.tsx` | HTML shell, fonts, global metadata, Analytics + SpeedInsights |
| Site | `app/(site)/layout.tsx` | TopBar, Footer, CommandPalette, ScrollProgress, StructuredData |
