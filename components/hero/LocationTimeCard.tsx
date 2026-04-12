'use client';

import { useNewYorkTime } from '@/lib/hooks/useNewYorkTime';
import { GLASS } from '@/lib/styles';

export function LocationTimeCard() {
  const time = useNewYorkTime();

  return (
    <div data-card="location" className={`${GLASS} p-5 backdrop-blur-2xl`}>
      <p className="mb-2 text-[11px] uppercase tracking-[0.1em] text-[var(--color-fg-subtle)]">
        Location
      </p>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-[var(--color-fg-muted)]">Based in New York 🍎</span>
        <time
          suppressHydrationWarning
          className="font-mono text-sm tabular-nums text-[var(--color-fg-subtle)]"
        >
          {time || '--:--:-- --'}
        </time>
      </div>
    </div>
  );
}
