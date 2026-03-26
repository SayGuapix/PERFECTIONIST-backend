using AutoMapper;
using Perfectionist.Application.Categories.Dtos;
using Perfectionist.Application.FixedExpenses.Dtos;
using Perfectionist.Application.Goals.Dtos;
using Perfectionist.Application.Projects.Dtos;
using Perfectionist.Application.Transactions.Dtos;
using Perfectionist.Domain.Entities;

namespace Perfectionist.Application.Mapping;

public sealed class ApplicationMappingProfile : Profile
{
    public ApplicationMappingProfile()
    {
        CreateMap<Category, CategoryResponse>();
        CreateMap<FixedExpense, FixedExpenseResponse>();
        CreateMap<Goal, GoalResponse>()
            .ForMember(d => d.ProgressPercent, opt => opt.MapFrom(s => s.ProgressPercent));

        CreateMap<Transaction, TransactionResponse>()
            .ForMember(d => d.CategoryName, opt => opt.MapFrom(s => s.Category != null ? s.Category.Name : null));

        CreateMap<Project, ProjectResponse>()
            .ForMember(d => d.Spent, opt => opt.Ignore())
            .ForMember(d => d.Remaining, opt => opt.Ignore());
    }
}

