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
