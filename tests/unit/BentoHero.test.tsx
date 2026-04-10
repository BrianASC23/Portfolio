import { BentoHero } from '@/components/hero/BentoHero';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('BentoHero', () => {
  it('renders the name as display text', () => {
    render(<BentoHero />);
    expect(screen.getByRole('heading', { name: 'Brian Cao' })).toBeInTheDocument();
  });

  it('renders the software engineer eyebrow', () => {
    render(<BentoHero />);
    expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
  });

  it('renders the intro glass card with availability indicator', () => {
    const { container } = render(<BentoHero />);
    expect(container.querySelector('[data-card="intro"]')).not.toBeNull();
    expect(screen.getByText(/available for work/i)).toBeInTheDocument();
  });

  it('renders the featured project glass card', () => {
    const { container } = render(<BentoHero />);
    expect(container.querySelector('[data-card="project"]')).not.toBeNull();
    expect(screen.getByText(/featured project/i)).toBeInTheDocument();
  });

  it('renders the tech stack glass card with pills', () => {
    const { container } = render(<BentoHero />);
    expect(container.querySelector('[data-card="stack"]')).not.toBeNull();
    expect(screen.getByText(/tech stack/i)).toBeInTheDocument();
  });

  it('renders CTA links', () => {
    render(<BentoHero />);
    expect(screen.getByRole('link', { name: /view projects/i })).toHaveAttribute(
      'href',
      '/projects',
    );
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute(
      'href',
      'mailto:brianc40722@gmail.com',
    );
  });

  it('has a scroll container with sticky inner for the 3D animation', () => {
    const { container } = render(<BentoHero />);
    const scrollContainer = container.querySelector('[data-hero-scroll]');
    expect(scrollContainer).not.toBeNull();
    const stickyInner = container.querySelector('[data-hero-sticky]');
    expect(stickyInner).not.toBeNull();
  });
});
