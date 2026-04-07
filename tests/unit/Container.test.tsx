import { Container } from '@/components/primitives/Container';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Container', () => {
  it('renders children with default size', () => {
    render(<Container>hello</Container>);
    const el = screen.getByText('hello');
    expect(el.className).toContain('max-w-6xl');
  });

  it('supports narrow size', () => {
    render(<Container size="narrow">narrow</Container>);
    expect(screen.getByText('narrow').className).toContain('max-w-3xl');
  });
});
