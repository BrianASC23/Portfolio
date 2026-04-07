'use client';

import { usePointerFine } from '@/lib/hooks/usePointerFine';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CursorLayer() {
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });
  const [hovering, setHovering] = useState<'default' | 'hover' | 'text'>('default');

  useEffect(() => {
    if (!fine || reduced) return;

    document.documentElement.classList.add('cursor-none');

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest('a, button, [role="button"], [data-cursor="hover"]')) setHovering('hover');
      else if (el.closest('p, h1, h2, h3, h4, blockquote, [data-cursor="text"]'))
        setHovering('text');
      else setHovering('default');
    };

    window.addEventListener('pointermove', onMove);
    return () => {
      document.documentElement.classList.remove('cursor-none');
      window.removeEventListener('pointermove', onMove);
    };
  }, [fine, reduced, x, y]);

  if (!fine || reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        animate={{
          width: hovering === 'hover' ? 48 : hovering === 'text' ? 2 : 10,
          height: hovering === 'hover' ? 48 : hovering === 'text' ? 24 : 10,
          borderRadius: hovering === 'text' ? 1 : 999,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="bg-white"
      />
    </motion.div>
  );
}
