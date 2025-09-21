using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface ISegmentService
    {
        Task<IEnumerable<Segment>> GetAllSegmentsAsync();
        Task<Segment?> GetSegmentByIdAsync(int id);
        Task<Segment> CreateSegmentAsync(Segment segment);
        Task<Segment?> UpdateSegmentAsync(int id, Segment segment);
        Task<bool> DeleteSegmentAsync(int id);

        Task<IEnumerable<Segment>> GetByVenueIdAsync(int venueId);
        Task<IEnumerable<Segment>> GetBySegmentTypeAsync(string segmentType);
        Task<IEnumerable<Zone>> GetZonesAsync(int segmentId);
        Task<int> CalculateTotalCapacityAsync(int segmentId);
    }
}
