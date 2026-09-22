using ApnaNest.Data.Entities;

namespace ApnaNest.Services.Interfaces;

public interface IPropertyService
{
    Task<IEnumerable<PropertyDto>> GetAllPropertiesAsync(string? type = null, string? city = null, string? q = null, int page = 1, int pageSize = 20);
    Task<PropertyDto?> GetPropertyByIdAsync(Guid id);
    Task<IEnumerable<PropertyDto>> GetPropertiesByOwnerAsync(Guid ownerId);
    Task<IEnumerable<PropertyDto>> GetSavedPropertiesAsync(Guid userId);
    Task<Guid> CreatePropertyAsync(Property property);
    Task<bool> UpdateOwnedPropertyAsync(Property property, Guid ownerId);
    Task<bool> DeleteOwnedPropertyAsync(Guid id, Guid ownerId);
    Task<bool> DeletePropertyAsync(Guid id);
    Task SavePropertyAsync(Guid userId, Guid propertyId);
    Task UnsavePropertyAsync(Guid userId, Guid propertyId);
    Task<OwnerStatsDto> GetOwnerStatsAsync(Guid ownerId);
}
