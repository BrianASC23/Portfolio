import { parseMediumFeed } from '@/lib/writing/medium';
import { describe, expect, it } from 'vitest';

const fixture = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Brian Cao on Medium</title>
    <item>
      <title>How I built a RAG agent</title>
      <link>https://medium.com/@brianc40722/how-i-built-a-rag-agent-abc123</link>
      <guid>https://medium.com/p/abc123</guid>
      <pubDate>Tue, 01 Apr 2026 12:00:00 GMT</pubDate>
      <content:encoded><![CDATA[<p>This is a story about RAG agents. It covers retrieval, grounding, and evaluation in depth.</p>]]></content:encoded>
      <category>ai</category>
      <category>rag</category>
    </item>
  </channel>
</rss>`;

describe('parseMediumFeed', () => {
  it('parses items into WritingPost objects', () => {
    const posts = parseMediumFeed(fixture);
    expect(posts).toHaveLength(1);
    expect(posts[0]?.title).toBe('How I built a RAG agent');
    expect(posts[0]?.tags).toContain('rag');
    expect(posts[0]?.excerpt.length).toBeGreaterThan(0);
  });
});
