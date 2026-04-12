import { FadeIn } from '@/components/motion/FadeIn';
import { Container } from '@/components/primitives/Container';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { getAllExperiences } from '@/lib/content/experience';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Professional experience, internships, and roles that have shaped Brian Cao as an engineer.',
};

export default function ExperiencePage() {
  const experiences = getAllExperiences();

  return (
    <section className="py-24 md:py-32">
      <Container size="default">
        <FadeIn>
          <header className="mb-16 md:mb-20">
            <p className="mb-3 font-mono text-[length:var(--text-micro)] uppercase tracking-[0.12em] text-[var(--color-accent)]">
              Experience
            </p>
            <h1 className="font-serif text-[length:var(--text-h1)] font-light leading-[1.05] tracking-[-0.02em] text-[var(--color-fg)]">
              Quests &amp; Chronicles
            </h1>
            <p className="mt-4 max-w-lg text-[var(--color-fg-muted)]">
              A timeline of roles, teams, and impact across software engineering and research.
            </p>
          </header>
        </FadeIn>

        <ExperienceTimeline experiences={experiences} />
      </Container>
    </section>
  );
}
