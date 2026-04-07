'use client';

import { Button } from '@/components/primitives/Button';
import { type FormEvent, useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const { error } = (await res.json().catch(() => ({ error: 'Request failed' }))) as {
          error: string;
        };
        throw new Error(error);
      }
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  const inputClass =
    'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-accent)] focus:outline-none';

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]">
            Name
          </span>
          <input type="text" name="name" required minLength={2} className={inputClass} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]">
            Email
          </span>
          <input type="email" name="email" required className={inputClass} />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]">
          Message
        </span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          className={`${inputClass} resize-y`}
        />
      </label>
      <div className="flex items-center justify-between gap-4">
        <Button size="lg" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Send message'}
        </Button>
        {status === 'success' && (
          <p className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-[0.14em]">
            Sent — talk soon.
          </p>
        )}
        {status === 'error' && (
          <p className="font-mono text-[10px] text-red-400 uppercase tracking-[0.14em]">
            {errorMessage || 'Failed. Try again.'}
          </p>
        )}
      </div>
    </form>
  );
}
