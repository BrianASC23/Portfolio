import type { Variants } from 'framer-motion';
import { duration, ease, stagger } from './motion';

/** Stagger container — use on a parent wrapping `staggerItem` children. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger.loose, delayChildren: 0 },
  },
};

/** Fade-up item — pair with `staggerContainer`. */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
};

/** Slide-in item — alternates left/right based on custom property. */
export function slideInItem(fromLeft: boolean): Variants {
  return {
    hidden: { opacity: 0, x: fromLeft ? -60 : 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: duration.base, ease: ease.out },
    },
  };
}

/** Shared viewport config for whileInView triggers. */
export const VIEWPORT_ONCE = { once: true, margin: '-10% 0px' } as const;
