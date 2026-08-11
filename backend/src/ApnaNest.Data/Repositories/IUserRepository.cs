using ApnaNest.Data.Entities;

namespace ApnaNest.Data.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByPhoneAsync(string phone);
    Task<bool>  EmailExistsAsync(string email);
    Task<bool>  PhoneExistsAsync(string phone);
    Task<Guid>  AddAsync(User user);
    Task<bool>  UpdateAsync(User user);
}
