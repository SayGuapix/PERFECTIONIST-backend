using Perfectionist.Domain.Common;

namespace Perfectionist.Domain.Entities;

public sealed class Goal : EntityBase
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string Name { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public DateTimeOffset? TargetDate { get; set; }

    public decimal ProgressPercent => TargetAmount <= 0 ? 0 : Math.Min(100, (CurrentAmount / TargetAmount) * 100);
}

