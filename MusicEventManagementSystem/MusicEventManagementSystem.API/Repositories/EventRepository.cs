using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Repositories
{
    public class EventRepository : Repository<Event>, IEventRepository
    {
        public EventRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Event?> GetByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(e => e.Name == name);
        }

        public async Task<IEnumerable<Event>> GetByStatusAsync(EventStatus status)
        {
            return await _dbSet.Where(e => e.Status == status).ToListAsync();
        }

        public async Task<IEnumerable<Event>> GetByDateRangeAsync(DateTime start, DateTime end)
        {
            return await _dbSet.Where(e => e.Interval >= start && e.Interval <= end).ToListAsync();
        }

        public async Task<IEnumerable<Event>> GetByCreatedByIdAsync(Guid createdById)
        {
            return await _dbSet.Where(e => e.CreatedById == createdById).ToListAsync();
        }


    }
}