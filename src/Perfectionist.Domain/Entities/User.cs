using Perfectionist.Domain.Common;

namespace Perfectionist.Domain.Entities;

public sealed class User : EntityBase
{
    public string Email { get; set; } = string.Empty;

    // Hash y sal en Base64
    public string PasswordHash { get; set; } = string.Empty;
    public string PasswordSalt { get; set; } = string.Empty;

    public ICollection<Category> Categories { get; set; } = new List<Category>();
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    public ICollection<Goal> Goals { get; set; } = new List<Goal>();
    public ICollection<Project> Projects { get; set; } = new List<Project>();
    public ICollection<FixedExpense> FixedExpenses { get; set; } = new List<FixedExpense>();
}

