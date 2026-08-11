using ApnaNest.Data.Entities;
using ApnaNest.Data.Repositories;
using ApnaNest.Services.Interfaces;

namespace ApnaNest.Services.Services;

public class LeadService : ILeadService
{
    private readonly ILeadRepository _leadRepository;

    public LeadService(ILeadRepository leadRepository)
    {
        _leadRepository = leadRepository;
    }

    public Task<IEnumerable<Lead>> GetLeadsForPropertyAsync(Guid propertyId, Guid ownerId)
    {
        return _leadRepository.GetByPropertyIdAsync(propertyId, ownerId);
    }

    public Task<IEnumerable<Lead>> GetLeadsForOwnerAsync(Guid ownerId)
        => _leadRepository.GetByOwnerIdAsync(ownerId);

    public Task<IEnumerable<Lead>> GetAllLeadsAsync()
        => _leadRepository.GetAllAsync();

    public Task<Guid> SubmitLeadAsync(Lead lead)
        => _leadRepository.AddAsync(lead);

    public Task<bool> UpdateLeadStatusAsync(Guid id, Guid ownerId, short statusId)
        => _leadRepository.UpdateStatusAsync(id, ownerId, statusId);

    public Task<bool> DeleteLeadAsync(Guid id, Guid ownerId)
        => _leadRepository.DeleteAsync(id, ownerId);
}
