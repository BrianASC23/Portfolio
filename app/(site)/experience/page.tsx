import { Container } from '@/components/primitives/Container';
import { getAllExperiences } from '@/lib/content/experience';
import type { Experience } from '@/lib/schemas/experience';
import { formatRange } from '@/lib/utils/format';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experiences',
  description:
    'Professional experience, internships, and roles that have shaped Brian Cao as an engineer.',
};

/** Company name, linked when the entry has a URL. */
function Company({ item }: { item: Experience }) {
  const className = 'text-[var(--color-accent)]';
  if (!item.link) return <span className={className}>{item.company}</span>;
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noreferrer"
      className={`${className} underline-offset-4 hover:underline`}
    >
      {item.company}
    </a>
  );
}

function ExperienceEntry({ item }: { item: Experience }) {
  return (
    <article className="border-t border-[var(--color-border)] pt-6">
      <h2 className="font-serif text-2xl font-bold leading-snug tracking-[-0.01em] text-[var(--color-fg)] md:text-3xl">
        {item.role} @ <Company item={item} />{' '}
        <em className="whitespace-nowrap">({formatRange(item.start, item.end)})</em>
      </h2>

      {item.description && (
        <p className="mt-5 text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
          {item.description}
        </p>
      )}

      <ul className="mt-5 list-disc space-y-2 pl-6 text-base leading-relaxed text-[var(--color-fg-muted)] marker:text-[var(--color-fg)] md:text-lg">
        {item.bullets.map((bullet) => (
          <li key={bullet} className="pl-1">
            {bullet}
          </li>
        ))}
      </ul>

      {item.stack.length > 0 && (
        <p className="mt-5 text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
          <strong className="font-semibold text-[var(--color-fg)]">Technologies:</strong>{' '}
          {item.stack.join(', ')}
        </p>
      )}
    </article>
  );
}

/** Every role, newest first, as a plain résumé-style document. */
export default function ExperiencePage() {
  const experiences = getAllExperiences();

  return (
    <section aria-label="Experience" className="pt-28 pb-24 md:pt-36 md:pb-32">
      <Container>
        <h1 className="border-b border-[var(--color-border)] pb-4 font-serif text-[length:var(--text-h2)] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--color-fg)]">
          Experience
        </h1>

        <div className="mt-10 flex flex-col gap-16 md:gap-20">
          {experiences.map((item) => (
            <ExperienceEntry key={item.slug} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
