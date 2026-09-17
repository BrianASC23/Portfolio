'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/** Pixel-style sun/moon toggle for day/night mode. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Avoid hydration mismatch — render a placeholder with same dimensions
    return <span className="inline-block h-8 w-8" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
    >
      {isDark ? (
        /* Sun icon */
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <line
            x1="9"
            y1="1"
            x2="9"
            y2="3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
          <line
            x1="9"
            y1="15"
            x2="9"
            y2="17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
          <line
            x1="1"
            y1="9"
            x2="3"
            y2="9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
          <line
            x1="15"
            y1="9"
            x2="17"
            y2="9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
          <line
            x1="3.34"
            y1="3.34"
            x2="4.76"
            y2="4.76"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
          <line
            x1="13.24"
            y1="13.24"
            x2="14.66"
            y2="14.66"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
          <line
            x1="3.34"
            y1="14.66"
            x2="4.76"
            y2="13.24"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
          <line
            x1="13.24"
            y1="4.76"
            x2="14.66"
            y2="3.34"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
      ) : (
        /* Moon icon */
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M15.1 10.64A7 7 0 0 1 7.36 2.9a7 7 0 1 0 7.74 7.74Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
