import { Container } from '@/components/primitives/Container';
import { ProjectRow } from '@/components/sections/ProjectRow';
import { getAllProjects } from '@/lib/content/projects';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Every project Brian Cao has built, from retrieval-grounded AI assistants to systems tooling.',
};

/** Full project list, in the same 50/50 row format as the home page. */
export default function ProjectsIndexPage() {
  const projects = getAllProjects();

  return (
    <section aria-label="Projects" className="pt-28 pb-24 md:pt-36 md:pb-32">
      <Container>
        <header className="flex flex-col items-center text-center">
          <div className="flex items-end gap-1" aria-hidden="true">
            <span className="h-1 w-8 bg-[var(--color-accent)]" />
            <span className="h-1 w-3 bg-[var(--color-accent)] opacity-60" />
            <span className="h-1 w-1.5 bg-[var(--color-accent)] opacity-30" />
          </div>
          <h1 className="mt-6 font-serif text-[length:var(--text-h2)] font-light leading-[1.05] tracking-[-0.02em] text-[var(--color-fg)]">
            All Projects
          </h1>
        </header>

        <div className="mx-auto mt-16 flex max-w-[1040px] flex-col gap-24 md:mt-20 md:gap-32">
          {projects.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
