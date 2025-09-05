using MusicEventManagementSystem.API.Models;

namespace MusicEventManagementSystem.API.Services.IService
{
    public interface IZoneService
    {
        Task<IEnumerable<Zone>> GetAllZonesAsync();
        Task<Zone?> GetZoneByIdAsync(int id);
        Task<Zone> CreateZoneAsync(Zone zone);
        Task<Zone?> UpdateZoneAsync(int id, Zone zone);
        Task<bool> DeleteZoneAsync(int id);
    }
}
