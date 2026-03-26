using Perfectionist.Domain.Enums;

namespace Perfectionist.Application.Transactions.Dtos;

public sealed record TransactionResponse(
    Guid Id,
    TransactionType Type,
    decimal Value,
    string Name,
    string? Description,
    Guid? CategoryId,
    string? CategoryName,
    DateTimeOffset Date
);

public sealed record CreateTransactionRequest(
    TransactionType Type,
    decimal Value,
    string Name,
    string? Description,
    Guid? CategoryId,
    DateTimeOffset Date
);

public sealed record UpdateTransactionRequest(
    TransactionType Type,
    decimal Value,
    string Name,
    string? Description,
    Guid? CategoryId,
    DateTimeOffset Date
);

public sealed class TransactionQuery : Perfectionist.Application.Common.PagedRequest
{
    public TransactionType? Type { get; set; }
    public Guid? CategoryId { get; set; }
    public DateTimeOffset? From { get; set; }
    public DateTimeOffset? To { get; set; }
}

