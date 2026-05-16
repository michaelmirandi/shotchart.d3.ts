import type { LeagueSettings, ShotchartSettings } from "../types";

export function createShotchartSettings(leagueSettings: LeagueSettings): ShotchartSettings {
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
    leagueSettings,
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
      const halfCourtLength = 94 / 2;
      const threePointLength = leagueSettings.threePointRadius + 4;
      return threePointLength + (halfCourtLength - threePointLength) / 2;
    },
  };
}
