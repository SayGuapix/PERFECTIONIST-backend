import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/api/auth-service";
import { useAuthStore } from "@/store/auth-store";

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      await setSession(data.token);
    },
  });
}

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: authService.register,
    onSuccess: async (data) => {
      await setSession(data.token);
    },
  });
}
