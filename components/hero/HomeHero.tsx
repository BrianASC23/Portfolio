'use client';

import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import { BrainHero } from './BrainHero';
import { SUPPORTING_CONTENT_STAGGER, SUPPORTING_CONTENT_START } from './timeline';
import { useHeroPhase } from './useHeroPhase';

export function HomeHero() {
  const phase = useHeroPhase();

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100dvh-56px)] items-center justify-center overflow-hidden"
      aria-label="Introduction"
      data-brain-phase={phase}
    >
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Real h1 for SEO and screen readers — visually hidden */}
          <h1 className="sr-only">Brian Cao</h1>

          <p className="mb-6 font-mono text-[11px] text-[var(--color-fg-subtle)] uppercase tracking-[0.18em]">
            Portfolio · 01
          </p>

          <BrainHero phase={phase} className="h-auto w-60 md:w-[22rem]" />

          <FadeIn
            delay={phase === 'playing' ? SUPPORTING_CONTENT_START : 0}
            className="mt-6 max-w-md"
          >
            <p className="text-[var(--color-fg-muted)]">
              Full-stack engineer building systems at the edge of software and AI.
              <br />
              Stony Brook '27.
            </p>
          </FadeIn>

          <FadeIn
            delay={phase === 'playing' ? SUPPORTING_CONTENT_START + SUPPORTING_CONTENT_STAGGER : 0}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Button href="/#work">View work</Button>
            <Button href="/#contact" variant="secondary">
              Get in touch
            </Button>
          </FadeIn>
        </div>
      </Container>

      <div className="absolute inset-x-0 bottom-6 z-10">
        <Container>
          <div className="flex items-center justify-between font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.18em]">
            <span>
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              Available · Summer 2026
            </span>
            <span>Scroll ↓</span>
          </div>
        </Container>
      </div>
    </section>
  );
}
