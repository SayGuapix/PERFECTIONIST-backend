namespace Perfectionist.Application.Dashboard.Dtos;

public sealed record DashboardCategorySummary(Guid? CategoryId, string CategoryName, decimal TotalExpense);

public sealed record DashboardGoalProgress(Guid Id, string Name, decimal TargetAmount, decimal CurrentAmount, decimal ProgressPercent);

public sealed record DashboardResponse(
    decimal Balance,
    decimal TotalIncome,
    decimal TotalExpense,
    IReadOnlyList<Perfectionist.Application.Transactions.Dtos.TransactionResponse> LatestTransactions,
    IReadOnlyList<DashboardGoalProgress> Goals,
    IReadOnlyList<DashboardCategorySummary> ExpenseByCategory
);

