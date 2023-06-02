import { ICourt, ICourtLocation, ThemeType } from "../halfcourt/Interfaces";
import { ShotchartBackgroundTheme } from "../halfcourt/Types";
import { ShotchartZone } from "./Types";
export interface IZonedShotchart extends ICourt {
    data: IZoneData[];
    theme: ThemeType;
    backgroundTheme: ShotchartBackgroundTheme;
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
export interface ICourtLines {
    [index: string]: ICourtLocation[];
}
export interface IZoneData {
    bucket: ShotchartZone;
    fgm: number;
    fga: number;
    percentile: number;
}
