import { StaggerGroup } from '@/components/motion/StaggerGroup';
import { Button } from '@/components/primitives/Button';
import { Section } from '@/components/primitives/Section';
import { WritingCard } from '@/components/writing/WritingCard';
import { WritingEmptyState } from '@/components/writing/WritingEmptyState';
import { getMediumPosts } from '@/lib/writing/medium';

export async function WritingSection() {
  const posts = (await getMediumPosts()).slice(0, 3);

  return (
    <Section
      id="writing"
      eyebrow="06 · Writing"
      title="Recent notes"
      description="Long-form notes from Medium. Click through for the full post."
    >
      {posts.length === 0 ? (
        <WritingEmptyState />
      ) : (
        <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <WritingCard key={post.id} post={post} priority={i === 0} />
          ))}
        </StaggerGroup>
      )}
      <div className="mt-10 flex justify-center">
        <Button href="/writing" variant="secondary">
          Read all writing →
        </Button>
      </div>
    </Section>
  );
}
