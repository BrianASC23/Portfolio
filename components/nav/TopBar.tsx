import Link from 'next/link';
import { CommandTrigger } from './CommandTrigger';
import { MobileMenu } from './MobileMenu';

const LINKS = [
  { href: '/#work', label: 'Work' },
  { href: '/#about', label: 'About' },
  { href: '/writing', label: 'Writing' },
  { href: '/resume', label: 'Resume' },
];

export function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-[var(--color-border)]/60 border-b bg-[var(--color-bg)]/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 md:px-8 lg:px-12">
        <Link
          href="/"
          className="font-mono text-[var(--color-fg)] text-xs uppercase tracking-[0.18em] hover:text-[var(--color-accent)]"
        >
          BC · <span className="text-[var(--color-fg-subtle)]">Portfolio</span>
        </Link>
        <nav className="hidden gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] text-[var(--color-fg-muted)] uppercase tracking-[0.16em] transition-colors hover:text-[var(--color-accent)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <CommandTrigger />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
