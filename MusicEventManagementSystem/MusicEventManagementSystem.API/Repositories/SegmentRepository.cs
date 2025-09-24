using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Enums.TicketSales;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class SegmentRepository : Repository<Segment>, ISegmentRepository
    {
        public SegmentRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Segment>> GetByVenueIdAsync(int venueId)
        {
            return await _context.Segments.Where(s => s.VenueId == venueId).ToListAsync();
        }

        public async Task<IEnumerable<Segment>> GetBySegmentTypeAsync(SegmentType segmentType)
        {
            return await _context.Segments.Where(s => s.SegmentType != null && s.SegmentType == segmentType).ToListAsync();
        }

        public async Task<IEnumerable<Zone>> GetZonesAsync(int segmentId)
        {
           return await _context.Zones.Where(z => z.SegmentId == segmentId).ToListAsync();
        }

        public async Task<int> CalculateTotalCapacityAsync(int segmentId)
        {
            var zones = await GetZonesAsync(segmentId);
            return zones.Sum(z => z.Capacity);
        }

    }
}
