/**
 * Shared delay constants for the brain hero animation.
 * All values in seconds. Mirrors the beat sheet in the design spec.
 */

export const BRAIN_STROKE_START = 0;
export const BRAIN_STROKE_DURATION = 0.4;

export const EYEBROW_START = 0.6;
export const EYEBROW_DURATION = 0.3;

/** Start time for each chamber fill, in order (top → bottom). */
export const CHAMBER_STARTS = [0.9, 1.8, 2.7, 3.6] as const;
export const CHAMBER_FILL_DURATION = 0.9;

/** Honey ease curve — slow start, accelerating finish. */
export const HONEY_EASE = [0.32, 0, 0.67, 0.12] as const;

/** Name brightness steps: opacity value per chamber boundary. */
export const NAME_OPACITY_STEPS = [0.35, 0.55, 0.75, 0.9, 1] as const;

export const PULSE_START = 4.8;
export const PULSE_DURATION = 0.3;

export const SUPPORTING_CONTENT_START = 5.1;
export const SUPPORTING_CONTENT_DURATION = 0.5;
export const SUPPORTING_CONTENT_STAGGER = 0.08;

/** Total animation length from page load to held state. */
export const TOTAL_DURATION = SUPPORTING_CONTENT_START + SUPPORTING_CONTENT_DURATION;
