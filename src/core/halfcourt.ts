import { type Selection, select } from "d3-selection";
import { appendArcPath } from "./geometry/arcs";
import { createShotchartSettings } from "./settings/chart";
import { collegeSettings } from "./settings/college";
import { nbaSettings } from "./settings/nba";
import type {
  CourtLines,
  CourtType,
  HalfcourtInstance,
  HalfcourtOptions,
  LeagueSettings,
  ShotchartSettings,
} from "./types";

type CourtSelection = Selection<SVGGElement, unknown, null, undefined>;

const COURT_GROUP_CLASS = "shot-chart-court";

function resolveLeagueSettings(
  courtType: CourtType | undefined,
  override: LeagueSettings | undefined,
): LeagueSettings {
  if (override) return override;
  return courtType === "college" ? collegeSettings : nbaSettings;
}

/**
 * Render the court onto an existing `<g>` element. Returns the court line
 * point arrays that the zoned shotchart needs to partition shooting zones.
 */
export function drawCourt(base: CourtSelection, settings: ShotchartSettings): CourtLines {
  const courtLines: CourtLines = {
    threePointLineXY: [],
    restrictedAreaXY: [],
    ftOutXY: [],
    floaterXY: [],
    rimXY: [],
  };

  base
    .append("rect")
    .attr("class", "shot-chart-court-key")
    .attr("x", settings.courtWidth / 2 - settings.leagueSettings.keyWidth / 2)
    .attr("y", settings.visibleCourtLength() - settings.freeThrowLineLength)
    .attr("width", settings.leagueSettings.keyWidth)
    .attr("height", settings.freeThrowLineLength);

  base
    .append("line")
    .attr("class", "shot-chart-court-baseline")
    .attr("x1", 0)
    .attr("y1", settings.visibleCourtLength())
    .attr("x2", settings.courtWidth)
    .attr("y2", settings.visibleCourtLength());

  const tpAngle = Math.atan(
    settings.leagueSettings.threePointSideRadius /
      (settings.leagueSettings.threePointCutOffLength -
        settings.basketProtrusionLength -
        settings.basketDiameter / 2),
  );

  const basketCenterY =
    settings.visibleCourtLength() - settings.basketProtrusionLength - settings.basketDiameter / 2;

  appendArcPath(
    base,
    settings.leagueSettings.threePointRadius,
    -tpAngle,
    tpAngle,
    settings.courtWidth / 2,
    basketCenterY,
    "threePointLineXY",
    courtLines,
  )
    .attr("class", "shot-chart-court-3pt-line")
    .attr("transform", `translate(${settings.courtWidth / 2}, ${basketCenterY})`);

  for (const n of [1, -1]) {
    base
      .append("line")
      .attr("class", "shot-chart-court-3pt-line")
      .attr("x1", settings.courtWidth / 2 + settings.leagueSettings.threePointSideRadius * n)
      .attr("y1", settings.visibleCourtLength() - settings.leagueSettings.threePointCutOffLength)
      .attr("x2", settings.courtWidth / 2 + settings.leagueSettings.threePointSideRadius * n)
      .attr("y2", settings.visibleCourtLength());
  }

  appendArcPath(
    base,
    settings.restrictedCircleRadius,
    -Math.PI / 2,
    Math.PI / 2,
    settings.courtWidth / 2,
    basketCenterY,
    "restrictedAreaXY",
    courtLines,
  )
    .attr("class", "shot-chart-court-restricted-area")
    .attr("transform", `translate(${settings.courtWidth / 2}, ${basketCenterY})`);

  const ftCenterY = settings.visibleCourtLength() - settings.freeThrowLineLength;

  appendArcPath(
    base,
    settings.freeThrowCircleRadius,
    -Math.PI / 2,
    Math.PI / 2,
    settings.courtWidth / 2,
    ftCenterY,
    "ftOutXY",
    courtLines,
  )
    .attr("class", "shot-chart-court-ft-circle-top")
    .attr("transform", `translate(${settings.courtWidth / 2}, ${ftCenterY})`);

  if (settings.leagueSettings.leagueId === "nba") {
    appendArcPath(base, settings.freeThrowCircleRadius, Math.PI / 2, 1.5 * Math.PI)
      .attr("class", "shot-chart-court-ft-circle-bottom")
      .attr("transform", `translate(${settings.courtWidth / 2}, ${ftCenterY})`);
  } else if (settings.leagueSettings.leagueId === "college") {
    for (const offset of [-1, 1] as const) {
      const x =
        offset === -1
          ? settings.courtWidth / 2 - settings.leagueSettings.keyWidth / 2 - 0.66
          : settings.courtWidth / 2 + settings.leagueSettings.keyWidth / 2;
      base
        .append("rect")
        .attr("class", "shot-chart-court-key-block")
        .attr("x", x)
        .attr("y", settings.visibleCourtLength() - 7)
        .attr("width", 0.66)
        .attr("height", 1)
        .style("fill", "black");
    }
  }

  for (const mark of settings.leagueSettings.keyMarks) {
    for (const n of [1, -1]) {
      base
        .append("line")
        .attr("class", "shot-chart-court-key-mark")
        .attr(
          "x1",
          settings.courtWidth / 2 +
            (settings.leagueSettings.keyWidth / 2) * n +
            settings.keyMarkWidth * n,
        )
        .attr("y1", settings.visibleCourtLength() - mark)
        .attr("x2", settings.courtWidth / 2 + (settings.leagueSettings.keyWidth / 2) * n)
        .attr("y2", settings.visibleCourtLength() - mark);
    }
  }

  base
    .append("line")
    .attr("class", "shot-chart-court-backboard")
    .attr("x1", settings.courtWidth / 2 - settings.basketWidth / 2)
    .attr("y1", settings.visibleCourtLength() - settings.basketProtrusionLength)
    .attr("x2", settings.courtWidth / 2 + settings.basketWidth / 2)
    .attr("y2", settings.visibleCourtLength() - settings.basketProtrusionLength);

  base
    .append("circle")
    .attr("class", "shot-chart-court-hoop")
    .attr("cx", settings.courtWidth / 2)
    .attr("cy", basketCenterY)
    .attr("r", settings.basketDiameter / 2);

  return courtLines;
}

/**
 * Mount a static halfcourt onto an SVG element. Returns an instance with a
 * `destroy()` method that removes everything this call appended.
 */
export function createHalfcourt(
  svg: SVGSVGElement,
  options: HalfcourtOptions = {},
): HalfcourtInstance {
  const league = resolveLeagueSettings(options.courtType, options.leagueSettings);
  const settings = createShotchartSettings(league);

  const root = select(svg)
    .attr("width", settings.width)
    .attr("viewBox", `0 0 ${settings.courtWidth} ${settings.visibleCourtLength()}`);

  const base = root.append("g").attr("class", COURT_GROUP_CLASS);

  drawCourt(base, settings);

  return {
    destroy(): void {
      base.remove();
    },
  };
}
