using Perfectionist.Domain.Common;
using Perfectionist.Domain.Enums;

namespace Perfectionist.Domain.Entities;

public sealed class Transaction : EntityBase
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public TransactionType Type { get; set; }
    public decimal Value { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }

    public DateTimeOffset Date { get; set; }

    public ICollection<ProjectTransaction> ProjectTransactions { get; set; } = new List<ProjectTransaction>();
}

