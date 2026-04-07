import { CursorLayer } from '@/components/cursor/CursorLayer';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';
import { CommandPalette } from '@/components/nav/CommandPalette';
import { Footer } from '@/components/nav/Footer';
import { ScrollProgress } from '@/components/nav/ScrollProgress';
import { TopBar } from '@/components/nav/TopBar';
import type { ReactNode } from 'react';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <TopBar />
      <CursorLayer />
      <CommandPalette />
      <main id="main" className="pt-14">
        {children}
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
