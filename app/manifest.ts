import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Brian Cao',
    short_name: 'Brian Cao',
    description: 'Full-stack engineer building systems at the edge of software and AI.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0a08',
    theme_color: '#0b0a08',
    icons: [{ src: '/icon', sizes: '32x32', type: 'image/png' }],
  };
}
