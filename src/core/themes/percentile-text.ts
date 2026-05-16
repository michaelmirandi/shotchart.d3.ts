import type { BackgroundTheme } from "../types";

export function percentileTextClass(percentile: number, backgroundTheme: BackgroundTheme): string {
  if (percentile === -1) {
    return `${backgroundTheme}-empty-shot-zone`;
  }
  if ((percentile <= 15 || percentile >= 85) && percentile != null) {
    return "light-shotchart-zone";
  }
  return "";
}

export function percentileTextClassBlueOrange(
  percentile: number,
  backgroundTheme: BackgroundTheme,
): string {
  if (percentile === -1) {
    return `${backgroundTheme}-empty-shot-zone`;
  }
  if (percentile <= 10 && percentile != null) {
    return "light-shotchart-zone";
  }
  return "";
}
