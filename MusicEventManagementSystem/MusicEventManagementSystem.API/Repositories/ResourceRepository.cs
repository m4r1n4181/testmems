using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Repositories
{
    public class ResourceRepository : Repository<Resource>, IResourceRepository
    {
        public ResourceRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Resource?> GetByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(r => r.Name == name);
        }

        public async Task<IEnumerable<Resource>> GetByTypeAsync(ResourceType type)
        {
            return await _dbSet.Where(r => r.Type == type).ToListAsync();
        }

        public async Task<IEnumerable<Resource>> GetAvailableResourcesAsync()
        {
            return await _dbSet.Where(r => r.IsAvailable).ToListAsync();
        }

    }
}