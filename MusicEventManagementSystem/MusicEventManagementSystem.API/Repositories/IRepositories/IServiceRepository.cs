using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IServiceRepository : IRepository<Service>
    {
        Task<Service?> GetByProviderAsync(string provider);
    }
}