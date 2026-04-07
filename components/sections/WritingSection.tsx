import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/primitives/Button';
import { Section } from '@/components/primitives/Section';
import { formatDate } from '@/lib/utils/format';
import { getMediumPosts } from '@/lib/writing/medium';
import Image from 'next/image';
import Link from 'next/link';

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
        <p className="text-[var(--color-fg-muted)]">
          No posts yet — check back soon, or{' '}
          <Link
            href="https://medium.com/@brianc40722"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] hover:underline"
          >
            read on Medium
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-[var(--color-border)]">
          {posts.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.06} as="li">
              <Link
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-5 py-8 md:flex-row md:items-center"
              >
                {post.thumbnail && (
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg border border-[var(--color-border)] md:w-48">
                    <Image
                      src={post.thumbnail}
                      alt=""
                      fill
                      sizes="192px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="mb-2 font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]">
                    {formatDate(post.publishedAt)} · {post.readingTime ?? '—'}
                  </p>
                  <h3 className="font-serif text-2xl text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)]">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[var(--color-fg-muted)] text-sm">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </ul>
      )}
      <div className="mt-10 flex justify-center">
        <Button href="/writing" variant="secondary">
          Read all writing →
        </Button>
      </div>
    </Section>
  );
}
