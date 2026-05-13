import { Card, H4, Paragraph, YStack } from "tamagui";

interface MetricCardProps {
  label: string;
  value: string;
  tone?: "dark" | "light";
}

export function MetricCard({ label, value, tone = "light" }: MetricCardProps) {
  const dark = tone === "dark";

  return (
    <Card
      backgroundColor={dark ? "#34d399" : "#0f1726"}
      borderWidth={1}
      borderColor={dark ? "#34d399" : "#1d2b44"}
      padding="$4"
      borderRadius="$5"
      flex={1}
      minWidth={150}
    >
      <YStack gap="$2">
        <Paragraph color={dark ? "#07111f" : "#9fb6d8"}>{label}</Paragraph>
        <H4 color={dark ? "#07111f" : "#f8fafc"}>{value}</H4>
      </YStack>
    </Card>
  );
}
