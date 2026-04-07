import { FadeIn } from '@/components/motion/FadeIn';
import { Pill } from '@/components/primitives/Pill';
import { Section } from '@/components/primitives/Section';
import { getAllExperiences } from '@/lib/content/experience';
import { formatDate } from '@/lib/utils/format';

function formatRange(start: string, end: string): string {
  const startFormatted = formatDate(`${start}-01`);
  const endFormatted = end === 'present' ? 'Present' : formatDate(`${end}-01`);
  return `${startFormatted} — ${endFormatted}`;
}

export function ExperienceSection() {
  const experiences = getAllExperiences();

  return (
    <Section
      id="experience"
      eyebrow="04 · Experience"
      title="Where I've been"
      containerSize="narrow"
    >
      <ol className="relative space-y-10 border-[var(--color-border)] border-l pl-8">
        {experiences.map((exp, i) => (
          <FadeIn key={exp.slug} delay={i * 0.05} as="li" className="relative">
            <span className="-left-[37px] absolute top-2 h-3 w-3 rounded-full border border-[var(--color-accent)] bg-[var(--color-bg)]" />
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
              <div>
                <h3 className="font-serif text-[var(--color-fg)] text-xl">{exp.role}</h3>
                <p className="text-[var(--color-fg-muted)] text-sm">
                  {exp.company}
                  {exp.location && (
                    <span className="text-[var(--color-fg-subtle)]"> · {exp.location}</span>
                  )}
                </p>
              </div>
              <p className="shrink-0 font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]">
                {formatRange(exp.start, exp.end)}
              </p>
            </div>
            <ul className="mt-4 space-y-1.5 text-[var(--color-fg-muted)] text-sm">
              {exp.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span
                    className="mt-2 h-px w-3 shrink-0 bg-[var(--color-accent)]"
                    aria-hidden="true"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            {exp.stack.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {exp.stack.map((tech) => (
                  <Pill key={tech}>{tech}</Pill>
                ))}
              </div>
            )}
          </FadeIn>
        ))}
      </ol>
    </Section>
  );
}
