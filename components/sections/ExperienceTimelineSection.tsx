import { Container } from '@/components/primitives/Container';
import { getAllExperiences } from '@/lib/content/experience';
import type { Experience } from '@/lib/schemas/experience';
import { formatRange } from '@/lib/utils/format';
import Link from 'next/link';

/** The home page shows only the most recent roles; the rest live on /experience. */
const MAX_HOME_EXPERIENCES = 4;

/**
 * One role: dates in mono to the left of the rule, role and company in serif
 * to its right, with the one-line description underneath.
 *
 * The bullet lists stay on /experience. Four roles with three bullets each is
 * eleven hundred words, which is more than a twenty-second skim can spend and
 * more than the homepage has to prove.
 */
function ExperienceRow({ item }: { item: Experience }) {
  return (
    <li className="grid gap-x-8 gap-y-2 border-t border-[var(--color-border)] py-6 md:grid-cols-[11rem_minmax(0,1fr)]">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)] md:pt-2">
        {formatRange(item.start, item.end)}
      </p>

      <div>
        <h3 className="font-serif text-[length:var(--text-h3)] leading-snug tracking-[-0.01em] text-[var(--color-fg)]">
          {item.role}
          <span aria-hidden="true" className="px-2 text-[var(--color-border-strong)]">
            /
          </span>
          <span className="text-[var(--color-fg-muted)]">{item.company}</span>
        </h3>

        {item.description && (
          <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
            {item.description}
          </p>
        )}
      </div>
    </li>
  );
}

/**
 * Professional experience as a dated list, newest first — matching
 * /experience and the resume, so the latest role is read first.
 *
 * This replaced a scroll-linked timeline: a two-pane rail with a pixel sprite
 * climbing it as the page scrolled. It needed a scroll listener and a state
 * update per frame to animate furniture around the dates, and on a phone the
 * rail and the sprite were most of what you saw. The dates were always the
 * content.
 */
export function ExperienceTimelineSection() {
  const items = getAllExperiences().slice(0, MAX_HOME_EXPERIENCES);

  if (items.length < 2) return null;

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="scroll-mt-20 pb-24 md:pb-32"
    >
      <Container size="wide">
        <div className="flex items-baseline justify-between border-t border-[var(--color-border)] pt-5">
          <h2
            id="experience-heading"
            className="font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"
          >
            Experience
          </h2>
          <Link
            href="/experience"
            className="text-[13px] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            All experience →
          </Link>
        </div>

        <ul className="mt-8 list-none md:mt-10">
          {items.map((item) => (
            <ExperienceRow key={item.slug} item={item} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
