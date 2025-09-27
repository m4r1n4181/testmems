using MusicEventManagementSystem.API.Models;
using MusicEventManagementSystem.API.Enums;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IIntegrationStatusRepository : IRepository<IntegrationStatus>
    {
        Task<IEnumerable<IntegrationStatus>> GetByAdIdAsync(int adId);
        Task<IEnumerable<IntegrationStatus>> GetByChannelIdAsync(int channelId);
        Task<IEnumerable<IntegrationStatus>> GetByStatusAsync(StatusIntegration status);
        Task<IEnumerable<IntegrationStatus>> GetByPublicationDateAsync(DateTime publicationDate);
        Task<IEnumerable<IntegrationStatus>> GetByErrorAsync(string error);
        Task<IEnumerable<IntegrationStatus>> GetByLastSyncedAsync(DateTime lastSynced);
    }
}