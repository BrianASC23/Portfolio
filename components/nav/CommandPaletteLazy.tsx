'use client';

import dynamic from 'next/dynamic';

const CommandPalette = dynamic(
  () => import('./CommandPalette').then((m) => ({ default: m.CommandPalette })),
  {
    ssr: false,
    loading: () => <div className="h-12 rounded bg-[var(--color-bg-elevated)]" />,
  },
);

export function CommandPaletteLazy() {
  return <CommandPalette />;
}
