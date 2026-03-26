using Perfectionist.Domain.Enums;

namespace Perfectionist.Application.FixedExpenses.Dtos;

public sealed record FixedExpenseResponse(
    Guid Id,
    string Name,
    decimal Value,
    Frequency Frequency,
    DateTimeOffset NextDate
);

public sealed record CreateFixedExpenseRequest(
    string Name,
    decimal Value,
    Frequency Frequency,
    DateTimeOffset NextDate
);

public sealed record UpdateFixedExpenseRequest(
    string Name,
    decimal Value,
    Frequency Frequency,
    DateTimeOffset NextDate
);

