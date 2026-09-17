'use client';

import { fontMono } from '@/app/fonts';
import { Container } from '@/components/primitives/Container';
import { PixelClimber } from '@/components/ui/PixelClimber';
import type { Experience } from '@/lib/schemas/experience';
import { formatRange } from '@/lib/utils/format';
import { useInView, useMotionValueEvent, useScroll } from 'framer-motion';
import { useRef, useState } from 'react';
import { SectionIntro } from './SectionIntro';

/**
 * Experience timeline: role and dates left of the rail, company and summary
 * right of it, a climber working the rail down the middle.
 *
 * Column templates are fixed-width on the left so the rail's x-offset is a
 * plain calc — `1fr` there would make the centre unknowable in CSS, and the
 * rail has to line up with the markers at both breakpoints.
 *
 * The list scrolls normally and the climber tracks the viewport's centre line
 * through it. It used to pin to a single viewport, but with full bullet lists
 * the entries run far taller than a screen and spilled over the neighbouring
 * sections. No wheel hijacking, so keyboard, trackpad and screen-reader
 * scrolling all still work.
 */
export function TimelineTrack({ items }: { items: Experience[] }) {
  const columnRef = useRef<HTMLDivElement>(null);
  /** Fires as the section rises into place, handing off from Projects. */
  const columnInView = useInView(columnRef, { once: true, margin: '-15% 0px' });
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: columnRef,
    offset: ['start center', 'end center'],
  });
  useMotionValueEvent(scrollYProgress, 'change', setProgress);

  const travelled = Math.min(Math.max(progress, 0), 1);
  const activeIndex = Math.min(Math.floor(travelled * items.length), items.length - 1);

  if (items.length === 0) return null;

  /** Grid: [rail | content] stacked, [role | rail | content] from md up. */
  const rowGrid =
    'grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-5 md:grid-cols-[18rem_2.5rem_minmax(0,1fr)]';

  return (
    <Container>
      <SectionIntro title="Experience" />

      <div className="relative mx-auto mt-12 max-w-[1040px] md:mt-20">
        {/* Timed just behind SectionIntro's title so the section assembles
            top-down instead of arriving all at once. */}
        <div
          ref={columnRef}
          className="relative min-w-0 flex-1"
          style={
            columnInView
              ? { animation: 'section-slide-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both' }
              : { opacity: 0 }
          }
        >
          {/* Rail x = marker column centre: 18rem role + 1.25rem gap + 1.25rem half-column */}
          <div className="absolute inset-y-2 left-[1.25rem] w-[2px] -translate-x-1/2 bg-[var(--color-border-strong)] md:left-[20.5rem]">
            <div
              className="absolute inset-x-0 top-0 bg-[var(--color-accent)]"
              style={{ height: `${travelled * 100}%` }}
            />
          </div>

          <div
            className="pointer-events-none absolute left-[1.25rem] z-10 -translate-x-1/2 -translate-y-1/2 will-change-transform md:left-[20.5rem]"
            style={{ top: `calc(0.5rem + ${travelled} * (100% - 1rem))` }}
          >
            <PixelClimber className="h-11 w-auto" />
          </div>

          <ul className="flex list-none flex-col gap-14 md:gap-20">
            {items.map((item, i) => {
              const isActive = i === activeIndex;
              const reached = i <= activeIndex;

              return (
                <li key={item.slug} className={rowGrid}>
                  {/* Marker — column 1 stacked, column 2 from md up */}
                  <div className="col-start-1 row-span-2 row-start-1 flex justify-center pt-3 md:col-start-2 md:row-span-1">
                    <span
                      aria-hidden="true"
                      className={`h-3 w-3 shrink-0 border-2 transition-all duration-300 ${
                        isActive ? 'scale-150' : ''
                      } ${
                        reached
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                          : 'border-[var(--color-border-strong)] bg-[var(--color-bg)]'
                      }`}
                    />
                  </div>

                  {/* Role and dates — left of the rail from md up */}
                  <div className="col-start-2 row-start-1 text-left md:col-start-1 md:row-start-1 md:text-right">
                    <h3
                      className={`font-serif text-2xl font-bold leading-tight tracking-[-0.02em] transition-colors duration-300 md:text-3xl ${
                        isActive ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'
                      }`}
                    >
                      {item.role}
                    </h3>
                    <p
                      className={`mt-3 text-base uppercase tracking-[0.14em] transition-colors duration-300 md:text-lg ${
                        isActive ? 'text-[var(--color-accent-lo)]' : 'text-[var(--color-fg-subtle)]'
                      } ${fontMono.className}`}
                    >
                      {formatRange(item.start, item.end)}
                    </p>
                  </div>

                  {/* Company and summary — right of the rail */}
                  <div className="col-start-2 row-start-2 mt-3 md:col-start-3 md:row-start-1 md:mt-0">
                    <p
                      className={`font-serif text-2xl font-bold leading-tight tracking-[-0.02em] transition-colors duration-300 md:text-3xl ${
                        isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-fg-subtle)]'
                      }`}
                    >
                      {item.company}
                    </p>

                    <span
                      aria-hidden="true"
                      className={`mt-4 block h-[2px] w-10 transition-colors duration-300 ${
                        isActive ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border-strong)]'
                      }`}
                    />

                    {item.bullets.length > 0 && (
                      <ul className="mt-5 flex max-w-[68ch] list-none flex-col gap-2.5">
                        {item.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex gap-2.5 text-base leading-relaxed text-[var(--color-fg-muted)]"
                          >
                            <span
                              className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--color-accent)]"
                              aria-hidden="true"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Container>
  );
}
