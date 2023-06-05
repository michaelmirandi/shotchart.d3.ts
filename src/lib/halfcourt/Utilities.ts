import * as d3 from "d3";
import { ICourtLines } from "../zoned-shotchart/Interfaces";
import { ICourtLocation, IDrawCourt, IShotchartSettings } from "./Interfaces";

export function appendArcPath(
  base: any,
  radius: number,
  startAngle: number,
  endAngle: number,
  translateX?: number,
  translateY?: number,
  xyState?: string,
  courtLines?: ICourtLines
): any {
  // amount of line segments for the arc

  let points = 1500;

  let a = d3
    .scaleLinear()
    .domain([0, points - 1])
    .range([startAngle, endAngle]);

  let temp: ICourtLocation[] = [];
  let line = d3
    .lineRadial()
    .radius(radius)
    .angle(function (d: any, i: any) {
      temp.push({
        x:
          (translateX === undefined ? 0 : translateX) +
          radius * Math.cos(a(i) - Math.PI / 2),
        y:
          (translateY === undefined ? 0 : translateY) +
          radius * Math.sin(a(i) - Math.PI / 2),
      });
      return a(i);
    });

  // figure out how to add context here...
  // generate state letiables... maybe pass in a hook with a dictionary??
  if (xyState !== undefined && courtLines !== undefined) {
    courtLines[xyState] = temp;
  }
  return base.append("path").datum(d3.range(points)).attr("d", line);
}

