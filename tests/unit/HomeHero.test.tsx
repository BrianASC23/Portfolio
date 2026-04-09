import { HomeHero } from '@/components/hero/HomeHero';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

function mockReducedMotion(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced && query.includes('reduce'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('HomeHero', () => {
  it('renders BrainHero and a screen-reader-only h1 with the name', () => {
    mockReducedMotion(false);
    sessionStorage.clear();
    render(<HomeHero />);
    expect(screen.getByRole('img', { name: /brian cao/i })).toBeInTheDocument();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent(/brian\s*cao/i);
    expect(h1.className).toContain('sr-only');
  });

  it('renders the tagline and primary CTAs', () => {
    mockReducedMotion(false);
    sessionStorage.clear();
    render(<HomeHero />);
    expect(screen.getByText(/full-stack engineer/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view work/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get in touch/i })).toBeInTheDocument();
  });

  it('sets data-brain-phase on the section so CSS can time supporting content', () => {
    mockReducedMotion(true); // force held immediately, synchronous assertion
    sessionStorage.clear();
    const { container } = render(<HomeHero />);
    const section = container.querySelector('section#hero');
    expect(section?.getAttribute('data-brain-phase')).toBe('held');
  });
});
