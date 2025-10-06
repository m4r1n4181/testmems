using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IMediaTaskRepository : IRepository<MediaTask>
    {
        Task<IEnumerable<MediaTask>> GetByTaskNameAsync(string taskName);
        Task<IEnumerable<MediaTask>> GetByOrderAsync(int order);
        Task<IEnumerable<MediaTask>> GetByTaskStatusAsync(MediaTaskStatus taskStatus);
        Task<IEnumerable<MediaTask>> GetByWorkflowIdAsync(int workflowId);
        Task<IEnumerable<MediaTask>> GetTasksByManager(string managerId);
    }
}