'use client';

import { CharReveal } from '@/components/motion/CharReveal';
import { Container } from '@/components/primitives/Container';
import type { BioFrontmatter } from '@/lib/content/site';
import { useSummitTimeline } from '@/lib/hooks/useSummitTimeline';
import { useCallback, useRef } from 'react';
import { BioCard } from './BioCard';
import { MountainMarkers, ZOOM_ANCHOR } from './MountainMarkers';
import { FLAT_BODY_D, FLAT_CREST_D, MountainRidge } from './MountainRidge';
import { ScrollCue } from './ScrollCue';

interface SummitHeroProps {
  bio: { frontmatter: BioFrontmatter; body: string };
}

/**
 * The pinned summit sequence: the mountain flattens into a baseline, the
 * climber walks it to the far left, the flags line up toward a finish banner,
 * the view zooms into the climber, and the bio card takes the frame.
 *
 * This component only wires elements to refs and paints the resting state. All
 * of the motion lives in `useSummitTimeline`, which is where the phase timings
 * are.
 */
export function SummitHero({ bio }: SummitHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const ridgeRef = useRef<SVGSVGElement>(null);
  const mountainRef = useRef<SVGPathElement>(null);
  const crestRef = useRef<SVGPathElement>(null);
  const routeRef = useRef<SVGPolylineElement>(null);
  const humanRef = useRef<SVGGElement>(null);
  const flagRefs = useRef<(SVGGElement | null)[]>([]);
  const finishRef = useRef<SVGGElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  // Returns a fresh closure per render, which would normally churn refs — but
  // this component holds no state and takes static props, so it renders once.
  const setFlagRef = useCallback(
    (index: number) => (el: SVGGElement | null) => {
      flagRefs.current[index] = el;
    },
    [],
  );

  useSummitTimeline({
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
    flatBodyD: FLAT_BODY_D,
    flatCrestD: FLAT_CREST_D,
    zoomAnchor: ZOOM_ANCHOR,
    // The site's fixed top bar is 3.5rem; without this the pinned hero sits
    // under it and leaves an equal strip of the next section showing below.
    pinStart: 'top 56px',
  });

  return (
    <section
      id="hero"
      ref={containerRef}
      aria-label="Introduction"
      // Sky colour, not black: phase one fades the artwork out over this, and
      // it matches the active artwork's own upper sky exactly.
      className="relative h-[calc(100dvh-3.5rem)] overflow-hidden bg-[var(--hero-sky)]"
    >
      {/* Everything in here scales together in phase two.
          Deliberately NOT `will-change: transform`. Promoting this to its own
          composited layer means the browser has to rasterise it at the zoom's
          full scale — viewport x MAX_ZOOM — which blows past texture limits and
          gets capped (the artwork visibly softens) or, under memory pressure,
          has tiles dropped, which reads as parts of the scene flickering in and
          out even though every computed style is correct. Re-rasterising per
          frame is cheap here: the heavy 96KB artwork is `visibility: hidden` by
          the time the zoom starts, leaving two paths and a handful of rects. */}
      <div ref={stageRef} data-hero-stage className="absolute inset-0">
        {/* A background-image rather than an <img>: the URL is a theme token, so
            only the active theme's artwork is ever fetched. Two <img> tags
            toggled by CSS would download both 96KB files. */}
        <div
          ref={artworkRef}
          aria-hidden="true"
          className="absolute inset-0 bg-[image:var(--hero-art)] bg-cover bg-center bg-no-repeat"
        />
        <MountainRidge
          svgRef={ridgeRef}
          bodyRef={mountainRef}
          crestRef={crestRef}
          className="absolute inset-0 h-full w-full"
        />
        <MountainMarkers
          humanRef={humanRef}
          routeRef={routeRef}
          finishRef={finishRef}
          setFlagRef={setFlagRef}
          className="absolute inset-0 h-full w-full"
        />
      </div>

      {/* Scrim and copy leave together in phase one. The scrim exists only to
          make the name readable over the artwork; left up, it would sit as a
          pointless dark wash over the flattened world for the rest of the pin. */}
      <div ref={copyRef} className="pointer-events-none absolute inset-0">
        {/* Themed: the day wash lightens so dark type reads, dusk darkens for light type */}
        <div className="absolute inset-0" style={{ background: 'var(--hero-scrim)' }} />

        {/* Name sits low so the mountain owns the frame above it */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <Container>
            <div className="text-center">
              <h1 className="sr-only">Brian Cao</h1>
              <CharReveal
                text="Brian Cao"
                className="font-serif text-[length:var(--text-display)] font-normal leading-[0.9] tracking-[-0.03em] text-[var(--hero-ink)]"
                delay={0.3}
              />
            </div>
          </Container>

          <ScrollCue href="#projects" className="pointer-events-auto mt-7" />
        </div>
      </div>

      <BioCard ref={bioRef} bio={bio} />
    </section>
  );
}
