using ApnaNest.Data.Entities;

namespace ApnaNest.Services.Interfaces;

public interface ILeadService
{
    Task<IEnumerable<Lead>> GetLeadsForPropertyAsync(Guid propertyId, Guid ownerId);
    Task<IEnumerable<Lead>> GetLeadsForOwnerAsync(Guid ownerId);
    Task<IEnumerable<Lead>> GetAllLeadsAsync();
    Task<Guid> SubmitLeadAsync(Lead lead);
    Task<bool> UpdateLeadStatusAsync(Guid id, Guid ownerId, short statusId);
    Task<bool> DeleteLeadAsync(Guid id, Guid ownerId);
}
