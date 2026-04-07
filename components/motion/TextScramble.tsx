'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

interface TextScrambleProps {
  text: string;
  trigger?: 'mount' | 'hover';
  className?: string;
}

export function TextScramble({ text, trigger = 'mount', className }: TextScrambleProps) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef(0);
  const reduced = useReducedMotion();

  const scramble = () => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
    const old = display;
    const len = Math.max(old.length, text.length);
    for (let i = 0; i < len; i++) {
      const from = old[i] ?? '';
      const to = text[i] ?? '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from, to, start, end });
    }
    let frame = 0;
    const update = () => {
      let output = '';
      let complete = 0;
      for (const item of queue) {
        const { from, to, start, end } = item;
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!item.char || Math.random() < 0.28) {
            item.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          output += item.char;
        } else {
          output += from;
        }
      }
      setDisplay(output);
      if (complete < queue.length) {
        frame++;
        frameRef.current = requestAnimationFrame(update);
      }
    };
    cancelAnimationFrame(frameRef.current);
    update();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: scramble closure intentionally rebuilt per text
  useEffect(() => {
    if (trigger === 'mount') scramble();
    return () => cancelAnimationFrame(frameRef.current);
  }, [text]);

  return (
    <span
      className={className}
      onMouseEnter={trigger === 'hover' ? scramble : undefined}
      aria-label={text}
    >
      {display}
    </span>
  );
}
