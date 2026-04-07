import { publicEnv } from '@/lib/env';
import { describe, expect, it } from 'vitest';

describe('publicEnv', () => {
  it('provides defaults', () => {
    expect(publicEnv.NEXT_PUBLIC_SITE_URL).toMatch(/^https?:\/\//);
    expect(publicEnv.NEXT_PUBLIC_MEDIUM_FEED).toContain('medium.com');
  });
});
