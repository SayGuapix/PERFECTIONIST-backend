using Perfectionist.Domain.Entities;

namespace Perfectionist.Application.Interfaces;

public interface IPasswordHasher
{
    (string HashBase64, string SaltBase64) Hash(string password);
    bool Verify(string password, string hashBase64, string saltBase64);
}

public interface IJwtTokenGenerator
{
    string CreateToken(User user);
}

