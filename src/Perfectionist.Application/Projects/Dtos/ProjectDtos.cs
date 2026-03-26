namespace Perfectionist.Application.Projects.Dtos;

public sealed record ProjectResponse(
    Guid Id,
    string Name,
    decimal Budget,
    decimal Spent,
    decimal Remaining
);

public sealed record CreateProjectRequest(string Name, decimal Budget);

public sealed record UpdateProjectRequest(string Name, decimal Budget);

public sealed record LinkTransactionToProjectRequest(Guid TransactionId);

