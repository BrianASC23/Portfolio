import { GhostForest } from '@/components/decorations/GhostForest';
import { HomeHero } from '@/components/hero/HomeHero';
import { ContactSection } from '@/components/sections/ContactSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { FeaturedProjectsSection } from '@/components/sections/FeaturedProjectsSection';
import { WritingSection } from '@/components/sections/WritingSection';
import { getAllExperiences } from '@/lib/content/experience';
import { getFeaturedProjects } from '@/lib/content/projects';

export const revalidate = 3600;

export default function HomePage() {
  const experiences = getAllExperiences();
  const projects = getFeaturedProjects();

  return (
    <>
      <HomeHero />
      <div className="relative">
        <GhostForest />
        <FeaturedProjectsSection projects={projects} />
        <ExperienceSection experiences={experiences} />
        <WritingSection />
        <ContactSection />
      </div>
    </>
  );
}
