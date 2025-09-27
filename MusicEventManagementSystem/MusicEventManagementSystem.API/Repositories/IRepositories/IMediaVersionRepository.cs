using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IMediaVersionRepository : IRepository<MediaVersion>
    {
        Task<IEnumerable<MediaVersion>> GetByVersionFileNameAsync(string versionFileName);
        Task<IEnumerable<MediaVersion>> GetByFileTypeAsync(string fileType);
        Task<IEnumerable<MediaVersion>> GetByFileURLAsync(string fileURL);
        Task<IEnumerable<MediaVersion>> GetByIsFinalVersionAsync(bool isFinalVersion);
        Task<IEnumerable<MediaVersion>> GetByAdIdAsync(int adId);
    }
}