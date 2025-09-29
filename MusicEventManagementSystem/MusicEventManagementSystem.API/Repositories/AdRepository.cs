using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Repositories
{
    public class AdRepository : Repository<Ad>, IAdRepository
    {
        public AdRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async override Task<IEnumerable<Ad>> GetAllAsync()
        {
            return await _context.Ads
                .Include(a => a.MediaWorkflow)
                .Include(a => a.Campaign)
                .Include(a => a.AdType)
                .Include(a => a.Versions)
                .Include(a => a.IntegrationStatuses)
                .Include(a => a.CreatedBy)
                .ToListAsync();
        }

        public async override Task<Ad?> GetByIdAsync(int id)
        {
            return await _context.Ads
                .Include(a => a.MediaWorkflow)
                .Include(a => a.Campaign)
                .Include(a => a.AdType)
                .Include(a => a.Versions)
                .Include(a => a.IntegrationStatuses)
                .Include(a => a.CreatedBy)
                .FirstOrDefaultAsync(a => a.AdId == id);
        }

        public async Task<IEnumerable<Ad>> GetByDeadlineAsync(DateTime deadline)
        {
            return await _context.Ads
                .Where(a => a.Deadline == deadline)
                .Include(a => a.MediaWorkflow)
                .Include(a => a.Campaign)
                .Include(a => a.AdType)
                .Include(a => a.Versions)  
                .Include(a => a.IntegrationStatuses)
                .Include(a => a.CreatedBy)
                .ToListAsync();
        }

        public async Task<IEnumerable<Ad>> GetByTitleAsync(string title)
        {
            return await _context.Ads
                .Where(a => a.Title == title)
                .Include(a => a.MediaWorkflow)
                .Include(a => a.Campaign)
                .Include(a => a.AdType)
                .Include(a => a.Versions)
                .Include(a => a.IntegrationStatuses)
                .Include(a => a.CreatedBy)
                .ToListAsync();
        }

        public async Task<IEnumerable<Ad>> GetByCreationDateAsync(DateTime creationDate)
        {
            return await _context.Ads
                .Where(a => a.CreationDate == creationDate)
                .Include(a => a.MediaWorkflow)
                .Include(a => a.Campaign)
                .Include(a => a.AdType)
                .Include(a => a.Versions)
                .Include(a => a.IntegrationStatuses)
                .Include(a => a.CreatedBy)
                .ToListAsync();
        }

        public async Task<IEnumerable<Ad>> GetByCurrentPhaseAsync(AdStatus currentPhase)
        {
            return await _context.Ads
                .Where(a => a.CurrentPhase == currentPhase)
                .Include(a => a.MediaWorkflow)
                .Include(a => a.Campaign)
                .Include(a => a.AdType)
                .Include(a => a.CreatedBy)
                .ToListAsync();
        }

        public async Task<IEnumerable<Ad>> GetByPublicationDateAsync(DateTime publicationDate)
        {
            return await _context.Ads
                .Where(a => a.PublicationDate == publicationDate)
                .Include(a => a.MediaWorkflow)
                .Include(a => a.Campaign)
                .Include(a => a.AdType)
                .Include(a => a.Versions)
                .Include(a => a.IntegrationStatuses)
                .Include(a => a.CreatedBy)
                .ToListAsync();
        }

        public async Task<IEnumerable<Ad>> GetByMediaWorkflowIdAsync(int mediaWorkflowId)
        {
            return await _context.Ads
                .Where(a => a.MediaWorkflowId == mediaWorkflowId)
                .Include(a => a.MediaWorkflow)
                .Include(a => a.Campaign)
                .Include(a => a.AdType)
                .Include(a => a.Versions)
                .Include(a => a.IntegrationStatuses)
                .Include(a => a.CreatedBy)
                .ToListAsync();
        }

        public async Task<IEnumerable<Ad>> GetByCampaignIdAsync(int campaignId)
        {
            return await _context.Ads
                .Where(a => a.CampaignId == campaignId)
                .Include(a => a.MediaWorkflow)
                .Include(a => a.Campaign)
                .Include(a => a.AdType)
                .Include(a => a.Versions)
                .Include(a => a.IntegrationStatuses)
                .Include(a => a.CreatedBy)
                .ToListAsync();
        }

        public async Task<IEnumerable<Ad>> GetByAdTypeIdAsync(int adTypeId)
        {
            return await _context.Ads
                .Where(a => a.AdTypeId == adTypeId)
                .Include(a => a.MediaWorkflow)
                .Include(a => a.Campaign)
                .Include(a => a.AdType)
                .Include(a => a.Versions)
                .Include(a => a.IntegrationStatuses)
                .Include(a => a.CreatedBy)
                .ToListAsync();
        }
    }
}