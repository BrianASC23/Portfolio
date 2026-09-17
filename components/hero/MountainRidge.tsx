/**
 * The morph target for phase one.
 *
 * The hero artwork itself cannot be morphed: `/hero/mountain.svg` is 22 baked
 * `<path>` elements of run-length rectangles, and it is loaded through an
 * `<img>`, so nothing outside it can reach its internals. This component is the
 * answer — a single ridgeline path sampled from the same generator data that
 * drew the artwork, so it registers exactly over the main massif. It fades in
 * as the artwork fades out, then flattens to the baseline.
 */

/** Main massif surface, sampled every 4 units across the 192-wide canvas. */
const RIDGE_Y = [
  78, 79, 79, 78, 77, 73, 71, 72, 69, 67, 66, 63, 61, 60, 56, 56, 55, 52, 50, 45, 41, 40, 39, 34,
  32, 30, 33, 30, 21, 19, 24, 24, 23, 20, 27, 32, 35, 42, 45, 49, 54, 57, 62, 65, 67, 67, 69, 69,
  70,
] as const;

const STEP = 4;
const CANVAS_W = 192;
const CANVAS_H = 108;

/** Where the flattened world settles. Everything in phase one lands on this. */
export const BASELINE_Y = 78;

/** Filled silhouette: the crest, then down the sides and closed along the floor. */
function bodyPath(ys: readonly number[]): string {
  const crest = ys.map((y, i) => `L${i * STEP},${y}`).join('');
  return `M0,${CANVAS_H}${crest}L${CANVAS_W},${CANVAS_H}Z`;
}

/** Just the crest, as an open stroke — the lit edge along the top. */
function crestPath(ys: readonly number[]): string {
  return ys.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * STEP},${y}`).join('');
}

const FLAT_Y = RIDGE_Y.map(() => BASELINE_Y);

export const RIDGE_BODY_D = bodyPath(RIDGE_Y);
export const RIDGE_CREST_D = crestPath(RIDGE_Y);
export const FLAT_BODY_D = bodyPath(FLAT_Y);
export const FLAT_CREST_D = crestPath(FLAT_Y);

interface MountainRidgeProps {
  /** The whole layer, faded in and out as a unit. */
  svgRef: React.Ref<SVGSVGElement>;
  bodyRef: React.Ref<SVGPathElement>;
  crestRef: React.Ref<SVGPathElement>;
  className?: string;
}

export function MountainRidge({ svgRef, bodyRef, crestRef, className = '' }: MountainRidgeProps) {
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      preserveAspectRatio="xMidYMid slice"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
      // Hidden until the artwork starts handing over; the timeline fades it in.
      style={{ opacity: 0 }}
    >
      <path ref={bodyRef} d={RIDGE_BODY_D} fill="var(--hero-ridge)" />
      <path
        ref={crestRef}
        d={RIDGE_CREST_D}
        fill="none"
        stroke="var(--hero-crest)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
