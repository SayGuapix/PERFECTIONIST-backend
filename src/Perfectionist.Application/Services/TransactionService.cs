using AutoMapper;
using Perfectionist.Application.Common;
using Perfectionist.Application.Interfaces;
using Perfectionist.Application.Transactions.Dtos;
using Perfectionist.Domain.Entities;

namespace Perfectionist.Application.Services;

public sealed class TransactionService : ITransactionService
{
    private readonly ICurrentUser _currentUser;
    private readonly ITransactionRepository _transactions;
    private readonly ICategoryRepository _categories;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public TransactionService(
        ICurrentUser currentUser,
        ITransactionRepository transactions,
        ICategoryRepository categories,
        IUnitOfWork uow,
        IMapper mapper)
    {
        _currentUser = currentUser;
        _transactions = transactions;
        _categories = categories;
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<TransactionResponse> CreateAsync(CreateTransactionRequest request, CancellationToken ct)
    {
        if (request.CategoryId.HasValue)
        {
            var category = await _categories.GetAsync(_currentUser.UserId, request.CategoryId.Value, ct);
            if (category is null) throw new AppException("La categoría no existe.", 400);
            if ((int)category.Type != (int)request.Type) throw new AppException("La categoría no corresponde al tipo de movimiento.", 400);
        }

        var entity = new Transaction
        {
            Id = Guid.NewGuid(),
            UserId = _currentUser.UserId,
            Type = request.Type,
            Value = request.Value,
            Name = request.Name.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            CategoryId = request.CategoryId,
            Date = request.Date,
            CreatedAtUtc = DateTimeOffset.UtcNow
        };

        await _transactions.AddAsync(entity, ct);
        await _uow.SaveChangesAsync(ct);

        var saved = await GetAsync(entity.Id, ct);
        return saved!;
    }

    public async Task<TransactionResponse?> GetAsync(Guid id, CancellationToken ct)
    {
        var entity = await _transactions.GetWithCategoryAsync(_currentUser.UserId, id, ct);
        return entity is null ? null : _mapper.Map<TransactionResponse>(entity);
    }

    public async Task<PagedResult<TransactionResponse>> ListAsync(TransactionQuery query, CancellationToken ct)
    {
        var page = query.Page < 1 ? 1 : query.Page;
        var size = query.PageSize is < 1 or > 200 ? 20 : query.PageSize;

        var (items, total) = await _transactions.SearchWithCategoryAsync(
            _currentUser.UserId,
            query.Type,
            query.CategoryId,
            query.From,
            query.To,
            page,
            size,
            ct);

        return new PagedResult<TransactionResponse>
        {
            Items = items.Select(_mapper.Map<TransactionResponse>).ToList(),
            Page = page,
            PageSize = size,
            TotalCount = total
        };
    }

    public async Task<TransactionResponse?> UpdateAsync(Guid id, UpdateTransactionRequest request, CancellationToken ct)
    {
        var entity = await _transactions.GetAsync(_currentUser.UserId, id, ct);
        if (entity is null) return null;

        if (request.CategoryId.HasValue)
        {
            var category = await _categories.GetAsync(_currentUser.UserId, request.CategoryId.Value, ct);
            if (category is null) throw new AppException("La categoría no existe.", 400);
            if ((int)category.Type != (int)request.Type) throw new AppException("La categoría no corresponde al tipo de movimiento.", 400);
        }

        entity.Type = request.Type;
        entity.Value = request.Value;
        entity.Name = request.Name.Trim();
        entity.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        entity.CategoryId = request.CategoryId;
        entity.Date = request.Date;
        entity.UpdatedAtUtc = DateTimeOffset.UtcNow;

        await _uow.SaveChangesAsync(ct);
        return await GetAsync(id, ct);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        var entity = await _transactions.GetAsync(_currentUser.UserId, id, ct);
        if (entity is null) return false;

        await _transactions.DeleteAsync(entity, ct);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

