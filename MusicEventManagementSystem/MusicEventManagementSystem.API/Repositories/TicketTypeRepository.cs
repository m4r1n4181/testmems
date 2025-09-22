using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class TicketTypeRepository : Repository<TicketType>, ITicketTypeRepository
    {
        public TicketTypeRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<TicketType>> GetByZoneIdAsync(int zoneId)
        {
            return await _context.TicketTypes.Where(tt => tt.ZoneId == zoneId).ToListAsync();
        }

        public async Task<IEnumerable<TicketType>> GetByEventIdAsync(int eventId)
        {
            return await _context.TicketTypes
                .Where(tt => tt.EventId == eventId)
                .ToListAsync();
        }

        public async Task<IEnumerable<TicketType>> GetByStatusAsync(string status)
        {
            return await _context.TicketTypes
                .Where(tt => tt.Status != null && tt.Status.ToLower() == status.ToLower())
                .ToListAsync();
        }

        public async Task<IEnumerable<TicketType>> GetAvailableTicketTypesAsync()
        {
            return await _context.TicketTypes.Where(tt => tt.AvailableQuantity > 0 &&(tt.Status == null || tt.Status.ToLower() == "active")).ToListAsync();
        }

        public async Task<bool> UpdateAvailableQuantityAsync(int id, int quantity)
        {
            var ticketType = await _context.TicketTypes.FindAsync(id);

            if (ticketType == null)
            {
                return false;
            }

            ticketType.AvailableQuantity = quantity;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<TicketType>> GetByZoneAndEventAsync(int zoneId, int eventId)
        {
            return await _context.TicketTypes.Where(tt => tt.ZoneId == zoneId && tt.EventId == eventId).ToListAsync();
        }

        public async Task<int> GetTotalAvailableQuantityByEventAsync(int eventId)
        {
            return await _context.TicketTypes.Where(tt => tt.EventId == eventId).SumAsync(tt => tt.AvailableQuantity);
        }
    }
}
