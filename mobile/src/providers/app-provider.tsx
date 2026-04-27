import { PropsWithChildren, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { QueryClient, onlineManager } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import NetInfo from "@react-native-community/netinfo";
import { TamaguiProvider, Theme } from "tamagui";
import tamaguiConfig from "../../tamagui.config";
import { registerForPushNotificationsAsync } from "@/services/notifications/notifications";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 2,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(Boolean(state.isConnected));
  });
});

export function AppProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    // Comentario: Registro inicial para permisos de notificaciones.
    void registerForPushNotificationsAsync();
  }, []);

  return (
    <TamaguiProvider config={tamaguiConfig as never} defaultTheme="light">
      <Theme name="light">
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          {children}
        </PersistQueryClientProvider>
      </Theme>
    </TamaguiProvider>
  );
}
