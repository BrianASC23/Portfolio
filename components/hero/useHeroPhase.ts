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
      // Clear any flag left by a transient reduced=false first render.
      // useReducedMotion initializes synchronously to `false` and only
      // reads matchMedia inside its own useEffect, so this effect can
      // fire once with reduced=false (writing the flag) before firing
      // again with reduced=true. Without this cleanup, a user who later
      // disables reduced motion would be stuck on the held state.
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        // sessionStorage can throw in private mode — fail silent.
      }
      return;
    }
    if (sessionStorage.getItem(SESSION_KEY)) {
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
