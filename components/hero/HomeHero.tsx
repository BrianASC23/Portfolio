import { getFeaturedProjects } from '@/lib/content/projects';
import { BentoHero } from './BentoHero';

export function HomeHero() {
  const projects = getFeaturedProjects();
  const featured = projects[0];
  const featuredProject = featured
    ? { title: featured.title, tagline: featured.tagline, tech: featured.stack.slice(0, 2) }
    : undefined;

  return (
    <section id="hero" aria-label="Introduction">
      <BentoHero featuredProject={featuredProject} />
    </section>
  );
}
