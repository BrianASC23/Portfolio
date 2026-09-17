import { SummitHero } from '@/components/hero/SummitHero';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const bio = {
  frontmatter: { name: 'Brian Cao', role: 'Full-stack engineer', location: 'New York' },
  body: 'First paragraph of the bio.\n\nSecond paragraph, not shown on the card.',
};

describe('SummitHero', () => {
  it('renders the name as a heading', () => {
    render(<SummitHero bio={bio} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Brian Cao' })).toBeInTheDocument();
  });

  it('renders the bio card with role, lead paragraph and links', () => {
    render(<SummitHero bio={bio} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Brian Cao' })).toBeInTheDocument();
    expect(screen.getByText('Full-stack engineer')).toBeInTheDocument();
    expect(screen.getByText('First paragraph of the bio.')).toBeInTheDocument();
    expect(screen.queryByText(/Second paragraph/)).not.toBeInTheDocument();
    for (const label of ['Email', 'GitHub', 'LinkedIn']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    }
  });

  it('links from the bio card to the writing page', () => {
    render(<SummitHero bio={bio} />);
    expect(screen.getByRole('link', { name: /check out my writing/i })).toHaveAttribute(
      'href',
      '/writing',
    );
  });

  it('shows the headline in place of the role line when one is set', () => {
    const headline = "Software Engineer | Systems & AI Infrastructure | Stony Brook '27";
    render(<SummitHero bio={{ ...bio, frontmatter: { ...bio.frontmatter, headline } }} />);
    expect(screen.getByText(headline)).toBeInTheDocument();
    expect(screen.queryByText('Full-stack engineer')).not.toBeInTheDocument();
  });

  it('gives every moving piece a flat destination for the timeline to read', () => {
    const { container } = render(<SummitHero bio={bio} />);
    // Four checkpoint flags, the finish banner and the climber.
    expect(container.querySelectorAll('[data-flat-u]')).toHaveLength(6);
  });

  it('keeps the bio card outside the zooming stage', () => {
    const { container } = render(<SummitHero bio={bio} />);
    const stage = container.querySelector('[data-hero-stage]');
    const card = screen.getByRole('heading', { level: 2, name: 'Brian Cao' });
    expect(stage).not.toBeNull();
    expect(stage?.contains(card)).toBe(false);
  });
});
