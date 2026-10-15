import type { Project } from '@/lib/schemas/project';
import type { projectTag } from '@/lib/schemas/project';
import { cn } from '@/lib/utils/cn';
import type { z } from 'zod';

type ProjectTag = z.infer<typeof projectTag>;

/**
 * A gradient field per domain, screened into a halftone by the `.dither` class.
 *
 * Keying off the project's primary tag rather than a per-project colour in
 * frontmatter means the grid stays coherent as projects are added: everything
 * in a domain shares a family, and nobody has to pick a hex by hand. Each field
 * resolves dark at its bottom-left so the white title holds its contrast where
 * the label actually sits.
 */
const DITHER_FIELDS: Record<ProjectTag, string> = {
  'ai-ml':
    'radial-gradient(130% 110% at 18% 12%, #2dd4bf 0%, #0e7490 38%, #0b3b45 68%, #071f26 100%)',
  data: 'radial-gradient(130% 110% at 24% 10%, #7dd3fc 0%, #0284c7 36%, #0c3f66 68%, #06202f 100%)',
  systems:
    'radial-gradient(135% 115% at 60% 8%, #f59e0b 0%, #78350f 32%, #231a12 66%, #0c0a09 100%)',
  devtools:
    'radial-gradient(135% 115% at 72% 10%, #fbbf24 0%, #b45309 34%, #3f2410 68%, #120c06 100%)',
  'full-stack':
    'radial-gradient(140% 120% at 30% 14%, #a78bfa 0%, #6366f1 32%, #312e81 66%, #14123a 100%)',
  frontend:
    'radial-gradient(130% 110% at 78% 14%, #fbbf24 0%, #d97706 34%, #9a3412 66%, #4a160f 100%)',
  backend:
    'radial-gradient(130% 110% at 20% 16%, #94a3b8 0%, #475569 36%, #1e293b 68%, #0b1120 100%)',
};

interface DitherThumbProps {
  project: Project;
  className?: string;
}

export function DitherThumb({ project, className }: DitherThumbProps) {
  const field = DITHER_FIELDS[project.tags[0] ?? 'full-stack'];

  return (
    <div
      className={cn(
        'dither relative flex aspect-[4/3] items-end overflow-hidden rounded-[4px] p-5 md:p-6',
        className,
      )}
      style={{ backgroundImage: field }}
    >
      <span className="relative z-10 text-lg font-medium tracking-[-0.01em] text-white [text-shadow:0_1px_10px_rgb(0_0_0/0.5)] md:text-xl">
        {project.title}
      </span>
    </div>
  );
}
