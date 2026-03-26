using AutoMapper;
using Perfectionist.Application.FixedExpenses.Dtos;
using Perfectionist.Application.Interfaces;
using Perfectionist.Domain.Entities;

namespace Perfectionist.Application.Services;

public sealed class FixedExpenseService : IFixedExpenseService
{
    private readonly ICurrentUser _currentUser;
    private readonly IFixedExpenseRepository _fixedExpenses;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public FixedExpenseService(
        ICurrentUser currentUser,
        IFixedExpenseRepository fixedExpenses,
        IUnitOfWork uow,
        IMapper mapper)
    {
        _currentUser = currentUser;
        _fixedExpenses = fixedExpenses;
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<FixedExpenseResponse> CreateAsync(CreateFixedExpenseRequest request, CancellationToken ct)
    {
        var item = new FixedExpense
        {
            Id = Guid.NewGuid(),
            UserId = _currentUser.UserId,
            Name = request.Name.Trim(),
            Value = request.Value,
            Frequency = request.Frequency,
            NextDate = request.NextDate,
            CreatedAtUtc = DateTimeOffset.UtcNow
        };

        await _fixedExpenses.AddAsync(item, ct);
        await _uow.SaveChangesAsync(ct);

        return _mapper.Map<FixedExpenseResponse>(item);
    }

    public async Task<IReadOnlyList<FixedExpenseResponse>> ListAsync(CancellationToken ct)
    {
        var items = await _fixedExpenses.ListAsync(_currentUser.UserId, ct);
        return items.Select(_mapper.Map<FixedExpenseResponse>).ToList();
    }

    public async Task<FixedExpenseResponse?> UpdateAsync(Guid id, UpdateFixedExpenseRequest request, CancellationToken ct)
    {
        var item = await _fixedExpenses.GetAsync(_currentUser.UserId, id, ct);
        if (item is null) return null;

        item.Name = request.Name.Trim();
        item.Value = request.Value;
        item.Frequency = request.Frequency;
        item.NextDate = request.NextDate;
        item.UpdatedAtUtc = DateTimeOffset.UtcNow;

        await _uow.SaveChangesAsync(ct);
        return _mapper.Map<FixedExpenseResponse>(item);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        var item = await _fixedExpenses.GetAsync(_currentUser.UserId, id, ct);
        if (item is null) return false;

        await _fixedExpenses.DeleteAsync(item, ct);
        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

