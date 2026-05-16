import * as d3 from "d3";
import { appendArcPath } from "./geometry/arcs";
import { polygonCentroid } from "./geometry/centroid";
import { formatPercentage } from "./geometry/percentage";
import {
  percentileTextClass,
  percentileTextClassBlueOrange,
} from "./themes/percentile-text";
import { redGreenPalette } from "./themes/palettes";
import { zoneColor } from "./themes/color-scale";
import type {
  BackgroundTheme,
  CourtLines,
  Point,
  ShotchartSettings,
  ShotchartZone,
  ShotchartZoneClassName,
  Zone,
  ZoneData,
  ZonePoints,
} from "./types";

export function findZoneData(
  zone: ShotchartZone,
  data: ZoneData[],
): ZoneData[] {
  return data.filter((d) => d.bucket === zone);
}

export function drawZones(
  shotchartSettings: ShotchartSettings,
  base: any,
  courtLines: CourtLines,
): ZonePoints {
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
    courtLines,
  )
    .attr("class", `shotzone rim-zone${shotchartSettings.shotchartNumber}`)
    .attr(
      "transform",
      `translate(${shotchartSettings.courtWidth / 2}, ${
        shotchartSettings.visibleCourtLength() -
        shotchartSettings.basketProtrusionLength -
        shotchartSettings.basketDiameter / 2
      })`,
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
    courtLines,
  )
    .attr("class", "shotzone floater")
    .attr(
      "transform",
      `translate(${shotchartSettings.courtWidth / 2}, ${
        shotchartSettings.visibleCourtLength() -
        shotchartSettings.basketProtrusionLength -
        shotchartSettings.basketDiameter / 2
      })`,
    );

  const rc3: Zone = {
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

  const lc3: Zone = {
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

  const r3: Zone = {
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

  const r3Line = courtLines.threePointLineXY.filter(
    (p: Point) => p.x < shotchartSettings.leagueSettings.rightThreeInside.x,
  );

  r3.points = r3.points.concat(r3Line).concat({ x: 5, y: 0 });

  const l3Line = courtLines.threePointLineXY.filter(
    (p: Point) =>
      p.x >
      shotchartSettings.courtWidth -
        shotchartSettings.leagueSettings.leftThreeInside.x,
  );

  const l3: Zone = {
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

  const m3: Zone = {
    className: "shotzone middle-three-zone",
    points: [{ x: 5, y: 0 }],
  };

  const m3Line = courtLines.threePointLineXY.filter(
    (p: Point) =>
      p.x > shotchartSettings.leagueSettings.rightThreeInside.x &&
      p.x <
        shotchartSettings.courtWidth -
          shotchartSettings.leagueSettings.leftThreeInside.x,
  );

  m3.points = m3.points.concat(m3Line);
  m3.points = m3.points.concat([
    { x: shotchartSettings.courtWidth - 5, y: 0 },
    { x: shotchartSettings.courtWidth, y: 0 },
  ]);

  const rbmr: Zone = {
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

  const insideRbmr = courtLines.floaterXY.filter(
    (p: Point) =>
      p.y <= shotchartSettings.visibleCourtLength() &&
      p.y >
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.leftBaselineMidrangeInside.y &&
      (p.x <
        shotchartSettings.courtWidth -
          shotchartSettings.leftBaselineMidrangeInside.x ||
        p.x < shotchartSettings.courtWidth / 2),
  );

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

  const insideLbmr = courtLines.floaterXY.filter(
    (p: Point) =>
      p.y <= shotchartSettings.visibleCourtLength() &&
      p.y >
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.rightBaselineMidrangeInside.y &&
      (p.x >
        shotchartSettings.courtWidth -
          shotchartSettings.rightBaselineMidrangeInside.x ||
        p.x > shotchartSettings.courtWidth / 2),
  );

  const lbmr: Zone = {
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

  const insideRwmr = courtLines.floaterXY.filter(
    (p: Point) =>
      p.y < shotchartSettings.visibleCourtLength() &&
      p.y >=
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.rightWingMidrangeInside.y &&
      p.x < shotchartSettings.courtWidth / 2 &&
      p.y <= shotchartSettings.visibleCourtLength() &&
      p.y <
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.rightBaselineMidrangeInside.y &&
      p.x <
        shotchartSettings.courtWidth -
          shotchartSettings.rightBaselineMidrangeInside.x,
  );

  const outsideRwmr = r3Line;

  const rwmr: Zone = {
    className: "shotzone right-wing-midrange-zone",
    points: outsideRwmr.reverse().concat(insideRwmr),
  };

  const insideLwmr = courtLines.floaterXY.filter(
    (p: Point) =>
      p.y < shotchartSettings.visibleCourtLength() &&
      p.y >=
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.leftWingMidrangeInside.y &&
      p.x > shotchartSettings.courtWidth / 2 &&
      p.y <= shotchartSettings.visibleCourtLength() &&
      p.y <
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.leftBaselineMidrangeInside.y &&
      p.x >
        shotchartSettings.courtWidth -
          shotchartSettings.leftBaselineMidrangeInside.x,
  );

  const outsideLwmr = l3Line;

  const lwmr: Zone = {
    className: "shotzone left-wing-midrange-zone",
    points: outsideLwmr.concat(insideLwmr.reverse()),
  };

  const insideMmr = courtLines.floaterXY.filter(
    (p: Point) =>
      p.y <
      shotchartSettings.visibleCourtLength() -
        shotchartSettings.rightWingMidrangeInside.y,
  );

  const outsideMmr = m3Line;

  const mmr: Zone = {
    className: "shotzone middle-midrange-zone",
    points: outsideMmr.concat(insideMmr.reverse()),
  };

  const insideRf = courtLines.rimXY.filter(
    (p: Point) =>
      p.y >
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.rightFloaterInside.y &&
      p.x < shotchartSettings.rightFloaterInside.x &&
      p.x < shotchartSettings.courtWidth / 2,
  );

  const outsideRf = insideRbmr.concat(insideRwmr);

  const rf: Zone = {
    className: "shotzone right-floater-zone",
    points: outsideRf.concat(insideRf.reverse()),
  };

  const insideLf = courtLines.rimXY.filter(
    (p: Point) =>
      p.y >
        shotchartSettings.visibleCourtLength() -
          shotchartSettings.leftFloaterInside.y &&
      p.x > shotchartSettings.leftFloaterInside.x &&
      p.x > shotchartSettings.courtWidth / 2,
  );

  const outsideLf = insideLbmr.reverse().concat(insideLwmr);

  const lf: Zone = {
    className: "shotzone left-floater-zone",
    points: insideLf.concat(outsideLf),
  };

  const insideMf = courtLines.rimXY.filter(
    (p: Point) =>
      p.y <
      shotchartSettings.visibleCourtLength() -
        shotchartSettings.leftFloaterInside.y,
  );

  const outsideMf = insideMmr;

  const mf: Zone = {
    className: "shotzone middle-floater-zone",
    points: outsideMf.concat(insideMf),
  };

  const zonePoints: ZonePoints = {
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
    .attr(
      "class",
      (d: Zone) => `${d.className}${shotchartSettings.shotchartNumber}`,
    )
    .attr("points", (d: Zone) =>
      d.points.map((p) => `${p.x},${p.y}`).join(" "),
    );

  return zonePoints;
}

const ZONE_LOOKUP: Record<string, ShotchartZone> = {
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

const ZONE_CLASSNAME: Record<string, ShotchartZoneClassName> = {
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

export function labelZones(
  shotchartSettings: ShotchartSettings,
  base: any,
  zonePoints: ZonePoints,
  data: ZoneData[],
  palette: readonly string[],
  backgroundTheme: BackgroundTheme,
): void {
  for (const key in ZONE_LOOKUP) {
    const existing = findZoneData(ZONE_LOOKUP[key], data)[0];
    const zoneData: ZoneData = existing ?? {
      fga: 0,
      fgm: 0,
      percentile: -1,
      bucket: ZONE_LOOKUP[key],
    };
    const center = polygonCentroid(zonePoints.labeledZones[key]);
    const isNba = shotchartSettings.leagueSettings.leagueId === "nba";

    let layout: { top: number; bottom: number; left: number; right: number };
    if (key === "rim") {
      layout = { top: -1.5, bottom: 3, left: 0, right: 0 };
    } else if (key === "mf") {
      layout = { top: 0, bottom: 3, left: 0, right: 0 };
    } else if (key === "lf" && isNba) {
      layout = { top: 0, bottom: 2, left: 0, right: 2 };
    } else if (key === "rf" && isNba) {
      layout = { top: 0, bottom: 2, left: -2, right: 0 };
    } else {
      layout = { top: 0, bottom: 2, left: 0, right: 0 };
    }

    const textId =
      palette === redGreenPalette
        ? percentileTextClass(zoneData.percentile, backgroundTheme)
        : percentileTextClassBlueOrange(zoneData.percentile, backgroundTheme);

    base
      .append("text")
      .text(`${zoneData.fgm}/${zoneData.fga}`)
      .attr("x", center[0] + layout.left + layout.right)
      .attr("y", center[1] + layout.top)
      .style("text-anchor", "middle")
      .attr("class", `${ZONE_CLASSNAME[key]}-text`)
      .attr("id", textId);

    base
      .append("text")
      .text(formatPercentage(zoneData.fgm, zoneData.fga))
      .attr("x", center[0] + layout.left + layout.right)
      .attr("y", center[1] + layout.bottom)
      .style("text-anchor", "middle")
      .attr("class", `${ZONE_CLASSNAME[key]}-text`)
      .attr("id", textId);

    d3.selectAll(`.${ZONE_CLASSNAME[key]}${shotchartSettings.shotchartNumber}`)
      .style("fill", zoneColor(zoneData.percentile, palette))
      .attr("id", "shotzone");
  }
}
