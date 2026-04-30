using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Perfectionist.Application.Interfaces;
using Perfectionist.Infrastructure.Persistence;
using Perfectionist.Infrastructure.Repositories;
using Perfectionist.Infrastructure.Security;

namespace Perfectionist.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(opt =>
        {
            if (config.GetValue<bool>("UseInMemoryDatabase"))
            {
                opt.UseInMemoryDatabase("PerfectionistDev");
                return;
            }

            opt.UseNpgsql(config.GetConnectionString("Default"));
        });

        services.Configure<JwtOptions>(config.GetSection("Jwt"));

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<IGoalRepository, GoalRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IFixedExpenseRepository, FixedExpenseRepository>();
        services.AddScoped<IDashboardRepository, DashboardRepository>();

        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        return services;
    }
}

