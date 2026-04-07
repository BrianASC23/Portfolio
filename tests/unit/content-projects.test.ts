import { getAllProjects, getFeaturedProjects, getProjectBySlug } from '@/lib/content/projects';
import { describe, expect, it } from 'vitest';

describe('project content loader', () => {
  it('loads all seed projects', () => {
    const projects = getAllProjects();
    expect(projects.length).toBeGreaterThanOrEqual(5);
  });

  it('returns featured projects sorted by order', () => {
    const featured = getFeaturedProjects();
    expect(featured.every((p) => p.featured)).toBe(true);
    expect(featured[0]?.order ?? 0).toBeLessThanOrEqual(featured[1]?.order ?? 999);
  });

  it('looks up by slug', () => {
    const project = getProjectBySlug('advising-bot');
    expect(project?.title).toBe('Advising Bot');
  });

  it('returns undefined for missing slug', () => {
    expect(getProjectBySlug('does-not-exist')).toBeUndefined();
  });
});
