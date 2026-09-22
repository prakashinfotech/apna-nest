using System.Security.Claims;
using ApnaNest.Data.Entities;
using ApnaNest.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApnaNest.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyService _svc;
    public PropertiesController(IPropertyService svc) => _svc = svc;

    private Guid? CurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.TryParse(claim, out var id) ? id : null;
    }

    // GET /api/properties?type=buy&city=bangalore&q=whitefield&page=1&pageSize=20
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? type, [FromQuery] string? city,
        [FromQuery] string? q,    [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var list = await _svc.GetAllPropertiesAsync(type, city, q, page, Math.Min(pageSize, 50));
        return Ok(list);
    }

    // GET /api/properties/my  — current owner's listings
    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMine()
    {
        var userId = CurrentUserId();
        if (userId == null) return Unauthorized();
        return Ok(await _svc.GetPropertiesByOwnerAsync(userId.Value));
    }

    // GET /api/properties/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var p = await _svc.GetPropertyByIdAsync(id);
        return p == null ? NotFound() : Ok(p);
    }

    // POST /api/properties
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Property property)
    {
        var userId = CurrentUserId();
        if (userId != null) property.OwnerId = userId.Value;
        property.IsActive = true;
        var id = await _svc.CreatePropertyAsync(property);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    // PUT /api/properties/{id}
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Property property)
    {
        var userId = CurrentUserId();
        if (userId == null) return Unauthorized();
        property.Id = id;
        return await _svc.UpdateOwnedPropertyAsync(property, userId.Value) ? NoContent() : NotFound();
    }

    // DELETE /api/properties/{id}
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = CurrentUserId();
        if (userId == null) return Unauthorized();
        return await _svc.DeleteOwnedPropertyAsync(id, userId.Value) ? NoContent() : NotFound();
    }

    // POST /api/properties/{id}/save
    [Authorize]
    [HttpPost("{id:guid}/save")]
    public async Task<IActionResult> Save(Guid id)
    {
        var userId = CurrentUserId();
        if (userId == null) return Unauthorized();
        await _svc.SavePropertyAsync(userId.Value, id);
        return Ok();
    }

    // DELETE /api/properties/{id}/save
    [Authorize]
    [HttpDelete("{id:guid}/save")]
    public async Task<IActionResult> Unsave(Guid id)
    {
        var userId = CurrentUserId();
        if (userId == null) return Unauthorized();
        await _svc.UnsavePropertyAsync(userId.Value, id);
        return NoContent();
    }
}
