using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IMediaChannelRepository : IRepository<MediaChannel>
    {
        Task<IEnumerable<MediaChannel>> GetByPlatformTypeAsync(string platformType);
        Task<IEnumerable<MediaChannel>> GetByAPIKeyAsync(string apiKey);
        Task<IEnumerable<MediaChannel>> GetByAPIURLAsync(string apiUrl);
        Task<IEnumerable<MediaChannel>> GetByAPIVersionAsync(string apiVersion);
    }
}