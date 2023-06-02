import { ShotchartBackgroundTheme } from "./Types";

export const redGreenTheme: string[] = [
  "#FF0000",
  "#ff391e",
  "#ff391e",
  "#ff9c7f",
  "#ffbea8",
  "#FFFFFF",
  "#a4c9a1",
  "#7fb37c",
  "#529952",
  "#298633",
  "#007c21",
];

export const orangeBlueTheme: string[] = [
  "#5399fa",
  "#91bdfc",
  "#adcefd",
  "#c8defe",
  "#e0ecfe",
  "#ffffff",
  "#fff0db",
  "#ffe1b7",
  "#ffcf8e",
  "#ffa733",
  "#ff9100",
];

export const percentileText = (
  data: number,
  backgroundTheme: ShotchartBackgroundTheme
) =>
  data <= 15 || data >= 85
    ? "light-shotchart-zone"
    : data == null
    ? `${backgroundTheme === "Dark" ? "dark" : "light"}-empty-shot-zone`
    : "";

export const percentileTextBlueOrange = (
  data: number,
  backgroundTheme: ShotchartBackgroundTheme
) =>
  data <= 10
    ? "light-shotchart-zone"
    : data == null
    ? `${backgroundTheme === "Dark" ? "dark" : "light"}-empty-shot-zone`
    : "";
