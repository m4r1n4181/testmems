using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.Enums;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IWorkTaskRepository : IRepository<WorkTask>
    {
        Task<IEnumerable<WorkTask>> GetByPerformanceIdAsync(int performanceId);
        Task<IEnumerable<WorkTask>> GetByStatusAsync(WorkTaskStatus status);
    }
}