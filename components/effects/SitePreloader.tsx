'use client';

import Loader from '@/components/ui/3d-box-loader-animation';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const LOADER_DURATION = 2400;
const INITIAL_DURATION = 3200;

export function SitePreloader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const isFirstLoad = useRef(true);
  const prevPathname = useRef(pathname);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      isFirstLoad.current = false;
    }, INITIAL_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // Subsequent navigations
  useEffect(() => {
    if (isFirstLoad.current) return;
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    setVisible(true);
    const timer = setTimeout(() => setVisible(false), LOADER_DURATION);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="site-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-12 bg-[var(--color-bg)]"
        >
          <Loader maskColor="#ffffff" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]"
          >
            Loading
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
