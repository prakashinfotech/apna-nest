using ApnaNest.Data.Entities;
using ApnaNest.Data.Repositories;
using ApnaNest.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ApnaNest.Services.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<string> AuthenticateAsync(string email, string password)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null)
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (!VerifyPasswordHash(password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        return GenerateJwtToken(user);
    }

    public Task<User?> GetUserByIdAsync(Guid id) => _userRepository.GetByIdAsync(id);

    public Task<bool> EmailExistsAsync(string email) => _userRepository.EmailExistsAsync(email);
    public Task<bool> PhoneExistsAsync(string phone) => _userRepository.PhoneExistsAsync(phone);

    public async Task<string> AuthenticateByPhoneAsync(string phone, string password)
    {
        var user = await _userRepository.GetByPhoneAsync(phone);
        if (user == null) throw new UnauthorizedAccessException("No account found with this phone number.");
        if (!VerifyPasswordHash(password, user.PasswordHash))
            throw new UnauthorizedAccessException("Incorrect password.");
        user.LastLoginAt = DateTime.UtcNow;
        return GenerateJwtToken(user);
    }

    public async Task<string> GenerateTokenForUserAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new UnauthorizedAccessException("User not found.");
        return GenerateJwtToken(user);
    }

    public async Task<Guid> RegisterUserAsync(User user, string password)
    {
        var existingUser = await _userRepository.GetByEmailAsync(user.Email ?? "");
        if (existingUser != null)
            throw new ArgumentException("Email is already registered.");

        user.PasswordHash = CreatePasswordHash(password);
        return await _userRepository.AddAsync(user);
    }

    private string CreatePasswordHash(string password)
    {
        using var hmac = new HMACSHA512();
        var salt = Convert.ToBase64String(hmac.Key);
        var hash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
        return $"{salt}:{hash}";
    }

    private bool VerifyPasswordHash(string password, string storedHash)
    {
        var parts = storedHash.Split(':');
        if (parts.Length != 2) return false;

        var salt = Convert.FromBase64String(parts[0]);
        var hash = parts[1];

        using var hmac = new HMACSHA512(salt);
        var computedHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
        return hash == computedHash;
    }

    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var secret = _configuration["JwtSettings:Secret"];
        if (string.IsNullOrWhiteSpace(secret) ||
            secret.StartsWith("CHANGE_ME", StringComparison.OrdinalIgnoreCase) ||
            Encoding.UTF8.GetByteCount(secret) < 32)
        {
            throw new InvalidOperationException(
                "JwtSettings:Secret must be configured with at least 32 bytes of secret material.");
        }
        var key = Encoding.ASCII.GetBytes(secret);

        var roleName = user.RoleId switch
        {
            4 => "Admin",
            2 => "Owner",
            3 => "Broker",
            _ => "Buyer"
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Role, roleName)
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
