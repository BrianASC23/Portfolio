import { publicEnv } from '@/lib/env';
import { type WritingPost, writingPostSchema } from '@/lib/schemas/writing';
import { XMLParser } from 'fast-xml-parser';

interface RawItem {
  title: string;
  link: string;
  guid: string | { '#text': string };
  pubDate: string;
  'content:encoded'?: string;
  description?: string;
  category?: string | string[];
}

function toExcerpt(html: string, max = 220): string {
  const stripped = html
    .replace(/<figure[\s\S]*?<\/figure>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return stripped.length > max ? `${stripped.slice(0, max).trimEnd()}…` : stripped;
}

function extractFirstImage(html: string): string | undefined {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1];
}

function estimateReadingTime(html: string): string {
  const words = html
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

export function parseMediumFeed(xml: string): WritingPost[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    cdataPropName: '__cdata',
    isArray: (name) => name === 'item' || name === 'category',
  });
  const parsed = parser.parse(xml);
  const items: RawItem[] = parsed?.rss?.channel?.item ?? [];

  return items.map((item) => {
    const contentRaw =
      // biome-ignore lint/suspicious/noExplicitAny: parser variants
      (item['content:encoded'] as any)?.__cdata ??
      item['content:encoded'] ??
      item.description ??
      '';
    const html = typeof contentRaw === 'string' ? contentRaw : '';
    const categories = Array.isArray(item.category)
      ? item.category
      : item.category
        ? [item.category]
        : [];
    const guid = typeof item.guid === 'string' ? item.guid : (item.guid?.['#text'] ?? item.link);

    return writingPostSchema.parse({
      id: guid,
      title: item.title,
      link: item.link,
      publishedAt: new Date(item.pubDate).toISOString(),
      excerpt: toExcerpt(html),
      thumbnail: extractFirstImage(html),
      readingTime: estimateReadingTime(html),
      tags: categories,
    });
  });
}

export async function getMediumPosts(): Promise<WritingPost[]> {
  try {
    const res = await fetch(publicEnv.NEXT_PUBLIC_MEDIUM_FEED, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseMediumFeed(xml);
  } catch {
    return [];
  }
}
