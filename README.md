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
