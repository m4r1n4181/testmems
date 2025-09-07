using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface ILocationRepository : IRepository<Location>
    {
        Task<Location?> GetByNameAsync(string name);
    }
}