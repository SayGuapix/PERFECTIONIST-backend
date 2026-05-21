using Perfectionist.Domain.Enums;

namespace Perfectionist.Application.Categories.Dtos;

public sealed record CategoryResponse(Guid Id, string Name, CategoryType Type);

public sealed record CreateCategoryRequest(string Name, CategoryType Type = CategoryType.Expense);

public sealed record UpdateCategoryRequest(string Name, CategoryType Type = CategoryType.Expense);

