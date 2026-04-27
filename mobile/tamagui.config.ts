import { createTamagui } from "tamagui";
import { config } from "@tamagui/config";

const tamaguiConfig = createTamagui({
  ...config,
  defaultTheme: "light",
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      background: "#f6f8fb",
      color: "#0f172a",
      primary: "#2563eb",
      secondary: "#14b8a6",
    },
    dark: {
      ...config.themes.dark,
      background: "#020617",
      color: "#e2e8f0",
      primary: "#60a5fa",
      secondary: "#2dd4bf",
    },
  },
});

export default tamaguiConfig;
