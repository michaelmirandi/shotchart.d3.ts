import { type Selection, select } from "d3-selection";
import { appendArcPath } from "./geometry/arcs";
import { polygonCentroid } from "./geometry/centroid";
import { formatPercentage } from "./geometry/percentage";
import { drawCourt } from "./halfcourt";
import { createShotchartSettings } from "./settings/chart";
import { collegeSettings } from "./settings/college";
import { nbaSettings } from "./settings/nba";
import { zoneColor } from "./themes/color-scale";
import { orangeBluePalette, redGreenPalette } from "./themes/palettes";
import { percentileTextClass, percentileTextClassBlueOrange } from "./themes/percentile-text";
import type {
  BackgroundTheme,
  CourtLines,
  CourtType,
  LeagueSettings,
  Point,
  ShotchartSettings,
  ShotchartZone,
  ShotchartZoneClassName,
  Theme,
  Zone,
  ZoneData,
  ZonePoints,
  ZonedShotchartInstance,
  ZonedShotchartOptions,
} from "./types";

type GroupSelection = Selection<SVGGElement, unknown, null, undefined>;
type PolygonSelection = Selection<SVGPolygonElement, unknown, null, undefined>;
type TextSelection = Selection<SVGTextElement, unknown, null, undefined>;

type ZoneKey =
  | "rc3"
  | "lc3"
  | "r3"
  | "l3"
  | "m3"
  | "rbmr"
  | "lbmr"
  | "rwmr"
  | "lwmr"
  | "mmr"
  | "lf"
  | "rf"
  | "mf"
  | "rim";

interface ZoneRegistration {
  code: ShotchartZone;
  polygon: PolygonSelection;
  fgmText: TextSelection;
  pctText: TextSelection;
}

