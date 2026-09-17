'use client';

import type { WritingPost } from '@/lib/schemas/writing';
import { filterPostsByMonth, groupPostsByMonth } from '@/lib/writing/archive';
import { useMemo, useState } from 'react';
import { WritingRow } from './WritingRow';

/**
 * Post list with a "Browse by date" sidebar. Picking a month filters the list
 * in place; picking it again (or "All posts") clears the filter. From `md` up
 * the sidebar sits to the left and stays in view while the list scrolls.
 */
export function WritingArchive({ posts }: { posts: WritingPost[] }) {
  const [month, setMonth] = useState<string | null>(null);

  const months = useMemo(() => groupPostsByMonth(posts), [posts]);
  const visible = useMemo(() => filterPostsByMonth(posts, month), [posts, month]);

  const options = [{ key: null, label: 'All posts', count: posts.length }, ...months];

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-16">
      <nav aria-label="Browse by date">
        <div className="md:sticky md:top-24">
          <h2 className="font-serif text-lg text-[var(--color-fg-subtle)]">Browse By Date</h2>
          <ul className="mt-3 flex list-none flex-wrap gap-x-5 gap-y-1.5 md:flex-col">
            {options.map((option) => {
              const isActive = option.key === month;
              return (
                <li key={option.key ?? 'all'}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setMonth(isActive ? null : option.key)}
                    className="cursor-pointer text-left text-base transition-colors md:text-lg"
                  >
                    <span
                      className={
                        isActive
                          ? 'font-semibold text-[var(--color-accent)]'
                          : 'text-[var(--color-fg)] hover:text-[var(--color-accent)] hover:underline underline-offset-4'
                      }
                    >
                      {option.label}
                    </span>{' '}
                    <span className="text-[var(--color-fg-muted)]">({option.count})</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div>
        {visible.map((post, i) => (
          <WritingRow key={post.id} post={post} priority={i === 0} />
        ))}
      </div>
    </div>
  );
}
