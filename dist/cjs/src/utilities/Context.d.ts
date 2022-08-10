import { IShotchartLinesContext, IZoneData, IZonedShotchartContext } from "./Interfaces";
import * as React from "react";
export declare const ShotchartLinesContext: React.Context<IShotchartLinesContext>;
export declare const ZonedShotchartContext: (data: IZoneData[]) => React.Context<IZonedShotchartContext>;
