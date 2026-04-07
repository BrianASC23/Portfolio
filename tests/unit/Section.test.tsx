import { Section } from '@/components/primitives/Section';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Section', () => {
  it('renders a section with id', () => {
    render(
      <Section id="about" eyebrow="01 · About">
        <p>body</p>
      </Section>,
    );
    expect(screen.getByRole('region', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText('01 · About')).toBeInTheDocument();
  });
});
