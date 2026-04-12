import { SectionWaypoint } from '@/components/decorations/SectionWaypoint';
import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import { ContactForm } from '@/components/sections/ContactForm';
import { CONTACT_EMAIL } from '@/lib/nav';
import { GLASS_STATIC } from '@/lib/styles';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch — send a raven, inscribe a scroll, or simply drop a message.',
};

const channels = [
  {
    label: 'Email',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    note: 'Best for project inquiries',
    icon: '📜',
  },
  {
    label: 'GitHub',
    value: 'BrianASC23',
    href: 'https://github.com/BrianASC23',
    note: 'Review open-source work',
    icon: '⚔️',
  },
  {
    label: 'LinkedIn',
    value: 'brian-cao',
    href: 'https://linkedin.com/in/brian-cao-7b9a89211',
    note: 'Professional network',
    icon: '🛡️',
  },
  {
    label: 'Medium',
    value: '@brianc40722',
    href: 'https://medium.com/@brianc40722',
    note: 'Read the chronicles',
    icon: '📖',
  },
] as const;

export default function ContactPage() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section className="relative py-20 md:py-28">
        <Container size="default">
          <div className="max-w-3xl">
            <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
              <SectionWaypoint variant="scroll" />
              The Summoning Circle
            </p>
            <h1 className="font-serif text-[length:var(--text-h1)] font-light leading-[1.05] tracking-[-0.02em] text-[var(--color-fg)]">
              Send a{' '}
              <em
                className="italic"
                style={{
                  background: 'var(--gradient-gold)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Raven
              </em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
              Whether you seek an alliance for a summer quest, wish to collaborate on arcane
              side-projects, or simply want to exchange tales — the guild hall is open.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`mailto:${CONTACT_EMAIL}`} size="md">
                Dispatch a Scroll
              </Button>
              <Button href="https://github.com/BrianASC23" variant="secondary" size="md">
                Visit the Forge
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ---- Main content: form + sidebar ---- */}
      <section className="relative pb-24 md:pb-32">
        <Container size="default">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            {/* Left: Contact form */}
            <div>
              <div className="mb-8 flex items-center gap-2 text-[var(--color-fg-subtle)]">
                <SectionWaypoint variant="signpost" />
                <h2 className="font-serif text-sm italic tracking-wide">Inscribe Your Message</h2>
              </div>
              <div className={`${GLASS_STATIC} p-6 md:p-8`}>
                <ContactForm />
              </div>
            </div>

            {/* Right: channels + availability */}
            <div className="flex flex-col gap-8">
              {/* Direct channels */}
              <div>
                <div className="mb-6 flex items-center gap-2 text-[var(--color-fg-subtle)]">
                  <SectionWaypoint variant="anvil" />
                  <h2 className="font-serif text-sm italic tracking-wide">Communication Scrolls</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {channels.map((ch) => (
                    <Link
                      key={ch.label}
                      href={ch.href}
                      target={ch.href.startsWith('mailto') ? undefined : '_blank'}
                      rel={ch.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                      className={`${GLASS_STATIC} group block p-5 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:scale-[1.02] hover:border-[var(--color-accent-glow)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_rgba(0,0,0,0.06)]`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                          {ch.label}
                        </span>
                        <span className="text-base" aria-hidden>
                          {ch.icon}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)]">
                        {ch.value}
                      </p>
                      <p className="mt-1 font-serif text-xs italic text-[var(--color-fg-subtle)]">
                        {ch.note}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Availability card */}
              <div className={`${GLASS_STATIC} p-6 lg:sticky lg:top-24`}>
                <h3 className="mb-5 font-serif text-sm italic tracking-wide text-[var(--color-fg-subtle)]">
                  Adventurer Status
                </h3>
                <dl className="grid gap-4">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                      Current Quest
                    </dt>
                    <dd className="mt-1 text-sm text-[var(--color-fg)]">
                      Summer 2026 SWE internship
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                      Response Time
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-sm text-[var(--color-fg)]">
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-green-500"
                        style={{ animation: 'status-pulse 2s ease-in-out infinite' }}
                      />
                      Within 24 hours
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                      Timezone
                    </dt>
                    <dd className="mt-1 text-sm text-[var(--color-fg)]">
                      America / New York (EST)
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                      Open To
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {['Internships', 'Freelance', 'Open Source', 'Collabs'].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[11px] text-[var(--color-fg-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
