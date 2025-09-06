using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IInfrastructureRepository
    {
        Task<IEnumerable<Infrastructure>> GetAllAsync();
        Task<Infrastructure?> GetByIdAsync(int id);
        Task AddAsync(Infrastructure infrastructure);
        void Update(Infrastructure infrastructure);
        void Delete(Infrastructure infrastructure);
        Task SaveChangesAsync();
    }
}