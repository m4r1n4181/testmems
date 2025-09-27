using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IMediaTaskRepository : IRepository<MediaTask>
    {
        Task<IEnumerable<MediaTask>> GetByTaskNameAsync(string taskName);
        Task<IEnumerable<MediaTask>> GetByOrderAsync(int order);
        Task<IEnumerable<MediaTask>> GetByTaskStatusAsync(string taskStatus);
        Task<IEnumerable<MediaTask>> GetByWorkflowIdAsync(int workflowId);
    }
}