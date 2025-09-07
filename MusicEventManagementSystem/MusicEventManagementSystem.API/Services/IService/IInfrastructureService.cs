using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IInfrastructureService
    {
        Task<IEnumerable<Infrastructure>> GetAllInfrastructuresAsync();
        Task<Infrastructure?> GetInfrastructureByIdAsync(int id);
        Task<Infrastructure> CreateInfrastructureAsync(Infrastructure infrastructure, Resource resource);
        Task<Infrastructure?> UpdateInfrastructureAsync(int id, Infrastructure infrastructure);
        Task<bool> DeleteInfrastructureAsync(int id);
    }
}