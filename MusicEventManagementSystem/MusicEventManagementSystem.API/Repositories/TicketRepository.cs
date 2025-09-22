﻿using Microsoft.EntityFrameworkCore;
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

        public async Task<IEnumerable<Ticket>> GetTicketsByStatusAsync(string status)
        {
            return await _context.Tickets.Where(t => t.Status!.ToLower() == status.ToLower()).ToListAsync();
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
            return await _context.Tickets.Where(t => t.Status!.ToLower() == "sold" || t.Status!.ToLower() == "used")
                .OrderByDescending(t => t.IssueDate).ToListAsync();
        }

        public async Task<IEnumerable<Ticket>> GetTodaysTicketsAsync()
        {
            var today = DateTime.Today;
            return await _context.Tickets.Where(t => t.IssueDate.Date == today).OrderByDescending(t => t.IssueDate).ToListAsync();
        }

        public async Task<int> GetTicketsCountByStatusAsync(string status)
        {
            return await _context.Tickets.CountAsync(t => t.Status!.ToLower() == status.ToLower());
        }

        public async Task<decimal> GetTotalRevenueAsync()
        {
            var tickets = await _context.Tickets.Where(t => t.Status!.ToLower() == "sold" || t.Status!.ToLower() == "used").ToListAsync();
            
            return tickets.Sum(t => t.FinalPrice);
        }

        public async Task<decimal> GetRevenueByDateRangeAsync(DateTime from, DateTime to)
        {
            var tickets = await _context.Tickets.Where(t => t.IssueDate.Date >= from.Date && t.IssueDate.Date <= to.Date && 
                (t.Status!.ToLower() == "sold" || t.Status!.ToLower() == "used")).ToListAsync();
        
            return tickets.Sum(t => t.FinalPrice);
        }

        public async Task<decimal> GetRevenueByStatusAsync(string status)
        {
            var tickets = await _context.Tickets.Where(t => t.Status!.ToLower() == status.ToLower()).ToListAsync();
        
            return tickets.Sum(t => t.FinalPrice);
        }
    }
}
