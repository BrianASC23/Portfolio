/**
 * Stepped selection cursor, drawn on the same pixel grid as the isometric
 * scene. Shared by the retro menu and the project links so one shape marks
 * "this is the active choice" everywhere.
 */
export function PixelArrow({ className = 'h-3.5 w-2' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 4 7"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="1" height="7" />
      <rect x="1" y="1" width="1" height="5" />
      <rect x="2" y="2" width="1" height="3" />
      <rect x="3" y="3" width="1" height="1" />
    </svg>
  );
}
