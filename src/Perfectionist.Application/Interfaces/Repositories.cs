using Perfectionist.Domain.Entities;
using Perfectionist.Domain.Enums;

namespace Perfectionist.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email, CancellationToken ct);
    Task<User?> GetByIdAsync(Guid id, CancellationToken ct);
    Task AddAsync(User user, CancellationToken ct);
    Task<bool> EmailExistsAsync(string email, CancellationToken ct);
}

public interface ICategoryRepository
{
    Task<Category?> GetAsync(Guid userId, Guid id, CancellationToken ct);
    Task<IReadOnlyList<Category>> ListAsync(Guid userId, CancellationToken ct);
    Task AddAsync(Category category, CancellationToken ct);
    Task DeleteAsync(Category category, CancellationToken ct);
}

public interface ITransactionRepository
{
    Task<Transaction?> GetAsync(Guid userId, Guid id, CancellationToken ct);
    Task<Transaction?> GetWithCategoryAsync(Guid userId, Guid id, CancellationToken ct);
    Task<(IReadOnlyList<Transaction> Items, int TotalCount)> SearchWithCategoryAsync(
        Guid userId,
        TransactionType? type,
        Guid? categoryId,
        DateTimeOffset? from,
        DateTimeOffset? to,
        int page,
        int pageSize,
        CancellationToken ct);
    Task AddAsync(Transaction transaction, CancellationToken ct);
    Task DeleteAsync(Transaction transaction, CancellationToken ct);
}

public interface IGoalRepository
{
    Task<Goal?> GetAsync(Guid userId, Guid id, CancellationToken ct);
    Task<IReadOnlyList<Goal>> ListAsync(Guid userId, CancellationToken ct);
    Task AddAsync(Goal goal, CancellationToken ct);
    Task DeleteAsync(Goal goal, CancellationToken ct);
}

public interface IProjectRepository
{
    Task<Project?> GetAsync(Guid userId, Guid id, CancellationToken ct);
    Task<Project?> GetWithTransactionsAsync(Guid userId, Guid id, CancellationToken ct);
    Task<IReadOnlyList<Project>> ListWithTransactionsAsync(Guid userId, CancellationToken ct);
    Task<IReadOnlyList<Project>> ListAsync(Guid userId, CancellationToken ct);
    Task AddAsync(Project project, CancellationToken ct);
    Task DeleteAsync(Project project, CancellationToken ct);
    Task<bool> LinkTransactionAsync(Guid userId, Guid projectId, Guid transactionId, CancellationToken ct);
}

public interface IFixedExpenseRepository
{
    Task<FixedExpense?> GetAsync(Guid userId, Guid id, CancellationToken ct);
    Task<IReadOnlyList<FixedExpense>> ListAsync(Guid userId, CancellationToken ct);
    Task AddAsync(FixedExpense fixedExpense, CancellationToken ct);
    Task DeleteAsync(FixedExpense fixedExpense, CancellationToken ct);
}

public interface IDashboardRepository
{
    Task<(decimal TotalIncome, decimal TotalExpense)> GetTotalsAsync(Guid userId, CancellationToken ct);
    Task<IReadOnlyList<Transaction>> GetLatestTransactionsWithCategoryAsync(Guid userId, int take, CancellationToken ct);
    Task<IReadOnlyList<Goal>> GetGoalsAsync(Guid userId, CancellationToken ct);
    Task<IReadOnlyList<(Guid? CategoryId, string CategoryName, decimal TotalExpense)>> GetExpenseByCategoryAsync(Guid userId, CancellationToken ct);
}

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct);
}

