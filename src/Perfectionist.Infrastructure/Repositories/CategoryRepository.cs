using Microsoft.EntityFrameworkCore;
using Perfectionist.Application.Interfaces;
using Perfectionist.Domain.Entities;
using Perfectionist.Infrastructure.Persistence;

namespace Perfectionist.Infrastructure.Repositories;

public sealed class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _db;

    public CategoryRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<Category?> GetAsync(Guid userId, Guid id, CancellationToken ct) =>
        _db.Categories.FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id, ct);

    public async Task<IReadOnlyList<Category>> ListAsync(Guid userId, CancellationToken ct) =>
        await _db.Categories.AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Name)
            .ToListAsync(ct);

    public async Task AddAsync(Category category, CancellationToken ct) =>
        await _db.Categories.AddAsync(category, ct);

    public Task DeleteAsync(Category category, CancellationToken ct)
    {
        _db.Categories.Remove(category);
        return Task.CompletedTask;
    }
}

