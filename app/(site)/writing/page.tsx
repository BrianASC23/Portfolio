import { FadeIn } from '@/components/motion/FadeIn';
import { Section } from '@/components/primitives/Section';
import { formatDate } from '@/lib/utils/format';
import { getMediumPosts } from '@/lib/writing/medium';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

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
      containerSize="narrow"
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
            <FadeIn key={post.id} delay={i * 0.04} as="li">
              <Link
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-5 py-8 md:flex-row md:items-start"
              >
                {post.thumbnail && (
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg border border-[var(--color-border)] md:w-56">
                    <Image
                      src={post.thumbnail}
                      alt=""
                      fill
                      sizes="224px"
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
                  <p className="mt-3 line-clamp-3 text-[var(--color-fg-muted)] text-sm">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </ul>
      )}
    </Section>
  );
}
