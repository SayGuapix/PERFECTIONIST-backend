import { ActivityIndicator } from "react-native";
import { Card, H2, Paragraph, Progress, Separator, Text, XStack, YStack } from "tamagui";
import { useDashboardQuery } from "@/features/finance/hooks";
import { MetricCard } from "@/ui/components/metric-card";
import { Screen } from "@/ui/components/screen";
import { formatCurrency, formatDate } from "@/utils/format";

function transactionLabel(type: number | string) {
  return Number(type) === 1 ? "Ingreso" : "Gasto";
}

export default function DashboardScreen() {
  const { data, isPending, error } = useDashboardQuery();

  if (isPending) return <ActivityIndicator />;
  if (error) return <Paragraph>{error.message}</Paragraph>;

  const income = data?.totalIncome ?? 0;
  const expense = data?.totalExpense ?? 0;
  const health = income > 0 ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0;

  return (
    <Screen>
      <YStack gap="$2">
        <Paragraph color="$gray10">Tu plata, simple y clara</Paragraph>
        <H2 fontWeight="800">Perfectionist</H2>
      </YStack>

      <Card backgroundColor="$color" borderRadius="$5" padding="$5">
        <YStack gap="$4">
          <Paragraph color="$background">Disponible</Paragraph>
          <Text color="$background" fontSize="$10" fontWeight="800">
            {formatCurrency(data?.balance ?? 0)}
          </Text>
          <XStack justifyContent="space-between">
            <Paragraph color="$gray5">Salud financiera</Paragraph>
            <Paragraph color="$background">{health}%</Paragraph>
          </XStack>
          <Progress value={health} backgroundColor="$gray10">
            <Progress.Indicator backgroundColor="$background" />
          </Progress>
        </YStack>
      </Card>

      <XStack gap="$3" flexWrap="wrap">
        <MetricCard label="Ingresos" value={formatCurrency(income)} />
        <MetricCard label="Gastos" value={formatCurrency(expense)} />
      </XStack>

      <YStack gap="$3">
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$6" fontWeight="800">Ultimos movimientos</Text>
          <Paragraph color="$gray10">{data?.latestTransactions?.length ?? 0}</Paragraph>
        </XStack>
        {data?.latestTransactions?.length ? (
          data.latestTransactions.slice(0, 5).map((item) => {
            const isIncome = Number(item.type) === 1;
            return (
              <Card key={item.id} borderWidth={1} borderColor="$gray5" borderRadius="$4" padding="$3">
                <XStack justifyContent="space-between" gap="$3" alignItems="center">
                  <YStack flex={1}>
                    <Text fontWeight="700">{item.name}</Text>
                    <Paragraph color="$gray10">
                      {transactionLabel(item.type)} · {formatDate(item.date)}
                    </Paragraph>
                  </YStack>
                  <Text fontWeight="800" color={isIncome ? "$color" : "$gray11"}>
                    {isIncome ? "+" : "-"}{formatCurrency(item.value)}
                  </Text>
                </XStack>
              </Card>
            );
          })
        ) : (
          <Card borderWidth={1} borderColor="$gray5" borderRadius="$4" padding="$4">
            <Paragraph color="$gray10">Aun no tienes movimientos. Crea el primero en la pestana Movimientos.</Paragraph>
          </Card>
        )}
      </YStack>

      <YStack gap="$3">
        <Text fontSize="$6" fontWeight="800">Gastos por categoria</Text>
        {data?.expenseByCategory?.length ? (
          data.expenseByCategory.map((item) => (
            <YStack key={item.categoryId ?? item.categoryName} gap="$2">
              <XStack justifyContent="space-between">
                <Paragraph>{item.categoryName}</Paragraph>
                <Paragraph fontWeight="700">{formatCurrency(item.totalExpense)}</Paragraph>
              </XStack>
              <Separator borderColor="$gray5" />
            </YStack>
          ))
        ) : (
          <Paragraph color="$gray10">Sin gastos categorizados por ahora.</Paragraph>
        )}
      </YStack>
    </Screen>
  );
}
