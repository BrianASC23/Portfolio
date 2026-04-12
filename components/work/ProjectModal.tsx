'use client';

import type { Project } from '@/lib/schemas/project';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo } from 'react';
import { FiExternalLink, FiGithub } from 'react-icons/fi';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const isSvg = project.cover.src.endsWith('.svg');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[60] overflow-y-auto"
      data-dark
      data-lenis-prevent
      style={{
        background: '#020617',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Close button */}
      <div className="sticky top-0 z-[70] flex justify-center py-6">
        <button
          type="button"
          onClick={onClose}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
          aria-label="Close project detail"
        >
          <X size={24} />
        </button>
      </div>

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="mx-auto max-w-5xl px-6 pb-24"
      >
        {/* Hero image */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-white/5">
          {isSvg ? (
            <div className="flex items-center justify-center bg-[#0a1128] p-16">
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                width={600}
                height={400}
                className="max-h-[400px] w-auto object-contain"
              />
            </div>
          ) : (
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              width={1400}
              height={800}
              className="w-full"
            />
          )}
        </div>

        {/* Status badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4"
        >
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${
              project.status === 'in-progress'
                ? 'border-amber-400/30 text-amber-400'
                : project.status === 'shipped'
                  ? 'border-green-400/30 text-green-400'
                  : 'border-white/20 text-white/40'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                project.status === 'in-progress'
                  ? 'bg-amber-400 animate-pulse'
                  : project.status === 'shipped'
                    ? 'bg-green-400'
                    : 'bg-white/40'
              }`}
            />
            {project.status}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-4 text-5xl font-bold uppercase tracking-tight text-white md:text-7xl"
        >
          {project.title}
        </motion.h2>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-2 text-lg font-medium text-amber-400/80"
        >
          {project.tagline}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12 max-w-2xl text-lg leading-relaxed text-white/50"
        >
          {project.summary}
        </motion.p>

        {/* Metadata columns */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12 grid grid-cols-1 gap-8 border-t border-white/10 pt-8 font-mono sm:grid-cols-3"
        >
          <MetaColumn label="Role" value={project.role} />
          <MetaColumn label="Timeframe" value={project.timeframe} />
          <MetaColumn label="Status" value={project.status} />
        </motion.div>

        {/* Metrics */}
        {project.metrics.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mb-12"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-teal-400">Key Metrics</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <p className="mb-1 font-mono text-2xl font-bold text-white">{m.value}</p>
                  <p className="text-xs text-white/40">{m.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tech stack */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-teal-400">Technologies</p>
          <div className="flex flex-wrap gap-3">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-teal-400/20 bg-teal-400/5 px-4 py-2 text-sm text-teal-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Links */}
        {(project.links.github || project.links.live || project.links.demo) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="flex flex-wrap gap-4"
          >
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:border-white/30 hover:bg-white/10"
              >
                <FiGithub size={16} />
                View Source
              </a>
            )}
            {(project.links.live || project.links.demo) && (
              <a
                href={project.links.live ?? project.links.demo ?? ''}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-6 py-3 text-sm font-medium text-amber-400 transition-all hover:border-amber-400/50 hover:bg-amber-400/20"
              >
                <FiExternalLink size={16} />
                Live Demo
              </a>
            )}
          </motion.div>
        )}

        {/* Neon audio visualizer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20"
        >
          <NeonVisualizer />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function MetaColumn({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] uppercase tracking-[0.2em] text-teal-400">{label}</p>
      <p className="text-lg capitalize text-white">{value}</p>
    </div>
  );
}

function NeonVisualizer() {
  const bars = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        minScale: 0.15 + Math.random() * 0.25,
        maxScale: 0.6 + Math.random() * 0.4,
        delay: i * 0.06,
        duration: 0.5 + Math.random() * 0.9,
      })),
    [],
  );

  return (
    <div className="border-t border-white/10 pt-8">
      <p className="mb-6 text-center text-[11px] uppercase tracking-[0.2em] text-white/20">
        Frequency Analysis
      </p>
      <div className="flex items-end justify-center gap-[3px] h-24">
        {bars.map((bar, i) => (
          <div
            key={`bar-${i}-${bar.duration.toFixed(2)}`}
            className="w-1.5 origin-bottom rounded-full"
            style={{
              height: '100%',
              background: 'linear-gradient(to top, #ff00ff, #8b5cf6)',
              animation: `neon-pulse ${bar.duration}s ease-in-out ${bar.delay}s infinite alternate`,
              transform: `scaleY(${bar.minScale})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
