import { createTamagui } from "tamagui";
import { config } from "@tamagui/config";

const tamaguiConfig = createTamagui({
  ...config,
  defaultTheme: "light",
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
      background: "#050505",
      color: "#ffffff",
      primary: "#ffffff",
      secondary: "#a3a3a3",
    },
  },
});

export default tamaguiConfig;
