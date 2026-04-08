import * as T from '@/components/hero/timeline';
import { describe, expect, it } from 'vitest';

describe('brain-hero timeline', () => {
  it('exposes numeric delays for every animation beat', () => {
    expect(typeof T.BRAIN_STROKE_START).toBe('number');
    expect(typeof T.EYEBROW_START).toBe('number');
    expect(typeof T.CHAMBER_STARTS).toBe('object');
    expect(T.CHAMBER_STARTS).toHaveLength(4);
    expect(typeof T.PULSE_START).toBe('number');
    expect(typeof T.SUPPORTING_CONTENT_START).toBe('number');
    expect(typeof T.CHAMBER_FILL_DURATION).toBe('number');
  });

  it('delays are strictly ascending', () => {
    const series = [
      T.BRAIN_STROKE_START,
      T.EYEBROW_START,
      ...T.CHAMBER_STARTS,
      T.PULSE_START,
      T.SUPPORTING_CONTENT_START,
    ];
    for (let i = 1; i < series.length; i++) {
      expect(series[i]).toBeGreaterThan(series[i - 1]);
    }
  });

  it('chamber fill duration is between 0.5 and 2 seconds', () => {
    expect(T.CHAMBER_FILL_DURATION).toBeGreaterThanOrEqual(0.5);
    expect(T.CHAMBER_FILL_DURATION).toBeLessThanOrEqual(2);
  });
});
