'use client';

import { HorizontalGallery } from '@/components/work/HorizontalGallery';
import { ProjectModal } from '@/components/work/ProjectModal';
import type { Project } from '@/lib/schemas/project';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface WorkPageProps {
  projects: Project[];
}

export function WorkPage({ projects }: WorkPageProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Auto-open project from URL hash (e.g. /projects#advising-bot)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const match = projects.find((p) => p.slug === hash);
    if (match) {
      // Small delay so the page renders first
      const timer = setTimeout(() => setSelectedProject(match), 600);
      return () => clearTimeout(timer);
    }
  }, [projects]);

  return (
    <div data-dark className="-mt-14 min-h-screen bg-[#020617] text-white">
      {/* Hero title section */}
      <section className="flex h-screen flex-col items-center justify-center px-6">
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-teal-400"
        >
          Portfolio &mdash; Selected Work
        </motion.p>
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-7xl font-bold uppercase leading-[0.85] tracking-tighter text-white md:text-8xl lg:text-9xl"
        >
          Selected
          <br />
          <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Work
          </span>
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 max-w-md text-center text-sm leading-relaxed text-white/40"
        >
          Scroll to explore a curated collection of projects spanning AI, distributed systems, and
          creative engineering.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">Scroll</span>
            <div className="h-8 w-[1px] bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Horizontal scroll gallery */}
      <HorizontalGallery projects={projects} onSelect={setSelectedProject} />

      {/* Project count */}
      <div className="flex justify-center border-t border-white/5 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/20">
          {projects.length} Projects
        </p>
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
