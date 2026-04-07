import { cn } from '@/lib/utils/cn';
import { describe, expect, it } from 'vitest';

describe('cn', () => {
  it('merges tailwind classes', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles falsy values', () => {
    expect(cn('a', false && 'b', null, 'c')).toBe('a c');
  });
});
