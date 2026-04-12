export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function formatDateFull(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Format a YYYY-MM start/end pair as "Jan 2025 — Present". */
export function formatRange(start: string, end: string): string {
  const fmt = (ym: string) => {
    const d = new Date(`${ym}-01`);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  };
  return `${fmt(start)} — ${end === 'present' ? 'Present' : fmt(end)}`;
}

export function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  return `${input.slice(0, max).trimEnd()}…`;
}
