import { ActivityIndicator } from "react-native";
import { H4, Paragraph, XStack } from "tamagui";
import { useDashboardQuery } from "@/features/finance/hooks";
import { MetricCard } from "@/ui/components/metric-card";
import { Screen } from "@/ui/components/screen";
import { formatCurrency } from "@/utils/format";

export default function DashboardScreen() {
  const { data, isPending, error } = useDashboardQuery();

  if (isPending) return <ActivityIndicator />;
  if (error) return <Paragraph>{error.message}</Paragraph>;

  return (
    <Screen>
      <H4>Resumen financiero</H4>
      <XStack gap="$3" flexWrap="wrap">
        <MetricCard label="Balance" value={formatCurrency(data?.balance ?? 0)} />
        <MetricCard
          label="Ingresos"
          value={formatCurrency(data?.totalIncome ?? 0)}
        />
        <MetricCard
          label="Gastos"
          value={formatCurrency(data?.totalExpense ?? 0)}
        />
      </XStack>
    </Screen>
  );
}
