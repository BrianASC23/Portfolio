'use client';

import { type Variants, motion } from 'framer-motion';
import { BRAIN_OUTLINE_PATH, CHAMBERS, NAME_ANCHOR, VIEWBOX } from './brain-geometry';
import {
  BRAIN_STROKE_DURATION,
  BRAIN_STROKE_START,
  CHAMBER_FILL_DURATION,
  CHAMBER_STARTS,
  HONEY_EASE,
  NAME_OPACITY_STEPS,
  PULSE_DURATION,
  PULSE_START,
} from './timeline';
import type { HeroPhase } from './useHeroPhase';

interface BrainHeroProps {
  phase: HeroPhase;
  className?: string;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const strokeVariants: Variants = {
  initial: { opacity: 0.5 }, // SSR-safe: matches held so no flash
  playing: {
    opacity: [0, 0.5],
    transition: {
      delay: BRAIN_STROKE_START,
      duration: BRAIN_STROKE_DURATION,
      ease: EASE_OUT as unknown as number[],
    },
  },
  held: { opacity: 0.5 },
};

function chamberVariants(index: number): Variants {
  const start = CHAMBER_STARTS[index]!;
  return {
    // SSR-safe: fully visible so there is no layout shift on initial/held
    initial: { scaleY: 1, originY: 1 },
    playing: {
      scaleY: [0, 1],
      originY: 1,
      transition: {
        delay: start,
        duration: CHAMBER_FILL_DURATION,
        ease: HONEY_EASE as unknown as [number, number, number, number],
        times: [0, 1],
      },
    },
    held: { scaleY: 1, originY: 1 },
  };
}

function chamberLabelVariants(index: number): Variants {
  const start = CHAMBER_STARTS[index]! + 0.2;
  return {
    initial: { opacity: 0 },
    playing: {
      opacity: [0, 1, 1, 0],
      transition: { delay: start, duration: 1.0, times: [0, 0.2, 0.6, 1] },
    },
    held: { opacity: 0 },
  };
}

const PULSE_TOTAL = PULSE_START + PULSE_DURATION;
const nameVariants: Variants = {
  initial: { opacity: 1, scale: 1 }, // SSR-safe: lit so no shift
  playing: {
    opacity: [
      NAME_OPACITY_STEPS[0]!,
      NAME_OPACITY_STEPS[0]!,
      NAME_OPACITY_STEPS[1]!,
      NAME_OPACITY_STEPS[2]!,
      NAME_OPACITY_STEPS[3]!,
      1,
      1,
    ],
    scale: [1, 1, 1, 1, 1, 1.02, 1],
    transition: {
      duration: PULSE_TOTAL,
      times: [
        0,
        CHAMBER_STARTS[0]! / PULSE_TOTAL,
        CHAMBER_STARTS[1]! / PULSE_TOTAL,
        CHAMBER_STARTS[2]! / PULSE_TOTAL,
        CHAMBER_STARTS[3]! / PULSE_TOTAL,
        PULSE_START / PULSE_TOTAL,
        1,
      ],
    },
  },
  held: { opacity: 1, scale: 1 },
};

/**
 * SVG brain vessel. Controlled by the `phase` prop:
 *  - `initial` and `held` render identically (fluid full, outline visible, name lit)
 *    so the server HTML and the reduced-motion fallback are indistinguishable from
 *    the final rest state. This prevents a hydration flash.
 *  - `playing` drives Framer Motion variants that animate the stroke fade-in,
 *    chamber fills, chamber-label glows, and a name pulse.
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
      <motion.path
        d={BRAIN_OUTLINE_PATH}
        fill="none"
        stroke="oklch(0.7 0.01 60 / 0.5)"
        strokeWidth={1.5}
        data-brain-outline
        variants={strokeVariants}
        initial="initial"
        animate={phase}
      />

      {/* Fluid rects clipped to the brain silhouette, one per chamber */}
      <g clipPath="url(#brain-clip)" data-fluid-group>
        {CHAMBERS.map((c, i) => (
          <motion.rect
            key={c.id}
            data-fluid-chamber={c.id}
            x={0}
            width={VIEWBOX.w}
            y={c.y0}
            height={c.y1 - c.y0}
            fill="url(#fluid-gradient)"
            opacity={0.85}
            variants={chamberVariants(i)}
            initial="initial"
            animate={phase}
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
      {CHAMBERS.map((c, i) => (
        <motion.text
          key={`label-${c.id}`}
          data-chamber-label={c.id}
          aria-hidden="true"
          x={VIEWBOX.w - 10}
          y={(c.y0 + c.y1) / 2}
          textAnchor="end"
          fontFamily="var(--font-mono), ui-monospace, monospace"
          fontSize={9}
          fill="var(--color-accent)"
          variants={chamberLabelVariants(i)}
          initial="initial"
          animate={phase}
        >
          {c.label}
        </motion.text>
      ))}

      {/* Etched name */}
      <motion.text
        data-brain-name
        x={NAME_ANCHOR.x}
        y={NAME_ANCHOR.y}
        textAnchor="middle"
        fontFamily="var(--font-serif), Georgia, serif"
        fontSize={36}
        fill="var(--color-accent)"
        style={{ filter: 'drop-shadow(0 0 12px var(--color-accent-glow))' }}
        variants={nameVariants}
        initial="initial"
        animate={phase}
      >
        Brian <tspan fontStyle="italic">Cao</tspan>
      </motion.text>
    </svg>
  );
}
