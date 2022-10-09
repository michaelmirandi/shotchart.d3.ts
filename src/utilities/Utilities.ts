import * as d3 from "d3";
import {
  ICourtLocation,
  IShotchartSettings,
  IZonePoints,
  IShotchartLinesContext,
  IZonedShotchartContext,
  IZoneData,
} from "./Interfaces";
import { lookup, ShotchartZone, ShotchartZoneCSS } from "./Types";

export function appendArcPath(
  base: any,
  radius: number,
  startAngle: number,
  endAngle: number,
  translateX?: number,
  translateY?: number,
  xyState?: string,
  globalContext?: IShotchartLinesContext
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
    .angle(function (d, i) {
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
  if (xyState !== undefined && globalContext !== undefined) {
    globalContext[xyState] = temp;
  }

  return base.append("path").datum(d3.range(points)).attr("d", line);
}

export function createSectionedZones(
  shotchartSettings: IShotchartSettings,
  base: any,
  linesContext: IShotchartLinesContext,
  zoneContext: IZonedShotchartContext,
  theme: string[]
): void {
  // create outside line for rim range
  // fill based on the circle. This is not a polygon like the other shapes on the visualization
  appendArcPath(
    base,
    shotchartSettings.rimRange,
    -1 * Math.PI,
    Math.PI,
    shotchartSettings.courtWidth / 2,
    shotchartSettings.visibleCourtLength() -
      shotchartSettings.basketProtrusionLength -
      shotchartSettings.basketDiameter / 2,
    "rimXY",
    linesContext
  )
    .attr("class", "shotzone rim-zone" + shotchartSettings.shotchartNumber)
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
    shotchartSettings.floaterRange,
    -1 * Math.PI,
    Math.PI,
    shotchartSettings.courtWidth / 2,
    shotchartSettings.visibleCourtLength() -
      shotchartSettings.basketProtrusionLength -
      shotchartSettings.basketDiameter / 2,
    "floaterXY",
    linesContext
  )
    .attr("class", "shotzone floater")
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
  // points must be in order
  let rc3 = {
    className: "shotzone right-corner-three-zone",
    points: [
      { x: 0, y: shotchartSettings.visibleCourtLength() },
      {
        x: 0,
        y:
          shotchartSettings.visibleCourtLength() -
          shotchartSettings.leagueSettings.threePointCutOffLength,
      },
      {
        x:
          (shotchartSettings.courtWidth -
            shotchartSettings.leagueSettings.threePointSideRadius * 2) /
          2,
        y:
          shotchartSettings.visibleCourtLength() -
          shotchartSettings.leagueSettings.threePointCutOffLength,
      },
      {
        x:
          (shotchartSettings.courtWidth -
            shotchartSettings.leagueSettings.threePointSideRadius * 2) /
          2,
        y: shotchartSettings.visibleCourtLength(),
      },
    ],
  };

  let lc3 = {
    className: "shotzone left-corner-three-zone",
    points: [
      {
        x:
          shotchartSettings.leagueSettings.threePointSideRadius * 2 +
          (shotchartSettings.courtWidth -
            shotchartSettings.leagueSettings.threePointSideRadius * 2) /
            2,
        y: shotchartSettings.visibleCourtLength(),
      },
      {
        x:
          shotchartSettings.leagueSettings.threePointSideRadius * 2 +
          (shotchartSettings.courtWidth -
            shotchartSettings.leagueSettings.threePointSideRadius * 2) /
            2,
        y:
          shotchartSettings.visibleCourtLength() -
          shotchartSettings.leagueSettings.threePointCutOffLength,
      },
      {
        x: shotchartSettings.courtWidth,
        y:
          shotchartSettings.visibleCourtLength() -
          shotchartSettings.leagueSettings.threePointCutOffLength,
      },
      {
        x: shotchartSettings.courtWidth,
        y: shotchartSettings.visibleCourtLength(),
      },
    ],
  };
  let r3 = {
    className: "shotzone right-three-zone",
    points: [
      { x: 0, y: 0 },
      {
        x: 0,
        y:
          shotchartSettings.visibleCourtLength() -
          shotchartSettings.leagueSettings.threePointCutOffLength,
      },
      {
        x:
          (shotchartSettings.courtWidth -
            shotchartSettings.leagueSettings.threePointSideRadius * 2) /
          2,
        y:
          shotchartSettings.visibleCourtLength() -
          shotchartSettings.leagueSettings.threePointCutOffLength,
      },
    ],
  };

  let r3Line = linesContext.threePointLineXY.filter(function (
    i: ICourtLocation
  ) {
    // change this to match up with AP
    return i.x < shotchartSettings.leagueSettings.rightThreeInside.x;
  });

  r3.points = r3.points.concat(r3Line).concat({ x: 5, y: 0 });

  let l3Line = linesContext.threePointLineXY.filter(function (
    i: ICourtLocation
  ) {
    return (
      i.x >
      shotchartSettings.courtWidth -
        shotchartSettings.leagueSettings.leftThreeInside.x
    );
  });

  let l3 = {
    className: "shotzone left-three-zone",
    points: l3Line.concat([
      {
        x:
          shotchartSettings.leagueSettings.threePointSideRadius * 2 +
          (shotchartSettings.courtWidth -
            shotchartSettings.leagueSettings.threePointSideRadius * 2) /
            2,
        y:
          shotchartSettings.visibleCourtLength() -
          shotchartSettings.leagueSettings.threePointCutOffLength,
      },
      {
        x: shotchartSettings.courtWidth,
        y:
          shotchartSettings.visibleCourtLength() -
          shotchartSettings.leagueSettings.threePointCutOffLength,
      },
      { x: shotchartSettings.courtWidth, y: 0 },
      { x: shotchartSettings.courtWidth - 5, y: 0 },
    ]),
  };

  let m3 = {
    className: "shotzone middle-three-zone",
    points: [{ x: 5, y: 0 }],
  };

  let m3Line = linesContext.threePointLineXY.filter(function (
    i: ICourtLocation
  ) {
    // change this to match with AP
    return (
      i.x > shotchartSettings.leagueSettings.rightThreeInside.x &&
      i.x <
        shotchartSettings.courtWidth -
          shotchartSettings.leagueSettings.leftThreeInside.x
    );
  });

  m3.points = m3.points.concat(m3Line);
  m3.points = m3.points.concat([
    { x: shotchartSettings.courtWidth - 5, y: 0 },
    { x: shotchartSettings.courtWidth, y: 0 },
  ]);

  let rbmr = {
    className: "shotzone right-baseline-midrange-zone",
    points: [
      {
        x:
          (shotchartSettings.courtWidth -
            shotchartSettings.leagueSettings.threePointSideRadius * 2) /
          2,
        y: shotchartSettings.visibleCourtLength(),
      },
    ],
  };

  let insideRbmr = linesContext.floaterXY.filter(function (i: ICourtLocation) {
    // change x portion to match AP
    return (
      i.y <= shotchartSettings.visibleCourtLength() &&
      i.y >
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.leftBaselineMidrangeInside.y &&
      (i.x <
        shotchartSettings.courtWidth -
          shotchartSettings.leftBaselineMidrangeInside.x ||
        i.x < shotchartSettings.courtWidth / 2)
    );
  });

  rbmr.points = rbmr.points.concat(insideRbmr);
  rbmr.points = rbmr.points.concat([
    {
      x:
        (shotchartSettings.courtWidth -
          shotchartSettings.leagueSettings.threePointSideRadius * 2) /
        2,
      y:
        shotchartSettings.visibleCourtLength() -
        shotchartSettings.leagueSettings.threePointCutOffLength,
    },
  ]);

  let insideLbmr = linesContext.floaterXY.filter(function (i: ICourtLocation) {
    // change x portion to match AP
    return (
      i.y <= shotchartSettings.visibleCourtLength() &&
      i.y >
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.rightBaselineMidrangeInside.y &&
      (i.x >
        shotchartSettings.courtWidth -
          shotchartSettings.rightBaselineMidrangeInside.x ||
        i.x > shotchartSettings.courtWidth / 2)
    );
  });

  let lbmr = {
    className: "shotzone left-baseline-midrange-zone",
    points: insideLbmr.concat([
      {
        x:
          shotchartSettings.leagueSettings.threePointSideRadius * 2 +
          (shotchartSettings.courtWidth -
            shotchartSettings.leagueSettings.threePointSideRadius * 2) /
            2,
        y: shotchartSettings.visibleCourtLength(),
      },
      {
        x:
          shotchartSettings.leagueSettings.threePointSideRadius * 2 +
          (shotchartSettings.courtWidth -
            shotchartSettings.leagueSettings.threePointSideRadius * 2) /
            2,
        y:
          shotchartSettings.visibleCourtLength() -
          shotchartSettings.leagueSettings.threePointCutOffLength,
      },
    ]),
  };

  let insideRwmr = linesContext.floaterXY.filter(function (i: ICourtLocation) {
    // change x portion to match AP
    return (
      i.y < shotchartSettings.visibleCourtLength() &&
      i.y >=
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.rightWingMidrangeInside.y &&
      i.x < shotchartSettings.courtWidth / 2 &&
      i.y <= shotchartSettings.visibleCourtLength() &&
      i.y <
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.rightBaselineMidrangeInside.y &&
      i.x <
        shotchartSettings.courtWidth -
          shotchartSettings.rightBaselineMidrangeInside.x
    );
  });

  let outsideRwmr = r3Line;

  let rwmr = {
    className: "shotzone right-wing-midrange-zone",
    points: outsideRwmr.reverse().concat(insideRwmr),
  };

  let insideLwmr = linesContext.floaterXY.filter(function (i: ICourtLocation) {
    // change x portion to match AP
    return (
      i.y < shotchartSettings.visibleCourtLength() &&
      i.y >=
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.leftWingMidrangeInside.y &&
      i.x > shotchartSettings.courtWidth / 2 &&
      i.y <= shotchartSettings.visibleCourtLength() &&
      i.y <
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.leftBaselineMidrangeInside.y &&
      i.x >
        shotchartSettings.courtWidth -
          shotchartSettings.leftBaselineMidrangeInside.x
    );
  });

  let outsideLwmr = l3Line;

  let lwmr = {
    className: "shotzone left-wing-midrange-zone",
    points: outsideLwmr.concat(insideLwmr.reverse()),
  };

  let insideMmr = linesContext.floaterXY.filter(function (i: ICourtLocation) {
    // change x portion to match AP
    return (
      i.y <
      shotchartSettings.visibleCourtLength() -
        shotchartSettings.rightWingMidrangeInside.y
    );
  });

  let outsideMmr = m3Line;

  let mmr = {
    className: "shotzone middle-midrange-zone",
    points: outsideMmr.concat(insideMmr.reverse()),
  };

  let insideRf = linesContext.rimXY.filter(function (i: ICourtLocation) {
    return (
      i.y >
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.rightFloaterInside.y &&
      i.x < shotchartSettings.rightFloaterInside.x &&
      i.x < shotchartSettings.courtWidth / 2
    );
  });

  let outsideRf = insideRbmr.concat(insideRwmr);

  let rf = {
    className: "shotzone right-floater-zone",
    points: outsideRf.concat(insideRf.reverse()),
  };

  let insideLf = linesContext.rimXY.filter(function (i: ICourtLocation) {
    return (
      i.y >
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.leftFloaterInside.y &&
      i.x > shotchartSettings.leftFloaterInside.x &&
      i.x > shotchartSettings.courtWidth / 2
    );
  });

  let outsideLf = insideLbmr.reverse().concat(insideLwmr);

  let lf = {
    className: "shotzone left-floater-zone",
    points: insideLf.concat(outsideLf),
  };

  let insideMf = linesContext.rimXY.filter(function (i: ICourtLocation) {
    return (
      i.y <
      shotchartSettings.visibleCourtLength() -
        shotchartSettings.leftFloaterInside.y
    );
  });

  let outsideMf = insideMmr;

  let mf = {
    className: "shotzone middle-floater-zone",
    points: outsideMf.concat(insideMf),
  };

  let zonePoints = {
    labeledZones: {
      rc3: rc3.points,
      lc3: lc3.points,
      r3: r3.points,
      l3: l3.points,
      m3: m3.points,
      rbmr: rbmr.points,
      lbmr: lbmr.points,
      rwmr: rwmr.points,
      lwmr: lwmr.points,
      mmr: mmr.points,
      lf: lf.points,
      rf: rf.points,
      mf: mf.points,
      rim: linesContext.rimXY,
    },
    zones: [rc3, lc3, r3, l3, m3, rbmr, lbmr, rwmr, lwmr, mmr, lf, rf, mf],
  };

  base
    .selectAll("polygon")
    .data(zonePoints.zones)
    .enter()
    .append("polygon")
    .attr("class", function (d: any): number {
      return d.className + shotchartSettings.shotchartNumber;
    })
    .attr("points", function (d: any): number {
      return d.points
        .map(function (d: any): string {
          return [d.x, d.y].join(",");
        })
        .join(" ");
    });

  labelShotZones(shotchartSettings, base, zonePoints, zoneContext, theme);
}

function labelShotZones(
  shotchartSettings: IShotchartSettings,
  base: any,
  zonePoints: IZonePoints,
  zoneContext: IZonedShotchartContext,
  theme: string[]
) {
  let zoneLookup: lookup<ShotchartZone> = {
    rc3: "R-C3",
    lc3: "L-C3",
    r3: "R-ATB",
    l3: "L-ATB",
    m3: "M-ATB",
    rbmr: "RB-MR",
    lbmr: "LB-MR",
    rwmr: "RW-MR",
    lwmr: "LW-MR",
    mmr: "M-MR",
    lf: "L-FL",
    rf: "R-FL",
    mf: "M-FL",
    rim: "RIM",
  };

  let zoneCSS: lookup<ShotchartZoneCSS> = {
    rc3: "right-corner-three-zone",
    lc3: "left-corner-three-zone",
    r3: "right-three-zone",
    l3: "left-three-zone",
    m3: "middle-three-zone",
    rbmr: "right-baseline-midrange-zone",
    lbmr: "left-baseline-midrange-zone",
    rwmr: "right-wing-midrange-zone",
    lwmr: "left-wing-midrange-zone",
    mmr: "middle-midrange-zone",
    lf: "left-floater-zone",
    rf: "right-floater-zone",
    mf: "middle-floater-zone",
    rim: "rim-zone",
  };

  for (let key in zoneLookup) {
    let tempData = findShotZoneData(zoneLookup[key], zoneContext)[0];
    tempData =
      tempData == null
        ? { fga: 0, fgm: 0, percentile: 0, bucket: zoneLookup[key] }
        : tempData;
    let center = findCentroid(zonePoints.labeledZones[key]);
    let prettyFormat;

    if (key == "rim") {
      prettyFormat = { top: -1.5, bottom: 3, left: 0, right: 0 };
    } else if (key == "mf") {
      prettyFormat = { top: 0, bottom: 3, left: 0, right: 0 };
    } else if (
      key == "lf" &&
      shotchartSettings.leagueSettings.leagueId == "nba"
    ) {
      prettyFormat = { top: 0, bottom: 2, left: 0, right: 2 };
    } else if (
      key == "rf" &&
      shotchartSettings.leagueSettings.leagueId == "nba"
    ) {
      prettyFormat = { top: 0, bottom: 2, left: -2, right: 0 };
    } else {
      prettyFormat = { top: 0, bottom: 2, left: 0, right: 0 };
    }
    base
      .append("text")
      .text(tempData.fgm + "/" + tempData.fga)
      .attr("x", center[0] + prettyFormat.left + prettyFormat.right)
      .attr("y", center[1] + prettyFormat.top)
      .style("text-anchor", "middle")
      .attr("class", zoneCSS[key] + "-text")
      .attr(
        "id",
        tempData.percentile <= 15 || tempData.percentile >= 85
          ? "light-shotchart-zone"
          : ""
      );

    base
      .append("text")
      .text(getPrettyPercentage(tempData.fgm, tempData.fga))
      .attr("x", center[0] + prettyFormat.left + prettyFormat.right)
      .attr("y", center[1] + prettyFormat.bottom)
      .style("text-anchor", "middle")
      .attr("class", zoneCSS[key] + "-text")
      .attr(
        "id",
        tempData.percentile <= 15 || tempData.percentile >= 85
          ? "light-shotchart-zone"
          : ""
      );

    d3.selectAll("." + zoneCSS[key] + shotchartSettings.shotchartNumber)
      .style("fill", shotZoneColor(tempData.percentile, theme))
      .attr("id", "shotzone");
  }
}

export function findCentroid(points: ICourtLocation[]): number[] {
  let a = 0,
    x = 0,
    y = 0,
    l = points.length;

  for (let i = 0; i < l; i++) {
    const s = i === l - 1 ? 0 : i + 1,
      v0 = points[i],
      v1 = points[s],
      f = v0.x * v1.y - v1.x * v0.y;

    a += f;
    x += (v0.x + v1.x) * f;
    y += (v0.y + v1.y) * f;
  }

  const d = a * 3;

  return [x / d, y / d];
}

export function findShotZoneData(
  shotzone: ShotchartZone,
  context: IZonedShotchartContext
): IZoneData[] {
  // pass context....
  return context.visibleShotData.filter(function (i: IZoneData) {
    return i.bucket == shotzone;
  });
}

export function getPrettyPercentage(fgm: number, fga: number): string {
  if (fga == 0) return "0%";
  return (((fgm / fga) * 10000) / 100).toFixed(1) + "%";
}

export function shotZoneColor(perc: number, theme: string[]) {
  let colors = createColorScale(theme);
  return colors(perc);
}

export function createColorScale(
  theme: string[]
): d3.ScaleLinear<string, string> {
  let colors = d3
    .scaleLinear<string>()
    .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
    .range(theme);
  return colors;
}

export function drawCourt(
  shotchartSettings: IShotchartSettings,
  node: any,
  globalContext: IShotchartLinesContext,
  theme: string[],

  zoneContext?: IZonedShotchartContext
) {
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

  // create paint area
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

  // create baseline
  base
    .append("line")
    .attr("class", "shot-chart-court-baseline")
    .attr("x1", 0)
    .attr("y1", shotchartSettings.visibleCourtLength())
    .attr("x2", shotchartSettings.courtWidth)
    .attr("y2", shotchartSettings.visibleCourtLength());

  // create angle for three point arc (tangent - in rads)
  let tpAngle = Math.atan(
    shotchartSettings.leagueSettings.threePointSideRadius /
      (shotchartSettings.leagueSettings.threePointCutOffLength -
        shotchartSettings.basketProtrusionLength -
        shotchartSettings.basketDiameter / 2)
  );

  // create outer three point line
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
    globalContext
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

  // create three point line standout
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

  // restricted circle
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
    globalContext
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

  // create out of paint free throw circle
  appendArcPath(
    base,
    shotchartSettings.freeThrowCircleRadius,
    (-1 * Math.PI) / 2,
    Math.PI / 2,
    shotchartSettings.courtWidth / 2,
    shotchartSettings.visibleCourtLength() -
      shotchartSettings.freeThrowLineLength,
    "ftOutXY",
    globalContext
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

  // create in paint free throw circle (dashed - css)

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
    // lane block (college)
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

  // box marks for key
  shotchartSettings.leagueSettings.keyMarks.forEach(function (mark) {
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

  // create backboard
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

  // create rim
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
  // create outside line for floater range

  if (zoneContext !== undefined) {
    createSectionedZones(
      shotchartSettings,
      base,
      globalContext,
      zoneContext,
      theme
    );
  }
}
