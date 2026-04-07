import { getProjectSlugs } from '@/lib/content/projects';
import { publicEnv } from '@/lib/env';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/writing`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/resume`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
  const projectRoutes: MetadataRoute.Sitemap = getProjectSlugs().map((slug) => ({
    url: `${base}/projects/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  return [...staticRoutes, ...projectRoutes];
}
