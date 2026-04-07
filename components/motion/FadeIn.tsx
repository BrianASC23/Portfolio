'use client';

import { duration, ease } from '@/lib/motion';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'section' | 'article';
}

export function FadeIn({ children, delay = 0, y = 16, className, as = 'div' }: FadeInProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: duration.base, ease: ease.out, delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
