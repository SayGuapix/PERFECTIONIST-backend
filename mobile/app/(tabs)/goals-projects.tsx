import { ActivityIndicator } from "react-native";
import { Card, H4, H5, Paragraph, YStack } from "tamagui";
import { useGoalsQuery, useProjectsQuery } from "@/features/finance/hooks";
import { Screen } from "@/ui/components/screen";
import { formatCurrency } from "@/utils/format";

export default function GoalsProjectsScreen() {
  const goals = useGoalsQuery();
  const projects = useProjectsQuery();

  if (goals.isPending || projects.isPending) return <ActivityIndicator />;
  if (goals.error) return <Paragraph>{goals.error.message}</Paragraph>;
  if (projects.error) return <Paragraph>{projects.error.message}</Paragraph>;

  return (
    <Screen>
      <H4>Metas y proyectos</H4>
      <H5>Metas</H5>
      <YStack gap="$2">
        {goals.data?.map((goal) => (
          <Card key={goal.id} padding="$3" borderWidth={1} borderColor="$gray6">
            <Paragraph>{goal.name}</Paragraph>
            <Paragraph color="$gray10">
              {formatCurrency(goal.currentAmount)} /{" "}
              {formatCurrency(goal.targetAmount)}
            </Paragraph>
            <Paragraph color="$gray10">Progreso: {goal.progressPercent}%</Paragraph>
          </Card>
        ))}
      </YStack>

      <H5 marginTop="$4">Proyectos</H5>
      <YStack gap="$2">
        {projects.data?.map((project) => (
          <Card key={project.id} padding="$3" borderWidth={1} borderColor="$gray6">
            <Paragraph>{project.name}</Paragraph>
            <Paragraph color="$gray10">
              Presupuesto: {formatCurrency(project.budget)}
            </Paragraph>
            <Paragraph color="$gray10">
              Gastado: {formatCurrency(project.spent)} | Restante:{" "}
              {formatCurrency(project.remaining)}
            </Paragraph>
          </Card>
        ))}
      </YStack>
    </Screen>
  );
}
