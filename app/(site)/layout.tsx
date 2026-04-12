import { BackToTop } from '@/components/BackToTop';
import { ChatBot } from '@/components/ChatBot';
import { ScrollWalker } from '@/components/ScrollWalker';
import { AtmosphericDust } from '@/components/decorations/AtmosphericDust';
import { CustomCursor } from '@/components/effects/CustomCursor';
import { SitePreloader } from '@/components/effects/SitePreloader';
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
      <AtmosphericDust />
      <ScrollWalker />
      <BackToTop />
      <ChatBot />
      <CustomCursor />
      <SitePreloader />
    </>
  );
}
