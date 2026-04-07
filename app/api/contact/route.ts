import { serverEnv } from '@/lib/env';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactPayloadSchema } from './schema';

export const runtime = 'edge';

type Bucket = { count: number; ts: number };
const RATE_LIMIT: Map<string, Bucket> =
  (
    globalThis as unknown as {
      __contactRate?: Map<string, Bucket>;
    }
  ).__contactRate ?? new Map();
(globalThis as unknown as { __contactRate?: Map<string, Bucket> }).__contactRate = RATE_LIMIT;

const WINDOW_MS = 60_000;
const LIMIT = 3;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = RATE_LIMIT.get(ip);
  if (!bucket || now - bucket.ts > WINDOW_MS) {
    RATE_LIMIT.set(ip, { count: 1, ts: now });
    return false;
  }
  bucket.count += 1;
  return bucket.count > LIMIT;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = contactPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (!serverEnv.RESEND_API_KEY) {
    console.warn('[contact] RESEND_API_KEY missing — logging only', parsed.data);
    return NextResponse.json({ ok: true, mocked: true });
  }

  try {
    const resend = new Resend(serverEnv.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: serverEnv.CONTACT_FROM_EMAIL,
      to: serverEnv.CONTACT_TO_EMAIL,
      replyTo: parsed.data.email,
      subject: `Portfolio — ${parsed.data.name}`,
      text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] resend failed', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
