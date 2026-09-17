import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Framer Motion's whileInView needs IntersectionObserver in jsdom
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as unknown as typeof globalThis.IntersectionObserver;
}

// GSAP's ScrollTrigger and matchMedia both read window.matchMedia at register
// time, and this jsdom build does not implement it. Always-false is the right
// stub: no query matches, so no timeline is built during unit tests.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  cleanup();
});
