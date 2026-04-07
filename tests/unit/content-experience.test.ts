import { getAllExperiences } from '@/lib/content/experience';
import { getBio, getToolbelt } from '@/lib/content/site';
import { describe, expect, it } from 'vitest';

describe('experience loader', () => {
  it('loads experiences sorted newest first', () => {
    const items = getAllExperiences();
    expect(items.length).toBeGreaterThanOrEqual(4);
    const firstStart = items[0]?.start ?? '0000-00';
    const lastStart = items[items.length - 1]?.start ?? '0000-00';
    expect(firstStart.localeCompare(lastStart)).toBeGreaterThanOrEqual(0);
  });
});

describe('site loader', () => {
  it('loads bio frontmatter and body', () => {
    const bio = getBio();
    expect(bio.frontmatter.name).toBe('Brian Cao');
    expect(bio.body.length).toBeGreaterThan(10);
  });

  it('loads toolbelt as typed object', () => {
    const tb = getToolbelt();
    expect(tb.languages).toContain('TypeScript');
  });
});
