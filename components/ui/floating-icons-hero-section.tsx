'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface FloatingIcon {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

interface FloatingIconsHeroSectionProps {
  icons: FloatingIcon[];
  title: string;
  subtitle: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

function FloatingIconElement({
  icon,
  label,
  href,
  index,
  total,
  mouseX,
  mouseY,
  containerRef,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  index: number;
  total: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [hovered, setHovered] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  const angle = (index / total) * 2 * Math.PI;
  const radius = 38;
  const baseX = 50 + radius * Math.cos(angle);
  const baseY = 50 + radius * Math.sin(angle);

  const springConfig = { stiffness: 80, damping: 20, mass: 1.5 };

  const offsetX = useSpring(0, springConfig);
  const offsetY = useSpring(0, springConfig);

  useEffect(() => {
    const unsubX = mouseX.on('change', (latestX: number) => {
      const latestY = mouseY.get();
      if (!containerRef.current || !iconRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const iconRect = iconRef.current.getBoundingClientRect();
      const iconCenterX = iconRect.left + iconRect.width / 2 - rect.left;
      const iconCenterY = iconRect.top + iconRect.height / 2 - rect.top;

      const dx = iconCenterX - latestX;
      const dy = iconCenterY - latestY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const repelRadius = 150;
      if (distance < repelRadius && distance > 0) {
        const force = (1 - distance / repelRadius) * 50;
        offsetX.set((dx / distance) * force);
        offsetY.set((dy / distance) * force);
      } else {
        offsetX.set(0);
        offsetY.set(0);
      }
    });

    return () => unsubX();
  }, [mouseX, mouseY, offsetX, offsetY, containerRef]);

  const x = useTransform(offsetX, (v) => v);
  const y = useTransform(offsetY, (v) => v);

  const innerContent = (
    <motion.div
      className={cn(
        'relative flex h-12 w-12 items-center justify-center rounded-xl',
        'bg-white/80 shadow-lg backdrop-blur-sm',
        'border border-[var(--color-border)]',
        'transition-colors duration-200',
        href && 'cursor-pointer hover:border-[var(--color-accent)]',
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="text-[var(--color-fg-muted)]">{icon}</div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--color-fg)] px-2 py-1 text-xs text-white"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <motion.div
      ref={iconRef}
      className="absolute"
      style={{
        left: `${baseX}%`,
        top: `${baseY}%`,
        x,
        y,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block">
          {innerContent}
        </a>
      ) : (
        innerContent
      )}
    </motion.div>
  );
}

export function FloatingIconsHeroSection({
  icons,
  title,
  subtitle,
  description,
  action,
  className,
}: FloatingIconsHeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(-1000);
        mouseY.set(-1000);
      }}
      className={cn(
        'relative flex min-h-[500px] w-full items-center justify-center overflow-hidden',
        className,
      )}
    >
      {/* Floating icons */}
      {icons.map((icon, i) => (
        <FloatingIconElement
          key={icon.label}
          icon={icon.icon}
          label={icon.label}
          href={icon.href}
          index={i}
          total={icons.length}
          mouseX={mouseX}
          mouseY={mouseY}
          containerRef={containerRef}
        />
      ))}

      {/* Center content */}
      <div className="relative z-10 text-center max-w-lg px-4">
        <motion.p
          className="mb-2 text-sm font-mono uppercase tracking-wider text-[var(--color-accent)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
        <motion.h2
          className="font-serif text-[length:var(--text-h2)] font-light leading-[1.05] tracking-[-0.02em] text-[var(--color-fg)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="mt-4 text-[var(--color-fg-muted)] leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {description}
        </motion.p>
        {action && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {action}
          </motion.div>
        )}
      </div>
    </div>
  );
}
