import type { WritingPost } from '@/lib/schemas/writing';
import { filterPostsByMonth, formatPostDate, groupPostsByMonth } from '@/lib/writing/archive';
import { describe, expect, it } from 'vitest';

function post(id: string, publishedAt: string): WritingPost {
  return {
    id,
    title: `Post ${id}`,
    excerpt: 'Excerpt',
    publishedAt,
    link: `https://medium.com/p/${id}`,
    tags: [],
  };
}

const posts = [
  post('a', '2026-04-05T12:00:00.000Z'),
  post('b', '2025-09-01T12:00:00.000Z'),
  post('c', '2026-04-02T12:00:00.000Z'),
  post('d', '2025-09-20T12:00:00.000Z'),
  post('e', '2025-10-11T12:00:00.000Z'),
];

describe('groupPostsByMonth', () => {
  it('counts posts per month, newest month first', () => {
    expect(groupPostsByMonth(posts)).toEqual([
      { key: '2026-04', label: 'April 2026', count: 2 },
      { key: '2025-10', label: 'October 2025', count: 1 },
      { key: '2025-09', label: 'September 2025', count: 2 },
    ]);
  });

  it('returns an empty list when there are no posts', () => {
    expect(groupPostsByMonth([])).toEqual([]);
  });
});

describe('filterPostsByMonth', () => {
  it('keeps only posts from the given month', () => {
    expect(filterPostsByMonth(posts, '2025-09').map((p) => p.id)).toEqual(['b', 'd']);
  });

  it('returns every post when no month is selected', () => {
    expect(filterPostsByMonth(posts, null)).toHaveLength(posts.length);
  });
});

describe('formatPostDate', () => {
  const now = new Date('2026-06-01T00:00:00.000Z');

  it('omits the year for posts from the current year', () => {
    expect(formatPostDate('2026-04-05T12:00:00.000Z', now)).toBe('Apr 5');
  });

  it('includes the year for older posts', () => {
    expect(formatPostDate('2025-09-20T12:00:00.000Z', now)).toBe('Sep 20, 2025');
  });
});
