import { useInViewOnce } from '@/lib/hooks/useInViewOnce';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

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

type IntersectionCallback = (entries: { isIntersecting: boolean }[]) => void;

function InViewProbe() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  return <div ref={ref}>{inView ? 'visible' : 'hidden'}</div>;
}

describe('useInViewOnce', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports visible once the observer sees an intersection, then disconnects', async () => {
    let fire: IntersectionCallback | undefined;
    const disconnect = vi.fn();

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe = vi.fn();
        disconnect = disconnect;
        constructor(callback: IntersectionCallback) {
          fire = callback;
        }
      },
    );

    render(<InViewProbe />);
    expect(screen.getByText('hidden')).toBeInTheDocument();

    act(() => fire?.([{ isIntersecting: true }]));

    expect(await screen.findByText('visible')).toBeInTheDocument();
    expect(disconnect).toHaveBeenCalled();
  });

  it('reports visible immediately when IntersectionObserver is unavailable', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<InViewProbe />);
    expect(await screen.findByText('visible')).toBeInTheDocument();
  });
});
