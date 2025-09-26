using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IPhaseService
    {
        Task<IEnumerable<Phase>> GetAllPhasesAsync();
        Task<Phase?> GetPhaseByIdAsync(int id);
        Task<Phase> CreatePhaseAsync(Phase phase);
        Task<Phase?> UpdatePhaseAsync(int id, Phase phase);
        Task<bool> DeletePhaseAsync(int id);
    }
}
