using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class PerformanceResourceRepository : Repository<PerformanceResource>, IPerformanceResourceRepository
    {
        public PerformanceResourceRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<PerformanceResource>> GetByPerformanceIdAsync(int performanceId)
        {
            return await _dbSet.Where(pr => pr.PerformanceId == performanceId).ToListAsync();
        }

        public async Task<IEnumerable<PerformanceResource>> GetByResourceIdAsync(int resourceId)
        {
            return await _dbSet.Where(pr => pr.ResourceId == resourceId).ToListAsync();
        }
    }
}