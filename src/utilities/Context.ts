import { IShotchartLinesContext, IZonedShotchartContext } from './Interfaces';
import * as React from 'react';

export const ShotchartLinesContext =
  React.createContext<IShotchartLinesContext>({
    threePointLineXY: [],
    restrictedAreaXY: [],
    ftOutXY: [],
    floaterXY: [],
    rimXY: []
  });

  export const ZonedShotchartContext =
  React.createContext<IZonedShotchartContext>({
    visibleShotData: []
  });