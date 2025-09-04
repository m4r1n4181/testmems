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
    }
}
