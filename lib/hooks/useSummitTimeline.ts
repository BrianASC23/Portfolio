'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RefObject } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

// Guarded rather than bare: this module is still evaluated during SSR for the
// client components that import it, and ScrollTrigger has no business being
// registered where there is no document.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** Scroll progress at which each phase hands over. */
const PHASE_1_END = 0.5;
const PHASE_2_END = 0.85;

/** How far the page scrolls while pinned, as a multiple of viewport height. */
const SCROLL_LENGTH = '+=320%';
/** Lag, in seconds, between the scrollbar and the playhead. */
const SCRUB = 1;

/**
 * Phase two's final magnification. Kept moderate on purpose: every extra factor
 * multiplies the area the compositor has to rasterise, and past a point the
 * browser either caps the raster (the scene goes soft) or starts dropping tiles.
 */
const MAX_ZOOM = 6;

/** The marker/ridge overlay's own grid. */
const VIEWBOX_W = 192;
const VIEWBOX_H = 108;

export interface SummitTimelineRefs {
  /** The section that gets pinned for the whole sequence. */
  containerRef: RefObject<HTMLElement | null>;
  /** Everything that zooms in phase two. Must not contain the bio card. */
  stageRef: RefObject<HTMLDivElement | null>;
  /** The baked pixel artwork, which cross-fades to the ridge in phase one. */
  artworkRef: RefObject<HTMLDivElement | null>;
  /** Wrapper around the ridge paths, faded as a unit. */
  ridgeRef: RefObject<SVGSVGElement | null>;
  /** The filled silhouette — this is the path that flattens. */
  mountainRef: RefObject<SVGPathElement | null>;
  /** The lit crest line, flattened in step with the silhouette. */
  crestRef: RefObject<SVGPathElement | null>;
  /** The dashed ascent route, which leaves with the artwork. */
  routeRef: RefObject<SVGPolylineElement | null>;
  /** The climber. */
  humanRef: RefObject<SVGGElement | null>;
  /** Checkpoint flags, in order from the base of the mountain. */
  flagRefs: RefObject<(SVGGElement | null)[]>;
  /** The chequered banner the flags line up toward. */
  finishRef: RefObject<SVGGElement | null>;
  /** Portrait, bio and links. Lives outside the stage so the zoom misses it. */
  bioRef: RefObject<HTMLDivElement | null>;
  /** Name and scroll cue, cleared early so the flatten is unobstructed. */
  copyRef: RefObject<HTMLDivElement | null>;
}

export interface SummitTimelineOptions extends SummitTimelineRefs {
  /** `d` for the flattened silhouette. Same command structure as its start. */
  flatBodyD: string;
  /** `d` for the flattened crest. */
  flatCrestD: string;
  /**
   * Where phase two zooms: `u` as a fraction of the visible canvas, and a
   * viewBox y that gets converted against the same window.
   */
  zoomAnchor: { u: number; viewBoxY: number };
  /** ScrollTrigger `start`. Offset this if fixed site chrome overlaps the pin. */
  pinStart?: string;
}

/**
 * How much of the overlay's grid actually reaches the screen.
 *
 * These SVGs are cover-fitted to match the artwork, so one axis is always
 * cropped and which one depends on the viewport's aspect. Everything that has
 * to land at a readable spot after the flatten is placed against this window
 * rather than against raw viewBox coordinates.
 */
function visibleWindow(svg: SVGSVGElement) {
  const { width, height } = svg.getBoundingClientRect();
  const scale = Math.max(width / VIEWBOX_W, height / VIEWBOX_H) || 1;
  const w = width / scale;
  const h = height / scale;
  return { x0: VIEWBOX_W / 2 - w / 2, y0: VIEWBOX_H / 2 - h / 2, w, h };
}

/**
 * A moving piece's phase-one destination, declared on the element itself.
 *
 * Read lazily, as a GSAP function-based value: paired with the trigger's
 * `invalidateOnRefresh`, that means a resize or an orientation change
 * recomputes the target instead of leaving pieces stranded off-screen.
 */
function flatX(el: Element | null, svg: SVGSVGElement | null): number {
  if (!(el instanceof SVGElement) || !svg) return 0;
  const { x0, w } = visibleWindow(svg);
  const u = Number(el.dataset.flatU ?? 0.5);
  return x0 + u * w - Number(el.dataset.originX ?? 0);
}

function flatY(el: Element | null): number {
  if (!(el instanceof SVGElement)) return 0;
  return Number(el.dataset.flatY ?? 0);
}

/**
 * Drives the three-phase summit sequence off a single pinned ScrollTrigger.
 *
 * The timeline's total duration is exactly 1, so a position given to `.to()` is
 * literally the scroll progress at which that tween starts — 0.5 is halfway
 * through the pin. That keeps the phase boundaries in the code readable against
 * the spec instead of buried in relative offsets.
 *
 *   phase 1  0 -> 0.5   artwork hands over to the ridge, which flattens to a
 *                       baseline while the climber walks to the far left and
 *                       the flags line up toward the finish banner
 *   phase 2  0.5 -> 0.85 the stage scales into the climber; the flattened world
 *                       fades out underneath
 *   phase 3  0.85 -> 1   the climber dissolves and the bio card takes the frame
 *
 * The mountain flatten needs no MorphSVG: both `d` strings are built from the
 * same sampler, so they carry identical commands in identical order and differ
 * only in their numbers, which is exactly the case GSAP's attribute tweening
 * already interpolates.
 */
