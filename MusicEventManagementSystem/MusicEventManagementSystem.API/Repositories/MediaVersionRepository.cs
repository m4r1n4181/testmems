using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class MediaVersionRepository : Repository<MediaVersion>, IMediaVersionRepository
    {
        public MediaVersionRepository(ApplicationDbContext context) : base(context) { }

        public override async Task<IEnumerable<MediaVersion>> GetAllAsync()
        {
            return await _context.MediaVersions
                .Include(mv => mv.Ad)
                .ToListAsync();
        }

        public override async Task<MediaVersion?> GetByIdAsync(int id)
        {
            return await _context.MediaVersions
                .Include(mv => mv.Ad)
                .FirstOrDefaultAsync(m => m.MediaVersionId == id);
        }

        public async Task<IEnumerable<MediaVersion>> GetByVersionFileNameAsync(string versionFileName)
        {
            return await _context.MediaVersions
                .Where(m => m.VersionFileName == versionFileName)
                .Include(mv => mv.Ad)
                .ToListAsync();
        }

        public async Task<IEnumerable<MediaVersion>> GetByFileTypeAsync(string fileType)
        {
            return await _context.MediaVersions
                .Where(m => m.FileType == fileType)
                .Include(mv => mv.Ad)
                .ToListAsync();
        }

        public async Task<IEnumerable<MediaVersion>> GetByFileURLAsync(string fileURL)
        {
            return await _context.MediaVersions
                .Where(m => m.FileURL == fileURL)
                .Include(mv => mv.Ad)
                .ToListAsync();
        }

        public async Task<IEnumerable<MediaVersion>> GetByIsFinalVersionAsync(bool isFinalVersion)
        {
            return await _context.MediaVersions
                .Where(m => m.IsFinalVersion == isFinalVersion)
                .Include(mv => mv.Ad)
                .ToListAsync();
        }

        public async Task<IEnumerable<MediaVersion>> GetByAdIdAsync(int adId)
        {
            return await _context.MediaVersions
                .Where(m => m.AdId == adId)
                .Include(mv => mv.Ad)
                .ToListAsync();
        }
    }
}