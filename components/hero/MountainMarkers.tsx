import type { ReactElement, Ref } from 'react';
import { BASELINE_Y } from './MountainRidge';

/**
 * Everything overlaid on the mountain: the dashed ascent route, the checkpoint
 * flags along it, and the climber topping out on the third summit.
 *
 * Drawn in the artwork's own 192x108 grid and sliced exactly the way the image
 * is cover-fitted, so all three stay pinned to the terrain at any crop or zoom.
 *
 * Every coordinate below is checked against the generator's own ridgeline, so
 * nothing floats off the rock or pokes through the silhouette. Sampled surface
 * heights, main massif (x: y) —
 *   78:44  84:40  90:37  96:32  99:30  104:33  108:30  110:25  113:18
 * with the valley shore at y~74. The three detected summits are (113,19),
 * (129,22) and (97,30).
 */

/**
 * Third summit — the left-hand one. `y` is the ground the boots rest on: the
 * sprite is laid out upward from here, so its bottom row's lower edge lands
 * exactly on the surface. The hero zooms in on the climber standing here.
 */
const CLIMBER_AT = { x: 98, y: 30 } as const;

/** Checkpoints, base to peak, each planted on the route below. */
const CHECKPOINTS = [
  { x: 78, y: 62 },
  { x: 90, y: 50 },
  { x: 99, y: 42 },
  { x: 109, y: 28 },
] as const;

/** Finish banner, on the true high point of the massif. */
const FINISH_AT = { x: 114, y: 17 } as const;

/**
 * Where each piece lands once the world flattens.
 *
 * Horizontal targets are fractions of the *visible* canvas, not viewBox units,
 * because this SVG is cover-fitted: how much of the 192-wide grid actually
 * reaches the screen depends on the viewport's aspect. A portrait phone shows
 * about 50 units of it, a wide desktop nearly all 192 — so any fixed x would
 * strand the climber and the finish banner off-screen on one of them. The
 * timeline resolves these against the measured window on every refresh.
 *
 * Vertical is a plain viewBox delta: cover-fitting only crops one axis, and the
 * baseline sits well inside the range that survives on either.
 */
const CLIMBER_FLAT_U = 0.08;
const FLAG_FLAT_U = [0.26, 0.42, 0.58, 0.74] as const;
const FINISH_FLAT_U = 0.9;

/**
 * The ascent, bottom of frame to summit. The lower run traces the trail already
 * baked into the artwork's valley floor, so the dashes read as its continuation
 * rather than a second path; above the shore it switchbacks up the face, tops
 * out at the climber's boots, then follows the crest to the summit flag.
 */
const ROUTE = [
  '86,108 94,103 101,97 107,91 111,84 112,78 110,74',
  '100,70 90,67 82,64 78,62',
  '80,58 85,55 88,52 90,50',
  '95,47 99,42',
  '95,38 96,33 98,30',
  '101,31 105,34 109,28 112,22 114,17',
].join(' ');

/** One dash plus one gap — the offset must travel exactly this to loop seamlessly. */
const DASH = 1.6;
const GAP = 2;

/**
 * Where phase two zooms. Aimed at the climber's chest once they have reached
 * the baseline, not at their feet, so the figure ends up centred in frame
 * instead of riding the bottom edge as the scale runs up.
 */
/**
 * Where phase two zooms: the climber's chest once they have reached the
 * baseline. `u` is already a fraction of the visible canvas, so it doubles as
 * the transform origin's x; the y has to be converted from viewBox units
 * against the measured window, which the timeline does.
 */
export const ZOOM_ANCHOR = { u: CLIMBER_FLAT_U, viewBoxY: BASELINE_Y - 8 };

const POLE = 'var(--hero-pole)';
const CLOTH = 'var(--hero-cloth)';
const CLOTH_SHADE = 'var(--hero-cloth-shade)';
/** Flag and banner poles are drawn one unit past their coordinate, so their
 *  flat destination has to be raised by the same unit to stand on the baseline
 *  rather than dangle below it. */
const POLE_FOOT = 1;
const CHECK_DARK = 'var(--hero-check-dark)';
const CHECK_LIGHT = 'var(--hero-check-light)';

/**
 * The climber stands against open sky, not snow, so the figure's value has to be
 * the opposite of whatever sky is behind it — light on the dusk sky, dark on the
 * day sky — or it vanishes into the background. Both sets live in globals.css.
 */
const INK: Record<string, string> = {
  K: 'var(--hero-hood)',
  H: 'var(--hero-skin)',
  B: 'var(--hero-jacket)',
  J: 'var(--hero-jacket-shade)',
  L: 'var(--hero-trousers)',
  S: 'var(--hero-boots)',
  P: 'var(--hero-axe)',
  W: 'var(--hero-haft)',
};

/**
 * Topping out: ice axe raised in the right hand, left arm hanging. The raised
 * arm is what makes the pose legible at this size — a figure standing straight
 * is an anonymous smudge, an arm above the head reads as a person from across
 * the room.
 *
 * The right leg is a row shorter than the left: the crest drops a unit between
 * the two boot columns (99 sits at y 29, 97 at y 30), so a level stance would
 * leave one foot buried and the other hovering.
 */
