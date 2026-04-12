'use client';

import { useReducedMotion } from 'framer-motion';

const PARTICLE_COUNT = 15;

// Deterministic pseudo-random to avoid SSR/client hydration mismatch
function seeded(i: number, salt: number): number {
  const x = Math.sin(i * 9301 + salt * 49297) * 49979;
  return x - Math.floor(x);
}

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left: `${Math.round((i / PARTICLE_COUNT) * 100 + seeded(i, 1) * 5)}%`,
  delay: `${(seeded(i, 2) * 6).toFixed(1)}s`,
  duration: `${(4 + seeded(i, 3) * 4).toFixed(1)}s`,
}));

export function AtmosphericDust() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-0 left-0 z-40 h-[150px] w-full"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 h-1 w-1 rounded-full bg-[var(--color-accent-lo)]"
          style={{
            left: p.left,
            animationName: 'dust-drift',
            animationDuration: p.duration,
            animationDelay: p.delay,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-out',
            animationFillMode: 'backwards',
          }}
        />
      ))}
    </div>
  );
}
