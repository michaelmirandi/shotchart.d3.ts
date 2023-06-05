import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Box } from "@mui/material";
import { ZonedShotchart } from "./ZonedShotchart";
import { exampleZonedShotchartData } from "../../lib/zoned-shotchart/ExampleData";
import { getSalt } from "../../utilities/Random";

export default {
  title: "Example/Zoned Shotchart",
  component: ZonedShotchart,
  parameters: {
    id: { default: getSalt() },
  },
} as Meta<typeof ZonedShotchart>;

const Template: StoryFn<typeof ZonedShotchart> = (args) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box sx={{ width: "45%" }}>
      <ZonedShotchart {...args} id={getSalt()} />
    </Box>
  </Box>
);

export const Red_Green_Style = Template.bind({});
Red_Green_Style.args = {
  data: exampleZonedShotchartData,
  id: getSalt(),
  courtType: "NBA",
  theme: "R/G",
  backgroundTheme: "Light",
};

export const Blue_Orange_Style = Template.bind({});
Blue_Orange_Style.args = {
  data: exampleZonedShotchartData,
  id: getSalt(),
  courtType: "NBA",
  theme: "B/O",
  backgroundTheme: "Light",
};
