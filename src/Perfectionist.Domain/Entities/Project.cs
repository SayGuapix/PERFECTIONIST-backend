using Perfectionist.Domain.Common;

namespace Perfectionist.Domain.Entities;

public sealed class Project : EntityBase
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string Name { get; set; } = string.Empty;
    public decimal Budget { get; set; }

    public ICollection<ProjectTransaction> ProjectTransactions { get; set; } = new List<ProjectTransaction>();
}

