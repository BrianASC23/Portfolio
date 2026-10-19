/**
 * The site's mark: a plus whose top-right and bottom-left inner corners sweep
 * into concave fillets, leaving the other two square.
 *
 * Authored as a path rather than shipped as an image so it inherits
 * `currentColor` and scales with whatever type it sits in — it is used at
 * roughly 20px beside the nav wordmark and at a third of a 76px line in the
 * statement, and a raster asset would have to be sized for each.
 *
 * Geometry is proportional to the source logo: arms 22% of the mark's extent,
 * fillet radius equal to the distance from an arm's end to the opposite arm's
 * edge, so the curve sweeps the full height of the arm as it does in the
 * original.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <path
        d="M41 10 L59 10 A31 31 0 0 0 90 41 L90 59 L59 59 L59 90 L41 90 A31 31 0 0 0 10 59 L10 41 L41 41 Z"
        fill="currentColor"
      />
    </svg>
  );
}
