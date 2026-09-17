'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface HeroPortraitProps {
  src: string;
  alt?: string;
  className?: string;
  /** Rendered widths, forwarded to next/image so it picks a sensible source. */
  sizes?: string;
}

/**
 * Hero portrait — a real photo, optimised through next/image.
 *
 * The drawn silhouette remains only as a safety net for a missing file, so the
 * hero degrades to something deliberate instead of a broken-image icon.
 */
export function HeroPortrait({
  src,
  alt = 'Portrait',
  className = '',
  sizes = '(min-width: 768px) 192px, 160px',
}: HeroPortraitProps) {
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`relative flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-inset)] ${className}`}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          className="h-full w-full text-[var(--color-fg-subtle)]"
          role="img"
          aria-label="Photo placeholder"
        >
          {/* Head */}
          <circle cx="50" cy="36" r="14" fill="currentColor" opacity="0.25" />
          {/* Shoulders */}
          <ellipse cx="50" cy="80" rx="28" ry="20" fill="currentColor" opacity="0.15" />
        </svg>
      )}
    </motion.div>
  );
}
