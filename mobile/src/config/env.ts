import Constants from "expo-constants";
import { Platform } from "react-native";

const extra = Constants.expoConfig?.extra ?? {};
const hostUri = Constants.expoConfig?.hostUri;
const devHost = hostUri?.split(":")[0];
const fallbackUrl =
  Platform.OS === "web" ? "http://localhost:5230/api" : "http://10.0.2.2:5230/api";

export const API_BASE_URL =
  (extra.apiBaseUrl as string | undefined) ??
  (devHost ? `http://${devHost}:5230/api` : fallbackUrl);
