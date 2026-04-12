interface TreeSilhouetteProps {
  variant: 'pine' | 'oak' | 'birch';
  className?: string;
}

export function TreeSilhouette({ variant, className }: TreeSilhouetteProps) {
  const svgProps = {
    viewBox: '0 0 60 120',
    fill: 'currentColor',
    className,
    'aria-hidden': true as const,
  };

  switch (variant) {
    case 'pine':
      return (
        <svg {...svgProps} role="img" aria-label="Tree silhouette">
          <polygon points="30,5 10,45 50,45" />
          <polygon points="30,25 7,65 53,65" />
          <polygon points="30,45 4,85 56,85" />
          <rect x={26} y={85} width={8} height={30} />
        </svg>
      );

    case 'oak':
      return (
        <svg {...svgProps} role="img" aria-label="Tree silhouette">
          <ellipse cx={30} cy={35} rx={25} ry={30} />
          <ellipse cx={20} cy={30} rx={18} ry={22} />
          <ellipse cx={40} cy={30} rx={18} ry={22} />
          <rect x={27} y={60} width={6} height={55} />
        </svg>
      );

    case 'birch':
      return (
        <svg {...svgProps} role="img" aria-label="Tree silhouette">
          <ellipse cx={30} cy={30} rx={14} ry={25} />
          <ellipse cx={30} cy={50} rx={11} ry={18} />
          <rect x={28} y={55} width={4} height={60} />
        </svg>
      );
  }
}
