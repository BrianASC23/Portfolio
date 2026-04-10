'use client';

import { Section } from '@/components/primitives/Section';
import { duration, ease, stagger } from '@/lib/motion';
import { motion, useReducedMotion } from 'framer-motion';
import type { IconType } from 'react-icons';
import { FaAws } from 'react-icons/fa6';
import {
  SiAngular,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiGraphql,
  SiNestjs,
  SiNextdotjs,
  SiPostgresql,
  SiReact,
} from 'react-icons/si';

interface Tool {
  name: string;
  icon: IconType;
  brandColor: string;
}

const tools: Tool[] = [
  { name: 'FastAPI', icon: SiFastapi, brandColor: '#009688' },
  { name: 'Express', icon: SiExpress, brandColor: '#000000' },
  { name: 'NestJS', icon: SiNestjs, brandColor: '#E0234E' },
  { name: 'PostgreSQL', icon: SiPostgresql, brandColor: '#4169E1' },
  { name: 'GraphQL', icon: SiGraphql, brandColor: '#E10098' },
  { name: 'Angular', icon: SiAngular, brandColor: '#DD0031' },
  { name: 'Next.js', icon: SiNextdotjs, brandColor: '#000000' },
  { name: 'React Native', icon: SiReact, brandColor: '#61DAFB' },
  { name: 'Docker', icon: SiDocker, brandColor: '#2496ED' },
  { name: 'AWS', icon: FaAws, brandColor: '#FF9900' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger.base },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
};

export function ToolbeltSection() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Section
        id="toolbelt"
        title="Toolbelt"
        description="The short list of things I've used in production or research."
        containerSize="wide"
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3 lg:grid-cols-5">
          {tools.map((tool) => (
            <ToolPill key={tool.name} tool={tool} />
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section
      id="toolbelt"
      title="Toolbelt"
      description="The short list of things I've used in production or research."
      containerSize="wide"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10% 0px' }}
        variants={containerVariants}
        className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3 lg:grid-cols-5"
      >
        {tools.map((tool) => (
          <motion.div
            key={tool.name}
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              y: -2,
              boxShadow: '0 0 20px rgba(37, 99, 235, 0.1)',
              transition: { duration: duration.fast, ease: ease.out },
            }}
            className="flex cursor-default items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-inset)] px-6 py-4 shadow-sm"
          >
            <tool.icon className="size-5 shrink-0" style={{ color: tool.brandColor }} />
            <span className="text-sm font-medium text-[var(--color-fg)]">{tool.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function ToolPill({ tool }: { tool: Tool }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-inset)] px-6 py-4 shadow-sm">
      <tool.icon className="size-5 shrink-0" style={{ color: tool.brandColor }} />
      <span className="text-sm font-medium text-[var(--color-fg)]">{tool.name}</span>
    </div>
  );
}
