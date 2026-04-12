'use client';

import { AetherPlexus } from '@/components/effects/AetherPlexus';
import { MagneticElement } from '@/components/effects/MagneticElement';
import { CharReveal } from '@/components/motion/CharReveal';
import { Reveal } from '@/components/motion/Reveal';
import { ScrollHighlight } from '@/components/motion/ScrollHighlight';
import { Typewriter } from '@/components/motion/Typewriter';
import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import { ToolbeltGrid } from '@/components/sections/ToolbeltSection';
import type { BioFrontmatter } from '@/lib/content/site';
import { CONTACT_EMAIL } from '@/lib/nav';
import { GLASS } from '@/lib/styles';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { GitHubActivityCard } from './GitHubActivityCard';
import { LocationTimeCard } from './LocationTimeCard';

const TYPEWRITER_STRINGS = [
  'Scribing AI agents...',
  'Forging scalable backends...',
  'Building the future...',
];

const SPRING_CONFIG = { stiffness: 80, damping: 20, mass: 1 };

interface FeaturedProject {
  title: string;
  tagline: string;
  tech: string[];
}

interface BentoHeroProps {
  featuredProject?: FeaturedProject;
  bio?: { frontmatter: BioFrontmatter; body: string };
}

export function BentoHero({ featuredProject, bio }: BentoHeroProps) {
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
        <AetherPlexus />
        <Container className="relative z-10 py-20">
          {/* Two-column header: name + about */}
          <div className="mb-10 grid items-start gap-8 md:grid-cols-[1fr_1fr] md:gap-12">
            <div className="relative">
              {/* Amber glow cloud backdrop */}
              {!isReduced && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-x-12 -inset-y-8 -z-10 rounded-[50%]"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 50%, rgba(251,191,36,0.3) 0%, rgba(245,158,11,0.12) 35%, rgba(245,158,11,0.04) 55%, transparent 70%)',
                    filter: 'blur(24px)',
                  }}
                  animate={{
                    scale: [1, 1.08, 1.02, 1.08, 1],
                    opacity: [0.5, 0.9, 0.65, 0.9, 0.5],
                  }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                />
              )}

              <motion.div
                animate={
                  isReduced
                    ? {}
                    : {
                        y: [0, -10, -2, -10, 0],
                        x: [0, 4, -2, -4, 0],
                        rotate: [0, 0.5, 0, -0.5, 0],
                        textShadow: [
                          '0 0 30px rgba(251,191,36,0.35), 0 0 60px rgba(245,158,11,0.15), 0 4px 16px rgba(251,191,36,0.1)',
                          '0 0 40px rgba(251,191,36,0.6), 0 0 80px rgba(245,158,11,0.3), 0 4px 20px rgba(251,191,36,0.2)',
                          '0 0 30px rgba(251,191,36,0.35), 0 0 60px rgba(245,158,11,0.15), 0 4px 16px rgba(251,191,36,0.1)',
                        ],
                      }
                }
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              >
                <h1 className="sr-only">Brian Cao</h1>
                <CharReveal
                  text="Brian"
                  className="font-serif text-[length:var(--text-display)] font-light leading-[0.9] tracking-[-0.03em] text-[var(--color-fg)]"
                  delay={0.3}
                />
                <CharReveal
                  text="Cao"
                  className="font-serif text-[length:var(--text-display)] font-light leading-[0.9] tracking-[-0.03em] text-[var(--color-fg)]"
                  delay={0.5}
                />
              </motion.div>

              <motion.p
                animate={
                  isReduced
                    ? {}
                    : {
                        y: [0, -7, -1, -7, 0],
                        x: [0, -3, 2, 3, 0],
                        rotate: [0, -0.4, 0, 0.4, 0],
                        textShadow: [
                          '0 0 16px rgba(251,191,36,0.25), 0 0 32px rgba(245,158,11,0.1)',
                          '0 0 24px rgba(251,191,36,0.45), 0 0 48px rgba(245,158,11,0.2)',
                          '0 0 16px rgba(251,191,36,0.25), 0 0 32px rgba(245,158,11,0.1)',
                        ],
                      }
                }
                transition={{ duration: 9.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                className="mt-4 text-[11px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]"
              >
                <Reveal delay={0.8}>Full-Stack Alchemist {'// '}AI Specialist</Reveal>
              </motion.p>
              <Typewriter
                strings={TYPEWRITER_STRINGS}
                className="mt-3 block text-sm text-[var(--color-fg-muted)]"
              />
            </div>
            {bio && (
              <div className="flex flex-col justify-center md:pt-6">
                <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {bio.body.trim()}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-[var(--color-fg-subtle)]">
                  <span>{bio.frontmatter.role}</span>
                  {bio.frontmatter.school && <span>{bio.frontmatter.school}</span>}
                  {bio.frontmatter.location && <span>{bio.frontmatter.location}</span>}
                </div>
              </div>
            )}
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
            className="relative mx-auto grid max-w-[960px] grid-cols-1 gap-3 md:grid-cols-[1.4fr_1fr]"
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
              className={`${GLASS} border-beam flex flex-col justify-between p-6 backdrop-blur-2xl md:row-span-3`}
            >
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-green-500"
                    style={{ animation: 'status-pulse 2s ease-in-out infinite' }}
                  />
                  <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--color-fg-subtle)]">
                    Available for work
                  </span>
                </div>

                {/* Character stats */}
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {(
                    [
                      ['INT', 18],
                      ['AGI', 16],
                      ['LUK', 14],
                    ] as const
                  ).map(([stat, val]) => (
                    <div
                      key={stat}
                      className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-center"
                    >
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                        {stat}
                      </span>
                      <span
                        className="block font-mono text-lg font-bold"
                        style={{
                          background: 'var(--gradient-gold)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>

                <ScrollHighlight
                  text="Full-stack engineer building systems at the edge of software and AI. Stony Brook CS Honors '27."
                  className="text-sm leading-relaxed"
                />
              </div>
              <div className="mt-6 flex gap-2">
                <MagneticElement as="div" strength={0.25}>
                  <Button href="/projects" size="sm">
                    View projects
                  </Button>
                </MagneticElement>
                <MagneticElement as="div" strength={0.25}>
                  <Button href={`mailto:${CONTACT_EMAIL}`} variant="secondary" size="sm">
                    Get in touch
                  </Button>
                </MagneticElement>
              </div>
            </div>

            {/* Featured project card — top right */}
            <div data-card="project" className={`${GLASS} border-beam p-5 backdrop-blur-2xl`}>
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

            <GitHubActivityCard />
            <LocationTimeCard />
          </motion.div>

          <ToolbeltGrid className="mx-auto mt-6 max-w-[960px]" />
        </Container>
      </div>
    </div>
  );
}
