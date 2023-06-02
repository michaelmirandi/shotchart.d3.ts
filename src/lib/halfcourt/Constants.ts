import { ILeagueSettings, IShotchartSettings } from "./Interfaces";

export function SHOTCHART_SETTINGS(
  _leagueSettings: ILeagueSettings,
  _shotchartNumber: number
): IShotchartSettings {
  return {
    basketDiameter: 1.5,
    basketProtrusionLength: 4,
    basketWidth: 6,
    courtLength: 94,
    courtWidth: 50,
    freeThrowLineLength: 19,
    freeThrowCircleRadius: 6,
    keyMarkWidth: 0.66,
    restrictedCircleRadius: 4,
    leagueSettings: _leagueSettings,
    width: "100%",
    floaterRange: 14.18,
    rimRange: 5,
    leftBaselineMidrangeInside: {
      x: (145.99621 + 250) / 10,
      y: 81.94051 / 10,
    },
    rightBaselineMidrangeInside: {
      x: (-145.99621 + 250) / 10,
      y: 81.94051 / 10,
    },
    rightWingMidrangeInside: {
      x: (68.29851 + 250) / 10,
      y: 172.92448 / 10,
    },
    leftWingMidrangeInside: {
      x: (-68.29851 + 250) / 10,
      y: 172.92448 / 10,
    },
    rightFloaterInside: {
      x: (25.4622 + 250) / 10,
      y: 90.53112 / 10,
    },
    leftFloaterInside: {
      x: (-25.4622 + 250) / 10,
      y: 90.53112 / 10,
    },
    visibleCourtLength: (): number => {
      let halfCourtLength = 94 / 2;
      // length of three point line away from basket
      let threePointLength = _leagueSettings.threePointRadius + 4;
      // visible court does not include the entire halfcourt (Heaves not included)
      // can adjust this depending on whether or not we want deep threes included
      return threePointLength + (halfCourtLength - threePointLength) / 2;
    },
    shotchartNumber: _shotchartNumber,
  };
}

export const COLL_SETTINGS: ILeagueSettings = {
  leagueId: "COLL",
  keyWidth: 12,
  keyMarks: [11, 14, 17],
  threePointCutOffLength: 9.865,
  threePointRadius: 22.146,
  threePointSideRadius: 21.55,
  leftThreeInside: {
    x: (-112.77716 + 250) / 10,
    y: 238.0934 / 10,
  },
  rightThreeInside: {
    x: (-112.77716 + 250) / 10,
    y: 238.0934 / 10,
  },
};

export const NBA_SETTINGS: ILeagueSettings = {
  leagueId: "NBA",
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
