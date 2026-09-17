import { fontMono } from '@/app/fonts';
import { Container } from '@/components/primitives/Container';
import { PixelArrow } from '@/components/ui/PixelArrow';
import { getAllExperiences } from '@/lib/content/experience';
import Link from 'next/link';
import { TimelineTrack } from './TimelineTrack';

/** The home page shows only the most recent roles; the rest live on /experience. */
const MAX_HOME_EXPERIENCES = 4;

/**
 * Professional experience as a two-pane vertical timeline.
 *
 * `getAllExperiences` sorts newest first for list views; a timeline reads
 * chronologically, so the most recent few are taken and then reversed.
 */
export function ExperienceTimelineSection() {
  const items = getAllExperiences().slice(0, MAX_HOME_EXPERIENCES).reverse();

  if (items.length < 2) return null;

  return (
    <section
      id="experience"
      aria-label="Experience"
      className="scroll-mt-14 pt-16 pb-16 md:pt-24 md:pb-20"
    >
      <TimelineTrack items={items} />
      <Container>
        <div className="flex justify-center pt-16 md:pt-20">
          <Link
            href="/experience"
            className={`group inline-flex items-center gap-2 border-2 border-[var(--color-border-strong)] px-6 py-3 text-xs uppercase tracking-[0.18em] text-[var(--color-fg)] transition-[translate,border-color,box-shadow] duration-300 hover:translate-x-1 hover:border-[var(--color-accent)] hover:shadow-[0_0_0_2px_var(--color-accent-glow)] ${fontMono.className}`}
          >
            <span className="flex w-2 shrink-0 justify-center text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
              <PixelArrow className="h-3 w-1.5" />
            </span>
            View all experience
          </Link>
        </div>
      </Container>
    </section>
  );
}
