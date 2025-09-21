using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IPerformanceRepository : IRepository<Performance>
    {
        Task<IEnumerable<Performance>> GetByEventIdAsync(int eventId);
        Task<IEnumerable<Performance>> GetByPerformerIdAsync(int performerId);
        Task<IEnumerable<Performance>> GetByVenueIdAsync(int venueId);
        Task<IEnumerable<Performance>> GetByDateRangeAsync(DateTime start, DateTime end);
    }
}