import { HomeHero } from '@/components/hero/HomeHero';
import { ExperienceTimelineSection } from '@/components/sections/ExperienceTimelineSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';

export const revalidate = 3600;

/**
 * Home: the pinned summit sequence, which ends on the bio card, then projects,
 * experience and skills. Everything else lives on its own route, reached from
 * the top bar.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ProjectsSection />
      <ExperienceTimelineSection />
      <SkillsSection />
    </>
  );
}
