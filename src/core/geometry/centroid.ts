import type { Point } from "../types";

export function polygonCentroid(points: Point[]): [number, number] {
  let area = 0;
  let x = 0;
  let y = 0;
  const length = points.length;

  for (let i = 0; i < length; i++) {
    const next = i === length - 1 ? 0 : i + 1;
    const current = points[i];
    const successor = points[next];
    const cross = current.x * successor.y - successor.x * current.y;

    area += cross;
    x += (current.x + successor.x) * cross;
    y += (current.y + successor.y) * cross;
  }

  const divisor = area * 3;
  return [x / divisor, y / divisor];
}
