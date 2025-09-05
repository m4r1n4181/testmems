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
    }
}
