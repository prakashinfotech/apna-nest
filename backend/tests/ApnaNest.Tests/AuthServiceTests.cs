using ApnaNest.Data.Entities;
using ApnaNest.Data.Repositories;
using ApnaNest.Services.Services;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Moq;
using System.Security.Cryptography;
using System.Text;
using Xunit;

namespace ApnaNest.Tests;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly AuthService _sut;

    public AuthServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _configurationMock = new Mock<IConfiguration>();
        
        _configurationMock.Setup(x => x["JwtSettings:Secret"]).Returns("unit_test_only_jwt_secret_with_32_plus_characters");

        _sut = new AuthService(_userRepositoryMock.Object, _configurationMock.Object);
    }

    [Fact]
    public async Task AuthenticateAsync_ShouldThrowUnauthorizedAccessException_WhenUserDoesNotExist()
    {
        // Arrange
        _userRepositoryMock.Setup(x => x.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync((User?)null);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _sut.AuthenticateAsync("test@test.com", "password"));
    }

    [Fact]
    public async Task AuthenticateAsync_ShouldThrowUnauthorizedAccessException_WhenPasswordIsIncorrect()
    {
        // Arrange
        var validBase64 = Convert.ToBase64String(Encoding.UTF8.GetBytes("invalid"));
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "test@test.com",
            PasswordHash = $"{validBase64}:{validBase64}"
        };
        _userRepositoryMock.Setup(x => x.GetByEmailAsync("test@test.com")).ReturnsAsync(user);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _sut.AuthenticateAsync("test@test.com", "password"));
    }

    [Fact]
    public async Task AuthenticateAsync_ShouldReturnJwtToken_WhenCredentialsAreValid()
    {
        // Arrange
        using var hmac = new HMACSHA512();
        var salt = Convert.ToBase64String(hmac.Key);
        var hash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes("password")));
        
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "test@test.com",
            PasswordHash = $"{salt}:{hash}",
            RoleId = 1
        };
        
        _userRepositoryMock.Setup(x => x.GetByEmailAsync("test@test.com")).ReturnsAsync(user);

        // Act
        var result = await _sut.AuthenticateAsync("test@test.com", "password");

        // Assert
        result.Should().NotBeNullOrEmpty();
    }
}
