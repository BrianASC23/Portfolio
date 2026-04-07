import { FadeIn } from '@/components/motion/FadeIn';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import { PixelHero } from './PixelHero';

export function HomeHero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100dvh-56px)] items-center overflow-hidden"
      aria-label="Introduction"
    >
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="max-w-[20ch]">
            <p className="mb-6 font-mono text-[11px] text-[var(--color-fg-subtle)] uppercase tracking-[0.18em]">
              Portfolio · 01
            </p>
            <h1 className="font-serif text-[length:var(--text-display)] text-[var(--color-fg)] leading-[0.95] tracking-tight">
              <Reveal>Brian </Reveal>
              <Reveal delay={0.1}>
                <em className="text-[var(--color-accent)] italic">Cao</em>
              </Reveal>
            </h1>
            <FadeIn delay={0.3} className="mt-6 max-w-md">
              <p className="text-[var(--color-fg-muted)]">
                Full-stack engineer building systems at the edge of software and AI.
                <br />
                Stony Brook '27.
              </p>
            </FadeIn>
            <FadeIn delay={0.5} className="mt-8 flex flex-wrap gap-3">
              <Button href="/#work">View work</Button>
              <Button href="/#contact" variant="secondary">
                Get in touch
              </Button>
            </FadeIn>
          </div>
          <div className="hidden items-center justify-center md:flex">
            <FadeIn delay={0.4}>
              <PixelHero className="h-auto w-64 lg:w-80" />
            </FadeIn>
          </div>
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
