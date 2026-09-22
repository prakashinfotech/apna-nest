using ApnaNest.Data.Entities;
using ApnaNest.Data.Factories;
using Dapper;

namespace ApnaNest.Data.Repositories;

public class PropertyRepository : IPropertyRepository
{
    private readonly IDbConnectionFactory _db;
    public PropertyRepository(IDbConnectionFactory db) => _db = db;

    // All reads go through the enriched view
    private const string Base = "SELECT * FROM vw_properties";

    public async Task<IEnumerable<PropertyDto>> GetAllAsync(
        string? type = null, string? city = null, string? q = null,
        int page = 1, int pageSize = 20)
    {
        var clauses = new List<string> { "is_active = true", "deleted_at IS NULL" };
        var p = new DynamicParameters();

        if (!string.IsNullOrWhiteSpace(type))
        {
            short intentId = type.ToLower() switch { "buy" => 1, "rent" => 2, "pg" => 3, _ => 0 };
            if (intentId > 0) { clauses.Add("listing_intent_id = @intentId"); p.Add("intentId", intentId); }
        }
        if (!string.IsNullOrWhiteSpace(city))
        {
            clauses.Add("(lower(city_name) = lower(@city) OR lower(city_slug) = lower(@city))");
            p.Add("city", city);
        }
        if (!string.IsNullOrWhiteSpace(q))
        {
            clauses.Add("(title ILIKE @q OR locality_name ILIKE @q OR city_name ILIKE @q OR address_line ILIKE @q)");
            p.Add("q", $"%{q}%");
        }
        p.Add("limit", pageSize);
        p.Add("offset", (page - 1) * pageSize);

        var sql = $"{Base} WHERE {string.Join(" AND ", clauses)} ORDER BY is_featured DESC, created_at DESC LIMIT @limit OFFSET @offset";
        using var c = _db.CreateConnection();
        return await c.QueryAsync<PropertyDto>(sql, p);
    }

    public async Task<PropertyDto?> GetByIdAsync(Guid id)
    {
        using var c = _db.CreateConnection();
        var dto = await c.QuerySingleOrDefaultAsync<PropertyDto>($"{Base} WHERE id = @id", new { id });
        if (dto != null) await IncrementViewCountAsync(id);
        return dto;
    }

    public async Task<IEnumerable<PropertyDto>> GetByOwnerAsync(Guid ownerId)
    {
        using var c = _db.CreateConnection();
        return await c.QueryAsync<PropertyDto>($"{Base} WHERE owner_id = @ownerId AND deleted_at IS NULL ORDER BY created_at DESC", new { ownerId });
    }

    public async Task<IEnumerable<PropertyDto>> GetSavedByUserAsync(Guid userId)
    {
        const string sql = @"SELECT v.* FROM vw_properties v
            INNER JOIN saved_properties sp ON sp.property_id = v.id
            WHERE sp.user_id = @userId AND v.is_active = true ORDER BY sp.saved_at DESC";
        using var c = _db.CreateConnection();
        return await c.QueryAsync<PropertyDto>(sql, new { userId });
    }

    public async Task<Guid> AddAsync(Property property)
    {
        property.Id = Guid.NewGuid();
        property.CreatedAt = property.UpdatedAt = DateTime.UtcNow;
        const string sql = @"INSERT INTO properties
            (id, owner_id, city_id, locality_id, address_line, pin_code,
             property_type_id, listing_intent_id, title, description, bhk, bathrooms, area_sqft,
             price, is_rera_verified, is_zero_brokerage, is_active, is_featured, created_at, updated_at)
            VALUES(@Id, @OwnerId, @CityId, @LocalityId, @AddressLine, @PinCode,
             @PropertyTypeId, @ListingIntentId, @Title, @Description, @Bhk, @Bathrooms, @AreaSqft,
             @Price, @IsReraVerified, @IsZeroBrokerage, @IsActive, @IsFeatured, @CreatedAt, @UpdatedAt)
            RETURNING id;";
        using var c = _db.CreateConnection();
        var id = await c.ExecuteScalarAsync<Guid>(sql, property);

        if (property.ImageUrls != null && property.ImageUrls.Any())
        {
            const string imgSql = "INSERT INTO property_images (property_id, url, is_primary) VALUES (@PropId, @Url, @IsPrimary)";
            foreach (var (url, index) in property.ImageUrls.Select((v, i) => (v, i)))
            {
                await c.ExecuteAsync(imgSql, new { PropId = id, Url = url, IsPrimary = index == 0 });
            }
        }
        return id;
    }

