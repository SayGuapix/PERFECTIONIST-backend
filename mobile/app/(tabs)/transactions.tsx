import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { Button, Card, Input, Paragraph, Text, XStack, YStack } from "tamagui";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useTransactionsQuery,
} from "@/features/finance/hooks";
import { Screen } from "@/ui/components/screen";
import { formatCurrency, formatDate, parseAmount } from "@/utils/format";
import { TransactionType } from "@/services/api/types";

function todayIso() {
  return new Date().toISOString();
}

export default function TransactionsScreen() {
  const transactions = useTransactionsQuery();
  const categories = useCategoriesQuery();
  const createTransaction = useCreateTransactionMutation();
  const createCategory = useCreateCategoryMutation();
  const deleteTransaction = useDeleteTransactionMutation();

  const [type, setType] = useState<TransactionType>(2);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");

  const submitTransaction = async () => {
    const amount = parseAmount(value);
    if (!name.trim() || amount <= 0) return;

    await createTransaction.mutateAsync({
      type,
      name: name.trim(),
      value: amount,
      description: description.trim() || null,
      categoryId,
      date: todayIso(),
    });

    setName("");
    setValue("");
    setDescription("");
  };

  const submitCategory = async () => {
    if (!categoryName.trim()) return;
    const created = await createCategory.mutateAsync({ name: categoryName.trim() });
    setCategoryId(created.id);
    setCategoryName("");
  };

  if (transactions.isPending || categories.isPending) return <ActivityIndicator />;

  return (
    <Screen>
      <YStack gap="$1">
        <Text fontSize="$9" fontWeight="800">Movimientos</Text>
        <Paragraph color="$gray10">Registra entradas y salidas en segundos.</Paragraph>
      </YStack>

      <Card backgroundColor="$color" borderRadius="$5" padding="$4">
        <YStack gap="$3">
          <XStack gap="$2">
            <Button
              flex={1}
              backgroundColor={type === 2 ? "$background" : "$gray11"}
              onPress={() => setType(2)}
            >
              Gasto
            </Button>
            <Button
              flex={1}
              backgroundColor={type === 1 ? "$background" : "$gray11"}
              onPress={() => setType(1)}
            >
              Ingreso
            </Button>
          </XStack>
          <Input placeholder="Nombre" value={name} onChangeText={setName} />
          <Input
            placeholder="Valor"
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />
          <Input
            placeholder="Descripcion opcional"
            value={description}
            onChangeText={setDescription}
          />
          <XStack gap="$2" flexWrap="wrap">
            <Button
              size="$3"
              chromeless={categoryId !== null}
              onPress={() => setCategoryId(null)}
            >
              Sin categoria
            </Button>
            {categories.data?.map((category) => (
              <Button
                key={category.id}
                size="$3"
                chromeless={categoryId !== category.id}
                onPress={() => setCategoryId(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </XStack>
          <Button
            backgroundColor="$background"
            disabled={createTransaction.isPending}
            onPress={submitTransaction}
          >
            {createTransaction.isPending ? "Guardando..." : "Guardar movimiento"}
          </Button>
          {createTransaction.error ? (
            <Paragraph color="$background">{createTransaction.error.message}</Paragraph>
          ) : null}
        </YStack>
      </Card>

      <Card borderWidth={1} borderColor="$gray5" borderRadius="$4" padding="$3">
        <YStack gap="$2">
          <Text fontWeight="800">Nueva categoria</Text>
          <XStack gap="$2">
            <Input flex={1} placeholder="Ej. Mercado" value={categoryName} onChangeText={setCategoryName} />
            <Button onPress={submitCategory} disabled={createCategory.isPending}>Crear</Button>
          </XStack>
        </YStack>
      </Card>

      <YStack gap="$3">
        <Text fontSize="$6" fontWeight="800">Historial</Text>
        {transactions.data?.length ? (
          transactions.data.map((item) => {
            const isIncome = Number(item.type) === 1;
            return (
              <Card key={item.id} padding="$3" borderWidth={1} borderColor="$gray5" borderRadius="$4">
                <XStack justifyContent="space-between" alignItems="center" gap="$3">
                  <YStack flex={1}>
                    <Text fontWeight="800">{item.name}</Text>
                    <Paragraph color="$gray10">
                      {item.categoryName ?? "Sin categoria"} · {formatDate(item.date)}
                    </Paragraph>
                    {item.description ? <Paragraph color="$gray10">{item.description}</Paragraph> : null}
                  </YStack>
                  <YStack alignItems="flex-end" gap="$2">
                    <Text fontWeight="800">
                      {isIncome ? "+" : "-"}{formatCurrency(item.value)}
                    </Text>
                    <Button size="$2" chromeless onPress={() => deleteTransaction.mutate(item.id)}>
                      Eliminar
                    </Button>
                  </YStack>
                </XStack>
              </Card>
            );
          })
        ) : (
          <Paragraph color="$gray10">Todavia no hay movimientos.</Paragraph>
        )}
      </YStack>
    </Screen>
  );
}
