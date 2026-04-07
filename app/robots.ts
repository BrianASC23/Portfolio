import { publicEnv } from '@/lib/env';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
