/**
 * Pixel climber with an ice pick, for travelling a vertical timeline.
 *
 * Authored as a character grid on the same pixel discipline as the isometric
 * scene, and collapsed into one <path> per colour at render time. The pick
 * borrows the hull silver and the jacket the hologram blue, so the climber
 * reads as part of the same world.
 */

const PALETTE: Record<string, string> = {
  P: '#adb5bd', // pick head — steel
  W: '#a0522d', // pick handle — wood
  H: '#dba97a', // skin (face + arms)
  K: '#5c3d2e', // hair
  B: '#2f9ae8', // jacket — hologram blue
  L: '#4a5568', // pants
  S: '#2d2d2d', // boots
};

const CLIMBER: readonly string[] = [
  '..PPP......', // pick blade (embedded above)
  '....WW.....', // handle top
  '....W......', // handle
  '...HW......', // arm holding handle
  '...KKK.....', // head (hair)
  '...HHH.....', // face
  '...KHK.....', // head bottom (hair sides)
  '....B......', // neck
  '...BBB.....', // torso
  '..HBBBBH...', // torso + arms out
  '...BBB.....', // lower torso
  '...L.L.....', // upper legs
  '..L...L....', // legs spread (climbing stance)
  '..S...S....', // boots
  '...........', // empty
];

const W = 11;
const H = 15;

function toPaths(rows: readonly string[]) {
  const runs = new Map<string, string>();

  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    if (!row) continue;
    let x = 0;
    while (x < row.length) {
      const char = row[x];
      if (!char || !PALETTE[char]) {
        x += 1;
        continue;
      }
      let run = 1;
      while (x + run < row.length && row[x + run] === char) run += 1;
      runs.set(char, `${runs.get(char) ?? ''}M${x} ${y}h${run}v1h-${run}z`);
      x += run;
    }
  }

  return Array.from(runs, ([char, d]) => <path key={char} d={d} fill={PALETTE[char]} />);
}

export function PixelClimber({ className = 'h-9 w-auto' }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      {toPaths(CLIMBER)}
    </svg>
  );
}
