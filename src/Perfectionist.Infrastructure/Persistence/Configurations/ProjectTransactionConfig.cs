using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Perfectionist.Domain.Entities;

namespace Perfectionist.Infrastructure.Persistence.Configurations;

public sealed class ProjectTransactionConfig : IEntityTypeConfiguration<ProjectTransaction>
{
    public void Configure(EntityTypeBuilder<ProjectTransaction> builder)
    {
        builder.HasKey(x => new { x.ProjectId, x.TransactionId });

        builder.HasOne(x => x.Project)
            .WithMany(x => x.ProjectTransactions)
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Transaction)
            .WithMany(x => x.ProjectTransactions)
            .HasForeignKey(x => x.TransactionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

