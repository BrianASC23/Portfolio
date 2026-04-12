'use client';

import { FadeIn } from '@/components/motion/FadeIn';
import type { Experience } from '@/lib/schemas/experience';
import { formatRange } from '@/lib/utils/format';
import { Calendar, ExternalLink, MapPin } from 'lucide-react';
import Link from 'next/link';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div
        className="absolute left-6 top-0 hidden h-full w-px md:block"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-accent), var(--color-border), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="space-y-8 md:space-y-12">
        {experiences.map((exp, i) => (
          <FadeIn key={exp.slug} y={24} delay={i * 0.05}>
            <article className="group relative md:pl-16">
              {/* Timeline dot */}
              <div
                className="absolute left-[18px] top-8 hidden h-4 w-4 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg)] md:block"
                aria-hidden="true"
              />

              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-sm transition-[box-shadow,border-color] duration-300 ease-out hover:border-[var(--color-accent-glow)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_rgba(0,0,0,0.06)] md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    {exp.logo ? (
                      <img
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        className="h-14 w-14 shrink-0 rounded-xl border border-[var(--color-border)] object-contain p-1"
                      />
                    ) : (
                      <LogoPlaceholder company={exp.company} />
                    )}
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-[var(--color-fg)]">{exp.role}</h2>
                      <p className="mt-0.5 text-sm text-[var(--color-fg-muted)]">
                        {exp.link ? (
                          <Link
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 transition-colors hover:text-[var(--color-accent)]"
                          >
                            {exp.company}
                            <ExternalLink size={12} />
                          </Link>
                        ) : (
                          exp.company
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-3 text-xs text-[var(--color-fg-subtle)]">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Calendar size={14} aria-hidden="true" />
                      {formatRange(exp.start, exp.end)}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} aria-hidden="true" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {exp.description && (
                  <p className="mt-5 leading-relaxed text-[var(--color-fg-muted)]">
                    {exp.description}
                  </p>
                )}

                {/* Impact bullets */}
                {exp.bullets.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-fg)]">
                      Core Impact
                    </h3>
                    <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 md:grid-cols-2">
                      {exp.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2.5 text-sm text-[var(--color-fg-muted)]"
                        >
                          <span
                            className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                            aria-hidden="true"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech stack */}
                {exp.stack.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {exp.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-inset)] px-3 py-1 font-mono text-[11px] text-[var(--color-fg-muted)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

function LogoPlaceholder({ company }: { company: string }) {
  const initials = company
    .split(/[\s—-]+/)
    .filter((w) => w.length > 0 && w[0] === w[0]?.toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-inset)] text-base font-semibold text-[var(--color-accent)]">
      {initials || company[0]}
    </div>
  );
}
