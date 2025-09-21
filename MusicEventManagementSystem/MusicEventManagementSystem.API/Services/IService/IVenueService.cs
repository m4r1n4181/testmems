using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IVenueService
    {
        Task<IEnumerable<Venue>> GetAllVenuesAsync();
        Task<Venue?> GetVenueByIdAsync(int venueId);
        Task<Venue> CreateVenueAsync(Venue venue);
        Task<Venue?> UpdateVenueAsync(int venueId, Venue venue);
        Task<bool> DeleteVenueAsync(int venueId);

        Task<IEnumerable<Venue>> GetByCityAsync(string city);
        Task<IEnumerable<Venue>> GetByCapacityRangeAsync(int min, int max);
        Task<IEnumerable<Segment>> GetSegmentsAsync(int venueId);

        Task<int> CalculateTotalCapacityAsync(int venueId);
    }
}
