import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "perfectionist.jwt";

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
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    set({ token, name: name ?? null });
  },
  clearSession: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ token: null, name: null });
  },
  hydrate: async () => {
    // Comentario: Restauramos sesión al iniciar la app.
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    set({ token, isReady: true });
  },
}));
