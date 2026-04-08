import {
  BRAIN_OUTLINE_PATH,
  CHAMBERS,
  NAME_ANCHOR,
  VIEWBOX,
} from '@/components/hero/brain-geometry';
import { describe, expect, it } from 'vitest';

describe('brain-geometry', () => {
  it('viewBox has positive dimensions', () => {
    expect(VIEWBOX.w).toBeGreaterThan(0);
    expect(VIEWBOX.h).toBeGreaterThan(0);
  });

  it('has exactly 4 chambers', () => {
    expect(CHAMBERS).toHaveLength(4);
  });

  it('chambers have monotonically increasing y ranges covering the vessel', () => {
    for (let i = 0; i < CHAMBERS.length; i++) {
      expect(CHAMBERS[i].y0).toBeLessThan(CHAMBERS[i].y1);
      if (i > 0) {
        expect(CHAMBERS[i].y0).toBeGreaterThanOrEqual(CHAMBERS[i - 1].y1);
      }
    }
  });

  it('chambers each have a kebab-case id and non-empty label', () => {
    for (const c of CHAMBERS) {
      expect(c.id).toMatch(/^[a-z][a-z0-9-]*$/);
      expect(c.label.length).toBeGreaterThan(0);
    }
  });

  it('chamber labels match the approved taxonomy', () => {
    expect(CHAMBERS.map((c) => c.label)).toEqual(['AI / ML', 'Systems', 'Web', 'Tools']);
  });

  it('name anchor is inside the viewBox', () => {
    expect(NAME_ANCHOR.x).toBeGreaterThan(0);
    expect(NAME_ANCHOR.x).toBeLessThan(VIEWBOX.w);
    expect(NAME_ANCHOR.y).toBeGreaterThan(0);
    expect(NAME_ANCHOR.y).toBeLessThan(VIEWBOX.h);
    expect(NAME_ANCHOR.maxWidth).toBeGreaterThan(0);
  });

  it('brain outline path is a closed SVG path starting with move-to', () => {
    expect(BRAIN_OUTLINE_PATH.trim()).toMatch(/^M/);
    expect(BRAIN_OUTLINE_PATH.trim()).toMatch(/Z\s*$/);
  });
});