export function drawCourt(
  shotchartSettings: IShotchartSettings,
  node: any
): IDrawCourt {
  const courtLines = {
    threePointLineXY: [],
    restrictedAreaXY: [],
    ftOutXY: [],
    floaterXY: [],
    rimXY: [],
  };
  let base = d3
    .select(node.current)
    .attr("width", shotchartSettings.width)
    .attr(
      "viewBox",
      "0 0 " +
        shotchartSettings.courtWidth +
        " " +
        shotchartSettings.visibleCourtLength()
    )
    .append("g")
    .attr("class", "shot-chart-court");
  base
    .append("rect")
    .attr("class", "shot-chart-court-key")
    .attr(
      "x",
      shotchartSettings.courtWidth / 2 -
        shotchartSettings.leagueSettings.keyWidth / 2
    )
    .attr(
      "y",
      shotchartSettings.visibleCourtLength() -
        shotchartSettings.freeThrowLineLength
    )
    .attr("width", shotchartSettings.leagueSettings.keyWidth)
    .attr("height", shotchartSettings.freeThrowLineLength);

  base
    .append("line")
    .attr("class", "shot-chart-court-baseline")
    .attr("x1", 0)
    .attr("y1", shotchartSettings.visibleCourtLength())
    .attr("x2", shotchartSettings.courtWidth)
    .attr("y2", shotchartSettings.visibleCourtLength());

  let tpAngle = Math.atan(
    shotchartSettings.leagueSettings.threePointSideRadius /
      (shotchartSettings.leagueSettings.threePointCutOffLength -
        shotchartSettings.basketProtrusionLength -
        shotchartSettings.basketDiameter / 2)
  );

  appendArcPath(
    base,
    shotchartSettings.leagueSettings.threePointRadius,
    -1 * tpAngle,
    tpAngle,
    shotchartSettings.courtWidth / 2,
    shotchartSettings.visibleCourtLength() -
      shotchartSettings.basketProtrusionLength -
      shotchartSettings.basketDiameter / 2,
    "threePointLineXY",
    courtLines
  )
    .attr("class", "shot-chart-court-3pt-line")
    .attr(
      "transform",
      "translate(" +
        shotchartSettings.courtWidth / 2 +
        ", " +
        (shotchartSettings.visibleCourtLength() -
          shotchartSettings.basketProtrusionLength -
          shotchartSettings.basketDiameter / 2) +
        ")"
    );

  [1, -1].forEach(function (n) {
    base
      .append("line")
      .attr("class", "shot-chart-court-3pt-line")
      .attr(
        "x1",
        shotchartSettings.courtWidth / 2 +
          shotchartSettings.leagueSettings.threePointSideRadius * n
      )
      .attr(
        "y1",
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.leagueSettings.threePointCutOffLength
      )
      .attr(
        "x2",
        shotchartSettings.courtWidth / 2 +
          shotchartSettings.leagueSettings.threePointSideRadius * n
      )
      .attr("y2", shotchartSettings.visibleCourtLength());
  });

  appendArcPath(
    base,
    shotchartSettings.restrictedCircleRadius,
    (-1 * Math.PI) / 2,
    Math.PI / 2,
    shotchartSettings.courtWidth / 2,
    shotchartSettings.visibleCourtLength() -
      shotchartSettings.basketProtrusionLength -
      shotchartSettings.basketDiameter / 2,
    "restrictedAreaXY",
    courtLines
  )
    .attr("class", "shot-chart-court-restricted-area")
    .attr(
      "transform",
      "translate(" +
        shotchartSettings.courtWidth / 2 +
        ", " +
        (shotchartSettings.visibleCourtLength() -
          shotchartSettings.basketProtrusionLength -
          shotchartSettings.basketDiameter / 2) +
        ")"
    );

  appendArcPath(
    base,
    shotchartSettings.freeThrowCircleRadius,
    (-1 * Math.PI) / 2,
    Math.PI / 2,
    shotchartSettings.courtWidth / 2,
    shotchartSettings.visibleCourtLength() -
      shotchartSettings.freeThrowLineLength,
    "ftOutXY",
    courtLines
  )
    .attr("class", "shot-chart-court-ft-circle-top")
    .attr(
      "transform",
      "translate(" +
        shotchartSettings.courtWidth / 2 +
        ", " +
        (shotchartSettings.visibleCourtLength() -
          shotchartSettings.freeThrowLineLength) +
        ")"
    );

  if (shotchartSettings.leagueSettings.leagueId == "nba") {
    appendArcPath(
      base,
      shotchartSettings.freeThrowCircleRadius,
      Math.PI / 2,
      1.5 * Math.PI
    )
      .attr("class", "shot-chart-court-ft-circle-bottom")
      .attr(
        "transform",
        "translate(" +
          shotchartSettings.courtWidth / 2 +
          ", " +
          (shotchartSettings.visibleCourtLength() -
            shotchartSettings.freeThrowLineLength) +
          ")"
      );
  } else if (shotchartSettings.leagueSettings.leagueId == "coll") {
    base
      .append("rect")
      .attr("class", "shot-chart-court-key-block")
      .attr(
        "x",
        shotchartSettings.courtWidth / 2 -
          shotchartSettings.leagueSettings.keyWidth / 2 -
          0.66
      )
      .attr("y", shotchartSettings.visibleCourtLength() - 7)
      .attr("width", 0.66)
      .attr("height", 1)
      .style("fill", "black");

    base
      .append("rect")
      .attr("class", "shot-chart-court-key-block")
      .attr(
        "x",
        shotchartSettings.courtWidth / 2 +
          shotchartSettings.leagueSettings.keyWidth / 2
      )
      .attr("y", shotchartSettings.visibleCourtLength() - 7)
      .attr("width", 0.66)
      .attr("height", 1)
      .style("fill", "black");
  }

  shotchartSettings.leagueSettings.keyMarks.forEach(function (mark: any) {
    [1, -1].forEach(function (n) {
      base
        .append("line")
        .attr("class", "shot-chart-court-key-mark")
        .attr(
          "x1",
          shotchartSettings.courtWidth / 2 +
            (shotchartSettings.leagueSettings.keyWidth / 2) * n +
            shotchartSettings.keyMarkWidth * n
        )
        .attr("y1", shotchartSettings.visibleCourtLength() - mark)
        .attr(
          "x2",
          shotchartSettings.courtWidth / 2 +
            (shotchartSettings.leagueSettings.keyWidth / 2) * n
        )
        .attr("y2", shotchartSettings.visibleCourtLength() - mark);
    });
  });

  base
    .append("line")
    .attr("class", "shot-chart-court-backboard")
    .attr(
      "x1",
      shotchartSettings.courtWidth / 2 - shotchartSettings.basketWidth / 2
    )
    .attr(
      "y1",
      shotchartSettings.visibleCourtLength() -
        shotchartSettings.basketProtrusionLength
    )
    .attr(
      "x2",
      shotchartSettings.courtWidth / 2 + shotchartSettings.basketWidth / 2
    )
    .attr(
      "y2",
      shotchartSettings.visibleCourtLength() -
        shotchartSettings.basketProtrusionLength
    );

  base
    .append("circle")
    .attr("class", "shot-chart-court-hoop")
    .attr("cx", shotchartSettings.courtWidth / 2)
    .attr(
      "cy",
      shotchartSettings.visibleCourtLength() -
        shotchartSettings.basketProtrusionLength -
        shotchartSettings.basketDiameter / 2
    )
    .attr("r", shotchartSettings.basketDiameter / 2);

  return { base, courtLines };
}
