import { ICourtLocation, IShotchart } from "../halfcourt/Interfaces";
import { ShotchartZone } from "./Types";

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

export interface ICourtLines {
  [index: string]: ICourtLocation[];
}

export interface IZoneData {
  bucket: ShotchartZone;
  fgm: number;
  fga: number;
  percentile: number;
}
