using AutoMapper;
using Perfectionist.Application.Goals.Dtos;
using Perfectionist.Application.Interfaces;
using Perfectionist.Domain.Entities;

namespace Perfectionist.Application.Services;

public sealed class GoalService : IGoalService
{
    private readonly ICurrentUser _currentUser;
    private readonly IGoalRepository _goals;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public GoalService(ICurrentUser currentUser, IGoalRepository goals, IUnitOfWork uow, IMapper mapper)
    {
        _currentUser = currentUser;
        _goals = goals;
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<GoalResponse> CreateAsync(CreateGoalRequest request, CancellationToken ct)
    {
        var goal = new Goal
        {
            Id = Guid.NewGuid(),
            UserId = _currentUser.UserId,
            Name = request.Name.Trim(),
            TargetAmount = request.TargetAmount,
            CurrentAmount = 0,
            TargetDate = request.TargetDate,
            CreatedAtUtc = DateTimeOffset.UtcNow
        };

        await _goals.AddAsync(goal, ct);
        await _uow.SaveChangesAsync(ct);

        return _mapper.Map<GoalResponse>(goal);
    }

    public async Task<IReadOnlyList<GoalResponse>> ListAsync(CancellationToken ct)
    {
        var items = await _goals.ListAsync(_currentUser.UserId, ct);
        return items.Select(_mapper.Map<GoalResponse>).ToList();
    }

    public async Task<GoalResponse?> UpdateAsync(Guid id, UpdateGoalRequest request, CancellationToken ct)
    {
        var goal = await _goals.GetAsync(_currentUser.UserId, id, ct);
        if (goal is null) return null;

        goal.Name = request.Name.Trim();
        goal.TargetAmount = request.TargetAmount;
        goal.CurrentAmount = request.CurrentAmount;
        goal.TargetDate = request.TargetDate;
        goal.UpdatedAtUtc = DateTimeOffset.UtcNow;

        await _uow.SaveChangesAsync(ct);
        return _mapper.Map<GoalResponse>(goal);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        var goal = await _goals.GetAsync(_currentUser.UserId, id, ct);
        if (goal is null) return false;

        await _goals.DeleteAsync(goal, ct);
        await _uow.SaveChangesAsync(ct);
        return true;
    }

    public async Task<GoalResponse?> AddToGoalAsync(Guid id, AddToGoalRequest request, CancellationToken ct)
    {
        var goal = await _goals.GetAsync(_currentUser.UserId, id, ct);
        if (goal is null) return null;

        goal.CurrentAmount += request.Amount;
        goal.UpdatedAtUtc = DateTimeOffset.UtcNow;

        await _uow.SaveChangesAsync(ct);
        return _mapper.Map<GoalResponse>(goal);
    }
}

