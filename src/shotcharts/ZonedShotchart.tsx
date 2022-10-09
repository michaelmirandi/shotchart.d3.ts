import * as React from "react";
import { drawCourt } from "../utilities/Utilities";
import {
  IShotchartLinesContext,
  IZonedShotchart,
  IZonedShotchartContext,
} from "../utilities/Interfaces";
import {
  ShotchartLinesContext,
  ZonedShotchartContext,
} from "../utilities/Context";
import "../css/main.css";
import { orangeBlueTheme, redGreenTheme } from "../utilities/Themes";

export const ZonedShotchart: React.FC<IZonedShotchart> = (props) => {
  const linesContext = React.useContext<IShotchartLinesContext>(
    ShotchartLinesContext
  );
  const zoneContext = React.useContext<IZonedShotchartContext>(
    ZonedShotchartContext(props.data)
  );
  const containerRef = React.useRef();
  React.useEffect(() => {
    let svg = document.getElementById("shotchart-container");
    if (svg) svg.innerHTML = "";
    drawCourt(
      props.chartSettings,
      containerRef,
      linesContext,
      props.theme
        ? props.theme === "B/O"
          ? orangeBlueTheme
          : redGreenTheme
        : redGreenTheme,
      zoneContext
    );
  }, [props.theme]);

  React.useEffect(() => {}, [props.data]);
  return (
    // @ts-ignore
    <svg ref={containerRef} width="100%" id="shotchart-container"></svg>
  );
};
