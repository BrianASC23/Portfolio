import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

interface PillProps {
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'accent';
}

export function Pill({ children, className, tone = 'default' }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em]',
        tone === 'accent'
          ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
          : 'border-[var(--color-border)] text-[var(--color-fg-muted)]',
        className,
      )}
    >
      {children}
    </span>
  );
}
