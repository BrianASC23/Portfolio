import { contactPayloadSchema } from '@/app/api/contact/schema';
import { describe, expect, it } from 'vitest';

describe('contactPayloadSchema', () => {
  it('accepts a valid payload', () => {
    const result = contactPayloadSchema.safeParse({
      name: 'Alice',
      email: 'alice@example.com',
      message: 'Hello Brian, this is a real message.',
      website: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short messages', () => {
    const result = contactPayloadSchema.safeParse({
      name: 'Al',
      email: 'alice@example.com',
      message: 'hi',
      website: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects when honeypot is filled', () => {
    const result = contactPayloadSchema.safeParse({
      name: 'Bot',
      email: 'bot@bad.com',
      message: 'A valid looking message here.',
      website: 'spam',
    });
    expect(result.success).toBe(false);
  });
});
