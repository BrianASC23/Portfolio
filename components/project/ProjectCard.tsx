import { Tilt3D } from '@/components/motion/Tilt3D';
import { Pill } from '@/components/primitives/Pill';
import type { Project } from '@/lib/schemas/project';
import Image from 'next/image';
import Link from 'next/link';

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
            <p className="absolute top-5 left-5 font-mono text-[10px] text-white/70 uppercase tracking-[0.18em]">
              {String(index + 1).padStart(2, '0')}
            </p>
          </div>
          <div className="flex flex-col gap-3 p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-serif text-2xl text-[var(--color-fg)] leading-tight">
                {project.title}
              </h3>
              <span className="shrink-0 font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]">
                {project.timeframe}
              </span>
            </div>
            <p className="text-[var(--color-fg-muted)] text-sm">{project.tagline}</p>
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
