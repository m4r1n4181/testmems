using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Enums;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class IntegrationStatusRepository : Repository<IntegrationStatus>, IIntegrationStatusRepository
    {
        public IntegrationStatusRepository(ApplicationDbContext context) : base(context) { }

        public override async Task<IEnumerable<IntegrationStatus>> GetAllAsync()
        {
            return await _context.IntegrationStatuses
                .Include(i => i.Ad)
                .Include(i => i.MediaChannel)
                .ToListAsync();
        }

        public override async Task<IntegrationStatus?> GetByIdAsync(int id)
        {
            return await _context.IntegrationStatuses
                .Include(i => i.Ad)
                .Include(i => i.MediaChannel)
                .FirstOrDefaultAsync(i => i.IntegrationStatusId == id);
        }

        public async Task<IEnumerable<IntegrationStatus>> GetByAdIdAsync(int adId)
        {
            return await _context.IntegrationStatuses
                .Where(i => i.AdId == adId)
                .Include(i => i.Ad)
                .Include(i => i.MediaChannel)
                .ToListAsync();
        }

        public async Task<IEnumerable<IntegrationStatus>> GetByChannelIdAsync(int channelId)
        {
            return await _context.IntegrationStatuses
                .Where(i => i.ChannelId == channelId)
                .Include(i => i.Ad)
                .Include(i => i.MediaChannel)
                .ToListAsync();
        }

        public async Task<IEnumerable<IntegrationStatus>> GetByStatusAsync(StatusIntegration status)
        {
            return await _context.IntegrationStatuses
                .Where(i => i.Status == status)
                .Include(i => i.Ad)
                .Include(i => i.MediaChannel)
                .ToListAsync();
        }

        public async Task<IEnumerable<IntegrationStatus>> GetByPublicationDateAsync(DateTime publicationDate)
        {
            return await _context.IntegrationStatuses
                .Where(i => i.PublicationDate == publicationDate)
                .Include(i => i.Ad)
                .Include(i => i.MediaChannel)
                .ToListAsync();
        }

        public async Task<IEnumerable<IntegrationStatus>> GetByErrorAsync(string error)
        {
            return await _context.IntegrationStatuses
                .Where(i => i.Error == error)
                .Include(i => i.Ad)
                .Include(i => i.MediaChannel)
                .ToListAsync();
        }

        public async Task<IEnumerable<IntegrationStatus>> GetByLastSyncedAsync(DateTime lastSynced)
        {
            return await _context.IntegrationStatuses
                .Where(i => i.LastSynced == lastSynced)
                .Include(i => i.Ad)
                .Include(i => i.MediaChannel)
                .ToListAsync();
        }
    }
}