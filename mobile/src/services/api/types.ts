export interface ApiListResponse<T> {
  items: T[];
  totalCount?: number;
}

export interface ApiErrorShape {
  message: string;
}

export interface AuthResponse {
  token: string;
}

export interface DashboardData {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

export interface Transaction {
  id: string;
  name: string;
  description?: string | null;
  value: number;
  type: number | string;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  progressPercent: number;
}

export interface Project {
  id: string;
  name: string;
  budget: number;
  spent: number;
  remaining: number;
}
