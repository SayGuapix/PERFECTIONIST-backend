import { Card, H4, Paragraph, YStack } from "tamagui";

interface MetricCardProps {
  label: string;
  value: string;
}

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Card borderWidth={1} borderColor="$gray6" padding="$4" borderRadius="$6">
      <YStack gap="$2">
        <Paragraph color="$gray10">{label}</Paragraph>
        <H4>{value}</H4>
      </YStack>
    </Card>
  );
}
