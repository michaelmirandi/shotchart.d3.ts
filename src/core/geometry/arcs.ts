import * as d3 from "d3";
import type { CourtLineKey, CourtLines, Point } from "../types";

export function appendArcPath(
  base: any,
  radius: number,
  startAngle: number,
  endAngle: number,
  translateX?: number,
  translateY?: number,
  xyKey?: CourtLineKey,
  courtLines?: CourtLines,
): any {
  const points = 1500;

  const a = d3
    .scaleLinear()
    .domain([0, points - 1])
    .range([startAngle, endAngle]);

  const collected: Point[] = [];
  const line = d3
    .lineRadial()
    .radius(radius)
    .angle((_d: unknown, i: number) => {
      collected.push({
        x: (translateX ?? 0) + radius * Math.cos(a(i) - Math.PI / 2),
        y: (translateY ?? 0) + radius * Math.sin(a(i) - Math.PI / 2),
      });
      return a(i);
    });

  if (xyKey !== undefined && courtLines !== undefined) {
    courtLines[xyKey] = collected;
  }
  return base.append("path").datum(d3.range(points)).attr("d", line);
}
