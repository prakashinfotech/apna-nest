using ApnaNest.Data.Entities;

namespace ApnaNest.Services.Interfaces;

public interface IAuthService
{
    Task<string> AuthenticateAsync(string email, string password);
    Task<string> AuthenticateByPhoneAsync(string phone, string password);
    Task<string> GenerateTokenForUserAsync(Guid userId);
    Task<User?> GetUserByIdAsync(Guid id);
    Task<Guid>  RegisterUserAsync(User user, string password);
    Task<bool>  EmailExistsAsync(string email);
    Task<bool>  PhoneExistsAsync(string phone);
}
