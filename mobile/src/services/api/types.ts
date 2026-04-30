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
  latestTransactions: Transaction[];
  goals: DashboardGoalProgress[];
  expenseByCategory: DashboardCategorySummary[];
}

export interface Transaction {
  id: string;
  name: string;
  description?: string | null;
  value: number;
  type: TransactionType;
  categoryId?: string | null;
  categoryName?: string | null;
  date: string;
}

export type TransactionType = 1 | 2;

export interface CreateTransactionPayload {
  type: TransactionType;
  value: number;
  name: string;
  description?: string | null;
  categoryId?: string | null;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string | null;
  progressPercent: number;
}

export interface CreateGoalPayload {
  name: string;
  targetAmount: number;
  targetDate?: string | null;
}

export interface AddToGoalPayload {
  amount: number;
}

export interface Project {
  id: string;
  name: string;
  budget: number;
  spent: number;
  remaining: number;
}

export interface CreateProjectPayload {
  name: string;
  budget: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface CreateCategoryPayload {
  name: string;
}

export type Frequency = 1 | 2 | 3 | 4 | 5;

export interface FixedExpense {
  id: string;
  name: string;
  value: number;
  frequency: Frequency;
  nextDate: string;
}

export interface CreateFixedExpensePayload {
  name: string;
  value: number;
  frequency: Frequency;
  nextDate: string;
}

export interface DashboardGoalProgress {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  progressPercent: number;
}

export interface DashboardCategorySummary {
  categoryId?: string | null;
  categoryName: string;
  totalExpense: number;
}
