using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class InfrastructureRepository : Repository<Infrastructure>, IInfrastructureRepository
    {
        public InfrastructureRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Infrastructure>> GetBySizeAsync(decimal size)
        {
            return await _dbSet.Where(i => i.Size == size).ToListAsync();
        }

    }
}