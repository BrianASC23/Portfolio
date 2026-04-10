import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { Section } from '@/components/primitives/Section';
import { WritingCard } from '@/components/writing/WritingCard';
import { WritingEmptyState } from '@/components/writing/WritingEmptyState';
import { getMediumPosts } from '@/lib/writing/medium';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Long-form notes and essays by Brian Cao, syndicated from Medium.',
};

export const revalidate = 3600;

export default async function WritingPage() {
  const posts = await getMediumPosts();

  return (
    <Section
      id="writing-index"
      eyebrow="Writing"
      title="Notes & essays"
      description="Originally published on Medium. Full posts live there; previews live here."
    >
      {posts.length === 0 ? (
        <WritingEmptyState />
      ) : (
        <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <WritingCard key={post.id} post={post} />
          ))}
        </StaggerGroup>
      )}
    </Section>
  );
}
