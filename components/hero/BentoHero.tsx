'use client';

import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import { CONTACT_EMAIL } from '@/lib/nav';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

const SPRING_CONFIG = { stiffness: 80, damping: 20, mass: 1 };

const GLASS =
  'rounded-2xl border-[0.5px] border-black/[0.08] bg-white/70 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)]';

const STACK_PILLS = ['React', 'Python', 'TypeScript', 'PyTorch', 'Next.js'];

interface FeaturedProject {
  title: string;
  tagline: string;
  tech: string[];
}

interface BentoHeroProps {
  featuredProject?: FeaturedProject;
}

export function BentoHero({ featuredProject }: BentoHeroProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end start'],
  });

  // Entry: 0→0.5 maps 45°→0°, Exit: 0.5→1.0 maps 0°→-20°
  const rawRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [45, 0, -20]);
  const rawRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-15, 0, 10]);
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.35, 0.5, 0.85, 1], [0, 1, 1, 1, 0]);

  const rotateX = useSpring(rawRotateX, SPRING_CONFIG);
  const rotateY = useSpring(rawRotateY, SPRING_CONFIG);
  const scale = useSpring(rawScale, SPRING_CONFIG);
  const opacity = useSpring(rawOpacity, SPRING_CONFIG);

  // Specular highlight moves at 2x scroll speed
  const highlightX = useTransform(scrollYProgress, [0, 0.5], ['120%', '-20%']);

  const featured = featuredProject ?? {
    title: 'Advising Bot',
    tagline: 'AI-powered academic advisor',
    tech: ['RAG', 'Next.js'],
  };

  const isReduced = !!reduced;

  return (
    <div ref={scrollRef} data-hero-scroll className="relative h-[200vh]">
      <div
        data-hero-sticky
        className="sticky top-0 flex min-h-screen items-center justify-center overflow-hidden"
      >
        <Container className="relative z-10 py-20">
          {/* Static content above the card */}
          <div className="mb-10 text-center">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
              Software Engineer
            </p>
            <h1 className="sr-only">Brian Cao</h1>
            <p
              aria-hidden="true"
              className="font-serif text-[length:var(--text-display)] font-light leading-[0.9] tracking-[-0.03em] text-[var(--color-fg)]"
            >
              Brian Cao
            </p>
          </div>

          {/* 3D-animated bento grid */}
          <motion.div
            style={
              isReduced
                ? {}
                : {
                    rotateX,
                    rotateY,
                    scale,
                    opacity,
                    transformPerspective: 1200,
                  }
            }
            className="relative mx-auto grid max-w-[580px] grid-cols-[1.4fr_1fr] grid-rows-[auto_auto] gap-3"
          >
            {/* Specular highlight overlay */}
            {!isReduced && (
              <motion.div
                style={{ x: highlightX }}
                className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-br from-white/30 to-transparent"
                aria-hidden="true"
              />
            )}

            {/* Intro card — spans both rows */}
            <div
              data-card="intro"
              className={`${GLASS} row-span-2 flex flex-col justify-between p-6 backdrop-blur-2xl`}
            >
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
                  <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--color-fg-subtle)]">
                    Available for work
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  Full-stack engineer building systems at the edge of software and AI. Stony Brook
                  CS Honors '27.
                </p>
              </div>
              <div className="mt-6 flex gap-2">
                <Button href="/projects" size="sm">
                  View projects
                </Button>
                <Button href={`mailto:${CONTACT_EMAIL}`} variant="secondary" size="sm">
                  Get in touch
                </Button>
              </div>
            </div>

            {/* Featured project card — top right */}
            <div data-card="project" className={`${GLASS} p-5 backdrop-blur-2xl`}>
              <p className="mb-2 text-[11px] uppercase tracking-[0.1em] text-[var(--color-fg-subtle)]">
                Featured Project
              </p>
              <h3 className="text-[17px] font-semibold text-[var(--color-fg)]">{featured.title}</h3>
              <p className="mt-1 text-xs text-[var(--color-fg-muted)]">{featured.tagline}</p>
              <div className="mt-3 flex gap-1.5">
                {featured.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[11px] text-[var(--color-fg-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills card — bottom right */}
            <div data-card="stack" className={`${GLASS} p-5 backdrop-blur-2xl`}>
              <p className="mb-3 text-[11px] uppercase tracking-[0.1em] text-[var(--color-fg-subtle)]">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {STACK_PILLS.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[11px] text-[var(--color-fg-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </Container>
      </div>
    </div>
  );
}
