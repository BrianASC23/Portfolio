import type { ReactElement } from 'react';

/**
 * Chunky pixel glyphs for the contact footer, drawn on the same discipline as
 * PixelArrow and PixelClimber: a character grid, run-length encoded into one
 * <path>, rendered with crisp edges so it stays pixel-sharp at any size.
 *
 * They inherit `currentColor`, so the caller decides the tone.
 */

const GLYPHS = {
  pin: [
    '...###...',
    '..#####..',
    '.#######.',
    '.##...##.',
    '.##...##.',
    '.#######.',
    '..#####..',
    '...###...',
    '....#....',
    '....#....',
  ],
  mail: [
    '###########',
    '##.......##',
    '#.##...##.#',
    '#..##.##..#',
    '#...###...#',
    '#.........#',
    '#.........#',
    '###########',
  ],
  profile: [
    '...#####...',
    '..#######..',
    '.#########.',
    '.#########.',
    '..#######..',
    '...#####...',
    '...........',
    '..#######..',
    '.#########.',
    '###########',
    '###########',
  ],
} as const;

export type GlyphName = keyof typeof GLYPHS;

/** Run-length encode the grid so touching pixels share one path segment. */
function toPath(rows: readonly string[]): string {
  let d = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== '#') {
        x += 1;
        continue;
      }
      let run = 1;
      while (x + run < row.length && row[x + run] === '#') run += 1;
      d += `M${x} ${y}h${run}v1h-${run}z`;
      x += run;
    }
  });
  return d;
}

export function PixelGlyph({
  name,
  className = 'h-5 w-auto',
}: {
  name: GlyphName;
  className?: string;
}): ReactElement {
  const rows = GLYPHS[name];

  return (
    <svg
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      <path d={toPath(rows)} />
    </svg>
  );
}
