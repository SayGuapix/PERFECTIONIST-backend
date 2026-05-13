import { createTamagui } from "tamagui";
import { config } from "@tamagui/config";

const tamaguiConfig = createTamagui({
  ...config,
  defaultTheme: "dark",
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      background: "#ffffff",
      color: "#050505",
      primary: "#050505",
      secondary: "#737373",
    },
    dark: {
      ...config.themes.dark,
      background: "#070b14",
      color: "#f8fafc",
      primary: "#34d399",
      secondary: "#9fb6d8",
    },
  },
});

export default tamaguiConfig;
