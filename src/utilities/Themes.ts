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
].reverse();

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
].reverse();

export const percentileText = (data: number) =>
  data <= 15 || data >= 85 ? "light-shotchart-zone"
  : "";

  export const percentileTextBlueOrange = (data: number) =>
  data <= 10 ? "light-shotchart-zone"
          : "";
