import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "perfectionist.jwt";

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
      return;
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  removeItem: async () => {
    if (Platform.OS === "web") {
      globalThis.localStorage?.removeItem(TOKEN_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY);
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
    set({ token, isReady: true });
  },
}));
