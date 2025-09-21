using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Repositories
{
    public class WorkTaskRepository : Repository<WorkTask>, IWorkTaskRepository
    {
        public WorkTaskRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<WorkTask>> GetByPerformanceIdAsync(int performanceId)
        {
            return await _dbSet.Where(wt => wt.PerformanceId == performanceId).ToListAsync();
        }

        public async Task<IEnumerable<WorkTask>> GetByStatusAsync(WorkTaskStatus status)
        {
            return await _dbSet.Where(wt => wt.Status == status).ToListAsync();
        }
    }
}