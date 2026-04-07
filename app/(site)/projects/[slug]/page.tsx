import { MDXRenderer } from '@/components/mdx/MDXRenderer';
import { Container } from '@/components/primitives/Container';
import { CaseStudyGallery } from '@/components/project/CaseStudyGallery';
import { CaseStudyHeader } from '@/components/project/CaseStudyHeader';
import { CaseStudyMeta } from '@/components/project/CaseStudyMeta';
import { CaseStudyNav } from '@/components/project/CaseStudyNav';
import { getAllProjects, getProjectMdxBySlug, getProjectSlugs } from '@/lib/content/projects';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const loaded = getProjectMdxBySlug(slug);
  if (!loaded) return {};
  const { project } = loaded;
  return {
    title: project.title,
    description: project.seo.description ?? project.tagline,
    openGraph: {
      title: project.seo.title ?? project.title,
      description: project.seo.description ?? project.tagline,
      images: [project.seo.ogImage ?? `/api/og?slug=${project.slug}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.seo.title ?? project.title,
      description: project.seo.description ?? project.tagline,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const loaded = getProjectMdxBySlug(slug);
  if (!loaded) notFound();
  const { project, body } = loaded;

  const all = getAllProjects();
  const index = all.findIndex((p) => p.slug === slug);
  const previous = index > 0 ? all[index - 1] : undefined;
  const next = index < all.length - 1 ? all[index + 1] : undefined;

  return (
    <article>
      <CaseStudyHeader project={project} />
      <Container size="narrow" className="mt-8">
        <CaseStudyMeta project={project} />
      </Container>
      <Container size="narrow" as="div" className="mt-16">
        <div className="prose-root">
          <MDXRenderer source={body} />
        </div>
      </Container>
      {project.gallery.length > 0 && (
        <Container size="wide" className="mt-8">
          <CaseStudyGallery gallery={project.gallery} />
        </Container>
      )}
      <Container size="narrow">
        <CaseStudyNav previous={previous} next={next} />
      </Container>
    </article>
  );
}
