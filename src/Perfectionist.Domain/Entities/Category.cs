using Perfectionist.Domain.Common;

namespace Perfectionist.Domain.Entities;

public sealed class Category : EntityBase
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string Name { get; set; } = string.Empty;

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}

