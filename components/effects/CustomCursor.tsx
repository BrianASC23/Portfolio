'use client';

import { motion, useReducedMotion, useSpring } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

const OUTER_SIZE = 32;
const INNER_SIZE = 8;

export function CustomCursor() {
  const reduced = useReducedMotion();
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  // Outer ring — weaker spring for trailing lag
  const outerX = useSpring(0, { stiffness: 150, damping: 20 });
  const outerY = useSpring(0, { stiffness: 150, damping: 20 });

  // Inner dot — snappy
  const innerX = useSpring(0, { stiffness: 400, damping: 28 });
  const innerY = useSpring(0, { stiffness: 400, damping: 28 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      outerX.set(e.clientX - OUTER_SIZE / 2);
      outerY.set(e.clientY - OUTER_SIZE / 2);
      innerX.set(e.clientX - INNER_SIZE / 2);
      innerY.set(e.clientY - INNER_SIZE / 2);
      if (!visible) setVisible(true);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setOnDark(!!el?.closest('[data-dark]'));
    },
    [outerX, outerY, innerX, innerY, visible],
  );

  useEffect(() => {
    // Check for coarse pointer (touch device)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Track hover state on interactive elements
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-magnetic], input, textarea, select')) {
        setHovering(true);
      }
    };
    const onOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-magnetic], input, textarea, select')) {
        setHovering(false);
      }
    };

    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden="true">
      {/* Outer ring */}
      <motion.div
        style={{ x: outerX, y: outerY, width: OUTER_SIZE, height: OUTER_SIZE }}
        animate={{
          scale: hovering ? 1.5 : 1,
          borderColor: hovering
            ? 'var(--color-accent)'
            : onDark
              ? 'rgba(255,255,255,0.6)'
              : 'var(--color-fg)',
          boxShadow: onDark
            ? '0 0 12px rgba(251,191,36,0.4), 0 0 24px rgba(251,191,36,0.15)'
            : 'none',
          opacity: visible ? (hovering ? 0.5 : 0.4) : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute rounded-full border"
      />
      {/* Inner dot */}
      <motion.div
        style={{ x: innerX, y: innerY, width: INNER_SIZE, height: INNER_SIZE }}
        animate={{
          scale: hovering ? 0.5 : 1,
          backgroundColor: hovering
            ? 'var(--color-accent)'
            : onDark
              ? '#fbbf24'
              : 'var(--color-fg)',
          boxShadow: onDark
            ? '0 0 8px rgba(251,191,36,0.6), 0 0 16px rgba(251,191,36,0.3)'
            : 'none',
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
        className="absolute rounded-full"
      />
    </div>
  );
}
