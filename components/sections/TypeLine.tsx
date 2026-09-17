'use client';

/** Seconds between characters. */
const CHAR_DELAY = 0.022;

/**
 * Types a line out character by character, like a game's dialogue box, then
 * leaves a blinking caret behind.
 *
 * Each character carries its own `steps(1)` animation delay rather than being
 * driven by a JS timer, so the whole reveal costs one render and the global
 * reduced-motion override collapses it to an instant paint.
 *
 * Words are wrapped as inline-blocks so the line still breaks between words,
 * never mid-word.
 */
export function TypeLine({
  text,
  inView,
  className = '',
  startDelay = 0,
}: {
  text: string;
  inView: boolean;
  className?: string;
  startDelay?: number;
}) {
  // Keep the trailing space inside each word so spacing survives inline-block.
  const words = text.split(' ').map((w, i, all) => (i < all.length - 1 ? `${w} ` : w));

  let cursor = 0;
  const typed = words.map((word) => {
    const chars = [...word].map((char) => {
      const delay = startDelay + cursor * CHAR_DELAY;
      cursor += 1;
      return (
        <span
          key={`${char}-${cursor}`}
          style={
            // Deliberately linear, not steps(1): a single-step easing resolves
            // inconsistently at the fill-forwards boundary and leaves some
            // characters stuck at opacity 0. A 20ms linear fade still pops.
            inView ? { animation: `type-in 0.02s linear ${delay}s both` } : { opacity: 0 }
          }
        >
          {char}
        </span>
      );
    });

    return (
      <span key={`w-${cursor}`} className="inline-block whitespace-pre">
        {chars}
      </span>
    );
  });

  const done = startDelay + cursor * CHAR_DELAY;

  return (
    <p className={className}>
      {typed}
      <span
        aria-hidden="true"
        className="ml-1 inline-block h-[0.95em] w-[0.42em] translate-y-[0.12em] bg-[var(--color-accent)]"
        style={
          inView
            ? { animation: `pixel-caret 1s steps(1, end) ${done}s infinite backwards` }
            : { opacity: 0 }
        }
      />
    </p>
  );
}
