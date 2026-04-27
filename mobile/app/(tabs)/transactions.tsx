import { ActivityIndicator } from "react-native";
import { Card, H4, Paragraph, YStack } from "tamagui";
import { useTransactionsQuery } from "@/features/finance/hooks";
import { Screen } from "@/ui/components/screen";
import { formatCurrency } from "@/utils/format";

export default function TransactionsScreen() {
  const { data, isPending, error } = useTransactionsQuery();

  if (isPending) return <ActivityIndicator />;
  if (error) return <Paragraph>{error.message}</Paragraph>;

  return (
    <Screen>
      <H4>Transacciones</H4>
      <YStack gap="$2">
        {data?.map((item) => (
          <Card key={item.id} padding="$3" borderWidth={1} borderColor="$gray6">
            <Paragraph>{item.name}</Paragraph>
            {item.description ? (
              <Paragraph color="$gray10">{item.description}</Paragraph>
            ) : null}
            <Paragraph color="$gray10">
              Tipo {item.type} - {formatCurrency(item.value)}
            </Paragraph>
          </Card>
        ))}
      </YStack>
    </Screen>
  );
}
