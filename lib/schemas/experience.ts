import { z } from 'zod';

export const experienceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional(),
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z.union([z.string().regex(/^\d{4}-\d{2}$/), z.literal('present')]),
  description: z.string().optional(),
  bullets: z.array(z.string().min(1)).min(1),
  stack: z.array(z.string()).default([]),
  logo: z.string().optional(),
  link: z.string().url().optional(),
});

export type Experience = z.infer<typeof experienceSchema>;
