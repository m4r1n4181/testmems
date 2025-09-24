using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Enums.TicketSales;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class TicketRepository : Repository<Ticket>, ITicketRepository
    {
        public TicketRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Ticket>> GetTicketsByStatusAsync(TicketStatus status)
        {
            return await _context.Tickets.Where(t => t.Status == status).ToListAsync();
        }

        public async Task<Ticket?> GetTicketByUniqueCodeAsync(string uniqueCode)
        {
            return await _context.Tickets.FirstOrDefaultAsync(t => t.UniqueCode == uniqueCode);
        }

        public async Task<Ticket?> GetTicketByQrCodeAsync(string qrCode)
        {
            return await _context.Tickets.FirstOrDefaultAsync(t => t.QrCode == qrCode);
        }

        public async Task<IEnumerable<Ticket>> GetSoldTicketsAsync()
        {
            return await _context.Tickets.Where(t => t.Status == TicketStatus.Sold || t.Status! == TicketStatus.Used)
                .OrderByDescending(t => t.IssueDate).ToListAsync();
        }

        public async Task<IEnumerable<Ticket>> GetTodaysTicketsAsync()
        {
            var today = DateTime.Today;
            return await _context.Tickets.Where(t => t.IssueDate.Date == today).OrderByDescending(t => t.IssueDate).ToListAsync();
        }

        public async Task<int> GetTicketsCountByStatusAsync(TicketStatus status)
        {
            return await _context.Tickets.CountAsync(t => t.Status! == status);
        }

        public async Task<decimal> GetTotalRevenueAsync()
        {
            var tickets = await _context.Tickets.Where(t => t.Status == TicketStatus.Sold || t.Status! == TicketStatus.Used).ToListAsync();
            
            return tickets.Sum(t => t.FinalPrice);
        }

        public async Task<decimal> GetRevenueByDateRangeAsync(DateTime from, DateTime to)
        {
            var tickets = await _context.Tickets.Where(t => t.IssueDate.Date >= from.Date && t.IssueDate.Date <= to.Date && 
                (t.Status == TicketStatus.Sold || t.Status! == TicketStatus.Used)).ToListAsync();
        
            return tickets.Sum(t => t.FinalPrice);
        }

        public async Task<decimal> GetRevenueByStatusAsync(TicketStatus status)
        {
            var tickets = await _context.Tickets
                .Where(t => t.Status == status)
                .ToListAsync();

            return tickets.Sum(t => t.FinalPrice);
        }
    }
}
