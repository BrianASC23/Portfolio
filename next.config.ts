import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    /**
     * Biome is this project's linter — `pnpm lint` runs `biome check .`, and it
     * gates commits through lint-staged. The ESLint config here is vestigial
     * and does not load against the flat-config shape eslint-config-next now
     * ships, so letting the build run it only prints an error on every build
     * and in CI. Lint runs as its own step, not as a side effect of building.
     */
    ignoreDuringBuilds: true,
  },
  experimental: {
    // `@react-three/drei` was listed here for a 3D hero that was never built;
    // the package is not a dependency.
    optimizePackageImports: ['framer-motion', 'cmdk'],
    mdxRs: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn-images-1.medium.com' },
      { protocol: 'https', hostname: 'miro.medium.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
