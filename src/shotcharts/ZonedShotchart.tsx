import * as React from 'react';
import { drawCourt } from '../utilities/Utilities';
import { IShotchart, IShotchartLinesContext } from '../utilities/Interfaces';
import { ShotchartLinesContext } from '../utilities/Context';

export const ZonedShotchart: React.FC<IShotchart> = (props) => {
  const globalContext = React.useContext<IShotchartLinesContext>(
    ShotchartLinesContext
  );
  const containerRef = React.useRef();
  React.useEffect(() => {
    drawCourt(props.chartSettings, containerRef, globalContext);
  }, []);

  React.useEffect(() => {
    // draw stuff here...
  }, [props.data]);
  return <svg ref={containerRef.current} width="100%"></svg>;
};
