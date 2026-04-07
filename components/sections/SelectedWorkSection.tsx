import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { Button } from '@/components/primitives/Button';
import { Section } from '@/components/primitives/Section';
import { ProjectCard } from '@/components/project/ProjectCard';
import { getFeaturedProjects } from '@/lib/content/projects';

export function SelectedWorkSection() {
  const projects = getFeaturedProjects();

  return (
    <Section
      id="work"
      eyebrow="03 · Selected Work"
      title={
        <>
          What I've <em className="text-[var(--color-accent)] italic">built</em>
        </>
      }
      description="A handful of things I've built — the ones I'd actually want to walk you through."
    >
      <StaggerGroup className="grid gap-8 md:grid-cols-2" gap="base">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </StaggerGroup>
      <div className="mt-12 flex justify-center">
        <Button href="/projects" variant="secondary">
          See all projects →
        </Button>
      </div>
    </Section>
  );
}
