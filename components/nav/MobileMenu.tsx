'use client';

import { cn } from '@/lib/utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const LINKS = [
  { href: '/#work', label: 'Work' },
  { href: '/#about', label: 'About' },
  { href: '/writing', label: 'Writing' },
  { href: '/resume', label: 'Resume' },
  { href: '/#contact', label: 'Contact' },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-fg)] md:hidden"
      >
        <span
          className={cn(
            'block h-px w-4 bg-current transition',
            open && 'translate-y-[3px] rotate-45',
          )}
        />
        <span
          className={cn(
            'absolute block h-px w-4 bg-current transition',
            open && '-rotate-45 -translate-y-[3px]',
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed inset-x-0 top-[56px] z-40 mx-4 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-4 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 font-mono text-[var(--color-fg)] text-sm uppercase tracking-[0.12em] hover:bg-[var(--color-bg-inset)] hover:text-[var(--color-accent)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
