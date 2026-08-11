using ApnaNest.Data.Factories;
using Dapper;
using Microsoft.AspNetCore.Mvc;

namespace ApnaNest.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CitiesController : ControllerBase
{
    private readonly IDbConnectionFactory _db;
    public CitiesController(IDbConnectionFactory db) => _db = db;

    // GET /api/cities
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        const string sql = "SELECT id, name, slug, latitude, longitude FROM cities WHERE is_active = true ORDER BY name";
        using var c = _db.CreateConnection();
        return Ok(await c.QueryAsync(sql));
    }

    // GET /api/cities/{slug}
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        const string sql = "SELECT id, name, slug, latitude, longitude FROM cities WHERE slug = @slug AND is_active = true";
        using var c = _db.CreateConnection();
        var city = await c.QuerySingleOrDefaultAsync(sql, new { slug });
        return city == null ? NotFound() : Ok(city);
    }
}
