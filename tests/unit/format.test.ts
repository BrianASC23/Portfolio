import { formatDate, truncate } from '@/lib/utils/format';
import { describe, expect, it } from 'vitest';

describe('formatDate', () => {
  it('formats ISO dates as "Mon YYYY"', () => {
    expect(formatDate('2026-04-06')).toBe('Apr 2026');
  });
});

describe('truncate', () => {
  it('truncates with ellipsis', () => {
    expect(truncate('hello world this is long', 11)).toBe('hello world…');
  });

  it('leaves short strings alone', () => {
    expect(truncate('hi', 10)).toBe('hi');
  });
});
