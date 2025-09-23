using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IPhaseRepository : IRepository<Phase>
    {
        Task<Phase?> GetPhaseWithRequirementsAsync(int id);
        Task<IEnumerable<Phase>> GetPhasesByNegotiationIdAsync(int negotiationId);
        Task<IEnumerable<Phase>> GetPhasesByContractIdAsync(int contractId);
        Task<IEnumerable<Phase>> GetPhasesWithRequirementsAsync();
    }
}
