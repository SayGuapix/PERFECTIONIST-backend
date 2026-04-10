using Microsoft.EntityFrameworkCore;
using Perfectionist.Domain.Entities;

namespace Perfectionist.Infrastructure.Persistence;

// CONEXION PRINCIPAL A BASE DE DATOS
// Todas las tablas se declaran aqui
public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Tablas de la base de datos
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Goal> Goals => Set<Goal>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectTransaction> ProjectTransactions => Set<ProjectTransaction>();
    public DbSet<FixedExpense> FixedExpenses => Set<FixedExpense>();

    // Carga automaticamente todas las configuraciones de tablas
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}

