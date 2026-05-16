export function formatPercentage(fgm: number, fga: number): string {
  if (fga === 0) return "0%";
  return `${((fgm / fga) * 100).toFixed(1)}%`;
}
