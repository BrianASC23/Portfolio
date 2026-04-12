'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface TypewriterProps {
  /** Single string or array of strings to cycle through */
  strings: string | string[];
  /** Delay between each character appearing (seconds) */
  charDelay?: number;
  /** Pause duration on a fully typed string before deleting (ms) */
  pauseMs?: number;
  /** Extra className on the outer wrapper */
  className?: string;
}

export function Typewriter({
  strings,
  charDelay = 0.05,
  pauseMs = 2000,
  className,
}: TypewriterProps) {
  const items = Array.isArray(strings) ? strings : [strings];
  const cycle = items.length > 1;
  const reduced = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const current = items[index] ?? '';

  const tick = useCallback(() => {
    if (isDeleting) {
      setDisplayed((prev) => prev.slice(0, -1));
    } else {
      setDisplayed((prev) => current.slice(0, prev.length + 1));
    }
  }, [current, isDeleting]);

  useEffect(() => {
    // Reduced motion: just show the full string, no animation
    if (reduced) {
      setDisplayed(current);
      return;
    }

    // Finished typing
    if (!isDeleting && displayed === current) {
      if (!cycle) return; // single string — done
      const pause = setTimeout(() => setIsDeleting(true), pauseMs);
      return () => clearTimeout(pause);
    }

    // Finished deleting
    if (isDeleting && displayed === '') {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % items.length);
      return;
    }

    const speed = isDeleting ? charDelay * 0.4 : charDelay;
    const timer = setTimeout(tick, speed * 1000);
    return () => clearTimeout(timer);
  }, [displayed, isDeleting, current, cycle, charDelay, pauseMs, tick, reduced, items.length]);

  // Reduced motion: static text, no cursor blink
  if (reduced) {
    return (
      <span className={className}>
        <span className="font-[family-name:var(--font-grotesk)]">{current}</span>
        <span className="font-[family-name:var(--font-grotesk)] text-[var(--color-accent)]">|</span>
      </span>
    );
  }

  return (
    <span className={className}>
      <AnimatePresence mode="popLayout">
        {displayed.split('').map((char, i) => (
          <motion.span
            // biome-ignore lint/suspicious/noArrayIndexKey: character position is the identity
            key={`${index}-${char}-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: charDelay, ease: 'easeOut' }}
            className="font-[family-name:var(--font-grotesk)]"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Blinking cursor */}
      <motion.span
        aria-hidden="true"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        className="inline-block font-[family-name:var(--font-grotesk)] text-[var(--color-accent)]"
      >
        |
      </motion.span>
    </span>
  );
}
