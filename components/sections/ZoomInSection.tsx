'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useRef, useState } from 'react';

/** How small the section starts before it grows into place. */
const START_SCALE = 0.82;
/** Fade finishes before the scale does, so text is readable while still growing. */
const FADE_RATE = 1.9;

/**
 * Grows its children into place as they arrive, so the hero's zoom continues
 * into this section rather than the page simply scrolling past it.
 *
 * The scroll window runs from the section's top touching the viewport bottom to
 * it reaching the viewport top — which overlaps the hero's final stretch, so
 * the two movements read as one continuous push inward.
 *
 * Transform origin is the top edge: growing from the centre would drag the
 * heading up through the fold as it scales.
 */
export function ZoomInSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    // Starts well before the section reaches the viewport: the hero above is
    // pinned, so 'start end' would not fire until the pin had already released
    // and the two movements would read as sequential rather than continuous.
    offset: ['start 165%', 'start start'],
  });
  useMotionValueEvent(scrollYProgress, 'change', setProgress);

  const arrived = Math.min(Math.max(progress, 0), 1);
  const scale = START_SCALE + arrived * (1 - START_SCALE);
  const opacity = Math.min(1, arrived * FADE_RATE);

  return (
    <div
      ref={ref}
      // Pulled up under the hero's tail so the dissolve reveals it rather than
      // handing over to a viewport of blank page.
      className="relative -mt-[80vh] will-change-transform"
      style={{ transform: `scale(${scale})`, transformOrigin: '50% 0%', opacity }}
    >
      {children}
    </div>
  );
}
