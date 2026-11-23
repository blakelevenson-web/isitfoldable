const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * "2026-11-01" -> "Nov 1, 2026".
 * Parsed by hand (not `new Date`) so the day never shifts because of time zones.
 * Anything that isn't YYYY-MM-DD is returned unchanged.
 */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!m) return value;
  const [, y, mo, d] = m;
  const month = MONTHS[Number(mo) - 1];
  if (!month) return value;
  return `${month} ${Number(d)}, ${y}`;
}
