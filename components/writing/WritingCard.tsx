import { Pill } from '@/components/primitives/Pill';
import type { WritingPost } from '@/lib/schemas/writing';
import { formatDateFull } from '@/lib/utils/format';
import Image from 'next/image';

interface WritingCardProps {
  post: WritingPost;
  priority?: boolean;
}

export function WritingCard({ post, priority = false }: WritingCardProps) {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block focus-visible:outline-none"
      aria-label={post.title}
    >
      <article className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] transition-all duration-300 group-hover:border-[var(--color-accent)] group-hover:shadow-[var(--shadow-card)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-bg-inset)]">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              priority={priority}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-3 p-6">
          {post.tags[0] && <Pill tone="accent">{post.tags[0]}</Pill>}
          <p className="font-mono text-[11px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]">
            {formatDateFull(post.publishedAt)} · {post.readingTime ?? '—'}
          </p>
          <h3 className="font-serif text-xl md:text-2xl text-[var(--color-fg)] leading-tight transition-colors group-hover:text-[var(--color-accent)]">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm text-[var(--color-fg-muted)]">{post.excerpt}</p>
        </div>
      </article>
    </a>
  );
}
