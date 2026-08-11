namespace ApnaNest.Data.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Name { get; set; }
    public short RoleId { get; set; } = 1;
    public string? ProfilePic { get; set; }
    public bool IsVerified { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
}
