using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class PerformerRepository : Repository<Performer>, IPerformerRepository
    {
        public PerformerRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Performer?> GetByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(p => p.Name == name);
        }

        public async Task<IEnumerable<Performer>> GetByGenreAsync(string genre)
        {
            return await _dbSet.Where(p => p.Genre.Contains(genre)).ToListAsync();
        }
    }
}