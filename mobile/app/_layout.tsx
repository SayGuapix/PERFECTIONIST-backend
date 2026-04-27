import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { AppProvider } from "@/providers/app-provider";
import { useAuthStore } from "@/store/auth-store";

function RootNavigator() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isReady = useAuthStore((state) => state.isReady);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!isReady) return <ActivityIndicator />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
