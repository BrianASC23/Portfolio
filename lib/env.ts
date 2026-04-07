import { z } from 'zod';

const serverSchema = z.object({
  RESEND_API_KEY: z.string().optional(),
  CONTACT_TO_EMAIL: z.string().email().default('brianc40722@gmail.com'),
  CONTACT_FROM_EMAIL: z.string().email().default('hello@briancao.dev'),
});

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_MEDIUM_FEED: z.string().url().default('https://medium.com/feed/@brianc40722'),
});

export const serverEnv = serverSchema.parse({
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
});

export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_MEDIUM_FEED: process.env.NEXT_PUBLIC_MEDIUM_FEED,
});
