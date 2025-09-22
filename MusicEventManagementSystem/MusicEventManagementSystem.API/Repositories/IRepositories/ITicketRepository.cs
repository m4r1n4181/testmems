using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface ITicketRepository : IRepository<Ticket>
    {
        Task<IEnumerable<Ticket>> GetTicketsByStatusAsync(string status);
        Task<Ticket?> GetTicketByUniqueCodeAsync(string uniqueCode);
        Task<Ticket?> GetTicketByQrCodeAsync(string qrCode);
        Task<IEnumerable<Ticket>> GetSoldTicketsAsync();
        Task<IEnumerable<Ticket>> GetTodaysTicketsAsync();

        // Analytics/Statistics methods
        Task<int> GetTicketsCountByStatusAsync(string status);
        Task<decimal> GetTotalRevenueAsync();
        Task<decimal> GetRevenueByDateRangeAsync(DateTime fromDate, DateTime toDate);
        Task<decimal> GetRevenueByStatusAsync(string status);
    }
}
