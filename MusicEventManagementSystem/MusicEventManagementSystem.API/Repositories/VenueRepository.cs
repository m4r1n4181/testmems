using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class VenueRepository : Repository<Venue>, IVenueRepository
    {
        public VenueRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Venue>> GetByCityAsync(string city)
        {
            return await _context.Venues.Where(v => v.City.ToLower() == city.ToLower()).ToListAsync();
        }

        public async Task<IEnumerable<Venue>> GetByCapacityRangeAsync(int min, int max)
        {
            return await _context.Venues.Where(v => v.Capacity >= min && v.Capacity <= max).ToListAsync();
        }

        public async Task<IEnumerable<Segment>> GetSegmentsAsync(int venueId)
        {
            return await _context.Segments.Where(s => s.VenueId == venueId).ToListAsync();
        }
    }
}
