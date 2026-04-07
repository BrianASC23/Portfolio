'use client';

import { duration, ease } from '@/lib/motion';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Vertical mask reveal — text slides up from behind a clipping mask.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={`inline-block overflow-hidden align-bottom ${className ?? ''}`}>
      <motion.span
        className="inline-block"
        initial={{ y: '100%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: duration.slow, ease: ease.out, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
