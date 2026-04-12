interface SectionWaypointProps {
  variant: 'signpost' | 'anvil' | 'scroll';
  className?: string;
}

export function SectionWaypoint({ variant, className }: SectionWaypointProps) {
  const svgProps = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    shapeRendering: 'crispEdges' as const,
    className,
    'aria-hidden': true as const,
  };

  switch (variant) {
    case 'signpost':
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, aria-hidden via spread props
        <svg {...svgProps}>
          {/* Post */}
          <rect x={11} y={2} width={2} height={20} />
          {/* Top sign pointing right */}
          <rect x={13} y={4} width={8} height={4} />
          <rect x={19} y={5} width={2} height={2} />
          {/* Bottom sign pointing left */}
          <rect x={3} y={12} width={8} height={4} />
          <rect x={3} y={13} width={2} height={2} />
          {/* Base */}
          <rect x={8} y={22} width={8} height={2} />
        </svg>
      );

    case 'anvil':
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, aria-hidden via spread props
        <svg {...svgProps}>
          {/* Horn */}
          <rect x={2} y={10} width={4} height={2} />
          {/* Body */}
          <rect x={6} y={8} width={12} height={6} />
          {/* Top face */}
          <rect x={8} y={6} width={8} height={2} />
          {/* Base */}
          <rect x={4} y={14} width={16} height={2} />
          <rect x={6} y={16} width={4} height={4} />
          <rect x={14} y={16} width={4} height={4} />
          <rect x={4} y={20} width={16} height={2} />
        </svg>
      );

    case 'scroll':
      return (
        // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon, aria-hidden via spread props
        <svg {...svgProps}>
          {/* Top roll */}
          <rect x={4} y={2} width={16} height={2} />
          <rect x={3} y={3} width={2} height={2} />
          <rect x={19} y={3} width={2} height={2} />
          {/* Body */}
          <rect x={5} y={4} width={14} height={14} />
          {/* Text lines */}
          <rect x={7} y={7} width={10} height={1} opacity={0.4} />
          <rect x={7} y={10} width={8} height={1} opacity={0.4} />
          <rect x={7} y={13} width={10} height={1} opacity={0.4} />
          {/* Bottom roll */}
          <rect x={3} y={17} width={2} height={2} />
          <rect x={19} y={17} width={2} height={2} />
          <rect x={4} y={18} width={16} height={2} />
        </svg>
      );
  }
}
