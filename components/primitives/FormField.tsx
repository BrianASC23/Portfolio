import { cn } from '@/lib/utils/cn';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

const BASE_INPUT =
  'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-accent)] focus:outline-none';

const LABEL = 'font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]';

type InputFieldProps = {
  label: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

type TextareaFieldProps = {
  label: string;
  multiline: true;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export type FormFieldProps = InputFieldProps | TextareaFieldProps;

export function FormField(props: FormFieldProps) {
  if ('multiline' in props && props.multiline) {
    const { label, multiline: _, className, ...rest } = props;
    return (
      <label className={cn('flex flex-col gap-2', className)}>
        <span className={LABEL}>{label}</span>
        <textarea className={cn(BASE_INPUT, 'resize-y')} {...rest} />
      </label>
    );
  }

  const { label, className, ...rest } = props as InputFieldProps;
  return (
    <label className={cn('flex flex-col gap-2', className)}>
      <span className={LABEL}>{label}</span>
      <input className={BASE_INPUT} {...rest} />
    </label>
  );
}
