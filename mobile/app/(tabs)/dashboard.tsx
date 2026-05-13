import { useState } from "react";
import { ActivityIndicator, Modal, Pressable } from "react-native";
import { router } from "expo-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Briefcase,
  Coffee,
  Moon,
  PiggyBank,
  Plus,
  ReceiptText,
  Target,
  TrendingUp,
  WalletMinimal,
  X,
} from "lucide-react-native";
import { Button, Card, Paragraph, Progress, Text, XStack, YStack } from "tamagui";
import { useDashboardQuery } from "@/features/finance/hooks";
import { Screen } from "@/ui/components/screen";
import { useAuthStore } from "@/store/auth-store";
import { formatCurrency, formatDate } from "@/utils/format";

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

function transactionLabel(type: number | string) {
  return Number(type) === 1 ? "Ingreso" : "Gasto";
}

export default function DashboardScreen() {
  const { data, isPending, error } = useDashboardQuery();
  const name = useAuthStore((state) => state.name) ?? "SweetMask";
  const [quickOpen, setQuickOpen] = useState(false);

  if (isPending) {
    return (
      <Screen>
        <YStack flex={1} minHeight={520} alignItems="center" justifyContent="center" gap="$3">
          <ActivityIndicator color={colors.green} />
          <Paragraph color={colors.muted}>Cargando inicio...</Paragraph>
        </YStack>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <Card backgroundColor={colors.panel} borderColor={colors.border} borderWidth={1} borderRadius="$5" padding="$4">
          <YStack gap="$2">
            <Text color={colors.text} fontSize="$6" fontWeight="900">No se pudo cargar Inicio</Text>
            <Paragraph color={colors.muted}>{error.message}</Paragraph>
          </YStack>
        </Card>
      </Screen>
    );
  }

  const income = data?.totalIncome ?? 0;
  const expense = data?.totalExpense ?? 0;
  const fixedTotal = data?.expenseByCategory?.find((item) => item.categoryName?.toLowerCase().includes("fijo"))?.totalExpense ?? 0;
  const casualTotal = Math.max(0, expense - fixedTotal);
  const primaryGoal = data?.goals?.[0];

  const spaces = [
    { label: "Metas", value: data?.goals?.reduce((total, item) => total + item.currentAmount, 0) ?? 0, icon: Target, color: colors.green },
    { label: "Ahorros", value: 0, icon: PiggyBank, color: colors.green },
    { label: "Proyectos", value: 0, icon: Briefcase, color: colors.blue },
    { label: "Gastos Fijos", value: fixedTotal, icon: ReceiptText, color: colors.orange },
    { label: "Casuales", value: casualTotal, icon: Coffee, color: colors.red },
  ];

  return (
    <>
      <Screen>
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$1">
          <XStack alignItems="center" gap="$2">
            <TrendingUp color={colors.green} size={28} />
            <Text color={colors.text} fontSize="$7" fontWeight="800">
              Perfectionist
            </Text>
          </XStack>
          <Moon color={colors.text} size={22} />
        </XStack>

        <YStack gap="$1">
          <Text color={colors.muted} fontSize="$6" fontWeight="700">
            Hola, {name} 👋
          </Text>
          <Text color={colors.text} fontSize="$9" fontWeight="900">
            Tu resumen financiero
          </Text>
        </YStack>

        <Card backgroundColor={colors.panel} borderColor={colors.border} borderWidth={1} borderRadius="$6" padding="$5">
          <YStack gap="$4">
            <Paragraph color={colors.muted} fontWeight="700">
              Balance Total
            </Paragraph>
            <Text color={colors.green} fontSize={44} fontWeight="900">
              {formatCurrency(data?.balance ?? 0)}
            </Text>
            <XStack gap="$5" flexWrap="wrap">
              <Paragraph color={colors.muted} fontSize="$5">
                Total ingresos: <Text color={colors.green} fontWeight="800">{formatCurrency(income)}</Text>
              </Paragraph>
              <Paragraph color={colors.muted} fontSize="$5">
                Total gastos: <Text color={colors.red} fontWeight="800">{formatCurrency(expense)}</Text>
              </Paragraph>
            </XStack>
          </YStack>
        </Card>

        <YStack gap="$3">
          <Text color={colors.text} fontSize="$7" fontWeight="900">
            Espacios
          </Text>
          <XStack gap="$3" flexWrap="wrap">
            {spaces.map((space) => {
              const Icon = space.icon;
              return (
                <Card
                  key={space.label}
                  width="31%"
                  minWidth={98}
                  backgroundColor={colors.panel}
                  borderColor={colors.border}
                  borderWidth={1}
                  borderRadius="$5"
                  padding="$4"
                  pressStyle={{ scale: 0.98, borderColor: colors.green }}
                  onPress={() => router.push("/(tabs)/goals-projects")}
                >
                  <YStack alignItems="center" gap="$2">
                    <Icon color={space.color} size={38} strokeWidth={2.4} />
                    <Text color={colors.muted} fontWeight="800" textAlign="center">
                      {space.label}
                    </Text>
                    <Text color={colors.text} fontSize="$5" fontWeight="900">
                      {formatCurrency(space.value)}
                    </Text>
                  </YStack>
                </Card>
              );
            })}
          </XStack>
        </YStack>

        <YStack gap="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <Text color={colors.text} fontSize="$7" fontWeight="900">
              Metas activas
            </Text>
            <Text color={colors.green} fontSize="$5" fontWeight="700" onPress={() => router.push("/(tabs)/goals-projects")}>
              Ver todas
            </Text>
          </XStack>
          {primaryGoal ? (
            <Card backgroundColor={colors.panel} borderColor={colors.border} borderWidth={1} borderRadius="$5" padding="$4">
              <YStack gap="$3">
                <XStack justifyContent="space-between">
                  <Text color={colors.text} fontSize="$6" fontWeight="900">
                    {primaryGoal.name}
                  </Text>
                  <Text color={colors.muted} fontSize="$5" fontWeight="800">
                    {Math.min(100, Math.round(primaryGoal.progressPercent))}%
                  </Text>
                </XStack>
                <Progress value={Math.min(100, Math.round(primaryGoal.progressPercent))} backgroundColor="#26354d">
                  <Progress.Indicator backgroundColor={colors.green} />
                </Progress>
                <XStack justifyContent="space-between">
                  <Paragraph color={colors.muted}>{formatCurrency(primaryGoal.currentAmount)}</Paragraph>
                  <Paragraph color={colors.muted}>{formatCurrency(primaryGoal.targetAmount)}</Paragraph>
                </XStack>
              </YStack>
            </Card>
          ) : (
            <Card backgroundColor={colors.panel} borderColor={colors.border} borderWidth={1} borderRadius="$5" padding="$4">
              <Paragraph color={colors.muted}>No tienes metas activas.</Paragraph>
            </Card>
          )}
        </YStack>

        <YStack gap="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <Text color={colors.text} fontSize="$7" fontWeight="900">
              Movimientos recientes
            </Text>
            <Text color={colors.green} fontSize="$5" fontWeight="700" onPress={() => router.push("/(tabs)/transactions")}>
              Ver todos
            </Text>
          </XStack>
          {data?.latestTransactions?.length ? (
            data.latestTransactions.slice(0, 3).map((item) => {
              const isIncome = Number(item.type) === 1;
              const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
              return (
                <Card key={item.id} backgroundColor={colors.panel} borderColor={colors.border} borderWidth={1} borderRadius="$5" padding="$4">
                  <XStack justifyContent="space-between" gap="$3" alignItems="center">
                    <XStack flex={1} gap="$3" alignItems="center">
                      <YStack width={52} height={52} borderRadius={26} alignItems="center" justifyContent="center" backgroundColor={isIncome ? "#073328" : "#221122"}>
                        <Icon color={isIncome ? colors.green : colors.red} size={24} />
                      </YStack>
                      <YStack flex={1}>
                        <Text color={colors.text} fontSize="$6" fontWeight="900">
                          {item.name}
                        </Text>
                        <Paragraph color={colors.muted}>
                          {transactionLabel(item.type)} • {formatDate(item.date)}
                        </Paragraph>
                      </YStack>
                    </XStack>
                    <Text color={isIncome ? colors.green : colors.red} fontSize="$5" fontWeight="900">
                      {isIncome ? "+" : "-"}{formatCurrency(item.value)}
                    </Text>
                  </XStack>
                </Card>
              );
            })
          ) : (
            <Card backgroundColor={colors.panel} borderColor={colors.border} borderWidth={1} borderRadius="$5" padding="$4">
              <Paragraph color={colors.muted}>Todavia no hay movimientos.</Paragraph>
            </Card>
          )}
        </YStack>
      </Screen>

      <Button
        position="absolute"
        right="$5"
        bottom="$8"
        width={78}
        height={78}
        circular
        backgroundColor={colors.green}
        pressStyle={{ scale: 0.96, backgroundColor: colors.green }}
        onPress={() => setQuickOpen(true)}
      >
        <Plus color="#07111f" size={30} />
      </Button>

      <Modal transparent visible={quickOpen} animationType="fade" onRequestClose={() => setQuickOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.82)", justifyContent: "center", padding: 28 }} onPress={() => setQuickOpen(false)}>
          <Pressable>
            <Card backgroundColor={colors.panel} borderColor={colors.border} borderWidth={1} borderRadius="$6" padding="$5">
              <YStack gap="$5">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color={colors.text} fontSize="$7" fontWeight="900" flex={1} textAlign="center">
                    Nueva Transaccion
                  </Text>
                  <X color={colors.text} size={24} onPress={() => setQuickOpen(false)} />
                </XStack>
                <XStack gap="$3">
                  {[
                    { label: "Ingreso", icon: ArrowDownLeft, color: colors.green },
                    { label: "Gasto", icon: ArrowUpRight, color: colors.red },
                    { label: "Transferir", icon: WalletMinimal, color: colors.blue },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.label}
                        flex={1}
                        height={134}
                        backgroundColor={colors.bg}
                        borderWidth={1}
                        borderColor={item.label === "Ingreso" ? colors.green : colors.border}
                        borderRadius="$5"
                        onPress={() => {
                          setQuickOpen(false);
                          router.push("/(tabs)/transactions");
                        }}
                      >
                        <YStack alignItems="center" gap="$3">
                          <Icon color={item.color} size={24} />
                          <Text color={colors.text} fontWeight="900">
                            {item.label}
                          </Text>
                        </YStack>
                      </Button>
                    );
                  })}
                </XStack>
              </YStack>
            </Card>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
