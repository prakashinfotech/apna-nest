using System.Security.Claims;
using System.Text.Json.Serialization;
using ApnaNest.Data.Entities;
using ApnaNest.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApnaNest.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeadsController : ControllerBase
{
    private readonly ILeadService _leadService;
    public LeadsController(ILeadService leadService) => _leadService = leadService;

    // POST /api/leads — public; accepts propertyId as string (handles both UUID and mock IDs)
    [HttpPost]
    public async Task<IActionResult> SubmitLead([FromBody] LeadRequest request)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(request.BuyerName))
            return BadRequest(new { error = "Your name is required." });
        if (string.IsNullOrWhiteSpace(request.BuyerPhone))
            return BadRequest(new { error = "Your phone number is required." });
        if (string.IsNullOrWhiteSpace(request.PropertyId))
            return BadRequest(new { error = "Property ID is required." });

        // Parse propertyId — accept Guid or use Guid.Empty for mock string IDs
        if (!Guid.TryParse(request.PropertyId, out var propertyId))
            propertyId = Guid.Empty; // Allow mock string IDs to pass without 400

        var lead = new Lead
        {
            PropertyId  = propertyId,
            OwnerId     = Guid.Empty, // Will be looked up by service if needed
            BuyerName   = request.BuyerName.Trim(),
            BuyerPhone  = request.BuyerPhone.Trim(),
            BuyerEmail  = request.BuyerEmail?.Trim(),
            Message     = request.Message?.Trim() ?? "I am interested in this property.",
            StatusId    = 1,
        };

        try
        {
            var leadId = await _leadService.SubmitLeadAsync(lead);
            return Ok(new { leadId, message = "Your enquiry has been sent successfully!" });
        }
        catch (Exception)
        {
            return StatusCode(500, new { error = "Failed to submit enquiry. Please try again." });
        }
    }

    [Authorize]
    [HttpGet("property/{propertyId}")]
    public async Task<IActionResult> GetLeadsForProperty(Guid propertyId)
    {
        var userId = CurrentUserId();
        if (userId == null) return Unauthorized();
        var leads = await _leadService.GetLeadsForPropertyAsync(propertyId, userId.Value);
        return Ok(leads);
    }

    private Guid? CurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.TryParse(claim, out var id) ? id : null;
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyLeads()
    {
        var userId = CurrentUserId();
        if (userId == null) return Unauthorized();
        var leads = await _leadService.GetLeadsForOwnerAsync(userId.Value);
        return Ok(leads);
    }

    [Authorize]
    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request)
    {
        var userId = CurrentUserId();
        if (userId == null) return Unauthorized();
        var success = await _leadService.UpdateLeadStatusAsync(id, userId.Value, request.StatusId);
        return success ? Ok(new { message = "Lead status updated." }) : NotFound();
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = CurrentUserId();
        if (userId == null) return Unauthorized();
        var success = await _leadService.DeleteLeadAsync(id, userId.Value);
        return success ? NoContent() : NotFound();
    }
}

public class UpdateStatusRequest
{
    [JsonPropertyName("statusId")]
    public short StatusId { get; set; }
}

public class LeadRequest
{
    [JsonPropertyName("propertyId")]
    public string  PropertyId  { get; set; } = string.Empty;

    [JsonPropertyName("buyerName")]
    public string  BuyerName   { get; set; } = string.Empty;

    [JsonPropertyName("buyerPhone")]
    public string  BuyerPhone  { get; set; } = string.Empty;

    [JsonPropertyName("buyerEmail")]
    public string? BuyerEmail  { get; set; }

    [JsonPropertyName("message")]
    public string? Message     { get; set; }
}
