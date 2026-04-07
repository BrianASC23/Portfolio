import { publicEnv } from '@/lib/env';
import type { Metadata } from 'next';

interface BuildMetadataInput {
  title: string;
  description: string;
  path?: string;
  ogImageQuery?: Record<string, string>;
  type?: 'website' | 'article';
  publishedTime?: string;
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const url = new URL(input.path ?? '/', publicEnv.NEXT_PUBLIC_SITE_URL).toString();
  const ogParams = new URLSearchParams({ title: input.title, ...(input.ogImageQuery ?? {}) });
  const ogImage = `${publicEnv.NEXT_PUBLIC_SITE_URL}/api/og?${ogParams.toString()}`;

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      type: input.type ?? 'website',
      title: input.title,
      description: input.description,
      url,
      siteName: 'Brian Cao',
      images: [{ url: ogImage, width: 1200, height: 630, alt: input.title }],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [ogImage],
    },
  };
}
