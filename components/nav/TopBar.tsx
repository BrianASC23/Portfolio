'use client';

import { NAV_LINKS } from '@/lib/nav';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from './ThemeToggle';

function isActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

/**
 * One nav, two layouts. Below `md` it is a slim bar across the top; from `md`
 * up it becomes a fixed left rail, which is why the markup is a single flex
 * container that changes direction rather than two separate navs — rendering
 * the wordmark and the contact link twice would duplicate them in the
 * accessibility tree, and screen readers would announce both.
 */
export function TopBar() {
  const pathname = usePathname() ?? '/';

  return (
    <header
      className={cn(
        // Mobile: fixed top bar.
        'fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between gap-4',
        'border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 px-6 backdrop-blur-md',
        // Desktop: fixed left rail, no chrome — the page ground runs behind it.
        'md:inset-x-auto md:left-0 md:h-dvh md:w-56 md:flex-col md:items-start',
        'md:border-b-0 md:bg-transparent md:px-8 md:py-10 md:backdrop-blur-none',
      )}
    >
      <Link href="/" className="flex items-center gap-2.5 md:mb-14">
        <span aria-hidden="true" className="block h-2.5 w-2.5 bg-[var(--color-accent-hi)]" />
        <span className="text-sm font-medium tracking-[-0.01em] text-[var(--color-fg-muted)]">
          Brian Cao
        </span>
      </Link>

      <nav
        aria-label="Primary"
        className="hidden md:flex md:flex-1 md:flex-col md:items-start md:gap-1"
      >
        {NAV_LINKS.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'rounded-md text-[15px] leading-tight transition-colors',
                active
                  ? '-ml-[13px] border border-[var(--color-fg)] px-3 py-[5px] text-[var(--color-accent)]'
                  : 'py-[5px] text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]',
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:flex md:flex-col md:items-start md:gap-5">
        <Link
          href="/contact"
          className="text-[15px] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)]"
        >
          Contact
        </Link>
        <ThemeToggle />
      </div>

      <MobileMenu />
    </header>
  );
}
