using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface ITicketTypeService
    {
        Task<IEnumerable<TicketType>> GetAllTicketTypesAsync();
        Task<TicketType?> GetTicketTypeByIdAsync(int id);
        Task<TicketType> CreateTicketTypeAsync(TicketType ticketType);
        Task<TicketType?> UpdateTicketTypeAsync(int id, TicketType ticketType);
        Task<bool> DeleteTicketTypeAsync(int id);

        Task<IEnumerable<TicketType>> GetByZoneIdAsync(int zoneId);
        Task<IEnumerable<TicketType>> GetByEventIdAsync(int eventId);
        Task<IEnumerable<TicketType>> GetByStatusAsync(string status);
        Task<IEnumerable<TicketType>> GetAvailableTicketTypesAsync();
        Task<bool> UpdateAvailableQuantityAsync(int id, int quantity);
        Task<IEnumerable<TicketType>> GetByZoneAndEventAsync(int zoneId, int eventId);
        Task<int> GetTotalAvailableQuantityByEventAsync(int eventId);
        Task<bool> ReserveTicketsAsync(int ticketTypeId, int quantity);
        Task<bool> ReleaseTicketsAsync(int ticketTypeId, int quantity);
    }
}
