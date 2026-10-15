import { Libre_Baskerville } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * The homepage statement, and nothing else.
 *
 * Libre Baskerville is drawn for body copy at reading sizes, so it carries a
 * large x-height and wide letterforms. At display sizes that reads as weight
 * rather than elegance, which is why the statement caps lower and leads looser
 * than it did under Instrument Serif — see `--text-display` in globals.css.
 */
export const fontDisplay = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'ui-serif', 'serif'],
});

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
