import axios from "axios";
import { API_BASE_URL } from "@/config/env";
import { useAuthStore } from "@/store/auth-store";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error?.response) {
      return Promise.reject(
        new Error(
          `No se pudo conectar con el servidor (${API_BASE_URL}). Verifica que la API este encendida y accesible.`
        )
      );
    }

    const validationError = error.response.data?.errors?.[0]?.error;
    const message =
      error?.response?.data?.message ??
      validationError ??
      `El servidor respondio con error ${error.response.status}.`;
    return Promise.reject(new Error(message));
  }
);
