using ApnaNest.Data.Entities;

namespace ApnaNest.Data.Repositories;

public interface IPropertyRepository
{
    // Enriched read (via vw_properties view)
    Task<IEnumerable<PropertyDto>> GetAllAsync(string? type = null, string? city = null, string? q = null, int page = 1, int pageSize = 20);
    Task<PropertyDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<PropertyDto>> GetByOwnerAsync(Guid ownerId);
    Task<IEnumerable<PropertyDto>> GetSavedByUserAsync(Guid userId);

    // Write operations
    Task<Guid> AddAsync(Property property);
    Task<bool> UpdateOwnedAsync(Property property, Guid ownerId);
    Task<bool> DeleteOwnedAsync(Guid id, Guid ownerId);
    Task<bool> DeleteAsync(Guid id);

    // Saved
    Task SavePropertyAsync(Guid userId, Guid propertyId);
    Task UnsavePropertyAsync(Guid userId, Guid propertyId);

    // Stats
    Task IncrementViewCountAsync(Guid id);
    Task<OwnerStatsDto> GetOwnerStatsAsync(Guid ownerId);
}
