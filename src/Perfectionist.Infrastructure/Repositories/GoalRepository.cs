using Microsoft.EntityFrameworkCore;
using Perfectionist.Application.Interfaces;
using Perfectionist.Domain.Entities;
using Perfectionist.Infrastructure.Persistence;

namespace Perfectionist.Infrastructure.Repositories;

public sealed class GoalRepository : IGoalRepository
{
    private readonly AppDbContext _db;

    public GoalRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<Goal?> GetAsync(Guid userId, Guid id, CancellationToken ct) =>
        _db.Goals.FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id, ct);

    public async Task<IReadOnlyList<Goal>> ListAsync(Guid userId, CancellationToken ct) =>
        await _db.Goals.AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(ct);

    public async Task AddAsync(Goal goal, CancellationToken ct) =>
        await _db.Goals.AddAsync(goal, ct);

    public Task DeleteAsync(Goal goal, CancellationToken ct)
    {
        _db.Goals.Remove(goal);
        return Task.CompletedTask;
    }
}

