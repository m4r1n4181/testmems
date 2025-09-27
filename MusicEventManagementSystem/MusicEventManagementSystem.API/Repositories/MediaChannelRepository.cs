using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class MediaChannelRepository : Repository<MediaChannel>, IMediaChannelRepository
    {
        public MediaChannelRepository(ApplicationDbContext context) : base(context) { }

        public override async Task<IEnumerable<MediaChannel>> GetAllAsync()
        {
            return await _context.MediaChannels
                .Include(mc => mc.IntegrationStatuses)
                .ToListAsync();
        }

        public override async Task<MediaChannel?> GetByIdAsync(int id)
        {
            return await _context.MediaChannels
                .Include(mc => mc.IntegrationStatuses)
                .FirstOrDefaultAsync(m => m.MediaChannelId == id);
        }

        public async Task<IEnumerable<MediaChannel>> GetByPlatformTypeAsync(string platformType)
        {
            return await _context.MediaChannels
                .Where(m => m.PlatformType == platformType)
                .Include(mc => mc.IntegrationStatuses)
                .ToListAsync();
        }

        public async Task<IEnumerable<MediaChannel>> GetByAPIKeyAsync(string apiKey)
        {
            return await _context.MediaChannels
                .Where(m => m.APIKey == apiKey)
                .Include(mc => mc.IntegrationStatuses)
                .ToListAsync();
        }

        public async Task<IEnumerable<MediaChannel>> GetByAPIURLAsync(string apiUrl)
        {
            return await _context.MediaChannels
                .Where(m => m.APIURL == apiUrl)
                .Include(mc => mc.IntegrationStatuses)
                .ToListAsync();
        }

        public async Task<IEnumerable<MediaChannel>> GetByAPIVersionAsync(string apiVersion)
        {
            return await _context.MediaChannels
                .Where(m => m.APIVersion == apiVersion)
                .Include(mc => mc.IntegrationStatuses)
                .ToListAsync();
        }
    }
}