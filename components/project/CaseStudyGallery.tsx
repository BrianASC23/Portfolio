import { FadeIn } from '@/components/motion/FadeIn';
import type { Project } from '@/lib/schemas/project';
import Image from 'next/image';

interface CaseStudyGalleryProps {
  gallery: Project['gallery'];
}

export function CaseStudyGallery({ gallery }: CaseStudyGalleryProps) {
  if (gallery.length === 0) return null;

  return (
    <section className="py-12">
      <div className="grid gap-8 md:grid-cols-2">
        {gallery.map((item, i) => (
          <FadeIn key={item.src} delay={i * 0.05}>
            <figure>
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
              {item.caption && (
                <figcaption className="mt-2 font-mono text-[10px] text-[var(--color-fg-subtle)] uppercase tracking-[0.14em]">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
