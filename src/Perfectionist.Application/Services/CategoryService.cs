using AutoMapper;
using Perfectionist.Application.Categories.Dtos;
using Perfectionist.Application.Common;
using Perfectionist.Application.Interfaces;
using Perfectionist.Domain.Entities;

namespace Perfectionist.Application.Services;

public sealed class CategoryService : ICategoryService
{
    private readonly ICurrentUser _currentUser;
    private readonly ICategoryRepository _categories;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public CategoryService(ICurrentUser currentUser, ICategoryRepository categories, IUnitOfWork uow, IMapper mapper)
    {
        _currentUser = currentUser;
        _categories = categories;
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<CategoryResponse> CreateAsync(CreateCategoryRequest request, CancellationToken ct)
    {
        var category = new Category
        {
            Id = Guid.NewGuid(),
            UserId = _currentUser.UserId,
            Name = request.Name.Trim(),
            CreatedAtUtc = DateTimeOffset.UtcNow
        };

        await _categories.AddAsync(category, ct);
        await _uow.SaveChangesAsync(ct);

        return _mapper.Map<CategoryResponse>(category);
    }

    public async Task<IReadOnlyList<CategoryResponse>> ListAsync(CancellationToken ct)
    {
        var items = await _categories.ListAsync(_currentUser.UserId, ct);
        return items.Select(_mapper.Map<CategoryResponse>).ToList();
    }

    public async Task<CategoryResponse?> UpdateAsync(Guid id, UpdateCategoryRequest request, CancellationToken ct)
    {
        var category = await _categories.GetAsync(_currentUser.UserId, id, ct);
        if (category is null) return null;

        category.Name = request.Name.Trim();
        category.UpdatedAtUtc = DateTimeOffset.UtcNow;

        await _uow.SaveChangesAsync(ct);
        return _mapper.Map<CategoryResponse>(category);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        var category = await _categories.GetAsync(_currentUser.UserId, id, ct);
        if (category is null) return false;

        await _categories.DeleteAsync(category, ct);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

