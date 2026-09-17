import { fontMono } from '@/app/fonts';
import { Container } from '@/components/primitives/Container';
import { PixelArrow } from '@/components/ui/PixelArrow';
import { getAllProjects } from '@/lib/content/projects';
import Link from 'next/link';
import { ProjectRow } from './ProjectRow';
import { SectionIntro } from './SectionIntro';

/** Shown on the home page, in this order. Everything else lives on /projects. */
const HOME_SLUGS = ['advising-bot', 'cyanoagent'] as const;
/** The home page never shows more than this, whatever HOME_SLUGS grows to. */
const MAX_HOME_PROJECTS = 2;

/**
 * Selected work — the first content section below the workstation.
 *
 * Rows are picked by slug rather than the `featured` flag so the home page's
 * running order stays independent of what /projects chooses to surface.
 */
export function ProjectsSection() {
  const bySlug = new Map(getAllProjects().map((p) => [p.slug, p]));
  const projects = HOME_SLUGS.map((slug) => bySlug.get(slug))
    .filter((p) => p !== undefined)
    .slice(0, MAX_HOME_PROJECTS);

  if (projects.length === 0) return null;

  return (
    <section id="projects" aria-label="Projects" className="scroll-mt-14 pb-24 md:pb-32">
      <Container>
        <SectionIntro title="Projects" />

        <div className="mx-auto mt-16 flex max-w-[1040px] flex-col gap-24 md:mt-20 md:gap-32">
          {projects.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </div>

        <div className="mx-auto mt-16 flex max-w-[1040px] justify-center">
          <Link
            href="/projects"
            className={`group inline-flex items-center gap-2 border-2 border-[var(--color-border-strong)] px-6 py-3 text-xs uppercase tracking-[0.18em] text-[var(--color-fg)] transition-[translate,border-color,box-shadow] duration-300 hover:translate-x-1 hover:border-[var(--color-accent)] hover:shadow-[0_0_0_2px_var(--color-accent-glow)] ${fontMono.className}`}
          >
            <span className="flex w-2 shrink-0 justify-center text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
              <PixelArrow className="h-3 w-1.5" />
            </span>
            View all projects
          </Link>
        </div>
      </Container>
    </section>
  );
}
