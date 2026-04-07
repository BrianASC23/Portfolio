import { duration, ease, stagger } from '@/lib/motion';
import { describe, expect, it } from 'vitest';

describe('motion constants', () => {
  it('exports a four-stop ease curve', () => {
    expect(ease.out).toHaveLength(4);
  });

  it('exports duration keys', () => {
    expect(duration.base).toBeGreaterThan(0);
    expect(duration.slow).toBeGreaterThan(duration.base);
  });

  it('exports stagger keys', () => {
    expect(stagger.base).toBeGreaterThan(0);
  });
});
