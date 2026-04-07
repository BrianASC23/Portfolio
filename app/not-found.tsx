import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center">
      <Container className="text-center">
        <p className="font-mono text-[11px] text-[var(--color-fg-subtle)] uppercase tracking-[0.18em]">
          404
        </p>
        <h1 className="mt-4 font-serif text-[length:var(--text-h1)] text-[var(--color-fg)] leading-[1.02]">
          Lost in <em className="text-[var(--color-accent)] italic">space</em>.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[var(--color-fg-muted)]">
          The page you're looking for doesn't exist. Maybe it was renamed, moved, or never shipped.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Button href="/">Go home</Button>
          <Link
            href="/projects"
            className="inline-flex h-11 items-center rounded-full border border-[var(--color-border)] px-6 font-mono text-[11px] text-[var(--color-fg)] uppercase tracking-[0.14em] hover:border-[var(--color-accent)]"
          >
            Browse projects
          </Link>
        </div>
      </Container>
    </section>
  );
}
