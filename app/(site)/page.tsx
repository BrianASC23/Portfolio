import { HomeHero } from '@/components/hero/HomeHero';
import { AboutSection } from '@/components/sections/AboutSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { SelectedWorkSection } from '@/components/sections/SelectedWorkSection';
import { ToolbeltSection } from '@/components/sections/ToolbeltSection';
import { WritingSection } from '@/components/sections/WritingSection';
import { getAllExperiences } from '@/lib/content/experience';

export const revalidate = 3600;

export default function HomePage() {
  const experiences = getAllExperiences();

  return (
    <>
      <HomeHero />
      <AboutSection />
      <ToolbeltSection />
      <SelectedWorkSection />
      <ExperienceSection experiences={experiences} />
      <WritingSection />
    </>
  );
}
