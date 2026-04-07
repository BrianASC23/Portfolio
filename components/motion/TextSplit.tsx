'use client';

import { duration, ease, stagger } from '@/lib/motion';
import { motion, useReducedMotion } from 'framer-motion';

interface TextSplitProps {
  text: string;
  className?: string;
  delay?: number;
  by?: 'word' | 'char';
}

export function TextSplit({ text, className, delay = 0, by = 'word' }: TextSplitProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  const units = by === 'word' ? text.split(/(\s+)/) : text.split('');

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger.tight, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {units.map((unit, i) =>
        unit.match(/^\s+$/) ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: space preservation
          <span key={i} aria-hidden="true">
            {unit}
          </span>
        ) : (
          <motion.span
            // biome-ignore lint/suspicious/noArrayIndexKey: positional animation
            key={i}
            className="inline-block"
            aria-hidden="true"
            variants={{
              hidden: { opacity: 0, y: '0.4em' },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: duration.slow, ease: ease.out },
              },
            }}
          >
            {unit}
          </motion.span>
        ),
      )}
    </motion.span>
  );
}
