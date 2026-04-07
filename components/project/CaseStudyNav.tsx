import type { Project } from '@/lib/schemas/project';
import Link from 'next/link';

interface CaseStudyNavProps {
  previous?: Project;
  next?: Project;
}

export function CaseStudyNav({ previous, next }: CaseStudyNavProps) {
  return (
    <nav className="mt-20 flex flex-col gap-4 border-[var(--color-border)] border-t pt-12 md:flex-row md:justify-between">
      {previous ? (
        <Link href={`/projects/${previous.slug}`} className="group flex-1">
          <p className="mb-1 font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]">
            ← Previous
          </p>
          <p className="font-serif text-[var(--color-fg)] text-xl group-hover:text-[var(--color-accent)]">
            {previous.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link href={`/projects/${next.slug}`} className="group flex-1 md:text-right">
          <p className="mb-1 font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]">
            Next →
          </p>
          <p className="font-serif text-[var(--color-fg)] text-xl group-hover:text-[var(--color-accent)]">
            {next.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
