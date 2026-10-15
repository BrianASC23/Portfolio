import { Container } from '@/components/primitives/Container';
import { DitherThumb } from '@/components/project/DitherThumb';
import { getFeaturedProjects } from '@/lib/content/projects';
import type { Project } from '@/lib/schemas/project';
import Link from 'next/link';

/**
 * The second half of a project's caption.
 *
 * A result beats a category here — "96% gene-ID accuracy" tells a reader more
 * in one glance than "AI / ML" does — so the leading metric wins when a project
 * has one, and the stack is the fallback.
 */
function caption(project: Project): string {
  const [metric] = project.metrics;
  // The label is used as authored rather than lower-cased: these carry
  // acronyms ("Gene-ID accuracy"), and folding the case mangles them.
  if (metric) return `${metric.value} ${metric.label}`;
  return project.stack.slice(0, 2).join(' · ');
}

function ProjectTile({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group flex flex-col gap-3.5">
      <DitherThumb
        project={project}
        className="transition-[transform,opacity] duration-300 group-hover:opacity-95 motion-safe:group-hover:-translate-y-0.5"
      />
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[13px]">
        <span className="text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)]">
          {project.title}
        </span>
        <span aria-hidden="true" className="text-[var(--color-border-strong)]">
          /
        </span>
        <span className="text-[var(--color-fg-muted)]">{caption(project)}</span>
      </div>
    </Link>
  );
}

export function SelectedWork() {
  const projects = getFeaturedProjects();
  if (projects.length === 0) return null;

  return (
    <section id="work" aria-labelledby="selected-work-heading" className="pb-24 md:pb-32">
      <Container size="wide">
        <div className="flex items-baseline justify-between border-t border-[var(--color-border)] pt-5">
          <h2
            id="selected-work-heading"
            className="font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"
          >
            Selected work
          </h2>
          <Link
            href="/projects"
            className="text-[13px] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            All projects →
          </Link>
        </div>

        <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-10">
          {projects.map((project) => (
            <ProjectTile key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
