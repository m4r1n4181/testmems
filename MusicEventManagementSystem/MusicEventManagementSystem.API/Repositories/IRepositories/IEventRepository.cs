using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IEventRepository : IRepository<Event>
    {
        Task<Event?> GetByNameAsync(string name);
        Task<IEnumerable<Event>> GetByStatusAsync(EventStatus status);
        Task<IEnumerable<Event>> GetByDateRangeAsync(DateTime start, DateTime end);
        Task<IEnumerable<Event>> GetByCreatedByIdAsync(Guid createdById);
    }
}