using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface ICommunicationService
    {
        Task<IEnumerable<Communication>> GetAllCommunicationsAsync();
        Task<Communication?> GetCommunicationByIdAsync(int id);
        Task<Communication> CreateCommunicationAsync(Communication communication);
        Task<Communication?> UpdateCommunicationAsync(int id, Communication communication);
        Task<bool> DeleteCommunicationAsync(int id);
    }
}
