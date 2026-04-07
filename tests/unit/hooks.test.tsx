import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

function Probe() {
  const reduced = useReducedMotion();
  return <span>{reduced ? 'reduced' : 'motion'}</span>;
}

describe('useReducedMotion', () => {
  it('returns false when media query does not match', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    render(<Probe />);
    expect(screen.getByText('motion')).toBeInTheDocument();
  });
});
