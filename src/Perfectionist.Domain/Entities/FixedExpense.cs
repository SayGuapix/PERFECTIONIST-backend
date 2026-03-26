using Perfectionist.Domain.Common;
using Perfectionist.Domain.Enums;

namespace Perfectionist.Domain.Entities;

public sealed class FixedExpense : EntityBase
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string Name { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public Frequency Frequency { get; set; }
    public DateTimeOffset NextDate { get; set; }
}

