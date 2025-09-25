using MusicEventManagementSystem.API.DTOs.TicketSales;
using MusicEventManagementSystem.API.Enums.TicketSales;
using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface ITicketTypeService
    {
        Task<IEnumerable<TicketTypeResponseDto>> GetAllTicketTypesAsync();
        Task<TicketTypeResponseDto?> GetTicketTypeByIdAsync(int id);
        Task<TicketTypeResponseDto> CreateTicketTypeAsync(TicketTypeCreateDto createDto);
        Task<TicketTypeResponseDto?> UpdateTicketTypeAsync(int id, TicketTypeUpdateDto updateDto);
        Task<bool> DeleteTicketTypeAsync(int id);

        Task<IEnumerable<TicketTypeResponseDto>> GetByZoneIdAsync(int zoneId);
        Task<IEnumerable<TicketTypeResponseDto>> GetByEventIdAsync(int eventId);
        Task<IEnumerable<TicketTypeResponseDto>> GetByStatusAsync(TicketTypeStatus status);
        Task<IEnumerable<TicketTypeResponseDto>> GetAvailableTicketTypesAsync();
        Task<bool> UpdateAvailableQuantityAsync(int id, int quantity);
        Task<IEnumerable<TicketTypeResponseDto>> GetByZoneAndEventAsync(int zoneId, int eventId);
        Task<int> GetTotalAvailableQuantityByEventAsync(int eventId);
        Task<bool> ReserveTicketsAsync(int ticketTypeId, int quantity);
        Task<bool> ReleaseTicketsAsync(int ticketTypeId, int quantity);
    }
}
