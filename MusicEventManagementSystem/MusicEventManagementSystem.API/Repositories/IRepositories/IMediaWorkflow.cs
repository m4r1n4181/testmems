using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IMediaWorkflowRepository : IRepository<MediaWorkflow>
    {
        Task<IEnumerable<MediaWorkflow>> GetByWorkflowDescriptionAsync(string workflowDescription);
    }
}