import { useState } from "react";
import { ActivityIndicator } from "react-native";
import {
  Briefcase,
  ChevronRight,
  Coffee,
  PiggyBank,
  ReceiptText,
  Target,
} from "lucide-react-native";
import { Button, Card, Input, Paragraph, Progress, Text, XStack, YStack } from "tamagui";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useCreateFixedExpenseMutation,
  useCreateGoalMutation,
  useCreateProjectMutation,
  useDeleteFixedExpenseMutation,
  useDeleteGoalMutation,
  useDeleteProjectMutation,
  useFixedExpensesQuery,
  useGoalsQuery,
  useProjectsQuery,
} from "@/features/finance/hooks";
import { Screen } from "@/ui/components/screen";
import { Frequency } from "@/services/api/types";
import { formatCurrency, formatDate, parseAmount } from "@/utils/format";

const colors = {
  bg: "#070b14",
  panel: "#0f1726",
  border: "#1d2b44",
  text: "#f8fafc",
  muted: "#9fb6d8",
  green: "#34d399",
  blue: "#3b82f6",
  orange: "#f59e0b",
  red: "#b42d2d",
};

const frequencies: { value: Frequency; label: string }[] = [
  { value: 1, label: "Semanal" },
  { value: 2, label: "Quincenal" },
  { value: 3, label: "Mensual" },
  { value: 4, label: "Trimestral" },
  { value: 5, label: "Anual" },
];

