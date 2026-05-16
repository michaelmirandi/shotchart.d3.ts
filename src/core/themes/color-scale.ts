import { type ScaleLinear, scaleLinear } from "d3-scale";

export function createColorScale(palette: readonly string[]): ScaleLinear<string, string> {
  return scaleLinear<string>()
    .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
    .range(palette as string[]);
}

export function zoneColor(percentile: number, palette: readonly string[]): string {
  if (percentile === -1) return "transparent";
  return createColorScale(palette)(percentile);
}
