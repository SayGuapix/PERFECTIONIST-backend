import Constants from "expo-constants";
import { Platform } from "react-native";

const extra = Constants.expoConfig?.extra ?? {};
const hostUri = Constants.expoConfig?.hostUri;
const devHost = hostUri?.split(":")[0];
const fallbackUrl =
  Platform.OS === "web" ? "http://localhost:5230/api" : "http://10.0.2.2:5230/api";
const configuredApiUrl = extra.apiBaseUrl as string | undefined;
const inferredApiUrl =
  Platform.OS === "web"
    ? fallbackUrl
    : devHost
      ? `http://${devHost}:5230/api`
      : fallbackUrl;

export const API_BASE_URL =
  configuredApiUrl && configuredApiUrl.trim().length > 0
    ? configuredApiUrl
    : inferredApiUrl;
