import { getAllProjects } from '@/lib/content/projects';
import { publicEnv } from '@/lib/env';
import { getMediumPosts } from '@/lib/writing/medium';

export const revalidate = 3600;

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const now = new Date().toUTCString();

  const projectItems = getAllProjects().map(
    (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${base}/projects/${p.slug}</link>
      <guid>${base}/projects/${p.slug}</guid>
      <description>${escapeXml(p.tagline)}</description>
      <pubDate>${now}</pubDate>
    </item>
  `,
  );

  const mediumItems = (await getMediumPosts()).map(
    (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(post.link)}</link>
      <guid>${escapeXml(post.id)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>
  `,
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Brian Cao</title>
    <link>${base}</link>
    <description>Projects and writing from Brian Cao — full-stack engineer.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    ${projectItems.join('')}${mediumItems.join('')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
