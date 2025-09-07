using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IIntegrationStatusService
    {
        Task<IEnumerable<IntegrationStatus>> GetAllIntegrationStatusesAsync();
        Task<IntegrationStatus?> GetIntegrationStatusByIdAsync(int id);
        Task<IntegrationStatus> CreateIntegrationStatusAsync(IntegrationStatus integrationStatus);
        Task<IntegrationStatus?> UpdateIntegrationStatusAsync(int id, IntegrationStatus integrationStatus);
        Task<bool> DeleteIntegrationStatusAsync(int id);
    }
}