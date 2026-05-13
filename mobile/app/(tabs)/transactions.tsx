import { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable } from "react-native";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react-native";
import { Button, Card, Input, Paragraph, Text, XStack, YStack } from "tamagui";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useTransactionsQuery,
} from "@/features/finance/hooks";
import { Screen } from "@/ui/components/screen";
import { TransactionType } from "@/services/api/types";
import { formatCurrency, formatDate, parseAmount } from "@/utils/format";

const colors = {
  bg: "#070b14",
  panel: "#0f1726",
  border: "#1d2b44",
  mutedPanel: "#223047",
  text: "#f8fafc",
  muted: "#9fb6d8",
  green: "#34d399",
  blue: "#3b82f6",
  red: "#b42d2d",
};

function todayIso() {
  return new Date().toISOString();
}

type Filter = "Todos" | "Ingresos" | "Gastos" | "Transferencias";

export default function TransactionsScreen() {
  const transactions = useTransactionsQuery();
  const categories = useCategoriesQuery();
  const createTransaction = useCreateTransactionMutation();
  const createCategory = useCreateCategoryMutation();
  const deleteTransaction = useDeleteTransactionMutation();

  const [type, setType] = useState<TransactionType>(2);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("Todos");
  const [formOpen, setFormOpen] = useState(false);

  const submitTransaction = async () => {
    const amount = parseAmount(value);
    if (!name.trim() || amount <= 0) return;

    try {
      await createTransaction.mutateAsync({
        type,
        name: name.trim(),
        value: amount,
        description: description.trim() || null,
        categoryId,
        date: todayIso(),
      });

      setName("");
      setValue("");
      setDescription("");
      setFormOpen(false);
    } catch {
      // La mutacion expone el error en createTransaction.error.
    }
  };

  const submitCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      const created = await createCategory.mutateAsync({ name: categoryName.trim() });
      setCategoryId(created.id);
      setCategoryName("");
    } catch {
      // La mutacion expone el error en createCategory.error.
    }
  };

  const filteredTransactions = useMemo(() => {
    return (transactions.data ?? []).filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.categoryName ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "Todos" ||
        (filter === "Ingresos" && Number(item.type) === 1) ||
        (filter === "Gastos" && Number(item.type) === 2) ||
        filter === "Transferencias";
      return matchesSearch && matchesFilter;
    });
  }, [filter, search, transactions.data]);

  if (transactions.isPending || categories.isPending) return <ActivityIndicator color={colors.green} />;

  const filters: Filter[] = ["Todos", "Ingresos", "Gastos", "Transferencias"];

  return (
    <>
      <Screen>
        <Text color={colors.text} fontSize="$8" fontWeight="900">
          Transacciones
        </Text>

        <XStack alignItems="center" gap="$3" borderWidth={1} borderColor={colors.border} borderRadius="$5" paddingHorizontal="$4" height={58} backgroundColor={colors.bg}>
          <Search color={colors.muted} size={24} />
          <Input
            flex={1}
            unstyled
            color="$color"
            placeholder="Buscar transacciones..."
            placeholderTextColor="$secondary"
            value={search}
            onChangeText={setSearch}
          />
        </XStack>

        <XStack backgroundColor={colors.mutedPanel} borderRadius="$5" padding="$1" gap="$1">
          {filters.map((item) => (
            <Button
              key={item}
              flex={1}
              height={46}
              backgroundColor={filter === item ? colors.bg : "transparent"}
              borderRadius="$4"
              onPress={() => setFilter(item)}
            >
              <Text color={filter === item ? colors.text : colors.muted} fontWeight="900">{item}</Text>
            </Button>
          ))}
        </XStack>

        <YStack gap="$3">
          {filteredTransactions.length ? (
            filteredTransactions.map((item) => {
              const isIncome = Number(item.type) === 1;
              const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
              return (
                <Card key={item.id} backgroundColor={colors.panel} borderColor={colors.border} borderWidth={1} borderRadius="$5" padding="$4">
                  <XStack justifyContent="space-between" alignItems="center" gap="$3">
                    <XStack flex={1} gap="$3" alignItems="center">
                      <YStack width={56} height={56} borderRadius={28} alignItems="center" justifyContent="center" backgroundColor={isIncome ? "#073328" : "#221122"}>
                        <Icon color={isIncome ? colors.green : colors.red} size={25} />
                      </YStack>
                      <YStack flex={1}>
                        <Text color={colors.text} fontSize="$6" fontWeight="900">{item.name}</Text>
                        <Paragraph color={colors.muted}>
                          {isIncome ? "Ingreso" : "Gasto"} • {formatDate(item.date)}
                        </Paragraph>
                        {item.description ? <Paragraph color={colors.muted}>{item.description}</Paragraph> : null}
                      </YStack>
                    </XStack>
                    <XStack alignItems="center" gap="$3">
                      <Text color={isIncome ? colors.green : colors.red} fontSize="$6" fontWeight="900">
                        {isIncome ? "+" : "-"}{formatCurrency(item.value)}
                      </Text>
                      <Edit3 color={colors.muted} size={22} />
                      <Trash2 color={colors.muted} size={22} onPress={() => deleteTransaction.mutate(item.id)} />
                    </XStack>
                  </XStack>
                </Card>
              );
            })
          ) : (
            <Card backgroundColor={colors.panel} borderColor={colors.border} borderWidth={1} borderRadius="$5" padding="$5">
              <Paragraph color={colors.muted}>No hay transacciones para este filtro.</Paragraph>
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
        onPress={() => setFormOpen(true)}
      >
        <Plus color="#07111f" size={30} />
      </Button>

      <Modal transparent visible={formOpen} animationType="slide" onRequestClose={() => setFormOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.82)", justifyContent: "flex-end" }} onPress={() => setFormOpen(false)}>
          <Pressable>
            <Card backgroundColor={colors.panel} borderColor={colors.border} borderWidth={1} borderRadius="$6" padding="$5" margin="$4">
              <YStack gap="$4">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color={colors.text} fontSize="$7" fontWeight="900">Nueva Transaccion</Text>
                  <X color={colors.text} size={24} onPress={() => setFormOpen(false)} />
                </XStack>

                <XStack gap="$2">
                  <Button flex={1} backgroundColor={type === 1 ? colors.green : colors.bg} borderWidth={1} borderColor={type === 1 ? colors.green : colors.border} onPress={() => setType(1)}>
                    <Text color={type === 1 ? "#07111f" : colors.muted} fontWeight="900">Ingreso</Text>
                  </Button>
                  <Button flex={1} backgroundColor={type === 2 ? colors.green : colors.bg} borderWidth={1} borderColor={type === 2 ? colors.green : colors.border} onPress={() => setType(2)}>
                    <Text color={type === 2 ? "#07111f" : colors.muted} fontWeight="900">Gasto</Text>
                  </Button>
                </XStack>

                <Input placeholder="Nombre" value={name} onChangeText={setName} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />
                <Input placeholder="Valor" keyboardType="numeric" value={value} onChangeText={setValue} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />
                <Input placeholder="Descripcion opcional" value={description} onChangeText={setDescription} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />

                <XStack gap="$2" flexWrap="wrap">
                  <Button size="$3" backgroundColor={categoryId === null ? colors.green : colors.bg} borderColor={colors.border} borderWidth={1} onPress={() => setCategoryId(null)}>
                    <Text color={categoryId === null ? "#07111f" : colors.muted}>Sin categoria</Text>
                  </Button>
                  {categories.data?.map((category) => (
                    <Button key={category.id} size="$3" backgroundColor={categoryId === category.id ? colors.green : colors.bg} borderColor={colors.border} borderWidth={1} onPress={() => setCategoryId(category.id)}>
                      <Text color={categoryId === category.id ? "#07111f" : colors.muted}>{category.name}</Text>
                    </Button>
                  ))}
                </XStack>

                <XStack gap="$2">
                  <Input flex={1} placeholder="Nueva categoria" value={categoryName} onChangeText={setCategoryName} placeholderTextColor="$secondary" backgroundColor={colors.bg} borderColor={colors.border} color="$color" />
                  <Button backgroundColor={colors.mutedPanel} onPress={submitCategory} disabled={createCategory.isPending}><Text color={colors.text}>Crear</Text></Button>
                </XStack>

                <Button backgroundColor={colors.green} disabled={createTransaction.isPending} onPress={submitTransaction}>
                  <Text color="#07111f" fontWeight="900">{createTransaction.isPending ? "Guardando..." : "Guardar movimiento"}</Text>
                </Button>
                {createTransaction.error ? <Paragraph color={colors.red}>{createTransaction.error.message}</Paragraph> : null}
              </YStack>
            </Card>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
