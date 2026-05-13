import { Bot, Send } from "lucide-react-native";
import { Button, Card, Input, Paragraph, Text, XStack, YStack } from "tamagui";
import { Screen } from "@/ui/components/screen";

export default function ChatScreen() {
  return (
    <Screen>
      <YStack gap="$1">
        <Text color="#f8fafc" fontSize="$8" fontWeight="800">
          Chat IA
        </Text>
        <Paragraph color="#9fb6d8">Consulta tus finanzas con contexto de tus espacios.</Paragraph>
      </YStack>

      <Card backgroundColor="#0f1726" borderColor="#1d2b44" borderWidth={1} borderRadius="$6" padding="$5">
        <YStack gap="$4" alignItems="center" paddingVertical="$6">
          <Bot color="#9fb6d8" size={48} />
          <Text color="#f8fafc" fontSize="$6" fontWeight="800">
            Asistente financiero
          </Text>
          <Paragraph color="#9fb6d8" textAlign="center">
            Pronto podras pedir resumenes, ideas de ahorro y alertas inteligentes.
          </Paragraph>
        </YStack>
      </Card>

      <XStack gap="$3" marginTop="auto">
        <Input
          flex={1}
          placeholder="Escribe una pregunta..."
          placeholderTextColor="$secondary"
          backgroundColor="#070b14"
          borderColor="#1d2b44"
          color="$color"
        />
        <Button circular width={52} height={52} backgroundColor="#34d399" disabled>
          <Send color="#07111f" size={20} />
        </Button>
      </XStack>
    </Screen>
  );
}
