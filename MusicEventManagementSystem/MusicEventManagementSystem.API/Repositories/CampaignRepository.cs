﻿using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class CampaignRepository : Repository<Campaign>, ICampaignRepository
    {
        public CampaignRepository(ApplicationDbContext context) : base(context) { }

        public override async Task<IEnumerable<Campaign>> GetAllAsync()
        {
            return await _context.Campaigns
                .Include(c => c.Ads) 
                .ToListAsync();
        }

        public override async Task<Campaign?> GetByIdAsync(int id)
        {
            return await _context.Campaigns
                .Include(c => c.Ads)
                .FirstOrDefaultAsync(c => c.CampaignId == id);
        }

        public async Task<IEnumerable<Campaign>> GetByEventIdAsync(int eventId)
        {
            return await _context.Campaigns
                .Where(c => c.EventId == eventId)
                .Include(c => c.Ads)
                .ToListAsync();
        }

        public async Task<IEnumerable<Campaign>> GetByNameAsync(string name)
        {
            return await _context.Campaigns
                .Where(c => c.Name == name)
                .Include(c => c.Ads)
                .ToListAsync();
        }

        public async Task<IEnumerable<Campaign>> GetByStartDateAsync(DateTime startDate)
        {
            return await _context.Campaigns
                .Where(c => c.StartDate == startDate)
                .Include(c => c.Ads)
                .ToListAsync();
        }

        public async Task<IEnumerable<Campaign>> GetByEndDateAsync(DateTime endDate)
        {
            return await _context.Campaigns
                .Where(c => c.EndDate == endDate)
                .Include(c => c.Ads)
                .ToListAsync();
        }

        public async Task<IEnumerable<Campaign>> GetByTotalBudgetAsync(decimal totalBudget)
        {
            return await _context.Campaigns
                .Where(c => c.TotalBudget == totalBudget)
                .Include(c => c.Ads)
                .ToListAsync();
        }
    }
}