import { z } from 'zod';

export const writingPostSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  publishedAt: z.string().min(1),
  link: z.string().url(),
  thumbnail: z.string().url().optional(),
  readingTime: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type WritingPost = z.infer<typeof writingPostSchema>;
