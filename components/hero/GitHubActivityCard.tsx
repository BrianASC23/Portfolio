import { GLASS } from '@/lib/styles';

// 7 rows × 20 columns of deterministic contribution levels (0-4)
const DATA: number[] = [
  0, 0, 1, 0, 0, 1, 2, 0, 1, 0, 0, 1, 0, 0, 1, 2, 0, 0, 1, 0, 0, 1, 2, 1, 0, 0, 1, 2, 3, 1, 0, 1, 2,
  0, 0, 1, 0, 1, 2, 1, 1, 0, 0, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 0, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3,
  4, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1, 2, 3, 2, 1, 0, 1, 2, 3,
  2, 1, 0, 0, 1, 2, 1, 0, 0, 1, 2, 1, 0, 0, 1, 0, 0, 1, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0,
  0, 0, 1, 0, 0, 0, 1, 0,
];

const COLORS = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

export function GitHubActivityCard() {
  return (
    <div data-card="github" className={`${GLASS} p-5 backdrop-blur-2xl`}>
      <p className="mb-3 text-[11px] uppercase tracking-[0.1em] text-[var(--color-fg-subtle)]">
        In the Lab
      </p>

      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateRows: 'repeat(7, 1fr)',
          gridAutoFlow: 'column',
          gridAutoColumns: '1fr',
        }}
      >
        {DATA.map((level, i) => (
          <div
            key={`cell-${i}-${level}`}
            className="aspect-square rounded-[2px]"
            style={{ backgroundColor: COLORS[level] }}
          />
        ))}
      </div>

      <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-[var(--color-fg-subtle)]">
        <span>Less</span>
        {COLORS.map((c) => (
          <div key={c} className="h-[10px] w-[10px] rounded-[2px]" style={{ backgroundColor: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
