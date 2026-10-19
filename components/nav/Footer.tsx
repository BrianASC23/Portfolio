import { fontMono } from '@/app/fonts';
import { Container } from '@/components/primitives/Container';
import { getBio } from '@/lib/content/site';
import { getSocial } from '@/lib/social';
import Link from 'next/link';

/** Profiles worth a recruiter's click, in the order one would try them. */
const PROFILE_KEYS = ['github', 'linkedin', 'medium', 'x'];

/**
 * Closing block: availability, the email address, and where else to find him.
 *
 * It used to be a dark slab — three bordered panels with pixel glyphs and hard
 * offset shadows, on the near-black "retro menu" palette. Against the warm
 * paper ground the rest of the page now sits on, that slab read as a different
 * site bolted to the bottom, so the dark palette and its tokens are gone. The
 * page ends on the same paper it opens with, closed by the same hairline rule
 * and mono eyebrow the sections above use.
 */
export function Footer() {
  const { frontmatter } = getBio();
  const email = getSocial('email');

  return (
    <footer className="pb-14 pt-8 md:pb-20">
      <Container size="wide">
        <h2 className="border-t border-[var(--color-border)] pt-5 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
          Get in touch
        </h2>

        <div className="mt-8 grid gap-10 md:mt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16">
          <div>
            <p className="max-w-[24ch] font-serif text-[length:var(--text-h3)] leading-snug tracking-[-0.01em] text-[var(--color-fg)]">
              {frontmatter.availability}
            </p>

            {email && (
              <a
                href={email.href}
                className="mt-5 inline-block text-[15px] text-[var(--color-accent)] underline decoration-[var(--color-border-strong)] decoration-1 underline-offset-[5px] transition-colors hover:decoration-[var(--color-accent)]"
              >
                {email.username ?? email.label}
              </a>
            )}
          </div>

          <ul
            className={`flex list-none flex-wrap gap-x-6 gap-y-2.5 text-[11px] uppercase tracking-[0.14em] md:justify-end ${fontMono.className}`}
          >
            <li>
              <Link
                href="/resume"
                className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)]"
              >
                Resume
              </Link>
            </li>
            {PROFILE_KEYS.map((key) => {
              const social = getSocial(key);
              if (!social) return null;

              return (
                <li key={social.key}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {social.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <p
          className={`mt-14 border-t border-[var(--color-border)] pt-5 text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] md:mt-20 ${fontMono.className}`}
        >
          © {new Date().getFullYear()} Brian Cao · Built with Next.js
        </p>
      </Container>
    </footer>
  );
}
