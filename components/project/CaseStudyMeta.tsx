import type { Project } from '@/lib/schemas/project';
import Link from 'next/link';

interface CaseStudyMetaProps {
  project: Project;
}

const LINK_LABELS: Record<keyof Project['links'], string> = {
  github: 'GitHub',
  live: 'Live',
  demo: 'Demo',
  paper: 'Paper',
};

export function CaseStudyMeta({ project }: CaseStudyMetaProps) {
  const links = Object.entries(project.links).filter(([, url]) => !!url) as [
    keyof Project['links'],
    string,
  ][];

  return (
    <aside className="grid gap-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 md:grid-cols-3">
      <Field label="Role" value={project.role} />
      <Field label="Timeframe" value={project.timeframe} />
      <Field label="Status" value={project.status} />
      {project.metrics.length > 0 && (
        <div className="md:col-span-3">
          <p className="mb-3 font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]">
            Outcomes
          </p>
          <dl className="grid gap-6 md:grid-cols-3">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <dt className="text-[var(--color-fg-muted)] text-sm">{m.label}</dt>
                <dd className="font-serif text-3xl text-[var(--color-accent)]">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {links.length > 0 && (
        <div className="flex flex-wrap gap-3 md:col-span-3">
          {links.map(([key, url]) => (
            <Link
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-full border border-[var(--color-border)] px-4 font-mono text-[11px] text-[var(--color-fg)] uppercase tracking-[0.14em] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {LINK_LABELS[key]} ↗
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]">
        {label}
      </p>
      <p className="text-[var(--color-fg)]">{value}</p>
    </div>
  );
}
