import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

const SITE_DIR = join(process.cwd(), 'content', 'site');

const bioFrontmatter = z.object({
  name: z.string(),
  role: z.string(),
  location: z.string().optional(),
  school: z.string().optional(),
});

export type BioFrontmatter = z.infer<typeof bioFrontmatter>;

export function getBio(): { frontmatter: BioFrontmatter; body: string } {
  const raw = readFileSync(join(SITE_DIR, 'bio.mdx'), 'utf8');
  const parsed = matter(raw);
  return { frontmatter: bioFrontmatter.parse(parsed.data), body: parsed.content };
}

const toolbeltSchema = z.object({
  languages: z.array(z.string()),
  frontend: z.array(z.string()),
  backend: z.array(z.string()),
  aiml: z.array(z.string()),
  tools: z.array(z.string()),
});

export type Toolbelt = z.infer<typeof toolbeltSchema>;

export function getToolbelt(): Toolbelt {
  const raw = readFileSync(join(SITE_DIR, 'toolbelt.json'), 'utf8');
  return toolbeltSchema.parse(JSON.parse(raw));
}
