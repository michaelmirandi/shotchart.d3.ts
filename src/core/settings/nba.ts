import type { LeagueSettings } from "../types";

export const nbaSettings: LeagueSettings = {
  leagueId: "nba",
  keyWidth: 16,
  keyMarks: [7, 8, 11, 14],
  threePointCutOffLength: 13.9,
  threePointRadius: 23.75,
  threePointSideRadius: 21.91,
  leftThreeInside: {
    x: (-120.94543 + 250) / 10,
    y: 251.89778 / 10,
  },
  rightThreeInside: {
    x: (-120.94543 + 250) / 10,
    y: 251.89778 / 10,
  },
};
