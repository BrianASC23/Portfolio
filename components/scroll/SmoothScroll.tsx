'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { type ReactNode, useEffect, useRef } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * Lenis smooth scrolling, driven by GSAP's ticker rather than its own rAF loop.
 *
 * This matters for any pinned ScrollTrigger on the page. Lenis interpolates the
 * scroll position, so the value ScrollTrigger reads from its own rAF is a frame
 * behind what Lenis is about to paint, and a pinned section visibly judders.
 * Sharing one clock and telling ScrollTrigger to update on every Lenis tick puts
 * measurement and paint in the same frame.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    // gsap.ticker reports seconds; lenis.raf expects milliseconds.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Lenis does its own catch-up after a stall; GSAP's lag smoothing on top of
    // that makes the scroll jump.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
