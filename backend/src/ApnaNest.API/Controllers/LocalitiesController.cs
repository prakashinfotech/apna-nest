using ApnaNest.Data.Factories;
using Dapper;
using Microsoft.AspNetCore.Mvc;

namespace ApnaNest.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocalitiesController : ControllerBase
{
    private readonly IDbConnectionFactory _db;
    public LocalitiesController(IDbConnectionFactory db) => _db = db;

    // GET /api/localities?citySlug=ahmedabad
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? citySlug, [FromQuery] string? cityId)
    {
        var where = new List<string> { "l.is_active = true" };
        var p = new DynamicParameters();

        if (!string.IsNullOrWhiteSpace(citySlug))
        {
            where.Add("c.slug = @citySlug");
            p.Add("citySlug", citySlug);
        }
        if (!string.IsNullOrWhiteSpace(cityId) && Guid.TryParse(cityId, out var cid))
        {
            where.Add("l.city_id = @cid");
            p.Add("cid", cid);
        }

        var sql = $@"
            SELECT l.id, l.name, l.slug, l.latitude, l.longitude, l.pin_code,
                   l.description, l.avg_price_sqft,
                   c.id AS city_id, c.name AS city_name, c.slug AS city_slug,
                   (SELECT COUNT(*) FROM properties pr WHERE pr.locality_id = l.id AND pr.is_active = true) AS property_count
            FROM localities l
            LEFT JOIN cities c ON c.id = l.city_id
            WHERE {string.Join(" AND ", where)}
            ORDER BY l.name";

        using var conn = _db.CreateConnection();
        return Ok(await conn.QueryAsync(sql, p));
    }

    // GET /api/localities/{slug}?citySlug=ahmedabad
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug, [FromQuery] string? citySlug)
    {
        const string sql = @"
            SELECT l.id, l.name, l.slug, l.latitude, l.longitude, l.pin_code,
                   l.description, l.avg_price_sqft,
                   c.id AS city_id, c.name AS city_name, c.slug AS city_slug,
                   (SELECT COUNT(*) FROM properties pr WHERE pr.locality_id = l.id AND pr.is_active = true) AS property_count
            FROM localities l
            LEFT JOIN cities c ON c.id = l.city_id
            WHERE l.slug = @slug AND l.is_active = true
            LIMIT 1";

        using var conn = _db.CreateConnection();
        var loc = await conn.QuerySingleOrDefaultAsync(sql, new { slug });
        return loc == null ? NotFound() : Ok(loc);
    }
}
