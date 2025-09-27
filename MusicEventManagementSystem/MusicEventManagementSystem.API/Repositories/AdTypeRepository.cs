using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class AdTypeRepository : Repository<AdType>, IAdTypeRepository
    {
        public AdTypeRepository(ApplicationDbContext context) : base(context) { }

        public override async Task<IEnumerable<AdType>> GetAllAsync()
        {
            return await _context.AdTypes
                .Include(a => a.Ads) // If AdType has ICollection<Ad> Ads
                .ToListAsync();
        }

        public override async Task<AdType?> GetByIdAsync(int id)
        {
            return await _context.AdTypes
                .Include(a => a.Ads)
                .FirstOrDefaultAsync(a => a.AdTypeId == id);
        }

        public async Task<IEnumerable<AdType>> GetByTypeNameAsync(string typeName)
        {
            return await _context.AdTypes
                .Where(a => a.TypeName == typeName)
                .Include(a => a.Ads)
                .ToListAsync();
        }

        public async Task<IEnumerable<AdType>> GetByTypeDescriptionAsync(string typeDescription)
        {
            return await _context.AdTypes
                .Where(a => a.TypeDescription == typeDescription)
                .Include(a => a.Ads)
                .ToListAsync();
        }

        public async Task<IEnumerable<AdType>> GetByDimensionsAsync(string dimensions)
        {
            return await _context.AdTypes
                .Where(a => a.Dimensions == dimensions)
                .Include(a => a.Ads)
                .ToListAsync();
        }

        public async Task<IEnumerable<AdType>> GetByDurationAsync(int duration)
        {
            return await _context.AdTypes
                .Where(a => a.Duration == duration)
                .Include(a => a.Ads)
                .ToListAsync();
        }

        public async Task<IEnumerable<AdType>> GetByFileFormatAsync(string fileFormat)
        {
            return await _context.AdTypes
                .Where(a => a.FileFormat == fileFormat)
                .Include(a => a.Ads)
                .ToListAsync();
        }
    }
}