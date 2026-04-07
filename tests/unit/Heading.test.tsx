import { Heading } from '@/components/primitives/Heading';
import { Text } from '@/components/primitives/Text';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Heading', () => {
  it('renders as h1 by default', () => {
    render(<Heading>Title</Heading>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('accepts level override', () => {
    render(<Heading level={3}>Sub</Heading>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });
});

describe('Text', () => {
  it('renders muted variant', () => {
    render(<Text tone="muted">hi</Text>);
    expect(screen.getByText('hi').className).toContain('text-[var(--color-fg-muted)]');
  });
});
