import { Figtree } from 'next/font/google';
import localFont from 'next/font/local';

export const fontSerif = localFont({
  src: [
    { path: '../public/fonts/InstrumentSerif-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/InstrumentSerif-Italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'ui-serif', 'serif'],
});

export const fontSans = localFont({
  src: '../public/fonts/Inter-Variable.woff2',
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

export const fontMono = localFont({
  src: '../public/fonts/JetBrainsMono-Regular.woff2',
  variable: '--font-mono',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'monospace'],
});

export const fontFigtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-figtree',
  display: 'swap',
  fallback: ['sans-serif'],
});
