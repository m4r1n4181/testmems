using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class PerformanceRepository : Repository<Performance>, IPerformanceRepository
    {
        public PerformanceRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Performance>> GetByEventIdAsync(int eventId)
        {
            return await _dbSet.Where(p => p.EventId == eventId).ToListAsync();
        }

        public async Task<IEnumerable<Performance>> GetByPerformerIdAsync(int performerId)
        {
            return await _dbSet.Where(p => p.PerformerId == performerId).ToListAsync();
        }

        public async Task<IEnumerable<Performance>> GetByVenueIdAsync(int venueId)
        {
            return await _dbSet.Where(p => p.VenueId == venueId).ToListAsync();
        }

        public async Task<IEnumerable<Performance>> GetByDateRangeAsync(DateTime start, DateTime end)
        {
            return await _dbSet.Where(p => p.StartTime >= start && p.EndTime <= end).ToListAsync();
        }
    }
}