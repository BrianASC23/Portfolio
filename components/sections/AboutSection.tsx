import { FadeIn } from '@/components/motion/FadeIn';
import { Section } from '@/components/primitives/Section';
import { Text } from '@/components/primitives/Text';
import { getBio } from '@/lib/content/site';
import Image from 'next/image';

export function AboutSection() {
  const bio = getBio();

  return (
    <Section
      id="about"
      eyebrow="02 · About"
      title={
        <>
          Builder first.
          <br />
          <em className="text-[var(--color-accent)] italic">Thoughtful</em> second.
        </>
      }
      containerSize="narrow"
    >
      <div className="grid gap-10 md:grid-cols-[1fr_240px]">
        <div>
          <FadeIn>
            <Text size="lead" tone="default" className="mb-6 max-w-[60ch]">
              {bio.body.trim().split('\n\n')[0]}
            </Text>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Text size="body" tone="muted" className="max-w-[60ch]">
              {bio.body.trim().split('\n\n').slice(1).join('\n\n')}
            </Text>
          </FadeIn>
          <FadeIn
            delay={0.2}
            className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]"
          >
            <span>{bio.frontmatter.role}</span>
            {bio.frontmatter.school && <span>{bio.frontmatter.school}</span>}
            {bio.frontmatter.location && <span>{bio.frontmatter.location}</span>}
          </FadeIn>
        </div>
        <FadeIn delay={0.15}>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
            <Image
              src="/placeholder-portrait.svg"
              alt="Brian Cao"
              fill
              sizes="(min-width: 768px) 240px, 100vw"
              className="object-cover"
            />
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
