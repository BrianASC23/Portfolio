'use client';

import { fontMono } from '@/app/fonts';
import { PixelArrow } from '@/components/ui/PixelArrow';
import type { Project } from '@/lib/schemas/project';
import { useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { TypeLine } from './TypeLine';

/** Expo-out, matching the retro menu so the page shares one motion language. */
const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

/** L-shaped bracket, one per corner, like a targeting reticle. */
function Bracket({ at }: { at: 'tl' | 'tr' | 'bl' | 'br' }) {
  const edges = {
    tl: 'top-2 left-2 border-t-2 border-l-2',
    tr: 'top-2 right-2 border-t-2 border-r-2',
    bl: 'bottom-2 left-2 border-b-2 border-l-2',
    br: 'bottom-2 right-2 border-b-2 border-r-2',
  }[at];

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-4 w-4 border-[var(--color-accent)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${edges}`}
    />
  );
}

/** Where a project's title and screen point: its repo or live site, else the case study. */
function projectHref(project: Project): string {
  return project.links.github ?? project.links.live ?? `/projects/${project.slug}`;
}

/**
 * One project as a 50/50 row: copy on the left, screen on the right. The title
 * and screen are both the link — there is no separate call-to-action button.
 *
 * The two halves arrive from opposite sides as the row scrolls into view, so
 * they meet in the middle rather than sliding in parallel. The tagline types
 * itself out.
 */
export function ProjectRow({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });

  const image = project.homeCover ?? project.cover.src;
  const href = projectHref(project);
  const splitAt = project.title.lastIndexOf(' ') + 1;
  const titleHead = project.title.slice(0, splitAt);
  const titleTail = project.title.slice(splitAt);
  const external = href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {};

  const enter = (name: string, delay: number) =>
    inView ? { animation: `${name} 0.7s ${EASING} ${delay}s both` } : { opacity: 0 };

  return (
    <article ref={ref} className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
      <div style={enter('project-in-left', 0.05)}>
        <h3 className="font-serif text-2xl font-bold leading-tight tracking-[-0.02em] text-[var(--color-fg)] md:text-3xl">
          <Link
            href={href}
            {...external}
            className="group/title inline decoration-[var(--color-accent)] decoration-2 underline-offset-[6px] transition-colors hover:text-[var(--color-accent)] hover:underline"
          >
            {titleHead}
            {/* Last word and arrow can't be split, so the arrow never wraps alone */}
            <span className="whitespace-nowrap">
              {titleTail}
              <span className="ml-2 inline-flex translate-y-[-0.1em] align-middle text-[var(--color-accent)] opacity-0 transition-[opacity,translate] duration-300 group-hover/title:translate-x-1 group-hover/title:opacity-100">
                <PixelArrow className="h-4 w-2" />
              </span>
            </span>
          </Link>
        </h3>

        {/* Dialogue-box line: types itself out, then keeps a caret blinking */}
        <TypeLine
          text={project.tagline}
          inView={inView}
          startDelay={0.35}
          className={`mt-3 text-base text-[var(--color-fg-muted)] ${fontMono.className}`}
        />

        <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
          {project.summary}
        </p>

        {project.bullets.length > 0 && (
          <ul className="mt-5 flex list-none flex-col gap-2.5">
            {project.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex gap-2.5 text-sm leading-relaxed text-[var(--color-fg-muted)]"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[var(--color-accent)]"
                  aria-hidden="true"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        {project.stack.length > 0 && (
          <ul className="mt-5 flex list-none flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className={`border border-[var(--color-border)] px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)] ${fontMono.className}`}
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Screen: hard pixel shadow, scanline wash, reticle brackets on hover */}
      <Link
        href={href}
        {...external}
        aria-label={`${project.title} — view project`}
        className="group relative block aspect-[16/10] overflow-hidden border-2 border-[var(--color-menu-ink)] bg-[var(--color-bg-inset)]"
        style={{
          boxShadow: '6px 6px 0px var(--color-menu-ink)',
          ...enter('project-in-right', 0.12),
        }}
      >
        <Image
          src={image}
          alt={project.cover.alt}
          fill
          sizes="(min-width: 768px) 46vw, 92vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, rgba(20,22,26,0.16) 0 1px, transparent 1px 3px)',
          }}
        />
        <Bracket at="tl" />
        <Bracket at="tr" />
        <Bracket at="bl" />
        <Bracket at="br" />
      </Link>
    </article>
  );
}
