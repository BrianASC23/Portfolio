import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Brian Cao — Full-stack engineer. Stony Brook CS Honors, Class of 2027.',
};

const RESUME_PATH = '/resume/BrianCao-Resume.pdf';

export default function ResumePage() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-mono text-[11px] text-[var(--color-fg-subtle)] uppercase tracking-[0.18em]">
              Resume
            </p>
            <h1 className="font-serif text-[length:var(--text-h1)] text-[var(--color-fg)] leading-[1.05]">
              Brian Cao
            </h1>
          </div>
          <div className="flex gap-3">
            <Button href={RESUME_PATH}>Download PDF</Button>
            <Button href="mailto:brianc40722@gmail.com" variant="secondary">
              Email me
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <object
            data={RESUME_PATH}
            type="application/pdf"
            className="block h-[80vh] w-full"
            aria-label="Resume PDF"
          >
            <p className="p-6 text-[var(--color-fg-muted)]">
              Your browser can't display PDFs inline.{' '}
              <a href={RESUME_PATH} className="text-[var(--color-accent)]">
                Download the PDF
              </a>{' '}
              instead.
            </p>
          </object>
        </div>
      </Container>
    </section>
  );
}
