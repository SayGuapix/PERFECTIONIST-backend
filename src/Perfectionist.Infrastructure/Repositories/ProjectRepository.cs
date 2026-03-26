using Microsoft.EntityFrameworkCore;
using Perfectionist.Application.Interfaces;
using Perfectionist.Domain.Entities;
using Perfectionist.Infrastructure.Persistence;

namespace Perfectionist.Infrastructure.Repositories;

public sealed class ProjectRepository : IProjectRepository
{
    private readonly AppDbContext _db;

    public ProjectRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<Project?> GetAsync(Guid userId, Guid id, CancellationToken ct) =>
        _db.Projects.FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id, ct);

    public Task<Project?> GetWithTransactionsAsync(Guid userId, Guid id, CancellationToken ct) =>
        _db.Projects
            .Include(p => p.ProjectTransactions)
            .ThenInclude(pt => pt.Transaction)
            .FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id, ct);

    public async Task<IReadOnlyList<Project>> ListWithTransactionsAsync(Guid userId, CancellationToken ct) =>
        await _db.Projects.AsNoTracking()
            .Where(x => x.UserId == userId)
            .Include(p => p.ProjectTransactions)
            .ThenInclude(pt => pt.Transaction)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<Project>> ListAsync(Guid userId, CancellationToken ct) =>
        await _db.Projects.AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(ct);

    public async Task AddAsync(Project project, CancellationToken ct) =>
        await _db.Projects.AddAsync(project, ct);

    public Task DeleteAsync(Project project, CancellationToken ct)
    {
        _db.Projects.Remove(project);
        return Task.CompletedTask;
    }

    public async Task<bool> LinkTransactionAsync(Guid userId, Guid projectId, Guid transactionId, CancellationToken ct)
    {
        var projectExists = await _db.Projects.AsNoTracking().AnyAsync(x => x.UserId == userId && x.Id == projectId, ct);
        if (!projectExists) return false;

        var transactionExists = await _db.Transactions.AsNoTracking().AnyAsync(x => x.UserId == userId && x.Id == transactionId, ct);
        if (!transactionExists) return false;

        var already = await _db.ProjectTransactions.AsNoTracking()
            .AnyAsync(x => x.ProjectId == projectId && x.TransactionId == transactionId, ct);

        if (already) return true;

        await _db.ProjectTransactions.AddAsync(new ProjectTransaction { ProjectId = projectId, TransactionId = transactionId }, ct);
        return true;
    }
}

