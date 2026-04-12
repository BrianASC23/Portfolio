'use client';

import { SectionWaypoint } from '@/components/decorations/SectionWaypoint';
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
  lore: string;
}

const tools: Tool[] = [
  {
    name: 'FastAPI',
    icon: SiFastapi,
    brandColor: '#009688',
    lore: 'A serpent-swift framework — conjures REST endpoints in mere incantations.',
  },
  {
    name: 'Express',
    icon: SiExpress,
    brandColor: '#000000',
    lore: 'The venerable middleware forge — reliable as dwarven steel.',
  },
  {
    name: 'NestJS',
    icon: SiNestjs,
    brandColor: '#E0234E',
    lore: 'A fortress of decorators and modules — enterprise-grade alchemy.',
  },
  {
    name: 'PostgreSQL',
    icon: SiPostgresql,
    brandColor: '#4169E1',
    lore: 'The elephant never forgets — ancient relational wisdom.',
  },
  {
    name: 'GraphQL',
    icon: SiGraphql,
    brandColor: '#E10098',
    lore: 'Speak your query and receive exactly what you seek — no more, no less.',
  },
  {
    name: 'Angular',
    icon: SiAngular,
    brandColor: '#DD0031',
    lore: 'A rigid battlemage framework — TypeScript discipline in every spell.',
  },
  {
    name: 'Next.js',
    icon: SiNextdotjs,
    brandColor: '#000000',
    lore: 'The hybrid warframe — renders on server or client at your command.',
  },
  {
    name: 'React Native',
    icon: SiReact,
    brandColor: '#61DAFB',
    lore: 'One codebase to rule both realms — iOS and Android bow as one.',
  },
  {
    name: 'Docker',
    icon: SiDocker,
    brandColor: '#2496ED',
    lore: 'Summons identical golems on any terrain — containment magic.',
  },
  {
    name: 'AWS',
    icon: FaAws,
    brandColor: '#FF9900',
    lore: 'The infinite cloud kingdom — scales beyond mortal reckoning.',
  },
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

export function ToolbeltGrid({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-2 text-[var(--color-fg-subtle)]">
        <SectionWaypoint variant="anvil" />
        <span className="font-serif text-sm italic tracking-wide">The Arsenal</span>
      </div>

      {reduced ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3 lg:grid-cols-5">
          {tools.map((tool) => (
            <ToolPill key={tool.name} tool={tool} />
          ))}
        </div>
      ) : (
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
                boxShadow: '0 0 20px rgba(251, 191, 36, 0.1)',
                transition: { duration: duration.fast, ease: ease.out },
              }}
              className="group relative flex cursor-default items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-inset)] px-6 py-4 shadow-sm"
            >
              <tool.icon className="size-5 shrink-0" style={{ color: tool.brandColor }} />
              <span className="text-sm font-medium text-[var(--color-fg)]">{tool.name}</span>

              {/* RPG lore tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 w-56 -translate-x-1/2 rounded-lg border border-[var(--color-accent)]/30 bg-white px-4 py-3 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                <p className="font-serif text-xs italic leading-relaxed text-[var(--color-fg-muted)]">
                  {tool.lore}
                </p>
                {/* Arrow nub */}
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-[6px] border-transparent border-t-white" />
                <div
                  className="absolute left-1/2 top-full -translate-x-1/2 mt-[-1px] border-[6px] border-transparent border-t-[var(--color-accent)]/30"
                  style={{ marginTop: '1px' }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function ToolPill({ tool }: { tool: Tool }) {
  return (
    <div className="group relative flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-inset)] px-6 py-4 shadow-sm">
      <tool.icon className="size-5 shrink-0" style={{ color: tool.brandColor }} />
      <span className="text-sm font-medium text-[var(--color-fg)]">{tool.name}</span>

      {/* RPG lore tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 w-56 -translate-x-1/2 rounded-lg border border-[var(--color-accent)]/30 bg-white px-4 py-3 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        <p className="font-serif text-xs italic leading-relaxed text-[var(--color-fg-muted)]">
          {tool.lore}
        </p>
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-[6px] border-transparent border-t-white" />
      </div>
    </div>
  );
}
