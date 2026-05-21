import { ComponentType, useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView } from "react-native";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Briefcase,
  CalendarClock,
  FolderOpen,
  Target,
  Wallet,
  X,
} from "lucide-react-native";
import { Button, Card, Input, Paragraph, Text, XStack, YStack } from "tamagui";
import {
  useAddToGoalMutation,
  useCategoriesQuery,
  useCreateCategoryMutation,
  useCreateTransactionMutation,
  useFixedExpensesQuery,
  useGoalsQuery,
  useLinkTransactionToProjectMutation,
  useProjectsQuery,
} from "@/features/finance/hooks";
import { TransactionType } from "@/services/api/types";
import { parseAmount } from "@/utils/format";

const colors = {
  bg: "#070b14",
  panel: "#0f1726",
  border: "#1d2b44",
  mutedPanel: "#223047",
  text: "#f8fafc",
  muted: "#9fb6d8",
  green: "#34d399",
  blue: "#3b82f6",
  orange: "#f59e0b",
  red: "#b42d2d",
};

type TargetKind = "general" | "category" | "goal" | "project" | "fixed";

interface TargetOption {
  id: string | null;
  name: string;
}

interface TargetGroup {
  kind: TargetKind;
  title: string;
  items: TargetOption[];
  icon: ComponentType<{ color: string; size: number }>;
  color: string;
}

interface TransactionEntryModalProps {
  visible: boolean;
  onClose: () => void;
}

function todayIso() {
  return new Date().toISOString();
}

