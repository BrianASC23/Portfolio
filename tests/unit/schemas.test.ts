import { experienceSchema } from '@/lib/schemas/experience';
import { projectSchema } from '@/lib/schemas/project';
import { describe, expect, it } from 'vitest';

describe('projectSchema', () => {
  it('parses a minimal valid project', () => {
    const result = projectSchema.parse({
      slug: 'advising-bot',
      title: 'Advising Bot',
      tagline: 'RAG chatbot for Stony Brook advisement',
      summary: 'A retrieval-augmented agent over the full course bulletin.',
      role: 'Solo builder',
      timeframe: '2025 – present',
      status: 'in-progress',
      stack: ['Python', 'LangGraph'],
      tags: ['ai-ml'],
      cover: { src: '/projects/advising-bot/cover.jpg', alt: 'cover' },
    });
    expect(result.slug).toBe('advising-bot');
    expect(result.featured).toBe(false);
  });

  it('rejects invalid tag enum', () => {
    expect(() =>
      projectSchema.parse({
        slug: 'bad',
        title: 'Bad',
        tagline: 't',
        summary: 's',
        role: 'r',
        timeframe: 'tf',
        status: 'shipped',
        stack: [],
        tags: ['not-a-tag'],
        cover: { src: '/x', alt: 'x' },
      }),
    ).toThrow();
  });
});

describe('experienceSchema', () => {
  it('parses a minimal valid experience', () => {
    const result = experienceSchema.parse({
      slug: 'pulp-2025',
      company: 'Pulp Corporation',
      role: 'SWE Intern',
      start: '2025-01',
      end: '2025-08',
      bullets: ['Shipped X.'],
      stack: ['Next.js', 'Neo4j'],
    });
    expect(result.company).toBe('Pulp Corporation');
  });
});
