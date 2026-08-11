using ApnaNest.Data.Entities;
using ApnaNest.Data.Repositories;
using ApnaNest.Services.Interfaces;

namespace ApnaNest.Services.Services;

public class PropertyService : IPropertyService
{
    private readonly IPropertyRepository _repo;
    public PropertyService(IPropertyRepository repo) => _repo = repo;

    public Task<IEnumerable<PropertyDto>> GetAllPropertiesAsync(string? type = null, string? city = null, string? q = null, int page = 1, int pageSize = 20)
        => _repo.GetAllAsync(type, city, q, page, pageSize);

    public Task<PropertyDto?> GetPropertyByIdAsync(Guid id)
        => _repo.GetByIdAsync(id);

    public Task<IEnumerable<PropertyDto>> GetPropertiesByOwnerAsync(Guid ownerId)
        => _repo.GetByOwnerAsync(ownerId);

    public Task<IEnumerable<PropertyDto>> GetSavedPropertiesAsync(Guid userId)
        => _repo.GetSavedByUserAsync(userId);

    public Task<Guid> CreatePropertyAsync(Property property)
        => _repo.AddAsync(property);

    public Task<bool> UpdateOwnedPropertyAsync(Property property, Guid ownerId)
        => _repo.UpdateOwnedAsync(property, ownerId);

    public Task<bool> DeleteOwnedPropertyAsync(Guid id, Guid ownerId)
        => _repo.DeleteOwnedAsync(id, ownerId);

    public Task<bool> DeletePropertyAsync(Guid id)
        => _repo.DeleteAsync(id);

    public Task SavePropertyAsync(Guid userId, Guid propertyId)
        => _repo.SavePropertyAsync(userId, propertyId);

    public Task UnsavePropertyAsync(Guid userId, Guid propertyId)
        => _repo.UnsavePropertyAsync(userId, propertyId);

    public Task<OwnerStatsDto> GetOwnerStatsAsync(Guid ownerId)
        => _repo.GetOwnerStatsAsync(ownerId);
}
