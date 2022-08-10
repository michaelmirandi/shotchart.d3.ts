import * as React from "react";
import { drawCourt } from "../utilities/Utilities";
import {
  IShotchart,
  IShotchartLinesContext,
  IZoneData,
  IZonedShotchart,
  IZonedShotchartContext,
} from "../utilities/Interfaces";
import {
  ShotchartLinesContext,
  ZonedShotchartContext,
} from "../utilities/Context";
import "../css/main.css";

export const ZonedShotchart: React.FC<IZonedShotchart> = (props) => {
  const linesContext = React.useContext<IShotchartLinesContext>(
    ShotchartLinesContext
  );
  const zoneContext = React.useContext<IZonedShotchartContext>(
    ZonedShotchartContext(props.data)
  );
  const containerRef = React.useRef();
  React.useEffect(() => {
    drawCourt(props.chartSettings, containerRef, linesContext, zoneContext);
  }, []);

  React.useEffect(() => {}, [props.data]);
  return (
    // @ts-ignore
    <svg ref={containerRef} width="100%" id="shotchart-container"></svg>
  );
};
