# shotchart.d3.ts

A package offering easy to use React shotcharts. Collegiate & NBA court dimensions are currently supported. Dependencies are React & D3. 

## Installation

```bash
npm i shotchart.d3.ts
```

## Usage

### Zoned NBA Shotchart
```typescript
import * as React from 'react';
import {
  SHOTCHART_SETTINGS,
  NBA_SETTINGS,
  ZonedShotchart,
  zonedShotchartData
} from "shotchart.d3.ts";

const ZonedNbaShotchartExample: React.FC = () => {
    <ZonedShotchart
        chartSettings={SHOTCHART_SETTINGS(NBA_SETTINGS, 1)}
        data={zonedShotchartData}
    />
}
```

### Zoned College Shotchart
```typescript
import * as React from 'react';
import {
  SHOTCHART_SETTINGS,
  COLL_SETTINGS,
  ZonedShotchart,
  zonedShotchartData
} from "shotchart.d3.ts";

const ZonedCollegeShotchartExample: React.FC = () => {
    <ZonedShotchart
        chartSettings={SHOTCHART_SETTINGS(COLL_SETTINGS, 1)}
        data={zonedShotchartData}
    />
}
```


## Upcoming Features
- Density Shotchart
- Hexbin Shotchart
- Full-court charts with interactive players
