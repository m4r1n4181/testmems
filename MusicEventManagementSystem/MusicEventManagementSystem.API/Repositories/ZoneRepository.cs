using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class ZoneRepository : Repository<Zone>, IZoneRepository
    {
        public ZoneRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Zone>> GetBySegmentIdAsync(int segmentId)
        {
            return await _context.Zones.Where(z => z.SegmentId == segmentId).ToListAsync();
        }

        public async Task<IEnumerable<Zone>> GetByPriceRangeAsync(decimal min, decimal max)
        {
            return await _context.Zones.Where(z => z.BasePrice >= min && z.BasePrice <= max).ToListAsync();
        }

        public async Task<IEnumerable<Zone>> GetByPositionAsync(string position)
        {
            return await _context.Zones.Where(z => z.Position != null && z.Position.ToLower() == position.ToLower()).ToListAsync();
        }

        public async Task<IEnumerable<TicketType>> GetTicketTypesAsync(int zoneId)
        {
            return await _context.TicketTypes.Where(tt => tt.ZoneId == zoneId).ToListAsync();
        }
    }
}
