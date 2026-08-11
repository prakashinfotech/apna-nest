using ApnaNest.Data.Entities;

namespace ApnaNest.Data.Repositories;

public interface ILeadRepository
{
    Task<IEnumerable<Lead>> GetByPropertyIdAsync(Guid propertyId, Guid ownerId);
    Task<IEnumerable<Lead>> GetByOwnerIdAsync(Guid ownerId);
    Task<IEnumerable<Lead>> GetAllAsync();
    Task<Guid> AddAsync(Lead lead);
    Task<bool> UpdateStatusAsync(Guid id, Guid ownerId, short statusId);
    Task<bool> DeleteAsync(Guid id, Guid ownerId);
}
