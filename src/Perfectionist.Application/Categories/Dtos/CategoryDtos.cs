namespace Perfectionist.Application.Categories.Dtos;

public sealed record CategoryResponse(Guid Id, string Name);

public sealed record CreateCategoryRequest(string Name);

public sealed record UpdateCategoryRequest(string Name);

