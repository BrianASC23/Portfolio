import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

type Level = 1 | 2 | 3 | 4;

interface HeadingProps {
  level?: Level;
  children: ReactNode;
  className?: string;
  display?: boolean;
  id?: string;
}

const levelClasses: Record<Level, string> = {
  1: 'text-[length:var(--text-h1)] leading-[1.05]',
  2: 'text-[length:var(--text-h2)] leading-[1.1]',
  3: 'text-[length:var(--text-h3)] leading-[1.15]',
  4: 'text-xl leading-snug',
};

export function Heading({ level = 1, children, className, display, id }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      id={id}
      className={cn(
        display ? 'font-serif tracking-tight' : 'font-sans font-semibold tracking-tight',
        'text-[var(--color-fg)]',
        levelClasses[level],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
