'use client';

import { MagneticElement } from '@/components/effects/MagneticElement';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import { Pill } from '@/components/primitives/Pill';
import type { Project } from '@/lib/schemas/project';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { FiExternalLink, FiGithub } from 'react-icons/fi';

interface FeaturedProjectsSectionProps {
  projects: Project[];
}

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  return (
    <section id="projects" aria-label="Featured projects" className="relative py-24 md:py-32">
      <Container size="wide">
        <FadeIn>
          <header className="mb-16 text-center md:mb-20">
            <h2 className="font-serif text-[length:var(--text-h2)] font-light leading-[1.05] tracking-[-0.02em] text-[var(--color-fg)]">
              Some Things I&apos;ve Built
            </h2>
          </header>
        </FadeIn>

        <div className="flex flex-col">
          {projects.map((project, i) => (
            <StackingProjectCard
              key={project.slug}
              project={project}
              index={i}
              total={projects.length}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <MagneticElement as="div" strength={0.25}>
            <Button href="/projects" variant="secondary" size="md">
              More Projects
            </Button>
          </MagneticElement>
        </div>
      </Container>
    </section>
  );
}

function StackingProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const projectUrl = `/projects#${project.slug}`;
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start'],
  });

  // As user scrolls past this card, scale it down and fade slightly
  const scale = useTransform(scrollYProgress, [0, 1], [1, index < total - 1 ? 0.95 : 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, index < total - 1 ? 0.85 : 1]);

  return (
    <div ref={cardRef} className="mb-8 last:mb-0">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-5% 0px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
        style={{
          position: 'sticky',
          top: `${64 + index * 24}px`,
          scale,
        }}
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-xl overflow-hidden"
      >
        <div className="grid md:grid-cols-[3fr_2fr]">
          {/* Image side with hover distortion */}
          <Link
            href={projectUrl}
            className="group relative block aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[320px]"
            tabIndex={-1}
            aria-hidden
          >
            {/* Warm overlay — reveals on hover */}
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-[var(--color-accent)]/15 to-transparent transition-opacity duration-500 group-hover:opacity-0" />
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover transition-[transform,filter,clip-path] duration-600 ease-out group-hover:scale-105 group-hover:saturate-[1.2] group-hover:contrast-[1.05] group-hover:[clip-path:inset(2%_1%_2%_1%)]"
              style={{ clipPath: 'inset(0)' }}
            />
          </Link>

          {/* Text side */}
          <div className="flex flex-col justify-center p-8">
            <p className="mb-1 font-mono text-[length:var(--text-micro)] uppercase tracking-[0.12em] text-[var(--color-accent)]">
              Featured Project
            </p>

            <h3 className="mb-4 text-[length:var(--text-h3)] font-semibold text-[var(--color-fg)]">
              <Link
                href={projectUrl}
                className="transition-colors duration-200 hover:text-[var(--color-accent)]"
              >
                {project.title}
              </Link>
            </h3>

            <p className="mb-5 text-[length:var(--text-body)] leading-relaxed text-[var(--color-fg-muted)]">
              {project.summary}
            </p>

            <div className="mb-5 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <Pill key={tech}>{tech}</Pill>
              ))}
            </div>

            <div className="flex gap-3">
              {project.links.github && (
                <MagneticElement as="div" strength={0.25}>
                  <Button
                    href={project.links.github}
                    variant="secondary"
                    size="sm"
                    icon={<FiGithub size={16} />}
                  >
                    GitHub Repo
                  </Button>
                </MagneticElement>
              )}
              {(project.links.live || project.links.demo) && (
                <MagneticElement as="div" strength={0.25}>
                  <Button
                    href={project.links.live ?? project.links.demo ?? ''}
                    variant="secondary"
                    size="sm"
                    icon={<FiExternalLink size={16} />}
                  >
                    Live Demo
                  </Button>
                </MagneticElement>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