const ZONE_CODE: Record<ZoneKey, ShotchartZone> = {
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

const ZONE_CLASSNAME: Record<ZoneKey, ShotchartZoneClassName> = {
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

const ZONE_KEYS = Object.keys(ZONE_CODE) as ZoneKey[];

function resolveLeagueSettings(
  courtType: CourtType | undefined,
  override: LeagueSettings | undefined,
): LeagueSettings {
  if (override) return override;
  return courtType === "college" ? collegeSettings : nbaSettings;
}

function findZoneData(code: ShotchartZone, data: ZoneData[]): ZoneData | undefined {
  return data.find((d) => d.bucket === code);
}

function labelLayout(
  key: ZoneKey,
  league: "nba" | "college",
): { top: number; bottom: number; left: number; right: number } {
  if (key === "rim") return { top: -1.5, bottom: 3, left: 0, right: 0 };
  if (key === "mf") return { top: 0, bottom: 3, left: 0, right: 0 };
  if (key === "lf" && league === "nba") return { top: 0, bottom: 2, left: 0, right: 2 };
  if (key === "rf" && league === "nba") return { top: 0, bottom: 2, left: -2, right: 0 };
  return { top: 0, bottom: 2, left: 0, right: 0 };
}

/**
 * Compute zone polygons and append them to `base`. Also appends the rim and
 * floater arc paths that feed into the polygon math. Returns the polygon
 * point arrays so labels can be positioned at zone centroids.
 */
export function drawZones(
  base: GroupSelection,
  settings: ShotchartSettings,
  courtLines: CourtLines,
): ZonePoints {
  appendArcPath(
    base,
    settings.rimRange,
    -Math.PI,
    Math.PI,
    settings.courtWidth / 2,
    settings.visibleCourtLength() - settings.basketProtrusionLength - settings.basketDiameter / 2,
    "rimXY",
    courtLines,
  )
    .attr("class", "shotzone rim-zone")
    .attr(
      "transform",
      `translate(${settings.courtWidth / 2}, ${
        settings.visibleCourtLength() -
        settings.basketProtrusionLength -
        settings.basketDiameter / 2
      })`,
    );

  appendArcPath(
    base,
    settings.floaterRange,
    -Math.PI,
    Math.PI,
    settings.courtWidth / 2,
    settings.visibleCourtLength() - settings.basketProtrusionLength - settings.basketDiameter / 2,
    "floaterXY",
    courtLines,
  )
    .attr("class", "shotzone floater")
    .attr(
      "transform",
      `translate(${settings.courtWidth / 2}, ${
        settings.visibleCourtLength() -
        settings.basketProtrusionLength -
        settings.basketDiameter / 2
      })`,
    );

  const rc3: Zone = {
    className: ZONE_CLASSNAME.rc3,
    points: [
      { x: 0, y: settings.visibleCourtLength() },
      {
        x: 0,
        y: settings.visibleCourtLength() - settings.leagueSettings.threePointCutOffLength,
      },
      {
        x: (settings.courtWidth - settings.leagueSettings.threePointSideRadius * 2) / 2,
        y: settings.visibleCourtLength() - settings.leagueSettings.threePointCutOffLength,
      },
      {
        x: (settings.courtWidth - settings.leagueSettings.threePointSideRadius * 2) / 2,
        y: settings.visibleCourtLength(),
      },
    ],
  };

  const lc3: Zone = {
    className: ZONE_CLASSNAME.lc3,
    points: [
      {
        x:
          settings.leagueSettings.threePointSideRadius * 2 +
          (settings.courtWidth - settings.leagueSettings.threePointSideRadius * 2) / 2,
        y: settings.visibleCourtLength(),
      },
      {
        x:
          settings.leagueSettings.threePointSideRadius * 2 +
          (settings.courtWidth - settings.leagueSettings.threePointSideRadius * 2) / 2,
        y: settings.visibleCourtLength() - settings.leagueSettings.threePointCutOffLength,
      },
      {
        x: settings.courtWidth,
        y: settings.visibleCourtLength() - settings.leagueSettings.threePointCutOffLength,
      },
      { x: settings.courtWidth, y: settings.visibleCourtLength() },
    ],
  };

  const r3: Zone = {
    className: ZONE_CLASSNAME.r3,
    points: [
      { x: 0, y: 0 },
      {
        x: 0,
        y: settings.visibleCourtLength() - settings.leagueSettings.threePointCutOffLength,
      },
      {
        x: (settings.courtWidth - settings.leagueSettings.threePointSideRadius * 2) / 2,
        y: settings.visibleCourtLength() - settings.leagueSettings.threePointCutOffLength,
      },
    ],
  };

  const r3Line = courtLines.threePointLineXY.filter(
    (p: Point) => p.x < settings.leagueSettings.rightThreeInside.x,
  );

  r3.points = r3.points.concat(r3Line).concat({ x: 5, y: 0 });

  const l3Line = courtLines.threePointLineXY.filter(
    (p: Point) => p.x > settings.courtWidth - settings.leagueSettings.leftThreeInside.x,
  );

  const l3: Zone = {
    className: ZONE_CLASSNAME.l3,
    points: l3Line.concat([
      {
        x:
          settings.leagueSettings.threePointSideRadius * 2 +
          (settings.courtWidth - settings.leagueSettings.threePointSideRadius * 2) / 2,
        y: settings.visibleCourtLength() - settings.leagueSettings.threePointCutOffLength,
      },
      {
        x: settings.courtWidth,
        y: settings.visibleCourtLength() - settings.leagueSettings.threePointCutOffLength,
      },
      { x: settings.courtWidth, y: 0 },
      { x: settings.courtWidth - 5, y: 0 },
    ]),
  };

  const m3: Zone = {
    className: ZONE_CLASSNAME.m3,
    points: [{ x: 5, y: 0 }],
  };

  const m3Line = courtLines.threePointLineXY.filter(
    (p: Point) =>
      p.x > settings.leagueSettings.rightThreeInside.x &&
      p.x < settings.courtWidth - settings.leagueSettings.leftThreeInside.x,
  );

  m3.points = m3.points.concat(m3Line);
  m3.points = m3.points.concat([
    { x: settings.courtWidth - 5, y: 0 },
    { x: settings.courtWidth, y: 0 },
  ]);

  const rbmr: Zone = {
    className: ZONE_CLASSNAME.rbmr,
    points: [
      {
        x: (settings.courtWidth - settings.leagueSettings.threePointSideRadius * 2) / 2,
        y: settings.visibleCourtLength(),
      },
    ],
  };

  const insideRbmr = courtLines.floaterXY.filter(
    (p: Point) =>
      p.y <= settings.visibleCourtLength() &&
      p.y > settings.visibleCourtLength() - settings.leftBaselineMidrangeInside.y &&
      (p.x < settings.courtWidth - settings.leftBaselineMidrangeInside.x ||
        p.x < settings.courtWidth / 2),
  );

  rbmr.points = rbmr.points.concat(insideRbmr);
  rbmr.points = rbmr.points.concat([
    {
      x: (settings.courtWidth - settings.leagueSettings.threePointSideRadius * 2) / 2,
      y: settings.visibleCourtLength() - settings.leagueSettings.threePointCutOffLength,
    },
  ]);

  const insideLbmr = courtLines.floaterXY.filter(
    (p: Point) =>
      p.y <= settings.visibleCourtLength() &&
      p.y > settings.visibleCourtLength() - settings.rightBaselineMidrangeInside.y &&
      (p.x > settings.courtWidth - settings.rightBaselineMidrangeInside.x ||
        p.x > settings.courtWidth / 2),
  );

  const lbmr: Zone = {
    className: ZONE_CLASSNAME.lbmr,
    points: insideLbmr.concat([
      {
        x:
          settings.leagueSettings.threePointSideRadius * 2 +
          (settings.courtWidth - settings.leagueSettings.threePointSideRadius * 2) / 2,
        y: settings.visibleCourtLength(),
      },
      {
        x:
          settings.leagueSettings.threePointSideRadius * 2 +
          (settings.courtWidth - settings.leagueSettings.threePointSideRadius * 2) / 2,
        y: settings.visibleCourtLength() - settings.leagueSettings.threePointCutOffLength,
      },
    ]),
  };

  const insideRwmr = courtLines.floaterXY.filter(
    (p: Point) =>
      p.y < settings.visibleCourtLength() &&
      p.y >= settings.visibleCourtLength() - settings.rightWingMidrangeInside.y &&
      p.x < settings.courtWidth / 2 &&
      p.y <= settings.visibleCourtLength() &&
      p.y < settings.visibleCourtLength() - settings.rightBaselineMidrangeInside.y &&
      p.x < settings.courtWidth - settings.rightBaselineMidrangeInside.x,
  );

  const rwmr: Zone = {
    className: ZONE_CLASSNAME.rwmr,
    points: r3Line.slice().reverse().concat(insideRwmr),
  };

  const insideLwmr = courtLines.floaterXY.filter(
    (p: Point) =>
      p.y < settings.visibleCourtLength() &&
      p.y >= settings.visibleCourtLength() - settings.leftWingMidrangeInside.y &&
      p.x > settings.courtWidth / 2 &&
      p.y <= settings.visibleCourtLength() &&
      p.y < settings.visibleCourtLength() - settings.leftBaselineMidrangeInside.y &&
      p.x > settings.courtWidth - settings.leftBaselineMidrangeInside.x,
  );

  const lwmr: Zone = {
    className: ZONE_CLASSNAME.lwmr,
    points: l3Line.concat(insideLwmr.slice().reverse()),
  };

  const insideMmr = courtLines.floaterXY.filter(
    (p: Point) => p.y < settings.visibleCourtLength() - settings.rightWingMidrangeInside.y,
  );

  const mmr: Zone = {
    className: ZONE_CLASSNAME.mmr,
    points: m3Line.concat(insideMmr.slice().reverse()),
  };

  const insideRf = courtLines.rimXY.filter(
    (p: Point) =>
      p.y > settings.visibleCourtLength() - settings.rightFloaterInside.y &&
      p.x < settings.rightFloaterInside.x &&
      p.x < settings.courtWidth / 2,
  );

  const rf: Zone = {
    className: ZONE_CLASSNAME.rf,
    points: insideRbmr.concat(insideRwmr).concat(insideRf.slice().reverse()),
  };

  const insideLf = courtLines.rimXY.filter(
    (p: Point) =>
      p.y > settings.visibleCourtLength() - settings.leftFloaterInside.y &&
      p.x > settings.leftFloaterInside.x &&
      p.x > settings.courtWidth / 2,
  );

  const lf: Zone = {
    className: ZONE_CLASSNAME.lf,
    points: insideLf.concat(insideLbmr.slice().reverse().concat(insideLwmr)),
  };

  const insideMf = courtLines.rimXY.filter(
    (p: Point) => p.y < settings.visibleCourtLength() - settings.leftFloaterInside.y,
  );

  const mf: Zone = {
    className: ZONE_CLASSNAME.mf,
    points: insideMmr.concat(insideMf),
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

  return zonePoints;
}

/**
 * Mount an interactive zoned shotchart onto an SVG element. Returns an
 * instance whose setters perform targeted DOM updates — no rebuild on data
 * or theme changes.
 */
export function createZonedShotchart(
  svg: SVGSVGElement,
  options: ZonedShotchartOptions,
): ZonedShotchartInstance {
  const league = resolveLeagueSettings(options.courtType, options.leagueSettings);
  const settings = createShotchartSettings(league);

  let currentData: ZoneData[] = options.data;
  let currentTheme: Theme = options.theme ?? "red-green";
  let currentBackground: BackgroundTheme = options.backgroundTheme ?? "light";

  const root = select(svg)
    .attr("width", settings.width)
    .attr("viewBox", `0 0 ${settings.courtWidth} ${settings.visibleCourtLength()}`);

  const base = root.append("g").attr("class", "shot-chart-court");

  const courtLines = drawCourt(base, settings);
  const zonePoints = drawZones(base, settings, courtLines);

  const registry = new Map<ZoneKey, ZoneRegistration>();

  // Append polygons + label text once. Setters mutate these references in place.
  for (const key of ZONE_KEYS) {
    const className = ZONE_CLASSNAME[key];
    const points = zonePoints.labeledZones[key];

    const polygon = base
      .append("polygon")
      .attr("class", `shotzone ${className}`)
      .attr("data-zone", key)
      .attr("points", points.map((p) => `${p.x},${p.y}`).join(" "))
      .attr("id", "shotzone") as unknown as PolygonSelection;

    const [cx, cy] = polygonCentroid(points);
    const layout = labelLayout(key, league.leagueId);

    const fgmText = base
      .append("text")
      .attr("class", `${className}-text`)
      .attr("data-zone", key)
      .attr("x", cx + layout.left + layout.right)
      .attr("y", cy + layout.top)
      .style("text-anchor", "middle") as unknown as TextSelection;

    const pctText = base
      .append("text")
      .attr("class", `${className}-text`)
      .attr("data-zone", key)
      .attr("x", cx + layout.left + layout.right)
      .attr("y", cy + layout.bottom)
      .style("text-anchor", "middle") as unknown as TextSelection;

    registry.set(key, { code: ZONE_CODE[key], polygon, fgmText, pctText });
  }

  function applyState(): void {
    const palette = currentTheme === "blue-orange" ? orangeBluePalette : redGreenPalette;
    const classFn =
      currentTheme === "blue-orange" ? percentileTextClassBlueOrange : percentileTextClass;

    for (const entry of registry.values()) {
      const existing = findZoneData(entry.code, currentData);
      const zoneData: ZoneData = existing ?? {
        fga: 0,
        fgm: 0,
        percentile: -1,
        bucket: entry.code,
      };
      const textId = classFn(zoneData.percentile, currentBackground);

      entry.polygon.style("fill", zoneColor(zoneData.percentile, palette));
      entry.fgmText.text(`${zoneData.fgm}/${zoneData.fga}`).attr("id", textId);
      entry.pctText.text(formatPercentage(zoneData.fgm, zoneData.fga)).attr("id", textId);
    }
  }

  applyState();

  return {
    setData(data: ZoneData[]): void {
      currentData = data;
      applyState();
    },
    setTheme(theme: Theme): void {
      currentTheme = theme;
      applyState();
    },
    setBackground(backgroundTheme: BackgroundTheme): void {
      currentBackground = backgroundTheme;
      applyState();
    },
    destroy(): void {
      base.remove();
    },
  };
}
