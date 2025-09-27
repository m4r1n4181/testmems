using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class MediaTaskRepository : Repository<MediaTask>, IMediaTaskRepository
    {
        public MediaTaskRepository(ApplicationDbContext context) : base(context) { }

        public override async Task<IEnumerable<MediaTask>> GetAllAsync()
        {
            return await _context.MediaTasks
                .Include(mt => mt.MediaWorkflow)
                .ToListAsync();
        }

        public override async Task<MediaTask?> GetByIdAsync(int id)
        {
            return await _context.MediaTasks
                .Include(mt => mt.MediaWorkflow)
                .FirstOrDefaultAsync(m => m.MediaTaskId == id);
        }

        public async Task<IEnumerable<MediaTask>> GetByTaskNameAsync(string taskName)
        {
            return await _context.MediaTasks
                .Where(m => m.TaskName == taskName)
                .Include(mt => mt.MediaWorkflow)
                .ToListAsync();
        }

        public async Task<IEnumerable<MediaTask>> GetByOrderAsync(int order)
        {
            return await _context.MediaTasks
                .Where(m => m.Order == order)
                .Include(mt => mt.MediaWorkflow)
                .ToListAsync();
        }

        public async Task<IEnumerable<MediaTask>> GetByTaskStatusAsync(string taskStatus)
        {
            return await _context.MediaTasks
                .Where(m => m.TaskStatus == taskStatus)
                .Include(mt => mt.MediaWorkflow)
                .ToListAsync();
        }

        public async Task<IEnumerable<MediaTask>> GetByWorkflowIdAsync(int workflowId)
        {
            return await _context.MediaTasks
                .Where(m => m.WorkflowId == workflowId)
                .Include(mt => mt.MediaWorkflow)
                .ToListAsync();
        }
    }
}