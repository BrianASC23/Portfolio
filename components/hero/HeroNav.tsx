'use client';

import { fontMono } from '@/app/fonts';
import { PixelArrow } from '@/components/ui/PixelArrow';
import { CONTACT_EMAIL } from '@/lib/nav';
import { useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

const LINKS = [
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/writing', label: 'Blogs' },
  { href: `mailto:${CONTACT_EMAIL}`, label: 'Contact Me' },
] as const;

/** Seconds added per item, so buttons arrive one after another. */
const STAGGER_STEP = 0.08;
/** Held back so the card lands first and the buttons fill it in. */
const STAGGER_BASE = 0.22;
/** Expo-out: fast departure, long soft settle. */
const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

/**
 * Retro-modern menu card.
 *
 * Buttons slide in left-to-right on scroll into view (retro-menu-slide,
 * globals.css) with an 0.08s-per-item stagger; useInView gates the trigger.
 *
 * The entrance lives on the <li> and the hover nudge on the inner <a> on
 * purpose: an animation with fill-mode `both` keeps its final transform
 * applied, which would beat a hover transform on the same element.
 */
export function HeroNav({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });

  return (
    <nav ref={ref} aria-label="Quick navigation" className={`h-full w-full ${className}`}>
      {/* Matte card: 2px retro edge, hard pixel shadow, generous padding */}
      <div
        className="flex h-full flex-col overflow-hidden border-2 border-[var(--color-menu-rule)] bg-[var(--color-menu-panel)] px-8 py-9 md:px-10 md:py-12"
        style={{
          boxShadow: '4px 4px 0px var(--color-menu-ink)',
          // Card settles vertically so it never competes with the buttons'
          // horizontal slide; it leads them by design.
          ...(inView ? { animation: `retro-card-in 0.55s ${EASING} both` } : { opacity: 0 }),
        }}
      >
        <p
          className={`text-center text-[11px] uppercase tracking-[0.5em] text-[var(--color-menu-muted)] ${fontMono.className}`}
        >
          Menu
        </p>

        <ul className="flex flex-1 list-none flex-col justify-center gap-4 py-8 md:gap-5">
          {LINKS.map(({ href, label }, i) => {
            const Comp = href.startsWith('mailto:') ? 'a' : Link;

            return (
              <li
                key={label}
                style={
                  inView
                    ? {
                        animation: `retro-menu-slide 0.6s ${EASING} ${STAGGER_BASE + (i + 1) * STAGGER_STEP}s both`,
                      }
                    : { opacity: 0 }
                }
              >
                <Comp
                  href={href}
                  className={`group flex items-center gap-3 border-2 border-[var(--color-menu-rule)] px-6 py-4 text-xs uppercase tracking-[0.18em] text-[var(--color-menu-text)] hover:translate-x-2 hover:border-[var(--color-accent)] hover:shadow-[0_0_0_2px_var(--color-accent-glow),0_0_18px_var(--color-accent-glow)] focus-visible:translate-x-2 focus-visible:border-[var(--color-accent)] focus-visible:shadow-[0_0_0_2px_var(--color-accent-glow),0_0_18px_var(--color-accent-glow)] focus-visible:outline-none md:text-sm ${fontMono.className}`}
                  style={{
                    // Tailwind v4 nudges via the standalone `translate` property,
                    // not `transform` — transition both so the hover eases.
                    transition: `translate 0.35s ${EASING}, transform 0.35s ${EASING}, border-color 0.25s ease, box-shadow 0.25s ease`,
                  }}
                >
                  {/* Fixed-width slot keeps the label from shifting on hover */}
                  <span className="flex w-2 shrink-0 justify-center text-[var(--color-accent)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <PixelArrow />
                  </span>
                  {label}
                </Comp>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
