using FluentValidation;
using Perfectionist.Application.Categories.Dtos;
using Perfectionist.Application.FixedExpenses.Dtos;
using Perfectionist.Application.Goals.Dtos;
using Perfectionist.Application.Projects.Dtos;

namespace Perfectionist.Application.Validation;

public sealed class CreateCategoryRequestValidator : AbstractValidator<CreateCategoryRequest>
{
    public CreateCategoryRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(60);
    }
}

public sealed class UpdateCategoryRequestValidator : AbstractValidator<UpdateCategoryRequest>
{
    public UpdateCategoryRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(60);
    }
}

public sealed class CreateGoalRequestValidator : AbstractValidator<CreateGoalRequest>
{
    public CreateGoalRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.TargetAmount).GreaterThan(0);
    }
}

public sealed class UpdateGoalRequestValidator : AbstractValidator<UpdateGoalRequest>
{
    public UpdateGoalRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.TargetAmount).GreaterThan(0);
        RuleFor(x => x.CurrentAmount).GreaterThanOrEqualTo(0);
    }
}

public sealed class AddToGoalRequestValidator : AbstractValidator<AddToGoalRequest>
{
    public AddToGoalRequestValidator()
    {
        RuleFor(x => x.Amount).GreaterThan(0);
    }
}

public sealed class CreateProjectRequestValidator : AbstractValidator<CreateProjectRequest>
{
    public CreateProjectRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Budget).GreaterThan(0);
    }
}

public sealed class UpdateProjectRequestValidator : AbstractValidator<UpdateProjectRequest>
{
    public UpdateProjectRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Budget).GreaterThan(0);
    }
}

public sealed class CreateFixedExpenseRequestValidator : AbstractValidator<CreateFixedExpenseRequest>
{
    public CreateFixedExpenseRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Value).GreaterThan(0);
    }
}

public sealed class UpdateFixedExpenseRequestValidator : AbstractValidator<UpdateFixedExpenseRequest>
{
    public UpdateFixedExpenseRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Value).GreaterThan(0);
    }
}

