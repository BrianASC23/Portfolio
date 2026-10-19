import { ExperienceTimelineSection } from '@/components/sections/ExperienceTimelineSection';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { StatementHero } from '@/components/sections/StatementHero';

export const revalidate = 3600;

/**
 * Home: the statement, then standing context, then the work. Everything below
 * the fold is supporting evidence — the page has already made its case by the
 * end of the project grid.
 */
export default function HomePage() {
  return (
    <>
      <StatementHero />
      <SelectedWork />
      <ExperienceTimelineSection />
      <SkillsSection />
    </>
  );
}
