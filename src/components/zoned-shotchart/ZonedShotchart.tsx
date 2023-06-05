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

/**
The `ZonedShotchart` is a functional component in React that visualizes a basketball shot chart with different zones on the court. 

## Imports

The component imports a CSS file for styling, several utility functions for drawing the court and labeling shot zones, two theme files for color customization, settings constants for different court types, and a helper function for generating random values. It also imports `IZonedShotchart`, an interface file that defines the shape of the props the `ZonedShotchart` component expects.

## Props

The `ZonedShotchart` component takes the following props:

- `id`: A unique identifier for the shot chart.
- `courtType`: Type of the court (either "NBA" or "COLL").
- `theme`: The color theme of the shot chart ("B/O" for blue/orange, or other values for red/green).
- `backgroundTheme`: The color theme of the background, used to style zone labels with missing percentiles.
- `data`: The data for the shots to be displayed on the shot chart.

## Functionality

On mount and whenever `props.theme`, `props.backgroundTheme`, `props.data`, or `props.courtType` changes, the component first clears any existing SVG with the same id, then creates a new shot chart. The shot chart is drawn with `drawCourt()`, which returns objects representing the court lines and the base of the court. `createSectionedZones()` is then called to create the different shot zones on the court. `labelShotZones()` is used to label the shot zones based on the `props.data`. The colors of the shot chart and the background are determined by the `props.theme` and `props.backgroundTheme`, respectively. The size and dimensions of the court are determined by the `props.courtType`, with different settings for NBA and college courts. All graphical elements are appended to an SVG element, which is then rendered to the DOM.

## Rendering

The component renders an SVG element with a width of 100% and an id based on `props.id`. The SVG element has a `ref` attached to it, which is used to manipulate its contents in the `useEffect` hook.
*/
export const ZonedShotchart: React.FC<IZonedShotchart> = (props) => {
  const containerRef = React.useRef<SVGSVGElement | null>(null);

  const id = `shotchart-${props.id}`;

  React.useEffect(() => {
    if (containerRef.current) {
      let svg = document.getElementById(id);
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
      const { courtLines, base } = drawCourt(chartSettings, containerRef);
      const zonePoints = createSectionedZones(chartSettings, base, courtLines);
      labelShotZones(
        chartSettings,
        base,
        zonePoints,
        props.data,
        selectedTheme,
        props.backgroundTheme
      );
    }
  }, [
    props.theme,
    props.backgroundTheme,
    props.data,
    props.courtType,
    containerRef,
  ]);

  return <svg ref={containerRef} width="100%" id={id}></svg>;
};
