import type { WritingPost } from '@/lib/schemas/writing';
import { formatPostDate } from '@/lib/writing/archive';
import Image from 'next/image';

/**
 * One post in the Medium list layout: date, bold title and two-line excerpt on
 * the left, thumbnail on the right. The whole row links out to the full post
 * on Medium.
 */
export function WritingRow({ post, priority = false }: { post: WritingPost; priority?: boolean }) {
  return (
    <article className="border-b border-[var(--color-border)] py-8 first:pt-0 md:py-10">
      <a
        href={post.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group grid grid-cols-[minmax(0,1fr)_6rem] items-start gap-5 focus-visible:outline-none sm:grid-cols-[minmax(0,1fr)_10rem] md:grid-cols-[minmax(0,1fr)_13rem] md:gap-10"
      >
        <div className="min-w-0">
          <p className="text-sm text-[var(--color-fg-muted)]">
            <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          </p>

          <h3 className="mt-3 font-serif text-xl font-bold leading-tight tracking-[-0.02em] text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)] group-focus-visible:text-[var(--color-accent)] md:text-3xl">
            {post.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
            {post.excerpt}
          </p>
        </div>

        <div className="relative mt-8 aspect-[3/2] overflow-hidden rounded-sm bg-[var(--color-bg-inset)]">
          {post.thumbnail && (
            <Image
              src={post.thumbnail}
              alt=""
              fill
              sizes="(min-width: 768px) 208px, (min-width: 640px) 160px, 96px"
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
        </div>
      </a>
    </article>
  );
}
