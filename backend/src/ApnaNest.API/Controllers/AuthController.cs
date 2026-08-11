using System.Security.Claims;
using ApnaNest.Data.Entities;
using ApnaNest.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApnaNest.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService) => _authService = authService;

    // POST /api/auth/login  — accepts email OR phone in the "email" field
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { error = "Email or phone number is required." });
        if (string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { error = "Password is required." });

        try
        {
            string token;
            var identifier = request.Email.Trim();

            // Auto-detect: if it looks like a phone number, authenticate by phone
            var isPhone = identifier.StartsWith("+") ||
                          identifier.All(c => char.IsDigit(c) || c == '-' || c == ' ');

            if (isPhone)
            {
                var phone = identifier.StartsWith("+") ? identifier : "+91" + identifier.TrimStart('0');
                token = await _authService.AuthenticateByPhoneAsync(phone, request.Password);
            }
            else
            {
                token = await _authService.AuthenticateAsync(identifier.ToLowerInvariant(), request.Password);
            }

            Response.Cookies.Append("refreshToken", token, new CookieOptions
            {
                HttpOnly = true, SameSite = SameSiteMode.Lax,
                Expires  = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new { token, message = "Login successful" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
    }

    // POST /api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { error = "Email address is required." });
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 8)
            return BadRequest(new { error = "Password must be at least 8 characters." });
        if (string.IsNullOrWhiteSpace(request.Phone))
            return BadRequest(new { error = "Phone number is required." });

        // Normalise phone: ensure +91 prefix
        var phone = request.Phone.Trim();
        if (!phone.StartsWith("+")) phone = "+91" + phone.TrimStart('0');

        try
        {
            // Pre-check duplicates BEFORE hitting DB constraint
            if (await _authService.EmailExistsAsync(request.Email))
                return Conflict(new { error = "An account with this email already exists. Please login instead." });

            if (await _authService.PhoneExistsAsync(phone))
                return Conflict(new { error = "An account with this phone number already exists. Please login instead." });

            var user = new User
            {
                Email  = request.Email.Trim().ToLowerInvariant(),
                Name   = $"{request.FirstName} {request.LastName}".Trim(),
                Phone  = phone,
                RoleId = request.IsOwner ? (short)2 : (short)1
            };
            var userId = await _authService.RegisterUserAsync(user, request.Password);
            var token  = await _authService.AuthenticateAsync(user.Email, request.Password);

            Response.Cookies.Append("refreshToken", token, new CookieOptions
            {
                HttpOnly = true, SameSite = SameSiteMode.Lax,
                Expires  = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new { userId, token, message = "Account created successfully!" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex) when (ex.Message.Contains("duplicate") || ex.Message.Contains("unique"))
        {
            // Fallback for any DB-level unique constraint
            if (ex.Message.Contains("phone"))
                return Conflict(new { error = "This phone number is already registered." });
            return Conflict(new { error = "This email is already registered." });
        }
    }

    // POST /api/auth/refresh  — reissues a token for the currently logged-in user
    [Authorize]
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var user = await _authService.GetUserByIdAsync(userId);
        if (user == null || !user.IsActive) return Unauthorized();

        var token = await _authService.GenerateTokenForUserAsync(userId);
        return Ok(new { token });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (!Guid.TryParse(userIdClaim, out var userId)) return Unauthorized();
        var user = await _authService.GetUserByIdAsync(userId);
        if (user == null) return NotFound();
        return Ok(new { user.Id, user.Name, user.Email, user.Phone, user.RoleId, user.IsVerified });
    }

    // POST /api/auth/logout
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("refreshToken");
        return Ok(new { message = "Logged out" });
    }
}

public class LoginRequest
{
    /// <summary>Email address OR phone number (e.g. +919876543210 or 9876543210)</summary>
    public string Email    { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Email     { get; set; } = string.Empty;
    public string Password  { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName  { get; set; } = string.Empty;
    public string Phone     { get; set; } = string.Empty;
    public bool   IsOwner   { get; set; } = false;
}
