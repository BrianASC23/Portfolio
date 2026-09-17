import { fontMono } from '@/app/fonts';
import { ContactCard } from '@/components/nav/ContactCard';
import { Container } from '@/components/primitives/Container';
import { SectionIntro } from '@/components/sections/SectionIntro';
import { getSocial } from '@/lib/social';
import type { IconType } from 'react-icons';
import { SiGithub, SiMedium, SiX } from 'react-icons/si';

/**
 * Kept here rather than in bio.mdx: the hero card reads the bio's shorter
 * location, and the long form would crowd that line.
 */
const LOCATION = 'New York City, New York';

/** Secondary profiles, stacked as round badges beside the cards, top to bottom. */
const EXTRA_SOCIALS: { key: string; icon: IconType }[] = [
  { key: 'github', icon: SiGithub },
  { key: 'medium', icon: SiMedium },
  { key: 'x', icon: SiX },
];

/** Hard pixel offset in the hero's shadow tone, matching ContactCard. */
const BADGE_SHADOW = '3px 3px 0px var(--hero-shadow)';

/**
 * Contact footer.
 *
 * Three pixel-glyph panels — location, email, profile — with the secondary
 * profiles as a column of round badges to their right, over the same retro
 * language as the rest of the page: 2px rules, hard pixel shadows, mono labels
 * and the site amber for accents.
 */
export function Footer() {
  const email = getSocial('email');
  const linkedin = getSocial('linkedin');

  return (
    <footer className="footer-hero border-t-2 border-[var(--color-menu-rule)] bg-[var(--color-menu-ink)]">
      <Container>
        <div className="py-20 md:py-28">
          <SectionIntro eyebrow="Contact" title="Let's Connect" tone="inverted" />

          <p className="mx-auto mt-5 max-w-md text-center text-sm text-[var(--color-menu-muted)]">
            Building something interesting, or hiring? I&apos;d like to hear about it.
          </p>

          <div className="mx-auto mt-14 flex max-w-[1060px] flex-col items-center gap-8 md:mt-16 md:flex-row md:items-stretch md:gap-6">
            <div className="grid w-full flex-1 gap-6 md:grid-cols-3">
              <ContactCard glyph="pin" label="Where to find me" value={LOCATION} />
              {email && (
                <ContactCard
                  glyph="mail"
                  label="Email me at"
                  value={email.username ?? email.label}
                  href={email.href}
                />
              )}
              {linkedin && (
                <ContactCard
                  glyph="profile"
                  label="Let's connect"
                  value="LinkedIn"
                  href={linkedin.href}
                />
              )}
            </div>

            <ul className="flex list-none flex-row gap-4 md:flex-col md:justify-between md:py-1">
              {EXTRA_SOCIALS.map(({ key, icon: Icon }) => {
                const social = getSocial(key);
                if (!social) return null;

                return (
                  <li key={social.key}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--color-menu-rule)] bg-[var(--color-menu-panel)] text-[var(--color-menu-text)] transition-[translate,border-color,color] duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:border-[var(--color-accent)] focus-visible:outline-none"
                      style={{ boxShadow: BADGE_SHADOW }}
                    >
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t-2 border-[var(--color-menu-rule)]">
        <Container>
          <p
            className={`py-6 text-center text-[10px] uppercase tracking-[0.24em] text-[var(--color-menu-muted)] ${fontMono.className}`}
          >
            © {new Date().getFullYear()} · Brian Cao · Built with Next.js
          </p>
        </Container>
      </div>
    </footer>
  );
}
