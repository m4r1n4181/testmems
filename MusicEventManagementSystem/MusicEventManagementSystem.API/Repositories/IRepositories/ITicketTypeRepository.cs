using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface ITicketTypeRepository : IRepository<TicketType>
    {
        Task<IEnumerable<TicketType>> GetByZoneIdAsync(int zoneId);
        Task<IEnumerable<TicketType>> GetByEventIdAsync(int eventId);
        Task<IEnumerable<TicketType>> GetByStatusAsync(string status);
        Task<IEnumerable<TicketType>> GetAvailableTicketTypesAsync();
        Task<bool> UpdateAvailableQuantityAsync(int id, int quantity);
        Task<IEnumerable<TicketType>> GetByZoneAndEventAsync(int zoneId, int eventId);
        Task<int> GetTotalAvailableQuantityByEventAsync(int eventId);
    }
}
