import { useHeroPhase } from '@/components/hero/useHeroPhase';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

describe('useHeroPhase', () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockReducedMotion(false);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('resolves to held when reduced motion is preferred', async () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useHeroPhase());
    await waitFor(() => expect(result.current).toBe('held'));
    expect(sessionStorage.getItem('bc:brain-hero-played')).toBeNull();
  });

  it('resolves to held when the session flag is already set', async () => {
    sessionStorage.setItem('bc:brain-hero-played', '1');
    const { result } = renderHook(() => useHeroPhase());
    await waitFor(() => expect(result.current).toBe('held'));
  });

  it('resolves to playing on a fresh mount and writes the session flag', async () => {
    const { result } = renderHook(() => useHeroPhase());
    await waitFor(() => expect(result.current).toBe('playing'));
    expect(sessionStorage.getItem('bc:brain-hero-played')).toBe('1');
  });

  it('transitions to playing on a fresh mount with motion enabled', async () => {
    const { result } = renderHook(() => useHeroPhase());
    await waitFor(() => expect(result.current).toBe('playing'));
  });
});
