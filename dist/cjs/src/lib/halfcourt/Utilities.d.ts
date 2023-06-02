import { ICourtLines } from "../zoned-shotchart/Interfaces";
import { IDrawCourt, IShotchartSettings } from "./Interfaces";
export declare function appendArcPath(base: any, radius: number, startAngle: number, endAngle: number, translateX?: number, translateY?: number, xyState?: string, courtLines?: ICourtLines): any;
export declare function drawCourt(shotchartSettings: IShotchartSettings, node: any): IDrawCourt;
