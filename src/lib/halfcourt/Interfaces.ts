import { ICourtLines } from "../zoned-shotchart/Interfaces";
import { CourtType, ShotchartBackgroundTheme } from "./Types";

export interface ICourtLocation {
  x: number;
  y: number;
}

export type ThemeType = "B/O" | "R/G";

export interface ILeagueSettings {
  leagueId: string;
  keyWidth: number;
  keyMarks: number[];
  threePointCutOffLength: number;
  threePointRadius: number;
  threePointSideRadius: number;
  leftThreeInside: ICourtLocation;
  rightThreeInside: ICourtLocation;
}

export interface IShotchartSettings {
  basketDiameter: number;
  basketProtrusionLength: number;
  basketWidth: number;
  courtLength: number;
  courtWidth: number;
  freeThrowLineLength: number;
  freeThrowCircleRadius: number;
  keyMarkWidth: number;
  restrictedCircleRadius: number;
  leagueSettings: ILeagueSettings;
  width: string;
  floaterRange: number;
  rimRange: number;
  leftBaselineMidrangeInside: ICourtLocation;
  rightBaselineMidrangeInside: ICourtLocation;
  rightWingMidrangeInside: ICourtLocation;
  leftWingMidrangeInside: ICourtLocation;
  rightFloaterInside: ICourtLocation;
  leftFloaterInside: ICourtLocation;
  visibleCourtLength(): number;
  shotchartNumber: number;
}

export interface ICourt {
  id: number;
  courtType: CourtType;
}

export interface IDrawCourt {
  base: any;
  courtLines: ICourtLines;
}
