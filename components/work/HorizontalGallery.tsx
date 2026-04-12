'use client';

import type { Project } from '@/lib/schemas/project';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface HorizontalGalleryProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

export function HorizontalGallery({ projects, onSelect }: HorizontalGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollRangeRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        scrollRangeRef.current = trackRef.current.scrollWidth - window.innerWidth;
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const x = useTransform(scrollYProgress, (v) => -v * scrollRangeRef.current);

  return (
    <div ref={containerRef} style={{ height: `${(projects.length + 1) * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex gap-8 px-[10vw]">
          {projects.map((project, i) => (
            <GalleryCard
              key={project.slug}
              project={project}
              index={i}
              total={projects.length}
              progress={scrollYProgress}
              onClick={() => onSelect(project)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function GalleryCard({
  project,
  index,
  total,
  progress,
  onClick,
}: {
  project: Project;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  onClick: () => void;
}) {
  const cardStart = index / total;
  const cardEnd = (index + 1) / total;
  const cardMid = (cardStart + cardEnd) / 2;

  const position = useTransform(
    progress,
    [Math.max(0, cardStart - 0.15), cardMid, Math.min(1, cardEnd + 0.15)],
    [-1, 0, 1],
  );

  const skewY = useTransform(position, [-1, 0, 1], [3, 0, -3]);
  const cardScale = useTransform(position, [-1, 0, 1], [0.92, 1, 0.92]);
  const cardOpacity = useTransform(position, [-1, 0, 1], [0.5, 1, 0.5]);

  const isSvg = project.cover.src.endsWith('.svg');

  return (
    <motion.div
      style={{ skewY, scale: cardScale, opacity: cardOpacity }}
      className="group relative h-[75vh] w-[80vw] flex-shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-[#0a1128]"
      onClick={onClick}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {isSvg ? (
        <div className="flex h-full w-full items-center justify-center p-16">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={600}
            height={400}
            className="max-h-[60%] w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
      ) : (
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes="80vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />

      {/* Large index watermark */}
      <div className="pointer-events-none absolute right-8 top-8 z-10 select-none">
        <span className="text-[12rem] font-bold leading-none tracking-tighter text-white/[0.04] md:text-[16rem]">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-8 md:p-12">
        <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-teal-400">
          {project.role}
        </p>
        <h2 className="mb-2 text-5xl font-bold uppercase leading-[0.9] tracking-tighter text-white md:text-7xl lg:text-8xl xl:text-9xl">
          {project.title}
        </h2>
        <p className="mb-4 max-w-xl text-sm leading-relaxed text-white/40">{project.tagline}</p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-teal-400/30 bg-teal-400/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-teal-400"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Hover reveal line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
}
