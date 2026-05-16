export type CourtType = "nba" | "college";

export type BackgroundTheme = "dark" | "light";

export type Theme = "blue-orange" | "red-green";

export type ShotchartZone =
  | "R-C3"
  | "L-C3"
  | "R-ATB"
  | "L-ATB"
  | "M-ATB"
  | "RB-MR"
  | "LB-MR"
  | "RW-MR"
  | "LW-MR"
  | "M-MR"
  | "L-FL"
  | "R-FL"
  | "M-FL"
  | "RIM";

export type ShotchartZoneClassName =
  | "right-corner-three-zone"
  | "left-corner-three-zone"
  | "right-three-zone"
  | "left-three-zone"
  | "middle-three-zone"
  | "right-baseline-midrange-zone"
  | "left-baseline-midrange-zone"
  | "right-wing-midrange-zone"
  | "left-wing-midrange-zone"
  | "middle-midrange-zone"
  | "left-floater-zone"
  | "right-floater-zone"
  | "middle-floater-zone"
  | "rim-zone";

export interface Point {
  x: number;
  y: number;
}

export interface LeagueSettings {
  leagueId: "nba" | "college";
  keyWidth: number;
  keyMarks: number[];
  threePointCutOffLength: number;
  threePointRadius: number;
  threePointSideRadius: number;
  leftThreeInside: Point;
  rightThreeInside: Point;
}

export interface ShotchartSettings {
  basketDiameter: number;
  basketProtrusionLength: number;
  basketWidth: number;
  courtLength: number;
  courtWidth: number;
  freeThrowLineLength: number;
  freeThrowCircleRadius: number;
  keyMarkWidth: number;
  restrictedCircleRadius: number;
  leagueSettings: LeagueSettings;
  width: string;
  floaterRange: number;
  rimRange: number;
  leftBaselineMidrangeInside: Point;
  rightBaselineMidrangeInside: Point;
  rightWingMidrangeInside: Point;
  leftWingMidrangeInside: Point;
  rightFloaterInside: Point;
  leftFloaterInside: Point;
  visibleCourtLength: () => number;
  shotchartNumber: number;
}

export interface CourtLines {
  threePointLineXY: Point[];
  restrictedAreaXY: Point[];
  ftOutXY: Point[];
  floaterXY: Point[];
  rimXY: Point[];
}

export type CourtLineKey = keyof CourtLines;

export interface Zone {
  className: string;
  points: Point[];
}

export type LabeledZones = Record<string, Point[]>;

export interface ZonePoints {
  labeledZones: LabeledZones;
  zones: Zone[];
}

export interface ZoneData {
  bucket: ShotchartZone;
  fgm: number;
  fga: number;
  percentile: number;
}

export interface DrawCourtResult {
  base: any;
  courtLines: CourtLines;
}
