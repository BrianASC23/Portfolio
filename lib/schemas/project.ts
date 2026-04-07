import { z } from 'zod';

export const projectTag = z.enum([
  'full-stack',
  'frontend',
  'backend',
  'ai-ml',
  'systems',
  'devtools',
  'data',
]);

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  tagline: z.string().min(1).max(140),
  summary: z.string().min(1).max(320),
  role: z.string().min(1),
  timeframe: z.string().min(1),
  status: z.enum(['shipped', 'in-progress', 'archived']),
  featured: z.boolean().default(false),
  order: z.number().int().default(999),
  stack: z.array(z.string()),
  tags: z.array(projectTag),
  links: z
    .object({
      github: z.string().url().optional(),
      live: z.string().url().optional(),
      demo: z.string().url().optional(),
      paper: z.string().url().optional(),
    })
    .default({}),
  cover: z.object({
    src: z.string().min(1),
    alt: z.string().min(1),
    video: z.string().optional(),
  }),
  gallery: z
    .array(
      z.object({
        src: z.string().min(1),
        alt: z.string().min(1),
        caption: z.string().optional(),
      }),
    )
    .default([]),
  metrics: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).default([]),
  accentColor: z.string().optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .default({}),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectFrontmatter = z.input<typeof projectSchema>;
