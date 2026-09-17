/**
 * Hero scroll affordance — sits on the bottom edge of the viewport-locked hero
 * to signal that content continues below the fold. Doubles as a jump link.
 *
 * CSS keyframes (globals.css): scroll-cue
 */
export function ScrollCue({ href = '#workspace', className = '' }) {
  return (
    <a
      href={href}
      className={`group flex flex-col items-center gap-2 pb-8 text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-fg-muted)] md:pb-10 ${className}`}
    >
      <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        style={{ animation: 'scroll-cue 2.2s ease-in-out infinite' }}
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
      <span className="sr-only">Scroll to content</span>
    </a>
  );
}
