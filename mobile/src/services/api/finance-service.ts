import { api } from "@/services/api/client";
import {
  ApiListResponse,
  DashboardData,
  Goal,
  Project,
  Transaction,
} from "@/services/api/types";

export const financeService = {
  getDashboard: async () => {
    const { data } = await api.get<DashboardData>("/dashboard");
    return data;
  },
  getTransactions: async () => {
    const { data } = await api.get<ApiListResponse<Transaction>>("/transactions");
    return data.items;
  },
  createTransaction: async (payload: Omit<Transaction, "id">) => {
    const { data } = await api.post<Transaction>("/transactions", payload);
    return data;
  },
  getGoals: async () => {
    const { data } = await api.get<Goal[]>("/goals");
    return data;
  },
  getProjects: async () => {
    const { data } = await api.get<Project[]>("/projects");
    return data;
  },
};
