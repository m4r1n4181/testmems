using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface ISegmentRepository : IRepository<Segment>
    {
        Task<IEnumerable<Segment>> GetByVenueIdAsync(int venueId);
        Task<IEnumerable<Segment>> GetBySegmentTypeAsync(string segmentType);
        Task<IEnumerable<Zone>> GetZonesAsync(int segmentId);
        Task<int> CalculateTotalCapacityAsync(int segmentId);
    }
}
