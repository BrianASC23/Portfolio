import { HeroNav } from '@/components/hero/HeroNav';
import { PixelCodingScene } from '@/components/hero/PixelCodingScene';
import { Container } from '@/components/primitives/Container';

/**
 * The one section below the fold: the isometric pixel workstation on the left,
 * the retro menu on the right.
 */
export function WorkspaceSection() {
  // overflow-x-clip so the menu buttons' entrance travel never widens the page.
  return (
    <section
      id="workspace"
      aria-label="Workspace"
      className="scroll-mt-14 overflow-x-clip py-20 md:py-28"
    >
      <Container>
        {/* items-stretch: the menu takes its height from the row, so it stands
            exactly as tall as the pixel scene that sets it. */}
        <div className="mx-auto grid max-w-[960px] grid-cols-1 items-stretch gap-10 md:grid-cols-2 md:gap-12">
          <PixelCodingScene className="mx-auto w-full max-w-md md:mx-0" />
          <HeroNav />
        </div>
      </Container>
    </section>
  );
}
