/**
 * Pure data module describing the brain vessel geometry.
 * No React, no imports — safe to import anywhere, including tests.
 */

export const VIEWBOX = { w: 400, h: 340 } as const;

/**
 * Stylized anatomical brain silhouette, side-view leaning.
 * Hand-authored cubic beziers. Intentionally simple — the fluid and
 * etched name do the heavy lifting, not the outline detail.
 * Refine visually during Task 5 if needed.
 */
export const BRAIN_OUTLINE_PATH =
  'M 60,170 C 60,90 120,40 210,40 C 290,40 350,90 340,170 C 340,210 315,245 270,260 C 225,275 195,265 185,250 C 180,240 190,230 200,237 C 210,245 220,242 220,232 C 220,215 200,210 180,215 C 140,225 100,245 75,225 C 55,210 50,190 60,170 Z';

export type Chamber = {
  readonly id: string;
  readonly label: string;
  /** top of the chamber in viewBox units (smaller y = higher) */
  readonly y0: number;
  /** bottom of the chamber in viewBox units */
  readonly y1: number;
};

export const CHAMBERS: readonly Chamber[] = [
  { id: 'ai-ml', label: 'AI / ML', y0: 40, y1: 115 },
  { id: 'systems', label: 'Systems', y0: 115, y1: 180 },
  { id: 'web', label: 'Web', y0: 180, y1: 245 },
  { id: 'tools', label: 'Tools', y0: 245, y1: 310 },
] as const;

export const NAME_ANCHOR = {
  x: 200,
  y: 178,
  maxWidth: 200,
} as const;
