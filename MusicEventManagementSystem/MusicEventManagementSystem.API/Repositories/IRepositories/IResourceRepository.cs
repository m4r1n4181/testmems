using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IResourceRepository : IRepository<Resource>
    {
        Task<Resource?> GetByNameAsync(string name);
        Task<IEnumerable<Resource>> GetByTypeAsync(ResourceType type);
        Task<IEnumerable<Resource>> GetAvailableResourcesAsync();
    }
}