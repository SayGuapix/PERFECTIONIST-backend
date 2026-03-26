using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Perfectionist.Application.Goals.Dtos;
using Perfectionist.Application.Interfaces;

namespace Perfectionist.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/goals")]
public sealed class GoalsController : ControllerBase
{
    private readonly IGoalService _goals;

    public GoalsController(IGoalService goals)
    {
        _goals = goals;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<GoalResponse>>> List(CancellationToken ct)
    {
        var items = await _goals.ListAsync(ct);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<GoalResponse>> Create(CreateGoalRequest request, CancellationToken ct)
    {
        var created = await _goals.CreateAsync(request, ct);
        return Ok(created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<GoalResponse>> Update(Guid id, UpdateGoalRequest request, CancellationToken ct)
    {
        var updated = await _goals.UpdateAsync(id, request, ct);
        if (updated is null) return NotFound();
        return Ok(updated);
    }

    [HttpPost("{id:guid}/add")]
    public async Task<ActionResult<GoalResponse>> Add(Guid id, AddToGoalRequest request, CancellationToken ct)
    {
        var updated = await _goals.AddToGoalAsync(id, request, ct);
        if (updated is null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var ok = await _goals.DeleteAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }
}

