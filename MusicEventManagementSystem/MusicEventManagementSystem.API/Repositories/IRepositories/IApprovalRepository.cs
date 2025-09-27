using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IApprovalRepository : IRepository<Approval>
    {
        Task<IEnumerable<Approval>> GetByApprovalStatusAsync(string approvalStatus);
        Task<IEnumerable<Approval>> GetByCommentAsync(string comment);
        Task<IEnumerable<Approval>> GetByApprovalDateAsync(DateTime approvalDate);
        Task<IEnumerable<Approval>> GetByMediaTaskIdAsync(int mediaTaskId);
    }
}