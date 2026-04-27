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
    const message =
      error?.response?.data?.message ??
      "Ocurrio un error de red o del servidor.";
    return Promise.reject(new Error(message));
  }
);
