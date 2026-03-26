using Perfectionist.Application.Auth.Dtos;
using Perfectionist.Application.Categories.Dtos;
using Perfectionist.Application.Common;
using Perfectionist.Application.Dashboard.Dtos;
using Perfectionist.Application.FixedExpenses.Dtos;
using Perfectionist.Application.Goals.Dtos;
using Perfectionist.Application.Projects.Dtos;
using Perfectionist.Application.Transactions.Dtos;

namespace Perfectionist.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct);
}

public interface ITransactionService
{
    Task<TransactionResponse> CreateAsync(CreateTransactionRequest request, CancellationToken ct);
    Task<TransactionResponse?> GetAsync(Guid id, CancellationToken ct);
    Task<PagedResult<TransactionResponse>> ListAsync(TransactionQuery query, CancellationToken ct);
    Task<TransactionResponse?> UpdateAsync(Guid id, UpdateTransactionRequest request, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}

public interface ICategoryService
{
    Task<CategoryResponse> CreateAsync(CreateCategoryRequest request, CancellationToken ct);
    Task<IReadOnlyList<CategoryResponse>> ListAsync(CancellationToken ct);
    Task<CategoryResponse?> UpdateAsync(Guid id, UpdateCategoryRequest request, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}

public interface IGoalService
{
    Task<GoalResponse> CreateAsync(CreateGoalRequest request, CancellationToken ct);
    Task<IReadOnlyList<GoalResponse>> ListAsync(CancellationToken ct);
    Task<GoalResponse?> UpdateAsync(Guid id, UpdateGoalRequest request, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
    Task<GoalResponse?> AddToGoalAsync(Guid id, AddToGoalRequest request, CancellationToken ct);
}

public interface IProjectService
{
    Task<ProjectResponse> CreateAsync(CreateProjectRequest request, CancellationToken ct);
    Task<IReadOnlyList<ProjectResponse>> ListAsync(CancellationToken ct);
    Task<ProjectResponse?> UpdateAsync(Guid id, UpdateProjectRequest request, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
    Task<bool> LinkTransactionAsync(Guid id, LinkTransactionToProjectRequest request, CancellationToken ct);
}

public interface IFixedExpenseService
{
    Task<FixedExpenseResponse> CreateAsync(CreateFixedExpenseRequest request, CancellationToken ct);
    Task<IReadOnlyList<FixedExpenseResponse>> ListAsync(CancellationToken ct);
    Task<FixedExpenseResponse?> UpdateAsync(Guid id, UpdateFixedExpenseRequest request, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}

public interface IDashboardService
{
    Task<DashboardResponse> GetAsync(CancellationToken ct);
}

