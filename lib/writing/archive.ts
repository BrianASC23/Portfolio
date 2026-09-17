import type { WritingPost } from '@/lib/schemas/writing';

export interface MonthBucket {
  /** `YYYY-MM`, in UTC so a post never lands in a different month per viewer. */
  key: string;
  label: string;
  count: number;
}

function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

function monthLabel(key: string): string {
  return new Date(`${key}-01T00:00:00.000Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Post counts per month, newest month first — the "Browse by date" list. */
export function groupPostsByMonth(posts: readonly WritingPost[]): MonthBucket[] {
  const counts = new Map<string, number>();
  for (const { publishedAt } of posts) {
    const key = monthKey(publishedAt);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, count]) => ({ key, label: monthLabel(key), count }));
}

/** Posts from one month, or all of them when no month is selected. */
export function filterPostsByMonth(
  posts: readonly WritingPost[],
  month: string | null,
): WritingPost[] {
  return month ? posts.filter((p) => monthKey(p.publishedAt) === month) : [...posts];
}

/** Medium-style byline date: "Apr 5" this year, "Sep 20, 2025" otherwise. */
export function formatPostDate(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const sameYear = date.getUTCFullYear() === now.getUTCFullYear();
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric',
    timeZone: 'UTC',
  });
}
