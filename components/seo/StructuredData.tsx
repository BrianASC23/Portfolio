import { publicEnv } from '@/lib/env';

interface StructuredDataProps {
  type?: 'person' | 'article';
  title?: string;
  description?: string;
  url?: string;
  datePublished?: string;
}

export function StructuredData(props: StructuredDataProps = {}) {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Brian Cao',
    url: base,
    jobTitle: 'Full-stack engineer',
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Stony Brook University',
    },
    sameAs: [
      'https://github.com/BrianASC23',
      'https://linkedin.com/in/brian-cao-7b9a89211',
      'https://medium.com/@brianc40722',
    ],
    email: 'mailto:brianc40722@gmail.com',
  };

  const article =
    props.type === 'article'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: props.title,
          description: props.description,
          url: props.url,
          author: { '@type': 'Person', name: 'Brian Cao' },
          datePublished: props.datePublished,
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: json-ld
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      {article && (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: json-ld
          dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
        />
      )}
    </>
  );
}
