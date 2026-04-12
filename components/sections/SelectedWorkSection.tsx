import { SectionWaypoint } from '@/components/decorations/SectionWaypoint';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/primitives/Button';
import { Section } from '@/components/primitives/Section';
import { ProjectCard } from '@/components/project/ProjectCard';
import { getFeaturedProjects } from '@/lib/content/projects';

export function SelectedWorkSection() {
  const projects = getFeaturedProjects();

  return (
    <Section
      id="work"
      title={
        <span className="flex items-center gap-3">
          <SectionWaypoint variant="signpost" />
          Major Feats
        </span>
      }
      description="A curated collection of projects that pushed boundaries and shipped real impact — from AI-powered tools to low-level systems work."
      descriptionClassName="drop-cap"
    >
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project, i) => (
          <FadeIn key={project.slug} delay={i * 0.05}>
            <ProjectCard project={project} index={i} />
          </FadeIn>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Button href="/projects" variant="secondary">
          See all projects →
        </Button>
      </div>
    </Section>
  );
}
