import { api } from "@/services/api/client";
import {
  ApiListResponse,
  Category,
  CreateCategoryPayload,
  CreateFixedExpensePayload,
  CreateGoalPayload,
  CreateProjectPayload,
  CreateTransactionPayload,
  DashboardData,
  FixedExpense,
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
  createTransaction: async (payload: CreateTransactionPayload) => {
    const { data } = await api.post<Transaction>("/transactions", payload);
    return data;
  },
  deleteTransaction: async (id: string) => {
    await api.delete(`/transactions/${id}`);
  },
  getCategories: async () => {
    const { data } = await api.get<Category[]>("/categories");
    return data;
  },
  createCategory: async (payload: CreateCategoryPayload) => {
    const { data } = await api.post<Category>("/categories", payload);
    return data;
  },
  getGoals: async () => {
    const { data } = await api.get<Goal[]>("/goals");
    return data;
  },
  createGoal: async (payload: CreateGoalPayload) => {
    const { data } = await api.post<Goal>("/goals", payload);
    return data;
  },
  addToGoal: async (id: string, amount: number) => {
    const { data } = await api.post<Goal>(`/goals/${id}/add`, { amount });
    return data;
  },
  deleteGoal: async (id: string) => {
    await api.delete(`/goals/${id}`);
  },
  getProjects: async () => {
    const { data } = await api.get<Project[]>("/projects");
    return data;
  },
  createProject: async (payload: CreateProjectPayload) => {
    const { data } = await api.post<Project>("/projects", payload);
    return data;
  },
  deleteProject: async (id: string) => {
    await api.delete(`/projects/${id}`);
  },
  getFixedExpenses: async () => {
    const { data } = await api.get<FixedExpense[]>("/fixed-expenses");
    return data;
  },
  createFixedExpense: async (payload: CreateFixedExpensePayload) => {
    const { data } = await api.post<FixedExpense>("/fixed-expenses", payload);
    return data;
  },
  deleteFixedExpense: async (id: string) => {
    await api.delete(`/fixed-expenses/${id}`);
  },
};
