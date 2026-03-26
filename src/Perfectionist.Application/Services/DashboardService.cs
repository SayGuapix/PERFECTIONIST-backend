using AutoMapper;
using Perfectionist.Application.Dashboard.Dtos;
using Perfectionist.Application.Interfaces;
using Perfectionist.Application.Transactions.Dtos;

namespace Perfectionist.Application.Services;

public sealed class DashboardService : IDashboardService
{
    private readonly ICurrentUser _currentUser;
    private readonly IDashboardRepository _dashboard;
    private readonly IMapper _mapper;

    public DashboardService(ICurrentUser currentUser, IDashboardRepository dashboard, IMapper mapper)
    {
        _currentUser = currentUser;
        _dashboard = dashboard;
        _mapper = mapper;
    }

    public async Task<DashboardResponse> GetAsync(CancellationToken ct)
    {
        var (totalIncome, totalExpense) = await _dashboard.GetTotalsAsync(_currentUser.UserId, ct);
        var balance = totalIncome - totalExpense;

        var latest = await _dashboard.GetLatestTransactionsWithCategoryAsync(_currentUser.UserId, 10, ct);
        var latestDtos = latest.Select(_mapper.Map<TransactionResponse>).ToList();

        var goals = await _dashboard.GetGoalsAsync(_currentUser.UserId, ct);
        var goalDtos = goals
            .Select(g => new DashboardGoalProgress(g.Id, g.Name, g.TargetAmount, g.CurrentAmount, g.ProgressPercent))
            .ToList();

        var byCategory = await _dashboard.GetExpenseByCategoryAsync(_currentUser.UserId, ct);
        var byCategoryDtos = byCategory
            .Select(x => new DashboardCategorySummary(x.CategoryId, x.CategoryName, x.TotalExpense))
            .ToList();

        return new DashboardResponse(
            balance,
            totalIncome,
            totalExpense,
            latestDtos,
            goalDtos,
            byCategoryDtos);
    }
}

