import { Section } from '@/components/primitives/Section';
import { WritingArchive } from '@/components/writing/WritingArchive';
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
      ariaLabel="Writing"
      title="Blogs"
      description="Originally published on Medium."
    >
      {posts.length === 0 ? <WritingEmptyState /> : <WritingArchive posts={posts} />}
    </Section>
  );
}
