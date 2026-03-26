using Perfectionist.Application.Common;
using Perfectionist.Application.Auth.Dtos;
using Perfectionist.Application.Interfaces;
using Perfectionist.Domain.Entities;

namespace Perfectionist.Application.Services;

public sealed class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwt;
    private readonly IUnitOfWork _uow;

    public AuthService(
        IUserRepository users,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwt,
        IUnitOfWork uow)
    {
        _users = users;
        _passwordHasher = passwordHasher;
        _jwt = jwt;
        _uow = uow;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        if (await _users.EmailExistsAsync(email, ct))
            throw new AppException("El correo ya está registrado.", 409);

        var (hash, salt) = _passwordHasher.Hash(request.Password);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            PasswordHash = hash,
            PasswordSalt = salt,
            CreatedAtUtc = DateTimeOffset.UtcNow
        };

        await _users.AddAsync(user, ct);
        await _uow.SaveChangesAsync(ct);

        return new AuthResponse(_jwt.CreateToken(user));
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _users.GetByEmailAsync(email, ct);

        if (user is null)
            throw new AppException("Credenciales inválidas.", 401);

        var ok = _passwordHasher.Verify(request.Password, user.PasswordHash, user.PasswordSalt);
        if (!ok)
            throw new AppException("Credenciales inválidas.", 401);

        return new AuthResponse(_jwt.CreateToken(user));
    }
}

