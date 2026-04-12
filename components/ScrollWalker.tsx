'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 14;
const FRAME_SRCS = Array.from(
  { length: TOTAL_FRAMES },
  (_, i) => `/sprites/walk-${String(i).padStart(2, '0')}.png`,
);

const DISPLAY_H = 80;
const STEP_PX = 28;
const IDLE_TIMEOUT = 5000;
const TETHER_RANGE = 200;
const SAGE_GREEN = '#a7f3d0';

// Deterministic positions for mana embers along the path
const MANA_POSITIONS = [0.15, 0.35, 0.55, 0.75, 0.92];
const MANA_HUES = [150, 190, 260, 310, 120];

export function ScrollWalker() {
  const [state, setState] = useState({ progress: 0, vw: 0, vh: 0 });
  const [idle, setIdle] = useState(false);
  const [tilt, setTilt] = useState(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Imperative refs for tether (avoids re-renders on every mousemove)
  const tetherRef = useRef<SVGLineElement>(null);
  const tetherGlowRef = useRef<SVGLineElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const resetIdleTimer = useCallback(() => {
    setIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), IDLE_TIMEOUT);
  }, []);

  useEffect(() => {
    let ticking = false;

    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setState({ progress, vw, vh });

      // Proximity tilt toward project cards
      const spriteCenterX = progress * (vw - DISPLAY_H) + DISPLAY_H / 2;
      const cards = document.querySelectorAll<HTMLElement>('[data-card="project"]');
      let newTilt = 0;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const isNearBottom = rect.bottom > vh * 0.6;
        const dx = cardCenterX - spriteCenterX;

        if (Math.abs(dx) < 100 && isNearBottom) {
          newTilt = dx > 0 ? 5 : -5;
        }
      });

      setTilt(newTilt);
    }

    function onScroll() {
      resetIdleTimer();
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Spell tether: update SVG line imperatively on mousemove
    function onMouseMove(e: MouseEvent) {
      const { progress, vw, vh } = stateRef.current;
      if (vw === 0) return;

      const leftPx = progress * (vw - DISPLAY_H);
      const footX = leftPx + 30;
      const footY = vh - 4;
      const dist = Math.hypot(e.clientX - footX, e.clientY - footY);

      if (dist < TETHER_RANGE && tetherRef.current && tetherGlowRef.current) {
        const opacity = 0.6 * (1 - dist / TETHER_RANGE);
        const attrs = {
          x1: String(footX),
          y1: String(footY),
          x2: String(e.clientX),
          y2: String(e.clientY),
        };

        for (const [k, v] of Object.entries(attrs)) {
          tetherRef.current.setAttribute(k, v);
          tetherGlowRef.current.setAttribute(k, v);
        }
        tetherRef.current.setAttribute('opacity', String(opacity));
        tetherGlowRef.current.setAttribute('opacity', String(opacity * 0.5));
      } else {
        tetherRef.current?.setAttribute('opacity', '0');
        tetherGlowRef.current?.setAttribute('opacity', '0');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    update();
    resetIdleTimer();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      window.removeEventListener('mousemove', onMouseMove);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdleTimer]);

  const { progress, vw } = state;
  if (vw === 0) return null;

  const leftPx = progress * (vw - DISPLAY_H);
  const frameIdx = idle ? 0 : Math.floor(leftPx / STEP_PX) % TOTAL_FRAMES;

  return (
    <>
      {/* Spell tether SVG — full viewport, behind sprite */}
      <svg
        className="pointer-events-none fixed inset-0 z-50"
        style={{ width: '100vw', height: '100vh' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="spell-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Glow layer */}
        <line
          ref={tetherGlowRef}
          stroke={SAGE_GREEN}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0}
          filter="url(#spell-glow)"
        />
        {/* Core line */}
        <line
          ref={tetherRef}
          stroke={SAGE_GREEN}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0}
        />
      </svg>

      {/* Walker bar + sprite */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 z-50 w-full"
        style={{ height: DISPLAY_H + 12 }}
      >
        {/* Gold gradient progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[3px] rounded-full"
          style={{
            width: `${progress * 100}%`,
            background: 'var(--gradient-gold)',
          }}
        />

        {/* Mana embers along the progress path */}
        {MANA_POSITIONS.map((pos, i) => {
          if (progress < pos) return null;
          return (
            <div
              key={`ember-${pos}`}
              className="absolute"
              style={{
                left: pos * (vw - DISPLAY_H),
                bottom: 6,
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: `hsl(${MANA_HUES[i]}, 80%, 80%)`,
                boxShadow: `0 0 6px hsl(${MANA_HUES[i]}, 80%, 70%)`,
                animation: 'mana-shimmer 3s ease-in-out infinite',
                animationDelay: `${i * 0.6}s`,
              }}
            />
          );
        })}

        {/* Walking character */}
        <img
          src={FRAME_SRCS[frameIdx]}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            bottom: 4,
            left: leftPx,
            height: DISPLAY_H,
            width: 'auto',
            imageRendering: 'pixelated',
            transform: `rotate(${tilt}deg)`,
            transformOrigin: 'bottom center',
            transition: 'transform 0.3s ease-out',
          }}
        />
      </div>
    </>
  );
}
