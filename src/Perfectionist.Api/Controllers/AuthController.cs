using Microsoft.AspNetCore.Mvc;
using Perfectionist.Application.Auth.Dtos;
using Perfectionist.Application.Interfaces;

namespace Perfectionist.Api.Controllers;

// Controlador de autenticacion
// Endpoints publicos, no necesitan token
[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    // Inyecta servicio de autenticacion
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }

    // Crea usuario nuevo y devuelve token
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request, CancellationToken ct)
    {
        var result = await _auth.RegisterAsync(request, ct);
        return Ok(result);
    }

    // Valida credenciales y devuelve token de acceso
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request, CancellationToken ct)
    {
        var result = await _auth.LoginAsync(request, ct);
        return Ok(result);
    }
}

