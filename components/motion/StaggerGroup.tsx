'use client';

import { duration, ease, stagger } from '@/lib/motion';
import { motion, useReducedMotion } from 'framer-motion';
import { Children, type ReactNode, isValidElement } from 'react';

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  gap?: keyof typeof stagger;
  delay?: number;
  y?: number;
}

export function StaggerGroup({
  children,
  className,
  gap = 'base',
  delay = 0,
  y = 16,
}: StaggerGroupProps) {
  const reduced = useReducedMotion();
  const items = Children.toArray(children).filter(isValidElement);

  if (reduced) {
    return <div className={className}>{items}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger[gap], delayChildren: delay },
        },
      }}
    >
      {items.map((child, i) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: positional animation
          key={i}
          variants={{
            hidden: { opacity: 0, y },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: duration.base, ease: ease.out },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
