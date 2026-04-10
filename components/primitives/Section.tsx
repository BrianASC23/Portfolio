import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';
import { Container } from './Container';

interface SectionProps {
  id: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  containerSize?: 'narrow' | 'default' | 'wide' | 'bleed';
  ariaLabel?: string;
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  containerSize = 'default',
  ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel ?? eyebrow ?? id}
      className={cn('relative py-24 md:py-32', className)}
    >
      <Container size={containerSize}>
        {(eyebrow || title || description) && (
          <header className="mb-12 md:mb-16">
            {eyebrow && <p className="text-sm text-[var(--color-fg-subtle)]">{eyebrow}</p>}
            {title && (
              <h2 className="relative mt-3 inline-block font-serif text-[length:var(--text-h2)] font-light leading-[1.05] tracking-[-0.02em] text-[var(--color-fg)]">
                {title}
                <span className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full bg-[var(--color-accent)]" />
              </h2>
            )}
            {description && (
              <p className="mt-4 max-w-2xl text-[var(--color-fg-muted)]">{description}</p>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
