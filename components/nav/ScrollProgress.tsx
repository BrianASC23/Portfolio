'use client';

import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.5 });
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 right-0 left-0 z-40 h-[2px] origin-left bg-[var(--color-accent)]"
    />
  );
}
