using ApnaNest.Data.Entities;
using ApnaNest.Data.Factories;
using Dapper;

namespace ApnaNest.Data.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public UserRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        const string sql = "SELECT * FROM users WHERE id = @id";
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<User>(sql, new { id });
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        const string sql = "SELECT * FROM users WHERE email = @email";
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<User>(sql, new { email });
    }

    public async Task<User?> GetByPhoneAsync(string phone)
    {
        const string sql = "SELECT * FROM users WHERE phone = @phone AND is_active = true";
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<User>(sql, new { phone });
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        const string sql = "SELECT EXISTS(SELECT 1 FROM users WHERE email = @email)";
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(sql, new { email });
    }

    public async Task<bool> PhoneExistsAsync(string phone)
    {
        const string sql = "SELECT EXISTS(SELECT 1 FROM users WHERE phone = @phone)";
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteScalarAsync<bool>(sql, new { phone });
    }

    public async Task<Guid> AddAsync(User user)
    {
        user.Id        = Guid.NewGuid();
        user.CreatedAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;

        const string sql = @"
            INSERT INTO users (id, phone, email, name, role_id, password_hash, is_active, created_at, updated_at)
            VALUES (@Id, @Phone, @Email, @Name, @RoleId, @PasswordHash, @IsActive, @CreatedAt, @UpdatedAt)
            RETURNING id;";

        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteScalarAsync<Guid>(sql, user);
    }

    public async Task<bool> UpdateAsync(User user)
    {
        user.UpdatedAt = DateTime.UtcNow;
        const string sql = @"
            UPDATE users SET name = @Name, email = @Email, phone = @Phone,
                profile_pic = @ProfilePic, updated_at = @UpdatedAt
            WHERE id = @Id";
        using var connection = _connectionFactory.CreateConnection();
        return await connection.ExecuteAsync(sql, user) > 0;
    }
}
