export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  back: [0.34, 1.56, 0.64, 1] as const,
} as const;

export const duration = {
  fast: 0.2,
  base: 0.4,
  slow: 0.8,
  reveal: 1.2,
} as const;

export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
} as const;

export type MotionEase = (typeof ease)[keyof typeof ease];
