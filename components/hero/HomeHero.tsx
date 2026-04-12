import { getFeaturedProjects } from '@/lib/content/projects';
import { getBio } from '@/lib/content/site';
import { BentoHero } from './BentoHero';

export function HomeHero() {
  const projects = getFeaturedProjects();
  const featured = projects[0];
  const featuredProject = featured
    ? { title: featured.title, tagline: featured.tagline, tech: featured.stack.slice(0, 2) }
    : undefined;

  const bio = getBio();

  return (
    <section id="hero" aria-label="Introduction">
      <BentoHero featuredProject={featuredProject} bio={bio} />
    </section>
  );
}
