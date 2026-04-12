import { Container } from '@/components/primitives/Container';
import { WritingEmptyState } from '@/components/writing/WritingEmptyState';
import type { WritingPost } from '@/lib/schemas/writing';
import { formatDateFull } from '@/lib/utils/format';
import { getMediumPosts } from '@/lib/writing/medium';
import { BookOpen, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Accent colors (amber/gold to match site theme)                     */
/* ------------------------------------------------------------------ */

const ACCENT = 'text-[var(--color-accent)]';
const ACCENT_BG = 'bg-amber-50';
const ACCENT_HOVER = 'hover:text-[var(--color-accent-hi)]';

/* ------------------------------------------------------------------ */
/*  Featured article card (left column — large with image hero)        */
/* ------------------------------------------------------------------ */

function FeaturedCard({ post }: { post: WritingPost }) {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-3xl border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-lg focus-visible:outline-none"
    >
      {/* Image area with gradient overlay */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <BookOpen size={48} />
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Overlay text */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/80">
            {post.tags[0] && (
              <>
                <span className="font-medium uppercase tracking-wider">{post.tags[0]}</span>
                <span className="text-white/40">·</span>
              </>
            )}
            <span>{formatDateFull(post.publishedAt)}</span>
            {post.readingTime && (
              <>
                <span className="text-white/40">·</span>
                <span>{post.readingTime}</span>
              </>
            )}
          </div>
          <h3 className="text-xl font-bold leading-snug text-white md:text-2xl lg:text-[1.65rem]">
            {post.title}
          </h3>
        </div>
      </div>

      {/* White bottom area */}
      <div className="p-6 md:p-8">
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
        <p className={`mt-4 text-sm font-medium ${ACCENT} ${ACCENT_HOVER} transition-colors`}>
          Read featured article →
        </p>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Standard article card (right column — compact)                     */
/* ------------------------------------------------------------------ */

function StandardCard({ post }: { post: WritingPost }) {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg focus-visible:outline-none"
    >
      {/* Top row: category + date */}
      <div className="mb-3 flex items-center gap-3">
        {post.tags[0] && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-gray-500">
            {post.tags[0]}
          </span>
        )}
        <span className="text-[11px] uppercase tracking-wider text-gray-400">
          {formatDateFull(post.publishedAt)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-[var(--color-accent)]">
        {post.title}
      </h3>

      {/* Summary */}
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">{post.excerpt}</p>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        {post.readingTime && (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock size={13} />
            {post.readingTime}
          </span>
        )}
        <span className={`text-sm font-medium ${ACCENT} ${ACCENT_HOVER} transition-colors`}>
          Read →
        </span>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export async function WritingSection() {
  const posts = (await getMediumPosts()).slice(0, 3);

  if (posts.length === 0) {
    return (
      <section id="writing" aria-label="Latest writing" className="relative py-24 md:py-32">
        <Container>
          <WritingEmptyState />
        </Container>
      </section>
    );
  }

  const featured = posts[0];
  const side = posts.slice(1, 3);

  return (
    <section
      id="writing"
      aria-label="Latest writing"
      className="relative py-24 pb-8 md:py-32 md:pb-12"
    >
      <Container>
        {/* ---- Header ---- */}
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {/* Badge */}
            <span
              className={`mb-4 inline-flex items-center gap-2 rounded-full ${ACCENT_BG} px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${ACCENT}`}
            >
              <BookOpen size={14} />
              Latest Writing
            </span>

            {/* Heading */}
            <h2 className="mt-3 text-[length:var(--text-h2)] font-bold leading-[1.1] tracking-tight text-gray-900">
              Articles, Journals, <span className={ACCENT}>&amp; More</span>
            </h2>

            {/* Subheading */}
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Fresh notes on Computer Science, Philosophy, and Life — from the lens of an aspiring
              software engineer and curious explorer.
            </p>
          </div>

          {/* CTA button */}
          <Link
            href="/writing"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-6 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-[var(--color-accent-glow)] hover:text-[var(--color-accent)]"
          >
            Explore All Blogs →
          </Link>
        </div>

        {/* ---- Grid ---- */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Left: featured */}
          <FeaturedCard post={featured} />

          {/* Right: stacked standard cards */}
          {side.length > 0 && (
            <div className="flex flex-col gap-6">
              {side.map((post) => (
                <StandardCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
