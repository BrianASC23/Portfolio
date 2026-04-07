import { z } from 'zod';

export const contactPayloadSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  message: z.string().min(10).max(4000),
  website: z
    .string()
    .max(0, 'honeypot must be empty')
    .optional()
    .transform((v) => v ?? ''),
});

export type ContactPayload = z.infer<typeof contactPayloadSchema>;
