'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { type PointerEvent, type ReactNode, useCallback, useRef } from 'react';

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  max?: number;
}

export function Tilt3D({ children, className, max = 8 }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 180, damping: 18 });
  const sy = useSpring(my, { stiffness: 180, damping: 18 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const reduced = useReducedMotion();

  const handleMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (rafRef.current !== null) return;
      const { clientX, clientY } = e;
      rafRef.current = requestAnimationFrame(() => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          mx.set((clientX - rect.left) / rect.width);
          my.set((clientY - rect.top) / rect.height);
        }
        rafRef.current = null;
      });
    },
    [mx, my],
  );

  const handleLeave = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    mx.set(0.5);
    my.set(0.5);
  }, [mx, my]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
