import { WorkPage } from '@/components/work/WorkPage';
import { getAllProjects } from '@/lib/content/projects';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'A curated gallery of projects spanning AI, distributed systems, and creative engineering.',
};

export default function ProjectsIndexPage() {
  const projects = getAllProjects();

  return <WorkPage projects={projects} />;
}
