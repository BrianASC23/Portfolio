import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Resume of Brian Cao — software engineer in systems and AI infrastructure. Stony Brook CS Honors, Class of 2027.',
};

const RESUME_PDF = '/resume/BrianCao-Resume.pdf';

/**
 * Rendered from the PDF (US Letter, 3060×3960). Shown as an image rather than an
 * embedded PDF because mobile browsers, and some desktop ones, won't render a
 * PDF inline — the page has to work wherever the link is opened. Regenerate
 * both files together when the resume changes.
 */
const RESUME_PAGES = [{ src: '/resume/BrianCao-Resume-1.png', width: 3060, height: 3960 }];

export default function ResumePage() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <h1 className="font-serif text-[length:var(--text-h1)] leading-[1.05] text-[var(--color-fg)]">
              Resume
            </h1>
            <div className="flex flex-wrap gap-3">
              <Button href={RESUME_PDF} target="_blank" rel="noopener noreferrer">
                Open PDF
              </Button>
              <Button href={RESUME_PDF} download="BrianCao-Resume.pdf" variant="secondary">
                Download
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {RESUME_PAGES.map((page, i) => (
              <Image
                key={page.src}
                src={page.src}
                alt={
                  i === 0
                    ? 'Resume of Brian Cao: education at Stony Brook University, experience at WUSEF, the Stony Brook CS Department, Pulp Corporation and Campus Residences, projects, and technical skills'
                    : `Resume of Brian Cao, page ${i + 1}`
                }
                width={page.width}
                height={page.height}
                sizes="(min-width: 1024px) 896px, 100vw"
                priority={i === 0}
                className="h-auto w-full rounded-lg border border-[var(--color-border)] bg-white shadow-[var(--shadow-glow-card)]"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
