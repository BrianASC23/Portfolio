'use client';

import { fontMono } from '@/app/fonts';
import { type GlyphName, PixelGlyph } from '@/components/ui/PixelGlyph';

/** Expo-out, matching the retro menu so the page shares one motion language. */
const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
/** Hero shadow tone, so the offset reads on both the day and dusk footer. */
const SHADOW = '4px 4px 0px var(--hero-shadow)';

interface ContactCardProps {
  glyph: GlyphName;
  label: string;
  value: string;
  href?: string;
  /** Extra lines under the value, e.g. a second profile link. */
  children?: React.ReactNode;
}

/**
 * One contact panel: pixel glyph, mono label, value.
 *
 * Rendered as a link when `href` is given, otherwise a plain panel — a static
 * address should not look clickable.
 */
export function ContactCard({ glyph, label, value, href, children }: ContactCardProps) {
  const isExternal = Boolean(href) && !href?.startsWith('mailto:');

  const body = (
    <>
      <span className="flex h-9 items-end text-[var(--color-accent)]">
        <PixelGlyph name={glyph} className="h-8 w-auto" />
      </span>

      <p
        className={`mt-4 text-[10px] uppercase tracking-[0.3em] text-[var(--color-menu-muted)] ${fontMono.className}`}
      >
        {label}
      </p>

      <p className={`mt-2 break-words text-sm text-[var(--color-menu-text)] ${fontMono.className}`}>
        {value}
      </p>

      {children}
    </>
  );

  const shell =
    'block border-2 border-[var(--color-menu-rule)] bg-[var(--color-menu-panel)] px-6 py-7 text-left';

  if (!href) {
    return (
      <div className={shell} style={{ boxShadow: SHADOW }}>
        {body}
      </div>
    );
  }

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`${shell} hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[6px_6px_0px_var(--hero-shadow),0_0_0_2px_var(--color-accent-glow)] focus-visible:-translate-y-1 focus-visible:border-[var(--color-accent)] focus-visible:outline-none`}
      style={{
        boxShadow: SHADOW,
        // Tailwind v4 nudges via the standalone `translate` property, not
        // `transform` — transition both so the hover eases.
        transition: `translate 0.35s ${EASING}, transform 0.35s ${EASING}, border-color 0.25s ease, box-shadow 0.25s ease`,
      }}
    >
      {body}
    </a>
  );
}
