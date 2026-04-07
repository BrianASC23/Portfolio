import { fontMono, fontSans, fontSerif } from '@/app/fonts';
import { publicEnv } from '@/lib/env';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: 'Brian Cao — Full-stack engineer',
    template: '%s · Brian Cao',
  },
  description:
    'Brian Cao is a full-stack engineer and Stony Brook CS honors student building systems at the edge of software and AI.',
  authors: [{ name: 'Brian Cao', url: 'https://github.com/BrianASC23' }],
  creator: 'Brian Cao',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: publicEnv.NEXT_PUBLIC_SITE_URL,
    siteName: 'Brian Cao',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0b0a08',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontSerif.variable} ${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
