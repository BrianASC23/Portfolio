/** Shared glass-morphism card class string used across hero, contact, and bento cards. */
export const GLASS =
  'rounded-2xl border-[0.5px] border-black/[0.08] bg-white/70 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:scale-[1.02] hover:border-[var(--color-accent-glow)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_rgba(0,0,0,0.06)]';

/** GLASS without the hover transforms — for static containers. */
export const GLASS_STATIC =
  'rounded-2xl border-[0.5px] border-black/[0.08] bg-white/70 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] backdrop-blur-2xl';
