import { cn } from '@/lib/utils/cn';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';

type ContainerSize = 'narrow' | 'default' | 'wide' | 'bleed';

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: ContainerSize;
  children: ReactNode;
}

const sizeClasses: Record<ContainerSize, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
  bleed: 'max-w-none',
};

export function Container({
  as: Tag = 'div',
  size = 'default',
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={cn('mx-auto w-full px-6 md:px-8 lg:px-12', sizeClasses[size], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
