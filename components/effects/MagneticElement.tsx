'use client';

import { motion, useReducedMotion, useSpring } from 'framer-motion';
import { type ReactNode, useCallback, useRef } from 'react';

interface MagneticElementProps {
  as?: keyof HTMLElementTagNameMap;
  strength?: number;
  className?: string;
  children: ReactNode;
}

export function MagneticElement({
  as = 'div',
  strength = 0.3,
  className,
  children,
}: MagneticElementProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current || reduced) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * strength);
      y.set((e.clientY - centerY) * strength);
    },
    [x, y, strength, reduced],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  // Use motion.div with the `as` semantics handled via the wrapper
  const MotionTag = motion.create(as as 'div');

  return (
    <MotionTag
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      data-magnetic
    >
      {children}
    </MotionTag>
  );
}
