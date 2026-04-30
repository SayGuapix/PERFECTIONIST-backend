import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { Button, Card, Input, Paragraph, Progress, Text, XStack, YStack } from "tamagui";
import {
  useAddToGoalMutation,
  useCreateGoalMutation,
  useCreateProjectMutation,
  useDeleteGoalMutation,
  useDeleteProjectMutation,
  useGoalsQuery,
  useProjectsQuery,
} from "@/features/finance/hooks";
import { Screen } from "@/ui/components/screen";
import { formatCurrency, parseAmount } from "@/utils/format";

export default function GoalsProjectsScreen() {
  const goals = useGoalsQuery();
  const projects = useProjectsQuery();
  const createGoal = useCreateGoalMutation();
  const addToGoal = useAddToGoalMutation();
  const deleteGoal = useDeleteGoalMutation();
  const createProject = useCreateProjectMutation();
  const deleteProject = useDeleteProjectMutation();

  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [contributionByGoal, setContributionByGoal] = useState<Record<string, string>>({});
  const [projectName, setProjectName] = useState("");
  const [projectBudget, setProjectBudget] = useState("");

  const submitGoal = async () => {
    const amount = parseAmount(goalAmount);
    if (!goalName.trim() || amount <= 0) return;
    await createGoal.mutateAsync({ name: goalName.trim(), targetAmount: amount });
    setGoalName("");
    setGoalAmount("");
  };

  const submitProject = async () => {
    const budget = parseAmount(projectBudget);
    if (!projectName.trim() || budget <= 0) return;
    await createProject.mutateAsync({ name: projectName.trim(), budget });
    setProjectName("");
    setProjectBudget("");
  };

  const submitContribution = async (id: string) => {
    const amount = parseAmount(contributionByGoal[id] ?? "");
    if (amount <= 0) return;
    await addToGoal.mutateAsync({ id, amount });
    setContributionByGoal((current) => ({ ...current, [id]: "" }));
  };

  if (goals.isPending || projects.isPending) return <ActivityIndicator />;

  return (
    <Screen>
      <YStack gap="$1">
        <Text fontSize="$9" fontWeight="800">Metas</Text>
        <Paragraph color="$gray10">Ahorra por objetivos y controla presupuestos.</Paragraph>
      </YStack>

      <Card backgroundColor="$color" borderRadius="$5" padding="$4">
        <YStack gap="$3">
          <Text color="$background" fontSize="$6" fontWeight="800">Crear meta de ahorro</Text>
          <Input placeholder="Nombre de la meta" value={goalName} onChangeText={setGoalName} />
          <Input
            placeholder="Monto objetivo"
            keyboardType="numeric"
            value={goalAmount}
            onChangeText={setGoalAmount}
          />
          <Button backgroundColor="$background" onPress={submitGoal}>
            {createGoal.isPending ? "Creando..." : "Crear meta"}
          </Button>
          {createGoal.error ? <Paragraph color="$background">{createGoal.error.message}</Paragraph> : null}
        </YStack>
      </Card>

      <YStack gap="$3">
        {goals.data?.length ? (
          goals.data.map((goal) => {
            const progress = Math.min(100, Math.round(goal.progressPercent));
            return (
              <Card key={goal.id} padding="$4" borderWidth={1} borderColor="$gray5" borderRadius="$4">
                <YStack gap="$3">
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack flex={1}>
                      <Text fontWeight="800">{goal.name}</Text>
                      <Paragraph color="$gray10">
                        {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                      </Paragraph>
                    </YStack>
                    <Text fontWeight="800">{progress}%</Text>
                  </XStack>
                  <Progress value={progress} backgroundColor="$gray5">
                    <Progress.Indicator backgroundColor="$color" />
                  </Progress>
                  <XStack gap="$2">
                    <Input
                      flex={1}
                      placeholder="Aporte"
                      keyboardType="numeric"
                      value={contributionByGoal[goal.id] ?? ""}
                      onChangeText={(value) =>
                        setContributionByGoal((current) => ({ ...current, [goal.id]: value }))
                      }
                    />
                    <Button onPress={() => submitContribution(goal.id)}>Sumar</Button>
                    <Button chromeless onPress={() => deleteGoal.mutate(goal.id)}>Eliminar</Button>
                  </XStack>
                </YStack>
              </Card>
            );
          })
        ) : (
          <Paragraph color="$gray10">Crea tu primera meta de ahorro.</Paragraph>
        )}
      </YStack>

      <Card borderWidth={1} borderColor="$gray5" borderRadius="$5" padding="$4">
        <YStack gap="$3">
          <Text fontSize="$6" fontWeight="800">Nuevo proyecto</Text>
          <Input placeholder="Nombre del proyecto" value={projectName} onChangeText={setProjectName} />
          <Input
            placeholder="Presupuesto"
            keyboardType="numeric"
            value={projectBudget}
            onChangeText={setProjectBudget}
          />
          <Button backgroundColor="$color" onPress={submitProject}>
            {createProject.isPending ? "Creando..." : "Crear proyecto"}
          </Button>
        </YStack>
      </Card>

      <YStack gap="$3">
        <Text fontSize="$6" fontWeight="800">Proyectos</Text>
        {projects.data?.length ? (
          projects.data.map((project) => (
            <Card key={project.id} padding="$4" borderWidth={1} borderColor="$gray5" borderRadius="$4">
              <YStack gap="$2">
                <XStack justifyContent="space-between">
                  <Text fontWeight="800">{project.name}</Text>
                  <Button size="$2" chromeless onPress={() => deleteProject.mutate(project.id)}>
                    Eliminar
                  </Button>
                </XStack>
                <XStack justifyContent="space-between">
                  <Paragraph color="$gray10">Presupuesto</Paragraph>
                  <Paragraph fontWeight="700">{formatCurrency(project.budget)}</Paragraph>
                </XStack>
                <XStack justifyContent="space-between">
                  <Paragraph color="$gray10">Gastado</Paragraph>
                  <Paragraph>{formatCurrency(project.spent)}</Paragraph>
                </XStack>
                <XStack justifyContent="space-between">
                  <Paragraph color="$gray10">Disponible</Paragraph>
                  <Paragraph>{formatCurrency(project.remaining)}</Paragraph>
                </XStack>
              </YStack>
            </Card>
          ))
        ) : (
          <Paragraph color="$gray10">Aun no tienes proyectos.</Paragraph>
        )}
      </YStack>
    </Screen>
  );
}
