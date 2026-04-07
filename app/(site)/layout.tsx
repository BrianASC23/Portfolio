import { CommandPaletteLazy } from '@/components/nav/CommandPaletteLazy';
import { Footer } from '@/components/nav/Footer';
import { ScrollProgress } from '@/components/nav/ScrollProgress';
import { TopBar } from '@/components/nav/TopBar';
import { StructuredData } from '@/components/seo/StructuredData';
import type { ReactNode } from 'react';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StructuredData />
      <ScrollProgress />
      <TopBar />
      <CommandPaletteLazy />
      <main id="main" className="pt-14">
        {children}
      </main>
      <Footer />
    </>
  );
}
