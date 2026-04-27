import { api } from "@/services/api/client";
import { AuthResponse } from "@/services/api/types";

interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  login: async (payload: LoginPayload) => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },
  register: async (payload: LoginPayload) => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },
};
