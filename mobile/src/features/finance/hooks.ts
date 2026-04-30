import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { financeService } from "@/services/api/finance-service";
import {
  CreateCategoryPayload,
  CreateFixedExpensePayload,
  CreateGoalPayload,
  CreateProjectPayload,
  CreateTransactionPayload,
} from "@/services/api/types";

const financeKeys = [
  ["dashboard"],
  ["transactions"],
  ["categories"],
  ["goals"],
  ["projects"],
  ["fixed-expenses"],
];

function useInvalidateFinance() {
  const queryClient = useQueryClient();
  return () => {
    financeKeys.forEach((queryKey) => {
      void queryClient.invalidateQueries({ queryKey });
    });
  };
}

export function useDashboardQuery() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: financeService.getDashboard,
  });
}

export function useTransactionsQuery() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: financeService.getTransactions,
  });
}

export function useCreateTransactionMutation() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      financeService.createTransaction(payload),
    onSuccess: invalidate,
  });
}

export function useDeleteTransactionMutation() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: financeService.deleteTransaction,
    onSuccess: invalidate,
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: financeService.getCategories,
  });
}

export function useCreateCategoryMutation() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      financeService.createCategory(payload),
    onSuccess: invalidate,
  });
}

export function useGoalsQuery() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: financeService.getGoals,
  });
}

export function useCreateGoalMutation() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: (payload: CreateGoalPayload) => financeService.createGoal(payload),
    onSuccess: invalidate,
  });
}

export function useAddToGoalMutation() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      financeService.addToGoal(id, amount),
    onSuccess: invalidate,
  });
}

export function useDeleteGoalMutation() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: financeService.deleteGoal,
    onSuccess: invalidate,
  });
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: financeService.getProjects,
  });
}

export function useCreateProjectMutation() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      financeService.createProject(payload),
    onSuccess: invalidate,
  });
}

export function useDeleteProjectMutation() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: financeService.deleteProject,
    onSuccess: invalidate,
  });
}

export function useFixedExpensesQuery() {
  return useQuery({
    queryKey: ["fixed-expenses"],
    queryFn: financeService.getFixedExpenses,
  });
}

export function useCreateFixedExpenseMutation() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: (payload: CreateFixedExpensePayload) =>
      financeService.createFixedExpense(payload),
    onSuccess: invalidate,
  });
}

export function useDeleteFixedExpenseMutation() {
  const invalidate = useInvalidateFinance();
  return useMutation({
    mutationFn: financeService.deleteFixedExpense,
    onSuccess: invalidate,
  });
}
