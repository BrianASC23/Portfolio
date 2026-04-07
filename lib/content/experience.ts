import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { type Experience, experienceSchema } from '@/lib/schemas/experience';
import matter from 'gray-matter';

const DIR = join(process.cwd(), 'content', 'experience');

let cache: Experience[] | null = null;

function loadAll(): Experience[] {
  const files = readdirSync(DIR).filter((f) => f.endsWith('.mdx'));
  return files.map((file) => {
    const raw = readFileSync(join(DIR, file), 'utf8');
    const { data } = matter(raw);
    return experienceSchema.parse(data);
  });
}

export function getAllExperiences(): Experience[] {
  if (!cache) cache = loadAll();
  return [...cache].sort((a, b) => b.start.localeCompare(a.start));
}
