import { Mark } from '@/components/brand/Mark';
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
 * The name, set apart from the sentence it sits in.
 *
 * Sized in `em` throughout so the bubble tracks the fluid display scale instead
 * of needing a breakpoint per step. `box-decoration-break: clone` keeps both
 * halves fully painted if the name ever does land across a line break.
 */
function NameBubble({ name }: { name: string }) {
  return (
    <span className="whitespace-nowrap">
      <Mark className="mr-[0.1em] inline-block h-[0.26em] w-[0.26em] translate-y-[-0.42em] text-[var(--color-accent)]" />
      <span className="rounded-[0.22em] bg-[var(--color-accent)] px-[0.14em] pb-[0.05em] text-[var(--color-bg)] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
        {name}
      </span>
    </span>
  );
}

/**
 * Splits the statement around the name so the name can carry its own treatment
 * while the sentence stays a single authored string in `bio.mdx`. If the name
 * is not present in the statement the sentence renders plain — the content
 * stays correct even when the two drift apart.
 */
function Statement({ statement, name }: { statement: string; name: string }) {
  const at = statement.indexOf(name);
  if (at === -1) return <>{statement}</>;

  return (
    <>
      {statement.slice(0, at)}
      <NameBubble name={name} />
      {statement.slice(at + name.length)}
    </>
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
          <Statement statement={frontmatter.statement} name={frontmatter.name} />
        </h1>

        <dl className="mt-14 grid max-w-3xl gap-10 sm:grid-cols-2 md:mt-16">
          <Meta label="Currently">{frontmatter.currently}</Meta>
          <Meta label="Previously">{frontmatter.previously}</Meta>
        </dl>
      </Container>
    </section>
  );
}
