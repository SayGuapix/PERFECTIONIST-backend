using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Perfectionist.Application.FixedExpenses.Dtos;
using Perfectionist.Application.Interfaces;

namespace Perfectionist.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/fixed-expenses")]
public sealed class FixedExpensesController : ControllerBase
{
    private readonly IFixedExpenseService _fixedExpenses;

    public FixedExpensesController(IFixedExpenseService fixedExpenses)
    {
        _fixedExpenses = fixedExpenses;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<FixedExpenseResponse>>> List(CancellationToken ct)
    {
        var items = await _fixedExpenses.ListAsync(ct);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<FixedExpenseResponse>> Create(CreateFixedExpenseRequest request, CancellationToken ct)
    {
        var created = await _fixedExpenses.CreateAsync(request, ct);
        return Ok(created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<FixedExpenseResponse>> Update(Guid id, UpdateFixedExpenseRequest request, CancellationToken ct)
    {
        var updated = await _fixedExpenses.UpdateAsync(id, request, ct);
        if (updated is null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var ok = await _fixedExpenses.DeleteAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }
}

