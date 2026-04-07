'use client';

export function CommandTrigger() {
  return (
    <button
      type="button"
      aria-label="Open command palette"
      onClick={() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }),
        );
      }}
      className="hidden h-9 items-center gap-2 rounded-full border border-[var(--color-border)] px-3 font-mono text-[10px] text-[var(--color-fg-muted)] uppercase tracking-[0.14em] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:inline-flex"
    >
      ⌘K · Search
    </button>
  );
}
