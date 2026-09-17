import { BackToTop } from '@/components/BackToTop';
import { CommandPaletteLazy } from '@/components/nav/CommandPaletteLazy';
import { Footer } from '@/components/nav/Footer';
import { TopBar } from '@/components/nav/TopBar';
import { StructuredData } from '@/components/seo/StructuredData';
import type { ReactNode } from 'react';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StructuredData />
      <TopBar />
      <CommandPaletteLazy />
      <main id="main" className="relative z-10 pt-14">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
