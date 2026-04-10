import { publicEnv } from '@/lib/env';
import { type WritingPost, writingPostSchema } from '@/lib/schemas/writing';
import { XMLParser } from 'fast-xml-parser';

interface CdataValue {
  __cdata: string;
}

interface RawItem {
  title: string | CdataValue;
  link: string;
  guid: string | { '#text': string };
  pubDate: string;
  'content:encoded'?: string | CdataValue;
  description?: string | CdataValue;
  category?: (string | CdataValue) | (string | CdataValue)[];
}

/** Unwrap `{ __cdata: "..." }` objects produced by fast-xml-parser. */
function unwrapCdata(val: unknown): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object' && '__cdata' in val)
    return String((val as CdataValue).__cdata);
  return '';
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
    const html = unwrapCdata(item['content:encoded']) || unwrapCdata(item.description);
    const rawCategories = Array.isArray(item.category)
      ? item.category
      : item.category
        ? [item.category]
        : [];
    const categories = rawCategories.map(unwrapCdata).filter(Boolean);
    const guid = typeof item.guid === 'string' ? item.guid : (item.guid?.['#text'] ?? item.link);

    return writingPostSchema.parse({
      id: guid,
      title: unwrapCdata(item.title),
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
