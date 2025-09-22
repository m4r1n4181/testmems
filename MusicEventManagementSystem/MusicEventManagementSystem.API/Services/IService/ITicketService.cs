using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface ITicketService
    {
        Task<IEnumerable<Ticket>> GetAllTicketsAsync();
        Task<Ticket?> GetTicketByIdAsync(int id);
        Task<Ticket> CreateTicketAsync(Ticket ticket);
        Task<Ticket?> UpdateTicketAsync(int id, Ticket ticket);
        Task<bool> DeleteTicketAsync(int id);

        Task<IEnumerable<Ticket>> GetTicketsByStatusAsync(string status);
        Task<Ticket?> GetTicketByUniqueCodeAsync(string uniqueCode);
        Task<Ticket?> GetTicketByQrCodeAsync(string qrCode);

        Task<int> GetTicketsCountByStatusAsync(string status);
        Task<decimal> GetTotalRevenueAsync();
        Task<decimal> GetRevenueByDateRangeAsync(DateTime from, DateTime to);
        Task<decimal> GetRevenueByStatusAsync(string status);
        Task<IEnumerable<Ticket>> GetSoldTicketsAsync();
        Task<IEnumerable<Ticket>> GetTodaysTicketsAsync();

        // Ticket lifecycle methods
        Task<Ticket?> SellTicketAsync(int ticketId);
        Task<Ticket?> UseTicketAsync(string uniqueCode);
        Task<Ticket?> CancelTicketAsync(int ticketId);

        // Validation methods
        Task<bool> IsUniqueCodeValidAsync(string uniqueCode);
        Task<bool> IsQrCodeValidAsync(string qrCode);
        Task<bool> CanTicketBeUsedAsync(string uniqueCode);
    }
}
