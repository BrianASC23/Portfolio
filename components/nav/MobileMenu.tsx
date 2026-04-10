'use client';

import { CONTACT_EMAIL, NAV_LINKS } from '@/lib/nav';
import { cn } from '@/lib/utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

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
            open && '-translate-y-[3px] -rotate-45',
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
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  {link.download ? (
                    <a
                      href={link.href}
                      download
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-4 py-3 text-sm text-[var(--color-fg)] hover:bg-[var(--color-bg-inset)] hover:text-[var(--color-accent)]"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-4 py-3 text-sm text-[var(--color-fg)] hover:bg-[var(--color-bg-inset)] hover:text-[var(--color-accent)]"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-[var(--color-accent)]"
                >
                  Contact →
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
