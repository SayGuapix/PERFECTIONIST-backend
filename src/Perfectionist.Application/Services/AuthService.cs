using Perfectionist.Application.Common;
using Perfectionist.Application.Auth.Dtos;
using Perfectionist.Application.Interfaces;
using Perfectionist.Domain.Entities;

namespace Perfectionist.Application.Services;

// Servicio que maneja TODA la logica de registro y login
// Aqui esta la logica real de autenticacion, no en el controlador
public sealed class AuthService : IAuthService
{
    // Dependencias
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

    // Logica para registrar usuario nuevo
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        // Valida que el correo no exista ya
        if (await _users.EmailExistsAsync(email, ct))
            throw new AppException("El correo ya esta registrado.", 409);

        // Hashea contrasena con salt unico
        var (hash, salt) = _passwordHasher.Hash(request.Password);

        // Crea objeto usuario
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            PasswordHash = hash,
            PasswordSalt = salt,
            CreatedAtUtc = DateTimeOffset.UtcNow
        };

        // Guarda en base de datos
        await _users.AddAsync(user, ct);
        await _uow.SaveChangesAsync(ct);

        // Devuelve token listo para usar
        return new AuthResponse(_jwt.CreateToken(user));
    }

    // Logica para iniciar sesion
    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _users.GetByEmailAsync(email, ct);

        // Si no existe el usuario devuelve error
        if (user is null)
            throw new AppException("Credenciales invalidas.", 401);

        // Valida que la contrasena ingresada coincida con el hash guardado
        var ok = _passwordHasher.Verify(request.Password, user.PasswordHash, user.PasswordSalt);
        if (!ok)
            throw new AppException("Credenciales invalidas.", 401);

        // Todo bien, devuelve token
        return new AuthResponse(_jwt.CreateToken(user));
    }
}
