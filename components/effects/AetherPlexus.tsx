'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  Tuning knobs                                                       */
/* ------------------------------------------------------------------ */

const PARTICLE_COUNT = 90;
const MANA_COUNT = 6;
const CONNECTION_DIST = 130;
const CURSOR_RADIUS = 160;
const SAGE = { r: 74, g: 222, b: 160 }; // deeper #4ade a0 — more visible on white

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  gray: number; // 224 | 240
}

interface ManaEmber {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
  phase: number;
}

/* ------------------------------------------------------------------ */
/*  Factory helpers (deterministic seed to avoid hydration mismatches)  */
/* ------------------------------------------------------------------ */

function seed(i: number, salt: number): number {
  const x = Math.sin(i * 9301 + salt * 49297) * 49979;
  return x - Math.floor(x);
}

function makeParticles(w: number, h: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    x: seed(i, 1) * w,
    y: seed(i, 2) * h,
    vx: (seed(i, 3) - 0.5) * 0.3,
    vy: (seed(i, 4) - 0.5) * 0.3,
    r: 1.5 + seed(i, 5) * 1.5,
    alpha: 0.4 + seed(i, 6) * 0.3,
    gray: seed(i, 7) > 0.5 ? 180 : 160,
  }));
}

function makeMana(w: number, h: number): ManaEmber[] {
  return Array.from({ length: MANA_COUNT }, (_, i) => ({
    x: seed(i, 10) * w,
    y: h - seed(i, 11) * 80,
    vx: (seed(i, 12) - 0.5) * 0.2,
    vy: -(seed(i, 13) * 0.3 + 0.1),
    hue: seed(i, 14) * 360,
    phase: seed(i, 15) * Math.PI * 2,
  }));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AetherPlexus() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const mouse = useRef({ x: -9999, y: -9999 });
  const particles = useRef<Particle[]>([]);
  const mana = useRef<ManaEmber[]>([]);

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let animId = 0;

    /* ---- Sizing ---- */
    function resize() {
      if (!canvas || !ctx) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particles.current.length === 0) {
        particles.current = makeParticles(w, h);
        mana.current = makeMana(w, h);
      }
    }

    /* ---- Mouse (window-level since canvas is pointer-events:none) ---- */
    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onMouseLeave() {
      mouse.current = { x: -9999, y: -9999 };
    }

    /* ---- Draw loop ---- */
    function draw(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      const pts = particles.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const cursorActive = mx > -1000 && my > -1000;

      /* Update + draw particles */
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const dm = cursorActive ? Math.hypot(p.x - mx, p.y - my) : Number.POSITIVE_INFINITY;
        const near = dm < CURSOR_RADIUS;

        if (near) {
          const t = 1 - dm / CURSOR_RADIUS;
          ctx.fillStyle = `rgba(${SAGE.r},${SAGE.g},${SAGE.b},${0.5 + t * 0.4})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + t * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${p.gray},${p.gray},${p.gray},${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* Inter-particle connections */
      for (let i = 0; i < pts.length; i++) {
        const pi = pts[i];
        if (!pi) continue;
        for (let j = i + 1; j < pts.length; j++) {
          const pj = pts[j];
          if (!pj) continue;
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > CONNECTION_DIST) continue;

          const midX = (pi.x + pj.x) / 2;
          const midY = (pi.y + pj.y) / 2;
          const dm = cursorActive ? Math.hypot(midX - mx, midY - my) : Number.POSITIVE_INFINITY;
          const near = dm < CURSOR_RADIUS;
          const fade = 1 - dist / CONNECTION_DIST;

          if (near) {
            const t = 1 - dm / CURSOR_RADIUS;
            ctx.strokeStyle = `rgba(${SAGE.r},${SAGE.g},${SAGE.b},${fade * (0.3 + t * 0.5)})`;
            ctx.lineWidth = 1 + t * 1;
          } else {
            ctx.strokeStyle = `rgba(160,160,160,${fade * 0.18})`;
            ctx.lineWidth = 0.6;
          }

          ctx.beginPath();
          ctx.moveTo(pi.x, pi.y);
          ctx.lineTo(pj.x, pj.y);
          ctx.stroke();
        }
      }

      /* Cursor-to-particle tendrils (spell scribing) */
      if (cursorActive) {
        for (const p of pts) {
          const d = Math.hypot(p.x - mx, p.y - my);
          if (d >= CURSOR_RADIUS) continue;
          const t = 1 - d / CURSOR_RADIUS;
          ctx.strokeStyle = `rgba(${SAGE.r},${SAGE.g},${SAGE.b},${t * 0.55})`;
          ctx.lineWidth = 0.6 + t * 1.2;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }

        /* Cursor glow */
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 30);
        grad.addColorStop(0, `rgba(${SAGE.r},${SAGE.g},${SAGE.b},0.25)`);
        grad.addColorStop(1, `rgba(${SAGE.r},${SAGE.g},${SAGE.b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, 30, 0, Math.PI * 2);
        ctx.fill();
      }

      /* Mana embers */
      const embers = mana.current;
      for (const e of embers) {
        e.x += e.vx;
        e.y += e.vy;
        e.phase += 0.02;

        if (e.y < 0 || e.x < 0 || e.x > w) {
          e.x = seed(Math.floor(time) % 100, 20) * w;
          e.y = h;
          e.vy = -(seed(Math.floor(time) % 100, 21) * 0.3 + 0.1);
        }

        const nearBottom = e.y > h - 100;
        const nearMouse = cursorActive && Math.hypot(e.x - mx, e.y - my) < CURSOR_RADIUS;
        if (!nearBottom && !nearMouse) continue;

        const alpha = 0.4 + 0.3 * Math.sin(e.phase);
        const hue = (e.hue + time * 0.01) % 360;

        // Glow ring
        ctx.fillStyle = `hsla(${hue},80%,60%,${alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        ctx.fillStyle = `hsla(${hue},90%,70%,${alpha})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    /* ---- Setup ---- */
    const ro = new ResizeObserver(resize);
    const parent = canvas.parentElement;
    if (!parent) return;
    ro.observe(parent);
    resize();

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [reduced]);

  if (reduced) return null;

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />;
}
