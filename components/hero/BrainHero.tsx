'use client';

import { BRAIN_OUTLINE_PATH, CHAMBERS, NAME_ANCHOR, VIEWBOX } from './brain-geometry';
import type { HeroPhase } from './useHeroPhase';

interface BrainHeroProps {
  phase: HeroPhase;
  className?: string;
}

/**
 * SVG brain vessel. Controlled entirely by the `phase` prop:
 *  - `initial` and `held` render the fluid at full height (SSR-safe).
 *  - `playing` additionally sets data-motion="playing" so CSS can run
 *    the wobble and Framer Motion variants (added in Task 4) can
 *    animate the fill.
 */
export function BrainHero({ phase, className }: BrainHeroProps) {
  const isPlaying = phase === 'playing';

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      className={className}
      role="img"
      aria-labelledby="brain-hero-title brain-hero-desc"
      data-brain-hero
      data-motion={isPlaying ? 'playing' : 'static'}
    >
      <title id="brain-hero-title">Brian Cao</title>
      <desc id="brain-hero-desc">
        Illustration of a brain-shaped vessel containing four chambers labeled AI / ML, Systems,
        Web, and Tools.
      </desc>

      <defs>
        <clipPath id="brain-clip">
          <path d={BRAIN_OUTLINE_PATH} />
        </clipPath>
        <linearGradient id="fluid-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-hi)" />
          <stop offset="100%" stopColor="var(--color-accent-lo)" />
        </linearGradient>
      </defs>

      {/* Brain outline stroke */}
      <path
        d={BRAIN_OUTLINE_PATH}
        fill="none"
        stroke="oklch(0.7 0.01 60 / 0.5)"
        strokeWidth={1.5}
        data-brain-outline
      />

      {/* Fluid rects clipped to the brain silhouette, one per chamber */}
      <g clipPath="url(#brain-clip)" data-fluid-group>
        {CHAMBERS.map((c) => (
          <rect
            key={c.id}
            data-fluid-chamber={c.id}
            x={0}
            width={VIEWBOX.w}
            y={c.y0}
            height={c.y1 - c.y0}
            fill="url(#fluid-gradient)"
            opacity={0.85}
          />
        ))}
      </g>

      {/* Chamber divider hairlines, clipped to the brain */}
      <g clipPath="url(#brain-clip)">
        {CHAMBERS.slice(1).map((c) => (
          <line
            key={`div-${c.id}`}
            x1={0}
            x2={VIEWBOX.w}
            y1={c.y0}
            y2={c.y0}
            stroke="oklch(0.8 0.005 60)"
            strokeWidth={1}
          />
        ))}
      </g>

      {/* Chamber labels — decorative, aria-hidden */}
      {CHAMBERS.map((c) => (
        // biome-ignore lint/a11y/noAriaHiddenOnFocusable: SVG <text> is not focusable; this is purely decorative
        <text
          key={`label-${c.id}`}
          data-chamber-label={c.id}
          aria-hidden="true"
          x={VIEWBOX.w - 10}
          y={(c.y0 + c.y1) / 2}
          textAnchor="end"
          fontFamily="var(--font-mono), ui-monospace, monospace"
          fontSize={9}
          fill="var(--color-accent)"
          opacity={0}
        >
          {c.label}
        </text>
      ))}

      {/* Etched name */}
      <text
        data-brain-name
        x={NAME_ANCHOR.x}
        y={NAME_ANCHOR.y}
        textAnchor="middle"
        fontFamily="var(--font-serif), Georgia, serif"
        fontSize={36}
        fill="var(--color-accent)"
        style={{ filter: 'drop-shadow(0 0 12px var(--color-accent-glow))' }}
      >
        Brian <tspan fontStyle="italic">Cao</tspan>
      </text>
    </svg>
  );
}
