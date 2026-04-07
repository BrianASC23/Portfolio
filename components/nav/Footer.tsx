import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-[var(--color-border)]/60 border-t py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row md:items-end md:justify-between md:px-8 lg:px-12">
        <div>
          <p className="font-serif text-3xl text-[var(--color-fg)]">Brian Cao</p>
          <p className="mt-2 max-w-sm text-[var(--color-fg-muted)] text-sm">
            Full-stack engineer building systems at the edge of software and AI.
          </p>
        </div>
        <div className="flex flex-col gap-2 font-mono text-[11px] text-[var(--color-fg-muted)] uppercase tracking-[0.14em]">
          <Link href="https://github.com/BrianASC23" target="_blank" rel="noopener noreferrer">
            GitHub →
          </Link>
          <Link
            href="https://linkedin.com/in/brian-cao-7b9a89211"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn →
          </Link>
          <Link href="mailto:brianc40722@gmail.com">Email →</Link>
        </div>
      </div>
      <p className="mt-12 text-center font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.18em]">
        © {new Date().getFullYear()} · Brian Cao · Built with Next.js
      </p>
    </footer>
  );
}
