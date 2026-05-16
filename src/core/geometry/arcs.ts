import { range } from "d3-array";
import { scaleLinear } from "d3-scale";
import type { Selection } from "d3-selection";
import { lineRadial } from "d3-shape";
import type { CourtLineKey, CourtLines, Point } from "../types";

type GroupSelection = Selection<SVGGElement, unknown, null, undefined>;
type PathSelection = Selection<SVGPathElement, number[], null, undefined>;

export function appendArcPath(
  base: GroupSelection,
  radius: number,
  startAngle: number,
  endAngle: number,
  translateX?: number,
  translateY?: number,
  xyKey?: CourtLineKey,
  courtLines?: CourtLines,
): PathSelection {
  const points = 1500;

  const angle = scaleLinear()
    .domain([0, points - 1])
    .range([startAngle, endAngle]);

  const collected: Point[] = [];
  const line = lineRadial<number>()
    .radius(radius)
    .angle((_d, i) => {
      collected.push({
        x: (translateX ?? 0) + radius * Math.cos(angle(i) - Math.PI / 2),
        y: (translateY ?? 0) + radius * Math.sin(angle(i) - Math.PI / 2),
      });
      return angle(i);
    });

  if (xyKey !== undefined && courtLines !== undefined) {
    courtLines[xyKey] = collected;
  }

  return base.append("path").datum(range(points)).attr("d", line);
}
