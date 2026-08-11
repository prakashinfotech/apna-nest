using ApnaNest.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApnaNest.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IPropertyService _propertyService;
    private readonly ILeadService _leadService;
    // User service missing? To keep it simple, we use existing repositories if needed, 
    // but ideally we create IUserService. Since we don't have it, we skip for now.

    public AdminController(IPropertyService propertyService, ILeadService leadService)
    {
        _propertyService = propertyService;
        _leadService = leadService;
    }

    [HttpGet("properties")]
    public async Task<IActionResult> GetAllPropertiesAdmin()
    {
        var properties = await _propertyService.GetAllPropertiesAsync();
        return Ok(properties);
    }

    [HttpDelete("properties/{id}")]
    public async Task<IActionResult> DeletePropertyAdmin(Guid id)
    {
        var deleted = await _propertyService.DeletePropertyAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    [HttpGet("leads")]
    public async Task<IActionResult> GetAllLeadsAdmin()
    {
        var leads = await _leadService.GetAllLeadsAsync();
        return Ok(leads);
    }
}
