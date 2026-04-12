'use client';

import { Button } from '@/components/primitives/Button';
import { FormField } from '@/components/primitives/FormField';
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
        <FormField label="Name" type="text" name="name" required minLength={2} />
        <FormField label="Email" type="email" name="email" required />
      </div>
      <FormField label="Message" multiline name="message" required minLength={10} rows={5} />
      <div className="flex items-center justify-between gap-4">
        <Button size="lg" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending\u2026' : 'Send message'}
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
