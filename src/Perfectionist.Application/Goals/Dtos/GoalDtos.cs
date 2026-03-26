namespace Perfectionist.Application.Goals.Dtos;

public sealed record GoalResponse(
    Guid Id,
    string Name,
    decimal TargetAmount,
    decimal CurrentAmount,
    DateTimeOffset? TargetDate,
    decimal ProgressPercent
);

public sealed record CreateGoalRequest(
    string Name,
    decimal TargetAmount,
    DateTimeOffset? TargetDate
);

public sealed record UpdateGoalRequest(
    string Name,
    decimal TargetAmount,
    decimal CurrentAmount,
    DateTimeOffset? TargetDate
);

public sealed record AddToGoalRequest(decimal Amount);

