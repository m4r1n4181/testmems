using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IZoneRepository : IRepository<Zone>
    {
        Task<IEnumerable<Zone>> GetBySegmentIdAsync(int segmentId);
        Task<IEnumerable<Zone>> GetByPriceRangeAsync(decimal min, decimal max);
        Task<IEnumerable<Zone>> GetByPositionAsync(string position);
        Task<IEnumerable<TicketType>> GetTicketTypesAsync(int zoneId);
    }
}
