using MusicEventManagementSystem.API.Enums.TicketSales;
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

        Task<IEnumerable<Zone>> GetBySegmentIdAsync(int segmentId);
        Task<IEnumerable<Zone>> GetByPriceRangeAsync(decimal min, decimal max);
        Task<IEnumerable<Zone>> GetByPositionAsync(ZonePosition position);
        Task<IEnumerable<TicketType>> GetTicketTypesAsync(int zoneId);
    }
}
