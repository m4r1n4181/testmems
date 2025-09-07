using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IPerformanceResourceService
    {
        Task<IEnumerable<PerformanceResource>> GetAllPerformanceResourcesAsync();
        Task<PerformanceResource?> GetPerformanceResourceByIdAsync(int id);
        Task<PerformanceResource> CreatePerformanceResourceAsync(PerformanceResource performanceResource);
        Task<PerformanceResource?> UpdatePerformanceResourceAsync(int id, PerformanceResource performanceResource);
        Task<bool> DeletePerformanceResourceAsync(int id);
    }
}