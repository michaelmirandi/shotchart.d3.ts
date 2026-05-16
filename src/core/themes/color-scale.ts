import * as d3 from "d3";

export function createColorScale(
  palette: readonly string[],
): d3.ScaleLinear<string, string> {
  return d3
    .scaleLinear<string>()
    .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
    .range(palette as string[]);
}

export function zoneColor(percentile: number, palette: readonly string[]): string {
  if (percentile === -1) return "transparent";
  return createColorScale(palette)(percentile);
}
