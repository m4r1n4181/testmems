using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class MediaWorkflowRepository : Repository<MediaWorkflow>, IMediaWorkflowRepository
    {
        public MediaWorkflowRepository(ApplicationDbContext context) : base(context) { }

        public override async Task<IEnumerable<MediaWorkflow>> GetAllAsync()
        {
            return await _context.MediaWorkflows
                .Include(mw => mw.Ads)
                .Include(mw => mw.Tasks)
                .ToListAsync();
        }

        public override async Task<MediaWorkflow?> GetByIdAsync(int id)
        {
            return await _context.MediaWorkflows
                .Include(mw => mw.Ads)
                .Include(mw => mw.Tasks)
                .FirstOrDefaultAsync(m => m.MediaWorkflowId == id);
        }

        public async Task<IEnumerable<MediaWorkflow>> GetByWorkflowDescriptionAsync(string workflowDescription)
        {
            return await _context.MediaWorkflows
                .Where(m => m.WorkflowDescription == workflowDescription)
                .Include(mw => mw.Ads)
                .Include(mw => mw.Tasks)
                .ToListAsync();
        }
    }
}