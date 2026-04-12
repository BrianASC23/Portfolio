'use client';

import { Container } from '@/components/primitives/Container';
import { GitHubIcon, LeetCodeIcon, LinkedInIcon, XIcon } from '@/components/primitives/SocialIcons';
import { ContactForm } from '@/components/sections/ContactForm';
import { MorphingText } from '@/components/ui/liquid-text';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, FileText, Mail, Phone } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Icon config — positions, colors, float timing                      */
/* ------------------------------------------------------------------ */

const CONTACT_EMAIL = 'brianc40722@gmail.com';

const MORPH_WORDS = [
  'Build',
  'Create',
  'Ship',
  'Deploy',
  'Craft',
  'Forge',
  'Launch',
  'Solve',
  'Code',
  'Imagine',
];

interface FloatingIconConfig {
  icon: React.ReactNode;
  label: string;
  href: string;
  color: string;
  glowColor: string;
  top: string;
  left?: string;
  right?: string;
  /** CSS animation-duration for the float, e.g. "5s" */
  floatDuration: string;
  /** CSS animation-delay for stagger, e.g. "-1.2s" */
  floatDelay: string;
}

const FLOATING_ICONS: FloatingIconConfig[] = [
  {
    icon: <Mail size={22} />,
    label: 'Email',
    href: `mailto:${CONTACT_EMAIL}`,
    color: '#F59E0B',
    glowColor: 'rgba(245,158,11,0.35)',
    top: '8%',
    left: '18%',
    floatDuration: '5.4s',
    floatDelay: '0s',
  },
  {
    icon: <GitHubIcon />,
    label: 'GitHub',
    href: 'https://github.com/BrianASC23',
    color: '#333333',
    glowColor: 'rgba(51,51,51,0.25)',
    top: '5%',
    right: '22%',
    floatDuration: '6.2s',
    floatDelay: '-1.8s',
  },
  {
    icon: <LinkedInIcon />,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/brian-cao-cs',
    color: '#0A66C2',
    glowColor: 'rgba(10,102,194,0.35)',
    top: '30%',
    left: '14%',
    floatDuration: '5.8s',
    floatDelay: '-3.1s',
  },
  {
    icon: <XIcon />,
    label: 'X / Twitter',
    href: 'https://x.com/BrianAmongStars',
    color: '#14171A',
    glowColor: 'rgba(20,23,26,0.2)',
    top: '26%',
    right: '16%',
    floatDuration: '6.6s',
    floatDelay: '-0.7s',
  },
  {
    icon: <LeetCodeIcon />,
    label: 'LeetCode',
    href: 'https://leetcode.com/settings/profile/',
    color: '#FFA116',
    glowColor: 'rgba(255,161,22,0.35)',
    top: '52%',
    left: '16%',
    floatDuration: '5.2s',
    floatDelay: '-2.4s',
  },
  {
    icon: <Phone size={22} />,
    label: 'Phone',
    href: 'tel:9292896597',
    color: '#22C55E',
    glowColor: 'rgba(34,197,94,0.35)',
    top: '50%',
    right: '14%',
    floatDuration: '7s',
    floatDelay: '-4.2s',
  },
  {
    icon: <FileText size={22} />,
    label: 'Resume',
    href: '/resume/BrianCao-Resume.pdf',
    color: '#EF4444',
    glowColor: 'rgba(239,68,68,0.3)',
    top: '74%',
    left: '18%',
    floatDuration: '6s',
    floatDelay: '-1.5s',
  },
  {
    icon: <BookOpen size={22} />,
    label: 'Medium',
    href: 'https://medium.com/@brianc40722',
    color: '#1A8917',
    glowColor: 'rgba(26,137,23,0.3)',
    top: '72%',
    right: '18%',
    floatDuration: '5.6s',
    floatDelay: '-3.8s',
  },
];

/* ------------------------------------------------------------------ */
/*  Single floating icon                                               */
/* ------------------------------------------------------------------ */

function FloatingIcon({
  config,
  index,
}: {
  config: FloatingIconConfig;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  const posStyle: React.CSSProperties = {
    top: config.top,
    ...(config.left != null ? { left: config.left } : {}),
    ...(config.right != null ? { right: config.right } : {}),
    animation: `icon-float ${config.floatDuration} ease-in-out ${config.floatDelay} infinite`,
  };

  const isExternal =
    !config.href.startsWith('/') &&
    !config.href.startsWith('mailto:') &&
    !config.href.startsWith('tel:');

  return (
    <motion.div
      className="absolute hidden md:block"
      style={posStyle}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: 0.15 + index * 0.08,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      <a
        href={config.href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="block"
      >
        <motion.div
          className={cn(
            'relative flex h-14 w-14 items-center justify-center rounded-full',
            'bg-white shadow-lg',
            'border border-[var(--color-border)]',
            'transition-shadow duration-300',
          )}
          style={{ color: config.color }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          whileHover={{
            scale: 1.18,
            boxShadow: `0 0 0 4px ${config.glowColor}, 0 8px 24px ${config.glowColor}`,
          }}
          whileTap={{ scale: 0.95 }}
        >
          {config.icon}

          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.9 }}
                className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--color-fg)] px-2.5 py-1 text-xs font-medium text-white shadow-md"
              >
                {config.label}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </a>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32"
    >
      {/* Floating icons — absolutely positioned constellation */}
      {FLOATING_ICONS.map((config, i) => (
        <FloatingIcon key={config.label} config={config} index={i} />
      ))}

      {/* Central column — heading + form */}
      <Container size="default">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          {/* Overline */}
          <motion.p
            className="mb-3 text-sm font-mono uppercase tracking-wider text-[var(--color-accent)]"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Send a Raven
          </motion.p>

          {/* Heading with liquid morphing verb */}
          <motion.h2
            className="font-serif text-[length:var(--text-h2)] font-light leading-[1.05] tracking-[-0.02em] text-[var(--color-fg)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          >
            <span className="flex flex-wrap items-baseline justify-center gap-x-[0.3em]">
              <span className="whitespace-nowrap">Let&apos;s</span>
              <MorphingText texts={MORPH_WORDS} className="[&_span]:text-[var(--color-accent)]" />
              <span className="whitespace-nowrap">Something Together</span>
            </span>
          </motion.h2>

          {/* Form card */}
          <motion.div
            className="mt-10 md:mt-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
          >
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 text-left shadow-[var(--shadow-glow-card)] md:p-10">
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
