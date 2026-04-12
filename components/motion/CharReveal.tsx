'use client';

import { duration, ease } from '@/lib/motion';
import { motion, useReducedMotion } from 'framer-motion';
import { memo } from 'react';

interface CharRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

const container = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.04,
      delayChildren: delay,
    },
  }),
};

const child = {
  hidden: { y: '110%', rotateX: 4 },
  visible: {
    y: 0,
    rotateX: 0,
    transition: { duration: duration.reveal, ease: ease.out },
  },
};

export const CharReveal = memo(function CharReveal({
  text,
  className,
  delay = 0,
}: CharRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={className}
      variants={container}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {text.split('').map((char, i) => (
        <span
          key={`char-${i}-${char}`}
          className="inline-block overflow-hidden align-bottom"
          style={{ perspective: '600px' }}
        >
          <motion.span className="inline-block" variants={child}>
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
});
