import { BrainHero } from '@/components/hero/BrainHero';
import { CHAMBERS } from '@/components/hero/brain-geometry';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('BrainHero — held state', () => {
  it('renders an svg with role=img labeled by brian cao', () => {
    render(<BrainHero phase="held" />);
    const img = screen.getByRole('img', { name: /brian cao/i });
    expect(img.tagName.toLowerCase()).toBe('svg');
  });

  it('exposes a title and description for screen readers', () => {
    const { container } = render(<BrainHero phase="held" />);
    expect(container.querySelector('svg > title')?.textContent).toBe('Brian Cao');
    expect(container.querySelector('svg > desc')?.textContent).toMatch(
      /four chambers labeled ai\s*\/\s*ml, systems, web, and tools/i,
    );
  });

  it('renders a fluid rect for every chamber, all full in held state', () => {
    const { container } = render(<BrainHero phase="held" />);
    const rects = container.querySelectorAll('[data-fluid-chamber]');
    expect(rects).toHaveLength(CHAMBERS.length);
    rects.forEach((rect, i) => {
      const chamber = CHAMBERS[i]!;
      expect(Number(rect.getAttribute('y'))).toBe(chamber.y0);
      expect(Number(rect.getAttribute('height'))).toBe(chamber.y1 - chamber.y0);
    });
  });

  it('renders the etched name text', () => {
    const { container } = render(<BrainHero phase="held" />);
    const text = container.querySelector('text[data-brain-name]');
    expect(text).not.toBeNull();
    expect(text?.textContent).toMatch(/brian\s*cao/i);
  });

  it('chamber labels are aria-hidden decorative text', () => {
    const { container } = render(<BrainHero phase="held" />);
    const labels = container.querySelectorAll('[data-chamber-label]');
    expect(labels.length).toBe(CHAMBERS.length);
    labels.forEach((el) => expect(el.getAttribute('aria-hidden')).toBe('true'));
  });
});

describe('BrainHero — playing state', () => {
  it('sets data-motion="playing" on the svg', () => {
    const { container } = render(<BrainHero phase="playing" />);
    expect(container.querySelector('svg')?.getAttribute('data-motion')).toBe('playing');
  });

  it('sets data-motion="static" on initial and held phases', () => {
    const { container: c1 } = render(<BrainHero phase="initial" />);
    expect(c1.querySelector('svg')?.getAttribute('data-motion')).toBe('static');
    const { container: c2 } = render(<BrainHero phase="held" />);
    expect(c2.querySelector('svg')?.getAttribute('data-motion')).toBe('static');
  });

  it('still renders all fluid chambers in the playing state (framer motion applies animations, not removals)', () => {
    const { container } = render(<BrainHero phase="playing" />);
    expect(container.querySelectorAll('[data-fluid-chamber]')).toHaveLength(4);
  });
});
