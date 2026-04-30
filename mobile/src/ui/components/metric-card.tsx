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
      backgroundColor={dark ? "$color" : "$background"}
      borderWidth={1}
      borderColor={dark ? "$color" : "$gray5"}
      padding="$4"
      borderRadius="$5"
      flex={1}
      minWidth={150}
    >
      <YStack gap="$2">
        <Paragraph color={dark ? "$background" : "$gray10"}>{label}</Paragraph>
        <H4 color={dark ? "$background" : "$color"}>{value}</H4>
      </YStack>
    </Card>
  );
}
