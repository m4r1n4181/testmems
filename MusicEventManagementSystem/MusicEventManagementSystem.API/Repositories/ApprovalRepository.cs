using Microsoft.EntityFrameworkCore;
using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Repositories.IRepositories;
using MusicEventManagementSystem.Data;

namespace MusicEventManagementSystem.API.Repositories
{
    public class ApprovalRepository : Repository<Approval>, IApprovalRepository
    {
        public ApprovalRepository(ApplicationDbContext context) : base(context) { }

        public override async Task<IEnumerable<Approval>> GetAllAsync()
        {
            return await _context.Approvals
                .Include(a => a.MediaTask)
                .ToListAsync();
        }

        public override async Task<Approval?> GetByIdAsync(int id)
        {
            return await _context.Approvals
                .Include(a => a.MediaTask)
                .FirstOrDefaultAsync(a => a.ApprovalId == id);
        }

        public async Task<IEnumerable<Approval>> GetByApprovalStatusAsync(string approvalStatus)
        {
            return await _context.Approvals
                .Where(a => a.ApprovalStatus == approvalStatus)
                .Include(a => a.MediaTask)
                .ToListAsync();
        }

        public async Task<IEnumerable<Approval>> GetByCommentAsync(string comment)
        {
            return await _context.Approvals
                .Where(a => a.Comment == comment)
                .Include(a => a.MediaTask)
                .ToListAsync();
        }

        public async Task<IEnumerable<Approval>> GetByApprovalDateAsync(DateTime approvalDate)
        {
            return await _context.Approvals
                .Where(a => a.ApprovalDate == approvalDate)
                .Include(a => a.MediaTask)
                .ToListAsync();
        }

        public async Task<IEnumerable<Approval>> GetByMediaTaskIdAsync(int mediaTaskId)
        {
            return await _context.Approvals
                .Where(a => a.MediaTaskId == mediaTaskId)
                .Include(a => a.MediaTask)
                .ToListAsync();
        }
        public async Task<IEnumerable<Approval>> GetByManagerIdAsync(string managerId)
        {
            return await _context.Approvals
                .Include(a => a.MediaTask)
                .ThenInclude(mt => mt.Ad)
                .Where(a => a.MediaTask.Ad.CreatedById == managerId)
                .ToListAsync();
        }
    }
}