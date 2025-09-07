using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IPerformanceResourceRepository : IRepository<PerformanceResource>
    {
        Task<IEnumerable<PerformanceResource>> GetByPerformanceIdAsync(int performanceId);
        Task<IEnumerable<PerformanceResource>> GetByResourceIdAsync(int resourceId);
    }
}