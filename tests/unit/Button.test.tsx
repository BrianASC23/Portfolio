import { Button } from '@/components/primitives/Button';
import { Pill } from '@/components/primitives/Pill';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Button', () => {
  it('renders as button by default', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
  });

  it('renders as anchor when href provided', () => {
    render(<Button href="/about">About</Button>);
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });
});

describe('Pill', () => {
  it('renders label', () => {
    render(<Pill>Next.js</Pill>);
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });
});
