import { router } from "expo-router";
import { Button, H4, Paragraph, YStack } from "tamagui";
import { Screen } from "@/ui/components/screen";
import { scheduleLocalReminder } from "@/services/notifications/notifications";
import { useAuthStore } from "@/store/auth-store";

export default function ProfileScreen() {
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleLogout = async () => {
    await clearSession();
    router.replace("/(auth)/login");
  };

  return (
    <Screen>
      <YStack gap="$3">
        <H4>Perfil y ajustes</H4>
        <Paragraph>Gestiona tu cuenta y recordatorios.</Paragraph>
        <Button onPress={scheduleLocalReminder}>Probar notificacion local</Button>
        <Button theme="red" onPress={handleLogout}>
          Cerrar sesion
        </Button>
      </YStack>
    </Screen>
  );
}