export function TransactionEntryModal({ visible, onClose }: TransactionEntryModalProps) {
  const categories = useCategoriesQuery();
  const goals = useGoalsQuery();
  const projects = useProjectsQuery();
  const fixedExpenses = useFixedExpensesQuery();
  const createTransaction = useCreateTransactionMutation();
  const createCategory = useCreateCategoryMutation();
  const addToGoal = useAddToGoalMutation();
  const linkProject = useLinkTransactionToProjectMutation();

  const [type, setType] = useState<TransactionType | null>(null);
  const [targetKind, setTargetKind] = useState<TargetKind>("general");
  const [targetId, setTargetId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (!visible) return;
    setType(null);
    setTargetKind("general");
    setTargetId(null);
    setName("");
    setValue("");
    setDescription("");
    setCategoryName("");
  }, [visible]);

  const targetGroups = useMemo(() => {
    if (!type) return [];

    const groups: TargetGroup[] = [
      {
        kind: "general",
        title: "Cuenta general",
        items: [{ id: null, name: "Sin espacio asignado" }],
        icon: Wallet,
        color: colors.green,
      },
      {
        kind: "category",
        title: "Categorias casuales",
        items: categories.data ?? [],
        icon: FolderOpen,
        color: colors.blue,
      },
    ];

    if (type === 1) {
      groups.push({
        kind: "goal",
        title: "Metas",
        items: goals.data ?? [],
        icon: Target,
        color: colors.green,
      });
    } else {
      groups.push(
        {
          kind: "project",
          title: "Proyectos",
          items: projects.data ?? [],
          icon: Briefcase,
          color: colors.blue,
        },
        {
          kind: "fixed",
          title: "Gastos fijos",
          items: fixedExpenses.data ?? [],
          icon: CalendarClock,
          color: colors.orange,
        },
      );
    }

    return groups;
  }, [categories.data, fixedExpenses.data, goals.data, projects.data, type]);

  const selectType = (nextType: TransactionType) => {
    setType(nextType);
    setTargetKind("general");
    setTargetId(null);
  };

  const selectTarget = (kind: TargetKind, id: string | null) => {
    setTargetKind(kind);
    setTargetId(id);
  };

  const submitCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      const created = await createCategory.mutateAsync({ name: categoryName.trim() });
      setTargetKind("category");
      setTargetId(created.id);
      setCategoryName("");
    } catch {
      // La mutacion expone el error en createCategory.error.
    }
  };

  const submitTransaction = async () => {
    if (!type) return;

    const amount = parseAmount(value);
    const selectedGoal = goals.data?.find((goal) => goal.id === targetId);
    const selectedProject = projects.data?.find((project) => project.id === targetId);
    const selectedFixed = fixedExpenses.data?.find((item) => item.id === targetId);
    const selectedCategoryId = targetKind === "category" ? targetId : null;
    const resolvedName = name.trim() || selectedGoal?.name || selectedProject?.name || selectedFixed?.name || "";

    if (!resolvedName || amount <= 0) return;
    if ((targetKind === "goal" || targetKind === "project" || targetKind === "fixed") && !targetId) return;

    try {
      const created = await createTransaction.mutateAsync({
        type,
        name: resolvedName,
        value: amount,
        description: description.trim() || null,
        categoryId: selectedCategoryId,
        date: todayIso(),
      });

      if (targetKind === "goal" && targetId) {
        await addToGoal.mutateAsync({ id: targetId, amount });
      }

      if (targetKind === "project" && targetId) {
        await linkProject.mutateAsync({ projectId: targetId, transactionId: created.id });
      }

      onClose();
    } catch {
      // Las mutaciones exponen el error en sus respectivos estados.
    }
  };

  const saving =
    createTransaction.isPending ||
    addToGoal.isPending ||
    linkProject.isPending;

  const errorMessage =
    createTransaction.error?.message ||
    addToGoal.error?.message ||
    linkProject.error?.message;

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.82)", justifyContent: "flex-end" }} onPress={onClose}>
        <Pressable>
          <Card backgroundColor={colors.panel} borderColor={colors.border} borderWidth={1} borderRadius="$6" margin="$4" maxHeight="88%">
            <ScrollView keyboardShouldPersistTaps="handled">
              <YStack gap="$4" padding="$5">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color={colors.text} fontSize="$7" fontWeight="900">Nuevo movimiento</Text>
                  <X color={colors.text} size={24} onPress={onClose} />
                </XStack>

                <YStack gap="$2">
                  <Paragraph color={colors.muted}>Elige que quieres registrar</Paragraph>
                  <XStack gap="$2">
                    <Button flex={1} minHeight={58} backgroundColor={type === 1 ? colors.green : colors.bg} borderWidth={1} borderColor={type === 1 ? colors.green : colors.border} onPress={() => selectType(1)}>
                      <XStack gap="$2" alignItems="center">
                        <ArrowDownLeft color={type === 1 ? "#07111f" : colors.green} size={22} />
                        <Text color={type === 1 ? "#07111f" : colors.text} fontWeight="900">Ingreso</Text>
                      </XStack>
                    </Button>
                    <Button flex={1} minHeight={58} backgroundColor={type === 2 ? colors.green : colors.bg} borderWidth={1} borderColor={type === 2 ? colors.green : colors.border} onPress={() => selectType(2)}>
                      <XStack gap="$2" alignItems="center">
                        <ArrowUpRight color={type === 2 ? "#07111f" : colors.red} size={22} />
                        <Text color={type === 2 ? "#07111f" : colors.text} fontWeight="900">Egreso</Text>
                      </XStack>
                    </Button>
                  </XStack>
                </YStack>

                {type ? (
                  <>
                    <YStack gap="$3">
                      <Text color={colors.text} fontSize="$6" fontWeight="900">Destino del movimiento</Text>
                      {targetGroups.map((group) => {
                        const Icon = group.icon;
                        return (
                          <YStack key={group.kind} gap="$2">
                            <XStack alignItems="center" gap="$2">
                              <Icon color={group.color} size={18} />
                              <Text color={colors.muted} fontWeight="900">{group.title}</Text>
                            </XStack>
                            {group.items.length ? (
                              <XStack gap="$2" flexWrap="wrap">
                                {group.items.map((item) => {
                                  const selected = targetKind === group.kind && targetId === item.id;
                                  return (
                                    <Button key={item.id ?? "general"} size="$3" backgroundColor={selected ? colors.green : colors.bg} borderColor={selected ? colors.green : colors.border} borderWidth={1} onPress={() => selectTarget(group.kind, item.id)}>
                                      <Text color={selected ? "#07111f" : colors.muted}>{item.name}</Text>
                                    </Button>
                                  );
                                })}
                              </XStack>
                            ) : (
                              <Paragraph color={colors.muted}>No hay opciones creadas en este espacio.</Paragraph>
                            )}
                          </YStack>
                        );
                      })}
                    </YStack>

                    <XStack gap="$2">
                      <Input flex={1} placeholder="Nueva categoria" value={categoryName} onChangeText={setCategoryName} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />
                      <Button backgroundColor={colors.mutedPanel} onPress={submitCategory} disabled={createCategory.isPending}>
                        <Text color={colors.text}>{createCategory.isPending ? "..." : "Crear"}</Text>
                      </Button>
                    </XStack>

                    <Input placeholder="Nombre" value={name} onChangeText={setName} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />
                    <Input placeholder="Valor" keyboardType="numeric" value={value} onChangeText={setValue} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />
                    <Input placeholder="Descripcion opcional" value={description} onChangeText={setDescription} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />

                    <Button backgroundColor={colors.green} disabled={saving} onPress={submitTransaction}>
                      <Text color="#07111f" fontWeight="900">{saving ? "Guardando..." : "Guardar movimiento"}</Text>
                    </Button>
                    {errorMessage ? <Paragraph color={colors.red}>{errorMessage}</Paragraph> : null}
                  </>
                ) : null}
              </YStack>
            </ScrollView>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
