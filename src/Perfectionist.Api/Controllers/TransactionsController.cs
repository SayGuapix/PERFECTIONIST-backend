using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Perfectionist.Application.Common;
using Perfectionist.Application.Interfaces;
using Perfectionist.Application.Transactions.Dtos;

namespace Perfectionist.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/transactions")]
public sealed class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactions;

    public TransactionsController(ITransactionService transactions)
    {
        _transactions = transactions;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<TransactionResponse>>> List([FromQuery] TransactionQuery query, CancellationToken ct)
    {
        var result = await _transactions.ListAsync(query, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TransactionResponse>> Get(Guid id, CancellationToken ct)
    {
        var item = await _transactions.GetAsync(id, ct);
        if (item is null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<TransactionResponse>> Create(CreateTransactionRequest request, CancellationToken ct)
    {
        var created = await _transactions.CreateAsync(request, ct);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TransactionResponse>> Update(Guid id, UpdateTransactionRequest request, CancellationToken ct)
    {
        var updated = await _transactions.UpdateAsync(id, request, ct);
        if (updated is null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var ok = await _transactions.DeleteAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }
}

