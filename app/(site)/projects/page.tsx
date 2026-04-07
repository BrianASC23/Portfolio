import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { Section } from '@/components/primitives/Section';
import { ProjectCard } from '@/components/project/ProjectCard';
import { getAllProjects } from '@/lib/content/projects';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Every project Brian Cao has shipped or is actively building.',
};

export default function ProjectsIndexPage() {
  const projects = getAllProjects();

  return (
    <Section
      id="projects-index"
      eyebrow="Projects"
      title="Everything I've built"
      description="Shipped work, research projects, and things I'm still figuring out."
    >
      <StaggerGroup className="grid gap-8 md:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </StaggerGroup>
    </Section>
  );
}
