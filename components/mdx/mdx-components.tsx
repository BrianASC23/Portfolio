import { Heading } from '@/components/primitives/Heading';
import { AppLink } from '@/components/primitives/Link';
import { Text } from '@/components/primitives/Text';
import NextImage from 'next/image';
import type { ComponentPropsWithoutRef, ComponentType } from 'react';

type MDXComponents = Record<string, ComponentType<Record<string, unknown>>>;

export const mdxComponents = {
  h1: ({ children, id }: ComponentPropsWithoutRef<'h1'>) => (
    <Heading level={1} id={id} display className="mt-16 mb-6">
      {children}
    </Heading>
  ),
  h2: ({ children, id }: ComponentPropsWithoutRef<'h2'>) => (
    <Heading level={2} id={id} display className="mt-14 mb-5">
      {children}
    </Heading>
  ),
  h3: ({ children, id }: ComponentPropsWithoutRef<'h3'>) => (
    <Heading level={3} id={id} className="mt-10 mb-4">
      {children}
    </Heading>
  ),
  p: ({ children }: ComponentPropsWithoutRef<'p'>) => (
    <Text tone="muted" size="body" className="mb-5 max-w-[68ch]">
      {children}
    </Text>
  ),
  ul: ({ children }: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="mb-6 max-w-[68ch] list-disc space-y-2 pl-6 text-[var(--color-fg-muted)] marker:text-[var(--color-accent)]">
      {children}
    </ul>
  ),
  ol: ({ children }: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="mb-6 max-w-[68ch] list-decimal space-y-2 pl-6 text-[var(--color-fg-muted)] marker:text-[var(--color-accent)]">
      {children}
    </ol>
  ),
  a: ({ href, children }: ComponentPropsWithoutRef<'a'>) => (
    <AppLink href={href ?? '#'}>{children}</AppLink>
  ),
  img: ({ src, alt, width, height }: ComponentPropsWithoutRef<'img'>) => (
    <figure className="my-10">
      <NextImage
        src={typeof src === 'string' ? src : ''}
        alt={alt ?? ''}
        width={Number(width) || 1200}
        height={Number(height) || 800}
        className="rounded-xl border border-[var(--color-border)]"
      />
      {alt && (
        <figcaption className="mt-2 text-center font-mono text-xs text-[var(--color-fg-subtle)]">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
  code: ({ children, className }: ComponentPropsWithoutRef<'code'>) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="rounded bg-[var(--color-bg-elevated)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--color-accent)]">
        {children}
      </code>
    ),
  blockquote: ({ children }: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="my-8 border-l-2 border-[var(--color-accent)] pl-5 text-[var(--color-fg-muted)] italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-12 border-[var(--color-border)]" />,
} as unknown as MDXComponents;
