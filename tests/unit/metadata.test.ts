import { buildMetadata } from '@/lib/seo/metadata';
import { describe, expect, it } from 'vitest';

describe('buildMetadata', () => {
  it('produces absolute og image urls', () => {
    const meta = buildMetadata({
      title: 'Advising Bot',
      description: 'A RAG agent',
      path: '/projects/advising-bot',
    });
    const og = meta.openGraph;
    expect(og?.url).toContain('/projects/advising-bot');
    const images = og && 'images' in og ? og.images : undefined;
    const first = Array.isArray(images) ? images[0] : undefined;
    expect(first).toBeDefined();
  });

  it('builds a canonical url from the path', () => {
    const meta = buildMetadata({ title: 'Home', description: 'Portfolio home', path: '/' });
    expect(meta.alternates?.canonical).toContain('/');
  });
});
