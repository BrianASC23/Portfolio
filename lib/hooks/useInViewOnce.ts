'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';

/** Matches framer-motion's old `margin` value, so reveals trigger where they used to. */
const DEFAULT_ROOT_MARGIN = '-15% 0px';

/**
 * True once the element has entered the viewport, and true from then on.
 *
 * A plain IntersectionObserver rather than framer-motion's `useInView`: one
 * boolean is all the entrance reveals ever wanted, and the animation runtime
 * is a poor trade for it on a page a recruiter opens on a phone.
 *
 * It resolves true when IntersectionObserver is missing, so a caller that
 * gates `opacity: 0` on this can never leave its content permanently hidden.
 */
export function useInViewOnce<T extends Element>(
  rootMargin: string = DEFAULT_ROOT_MARGIN,
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || inView) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView];
}