export function useSummitTimeline({
  containerRef,
  stageRef,
  artworkRef,
  ridgeRef,
  mountainRef,
  crestRef,
  routeRef,
  humanRef,
  flagRefs,
  finishRef,
  bioRef,
  copyRef,
  flatBodyD,
  flatCrestD,
  zoomAnchor,
  pinStart = 'top top',
}: SummitTimelineOptions): void {
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    const bio = bioRef.current;
    if (!container || !stage || !bio) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        // No pin, no scrub: the sequence exists to be scrubbed, and there is no
        // honest reduced-motion version of it. Cut straight to its destination.
        //
        // The whole stage goes, not just the artwork — hiding the mountain but
        // leaving the flags and the climber behind would strand them in an empty
        // sky. The card carries the name, so the display copy goes with it.
        gsap.set([stage, copyRef.current], { autoAlpha: 0 });
        gsap.set(bio, { autoAlpha: 1, scale: 1, y: 0 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const flags = (flagRefs.current ?? []).filter(
          (el): el is SVGGElement => el instanceof SVGGElement,
        );
        const human = humanRef.current;
        const finish = finishRef.current;

        const ridge = ridgeRef.current;

        // Recomputed on every refresh for the same reason the flat targets are:
        // the anchor's y is a viewBox coordinate, and how that maps onto the
        // element depends on how much of the grid the viewport is showing.
        const applyZoomOrigin = () => {
          if (!ridge) return;
          const { y0, h } = visibleWindow(ridge);
          const originY = ((zoomAnchor.viewBoxY - y0) / h) * 100;
          gsap.set(stage, { transformOrigin: `${zoomAnchor.u * 100}% ${originY}%` });
        };

        applyZoomOrigin();
        gsap.set(bio, { autoAlpha: 0, scale: 0.88, y: 28 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: container,
            start: pinStart,
            end: SCROLL_LENGTH,
            pin: true,
            scrub: SCRUB,
            // The pin swaps in position:fixed; without this the browser can show
            // one unstyled frame at the handover on slower machines.
            anticipatePin: 1,
            // Re-reads every function-based value below, so the flat layout and
            // the zoom origin survive a resize or an orientation change.
            invalidateOnRefresh: true,
            onRefresh: applyZoomOrigin,
          },
        });

        // ── phase 1 · flatten and line up ────────────────────────────────────
        tl.to(ridge, { autoAlpha: 1, duration: 0.08 }, 0)
          .to(artworkRef.current, { autoAlpha: 0, duration: 0.12 }, 0.03)
          .to(routeRef.current, { autoAlpha: 0, duration: 0.1 }, 0.02)
          .to(copyRef.current, { autoAlpha: 0, y: -16, duration: 0.1 }, 0)
          .to(mountainRef.current, { attr: { d: flatBodyD }, duration: 0.34 }, 0.14)
          .to(crestRef.current, { attr: { d: flatCrestD }, duration: 0.34 }, 0.14)
          .to(
            human,
            {
              x: () => flatX(human, ridge),
              y: () => flatY(human),
              // The one eased tween in phase one: the figure is the thing the
              // eye tracks, and a linear walk against everything else moving
              // reads as a slide rather than a descent.
              ease: 'power1.inOut',
              duration: 0.42,
            },
            0.08,
          );

        for (const flag of flags) {
          tl.to(flag, { x: () => flatX(flag, ridge), y: () => flatY(flag), duration: 0.34 }, 0.14);
        }
        tl.to(
          finish,
          { x: () => flatX(finish, ridge), y: () => flatY(finish), duration: 0.34 },
          0.14,
        );

        // ── phase 2 · zoom the figure ────────────────────────────────────────
        tl.to(stage, { scale: MAX_ZOOM, duration: PHASE_2_END - PHASE_1_END }, PHASE_1_END).to(
          [ridge, finish, ...flags],
          { autoAlpha: 0, duration: 0.14 },
          PHASE_2_END - 0.16,
        );

        // ── phase 3 · hand over to the bio card ──────────────────────────────
        tl.to(human, { autoAlpha: 0, duration: 0.06 }, PHASE_2_END).to(
          bio,
          { autoAlpha: 1, scale: 1, y: 0, duration: 1 - PHASE_2_END, ease: 'power2.out' },
          PHASE_2_END,
        );
      });
    }, container);

    return () => ctx.revert();
  }, [
    containerRef,
    stageRef,
    artworkRef,
    ridgeRef,
    mountainRef,
    crestRef,
    routeRef,
    humanRef,
    flagRefs,
    finishRef,
    bioRef,
    copyRef,
    flatBodyD,
    flatCrestD,
    zoomAnchor,
    pinStart,
  ]);
}
