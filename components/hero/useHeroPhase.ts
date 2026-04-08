'use client';

import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useEffect, useState } from 'react';

export type HeroPhase = 'initial' | 'playing' | 'held';

const SESSION_KEY = 'bc:brain-hero-played';

/**
 * Owns the brain hero animation lifecycle.
 *
 *  - `initial` — server-rendered / pre-effect state. The DOM renders
 *    the held final state so there is no layout shift.
 *  - `playing` — the first mount in a fresh session with motion
 *    enabled. Writes a session flag so reloads within the tab skip
 *    straight to held.
 *  - `held` — reduced motion preferred, session flag already set, or
 *    the animation has completed.
 */
export function useHeroPhase(): HeroPhase {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<HeroPhase>('initial');

  useEffect(() => {
    if (reduced) {
      setPhase('held');
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        // sessionStorage can throw in private mode — fail silent.
      }
      return;
    }
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) {
      setPhase('held');
      return;
    }
    setPhase('playing');
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // sessionStorage can throw in private mode — fail silent.
    }
  }, [reduced]);

  return phase;
}
