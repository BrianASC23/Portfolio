'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { TreeSilhouette } from './TreeSilhouette';

interface TreeConfig {
  variant: 'pine' | 'oak' | 'birch';
  left?: string;
  right?: string;
  size: string;
}

const trees: TreeConfig[] = [
  { variant: 'pine', left: '5%', size: 'h-32' },
  { variant: 'oak', right: '8%', size: 'h-40' },
  { variant: 'birch', left: '85%', size: 'h-28' },
  { variant: 'pine', right: '20%', size: 'h-36' },
];

export function GhostForest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {trees.map((tree, i) => {
        const style: React.CSSProperties = {
          position: 'absolute',
          bottom: '10%',
          ...(tree.left ? { left: tree.left } : {}),
          ...(tree.right ? { right: tree.right } : {}),
        };

        const content = (
          <TreeSilhouette variant={tree.variant} className={`${tree.size} text-gray-200/30`} />
        );

        if (reduced) {
          return (
            <div key={`${tree.variant}-${tree.left ?? tree.right}`} style={style}>
              {content}
            </div>
          );
        }

        return (
          <motion.div key={`${tree.variant}-${tree.left ?? tree.right}`} style={{ ...style, y }}>
            {content}
          </motion.div>
        );
      })}
    </div>
  );
}
