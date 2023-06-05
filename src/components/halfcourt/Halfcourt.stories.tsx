import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Box } from "@mui/material";
import { Halfcourt } from "./Halfcourt";
import { getSalt } from "../../utilities/Random";
import "../../css/main.css";

export default {
  title: "Example/Halfcourt",
  component: Halfcourt,
  parameters: {
    id: { default: getSalt() },
  },
} as Meta<typeof Halfcourt>;

const Template: StoryFn<typeof Halfcourt> = (args) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box sx={{ width: "45%" }}>
      <Halfcourt {...args} id={getSalt()} />
    </Box>
  </Box>
);

export const HalfcourtExample = Template.bind({});
HalfcourtExample.args = {
  id: getSalt(),
  courtType: "NBA",
};
