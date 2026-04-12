import { GLASS } from '@/lib/styles';
import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** data-card attribute for CSS/testing selectors */
  tag?: string;
  /** Disable hover transform (for static containers like form wrappers). */
  static?: boolean;
  as?: 'div' | 'article' | 'section';
}

export function GlassCard({
  children,
  className,
  tag,
  static: isStatic,
  as: Tag = 'div',
}: GlassCardProps) {
  return (
    <Tag
      {...(tag ? { 'data-card': tag } : {})}
      className={cn(
        GLASS,
        isStatic &&
          'hover:scale-100 hover:shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)]',
        'backdrop-blur-2xl',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
