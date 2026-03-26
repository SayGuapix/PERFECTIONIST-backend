using Microsoft.EntityFrameworkCore;
using Perfectionist.Application.Interfaces;
using Perfectionist.Domain.Entities;
using Perfectionist.Infrastructure.Persistence;

namespace Perfectionist.Infrastructure.Repositories;

public sealed class FixedExpenseRepository : IFixedExpenseRepository
{
    private readonly AppDbContext _db;

    public FixedExpenseRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<FixedExpense?> GetAsync(Guid userId, Guid id, CancellationToken ct) =>
        _db.FixedExpenses.FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id, ct);

    public async Task<IReadOnlyList<FixedExpense>> ListAsync(Guid userId, CancellationToken ct) =>
        await _db.FixedExpenses.AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.NextDate)
            .ToListAsync(ct);

    public async Task AddAsync(FixedExpense fixedExpense, CancellationToken ct) =>
        await _db.FixedExpenses.AddAsync(fixedExpense, ct);

    public Task DeleteAsync(FixedExpense fixedExpense, CancellationToken ct)
    {
        _db.FixedExpenses.Remove(fixedExpense);
        return Task.CompletedTask;
    }
}

