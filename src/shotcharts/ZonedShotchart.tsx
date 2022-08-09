import * as React from 'react';
import { drawCourt } from '../utilities/Utilities';
import { IShotchart, IShotchartLinesContext } from '../utilities/Interfaces';
import { ShotchartLinesContext } from '../utilities/Context';
import '../css/court.css'

export const ZonedShotchart: React.FC<IShotchart> = (props) => {
  const linesContext = React.useContext<IShotchartLinesContext>(
    ShotchartLinesContext
  );
  const containerRef = React.useRef();
  React.useEffect(() => {
    drawCourt(props.chartSettings, containerRef, linesContext);
  }, []);

  React.useEffect(() => {
    // draw stuff here...
  }, [props.data]);
  return <ShotchartLinesContext.Provider value={linesContext}>
    {/* @ts-ignore */}
    <svg ref={containerRef} width="100%"></svg>;

  </ShotchartLinesContext.Provider>
  
};
