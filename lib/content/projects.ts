import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { type Project, projectSchema } from '@/lib/schemas/project';
import matter from 'gray-matter';

const CONTENT_DIR = join(process.cwd(), 'content', 'projects');

export interface LoadedProject {
  project: Project;
  body: string;
}

function loadAll(): LoadedProject[] {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));
  return files.map((file) => {
    const raw = readFileSync(join(CONTENT_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const project = projectSchema.parse(data);
    return { project, body: content };
  });
}

let cache: LoadedProject[] | null = null;
function loaded(): LoadedProject[] {
  if (!cache) cache = loadAll();
  return cache;
}

export function getAllProjects(): Project[] {
  return loaded()
    .map((l) => l.project)
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return loaded().find((l) => l.project.slug === slug)?.project;
}

export function getProjectMdxBySlug(slug: string): LoadedProject | undefined {
  return loaded().find((l) => l.project.slug === slug);
}

export function getProjectSlugs(): string[] {
  return getAllProjects().map((p) => p.slug);
}
