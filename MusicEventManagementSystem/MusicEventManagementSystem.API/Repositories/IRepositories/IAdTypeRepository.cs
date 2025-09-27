using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Repositories.IRepositories
{
    public interface IAdTypeRepository : IRepository<AdType>
    {
        Task<IEnumerable<AdType>> GetByTypeNameAsync(string typeName);
        Task<IEnumerable<AdType>> GetByTypeDescriptionAsync(string typeDescription);
        Task<IEnumerable<AdType>> GetByDimensionsAsync(string dimensions);
        Task<IEnumerable<AdType>> GetByDurationAsync(int duration);
        Task<IEnumerable<AdType>> GetByFileFormatAsync(string fileFormat);
    }
}