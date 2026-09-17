import type { BioFrontmatter } from '@/lib/content/site';
import { SOCIALS } from '@/lib/social';
import Image from 'next/image';
import Link from 'next/link';
import { forwardRef } from 'react';
import type { IconType } from 'react-icons';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

/** Only the links worth surfacing at the end of the climb, in display order. */
const CARD_SOCIALS: { key: string; Icon: IconType }[] = [
  { key: 'email', Icon: FiMail },
  { key: 'linkedin', Icon: FiLinkedin },
  { key: 'github', Icon: FiGithub },
];

interface BioCardProps {
  bio: { frontmatter: BioFrontmatter; body: string };
}

/**
 * The payoff at the end of the summit sequence: portrait, bio, links, set
 * straight onto the hero's background rather than into a panel.
 *
 * Deliberately rendered outside the zooming stage — inside it, the phase-two
 * scale would blow this up ninefold along with everything else. The timeline
 * owns its opacity and scale, so it starts hidden here.
 */
export const BioCard = forwardRef<HTMLDivElement, BioCardProps>(function BioCard({ bio }, ref) {
  const { name, role, headline, location } = bio.frontmatter;
  const lead = bio.body.trim().split('\n\n')[0];

  const links = CARD_SOCIALS.map(({ key, Icon }) => {
    const social = SOCIALS.find((s) => s.key === key);
    return social ? { social, Icon } : null;
  }).filter((entry): entry is { social: (typeof SOCIALS)[number]; Icon: IconType } =>
    Boolean(entry),
  );

  return (
    <div
      ref={ref}
      // `invisible` matches the autoAlpha the timeline sets on mount, so the
      // card cannot flash before GSAP takes over on a slow hydrate.
      className="pointer-events-none invisible absolute inset-0 z-20 flex items-center justify-center px-4 py-6"
    >
      <div className="pointer-events-auto max-h-full w-full max-w-5xl overflow-y-auto">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-12 lg:gap-16">
          {/* Portrait column, with the links tucked underneath it */}
          <div className="flex shrink-0 flex-col items-center gap-4 sm:gap-6">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-[var(--hero-ink)] sm:h-56 sm:w-56 lg:h-64 lg:w-64">
              <Image
                src="/sprites/portrait.png"
                alt={name}
                fill
                sizes="(min-width: 1024px) 256px, (min-width: 640px) 224px, 128px"
                className="object-cover"
              />
            </div>

            <ul className="flex list-none items-center gap-4">
              {links.map(({ social, Icon }) => (
                <li key={social.key}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--hero-rule)] text-[var(--hero-ink)] transition-colors hover:bg-[var(--hero-accent)] hover:text-[var(--hero-sky)]"
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 text-center sm:text-left">
            <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl text-[var(--hero-ink)]">
              {name}
            </h2>

            {headline ? (
              <p className="mt-3 text-base font-medium text-[var(--hero-ink)] sm:text-lg lg:text-xl">
                {headline}
              </p>
            ) : (
              <p className="mt-3 text-base font-semibold text-[var(--hero-ink)] sm:text-lg lg:text-xl">
                <span>{role}</span>
                {location && (
                  <span className="text-[var(--hero-ink-muted)]"> &middot; {location}</span>
                )}
              </p>
            )}

            <p className="mt-4 text-base leading-relaxed text-[var(--hero-ink-muted)] sm:mt-6 sm:text-lg lg:text-xl">
              {lead}
            </p>

            <Link
              href="/writing"
              className="group mt-4 inline-flex sm:mt-5 items-center gap-2 text-base font-semibold text-[var(--hero-accent)] underline-offset-4 hover:underline sm:text-lg"
            >
              Check Out My Writing
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                &gt;&gt;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});
