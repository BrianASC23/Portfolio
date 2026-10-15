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
        {/* 18ch is the tightest measure that still breaks to three lines in
            Libre Baskerville; narrower runs to four, wider saturates at the
            text's natural width and loses the rag. */}
        <h1 className="max-w-[18ch] font-[family-name:var(--font-family-display)] text-[length:var(--text-display)] leading-[1.14] tracking-[-0.015em] text-[var(--color-fg)]">
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
