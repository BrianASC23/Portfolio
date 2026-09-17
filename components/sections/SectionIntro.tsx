'use client';

import { fontMono } from '@/app/fonts';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

/**
 * Hand-off between sections: a pixel rule that draws itself outward from the
 * centre, with the label rising underneath.
 *
 * `tone="inverted"` swaps the type to the menu palette for sections that sit on
 * the dark panel colour, so one heading treatment covers both backgrounds.
 */
export function SectionIntro({
  eyebrow,
  title,
  tone = 'default',
}: {
  eyebrow?: string;
  title: string;
  tone?: 'default' | 'inverted';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });

  const enter = (name: string, delay: number) =>
    inView ? { animation: `${name} 0.7s ${EASING} ${delay}s both` } : { opacity: 0 };

  const inverted = tone === 'inverted';
  const eyebrowTone = inverted ? 'text-[var(--color-menu-muted)]' : 'text-[var(--color-fg-subtle)]';
  const titleTone = inverted ? 'text-[var(--color-menu-text)]' : 'text-[var(--color-fg)]';

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      {/* Stepped rule — three blocks, tapering, so it reads as pixels not a line */}
      <div className="flex items-end gap-1" style={enter('section-rule-in', 0)} aria-hidden="true">
        <span className="h-1 w-8 bg-[var(--color-accent)]" />
        <span className="h-1 w-3 bg-[var(--color-accent)] opacity-60" />
        <span className="h-1 w-1.5 bg-[var(--color-accent)] opacity-30" />
      </div>

      {eyebrow && (
        <p
          className={`mt-5 text-[11px] uppercase tracking-[0.45em] ${eyebrowTone} ${fontMono.className}`}
          style={enter('project-in-up', 0.08)}
        >
          {eyebrow}
        </p>
      )}

      <h2
        className={`${eyebrow ? 'mt-3' : 'mt-6'} font-serif text-[length:var(--text-h2)] font-light leading-[1.05] tracking-[-0.02em] ${titleTone}`}
        style={enter('project-in-up', 0.16)}
      >
        {title}
      </h2>
    </div>
  );
}
