import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};

// Comentario: URL base configurable por app config o fallback local.
export const API_BASE_URL =
  (extra.apiBaseUrl as string | undefined) ?? "http://10.0.2.2:5230/api";
