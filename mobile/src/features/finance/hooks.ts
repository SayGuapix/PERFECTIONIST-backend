import { useQuery } from "@tanstack/react-query";
import { financeService } from "@/services/api/finance-service";

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

export function useGoalsQuery() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: financeService.getGoals,
  });
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: financeService.getProjects,
  });
}
