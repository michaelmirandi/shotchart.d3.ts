import {
  IShotchartLinesContext,
  IZoneData,
  IZonedShotchartContext,
} from "./Interfaces";
import * as React from "react";

export const ShotchartLinesContext =
  React.createContext<IShotchartLinesContext>({
    threePointLineXY: [],
    restrictedAreaXY: [],
    ftOutXY: [],
    floaterXY: [],
    rimXY: [],
  });

export const ZonedShotchartContext = (data: IZoneData[]) =>
  React.createContext<IZonedShotchartContext>({
    visibleShotData: data,
  });
