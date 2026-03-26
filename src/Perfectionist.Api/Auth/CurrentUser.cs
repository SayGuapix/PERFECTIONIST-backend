using System.Security.Claims;
using Perfectionist.Application.Interfaces;

namespace Perfectionist.Api.Auth;

public sealed class CurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _http;

    public CurrentUser(IHttpContextAccessor http)
    {
        _http = http;
    }

    public Guid UserId
    {
        get
        {
            var id = _http.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(id)) throw new InvalidOperationException("Usuario no autenticado.");
            return Guid.Parse(id);
        }
    }
}

