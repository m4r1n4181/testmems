using MusicEventManagementSystem.API.Enums.TicketSales;
using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface ISegmentRepository : IRepository<Segment>
    {
        Task<IEnumerable<Segment>> GetByVenueIdAsync(int venueId);
        Task<IEnumerable<Segment>> GetBySegmentTypeAsync(SegmentType segmentType);
        Task<IEnumerable<Zone>> GetZonesAsync(int segmentId);
        Task<int> CalculateTotalCapacityAsync(int segmentId);
    }
}
