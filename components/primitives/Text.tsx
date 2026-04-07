import { cn } from '@/lib/utils/cn';
import { type ElementType, type HTMLAttributes, type ReactNode, createElement } from 'react';

type Tone = 'default' | 'muted' | 'subtle' | 'accent';
type Size = 'body' | 'small' | 'micro' | 'lead';

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  tone?: Tone;
  size?: Size;
  mono?: boolean;
  children: ReactNode;
}

const toneClasses: Record<Tone, string> = {
  default: 'text-[var(--color-fg)]',
  muted: 'text-[var(--color-fg-muted)]',
  subtle: 'text-[var(--color-fg-subtle)]',
  accent: 'text-[var(--color-accent)]',
};

const sizeClasses: Record<Size, string> = {
  body: 'text-base leading-relaxed',
  small: 'text-sm leading-relaxed',
  micro: 'text-xs leading-normal',
  lead: 'text-lg md:text-xl leading-relaxed',
};

export function Text({
  as: Tag = 'p',
  tone = 'default',
  size = 'body',
  mono = false,
  className,
  children,
  ...rest
}: TextProps) {
  return createElement(
    Tag,
    {
      className: cn(
        toneClasses[tone],
        sizeClasses[size],
        mono ? 'font-mono' : 'font-sans',
        className,
      ),
      ...rest,
    },
    children,
  );
}
