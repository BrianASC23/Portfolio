/**
 * PixelHero — inline SVG pixel art knight helmet, rendered from a readable ASCII grid.
 *
 * Placeholder art. To replace with a real sprite:
 *   1. Drop a PNG (ideally square, transparent background, ~256x256 or larger)
 *      into public/hero/character.png
 *   2. Replace the SVG below with:
 *        <Image src="/hero/character.png" alt="" width={256} height={256}
 *          className={className} style={{ imageRendering: 'pixelated' }} priority />
 *   3. Delete GRID and COLORS below.
 *
 * Free fantasy/roguelike pixel assets:
 *   - https://kenney.nl/assets
 *   - https://itch.io/game-assets/free/tag-pixel-art
 *   - https://opengameart.org
 */

const GRID = [
  '    ########    ',
  '   ##LLLLLL##   ',
  '  ##L......L##  ',
  '  ##L......L##  ',
  ' ##LLXXXXXXLL## ',
  ' ##L.EEEEEE.L## ',
  ' ##L.EEEEEE.L## ',
  ' ##LLXXXXXXLL## ',
  '  ##L......L##  ',
  '  ##L......L##  ',
  '   ##LLLLLL##   ',
  '    ########    ',
];

const COLORS: Record<string, string> = {
  '#': '#0b0604', // outline
  L: 'oklch(0.78 0.16 75)', // amber highlight
  '.': 'oklch(0.42 0.11 65)', // amber face plate
  X: '#120904', // eye slit inner shadow
  E: 'oklch(0.92 0.18 85)', // eye glow
};

export function PixelHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 12"
      aria-hidden="true"
      className={className}
      shapeRendering="crispEdges"
      style={{
        imageRendering: 'pixelated',
        filter: 'drop-shadow(0 0 12px oklch(0.78 0.16 75 / 0.35))',
      }}
    >
      <title>Pixel knight helmet</title>
      {GRID.flatMap((row, y) =>
        row.split('').map((ch, x) => {
          const fill = COLORS[ch];
          if (!fill) return null;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: static grid, order is fixed
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
          );
        }),
      )}
    </svg>
  );
}
