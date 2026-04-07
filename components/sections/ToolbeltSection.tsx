import { Marquee } from '@/components/motion/Marquee';
import { Section } from '@/components/primitives/Section';
import { getToolbelt } from '@/lib/content/site';

export function ToolbeltSection() {
  const tb = getToolbelt();
  const all = [...tb.languages, ...tb.frontend, ...tb.backend, ...tb.aiml, ...tb.tools];

  return (
    <Section
      id="toolbelt"
      eyebrow="05 · Toolbelt"
      title="Tools I reach for"
      description="The short list of things I've used in production or research."
      containerSize="wide"
    >
      <Marquee speed={60} className="py-4">
        {all.map((tool) => (
          <span
            key={tool}
            className="font-serif text-4xl text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-accent)] md:text-5xl"
          >
            {tool}
          </span>
        ))}
      </Marquee>
      <Marquee speed={80} reverse className="py-4 opacity-60">
        {all.map((tool) => (
          <span key={`${tool}-2`} className="font-mono text-[var(--color-fg-subtle)] text-xl">
            · {tool}
          </span>
        ))}
      </Marquee>
    </Section>
  );
}
