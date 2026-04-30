import { useState } from "react";
import { router } from "expo-router";
import { Button, Card, Input, Paragraph, Text, XStack, YStack } from "tamagui";
import { Screen } from "@/ui/components/screen";
import { scheduleLocalReminder } from "@/services/notifications/notifications";
import { useAuthStore } from "@/store/auth-store";
import {
  useCreateFixedExpenseMutation,
  useDeleteFixedExpenseMutation,
  useFixedExpensesQuery,
} from "@/features/finance/hooks";
import { formatCurrency, formatDate, parseAmount } from "@/utils/format";
import { Frequency } from "@/services/api/types";

const frequencies: { value: Frequency; label: string }[] = [
  { value: 1, label: "Semanal" },
  { value: 2, label: "Quincenal" },
  { value: 3, label: "Mensual" },
  { value: 4, label: "Trimestral" },
  { value: 5, label: "Anual" },
];

export default function ProfileScreen() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const fixedExpenses = useFixedExpensesQuery();
  const createFixedExpense = useCreateFixedExpenseMutation();
  const deleteFixedExpense = useDeleteFixedExpenseMutation();

  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [frequency, setFrequency] = useState<Frequency>(3);

  const handleLogout = async () => {
    await clearSession();
    router.replace("/(auth)/login");
  };

  const submitFixedExpense = async () => {
    const amount = parseAmount(value);
    if (!name.trim() || amount <= 0) return;
    await createFixedExpense.mutateAsync({
      name: name.trim(),
      value: amount,
      frequency,
      nextDate: new Date().toISOString(),
    });
    setName("");
    setValue("");
  };

  return (
    <Screen>
      <YStack gap="$1">
        <Text fontSize="$9" fontWeight="800">Cuenta</Text>
        <Paragraph color="$gray10">Ajustes, recordatorios y pagos recurrentes.</Paragraph>
      </YStack>

      <Card backgroundColor="$color" borderRadius="$5" padding="$4">
        <YStack gap="$3">
          <Text color="$background" fontSize="$6" fontWeight="800">Recordatorios</Text>
          <Paragraph color="$gray5">
            Programa una alerta local para revisar tus finanzas.
          </Paragraph>
          <Button backgroundColor="$background" onPress={scheduleLocalReminder}>
            Probar notificacion
          </Button>
        </YStack>
      </Card>

      <Card borderWidth={1} borderColor="$gray5" borderRadius="$5" padding="$4">
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="800">Gasto fijo</Text>
          <Input placeholder="Nombre" value={name} onChangeText={setName} />
          <Input placeholder="Valor" keyboardType="numeric" value={value} onChangeText={setValue} />
          <XStack gap="$2" flexWrap="wrap">
            {frequencies.map((item) => (
              <Button
                key={item.value}
                size="$3"
                chromeless={frequency !== item.value}
                onPress={() => setFrequency(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </XStack>
          <Button backgroundColor="$color" onPress={submitFixedExpense}>
            {createFixedExpense.isPending ? "Guardando..." : "Guardar gasto fijo"}
          </Button>
          {createFixedExpense.error ? (
            <Paragraph color="$red10">{createFixedExpense.error.message}</Paragraph>
          ) : null}
        </YStack>
      </Card>

      <YStack gap="$3">
        <Text fontSize="$6" fontWeight="800">Recurrentes</Text>
        {fixedExpenses.data?.length ? (
          fixedExpenses.data.map((item) => (
            <Card key={item.id} padding="$3" borderWidth={1} borderColor="$gray5" borderRadius="$4">
              <XStack justifyContent="space-between" alignItems="center" gap="$3">
                <YStack flex={1}>
                  <Text fontWeight="800">{item.name}</Text>
                  <Paragraph color="$gray10">
                    {frequencies.find((frequency) => frequency.value === item.frequency)?.label} ·{" "}
                    {formatDate(item.nextDate)}
                  </Paragraph>
                </YStack>
                <YStack alignItems="flex-end" gap="$2">
                  <Text fontWeight="800">{formatCurrency(item.value)}</Text>
                  <Button size="$2" chromeless onPress={() => deleteFixedExpense.mutate(item.id)}>
                    Eliminar
                  </Button>
                </YStack>
              </XStack>
            </Card>
          ))
        ) : (
          <Paragraph color="$gray10">No tienes gastos fijos registrados.</Paragraph>
        )}
      </YStack>

      <Button borderColor="$color" borderWidth={1} chromeless onPress={handleLogout}>
        Cerrar sesion
      </Button>
    </Screen>
  );
}
