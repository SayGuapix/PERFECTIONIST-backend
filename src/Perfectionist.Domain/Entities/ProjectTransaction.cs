namespace Perfectionist.Domain.Entities;

public sealed class ProjectTransaction
{
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }

    public Guid TransactionId { get; set; }
    public Transaction? Transaction { get; set; }
}

