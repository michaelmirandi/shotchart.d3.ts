import { ShotchartZone } from "./Types";
export interface ICourtLocation {
    x: number;
    y: number;
}
export declare type ThemeType = "B/O" | "R/G";
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
export interface IShotchart {
    chartSettings: IShotchartSettings;
    theme?: ThemeType;
}
export interface IZonedShotchart extends IShotchart {
    data: IZoneData[];
}
export interface IZonePoints {
    labeledZones: ILabeledZones;
    zones: IZones[];
}
export interface ILabeledZones {
    [index: string]: ICourtLocation[];
}
export interface IZones {
    className: string;
    points: ICourtLocation[];
}
export interface IShotchartLinesContext {
    [index: string]: ICourtLocation[];
}
export interface IZoneData {
    bucket: ShotchartZone;
    fgm: number;
    fga: number;
    percentile: number;
}
export interface IZonedShotchartContext {
    visibleShotData: IZoneData[];
}
