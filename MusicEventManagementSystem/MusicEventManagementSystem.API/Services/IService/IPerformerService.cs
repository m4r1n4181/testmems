using MusicEventManagementSystem.API.DTOs;
using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IPerformerService
    {
        Task<IEnumerable<Performer>> GetAllPerformersAsync();
        Task<Performer?> GetPerformerByIdAsync(int id);
        Task<Performer> CreatePerformerAsync(PerformerDto performer);
        Task<Performer?> UpdatePerformerAsync(int id, PerformerDto performer);
        Task<bool> DeletePerformerAsync(int id);
    }
}
