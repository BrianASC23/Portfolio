import { cn } from '@/lib/utils/cn';
import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface AppLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps>,
    NextLinkProps {
  children: ReactNode;
  underline?: boolean;
}

export function AppLink({ children, className, underline = true, href, ...rest }: AppLinkProps) {
  const external = typeof href === 'string' && /^https?:/.test(href);
  return (
    <NextLink
      href={href}
      className={cn(
        'text-[var(--color-fg)] transition-colors hover:text-[var(--color-accent)]',
        underline &&
          'underline decoration-[var(--color-border-strong)] decoration-1 underline-offset-4 hover:decoration-[var(--color-accent)]',
        className,
      )}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </NextLink>
  );
}
