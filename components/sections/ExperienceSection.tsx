'use client';

import { Container } from '@/components/primitives/Container';
import { duration, ease, stagger } from '@/lib/motion';
import type { Experience } from '@/lib/schemas/experience';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Date formatting (self-contained — no server import needed)         */
/* ------------------------------------------------------------------ */

function fmtDate(ym: string): string {
  const d = new Date(`${ym}-01`);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function formatRange(start: string, end: string): string {
  return `${fmtDate(start)} — ${end === 'present' ? 'Present' : fmtDate(end)}`;
}

/* ------------------------------------------------------------------ */
/*  Company logo placeholder                                           */
/* ------------------------------------------------------------------ */

function LogoPlaceholder({ company }: { company: string }) {
  const initials = company
    .split(/[\s—-]+/)
    .filter((w) => w.length > 0 && w[0] === w[0]!.toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-inset)] font-semibold text-sm text-[var(--color-accent)]">
      {initials || company[0]}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Single experience card                                             */
/* ------------------------------------------------------------------ */

function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <motion.article
      className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-8"
      whileHover={{ y: -2 }}
      transition={{ duration: duration.fast, ease: ease.out }}
    >
      {/* ---- Header ---- */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {exp.logo ? (
            <img
              src={exp.logo}
              alt={`${exp.company} logo`}
              className="h-12 w-12 shrink-0 rounded-lg border border-[var(--color-border)] object-contain"
            />
          ) : (
            <LogoPlaceholder company={exp.company} />
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-[var(--color-fg)]">{exp.role}</h3>
            <p className="text-sm text-[var(--color-fg-muted)]">
              {exp.company}
              {exp.location && (
                <span className="text-[var(--color-fg-subtle)]"> · {exp.location}</span>
              )}
            </p>
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 pt-1 font-mono text-xs text-[var(--color-fg-subtle)]">
          <Calendar size={14} className="text-[var(--color-fg-subtle)]" aria-hidden="true" />
          {formatRange(exp.start, exp.end)}
        </span>
      </div>

      {/* ---- Description ---- */}
      {exp.description && (
        <p className="mt-5 leading-relaxed text-[var(--color-fg-muted)]">{exp.description}</p>
      )}

      {/* ---- Core Impact ---- */}
      {exp.bullets.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-fg)]">
            Core Impact
          </h4>
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

      {/* ---- Skills ---- */}
      {exp.stack.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {exp.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-slate-50 px-3 py-1 font-mono text-[11px] text-[var(--color-fg-muted)]"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Section (client component — receives data as prop)                 */
/* ------------------------------------------------------------------ */

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const reduced = useReducedMotion();

  return (
    <section
      id="experience"
      aria-label="Professional experience"
      className="relative py-24 md:py-32"
    >
      <Container size="default">
        {/* ---- Section heading ---- */}
        <header className="mb-12 md:mb-16">
          <h2 className="relative inline-block font-serif text-[length:var(--text-h2)] font-light leading-[1.05] tracking-[-0.02em] text-[var(--color-fg)]">
            Professional Experience
            <span className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full bg-[var(--color-accent)]" />
          </h2>
        </header>

        {/* ---- Card list ---- */}
        {reduced ? (
          <div className="space-y-6">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.slug} exp={exp} />
            ))}
          </div>
        ) : (
          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: stagger.loose, delayChildren: 0 },
              },
            }}
          >
            {experiences.map((exp) => (
              <motion.div
                key={exp.slug}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: duration.base, ease: ease.out },
                  },
                }}
              >
                <ExperienceCard exp={exp} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
