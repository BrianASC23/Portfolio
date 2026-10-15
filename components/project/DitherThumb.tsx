import type { Project } from '@/lib/schemas/project';
import { cn } from '@/lib/utils/cn';

/**
 * A cool ramp — teal through the accent's own violet to plum — screened into a
 * halftone by the `.dither` class. Every field resolves near-black toward its
 * bottom-left so the white title holds contrast where the label actually sits.
 *
 * These were keyed off the project's primary tag, which read well in the
 * abstract and badly in practice: three of the four featured projects lead
 * with `ai-ml`, so the grid rendered three identical tiles. The field is now
 * chosen by a hash of the slug instead. It is decoration, not encoding — no
 * reader is meant to decode "teal means AI" — so stability and variety matter
 * more than semantics. Hashing the slug gives both: a project keeps its colour
 * for as long as its slug lives, and neighbours differ.
 */
const DITHER_FIELDS = [
  // violet — the accent's own family
  'radial-gradient(135% 115% at 28% 10%, #c4b5fd 0%, #7c3aed 32%, #3b1d7a 66%, #120a24 100%)',
  // teal
  'radial-gradient(130% 110% at 18% 12%, #2dd4bf 0%, #0e7490 38%, #0b3b45 68%, #071f26 100%)',
  // plum
  'radial-gradient(130% 110% at 72% 12%, #f0abfc 0%, #a21caf 34%, #4a1252 68%, #150618 100%)',
  // azure
  'radial-gradient(130% 110% at 24% 10%, #7dd3fc 0%, #0284c7 36%, #0c3f66 68%, #06202f 100%)',
  // steel
  'radial-gradient(130% 110% at 20% 16%, #cbd5e1 0%, #64748b 36%, #27303f 68%, #0b1120 100%)',
  // indigo
  'radial-gradient(140% 120% at 34% 14%, #a5b4fc 0%, #4f46e5 32%, #27246b 66%, #0d0c24 100%)',
  // periwinkle
  'radial-gradient(130% 110% at 66% 12%, #bfdbfe 0%, #3b82f6 34%, #1e3a8a 68%, #0a1430 100%)',
] as const;

/** FNV-1a: small, stable across runs, and well spread over short strings. */
function fieldFor(slug: string): string {
  let hash = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    hash ^= slug.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  // The modulo keeps this in range, but the computed index is still typed as
  // possibly-undefined under noUncheckedIndexedAccess; the literal index is not.
  return DITHER_FIELDS[(hash >>> 0) % DITHER_FIELDS.length] ?? DITHER_FIELDS[0];
}

interface DitherThumbProps {
  project: Project;
  className?: string;
}

export function DitherThumb({ project, className }: DitherThumbProps) {
  return (
    <div
      className={cn(
        'dither relative flex aspect-[4/3] items-end overflow-hidden rounded-[4px] p-5 md:p-6',
        className,
      )}
      style={{ backgroundImage: fieldFor(project.slug) }}
    >
      <span className="relative z-10 text-lg font-medium tracking-[-0.01em] text-white [text-shadow:0_1px_10px_rgb(0_0_0/0.5)] md:text-xl">
        {project.title}
      </span>
    </div>
  );
}
