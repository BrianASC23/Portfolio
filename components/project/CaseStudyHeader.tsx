import { FadeIn } from '@/components/motion/FadeIn';
import { Reveal } from '@/components/motion/Reveal';
import { Container } from '@/components/primitives/Container';
import { Pill } from '@/components/primitives/Pill';
import type { Project } from '@/lib/schemas/project';
import Image from 'next/image';

interface CaseStudyHeaderProps {
  project: Project;
}

export function CaseStudyHeader({ project }: CaseStudyHeaderProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-12 md:pt-28 md:pb-20">
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
      <Container className="relative">
        <FadeIn>
          <p className="mb-5 font-mono text-[11px] text-[var(--color-fg-subtle)] uppercase tracking-[0.18em]">
            Case study · {project.status}
          </p>
        </FadeIn>
        <h1 className="max-w-[20ch] font-serif text-[length:var(--text-h1)] text-[var(--color-fg)] leading-[1.02] tracking-tight">
          <Reveal>{project.title}</Reveal>
        </h1>
        <FadeIn delay={0.2} className="mt-6 max-w-[55ch]">
          <p className="text-[var(--color-fg-muted)] text-lg md:text-xl">{project.tagline}</p>
        </FadeIn>
        <FadeIn delay={0.3} className="mt-8 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Pill key={tech}>{tech}</Pill>
          ))}
        </FadeIn>
      </Container>

      <FadeIn delay={0.4} className="mt-16">
        <Container size="wide">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              priority
              sizes="(min-width: 1280px) 1100px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </FadeIn>
    </section>
  );
}