export default function GoalsProjectsScreen() {
  const goals = useGoalsQuery();
  const projects = useProjectsQuery();
  const fixedExpenses = useFixedExpensesQuery();
  const categories = useCategoriesQuery();
  const createGoal = useCreateGoalMutation();
  const deleteGoal = useDeleteGoalMutation();
  const createProject = useCreateProjectMutation();
  const deleteProject = useDeleteProjectMutation();
  const createFixedExpense = useCreateFixedExpenseMutation();
  const deleteFixedExpense = useDeleteFixedExpenseMutation();
  const createCategory = useCreateCategoryMutation();

  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [fixedName, setFixedName] = useState("");
  const [fixedValue, setFixedValue] = useState("");
  const [frequency, setFrequency] = useState<Frequency>(3);
  const [incomeCategoryName, setIncomeCategoryName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [expandedSpace, setExpandedSpace] = useState<string | null>("Metas");

  const submitGoal = async () => {
    const amount = parseAmount(goalAmount);
    if (!goalName.trim() || amount <= 0) return;
    try {
      await createGoal.mutateAsync({ name: goalName.trim(), targetAmount: amount });
      setGoalName("");
      setGoalAmount("");
    } catch {
      // La mutacion expone el error en createGoal.error.
    }
  };

  const submitProject = async () => {
    const budget = parseAmount(projectBudget);
    if (!projectName.trim() || budget <= 0) return;
    try {
      await createProject.mutateAsync({ name: projectName.trim(), budget });
      setProjectName("");
      setProjectBudget("");
    } catch {
      // La mutacion expone el error en createProject.error.
    }
  };

  const submitFixedExpense = async () => {
    const amount = parseAmount(fixedValue);
    if (!fixedName.trim() || amount <= 0) return;
    try {
      await createFixedExpense.mutateAsync({
        name: fixedName.trim(),
        value: amount,
        frequency,
        nextDate: new Date().toISOString(),
      });
      setFixedName("");
      setFixedValue("");
    } catch {
      // La mutacion expone el error en createFixedExpense.error.
    }
  };

  const submitCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      await createCategory.mutateAsync({ name: categoryName.trim(), type: 2 });
      setCategoryName("");
    } catch {
      // La mutacion expone el error en createCategory.error.
    }
  };

  const submitIncomeCategory = async () => {
    if (!incomeCategoryName.trim()) return;
    try {
      await createCategory.mutateAsync({ name: incomeCategoryName.trim(), type: 1 });
      setIncomeCategoryName("");
    } catch {
      // La mutacion expone el error en createCategory.error.
    }
  };

  if (goals.isPending || projects.isPending || fixedExpenses.isPending || categories.isPending) {
    return <ActivityIndicator color={colors.green} />;
  }

  const fixedTotal = fixedExpenses.data?.reduce((total, item) => total + item.value, 0) ?? 0;
  const incomeCategories = categories.data?.filter((category) => Number(category.type) === 1) ?? [];
  const expenseCategories = categories.data?.filter((category) => Number(category.type) === 2) ?? [];
  const spaceRows = [
    { title: "Ingresos", detail: "Registro y categorizacion de ingresos", count: incomeCategories.length, icon: ReceiptText, color: colors.green },
    { title: "Metas", detail: "Objetivos financieros con fecha limite", count: goals.data?.length ?? 0, icon: Target, color: colors.green },
    { title: "Ahorros", detail: "Cuentas de ahorro personalizadas", count: 0, icon: PiggyBank, color: colors.green },
    { title: "Proyectos", detail: "Proyectos con presupuesto definido", count: projects.data?.length ?? 0, icon: Briefcase, color: colors.blue },
    { title: "Gastos Fijos", detail: "Compromisos recurrentes mensuales", count: fixedExpenses.data?.length ?? 0, icon: ReceiptText, color: colors.orange },
    { title: "Gastos Casuales", detail: "Gastos del dia a dia por categoria", count: expenseCategories.length, icon: Coffee, color: colors.red },
  ];

  return (
    <Screen>
      <Text color={colors.text} fontSize="$8" fontWeight="900">
        Espacios Financieros
      </Text>
      <Paragraph color={colors.muted} fontSize="$5">
        Organiza tus finanzas en diferentes espacios segun tus necesidades.
      </Paragraph>

      <YStack gap="$3">
        {spaceRows.map((row) => {
          const Icon = row.icon;
          const isExpanded = expandedSpace === row.title;

          return (
            <Card
              key={row.title}
              backgroundColor={colors.panel}
              borderColor={isExpanded ? row.color : colors.border}
              borderWidth={1}
              borderRadius="$6"
              padding="$4"
            >
              <YStack gap="$4">
                <XStack
                  alignItems="center"
                  gap="$4"
                  pressStyle={{ scale: 0.99 }}
                  onPress={() => setExpandedSpace(isExpanded ? null : row.title)}
                >
                  <YStack width={68} height={68} borderRadius={18} alignItems="center" justifyContent="center" backgroundColor={`${row.color}20`}>
                    <Icon color={row.color} size={34} />
                  </YStack>
                  <YStack flex={1}>
                    <Text color={colors.text} fontSize="$6" fontWeight="900">
                      {row.title}
                    </Text>
                    <Paragraph color={colors.muted}>{row.detail}</Paragraph>
                  </YStack>
                  <YStack width={30} height={30} borderRadius={15} backgroundColor="#1d2b44" alignItems="center" justifyContent="center">
                    <Text color={colors.text} fontWeight="900">{row.count}</Text>
                  </YStack>
                  <ChevronRight color={colors.muted} size={24} style={{ transform: [{ rotate: isExpanded ? "90deg" : "0deg" }] }} />
                </XStack>

                {isExpanded && row.title === "Ingresos" ? (
                  <YStack gap="$4" borderTopWidth={1} borderTopColor={colors.border} paddingTop="$4">
                    <YStack gap="$3">
                      <Text color={colors.text} fontSize="$6" fontWeight="900">Nueva categoria de ingreso</Text>
                      <XStack gap="$2">
                        <Input flex={1} placeholder="Ej. Salario" value={incomeCategoryName} onChangeText={setIncomeCategoryName} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />
                        <Button backgroundColor={colors.green} onPress={submitIncomeCategory}><Text color="#07111f" fontWeight="900">Crear</Text></Button>
                      </XStack>
                    </YStack>

                    <XStack gap="$3" flexWrap="wrap">
                      {incomeCategories.length ? (
                        incomeCategories.map((category, index) => (
                          <YStack key={category.id} width="48%" minWidth={150} gap="$3" borderWidth={1} borderColor={colors.border} borderRadius="$5" padding="$4" backgroundColor={colors.bg}>
                            <XStack alignItems="center" gap="$2">
                              <YStack width={16} height={16} borderRadius={8} backgroundColor={["#34d399", "#3b82f6", "#14b8a6", "#84cc16"][index % 4]} />
                              <Text color={colors.text} fontSize="$5" fontWeight="900">{category.name}</Text>
                            </XStack>
                            <Paragraph color={colors.muted}>Categoria para ingresos</Paragraph>
                          </YStack>
                        ))
                      ) : (
                        <Paragraph color={colors.muted}>Crea tu primera categoria de ingreso.</Paragraph>
                      )}
                    </XStack>
                  </YStack>
                ) : null}

                {isExpanded && row.title === "Ahorros" ? (
                  <YStack borderTopWidth={1} borderTopColor={colors.border} paddingTop="$4">
                    <Paragraph color={colors.muted}>Este espacio todavia no tiene opciones configurables.</Paragraph>
                  </YStack>
                ) : null}

                {isExpanded && row.title === "Metas" ? (
                  <YStack gap="$4" borderTopWidth={1} borderTopColor={colors.border} paddingTop="$4">
                    <YStack gap="$3">
                      <Text color={colors.text} fontSize="$6" fontWeight="900">Crear meta</Text>
                      <Input placeholder="Nombre de la meta" value={goalName} onChangeText={setGoalName} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />
                      <Input placeholder="Monto objetivo" keyboardType="numeric" value={goalAmount} onChangeText={setGoalAmount} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />
                      <Button backgroundColor={colors.green} onPress={submitGoal}>
                        <Text color="#07111f" fontWeight="900">{createGoal.isPending ? "Creando..." : "Crear meta"}</Text>
                      </Button>
                    </YStack>

                    <YStack gap="$3">
                      <Text color={colors.text} fontSize="$6" fontWeight="900">Metas activas</Text>
                      {goals.data?.length ? (
                        goals.data.map((goal) => {
                          const progress = Math.min(100, Math.round(goal.progressPercent));
                          return (
                            <YStack key={goal.id} gap="$3" borderWidth={1} borderColor={colors.border} borderRadius="$5" padding="$4" backgroundColor={colors.bg}>
                              <XStack justifyContent="space-between" alignItems="center">
                                <YStack flex={1}>
                                  <Text color={colors.text} fontSize="$6" fontWeight="900">{goal.name}</Text>
                                  <Paragraph color={colors.muted}>{formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}</Paragraph>
                                </YStack>
                                <Text color={colors.muted} fontWeight="900">{progress}%</Text>
                              </XStack>
                              <Progress value={progress} backgroundColor="#26354d">
                                <Progress.Indicator backgroundColor={colors.green} />
                              </Progress>
                              <XStack justifyContent="flex-end">
                                <Button chromeless onPress={() => deleteGoal.mutate(goal.id)}><Text color={colors.muted}>Eliminar</Text></Button>
                              </XStack>
                            </YStack>
                          );
                        })
                      ) : (
                        <Paragraph color={colors.muted}>Crea tu primera meta de ahorro.</Paragraph>
                      )}
                    </YStack>
                  </YStack>
                ) : null}

                {isExpanded && row.title === "Proyectos" ? (
                  <YStack gap="$4" borderTopWidth={1} borderTopColor={colors.border} paddingTop="$4">
                    <YStack gap="$3">
                      <Text color={colors.text} fontSize="$6" fontWeight="900">Nuevo proyecto</Text>
                      <Input placeholder="Nombre del proyecto" value={projectName} onChangeText={setProjectName} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />
                      <Input placeholder="Presupuesto" keyboardType="numeric" value={projectBudget} onChangeText={setProjectBudget} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />
                      <Button backgroundColor={colors.green} onPress={submitProject}>
                        <Text color="#07111f" fontWeight="900">{createProject.isPending ? "Creando..." : "Crear proyecto"}</Text>
                      </Button>
                    </YStack>

                    <YStack gap="$3">
                      <Text color={colors.text} fontSize="$6" fontWeight="900">Proyectos activos</Text>
                      {projects.data?.length ? (
                        projects.data.map((project) => (
                          <YStack key={project.id} gap="$2" borderWidth={1} borderColor={colors.border} borderRadius="$5" padding="$4" backgroundColor={colors.bg}>
                            <XStack justifyContent="space-between">
                              <Text color={colors.text} fontWeight="900">{project.name}</Text>
                              <Button size="$2" chromeless onPress={() => deleteProject.mutate(project.id)}><Text color={colors.muted}>Eliminar</Text></Button>
                            </XStack>
                            <XStack justifyContent="space-between"><Paragraph color={colors.muted}>Presupuesto</Paragraph><Paragraph color={colors.text} fontWeight="800">{formatCurrency(project.budget)}</Paragraph></XStack>
                            <XStack justifyContent="space-between"><Paragraph color={colors.muted}>Gastado</Paragraph><Paragraph color={colors.text}>{formatCurrency(project.spent)}</Paragraph></XStack>
                            <XStack justifyContent="space-between"><Paragraph color={colors.muted}>Disponible</Paragraph><Paragraph color={colors.green}>{formatCurrency(project.remaining)}</Paragraph></XStack>
                          </YStack>
                        ))
                      ) : (
                        <Paragraph color={colors.muted}>Aun no tienes proyectos.</Paragraph>
                      )}
                    </YStack>
                  </YStack>
                ) : null}

                {isExpanded && row.title === "Gastos Fijos" ? (
                  <YStack gap="$4" borderTopWidth={1} borderTopColor={colors.border} paddingTop="$4">
                    <XStack alignItems="center" gap="$3">
                      <Coffee color={colors.red} size={32} />
                      <YStack>
                        <Paragraph color={colors.muted}>Total gastos fijos</Paragraph>
                        <Text color={colors.red} fontSize="$7" fontWeight="900">{formatCurrency(fixedTotal)}</Text>
                      </YStack>
                    </XStack>

                    <YStack gap="$3">
                      <Text color={colors.text} fontSize="$6" fontWeight="900">Nuevo gasto fijo</Text>
                      <Input placeholder="Nombre del gasto fijo" value={fixedName} onChangeText={setFixedName} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />
                      <Input placeholder="Valor" keyboardType="numeric" value={fixedValue} onChangeText={setFixedValue} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />
                      <XStack gap="$2" flexWrap="wrap">
                        {frequencies.map((item) => (
                          <Button key={item.value} size="$3" backgroundColor={frequency === item.value ? colors.green : colors.bg} borderColor={colors.border} borderWidth={1} onPress={() => setFrequency(item.value)}>
                            <Text color={frequency === item.value ? "#07111f" : colors.muted}>{item.label}</Text>
                          </Button>
                        ))}
                      </XStack>
                      <Button backgroundColor={colors.green} onPress={submitFixedExpense}>
                        <Text color="#07111f" fontWeight="900">{createFixedExpense.isPending ? "Guardando..." : "Guardar gasto fijo"}</Text>
                      </Button>
                    </YStack>

                    <YStack gap="$3">
                      <Text color={colors.text} fontSize="$6" fontWeight="900">Gastos fijos guardados</Text>
                      {fixedExpenses.data?.length ? (
                        fixedExpenses.data.map((item) => (
                          <XStack key={item.id} justifyContent="space-between" alignItems="center" gap="$3" borderWidth={1} borderColor={colors.border} borderRadius="$5" padding="$4" backgroundColor={colors.bg}>
                            <YStack flex={1}>
                              <Text color={colors.text} fontWeight="900">{item.name}</Text>
                              <Paragraph color={colors.muted}>{frequencies.find((current) => current.value === item.frequency)?.label} - {formatDate(item.nextDate)}</Paragraph>
                            </YStack>
                            <YStack alignItems="flex-end" gap="$2">
                              <Text color={colors.text} fontWeight="900">{formatCurrency(item.value)}</Text>
                              <Button size="$2" chromeless onPress={() => deleteFixedExpense.mutate(item.id)}><Text color={colors.muted}>Eliminar</Text></Button>
                            </YStack>
                          </XStack>
                        ))
                      ) : (
                        <Paragraph color={colors.muted}>No tienes gastos fijos registrados.</Paragraph>
                      )}
                    </YStack>
                  </YStack>
                ) : null}

                {isExpanded && row.title === "Gastos Casuales" ? (
                  <YStack gap="$4" borderTopWidth={1} borderTopColor={colors.border} paddingTop="$4">
                    <YStack gap="$3">
                      <Text color={colors.text} fontSize="$6" fontWeight="900">Nueva categoria casual</Text>
                      <XStack gap="$2">
                        <Input flex={1} placeholder="Ej. Comida" value={categoryName} onChangeText={setCategoryName} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />
                        <Button backgroundColor={colors.green} onPress={submitCategory}><Text color="#07111f" fontWeight="900">Crear</Text></Button>
                      </XStack>
                    </YStack>

                    <XStack gap="$3" flexWrap="wrap">
                      {expenseCategories.length ? (
                        expenseCategories.map((category, index) => (
                          <YStack key={category.id} width="48%" minWidth={150} gap="$3" borderWidth={1} borderColor={colors.border} borderRadius="$5" padding="$4" backgroundColor={colors.bg}>
                            <XStack alignItems="center" gap="$2">
                              <YStack width={16} height={16} borderRadius={8} backgroundColor={["#ec4899", "#3b82f6", "#f97316", "#65c90f"][index % 4]} />
                              <Text color={colors.text} fontSize="$5" fontWeight="900">{category.name}</Text>
                            </XStack>
                            <Text color={colors.text} fontSize="$7" fontWeight="900">$ 0</Text>
                            <Paragraph color={colors.muted}>0 transacciones</Paragraph>
                          </YStack>
                        ))
                      ) : (
                        <Paragraph color={colors.muted}>Crea tu primera categoria casual.</Paragraph>
                      )}
                    </XStack>
                  </YStack>
                ) : null}
              </YStack>
            </Card>
          );
        })}
      </YStack>
    </Screen>
  );
}
