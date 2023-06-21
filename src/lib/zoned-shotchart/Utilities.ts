import * as d3 from "d3";
import { lookup } from "../../utilities/Types";
import { IShotchartSettings, ICourtLocation } from "../halfcourt/Interfaces";
import {
  redGreenTheme,
  percentileText,
  percentileTextBlueOrange,
} from "../halfcourt/Theme";
import { ShotchartBackgroundTheme } from "../halfcourt/Types";
import { appendArcPath } from "../halfcourt/Utilities";
import { ICourtLines, IZoneData, IZonePoints } from "./Interfaces";
import { ShotchartZone, ShotchartZoneCSS } from "./Types";

export function createSectionedZones(
  shotchartSettings: IShotchartSettings,
  base: any,
  courtLines: ICourtLines
): IZonePoints {
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
    courtLines
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
    courtLines
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

  let r3Line = courtLines.threePointLineXY.filter(function (i: ICourtLocation) {
    // change this to match up with AP
    return i.x < shotchartSettings.leagueSettings.rightThreeInside.x;
  });

  r3.points = r3.points.concat(r3Line).concat({ x: 5, y: 0 });

  let l3Line = courtLines.threePointLineXY.filter(function (i: ICourtLocation) {
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

  let m3Line = courtLines.threePointLineXY.filter(function (i: ICourtLocation) {
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

  let insideRbmr = courtLines.floaterXY.filter(function (i: ICourtLocation) {
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

  let insideLbmr = courtLines.floaterXY.filter(function (i: ICourtLocation) {
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

  let insideRwmr = courtLines.floaterXY.filter(function (i: ICourtLocation) {
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

  let insideLwmr = courtLines.floaterXY.filter(function (i: ICourtLocation) {
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

  let insideMmr = courtLines.floaterXY.filter(function (i: ICourtLocation) {
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

  let insideRf = courtLines.rimXY.filter(function (i: ICourtLocation) {
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

  let insideLf = courtLines.rimXY.filter(function (i: ICourtLocation) {
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

  let insideMf = courtLines.rimXY.filter(function (i: ICourtLocation) {
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
      rim: courtLines.rimXY,
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

  return zonePoints;
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
  data: IZoneData[]
): IZoneData[] {
  // pass context....
  return data.filter(function (i: IZoneData) {
    return i.bucket == shotzone;
  });
}

export function getPrettyPercentage(fgm: number, fga: number): string {
  if (fga == 0) return "0%";
  return (((fgm / fga) * 10000) / 100).toFixed(1) + "%";
}

export function shotZoneColor(perc: number, theme: string[]) {
  let colors = createColorScale(theme);
  return perc === -1 ? 'transparent' : colors(perc);
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

export function labelShotZones(
  shotchartSettings: IShotchartSettings,
  base: any,
  zonePoints: IZonePoints,
  data: IZoneData[],
  theme: string[],
  backgroundTheme: ShotchartBackgroundTheme
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
    let tempData = findShotZoneData(zoneLookup[key], data)[0];
    tempData =
      tempData == null
        ? { fga: 0, fgm: 0, percentile: -1, bucket: zoneLookup[key] }
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
      .attr("class", `${zoneCSS[key]}-text`)
      .attr(
        "id",
        theme === redGreenTheme
          ? percentileText(tempData.percentile, backgroundTheme)
          : percentileTextBlueOrange(tempData.percentile, backgroundTheme)
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
        theme === redGreenTheme
          ? percentileText(tempData.percentile, backgroundTheme)
          : percentileTextBlueOrange(tempData.percentile, backgroundTheme)
      );

    d3.selectAll("." + zoneCSS[key] + shotchartSettings.shotchartNumber)
      .style("fill", shotZoneColor(tempData.percentile, theme))
      .attr("id", "shotzone");
  }
}
