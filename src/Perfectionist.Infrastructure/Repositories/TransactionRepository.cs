using Microsoft.EntityFrameworkCore;
using Perfectionist.Application.Interfaces;
using Perfectionist.Domain.Entities;
using Perfectionist.Domain.Enums;
using Perfectionist.Infrastructure.Persistence;

namespace Perfectionist.Infrastructure.Repositories;

public sealed class TransactionRepository : ITransactionRepository
{
    private readonly AppDbContext _db;

    public TransactionRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<Transaction?> GetAsync(Guid userId, Guid id, CancellationToken ct) =>
        _db.Transactions.FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id, ct);

    public Task<Transaction?> GetWithCategoryAsync(Guid userId, Guid id, CancellationToken ct) =>
        _db.Transactions.AsNoTracking()
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id, ct);

    public async Task<(IReadOnlyList<Transaction> Items, int TotalCount)> SearchWithCategoryAsync(
        Guid userId,
        TransactionType? type,
        Guid? categoryId,
        DateTimeOffset? from,
        DateTimeOffset? to,
        int page,
        int pageSize,
        CancellationToken ct)
    {
        var q = _db.Transactions.AsNoTracking().Include(x => x.Category).Where(x => x.UserId == userId);

        if (type.HasValue) q = q.Where(x => x.Type == type.Value);
        if (categoryId.HasValue) q = q.Where(x => x.CategoryId == categoryId.Value);
        if (from.HasValue) q = q.Where(x => x.Date >= from.Value);
        if (to.HasValue) q = q.Where(x => x.Date <= to.Value);

        q = q.OrderByDescending(x => x.Date);

        var total = await q.CountAsync(ct);
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return (items, total);
    }

    public async Task AddAsync(Transaction transaction, CancellationToken ct) =>
        await _db.Transactions.AddAsync(transaction, ct);

    public Task DeleteAsync(Transaction transaction, CancellationToken ct)
    {
        _db.Transactions.Remove(transaction);
        return Task.CompletedTask;
    }
}

