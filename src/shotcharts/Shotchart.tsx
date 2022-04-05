import { Box } from '@mui/system';
import * as React from 'react';
import { IShotchartSettings } from '../utilities/Interfaces';

// TO DO...
/*
    Need to change the shotchart data streamline...
    no more views or generating views, data should be on demand
    to create hex & density charts, I need to pull in raw shot data. 
    (for each individual player it's easy...) ex: Gordon has around 10k shots
    should be easy to call in via an api & store the data on the frontend locally
    from the raw shotchart data, use the maths from the previous vw to calculate
        zones... percentiles will be an issue
    create a sql fn that calculates the percentiles for a specific player (also one for the teams) & returns values
*/

export const Shotchart: React.FC<IShotchartSettings> = () => {
  return (
    <Box
      sx={{
        width: '100%'
      }}
    ></Box>
  );
};
