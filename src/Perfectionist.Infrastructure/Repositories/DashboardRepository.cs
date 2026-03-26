using Microsoft.EntityFrameworkCore;
using Perfectionist.Application.Interfaces;
using Perfectionist.Domain.Entities;
using Perfectionist.Domain.Enums;
using Perfectionist.Infrastructure.Persistence;

namespace Perfectionist.Infrastructure.Repositories;

public sealed class DashboardRepository : IDashboardRepository
{
    private readonly AppDbContext _db;

    public DashboardRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<(decimal TotalIncome, decimal TotalExpense)> GetTotalsAsync(Guid userId, CancellationToken ct)
    {
        var income = await _db.Transactions.AsNoTracking()
            .Where(x => x.UserId == userId && x.Type == TransactionType.Income)
            .SumAsync(x => (decimal?)x.Value, ct) ?? 0m;

        var expense = await _db.Transactions.AsNoTracking()
            .Where(x => x.UserId == userId && x.Type == TransactionType.Expense)
            .SumAsync(x => (decimal?)x.Value, ct) ?? 0m;

        return (income, expense);
    }

    public async Task<IReadOnlyList<Transaction>> GetLatestTransactionsWithCategoryAsync(Guid userId, int take, CancellationToken ct) =>
        await _db.Transactions.AsNoTracking()
            .Include(x => x.Category)
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.Date)
            .Take(take)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<Goal>> GetGoalsAsync(Guid userId, CancellationToken ct) =>
        await _db.Goals.AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<(Guid? CategoryId, string CategoryName, decimal TotalExpense)>> GetExpenseByCategoryAsync(Guid userId, CancellationToken ct)
    {
        var rows = await _db.Transactions.AsNoTracking()
            .Where(x => x.UserId == userId && x.Type == TransactionType.Expense)
            .GroupBy(x => x.CategoryId)
            .Select(g => new { CategoryId = g.Key, Total = g.Sum(x => x.Value) })
            .ToListAsync(ct);

        var categoryIds = rows.Where(r => r.CategoryId.HasValue).Select(r => r.CategoryId!.Value).Distinct().ToList();
        var categories = await _db.Categories.AsNoTracking()
            .Where(c => c.UserId == userId && categoryIds.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id, c => c.Name, ct);

        return rows
            .Select(r =>
            {
                var name = r.CategoryId.HasValue && categories.TryGetValue(r.CategoryId.Value, out var n) ? n : "Sin categoría";
                return (r.CategoryId, name, r.Total);
            })
            .OrderByDescending(x => x.Total)
            .ToList();
    }
}

