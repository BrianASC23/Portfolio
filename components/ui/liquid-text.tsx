//@ts-nocheck
'use client';

import { useCallback, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

const morphTime = 1.5;
const cooldownTime = 0.5;

const useMorphingText = (texts: string[]) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef('');

  const syncWidth = useCallback(() => {
    if (ghostRef.current && containerRef.current) {
      containerRef.current.style.width = `${ghostRef.current.offsetWidth}px`;
    }
  }, []);

  const setGhost = useCallback(
    (word: string) => {
      if (word === activeWordRef.current) return;
      activeWordRef.current = word;
      if (ghostRef.current) {
        ghostRef.current.textContent = word;
      }
      syncWidth();
    },
    [syncWidth],
  );

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current];
      if (!current1 || !current2 || !texts || texts.length === 0) return;

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${fraction ** 0.4 * 100}%`;

      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
      current1.style.opacity = `${invertedFraction ** 0.4 * 100}%`;

      current1.textContent = texts[textIndexRef.current % texts.length];
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length];

      // Ghost tracks the dominant word — switches at morph midpoint
      const target =
        fraction >= 0.5
          ? texts[(textIndexRef.current + 1) % texts.length]
          : texts[textIndexRef.current % texts.length];
      setGhost(target);
    },
    [texts, setGhost],
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current++;
    }
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2) {
      current2.style.filter = 'none';
      current2.style.opacity = '100%';
      current1.style.filter = 'none';
      current1.style.opacity = '0%';
    }
  }, []);

  useEffect(() => {
    // Set initial width before animation starts
    if (ghostRef.current && containerRef.current && texts.length > 0) {
      ghostRef.current.textContent = texts[0];
      activeWordRef.current = texts[0];
      containerRef.current.style.width = `${ghostRef.current.offsetWidth}px`;
    }

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [doMorph, doCooldown, texts]);

  return { text1Ref, text2Ref, ghostRef, containerRef };
};

interface MorphingTextProps {
  className?: string;
  texts: string[];
}

const SvgFilters: React.FC = () => (
  <svg
    id="liquid-morph-filters"
    className="hidden"
    preserveAspectRatio="xMidYMid slice"
    role="img"
    aria-label="Liquid morph SVG filters"
  >
    <defs>
      <filter id="liquid-morph-threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
);

const MorphingText: React.FC<MorphingTextProps> = ({ texts, className }) => {
  const { text1Ref, text2Ref, ghostRef, containerRef } = useMorphingText(texts);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative inline-block text-center transition-[width] duration-500 ease-in-out [filter:url(#liquid-morph-threshold)_blur(0.6px)]',
        className,
      )}
    >
      {/* Ghost probe — absolute, invisible, measures target word width */}
      <span
        ref={ghostRef}
        className="pointer-events-none invisible absolute left-0 top-0 inline-block whitespace-nowrap"
        aria-hidden="true"
      />
      {/* Baseline + height spacer — in normal flow for flex alignment */}
      <span className="invisible select-none" aria-hidden="true">
        {'\u00A0'}
      </span>
      {/* Visible morphing text */}
      <span className="absolute inset-x-0 top-0 m-auto inline-block w-full" ref={text1Ref} />
      <span className="absolute inset-x-0 top-0 m-auto inline-block w-full" ref={text2Ref} />
      <SvgFilters />
    </div>
  );
};

export { MorphingText };
