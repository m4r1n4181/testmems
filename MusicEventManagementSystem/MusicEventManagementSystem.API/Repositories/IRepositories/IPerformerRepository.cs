using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IPerformerRepository : IRepository<Performer>
    {
        Task<Performer?> GetByNameAsync(string name);
        Task<IEnumerable<Performer>> GetByGenreAsync(string genre);
    }
}