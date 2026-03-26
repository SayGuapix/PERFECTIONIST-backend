using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Perfectionist.Application.Interfaces;
using Perfectionist.Application.Projects.Dtos;

namespace Perfectionist.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/projects")]
public sealed class ProjectsController : ControllerBase
{
    private readonly IProjectService _projects;

    public ProjectsController(IProjectService projects)
    {
        _projects = projects;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProjectResponse>>> List(CancellationToken ct)
    {
        var items = await _projects.ListAsync(ct);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectResponse>> Create(CreateProjectRequest request, CancellationToken ct)
    {
        var created = await _projects.CreateAsync(request, ct);
        return Ok(created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProjectResponse>> Update(Guid id, UpdateProjectRequest request, CancellationToken ct)
    {
        var updated = await _projects.UpdateAsync(id, request, ct);
        if (updated is null) return NotFound();
        return Ok(updated);
    }

    [HttpPost("{id:guid}/link")]
    public async Task<IActionResult> LinkTransaction(Guid id, LinkTransactionToProjectRequest request, CancellationToken ct)
    {
        var ok = await _projects.LinkTransactionAsync(id, request, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var ok = await _projects.DeleteAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }
}

