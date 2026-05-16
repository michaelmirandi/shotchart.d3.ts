# shotchart.d3.ts

Framework-agnostic basketball shotchart primitives built on D3. Renders to any SVG element — works in React, Vue, Svelte, vanilla JS, anything that can hand you a `<svg>`.

- **NBA and NCAA court dimensions** — pixel-accurate three-point arcs, restricted area, key marks
- **Zoned shotchart** with 14 standard buckets — corner threes, above-the-break threes, midrange, floater, rim
- **Targeted updates** — `setData()`, `setTheme()`, `setBackground()` mutate the existing DOM instead of rebuilding
- **~13 KB minified** (ESM, d3 externalized)
- **Dual CJS + ESM**, full `.d.ts` declarations
- **Zero framework dependencies**

## Install

```bash
pnpm add shotchart.d3.ts
# or
npm install shotchart.d3.ts
# or
yarn add shotchart.d3.ts
```

D3 modules (`d3-selection`, `d3-scale`, `d3-shape`, `d3-array`) are declared as runtime dependencies and installed automatically.

## Stylesheet

The chart relies on a small stylesheet for court strokes and zone label sizing. Import it once at your app entry:

```ts
import "shotchart.d3.ts/styles.css";
```

## Halfcourt

A static court diagram, no data.

```ts
import { createHalfcourt } from "shotchart.d3.ts";

const svg = document.querySelector<SVGSVGElement>("#my-court");
const chart = createHalfcourt(svg!, { courtType: "nba" });

// later
chart.destroy();
```

### `createHalfcourt(svg, options?)`

| Option           | Type                       | Default | Notes                                                       |
| ---------------- | -------------------------- | ------- | ----------------------------------------------------------- |
| `courtType`      | `"nba" \| "college"`       | `"nba"` | Picks the dimension preset.                                 |
| `leagueSettings` | `LeagueSettings`           | —       | Override the preset with a custom league. Wins over `courtType`. |

Returns `{ destroy(): void }`.

## Zoned shotchart

A court with 14 shooting zones colored by percentile and labeled with FGM / FGA + FG%.

```ts
import { createZonedShotchart, type ZoneData } from "shotchart.d3.ts";
import "shotchart.d3.ts/styles.css";

const data: ZoneData[] = [
  { bucket: "RIM",   fgm: 18, fga: 24, percentile: 88 },
  { bucket: "R-C3",  fgm: 4,  fga: 11, percentile: 42 },
  { bucket: "M-ATB", fgm: 7,  fga: 19, percentile: 61 },
  // ...one entry per zone you have stats for
];

const chart = createZonedShotchart(svg, {
  courtType: "nba",
  theme: "red-green",
  backgroundTheme: "light",
  data,
});

// Update without rebuilding the DOM
chart.setData(newData);
chart.setTheme("blue-orange");
chart.setBackground("dark");

// Clean up
chart.destroy();
```

### `createZonedShotchart(svg, options)`

| Option            | Type                             | Default       | Notes                                                                 |
| ----------------- | -------------------------------- | ------------- | --------------------------------------------------------------------- |
| `data`            | `ZoneData[]`                     | required      | One entry per zone you have stats for. Missing zones render as empty. |
| `courtType`       | `"nba" \| "college"`             | `"nba"`       |                                                                       |
| `leagueSettings`  | `LeagueSettings`                 | —             | Override the preset.                                                  |
| `theme`           | `"red-green" \| "blue-orange"`   | `"red-green"` | Color palette for percentile fills.                                   |
| `backgroundTheme` | `"dark" \| "light"`              | `"light"`     | Drives text styling for empty zones so labels remain legible.         |

Returns `{ setData, setTheme, setBackground, destroy }`.

### `ZoneData`

```ts
interface ZoneData {
  bucket: ShotchartZone;  // see codes below
  fgm: number;
  fga: number;
  percentile: number;     // 0–100, or -1 for "no data"
}
```

### Zone codes

| Code     | Zone                            |
| -------- | ------------------------------- |
| `R-C3`   | Right corner three              |
| `L-C3`   | Left corner three               |
| `R-ATB`  | Right above-the-break three     |
| `L-ATB`  | Left above-the-break three      |
| `M-ATB`  | Middle above-the-break three    |
| `RB-MR`  | Right baseline midrange         |
| `LB-MR`  | Left baseline midrange          |
| `RW-MR`  | Right wing midrange             |
| `LW-MR`  | Left wing midrange              |
| `M-MR`   | Middle midrange                 |
| `R-FL`   | Right floater range             |
| `L-FL`   | Left floater range              |
| `M-FL`   | Middle floater range            |
| `RIM`    | Restricted area / rim           |

## React wrapper

The library doesn't ship a React wrapper, but writing one is straightforward:

```tsx
import { useEffect, useRef } from "react";
import {
  createZonedShotchart,
  type ZoneData,
  type ZonedShotchartInstance,
} from "shotchart.d3.ts";
import "shotchart.d3.ts/styles.css";

interface Props {
  data: ZoneData[];
  courtType?: "nba" | "college";
  theme?: "red-green" | "blue-orange";
  backgroundTheme?: "dark" | "light";
}

export function ZonedShotchart(props: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const chartRef = useRef<ZonedShotchartInstance | null>(null);

  // Create once per court type — structural changes only
  useEffect(() => {
    if (!svgRef.current) return;
    chartRef.current = createZonedShotchart(svgRef.current, props);
    return () => chartRef.current?.destroy();
  }, [props.courtType]);

  // Cheap updates
  useEffect(() => { chartRef.current?.setData(props.data); }, [props.data]);
  useEffect(() => { props.theme && chartRef.current?.setTheme(props.theme); }, [props.theme]);
  useEffect(() => {
    props.backgroundTheme && chartRef.current?.setBackground(props.backgroundTheme);
  }, [props.backgroundTheme]);

  return <svg ref={svgRef} />;
}
```

## Other exports

For custom integrations — legend rendering, alternate palettes, etc:

```ts
import {
  // presets
  nbaSettings,
  collegeSettings,

  // palettes
  redGreenPalette,
  orangeBluePalette,

  // color helpers
  createColorScale,
  zoneColor,

  // pure utilities
  polygonCentroid,
  formatPercentage,
} from "shotchart.d3.ts";
```

## Development

```bash
pnpm install
pnpm build       # tsup → dist/
pnpm typecheck   # tsc --noEmit
pnpm lint        # biome check --write
```

## Roadmap

- Individual shot plotting (one dot per shot)
- Hexbin density shotchart
- Fullcourt with player tracking

## License

ISC © Michael Mirandi
