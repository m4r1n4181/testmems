using MusicEventManagementSystem.API.DTOs.TicketSales;
using MusicEventManagementSystem.API.Enums.TicketSales;
using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface ISegmentService
    {
        Task<IEnumerable<SegmentResponseDto>> GetAllSegmentsAsync();
        Task<SegmentResponseDto?> GetSegmentByIdAsync(int id);
        Task<SegmentResponseDto> CreateSegmentAsync(SegmentCreateDto createSegmentDto);
        Task<SegmentResponseDto?> UpdateSegmentAsync(int id, SegmentUpdateDto updateSegmentDto);
        Task<bool> DeleteSegmentAsync(int id);

        Task<IEnumerable<SegmentResponseDto>> GetByVenueIdAsync(int venueId);
        Task<IEnumerable<SegmentResponseDto>> GetBySegmentTypeAsync(SegmentType segmentType);
        Task<IEnumerable<ZoneResponseDto>> GetZonesAsync(int segmentId);
        Task<int> CalculateTotalCapacityAsync(int segmentId);
    }
}
