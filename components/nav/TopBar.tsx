import { CONTACT_EMAIL, NAV_LINKS } from '@/lib/nav';
import Link from 'next/link';
import { MobileMenu } from './MobileMenu';

export function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 md:px-8 lg:px-12">
        <Link href="/" className="text-[17px] font-bold tracking-[-0.02em] text-[var(--color-fg)]">
          Brian Cao
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hi)]"
          >
            Contact
          </a>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
