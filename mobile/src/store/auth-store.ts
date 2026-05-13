import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { API_BASE_URL } from "@/config/env";

const TOKEN_KEY = "perfectionist.jwt";
const API_URL_KEY = "perfectionist.api-url";

const tokenStorage = {
  getItem: async () => {
    if (Platform.OS === "web") {
      return globalThis.localStorage?.getItem(TOKEN_KEY) ?? null;
    }

    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  setItem: async (token: string) => {
    if (Platform.OS === "web") {
      globalThis.localStorage?.setItem(TOKEN_KEY, token);
      globalThis.localStorage?.setItem(API_URL_KEY, API_BASE_URL);
      return;
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(API_URL_KEY, API_BASE_URL);
  },
  getApiUrl: async () => {
    if (Platform.OS === "web") {
      return globalThis.localStorage?.getItem(API_URL_KEY) ?? null;
    }

    return SecureStore.getItemAsync(API_URL_KEY);
  },
  removeItem: async () => {
    if (Platform.OS === "web") {
      globalThis.localStorage?.removeItem(TOKEN_KEY);
      globalThis.localStorage?.removeItem(API_URL_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(API_URL_KEY);
  },
};

interface AuthState {
  token: string | null;
  name: string | null;
  isReady: boolean;
  setSession: (token: string, name?: string | null) => Promise<void>;
  clearSession: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  name: null,
  isReady: false,
  setSession: async (token, name) => {
    await tokenStorage.setItem(token);
    set({ token, name: name ?? null });
  },
  clearSession: async () => {
    await tokenStorage.removeItem();
    set({ token: null, name: null });
  },
  hydrate: async () => {
    const token = await tokenStorage.getItem();
    const savedApiUrl = await tokenStorage.getApiUrl();

    if (token && savedApiUrl !== API_BASE_URL) {
      await tokenStorage.removeItem();
      set({ token: null, name: null, isReady: true });
      return;
    }

    set({ token, isReady: true });
  },
}));
