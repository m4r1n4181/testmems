using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IPerformerService
    {
        Task<IEnumerable<Performer>> GetAllPerformersAsync();
        Task<Performer?> GetPerformerByIdAsync(int id);
        Task<Performer> CreatePerformerAsync(Performer performer);
        Task<Performer?> UpdatePerformerAsync(int id, Performer performer);
        Task<bool> DeletePerformerAsync(int id);
    }
}