const CLIMBER: readonly string[] = [
  '.....PPPP', // long pick one side, short adze the other
  '.......W.', // haft
  '.......W.',
  '...KKK.H.', // hood crown | gloved hand on the haft
  '..KHHHKJ.', // hood sides, face | forearm
  '...HHH.J.', //                  | upper arm
  '..BBBBBB.', // shoulders, reaching the raised arm
  '.BBBBBB..', // left arm out, torso
  'HB.BBB...', // left mitt, sleeve | torso
  '...JJJ...', // belt
  '...LLL...', // hips
  '...L.L...',
  '...L.S...', // right boot, on the higher of the two columns
  '...S.....', // left boot, a step further down the crest
];

/** Sprite column that sits on CLIMBER_AT.x — the figure's spine. */
const SPINE_COL = 4;

function Climber({ innerRef }: { innerRef: Ref<SVGGElement> }): ReactElement {
  const rects: ReactElement[] = [];
  const originX = CLIMBER_AT.x - SPINE_COL;
  const originY = CLIMBER_AT.y - CLIMBER.length;

  CLIMBER.forEach((row, r) => {
    let x = 0;
    while (x < row.length) {
      const char = row[x];
      const fill = char ? INK[char] : undefined;
      if (!fill) {
        x += 1;
        continue;
      }
      let run = 1;
      while (x + run < row.length && row[x + run] === char) run += 1;
      rects.push(
        <rect
          key={`${r}-${x}`}
          x={originX + x}
          y={originY + r}
          width={run}
          height={1}
          fill={fill}
        />,
      );
      x += run;
    }
  });

  return (
    <g
      ref={innerRef}
      data-origin-x={CLIMBER_AT.x}
      data-flat-u={CLIMBER_FLAT_U}
      data-flat-y={BASELINE_Y - CLIMBER_AT.y}
    >
      {rects}
    </g>
  );
}

interface FlagProps {
  x: number;
  y: number;
  index: number;
  flatU: number;
  innerRef: Ref<SVGGElement>;
}

function Flag({ x, y, index, flatU, innerRef }: FlagProps) {
  return (
    // The outer group is the timeline's handle. The wave stays on the inner one:
    // a CSS animation on `transform` outranks inline styles, so sharing one
    // element would let the keyframes clobber GSAP's translate every frame.
    <g
      ref={innerRef}
      data-origin-x={x}
      data-flat-u={flatU}
      data-flat-y={BASELINE_Y - y - POLE_FOOT}
    >
      <g
        style={{
          // Staggered so the line of flags ripples rather than beating in unison
          animation: `flag-wave 1.6s steps(2, end) ${index * 0.22}s infinite`,
          transformOrigin: `${x}px ${y}px`,
        }}
      >
        <rect x={x} y={y - 8} width={1} height={9} fill={POLE} />
        <rect x={x + 1} y={y - 8} width={4} height={2} fill={CLOTH} />
        <rect x={x + 1} y={y - 6} width={3} height={2} fill={CLOTH_SHADE} />
      </g>
    </g>
  );
}

/**
 * Chequered banner — the thing the whole route is walking toward.
 *
 * The cloth hangs to the *left* of its pole, back toward the climber. Trailing
 * it the other way would push it past the right edge once the world flattens:
 * the banner is a fixed size in grid units, so the narrower the viewport the
 * larger a share of the frame it takes, and no single flat position would clear
 * the edge on both a phone and a desktop.
 */
function FinishLine({ innerRef }: { innerRef: Ref<SVGGElement> }) {
  const { x, y } = FINISH_AT;
  const checks: ReactElement[] = [];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      checks.push(
        <rect
          key={`${row}-${col}`}
          x={x - 6 + col * 2}
          y={y - 9 + row * 2}
          width={2}
          height={2}
          fill={(row + col) % 2 === 0 ? CHECK_LIGHT : CHECK_DARK}
        />,
      );
    }
  }

  return (
    <g
      ref={innerRef}
      data-origin-x={x}
      data-flat-u={FINISH_FLAT_U}
      data-flat-y={BASELINE_Y - y - POLE_FOOT}
    >
      <rect x={x} y={y - 9} width={1} height={10} fill={POLE} />
      {checks}
    </g>
  );
}

interface MountainMarkersProps {
  humanRef: Ref<SVGGElement>;
  routeRef: Ref<SVGPolylineElement>;
  finishRef: Ref<SVGGElement>;
  /** Handed each flag group in order, so the timeline can stagger them. */
  setFlagRef: (index: number) => Ref<SVGGElement>;
  className?: string;
}

export function MountainMarkers({
  humanRef,
  routeRef,
  finishRef,
  setFlagRef,
  className = '',
}: MountainMarkersProps) {
  return (
    <svg
      viewBox="0 0 192 108"
      preserveAspectRatio="xMidYMid slice"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      {/* Route first, so the flags and the climber sit on top of it */}
      <polyline
        ref={routeRef}
        points={ROUTE}
        fill="none"
        stroke={CLOTH}
        strokeWidth={0.8}
        strokeDasharray={`${DASH} ${GAP}`}
        opacity={0.8}
        style={{ animation: 'route-march 4s linear infinite' }}
      />

      {CHECKPOINTS.map((point, i) => (
        <Flag
          key={`${point.x}-${point.y}`}
          x={point.x}
          y={point.y}
          index={i}
          flatU={FLAG_FLAT_U[i] ?? 0.5}
          innerRef={setFlagRef(i)}
        />
      ))}
      <FinishLine innerRef={finishRef} />
      <Climber innerRef={humanRef} />
    </svg>
  );
}
