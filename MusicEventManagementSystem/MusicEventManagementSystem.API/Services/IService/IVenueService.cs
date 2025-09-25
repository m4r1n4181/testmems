using MusicEventManagementSystem.API.DTOs.TicketSales;
using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IVenueService
    {
        Task<IEnumerable<VenueResponseDto>> GetAllVenuesAsync();
        Task<VenueResponseDto?> GetVenueByIdAsync(int id);
        Task<VenueResponseDto> CreateVenueAsync(VenueCreateDto createVenueDto);
        Task<VenueResponseDto?> UpdateVenueAsync(int id, VenueUpdateDto updateVenueDto);
        Task<bool> DeleteVenueAsync(int id);

        Task<IEnumerable<VenueResponseDto>> GetByCityAsync(string city);
        Task<IEnumerable<VenueResponseDto>> GetByCapacityRangeAsync(int min, int max);
        Task<IEnumerable<Segment>> GetSegmentsAsync(int venueId);

        Task<int> CalculateTotalCapacityAsync(int venueId);
    }
}
