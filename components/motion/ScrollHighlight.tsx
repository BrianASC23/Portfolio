'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { memo, useRef } from 'react';

interface ScrollHighlightProps {
  text: string;
  className?: string;
}

export const ScrollHighlight = memo(function ScrollHighlight({
  text,
  className,
}: ScrollHighlightProps) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.4'],
  });

  const words = text.split(' ');

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span ref={containerRef} className={className}>
      {words.map((word, i) => (
        <HighlightWord
          key={`word-${i}-${word}`}
          word={word}
          index={i}
          total={words.length}
          progress={scrollYProgress}
        />
      ))}
    </span>
  );
});

function HighlightWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  // Each word activates over a small slice of the overall scroll range
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  const color = useTransform(progress, [start, end], ['var(--color-fg-subtle)', 'var(--color-fg)']);

  return (
    <motion.span className="inline-block" style={{ opacity, color }}>
      {word}
      {index < total - 1 ? '\u00A0' : ''}
    </motion.span>
  );
}
