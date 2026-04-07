import { Section } from '@/components/primitives/Section';
import Link from 'next/link';
import { ContactForm } from './ContactForm';

export function ContactSection() {
  return (
    <Section
      id="contact"
      eyebrow="07 · Contact"
      title={
        <>
          Let's build
          <br />
          <em className="text-[var(--color-accent)] italic">something</em>.
        </>
      }
      description="I'm looking for summer 2026 software engineering internships. Also open to interesting side conversations."
      containerSize="narrow"
    >
      <div className="grid gap-12 md:grid-cols-[1.1fr_1fr]">
        <ContactForm />
        <div className="flex flex-col gap-4 font-mono text-[11px] text-[var(--color-fg-muted)] uppercase tracking-[0.14em]">
          <Link href="mailto:brianc40722@gmail.com" className="hover:text-[var(--color-accent)]">
            brianc40722@gmail.com →
          </Link>
          <Link
            href="https://github.com/BrianASC23"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)]"
          >
            github.com/BrianASC23 →
          </Link>
          <Link
            href="https://linkedin.com/in/brian-cao-7b9a89211"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)]"
          >
            linkedin → brian-cao
          </Link>
          <Link
            href="https://medium.com/@brianc40722"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)]"
          >
            medium → @brianc40722
          </Link>
        </div>
      </div>
    </Section>
  );
}
