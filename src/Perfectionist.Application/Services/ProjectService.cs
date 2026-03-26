using AutoMapper;
using Perfectionist.Application.Interfaces;
using Perfectionist.Application.Projects.Dtos;
using Perfectionist.Domain.Entities;
using Perfectionist.Domain.Enums;

namespace Perfectionist.Application.Services;

public sealed class ProjectService : IProjectService
{
    private readonly ICurrentUser _currentUser;
    private readonly IProjectRepository _projects;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public ProjectService(ICurrentUser currentUser, IProjectRepository projects, IUnitOfWork uow, IMapper mapper)
    {
        _currentUser = currentUser;
        _projects = projects;
        _uow = uow;
        _mapper = mapper;
    }

    public async Task<ProjectResponse> CreateAsync(CreateProjectRequest request, CancellationToken ct)
    {
        var project = new Project
        {
            Id = Guid.NewGuid(),
            UserId = _currentUser.UserId,
            Name = request.Name.Trim(),
            Budget = request.Budget,
            CreatedAtUtc = DateTimeOffset.UtcNow
        };

        await _projects.AddAsync(project, ct);
        await _uow.SaveChangesAsync(ct);

        return new ProjectResponse(project.Id, project.Name, project.Budget, 0, project.Budget);
    }

    public async Task<IReadOnlyList<ProjectResponse>> ListAsync(CancellationToken ct)
    {
        var projects = await _projects.ListWithTransactionsAsync(_currentUser.UserId, ct);

        return projects.Select(p =>
        {
            var spent = p.ProjectTransactions
                .Where(x => x.Transaction != null && x.Transaction.Type == TransactionType.Expense)
                .Sum(x => x.Transaction!.Value);

            var remaining = p.Budget - spent;
            return new ProjectResponse(p.Id, p.Name, p.Budget, spent, remaining);
        }).ToList();
    }

    public async Task<ProjectResponse?> UpdateAsync(Guid id, UpdateProjectRequest request, CancellationToken ct)
    {
        var project = await _projects.GetWithTransactionsAsync(_currentUser.UserId, id, ct);
        if (project is null) return null;

        project.Name = request.Name.Trim();
        project.Budget = request.Budget;
        project.UpdatedAtUtc = DateTimeOffset.UtcNow;

        await _uow.SaveChangesAsync(ct);

        var spent = project.ProjectTransactions
            .Where(x => x.Transaction != null && x.Transaction.Type == TransactionType.Expense)
            .Sum(x => x.Transaction!.Value);

        return new ProjectResponse(project.Id, project.Name, project.Budget, spent, project.Budget - spent);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        var project = await _projects.GetAsync(_currentUser.UserId, id, ct);
        if (project is null) return false;

        await _projects.DeleteAsync(project, ct);
        await _uow.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> LinkTransactionAsync(Guid id, LinkTransactionToProjectRequest request, CancellationToken ct)
    {
        var ok = await _projects.LinkTransactionAsync(_currentUser.UserId, id, request.TransactionId, ct);
        if (!ok) return false;

        await _uow.SaveChangesAsync(ct);
        return true;
    }
}

