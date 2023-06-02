import * as React from "react";

import "../../css/main.css";
import { IZonedShotchart } from "../../lib/zoned-shotchart/Interfaces";
import { drawCourt } from "../../lib/halfcourt/Utilities";
import {
  createSectionedZones,
  labelShotZones,
} from "../../lib/zoned-shotchart/Utilities";
import { orangeBlueTheme, redGreenTheme } from "../../lib/halfcourt/Theme";
import {
  COLL_SETTINGS,
  NBA_SETTINGS,
  SHOTCHART_SETTINGS,
} from "../../lib/halfcourt/Constants";
import { getSalt } from "../../utilities/Random";

export const ZonedShotchart: React.FC<IZonedShotchart> = (props) => {
  const containerRef = React.useRef<SVGSVGElement | null>(null);

  const id = `shotchart-${props.id}`

  React.useEffect(() => {
    if (containerRef.current) {
      let svg = document.getElementById(id);
      console.log(`shotchart-${props.id}`)
      if (svg) svg.innerHTML = "";
      const selectedTheme = props.theme
        ? props.theme === "B/O"
          ? orangeBlueTheme
          : redGreenTheme
        : redGreenTheme;
      const chartSettings = SHOTCHART_SETTINGS(
        props.courtType === "NBA" ? NBA_SETTINGS : COLL_SETTINGS,
        props.id
      );
      const {courtLines, base} = drawCourt(chartSettings, containerRef);
      const zonePoints = createSectionedZones(
        chartSettings,
        base,
        courtLines
      );
      labelShotZones(
        chartSettings,
        base,
        zonePoints,
        props.data,
        selectedTheme,
        props.backgroundTheme
      );
    }

  }, [props.theme, props.backgroundTheme, props.data, props.courtType, containerRef]);

  return (
    <svg
      ref={containerRef}
      width="100%"
      id={id}
    ></svg>
  );
};