    public async Task<bool> UpdateOwnedAsync(Property property, Guid ownerId)
    {
        property.UpdatedAt = DateTime.UtcNow;
        const string sql = @"UPDATE properties SET
            city_id=@CityId, locality_id=@LocalityId, address_line=@AddressLine,
            pin_code=@PinCode,
            property_type_id=@PropertyTypeId, listing_intent_id=@ListingIntentId,
            title=@Title, description=@Description, bhk=@Bhk, bathrooms=@Bathrooms,
            area_sqft=@AreaSqft, price=@Price, is_rera_verified=@IsReraVerified,
            is_zero_brokerage=@IsZeroBrokerage, is_active=@IsActive, is_featured=@IsFeatured, updated_at=@UpdatedAt
            WHERE id=@Id AND owner_id=@OwnerId";

        property.OwnerId = ownerId;
        using var c = _db.CreateConnection();
        return await c.ExecuteAsync(sql, property) > 0;
    }
    public async Task<bool> DeleteOwnedAsync(Guid id, Guid ownerId)
    {
        const string sql = "UPDATE properties SET is_active=false,deleted_at=@now,updated_at=@now WHERE id=@id AND owner_id=@ownerId";
        using var c = _db.CreateConnection();
        return await c.ExecuteAsync(sql, new { id, ownerId, now = DateTime.UtcNow }) > 0;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        const string sql = "UPDATE properties SET is_active=false,deleted_at=@now,updated_at=@now WHERE id=@id";
        using var c = _db.CreateConnection();
        return await c.ExecuteAsync(sql, new { id, now = DateTime.UtcNow }) > 0;
    }

    public async Task SavePropertyAsync(Guid userId, Guid propertyId)
    {
        const string sql = "INSERT INTO saved_properties(user_id,property_id) VALUES(@userId,@propertyId) ON CONFLICT DO NOTHING";
        using var c = _db.CreateConnection();
        await c.ExecuteAsync(sql, new { userId, propertyId });
    }

    public async Task UnsavePropertyAsync(Guid userId, Guid propertyId)
    {
        const string sql = "DELETE FROM saved_properties WHERE user_id=@userId AND property_id=@propertyId";
        using var c = _db.CreateConnection();
        await c.ExecuteAsync(sql, new { userId, propertyId });
    }

    public async Task IncrementViewCountAsync(Guid id)
    {
        const string sql = "UPDATE properties SET view_count = view_count + 1 WHERE id = @id";
        using var c = _db.CreateConnection();
        await c.ExecuteAsync(sql, new { id });
    }

    public async Task<OwnerStatsDto> GetOwnerStatsAsync(Guid ownerId)
    {
        const string sql = @"
            SELECT
                COALESCE((SELECT SUM(view_count) FROM properties WHERE owner_id = @ownerId AND deleted_at IS NULL), 0) AS TotalViews,
                COALESCE((SELECT COUNT(*) FROM leads l
                    INNER JOIN properties p ON p.id = l.property_id
                    WHERE p.owner_id = @ownerId), 0) AS TotalLeads,
                COALESCE((SELECT COUNT(*) FROM properties WHERE owner_id = @ownerId AND is_active = true AND deleted_at IS NULL), 0) AS ActiveListings,
                COALESCE((SELECT COUNT(*) FROM saved_properties sp INNER JOIN properties p ON p.id = sp.property_id WHERE p.owner_id = @ownerId), 0) AS SavedCount;";
        using var c = _db.CreateConnection();
        return await c.QuerySingleAsync<OwnerStatsDto>(sql, new { ownerId });
    }
}
