'use client';

import Lenis from 'lenis';
import { type ReactNode, useEffect } from 'react';

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * Lenis smooth scrolling on pointer devices.
 *
 * Lenis drives its own rAF loop here. It previously shared GSAP's ticker so a
 * pinned ScrollTrigger would measure and paint in the same frame; nothing on
 * the site pins any more, so that coupling — and GSAP with it — is gone.
 *
 * Skipped entirely on touch, where the native momentum scroll is better than
 * anything interpolated on the main thread, and on reduced-motion.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (prefersReduced || isTouch) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

    let frame = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
