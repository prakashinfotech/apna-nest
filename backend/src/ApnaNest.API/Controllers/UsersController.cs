using System.Security.Claims;
using ApnaNest.Data.Repositories;
using ApnaNest.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApnaNest.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IPropertyService _propertySvc;
    private readonly IUserRepository  _userRepo;
    public UsersController(IPropertyService propertySvc, IUserRepository userRepo)
    {
        _propertySvc = propertySvc;
        _userRepo    = userRepo;
    }

    private Guid? CurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.TryParse(claim, out var id) ? id : null;
    }

    // GET /api/users/me/saved — saved properties list
    [HttpGet("me/saved")]
    public async Task<IActionResult> GetSaved()
    {
        var userId = CurrentUserId();
        if (userId == null) return Unauthorized();
        return Ok(await _propertySvc.GetSavedPropertiesAsync(userId.Value));
    }

    // GET /api/users/me/listings — current user's own listings
    [HttpGet("me/listings")]
    public async Task<IActionResult> GetMyListings()
    {
        var userId = CurrentUserId();
        if (userId == null) return Unauthorized();
        return Ok(await _propertySvc.GetPropertiesByOwnerAsync(userId.Value));
    }

    // PUT /api/users/me — update profile
    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = CurrentUserId();
        if (userId == null) return Unauthorized();
        var user = await _userRepo.GetByIdAsync(userId.Value);
        if (user == null) return NotFound();

        if (!string.IsNullOrWhiteSpace(request.Name))  user.Name = request.Name.Trim();
        if (!string.IsNullOrWhiteSpace(request.Phone)) user.Phone = request.Phone.Trim();
        if (!string.IsNullOrWhiteSpace(request.Email)) user.Email = request.Email.Trim().ToLower();
        if (!string.IsNullOrWhiteSpace(request.ProfilePic)) user.ProfilePic = request.ProfilePic;

        await _userRepo.UpdateAsync(user);
        return Ok(new { 
            message = "Profile updated successfully.",
            user = new { user.Id, user.Name, user.Email, user.Phone, user.RoleId }
        });
    }

    // GET /api/users/me/stats — dashboard overview stats
    [HttpGet("me/stats")]
    public async Task<IActionResult> GetStats()
    {
        var userId = CurrentUserId();
        if (userId == null) return Unauthorized();
        var stats = await _propertySvc.GetOwnerStatsAsync(userId.Value);
        return Ok(new
        {
            totalViews     = stats.TotalViews,
            totalLeads     = stats.TotalLeads,
            activeListings = stats.ActiveListings,
            savedCount     = stats.SavedCount,
        });
    }
}

public class UpdateProfileRequest
{
    public string? Name       { get; set; }
    public string? Email      { get; set; }
    public string? Phone      { get; set; }
    public string? ProfilePic { get; set; }
}
