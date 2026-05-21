import { useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Edit3,
  Search,
  Trash2,
} from "lucide-react-native";
import { Button, Card, Input, Paragraph, Text, XStack, YStack } from "tamagui";
import {
  useCategoriesQuery,
  useDeleteTransactionMutation,
  useTransactionsQuery,
} from "@/features/finance/hooks";
import { Screen } from "@/ui/components/screen";
import { formatCurrency, formatDate } from "@/utils/format";

const colors = {
  bg: "#070b14",
  panel: "#0f1726",
  border: "#1d2b44",
  mutedPanel: "#223047",
  text: "#f8fafc",
  muted: "#9fb6d8",
  green: "#34d399",
  blue: "#3b82f6",
  red: "#b42d2d",
};

type Filter = "Todos" | "Ingresos" | "Gastos" | "Transferencias";

export default function TransactionsScreen() {
  const transactions = useTransactionsQuery();
  const categories = useCategoriesQuery();
  const deleteTransaction = useDeleteTransactionMutation();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("Todos");

  const filteredTransactions = useMemo(() => {
    return (transactions.data ?? []).filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.categoryName ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "Todos" ||
        (filter === "Ingresos" && Number(item.type) === 1) ||
        (filter === "Gastos" && Number(item.type) === 2) ||
        filter === "Transferencias";
      return matchesSearch && matchesFilter;
    });
  }, [filter, search, transactions.data]);

  if (transactions.isPending || categories.isPending) return <ActivityIndicator color={colors.green} />;

  const filters: Filter[] = ["Todos", "Ingresos", "Gastos", "Transferencias"];

  return (
    <>
      <Screen>
        <Text color={colors.text} fontSize="$8" fontWeight="900">
          Transacciones
        </Text>

        <XStack alignItems="center" gap="$3" borderWidth={1} borderColor={colors.border} borderRadius="$5" paddingHorizontal="$4" height={58} backgroundColor={colors.bg}>
          <Search color={colors.muted} size={24} />
          <Input
            flex={1}
            unstyled
            color="$color"
            placeholder="Buscar transacciones..."
            placeholderTextColor="$secondary"
            value={search}
            onChangeText={setSearch}
          />
        </XStack>

        <XStack backgroundColor={colors.mutedPanel} borderRadius="$5" padding="$1" gap="$1">
          {filters.map((item) => (
            <Button
              key={item}
              flex={1}
              height={46}
              backgroundColor={filter === item ? colors.bg : "transparent"}
              borderRadius="$4"
              onPress={() => setFilter(item)}
            >
              <Text color={filter === item ? colors.text : colors.muted} fontWeight="900">{item}</Text>
            </Button>
          ))}
        </XStack>

        <YStack gap="$3">
          {filteredTransactions.length ? (
            filteredTransactions.map((item) => {
              const isIncome = Number(item.type) === 1;
              const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
              return (
                <Card key={item.id} backgroundColor={colors.panel} borderColor={colors.border} borderWidth={1} borderRadius="$5" padding="$4">
                  <XStack justifyContent="space-between" alignItems="center" gap="$3">
                    <XStack flex={1} gap="$3" alignItems="center">
                      <YStack width={56} height={56} borderRadius={28} alignItems="center" justifyContent="center" backgroundColor={isIncome ? "#073328" : "#221122"}>
                        <Icon color={isIncome ? colors.green : colors.red} size={25} />
                      </YStack>
                      <YStack flex={1}>
                        <Text color={colors.text} fontSize="$6" fontWeight="900">{item.name}</Text>
                        <Paragraph color={colors.muted}>
                          {isIncome ? "Ingreso" : "Gasto"} • {formatDate(item.date)}
                        </Paragraph>
                        {item.description ? <Paragraph color={colors.muted}>{item.description}</Paragraph> : null}
                      </YStack>
                    </XStack>
                    <XStack alignItems="center" gap="$3">
                      <Text color={isIncome ? colors.green : colors.red} fontSize="$6" fontWeight="900">
                        {isIncome ? "+" : "-"}{formatCurrency(item.value)}
                      </Text>
                      <Edit3 color={colors.muted} size={22} />
                      <Trash2 color={colors.muted} size={22} onPress={() => deleteTransaction.mutate(item.id)} />
                    </XStack>
                  </XStack>
                </Card>
              );
            })
          ) : (
            <Card backgroundColor={colors.panel} borderColor={colors.border} borderWidth={1} borderRadius="$5" padding="$5">
              <Paragraph color={colors.muted}>No hay transacciones para este filtro.</Paragraph>
            </Card>
          )}
        </YStack>
      </Screen>

    </>
  );
}
