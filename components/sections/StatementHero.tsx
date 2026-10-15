import { Container } from '@/components/primitives/Container';
import { getBio } from '@/lib/content/site';

function Meta({ label, children }: { label: string; children: string }) {
  return (
    <div className="flex flex-col gap-3.5">
      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
        {label}
      </dt>
      <dd className="m-0 text-[15px] leading-relaxed text-[var(--color-fg-muted)]">{children}</dd>
    </div>
  );
}

/**
 * The opening statement and the two columns of standing context under it.
 *
 * There is no artwork and no entrance animation here on purpose: this is the
 * first paint, and the page is read on a phone in about twenty seconds. The
 * sentence is the hero.
 */
export function StatementHero() {
  const { frontmatter } = getBio();

  return (
    <section aria-label="Introduction" className="pt-28 pb-16 md:pt-40 md:pb-24">
      <Container size="wide">
        <h1 className="max-w-[15ch] font-serif text-[length:var(--text-display)] leading-[1.04] tracking-[-0.02em] text-[var(--color-fg)]">
          {frontmatter.statement}
        </h1>

        <dl className="mt-14 grid max-w-3xl gap-10 sm:grid-cols-2 md:mt-16">
          <Meta label="Currently">{frontmatter.currently}</Meta>
          <Meta label="Previously">{frontmatter.previously}</Meta>
        </dl>
      </Container>
    </section>
  );
}
