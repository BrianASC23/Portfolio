import { TopBar } from '@/components/nav/TopBar';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('TopBar', () => {
  it('renders the Brian Cao wordmark linking to home', () => {
    render(<TopBar />);
    const wordmark = screen.getByRole('link', { name: /brian cao/i });
    expect(wordmark).toHaveAttribute('href', '/');
  });

  it('renders desktop nav links', () => {
    render(<TopBar />);
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^projects$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^writing$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^resume$/i })).toBeInTheDocument();
  });

  it('renders the Contact pill CTA as a mailto link', () => {
    render(<TopBar />);
    const cta = screen.getByRole('link', { name: /contact/i });
    expect(cta).toHaveAttribute('href', 'mailto:brianc40722@gmail.com');
  });
});
