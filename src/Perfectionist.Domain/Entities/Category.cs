using Perfectionist.Domain.Common;
using Perfectionist.Domain.Enums;

namespace Perfectionist.Domain.Entities;

public sealed class Category : EntityBase
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string Name { get; set; } = string.Empty;
    public CategoryType Type { get; set; } = CategoryType.Expense;

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}

