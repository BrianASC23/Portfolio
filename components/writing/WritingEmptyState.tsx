import Link from 'next/link';

export function WritingEmptyState() {
  return (
    <p className="text-[var(--color-fg-muted)]">
      No posts yet — check back soon, or{' '}
      <Link
        href="https://medium.com/@brianc40722"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--color-accent)] hover:underline"
      >
        read on Medium
      </Link>
      .
    </p>
  );
}
